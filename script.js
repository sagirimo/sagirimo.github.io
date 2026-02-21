/**
 * Zhan Pengyu - Personal Website
 * Neural Network Background + Tri-language Support
 */

// ========================================
// 初始化
// ========================================

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
const root = document.documentElement;

let width = window.innerWidth;
let height = window.innerHeight;
let mouseX = -1000;
let mouseY = -1000;
let targetMouseX = -1000;
let targetMouseY = -1000;
let time = 0;
let currentTheme = 'light';
let currentLang = 'en'; // en, zh, hk

// 滚动
let scrollY = 0;
let bgOffsetY = 0;
let targetBgOffsetY = 0;

// 网格点
let gridPoints = [];
const pointSpacing = 30;

// 连线系统
let connections = [];
const maxConnections = 120;
const connectionDistance = 100;

// 主题颜色
let dotColor = 'rgba(80, 75, 65, 0.03)';
let dotGlow = 'rgba(100, 95, 85, 0.045)';
let bgColorStart = { r: 245, g: 243, b: 240 };
let bgColorEnd = { r: 235, g: 232, b: 227 };

// ========================================
// 主题切换
// ========================================

function updateThemeColors() {
    if (currentTheme === 'dark') {
        dotColor = 'rgba(180, 175, 165, 0.025)';
        dotGlow = 'rgba(190, 185, 175, 0.04)';
        bgColorStart = { r: 10, g: 10, b: 10 };
        bgColorEnd = { r: 15, g: 15, b: 15 };
    } else {
        dotColor = 'rgba(80, 75, 65, 0.03)';
        dotGlow = 'rgba(100, 95, 85, 0.045)';
        bgColorStart = { r: 245, g: 243, b: 240 };
        bgColorEnd = { r: 235, g: 232, b: 227 };
    }
}

function applyTheme(theme) {
    currentTheme = theme;
    root.setAttribute('data-theme', theme);
    updateThemeColors();
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

applyTheme('light');

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => applyTheme(currentTheme === 'dark' ? 'light' : 'dark'));
}

// ========================================
// 三语切换 (EN -> ZH -> HK -> EN)
// ========================================

const langToggle = document.getElementById('lang-toggle');

const langDisplay = { en: '中', zh: '繁', hk: 'EN' };
const langNames = { en: 'English', zh: '简体中文', hk: '繁體中文' };

function updateLanguage(lang) {
    currentLang = lang;

    // 更新按钮显示
    if (langToggle) {
        langToggle.textContent = langDisplay[lang];
        langToggle.title = langNames[lang];
    }

    root.lang = lang === 'hk' ? 'zh-HK' : (lang === 'zh' ? 'zh-CN' : 'en');

    // 更新所有带 data-en/data-zh/data-hk 的元素
    document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) el.textContent = text;
    });
}

if (langToggle) {
    langToggle.addEventListener('click', () => {
        const nextLang = currentLang === 'en' ? 'zh' : (currentLang === 'zh' ? 'hk' : 'en');
        updateLanguage(nextLang);
    });
}

// 默认英文
updateLanguage('en');

// ========================================
// Canvas
// ========================================

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initGridPoints();
}

window.addEventListener('resize', resize);

// ========================================
// 初始化网格点
// ========================================

function initGridPoints() {
    gridPoints = [];
    const cols = Math.ceil(width / pointSpacing) + 2;
    const rows = Math.ceil(height / pointSpacing) + 4;

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            gridPoints.push({
                baseX: i * pointSpacing,
                baseY: j * pointSpacing,
                x: i * pointSpacing,
                y: j * pointSpacing,
                currentSize: 0.4,
                currentAlpha: 0.08,
                targetSize: 0.4,
                targetAlpha: 0.08,
                noiseOffset: Math.random() * 100,
                activation: 0,
                targetActivation: 0,
                distToMouse: 9999
            });
        }
    }
}

// ========================================
// 鼠标监听
// ========================================

document.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
});

document.addEventListener('mouseleave', () => {
    targetMouseX = -1000;
    targetMouseY = -1000;
});

window.addEventListener('scroll', () => scrollY = window.pageYOffset, { passive: true });

// ========================================
// 数学函数
// ========================================

function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
}

function hash(x, y) {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
}

function noise2D(x, y) {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const a = hash(ix, iy), b = hash(ix + 1, iy);
    const c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
    const ux = smoothstep(0, 1, fx), uy = smoothstep(0, 1, fy);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function getChromeColor(hue, alpha) {
    const c = 0.06;
    const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
    let r = 1, g = 1, b = 1;
    if (hue < 60) { r = 1; g = 1 - x; b = 1 - c; }
    else if (hue < 120) { r = 1 - x; g = 1; b = 1 - c; }
    else if (hue < 180) { r = 1 - c; g = 1; b = 1 - x; }
    else if (hue < 240) { r = 1 - c; g = 1 - x; b = 1; }
    else if (hue < 300) { r = 1 - x; g = 1 - c; b = 1; }
    else { r = 1; g = 1 - c; b = 1 - x; }
    return `rgba(${Math.round(190 + r * 65)}, ${Math.round(185 + g * 70)}, ${Math.round(175 + b * 80)}, ${alpha})`;
}

// ========================================
// 神经网络连线
// ========================================

function updateConnections() {
    const pointsByDistance = gridPoints
        .filter(p => p.activation > 0.2)
        .sort((a, b) => a.distToMouse - b.distToMouse);

    pointsByDistance.forEach((p1) => {
        const proximityBonus = 1 - (p1.distToMouse / 160);
        const generateChance = 0.06 * proximityBonus;

        if (Math.random() < generateChance && connections.length < maxConnections) {
            const maxDist = connectionDistance * (0.6 + proximityBonus * 0.6);
            const nearby = pointsByDistance.filter(p2 => {
                if (p2 === p1) return false;
                const dist = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
                return dist < maxDist;
            });

            if (nearby.length > 0) {
                const p2 = nearby[Math.floor(Math.random() * nearby.length)];
                const exists = connections.some(c =>
                    (c.p1 === p1 && c.p2 === p2) || (c.p1 === p2 && c.p2 === p1)
                );

                if (!exists) {
                    const midDist = (p1.distToMouse + p2.distToMouse) / 2;
                    const intensity = 1 - midDist / 160;
                    connections.push({
                        p1: p1, p2: p2,
                        alpha: 0,
                        targetAlpha: 0.12 + intensity * 0.1,
                        decay: 0.003,
                        hue: Math.random() * 360
                    });
                }
            }
        }
    });

    for (let i = connections.length - 1; i >= 0; i--) {
        const conn = connections[i];
        conn.alpha += (conn.targetAlpha - conn.alpha) * 0.12;

        const midX = (conn.p1.x + conn.p2.x) / 2;
        const midY = (conn.p1.y + conn.p2.y) / 2;
        const distToMouse = Math.sqrt((midX - mouseX) ** 2 + (midY - mouseY) ** 2);

        if (distToMouse > connectionDistance * 2) {
            conn.targetAlpha = 0;
            conn.alpha -= conn.decay;
        }

        if (conn.alpha <= 0) connections.splice(i, 1);
    }
}

function drawConnections() {
    connections.forEach(conn => {
        if (conn.alpha < 0.005) return;

        const gradient = ctx.createLinearGradient(conn.p1.x, conn.p1.y, conn.p2.x, conn.p2.y);
        const hue1 = (conn.hue + time * 0.2) % 360;
        const hue2 = (hue1 + 20) % 360;

        gradient.addColorStop(0, getChromeColor(hue1, conn.alpha * 0.7));
        gradient.addColorStop(0.5, getChromeColor((hue1 + hue2) / 2, conn.alpha));
        gradient.addColorStop(1, getChromeColor(hue2, conn.alpha * 0.7));

        ctx.beginPath();
        ctx.moveTo(conn.p1.x, conn.p1.y);
        ctx.lineTo(conn.p2.x, conn.p2.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.6;
        ctx.stroke();
    });
}

// ========================================
// 绘制
// ========================================

function draw() {
    mouseX += (targetMouseX - mouseX) * 0.1;
    mouseY += (targetMouseY - mouseY) * 0.1;

    targetBgOffsetY = scrollY * 0.25;
    bgOffsetY += (targetBgOffsetY - bgOffsetY) * 0.06;

    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, `rgb(${bgColorStart.r}, ${bgColorStart.g}, ${bgColorStart.b})`);
    bgGradient.addColorStop(1, `rgb(${bgColorEnd.r}, ${bgColorEnd.g}, ${bgColorEnd.b})`);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    const mouseRadius = 150;
    const maxScale = 2;

    gridPoints.forEach(point => {
        const n1 = noise2D(point.baseX * 0.004 + time * 0.0001 + point.noiseOffset, point.baseY * 0.004);
        const n2 = noise2D(point.baseX * 0.004 + 50, point.baseY * 0.004 + time * 0.00008 + point.noiseOffset);

        point.x = point.baseX + n1 * 3;
        point.y = point.baseY + n2 * 3 - (bgOffsetY % pointSpacing);

        const breathNoise = noise2D(point.baseX * 0.006 + time * 0.0005, point.baseY * 0.006 + point.noiseOffset);

        point.targetSize = 0.4 + breathNoise * 0.15;
        point.targetAlpha = 0.1 + noise2D(point.baseX * 0.008 + 20, point.baseY * 0.008 + time * 0.00015) * 0.05;

        const dx = point.x - mouseX;
        const dy = point.y - mouseY;
        point.distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (point.distToMouse < mouseRadius) {
            const t = smoothstep(mouseRadius, 0, point.distToMouse);
            point.targetSize += t * maxScale;
            point.targetAlpha += t * 0.18;
            point.targetActivation = t;

            if (point.distToMouse > 1) {
                point.x += (dx / point.distToMouse) * t * 5;
                point.y += (dy / point.distToMouse) * t * 5;
            }
        } else {
            point.targetActivation = 0;
        }

        point.currentSize += (point.targetSize - point.currentSize) * 0.07;
        point.currentAlpha += (point.targetAlpha - point.currentAlpha) * 0.04;
        point.activation += (point.targetActivation - point.activation) * 0.1;
    });

    updateConnections();
    drawConnections();

    gridPoints.forEach(point => {
        const size = Math.max(0.3, Math.min(3.5, point.currentSize));
        const alpha = Math.max(0.02, Math.min(0.3, point.currentAlpha));

        if (size > 0.6) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, size * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = dotGlow.replace(/[\d.]+\)$/, (alpha * 0.1).toFixed(3) + ')');
            ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = dotColor.replace(/[\d.]+\)$/, alpha.toFixed(3) + ')');
        ctx.fill();

        if (point.activation > 0.2) {
            const hue = (point.distToMouse * 0.8 + time * 0.15) % 360;
            ctx.beginPath();
            ctx.arc(point.x, point.y, size * 3.5, 0, Math.PI * 2);
            ctx.fillStyle = getChromeColor(hue, point.activation * 0.1);
            ctx.fill();
        }
    });

    time++;
    requestAnimationFrame(draw);
}

// ========================================
// 导航高亮
// ========================================

function updateNavHighlight() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    requestAnimationFrame(updateNavHighlight);
}

// ========================================
// 初始化
// ========================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

initGridPoints();
resize();

if (!prefersReducedMotion) {
    draw();
}

updateNavHighlight();

// ========================================
// 秘技入口 - 上上下下左右左右ABAB
// ========================================

const konamiCode = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'KeyA', 'KeyB', 'KeyA', 'KeyB'
];
let konamiIndex = 0;
let konamiTimer = null;

document.addEventListener('keydown', (e) => {
    // 只在首页生效
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' && !window.location.pathname.endsWith('/')) {
        return;
    }

    // 检查是否匹配当前步骤
    if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++;

        // 清除之前的计时器
        if (konamiTimer) clearTimeout(konamiTimer);

        // 3秒内无输入则重置
        konamiTimer = setTimeout(() => {
            konamiIndex = 0;
        }, 3000);

        // 完成秘技
        if (konamiIndex === konamiCode.length) {
            konamiIndex = 0;
            // 闪光效果
            document.body.style.transition = 'filter 0.3s';
            document.body.style.filter = 'brightness(2)';
            setTimeout(() => {
                document.body.style.filter = 'brightness(1)';
                setTimeout(() => {
                    window.location.href = 'hidden.html';
                }, 300);
            }, 200);
        }
    } else {
        // 不匹配则重置
        konamiIndex = 0;
        if (konamiTimer) clearTimeout(konamiTimer);
    }
});
