/**
 * Zhan Pengyu — Personal Site
 * Canvas background · Tri-lang · Style switcher · Theme toggle
 */

const canvas = document.getElementById('bg-canvas');
const ctx = canvas?.getContext('2d');
const root = document.documentElement;

let width, height, mouseX = -500, mouseY = -500, targetMouseX = -500, targetMouseY = -500;
let currentLang = 'en';
let currentStyle = 'default';
let gridPoints = [];
const spacing = 35;
let connections = [];
const maxConns = 80;
const connDist = 100;

// ── Resize ──
function resize() {
    if (!canvas) return;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    initGrid();
}
function initGrid() {
    gridPoints = [];
    const cols = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / spacing) + 1;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            gridPoints.push({
                x: j * spacing, y: i * spacing,
                ox: j * spacing, oy: i * spacing,
                phase: Math.random() * Math.PI * 2,
                amp: Math.random() * 0.8
            });
        }
    }
}

// ── Canvas draw ──
function draw(time) {
    if (!ctx) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    const isFrutiger = currentStyle === 'frutiger';
    ctx.clearRect(0, 0, width, height);

    // mouse smoothing
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;

    // dots
    const dotColor = isFrutiger ? 'rgba(255,255,255,0.08)' : isDark ? 'rgba(200,190,180,0.04)' : 'rgba(80,70,60,0.04)';
    ctx.fillStyle = dotColor;
    for (const p of gridPoints) {
        const dx = p.y * 0.02 + time * 0.3;
        const dy = p.x * 0.015 + time * 0.2;
        const ox = p.ox + Math.sin(dx + p.phase) * p.amp;
        const oy = p.oy + Math.cos(dy + p.phase) * p.amp;
        const dp = mouseX === -500 ? 0 : 1 - Math.min(1, Math.hypot(mouseX - ox, mouseY - oy) / 200);
        ctx.beginPath();
        ctx.arc(ox, oy, 0.8 + dp * 1.2, 0, Math.PI * 2);
        ctx.fill();
    }

    // connections
    connections = [];
    for (let i = 0; i < gridPoints.length; i++) {
        for (let j = i + 1; j < gridPoints.length; j++) {
            const p1 = gridPoints[i], p2 = gridPoints[j];
            const dist = Math.hypot(p1.ox - p2.ox, p1.oy - p2.oy);
            if (dist < connDist && connections.length < maxConns) {
                connections.push({ p1, p2, dist });
            }
        }
    }
    const connColor = isFrutiger ? 'rgba(255,255,255,0.06)' : isDark ? 'rgba(200,190,180,0.025)' : 'rgba(80,70,60,0.025)';
    for (const c of connections) {
        const alpha = 1 - c.dist / connDist;
        ctx.strokeStyle = connColor.replace('0.', (0 + Math.floor(alpha * 5)).toString() + '.');
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(c.p1.ox, c.p1.oy);
        ctx.lineTo(c.p2.ox, c.p2.oy);
        ctx.stroke();
    }
}

// ── Theme ──
function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}
function toggleTheme() {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}
document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
applyTheme(localStorage.getItem('theme') || 'light');

// ── Style ──
function applyStyle(style) {
    currentStyle = style;
    root.setAttribute('data-style', style);
    localStorage.setItem('style', style);
    const btn = document.getElementById('style-toggle');
    if (btn) btn.title = 'Style: ' + style;
}
document.getElementById('style-toggle')?.addEventListener('click', () => {
    const styles = ['default', 'frutiger', 'glass'];
    const idx = styles.indexOf(currentStyle);
    applyStyle(styles[(idx + 1) % styles.length]);
});
applyStyle(localStorage.getItem('style') || 'default');

// ── Language ──
function applyLang(lang) {
    currentLang = lang;
    root.setAttribute('data-lang', lang);
    localStorage.setItem('lang', lang);
    document.querySelectorAll('[data-en][data-zh]').forEach(el => {
        const text = el.getAttribute('data-' + lang);
        if (text !== null) el.textContent = text;
    });
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = btn.getAttribute('data-' + lang) || '中';
}
document.getElementById('lang-toggle')?.addEventListener('click', () => {
    const langs = ['en', 'zh', 'hk'];
    applyLang(langs[(langs.indexOf(currentLang) + 1) % langs.length]);
});
applyLang(localStorage.getItem('lang') || 'en');

// ── Animation ──
let animTime = 0;
function animate(ts) {
    animTime = ts * 0.001;
    if (currentStyle !== 'frutiger') draw(animTime);
    requestAnimationFrame(animate);
}

// ── Event listeners ──
window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => { targetMouseX = e.clientX; targetMouseY = e.clientY; });
window.addEventListener('mouseleave', () => { targetMouseX = -500; targetMouseY = -500; });

// ── Smooth scroll for nav links ──
document.querySelectorAll('.nav a, a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
});

// ── Init ──
resize();
requestAnimationFrame(animate);
