// Immediate Theme Logic
(function () {
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
        document.documentElement.classList.add('light-mode');
    }
})();

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

window.addEventListener('mousemove', (e) => {
    xToCursor(e.clientX - 3);
    yToCursor(e.clientY - 3);
    xToFollower(e.clientX - 20);
    yToFollower(e.clientY - 20);
});

// Magnetic & Hover Effects
function initHoverEffects() {
    const magneticElements = document.querySelectorAll('.magnetic, a, input, .project-card');
    magneticElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.classList.add('hover-active');
        });
        el.addEventListener('mouseleave', () => {
            follower.classList.remove('hover-active');
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

const commands = {
    help: "Available commands:\nabout      - Display information\nskills     - List technical skills\nprojects   - View selected works\ncontact    - Display contact info\nclear      - Clear terminal output",
    about: "Junior Creative Developer.\nSpecializing in high-performance web experiences.\nLocation: Santo Domingo, Dominican Republic\nStatus: Available for projects.",
    skills: "HTML5, CSS3, Vanilla JS, GSAP, WebGL, Three.js, React, Node.js\nFocus: Performance, Motion Design, Awwwards-level execution.",
    projects: "Loading Junior's database...\n[1] Arq-Website - Architecture Showcase\n[2] Luciaaaa-Beauty - Beauty & Aesthetics Platform\n[3] owens-burger - Premium Restaurant UX\n[4] Kpinini-Beer - Craft Brewery Creative Site\n[5] Mr.Sandwich - Gourmet Bistro Landing\nScroll right to see the live showcases.",
    contact: "Email: juniormontero7@outlook.com\nGitHub: https://github.com/0xUnusual\nLinkedIn: https://www.linkedin.com/in/junior-montero-b523b726a/"
};

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
                    if (!log.innerText.includes("System ready")) {
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

            const response = commands[value] || `Command not found: ${value}. Type 'help' for a list of commands.`;

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

function initSmoothScroll() {
    lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        gestureOrientation: "vertical",
        normalizeWheel: true,
        smoothTouch: false
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}

function initHorizontalScroll() {
    const wrapper = document.querySelector('.horizontal-wrapper');
    const sections = gsap.utils.toArray('.section');

    // Total translation is wrapper width minus window width
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
}

function initHeroAnimation() {
    const typedElement = document.getElementById('typed-element');
    if (typedElement) {
        new Typed('#typed-element', {
            strings: ['WEBSITES', 'EXPERIENCES', 'INTERFACES', 'SYSTEMS', 'FUTURES'],
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

            typeLine(line, preloaderLogs[currentLogIndex], 8, () => {
                currentLogIndex++;
                if (currentLogIndex === preloaderLogs.length) {
                    typingFinished = true;
                    checkReveal();
                } else {
                    setTimeout(showNextLog, 100);
                }
            });
        }
    }

    function checkReveal() {
        if (typingFinished && pctFinished) {
            setTimeout(revealWebsite, 500);
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
            pct += 6; // Dynamically speed up once code is fully typed out
        } else {
            pct += 0.8;
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

    function revealWebsite() {
        const tl = gsap.timeline({
            onComplete: () => {
                document.querySelector('.preloader').style.display = 'none';
                document.body.style.overflow = '';

                // Initialize elements in correct sequence
                initSmoothScroll();
                initHorizontalScroll();
                initHeroAnimation();
                initHoverEffects();
            }
        });

        // Fade out preloader content
        tl.to('.preloader-content', { opacity: 0, y: -20, duration: 0.6, ease: "power3.in" });

        // Cinematic sideways wipe (panels sliding out horizontally)
        tl.to('.panel-left', { xPercent: -100, duration: 1.5, ease: "power4.inOut" }, "wipe");
        tl.to('.panel-right', { xPercent: 100, duration: 1.5, ease: "power4.inOut" }, "wipe");

        // Blur reveal transition for the website entry (No scale zoom-in to keep texts completely static)
        tl.fromTo('.horizontal-wrapper',
            { filter: 'blur(10px)' },
            { filter: 'blur(0px)', duration: 1.5, ease: "power3.out" },
            "wipe+=0.2"
        );
    }
});
