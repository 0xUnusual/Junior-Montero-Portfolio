/**
 * Antigravity Interactive Background Animation
 * Faithful adaptation of https://antigravity.google/ background simulation
 * Powered by Three.js & GLSL Simplex Noise Shaders
 */

(function () {
    // ----------------------------------------------------
    // GLSL Simplex Noise 2D & 3D (Ashima Arts)
    // ----------------------------------------------------
    const simplexNoiseGLSL = `
        vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
        vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
        float permute(float x) { return floor(mod(((x * 34.0) + 1.0) * x, 289.0)); }

        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        float taylorInvSqrt(float r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
            vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
            m = m * m;
            m = m * m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
            vec3 g;
            g.x  = a0.x * x0.x + h.x * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        float snoise(vec3 v) {
            const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

            vec3 i  = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);

            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);

            vec3 x1 = x0 - i1 + 1.0 * C.xxx;
            vec3 x2 = x0 - i2 + 2.0 * C.xxx;
            vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

            i = mod(i, 289.0);
            vec4 p = permute(permute(permute(
                        i.z + vec4(0.0, i1.z, i2.z, 1.0))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

            float n_ = 0.142857142857;
            vec3  ns = n_ * D.wyz - D.xzx;

            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);

            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);

            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);

            vec4 s0 = floor(b0) * 2.0 + 1.0;
            vec4 s1 = floor(b1) * 2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));

            vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);

            vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;

            vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
        }
    `;

    // ----------------------------------------------------
    // Vertex & Fragment Shaders (Antigravity MainParticles)
    // ----------------------------------------------------
    const vertexShader = `
        precision highp float;

        attribute vec4 seeds;
        attribute vec2 refPos;

        uniform vec2 uRingPos;
        uniform float uRingRadius;
        uniform float uRingWidth;
        uniform float uRingWidth2;
        uniform float uRingDisplacement;
        uniform float uTime;
        uniform float uParticleScale;
        uniform float uPixelRatio;

        varying vec4 vSeeds;
        varying vec2 vLocalPos;
        varying vec2 vScreenPos;
        varying float vScale;
        varying float vVelocity;

        ${simplexNoiseGLSL}

        void main() {
            vSeeds = seeds;

            float time = uTime * 0.45;
            vec2 currentPos = refPos;

            // Distance to interactive ring/mouse center in world space
            float dist = distance(currentPos.xy, uRingPos);
            float noise0 = snoise(vec3(currentPos.xy * 0.8 + vec2(18.4924, 72.9744), time * 0.5));
            float dist1 = distance(currentPos.xy + (noise0 * 0.025), uRingPos);

            // Antigravity dual-band smoothstep ring displacement
            float t = smoothstep(uRingRadius - (uRingWidth * 2.0), uRingRadius, dist) - smoothstep(uRingRadius, uRingRadius + uRingWidth, dist1);
            float t2 = smoothstep(uRingRadius - (uRingWidth2 * 2.0), uRingRadius, dist) - smoothstep(uRingRadius, uRingRadius + uRingWidth2, dist1);
            float t3 = smoothstep(uRingRadius + uRingWidth2, uRingRadius, dist);

            t = pow(max(t, 0.0), 2.0);
            t2 = pow(max(t2, 0.0), 3.0);

            // Multi-scale noise fields for fluid organic drift
            float noise1 = snoise(vec3(currentPos.xy * 2.0 + vec2(88.494, 32.4397), time * 0.35));
            float noise2 = snoise(vec3(currentPos.xy * 2.0 + vec2(50.904, 120.947), time * 0.35));

            float noise3 = snoise(vec3(currentPos.xy * 8.0 + vec2(18.4924, 72.9744), time * 0.5));
            float noise4 = snoise(vec3(currentPos.xy * 8.0 + vec2(50.904, 120.947), time * 0.5));

            vec2 disp = vec2(noise1, noise2) * 0.04;
            disp += vec2(noise3, noise4) * 0.01;

            // Sinusoidal wave ripple
            disp.x += sin((currentPos.x * 10.0) + (time * 3.5)) * 0.02 * clamp(dist, 0.0, 1.0);
            disp.y += cos((currentPos.y * 10.0) + (time * 3.0)) * 0.02 * clamp(dist, 0.0, 1.0);

            // Gravitational repulsion / displacement from ring
            vec2 pos = currentPos + disp;
            pos -= (uRingPos - (currentPos + disp)) * pow(max(t2, 0.0), 0.75) * uRingDisplacement;

            // Baseline organic scale + dynamic magnification on the ring
            float nS = snoise(vec3(currentPos.xy * 1.5 + vec2(18.4924, 72.9744), time * 0.4));
            float baseScale = 0.6 + pow((nS + 1.2) * 0.45, 1.8) * 0.4;

            float ringBoost = t * 1.8 + t2 * 3.6 + t3 * 0.5;
            vScale = clamp(baseScale + ringBoost, 0.4, 4.5);
            vVelocity = vScale * 0.45;

            vLocalPos = pos;

            vec4 viewSpace = modelViewMatrix * vec4(vec3(pos, 0.0), 1.0);
            gl_Position = projectionMatrix * viewSpace;
            vScreenPos = gl_Position.xy;

            // Small, delicate particles as requested:
            // Resting particles: ~7-9px. Ring particles: ~13-18px.
            float pSize = (6.0 + vScale * 4.5) * (uPixelRatio * 0.5) * uParticleScale;
            gl_PointSize = clamp(pSize, 5.0, 20.0);
        }
    `;

    const fragmentShader = `
        precision highp float;

        varying vec4 vSeeds;
        varying vec2 vScreenPos;
        varying vec2 vLocalPos;
        varying float vScale;
        varying float vVelocity;

        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uColor4;
        uniform vec2 uRingPos;
        uniform vec2 uRez;
        uniform float uAlpha;
        uniform float uTime;
        uniform int uColorScheme;

        ${simplexNoiseGLSL}

        #define PI 3.14159265358979323846

        // Signed Distance Function for rounded rectangle capsule
        float sdRoundBox(in vec2 p, in vec2 b, in vec4 r) {
            r.xy = (p.x > 0.0) ? r.xy : r.zw;
            r.x  = (p.y > 0.0) ? r.x  : r.y;
            vec2 q = abs(p) - b + r.x;
            return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;
        }

        // Rotate 2D UV coordinates
        vec2 rotate(vec2 v, float a) {
            float s = sin(a);
            float c = cos(a);
            return mat2(c, s, -s, c) * v;
        }

        void main() {
            // Noise perturbation for angle and chromatic distribution
            float noiseAngle = snoise(vec3(vLocalPos * 3.0 + vec2(18.4924, 72.9744), uTime * 0.8));
            float noiseColor = snoise(vec3(vLocalPos * 1.2 + vec2(74.664, 91.556), uTime * 0.35));
            noiseColor = clamp((noiseColor + 1.0) * 0.5, 0.0, 1.0);

            // Compute radial angle from current particle to ring focal center
            float angle = atan(vLocalPos.y - uRingPos.y, vLocalPos.x - uRingPos.x);

            vec2 uv = gl_PointCoord.xy - vec2(0.5);
            uv.y *= -1.0;
            // Align the capsule radially pointing toward/away from the ring
            uv = rotate(uv, -angle + (noiseAngle * 0.45));

            // 4-stop Google color ramp interpolation
            vec3 col;
            if (noiseColor < 0.33) {
                col = mix(uColor1, uColor2, noiseColor / 0.33);
            } else if (noiseColor < 0.66) {
                col = mix(uColor2, uColor3, (noiseColor - 0.33) / 0.33);
            } else {
                col = mix(uColor3, uColor4, (noiseColor - 0.66) / 0.34);
            }

            // Render pill/capsule shape with signed distance field:
            // half-width: 0.40, half-height: 0.16, radius: 0.16
            float rounded = sdRoundBox(uv, vec2(0.40, 0.16), vec4(0.16));
            rounded = smoothstep(0.04, -0.04, rounded);

            // Alpha opacity: resting particles visible at 0.5 - 0.75, ring at 0.95
            float a = uAlpha * rounded * clamp(vScale * 0.35 + 0.4, 0.4, 0.98);
            if (a < 0.02) {
                discard;
            }

            vec3 color = clamp(col, 0.0, 1.0);
            if (uColorScheme == 1) {
                // Light mode: high contrast, punchy Google primary colors
                color = mix(color, color * 0.88, clamp(vVelocity * 0.3, 0.0, 0.3));
            } else {
                // Dark mode: glowing luminous neon
                color = mix(color, color * 1.35, clamp(vVelocity * 0.5, 0.0, 0.7));
            }

            gl_FragColor = vec4(color, a);
        }
    `;

    // ----------------------------------------------------
    // Antigravity Background Controller Class
    // ----------------------------------------------------
    class AntigravityBackground {
        constructor(container) {
            this.container = container || document.getElementById('antigravity-bg');
            if (!this.container) return;

            this.isDark = !document.documentElement.classList.contains('light-mode');
            this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

            // Antigravity official physics constants tuned for world units
            this.ringRadiusBase = 0.48;
            this.ringWidth = 0.22;
            this.ringWidth2 = 0.08;
            this.ringDisplacement = 0.35;
            this.particlesScale = 1.0;
            this.density = 100; // Exactly 100 subtle, small particles for a clean, non-saturated look

            this.clock = new THREE.Clock();
            this.time = 0;
            this.mouse = new THREE.Vector2(0, 0);
            this.cursorPos = new THREE.Vector2(0, 0);
            this.ringPos = new THREE.Vector2(0, 0);
            this.isMouseOver = false;

            this.initThree();
            this.initParticles();
            this.initEvents();
            this.animate();
        }

        getThemeColors() {
            if (this.isDark) {
                return {
                    color1: new THREE.Color('#7189ff'), // Periwinkle Blue
                    color2: new THREE.Color('#00ffcc'), // Neon Mint / Cyan Accent
                    color3: new THREE.Color('#3074f9'), // Electric Blue
                    color4: new THREE.Color('#ff6188'), // Neon Coral
                    colorScheme: 0
                };
            } else {
                return {
                    color1: new THREE.Color('#2c64ed'), // Google Blue
                    color2: new THREE.Color('#ea4335'), // Google Red
                    color3: new THREE.Color('#fbbc04'), // Google Yellow
                    color4: new THREE.Color('#34a853'), // Google Green
                    colorScheme: 1
                };
            }
        }

        initThree() {
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 1000);
            this.camera.position.z = 3.1;

            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                stencil: false,
                depth: false
            });

            this.renderer.setSize(this.width, this.height);
            this.renderer.setPixelRatio(this.pixelRatio);
            this.renderer.setClearColor(0x000000, 0);

            this.container.innerHTML = '';
            this.canvas = this.renderer.domElement;
            this.container.appendChild(this.canvas);

            // Raycast plane for accurate screen-to-world mouse coordinates
            this.raycaster = new THREE.Raycaster();
            this.raycastPlane = new THREE.Mesh(
                new THREE.PlaneGeometry(25, 25),
                new THREE.MeshBasicMaterial({ visible: false })
            );
            this.scene.add(this.raycastPlane);
        }

        initParticles() {
            if (this.pointsMesh) {
                this.scene.remove(this.pointsMesh);
                this.pointsMesh.geometry.dispose();
            }

            const count = this.density;
            const positions = new Float32Array(count * 3);
            const refPositions = new Float32Array(count * 2);
            const seeds = new Float32Array(count * 4);

            // Visible camera frustum dimensions at z = 0
            const vFOV = (this.camera.fov * Math.PI) / 180;
            const visibleHeight = 2 * Math.tan(vFOV / 2) * this.camera.position.z;
            const visibleWidth = visibleHeight * (this.width / this.height);

            // Extend slightly past edges so the field feels borderless
            const boundX = (visibleWidth / 2) * 1.25;
            const boundY = (visibleHeight / 2) * 1.25;

            const aspect = this.width / this.height;
            const cols = Math.floor(Math.sqrt(count * aspect));
            const rows = Math.ceil(count / cols);

            for (let i = 0; i < count; i++) {
                const c = i % cols;
                const r = Math.floor(i / cols);

                // Grid cell position + organic random jitter
                const jitterX = (Math.random() - 0.5) * 0.95;
                const jitterY = (Math.random() - 0.5) * 0.95;

                const u = (c + 0.5 + jitterX) / cols;
                const v = (r + 0.5 + jitterY) / rows;

                const x = (u - 0.5) * 2 * boundX;
                const y = (v - 0.5) * 2 * boundY;

                positions[i * 3 + 0] = x;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = 0;

                refPositions[i * 2 + 0] = x;
                refPositions[i * 2 + 1] = y;

                seeds[i * 4 + 0] = Math.random();
                seeds[i * 4 + 1] = Math.random();
                seeds[i * 4 + 2] = Math.random();
                seeds[i * 4 + 3] = Math.random();
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('refPos', new THREE.BufferAttribute(refPositions, 2));
            geometry.setAttribute('seeds', new THREE.BufferAttribute(seeds, 4));

            const themeColors = this.getThemeColors();

            this.particleScale = (this.width / this.pixelRatio / 1200) * this.particlesScale;

            this.material = new THREE.ShaderMaterial({
                uniforms: {
                    uRingPos: { value: new THREE.Vector2(0, 0) },
                    uRingRadius: { value: this.ringRadiusBase },
                    uRingWidth: { value: this.ringWidth },
                    uRingWidth2: { value: this.ringWidth2 },
                    uRingDisplacement: { value: this.ringDisplacement },
                    uTime: { value: 0 },
                    uParticleScale: { value: this.particleScale },
                    uPixelRatio: { value: this.pixelRatio },
                    uAlpha: { value: 1.0 },
                    uColor1: { value: themeColors.color1 },
                    uColor2: { value: themeColors.color2 },
                    uColor3: { value: themeColors.color3 },
                    uColor4: { value: themeColors.color4 },
                    uColorScheme: { value: themeColors.colorScheme },
                    uRez: { value: new THREE.Vector2(this.width, this.height) }
                },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                transparent: true,
                depthTest: false,
                depthWrite: false
            });

            this.pointsMesh = new THREE.Points(geometry, this.material);
            this.scene.add(this.pointsMesh);
        }

        initEvents() {
            this.onResize = () => {
                this.width = window.innerWidth;
                this.height = window.innerHeight;

                this.camera.aspect = this.width / this.height;
                this.camera.updateProjectionMatrix();

                this.renderer.setSize(this.width, this.height);
                this.particleScale = (this.width / this.pixelRatio / 1200) * this.particlesScale;

                if (this.material) {
                    this.material.uniforms.uRez.value.set(this.width, this.height);
                    this.material.uniforms.uParticleScale.value = this.particleScale;
                    this.material.uniforms.uPixelRatio.value = this.pixelRatio;
                }

                // Re-distribute particles to maintain even density
                this.initParticles();
            };

            this.onMouseMove = (e) => {
                this.isMouseOver = true;
                this.mouse.x = (e.clientX / this.width) * 2 - 1;
                this.mouse.y = -(e.clientY / this.height) * 2 + 1;
            };

            this.onMouseLeave = () => {
                this.isMouseOver = false;
            };

            this.onTouchMove = (e) => {
                if (e.touches.length > 0) {
                    this.isMouseOver = true;
                    this.mouse.x = (e.touches[0].clientX / this.width) * 2 - 1;
                    this.mouse.y = -(e.touches[0].clientY / this.height) * 2 + 1;
                }
            };

            window.addEventListener('resize', this.onResize, { passive: true });
            window.addEventListener('mousemove', this.onMouseMove, { passive: true });
            window.addEventListener('touchmove', this.onTouchMove, { passive: true });
            document.addEventListener('mouseleave', this.onMouseLeave, { passive: true });
        }

        setTheme(isDark) {
            this.isDark = isDark;
            const themeColors = this.getThemeColors();
            if (this.material) {
                this.material.uniforms.uColor1.value.copy(themeColors.color1);
                this.material.uniforms.uColor2.value.copy(themeColors.color2);
                this.material.uniforms.uColor3.value.copy(themeColors.color3);
                this.material.uniforms.uColor4.value.copy(themeColors.color4);
                this.material.uniforms.uColorScheme.value = themeColors.colorScheme;
            }
        }

        animate() {
            this.rafId = requestAnimationFrame(() => this.animate());

            this.time = this.clock.getElapsedTime();

            // Raycast mouse into 3D world plane for 1:1 cursor alignment
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const hits = this.raycaster.intersectObject(this.raycastPlane);

            // Gentle organic idle drift
            const idleWanderX = Math.sin(this.time * 0.8) * 0.35 + Math.cos(this.time * 0.35) * 0.15;
            const idleWanderY = Math.cos(this.time * 0.7) * 0.25 + Math.sin(this.time * 0.3) * 0.12;

            if (hits.length > 0 && this.isMouseOver) {
                const targetX = hits[0].point.x + idleWanderX * 0.04;
                const targetY = hits[0].point.y + idleWanderY * 0.04;
                this.cursorPos.set(targetX, targetY);

                // Silky smooth elastic inertia
                this.ringPos.x += (this.cursorPos.x - this.ringPos.x) * 0.045;
                this.ringPos.y += (this.cursorPos.y - this.ringPos.y) * 0.045;
            } else {
                this.cursorPos.set(idleWanderX, idleWanderY);
                this.ringPos.x += (this.cursorPos.x - this.ringPos.x) * 0.02;
                this.ringPos.y += (this.cursorPos.y - this.ringPos.y) * 0.02;
            }

            if (this.material) {
                this.material.uniforms.uTime.value = this.time;
                this.material.uniforms.uRingPos.value.copy(this.ringPos);
                // Antigravity rhythmic pulsation
                this.material.uniforms.uRingRadius.value =
                    this.ringRadiusBase + Math.sin(this.time * 1.0) * 0.05 + Math.cos(this.time * 3.0) * 0.025;
            }

            this.renderer.render(this.scene, this.camera);
        }

        destroy() {
            if (this.rafId) cancelAnimationFrame(this.rafId);
            window.removeEventListener('resize', this.onResize);
            window.removeEventListener('mousemove', this.onMouseMove);
            window.removeEventListener('touchmove', this.onTouchMove);
            document.removeEventListener('mouseleave', this.onMouseLeave);

            if (this.pointsMesh) {
                this.scene.remove(this.pointsMesh);
                this.pointsMesh.geometry.dispose();
                this.material.dispose();
            }
            if (this.renderer) {
                this.renderer.dispose();
            }
        }
    }

    // Auto-mount and expose globally
    window.AntigravityBackground = AntigravityBackground;

    function mount() {
        if (window.THREE && !window.__antigravityBgInstance) {
            window.__antigravityBgInstance = new AntigravityBackground();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
})();
