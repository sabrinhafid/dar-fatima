// === INTRO REVEAL — expand from small pill to fullscreen ===
(function () {
    const section   = document.getElementById('introReveal');
    const container = document.getElementById('irContainer');
    const irText    = document.getElementById('irText');
    const overlay   = document.getElementById('irOverlay');
    if (!section || !container) return;

    const isMobile   = window.innerWidth <= 768;
    const EXPAND_PX  = isMobile ? 500 : 900;
    const HOLD_PX    = isMobile ? 0   : 400;
    const TOTAL_PX   = EXPAND_PX + HOLD_PX;

    const START_W = 280;
    const START_H = 380;
    const START_R = 140;

    function ease(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function update() {
        const scrolled  = window.pageYOffset;
        const progress  = Math.min(Math.max(scrolled / EXPAND_PX, 0), 1);
        const eased     = ease(progress);

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const w = START_W + (vw - START_W) * eased;
        const h = START_H + (vh - START_H) * eased;

        const r = START_R * (1 - eased);

        container.style.width        = w + 'px';
        container.style.height       = h + 'px';
        container.style.borderRadius = r + 'px ' + r + 'px 0 0';

        // Fixed during expansion & hold; starts at 75vh, moves to center as it expands
        const startTop = isMobile ? 75 : 84;
        if (scrolled > 10 && scrolled < TOTAL_PX) {
            const topPct = startTop - (startTop - 50) * eased;
            container.style.position  = 'fixed';
            container.style.top       = topPct + '%';
            container.style.left      = '50%';
            container.style.transform = 'translate(-50%, -50%)';
            container.style.opacity   = '1';
        } else if (scrolled <= 10) {
            container.style.position  = 'fixed';
            container.style.top       = startTop + '%';
            container.style.left      = '50%';
            container.style.transform = 'translate(-50%, -50%)';
            container.style.opacity   = '1';
        }

        // Overlay: cream background covering the page — fades out as image expands
        if (overlay) {
            if (scrolled > TOTAL_PX) {
                overlay.style.display = 'none';
            } else {
                overlay.style.display = '';
                overlay.style.opacity = Math.max(1 - eased * 2, 0);
            }
        }

        // Text: visible at start, fades out as image expands
        const textOpacity = Math.max(1 - progress * 2.2, 0);
        if (irText) {
            irText.style.opacity   = textOpacity;
            irText.style.display   = scrolled > TOTAL_PX ? 'none' : '';
        }

        // Fade out after hold — no CSS transition, scroll drives opacity directly
        const FADE_PX = isMobile ? 80 : 200;
        if (scrolled > TOTAL_PX) {
            const fadeProgress = Math.min((scrolled - TOTAL_PX) / FADE_PX, 1);
            container.style.opacity    = 1 - fadeProgress;
            container.style.transition = 'none';
            if (fadeProgress >= 1) {
                container.style.display = 'none';
            }
        } else {
            container.style.opacity    = '1';
            container.style.transition = 'none';
            container.style.display    = '';
        }
    }

    let rafPending = false;
    window.addEventListener('scroll', () => {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => { update(); rafPending = false; });
    }, { passive: true });
    update();
})();

// === SPARKLE on gold CTAs ===
function spawnSparkles(e) {
    const symbols = ['✦', '✧', '⋆', '★'];
    for (let i = 0; i < 7; i++) {
        const s = document.createElement('span');
        s.className = 'sparkle-star';
        s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        s.style.left = (e.clientX + (Math.random() - 0.5) * 60) + 'px';
        s.style.top  = (e.clientY + (Math.random() - 0.5) * 30) + 'px';
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 800);
    }
}
document.querySelectorAll('.btn-primary, .btn-submit-prenota, .esp-cta-box, .nav-mobile-cta').forEach(el => {
    el.addEventListener('click', spawnSparkles);
});

// === REVEAL ON SCROLL ===
const revealEls = document.querySelectorAll('.reveal-up');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = parseFloat(entry.target.dataset.delay || 0);
            setTimeout(() => entry.target.classList.add('visible'), delay * 1000);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// === HERO LINE REVEAL ===
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    setTimeout(() => heroTitle.classList.add('lines-visible'), 200);
}

// === CHI SONO TITLE REVEAL ===
const csTitle = document.querySelector('.cs-title');
if (csTitle) {
    const csTitleObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            setTimeout(() => csTitle.classList.add('revealed'), 100);
            csTitleObs.disconnect();
        }
    }, { threshold: 0.3 });
    csTitleObs.observe(csTitle);
}

// === PARALLAX HERO BG ===
const heroBg = document.getElementById('heroBg');
if (heroBg) {
    const heroEl = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const maxScroll = heroEl ? heroEl.offsetHeight : window.innerHeight;
        const y = Math.min(window.scrollY, maxScroll) * 0.25;
        heroBg.style.transform = `translateY(${y}px)`;
    }, { passive: true });
}

// === NAV SCROLL ===
const nav = document.getElementById('nav');
if (nav) {
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
}

// === HAMBURGER ===
const hamburger = document.getElementById('navHamburger');
const navMobile  = document.getElementById('navMobile');
function closeMenu() {
    nav.classList.remove('open');
    navMobile.classList.remove('open');
    document.body.classList.remove('menu-open');
}
if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('open');
        navMobile.classList.toggle('open');
        document.body.classList.toggle('menu-open');
    });
    navMobile.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    // Close on backdrop tap
    navMobile.addEventListener('click', (e) => {
        if (e.target === navMobile) closeMenu();
    });
    // Close button
    document.getElementById('navMobileClose')?.addEventListener('click', closeMenu);
}

// === MENU NAV SCROLL INDICATOR ===
const menuNavWrap = document.querySelector('.menu-nav-wrap');
const menuNavEl   = document.getElementById('menuNav');
if (menuNavEl && menuNavWrap) {
    const checkNavEnd = () => {
        const atEnd = menuNavEl.scrollLeft + menuNavEl.clientWidth >= menuNavEl.scrollWidth - 4;
        menuNavWrap.classList.toggle('nav-at-end', atEnd);
    };
    menuNavEl.addEventListener('scroll', checkNavEnd, { passive: true });
    checkNavEnd();
}

// === MENU SCROLL ARROWS ===
document.getElementById('mScrollPrev')?.addEventListener('click', () => {
    document.querySelector('.menu-panel.active')?.scrollBy({ left: -540, behavior: 'smooth' });
});
document.getElementById('mScrollNext')?.addEventListener('click', () => {
    document.querySelector('.menu-panel.active')?.scrollBy({ left: 540, behavior: 'smooth' });
});

// === MENU TABS ===
function showMenuPanel(catId) {
    document.querySelectorAll('.menu-panel').forEach(p => {
        p.classList.remove('active');
        p.querySelectorAll('.mi').forEach(i => i.classList.remove('in'));
    });
    const panel = document.getElementById('cat-' + catId);
    if (!panel) return;
    panel.classList.add('active');
    panel.scrollLeft = 0;
    panel.querySelectorAll('.mi').forEach((item, i) => {
        item.style.setProperty('--i', i);
        // Lazy-load image on first open
        const img = item.querySelector('.mi-img');
        if (img && img.dataset.bg && !img.style.backgroundImage) {
            img.style.backgroundImage = img.dataset.bg;
        }
        setTimeout(() => item.classList.add('in'), i * 60);
    });
}
const menuNav = document.getElementById('menuNav');
if (menuNav) {
    menuNav.querySelectorAll('.mnav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            menuNav.querySelectorAll('.mnav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showMenuPanel(btn.dataset.cat);
        });
    });
    // Animate initial panel on scroll into view
    const menuSection = document.getElementById('menu');
    let menuInited = false;
    const menuObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !menuInited) {
            menuInited = true;
            showMenuPanel('antipasti');
        }
    }, { threshold: 0.1 });
    if (menuSection) menuObs.observe(menuSection);
}

// === MENU MOBILE — tap to reveal description ===
if ('ontouchstart' in window) {
    document.querySelectorAll('.mi').forEach(item => {
        item.addEventListener('click', function () {
            const isOpen = this.classList.contains('active-desc');
            document.querySelectorAll('.mi').forEach(mi => mi.classList.remove('active-desc'));
            if (!isOpen) this.classList.add('active-desc');
        });
    });
}

// === APOSTROPHE SPACING ===
document.querySelectorAll('.hero-title, .hero-sub, .section-title, .cs-bio, .concept-desc, .menu-title, .prenota-title').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/([a-zA-Z\u00C0-\u024F])'([a-zA-Z\u00C0-\u024F])/g, "$1'\u202F$2");
});

// === FORM ===
const form = document.getElementById('prenotaForm');
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit-prenota');
        btn.textContent = 'Richiesta inviata ✓';
        btn.style.background = '#1B4332';
        btn.disabled = true;
    });
}
