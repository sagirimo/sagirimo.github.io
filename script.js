/**
 * Zhan Pengyu — Personal Website
 * Tri-language toggle + nav scroll highlight
 */

const root = document.documentElement;
let currentLang = 'en'; // en → zh → hk → en
const langDisplay = { en: 'EN', zh: '简', hk: '繁' };
const langNames = { en: 'English', zh: '简体中文', hk: '繁體中文' };

/* ── Language Toggle ── */
const langBtn = document.getElementById('lang-toggle');
const langText = langBtn?.querySelector('.lang-text');

function switchLangText(lang) {
    if (!langText) return;
    // Scale out → change text → scale in
    langText.style.transition = 'transform 0.2s cubic-bezier(0.645,0.045,0.355,1), opacity 0.2s ease';
    langText.style.transform = 'scale(0)';
    langText.style.opacity = '0';
    setTimeout(() => {
        langText.textContent = langDisplay[lang];
        langText.style.transform = 'scale(1)';
        langText.style.opacity = '1';
    }, 200);
}

function updateLanguage(lang) {
    currentLang = lang;
    if (langBtn) {
        langBtn.title = langNames[lang];
    }
    root.lang = lang === 'hk' ? 'zh-HK' : (lang === 'zh' ? 'zh-CN' : 'en');

    document.querySelectorAll('[data-en]').forEach(el => {
        // Don't update the lang-text span itself (handled separately)
        if (el === langText) return;
        const text = el.getAttribute(`data-${lang}`);
        if (text != null) el.innerHTML = text;
    });
}

langBtn?.addEventListener('click', () => {
    const next = currentLang === 'en' ? 'zh' : (currentLang === 'zh' ? 'hk' : 'en');
    switchLangText(next);
    setTimeout(() => updateLanguage(next), 100);
});

// Init
updateLanguage('en');
if (langText) langText.textContent = langDisplay['en'];

/* ── Nav Scroll Highlight ── */
function updateNavHighlight() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

window.addEventListener('scroll', updateNavHighlight, { passive: true });
updateNavHighlight();

/* ── Sidebar scroll-off past .layout ──
   Sidebar is position:fixed. When the user scrolls past .layout's bottom,
   we translate the sidebar upward so it rides away with the content, revealing
   the full-width Worldline section that follows.
*/
const sidebar = document.querySelector('.sidebar');
const layout = document.querySelector('.layout');
function updateSidebarScrollOff() {
    if (!sidebar || !layout) return;
    // getBoundingClientRect gives viewport-relative positions.
    // .bottom < viewportHeight means layout has scrolled past the bottom of viewport.
    const viewH = window.innerHeight;
    const layoutBottomInViewport = layout.getBoundingClientRect().bottom;
    const overshoot = viewH - layoutBottomInViewport;
    if (overshoot > 0) {
        sidebar.style.transform = `translate3d(0, ${-overshoot}px, 0)`;
    } else {
        sidebar.style.transform = 'translate3d(0, 0, 0)';
    }
}
window.addEventListener('scroll', updateSidebarScrollOff, { passive: true });
window.addEventListener('resize', updateSidebarScrollOff);
// Run on load + after fonts settle
updateSidebarScrollOff();
window.addEventListener('load', updateSidebarScrollOff);

/* ── Spotlight Follow ── */
const spotlight = document.querySelector('.spotlight');
let sx = window.innerWidth / 2;
let sy = window.innerHeight / 2;
let tx = sx;
let ty = sy;

document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
});

function animateSpotlight() {
    sx += (tx - sx) * 0.08;
    sy += (ty - sy) * 0.08;
    if (spotlight) {
        spotlight.style.background = `radial-gradient(600px at ${sx}px ${sy}px, rgba(100,255,218,0.07), transparent 80%)`;
    }
    requestAnimationFrame(animateSpotlight);
}

animateSpotlight();
