/**
 * 战鹏宇个人网站
 * 神经网络风格背景 + 视差滚动
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
let currentTheme = 'dark';
let currentLang = 'zh';

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

// 主题颜色 - 平衡的亮度
let dotColor = 'rgba(180, 175, 165, 0.025)';
let dotGlow = 'rgba(190, 185, 175, 0.04)';
let bgColorStart = { r: 10, g: 10, b: 10 };
let bgColorEnd = { r: 15, g: 15, b: 15 };

// ========================================
// 主题切换
// ========================================

function getSystemTheme() {
    // 默认使用白色主题
    return 'light';
}

function updateThemeColors() {
    if (currentTheme === 'light') {
        dotColor = 'rgba(80, 75, 65, 0.03)';
        dotGlow = 'rgba(100, 95, 85, 0.045)';
        bgColorStart = { r: 245, g: 243, b: 240 };
        bgColorEnd = { r: 235, g: 232, b: 227 };
    } else {
        dotColor = 'rgba(180, 175, 165, 0.025)';
        dotGlow = 'rgba(190, 185, 175, 0.04)';
        bgColorStart = { r: 10, g: 10, b: 10 };
        bgColorEnd = { r: 15, g: 15, b: 15 };
    }
}

function applyTheme(theme) {
    currentTheme = theme;
    root.setAttribute('data-theme', theme);
    updateThemeColors();
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

applyTheme(getSystemTheme());

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => applyTheme(currentTheme === 'dark' ? 'light' : 'dark'));
}

if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => applyTheme(e.matches ? 'dark' : 'light'));
}

// ========================================
// 语言切换
// ========================================

const langToggle = document.getElementById('lang-toggle');

function updateLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-zh]').forEach(el => el.textContent = el.getAttribute(`data-${lang}`));
    if (langToggle) langToggle.textContent = lang === 'zh' ? 'EN' : '中';
    document.documentElement.lang = lang === 'zh' ? 'zh' : 'en';
}

if (langToggle) langToggle.addEventListener('click', () => updateLanguage(currentLang === 'zh' ? 'en' : 'zh'));
updateLanguage('zh');

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

document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        targetMouseX = e.touches[0].clientX;
        targetMouseY = e.touches[0].clientY;
    }
});

document.addEventListener('touchend', () => {
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

// 镀铬色 - 五彩斑斓
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
                        p1: p1,
                        p2: p2,
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

    // 更新点
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
// 视差滚动 - 正常 Y 轴效果
// ========================================

function handleScrollEffects() {
    const scrollPos = window.pageYOffset;
    const windowHeight = window.innerHeight;

    const heroContent = document.querySelector('.hero-content');
    const scrollHint = document.querySelector('.scroll-hint');

    if (heroContent) {
        const progress = Math.min(1, scrollPos / (windowHeight * 0.4));
        heroContent.style.transform = `scale(${1 + progress * 0.4}) translateY(${scrollPos * 0.4}px)`;
        heroContent.style.opacity = Math.max(0, 1 - progress * 1.2);
    }

    if (scrollHint) scrollHint.style.opacity = Math.max(0, 1 - scrollPos / 70);

    document.querySelectorAll('.parallax-content').forEach((content, index) => {
        const rect = content.getBoundingClientRect();
        if (rect.top < windowHeight && rect.top > -rect.height) {
            const speed = 0.05 + (index % 3) * 0.02;
            content.style.transform = `translateY(${rect.top * speed}px)`;
            content.style.opacity = smoothstep(windowHeight, windowHeight * 0.4, rect.top);
        }
    });

    document.querySelectorAll('.section-title').forEach((title) => {
        const rect = title.getBoundingClientRect();
        if (rect.top < windowHeight && rect.top > -100) {
            title.style.transform = `translateX(${rect.top * 0.03}px)`;
        }
    });

    const hobbyGrid = document.querySelector('.hobby-grid');
    if (hobbyGrid) {
        const rect = hobbyGrid.getBoundingClientRect();
        if (rect.top < windowHeight && rect.bottom > 0) {
            const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
            hobbyGrid.style.transform = `perspective(900px) rotateX(${(progress - 0.5) * 2.5}deg)`;
        }
    }

    document.querySelectorAll('.timeline-item').forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < windowHeight * 0.85) {
            item.style.transform = 'translateX(0)';
        }
    });

    document.querySelectorAll('.project-card, .paper-card').forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < windowHeight && rect.top > -rect.height) {
            card.style.transform = `translateY(${rect.top * 0.025}px)`;
        }
    });

    document.querySelectorAll('.skill-category').forEach((cat) => {
        const rect = cat.getBoundingClientRect();
        if (rect.top < windowHeight * 0.9) {
            cat.style.transform = `scale(${1 + (windowHeight - rect.top) * 0.00008})`;
        }
    });

    requestAnimationFrame(handleScrollEffects);
}

// ========================================
// 初始化
// ========================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

initGridPoints();
resize();

if (!prefersReducedMotion) {
    draw();
    handleScrollEffects();
} else {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `rgb(${bgColorStart.r}, ${bgColorStart.g}, ${bgColorStart.b})`);
    gradient.addColorStop(1, `rgb(${bgColorEnd.r}, ${bgColorEnd.g}, ${bgColorEnd.b})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

const hero = document.getElementById('hero');
if (hero) {
    hero.style.opacity = '1';
    const heroContent = hero.querySelector('.hero-content');
    if (heroContent) heroContent.style.opacity = '1';
    document.querySelectorAll('.timeline-item').forEach(item => item.style.transform = 'translateX(-25px)');
}
