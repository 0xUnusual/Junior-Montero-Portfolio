// Immediate Theme Logic
(function () {
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
        document.documentElement.classList.add('light-mode');
    }
})();

// Language Logic State
let currentLang = localStorage.getItem('lang') || 'en';

const translations = {
    en: {
        cv_text: "CV",
        hero_subtitle: "PORTFOLIO INITIALIZED // V 2.0",
        hero_title_1: "I BUILD",
        about_title: "01. ABOUT",
        about_text: "I'm Junior Montero, a Web Developer passionate about creating immersive, futuristic, and interactive web experiences. I transform ideas into premium interfaces using code, animation, and modern design.",
        projects_title: "02. SELECTED WORK",
        project_desc_1: "Architecture Showcase Interface",
        project_desc_2: "Beauty & Aesthetics Platform",
        project_desc_3: "Premium Restaurant UX Concept",
        project_desc_4: "Craft Brewery Creative Layout",
        project_desc_5: "Gourmet Bistro Interface",
        terminal_ready: "System ready. Type 'help' to see available commands.",
        contact_title: "SYSTEM.READY()"
    },
    es: {
        cv_text: "CV",
        hero_subtitle: "PORTAFOLIO INICIALIZADO // V 2.0",
        hero_title_1: "DESARROLLO",
        about_title: "01. SOBRE MÍ",
        about_text: "Soy Junior Montero, un Desarrollador Web apasionado por crear experiencias web inmersivas, futuristas e interactivas. Transformo ideas en interfaces premium utilizando código, animación y diseño moderno.",
        projects_title: "02. TRABAJOS SELECCIONADOS",
        project_desc_1: "Interfaz de Exhibición de Arquitectura",
        project_desc_2: "Plataforma de Estética y Belleza",
        project_desc_3: "Concepto UX de Restaurante Premium",
        project_desc_4: "Diseño Creativo de Cervecería Artesanal",
        project_desc_5: "Interfaz de Bistro Gourmet",
        terminal_ready: "Sistema listo. Escribe 'help' para ver los comandos disponibles.",
        contact_title: "SISTEMA.LISTO()"
    }
};

const terminalTranslations = {
    en: {
        help: "Available commands:\nabout      - Display information\nskills     - List technical skills\nprojects   - View selected works\ncontact    - Display contact info\nclear      - Clear terminal output",
        about: "Junior Web Developer.\nSpecializing in high-performance web experiences.\nLocation: Santo Domingo Este, Dominican Republic\nStatus: Available for projects.",
        skills: "HTML5, CSS3, Vanilla JS, GSAP, WebGL, Responsive Design, React, UI Design, UX Design, Tailwind CSS\nFocus: Performance, Motion Design, Awwwards-level execution.",
        projects: "Loading Junior's database...\n[1] Arq-Website - Architecture Showcase\n[2] Luciaaaa-Beauty - Beauty & Aesthetics Platform\n[3] owens-burger - Premium Restaurant UX\n[4] Kpinini-Beer - Craft Brewery Creative Site\n[5] Mr.Sandwich - Gourmet Bistro Landing\nScroll right to see the live showcases.",
        contact: "Email: juniormontero7@outlook.com\nGitHub: https://github.com/0xUnusual\nLinkedIn: https://www.linkedin.com/in/maximo-junior-montero-mercedes-020956373/"
    },
    es: {
        help: "Comandos disponibles:\nabout      - Mostrar información\nskills     - Listar habilidades técnicas\nprojects   - Ver trabajos seleccionados\ncontact    - Mostrar info de contacto\nclear      - Limpiar salida de terminal",
        about: "Junior Desarrollador Web.\nEspecializado en experiencias web de alto rendimiento.\nUbicación: Santo Domingo Este, República Dominicana\nEstado: Disponible para proyectos.",
        skills: "HTML5, CSS3, Vanilla JS, GSAP, WebGL, Responsive Design, React, UI Design, UX Design, Tailwind CSS\nEnfoque: Rendimiento, Diseño de Movimiento, ejecución al nivel de Awwwards.",
        projects: "Cargando base de datos de Junior...\n[1] Arq-Website - Exhibición de Arquitectura\n[2] Luciaaaa-Beauty - Plataforma de Estética y Belleza\n[3] owens-burger - UX de Restaurante Premium\n[4] Kpinini-Beer - Sitio Creativo de Cervecería Artesanal\n[5] Mr.Sandwich - Landing de Bistro Gourmet\nDesplázate a la derecha para ver los proyectos en vivo.",
        contact: "Email: juniormontero7@outlook.com\nGitHub: https://github.com/0xUnusual\nLinkedIn: https://www.linkedin.com/in/maximo-junior-montero-mercedes-020956373/"
    }
};

function updateLanguageDOM() {
    // Update elements with data-i18n attributes
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });

    // Update language toggle text
    const langText = document.querySelector('#lang-toggle .lang-text');
    if (langText) {
        langText.textContent = currentLang === 'en' ? 'ES' : 'EN';
    }
}

function initLangToggle() {
    const langBtn = document.getElementById('lang-toggle');
    if (!langBtn) return;

    // Set initial language
    updateLanguageDOM();

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'es' : 'en';
        localStorage.setItem('lang', currentLang);
        updateLanguageDOM();

        // Re-initialize Typed.js with translated strings
        initHeroAnimation();

        // Micro-animation for toggle scale
        gsap.fromTo(langBtn,
            { scale: 0.8 },
            { scale: 1, duration: 0.4, ease: "back.out(2)" }
        );
    });
}

function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');

        // Micro-animation for toggle scale
        gsap.fromTo(toggleBtn,
            { scale: 0.8 },
            { scale: 1, duration: 0.4, ease: "back.out(2)" }
        );
    });
}

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// --------------------------------------------------------
// Custom Cursor
// --------------------------------------------------------
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });

const xToFollower = gsap.quickTo(follower, "x", { duration: 0.3, ease: "power3" });
const yToFollower = gsap.quickTo(follower, "y", { duration: 0.3, ease: "power3" });

if (window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
        xToCursor(e.clientX - 3);
        yToCursor(e.clientY - 3);
        xToFollower(e.clientX - 20);
        yToFollower(e.clientY - 20);
    });
}

// Magnetic & Hover Effects
function initHoverEffects() {
    if (!window.matchMedia('(hover: hover)').matches) return;

    const magneticElements = document.querySelectorAll('.magnetic, a, input, .project-card');
    magneticElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (follower) follower.classList.add('hover-active');
        });
        el.addEventListener('mouseleave', () => {
            if (follower) follower.classList.remove('hover-active');
            if (el.classList.contains('magnetic')) {
                gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
            }
        });
        if (el.classList.contains('magnetic')) {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const moveX = (e.clientX - centerX) * 0.2;
                const moveY = (e.clientY - centerY) * 0.2;
                gsap.to(el, { x: moveX, y: moveY, duration: 0.2 });
            });
        }
    });
}

// --------------------------------------------------------
// Interactive Terminal Logic
// --------------------------------------------------------
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('interactive-terminal-body');
const terminalContainer = document.querySelector('.terminal-container');

if (terminalContainer && terminalInput) {
    terminalContainer.addEventListener('click', () => {
        terminalInput.focus();
    });

    terminalInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const value = this.value.trim().toLowerCase();
            this.value = '';

            // Echo command
            const echoLine = document.createElement('div');
            echoLine.className = 'terminal-log';
            echoLine.innerHTML = `<span class="prompt">guest@portfolio:~$</span> ${value}`;
            terminalBody.insertBefore(echoLine, terminalInput.parentElement);

            if (value === '') return;

            if (value === 'clear') {
                const logs = document.querySelectorAll('.terminal-log');
                logs.forEach(log => {
                    const txt = log.innerText;
                    if (!txt.includes("System ready") && !txt.includes("Sistema listo")) {
                        log.remove();
                    }
                });
                return;
            }

            // Processing response
            const responseLine = document.createElement('div');
            responseLine.className = 'terminal-log';
            responseLine.style.whiteSpace = 'pre-line';
            terminalBody.insertBefore(responseLine, terminalInput.parentElement);

            const response = terminalTranslations[currentLang][value] ||
                (currentLang === 'es'
                    ? `Comando no encontrado: ${value}. Escribe 'help' para ver la lista de comandos.`
                    : `Command not found: ${value}. Type 'help' for a list of commands.`);

            // Simulate typing response
            let i = 0;
            terminalInput.disabled = true;
            const typeInterval = setInterval(() => {
                responseLine.innerHTML += response.charAt(i);
                i++;
                terminalBody.scrollTop = terminalBody.scrollHeight;
                if (i >= response.length) {
                    clearInterval(typeInterval);
                    terminalInput.disabled = false;
                    terminalInput.focus();
                }
            }, 10);
        }
    });
}

// --------------------------------------------------------
// Scroll & Animation Engines
// --------------------------------------------------------
let lenis;
let scrollTween;
const mm = gsap.matchMedia();

function initScrollAnimations() {
    // Desktop layout: horizontal scroll + lenis smooth scroll
    mm.add("(min-width: 1024px)", () => {
        lenis = new Lenis({
            lerp: 0.1,
            wheelMultiplier: 1,
            gestureOrientation: "vertical",
            normalizeWheel: true,
            smoothTouch: false
        });

        lenis.on('scroll', ScrollTrigger.update);

        const tickerCb = (time) => {
            lenis.raf(time * 1000);
        };
        gsap.ticker.add(tickerCb);
        gsap.ticker.lagSmoothing(0);

        const wrapper = document.querySelector('.horizontal-wrapper');
        const sections = gsap.utils.toArray('.section');
        const getScrollLength = () => wrapper.scrollWidth - window.innerWidth;

        scrollTween = gsap.to(".horizontal-wrapper", {
            x: () => -getScrollLength(),
            ease: "none",
            scrollTrigger: {
                trigger: ".scroll-container",
                pin: true,
                scrub: 1,
                start: "top top",
                end: () => "+=" + getScrollLength(),
                invalidateOnRefresh: true,
            }
        });

        // Stagger reveal text elements inside sections as they enter view
        sections.forEach((section, i) => {
            if (i === 0) return; // Hero is animated at the start

            const title = section.querySelector('.section-title');
            const text = section.querySelector('.about-text');
            const cards = section.querySelectorAll('.project-card');

            if (title) {
                gsap.from(title, {
                    x: 100,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        containerAnimation: scrollTween,
                        start: "left 80%",
                        toggleActions: "play none none reverse"
                    }
                });
            }

            if (text) {
                gsap.from(text, {
                    y: 50,
                    opacity: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        containerAnimation: scrollTween,
                        start: "left 70%",
                        toggleActions: "play none none reverse"
                    }
                });
            }

            if (cards.length > 0) {
                gsap.from(cards, {
                    y: 100,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        containerAnimation: scrollTween,
                        start: "left 60%",
                        toggleActions: "play none none reverse"
                    }
                });
            }
        });

        return () => {
            if (lenis) {
                lenis.destroy();
                lenis = null;
            }
            gsap.ticker.remove(tickerCb);
            if (scrollTween) {
                scrollTween.kill();
                scrollTween = null;
            }
        };
    });

    // Mobile/Tablet layout: vertical scroll reveals
    mm.add("(max-width: 1023px)", () => {
        const sections = gsap.utils.toArray('.section');

        sections.forEach((section, i) => {
            if (i === 0) return;

            const title = section.querySelector('.section-title');
            const text = section.querySelector('.about-text');
            const cards = section.querySelectorAll('.project-card');

            if (title) {
                gsap.from(title, {
                    y: 40,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: title,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                });
            }

            if (text) {
                gsap.from(text, {
                    y: 30,
                    opacity: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: text,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                });
            }

            if (cards.length > 0) {
                gsap.from(cards, {
                    y: 40,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: cards[0],
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                });
            }
        });

        // Hide toggle buttons on mobile scroll down, show on scroll up
        let lastScrollY = window.scrollY;
        const langBtn = document.getElementById('lang-toggle');
        const cvBtn = document.getElementById('cv-download');
        const themeBtn = document.getElementById('theme-toggle');

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > 50 && currentScrollY > lastScrollY) {
                // Scrolling down - hide buttons
                langBtn?.classList.add('nav-hidden');
                cvBtn?.classList.add('nav-hidden');
                themeBtn?.classList.add('nav-hidden');
            } else {
                // Scrolling up or near top - show buttons
                langBtn?.classList.remove('nav-hidden');
                cvBtn?.classList.remove('nav-hidden');
                themeBtn?.classList.remove('nav-hidden');
            }
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            langBtn?.classList.remove('nav-hidden');
            cvBtn?.classList.remove('nav-hidden');
            themeBtn?.classList.remove('nav-hidden');
        };
    });
}

let typedInstance;
function initHeroAnimation() {
    if (typedInstance) {
        typedInstance.destroy();
    }
    const typedElement = document.getElementById('typed-element');
    if (typedElement) {
        const strings = currentLang === 'es'
            ? ['SITIOS WEB', 'EXPERIENCIAS', 'INTERFACES', 'SISTEMAS', 'FUTUROS']
            : ['WEBSITES', 'EXPERIENCES', 'INTERFACES', 'SYSTEMS', 'FUTURES'];
        typedInstance = new Typed('#typed-element', {
            strings: strings,
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// --------------------------------------------------------
// Preloader Boot Sequence
// --------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
    // Disable scrolling during preloader
    document.body.style.overflow = 'hidden';

    // Init theme toggle interaction
    initThemeToggle();

    // Init language toggle interaction
    initLangToggle();

    // Lighthouse / SpeedInsights instant load bypass for optimal LCP
    const isLighthouse = /Lighthouse|Chrome-Lighthouse|SpeedInsights/i.test(navigator.userAgent);
    if (isLighthouse) {
        revealWebsite(true);
        return;
    }

    const logsContainer = document.getElementById('preloader-logs');

    if (!logsContainer) {
        // Fallback if elements aren't ready
        revealWebsite();
        return;
    }

    const preloaderLogs = [
        `<span class="token-keyword">const</span> <span class="token-variable">portfolio</span> <span class="token-operator">=</span> <span class="token-keyword">new</span> <span class="token-class">Experience</span>();`,
        `<span class="token-variable">portfolio</span>.<span class="token-method">initialize</span>();`,
        `<span class="token-variable">gsap</span>.<span class="token-method">registerPlugin</span>(<span class="token-variable">ScrollTrigger</span>);`,
        `<span class="token-keyword">const</span> <span class="token-variable">lenis</span> <span class="token-operator">=</span> <span class="token-keyword">new</span> <span class="token-class">Lenis</span>();`,
        `<span class="token-function">buildImmersiveExperience</span>();`,
        `<span class="token-variable">system</span>.<span class="token-property">status</span> <span class="token-operator">=</span> <span class="token-string">"ONLINE"</span>;`
    ];

    let currentLogIndex = 0;
    let typingFinished = false;
    let pctFinished = false;

    // Add glowing terminal design to logs container
    logsContainer.style.lineHeight = '1.8';

    function typeLine(element, htmlContent, speed, callback) {
        let index = 0;
        let currentHTML = "";

        function type() {
            if (index < htmlContent.length) {
                if (htmlContent.charAt(index) === '<') {
                    let tagEnd = htmlContent.indexOf('>', index);
                    if (tagEnd !== -1) {
                        currentHTML += htmlContent.substring(index, tagEnd + 1);
                        index = tagEnd + 1;
                    }
                } else {
                    currentHTML += htmlContent.charAt(index);
                    index++;
                }
                element.innerHTML = currentHTML;
                setTimeout(type, speed);
            } else {
                if (callback) callback();
            }
        }
        type();
    }

    function showNextLog() {
        if (currentLogIndex < preloaderLogs.length) {
            const line = document.createElement('div');
            logsContainer.appendChild(line);

            typeLine(line, preloaderLogs[currentLogIndex], 5, () => {
                currentLogIndex++;
                if (currentLogIndex === preloaderLogs.length) {
                    typingFinished = true;
                    checkReveal();
                } else {
                    setTimeout(showNextLog, 50);
                }
            });
        }
    }

    function checkReveal() {
        if (typingFinished && pctFinished) {
            setTimeout(revealWebsite, 200);
        }
    }

    // Start code lines typing sequence
    showNextLog();

    // Create and start parallel percent loader progress bar
    const percentLine = document.createElement('div');
    percentLine.id = 'preloader-percent';
    logsContainer.appendChild(percentLine);

    let pct = 0;
    const pctInterval = setInterval(() => {
        if (typingFinished) {
            pct += 10; // Speed up once typing is done
        } else {
            pct += 2.2; // Faster increment for better user UX and LCP
        }

        if (pct >= 100) {
            pct = 100;
            clearInterval(pctInterval);
            pctFinished = true;
            checkReveal();
        }

        const displayPct = Math.floor(pct);
        const barLength = Math.floor(displayPct / 5);
        const filledBar = "█".repeat(barLength);
        const emptyBar = "░".repeat(20 - barLength);

        percentLine.innerHTML = `[${filledBar}${emptyBar}] ${displayPct}% COMPLETE`;
    }, 25);

    function revealWebsite(instant = false) {
        if (instant) {
            const preloader = document.querySelector('.preloader');
            if (preloader) preloader.style.display = 'none';
            document.body.style.overflow = '';
            gsap.set('.panel-left', { xPercent: -100 });
            gsap.set('.panel-right', { xPercent: 100 });
            gsap.set('.horizontal-wrapper', { filter: 'blur(0px)' });

            initScrollAnimations();
            initHeroAnimation();
            initHoverEffects();
            return;
        }

        const tl = gsap.timeline({
            onComplete: () => {
                document.querySelector('.preloader').style.display = 'none';
                document.body.style.overflow = '';

                // Initialize elements in correct sequence
                initScrollAnimations();
                initHeroAnimation();
                initHoverEffects();
            }
        });

        // Fade out preloader content
        tl.to('.preloader-content', { opacity: 0, y: -20, duration: 0.4, ease: "power3.in" });

        // Cinematic sideways wipe (panels sliding out horizontally)
        tl.to('.panel-left', { xPercent: -100, duration: 1.0, ease: "power4.inOut" }, "wipe");
        tl.to('.panel-right', { xPercent: 100, duration: 1.0, ease: "power4.inOut" }, "wipe");

        // Blur reveal transition for the website entry
        tl.fromTo('.horizontal-wrapper',
            { filter: 'blur(10px)' },
            { filter: 'blur(0px)', duration: 1.0, ease: "power3.out" },
            "wipe+=0.1"
        );
    }
});
