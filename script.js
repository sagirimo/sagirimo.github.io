/**
 * Zhan Pengyu - Personal Website
 * Neural Network Background + Tri-language Support + Style Switcher
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
let currentStyle = 'default'; // default, frutiger, glass

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
// 风格切换 (Default / Frutiger Aero / iOS 26 Glass)
// ========================================

const styleNames = ['default', 'frutiger', 'glass'];

function applyStyle(style) {
    currentStyle = style;
    root.setAttribute('data-style', style);

    // 更新风格切换按钮 title
    const styleBtn = document.getElementById('style-toggle');
    if (styleBtn) {
        styleBtn.title = `Style: ${style.charAt(0).toUpperCase() + style.slice(1)}`;
    }

    // Frutiger Aero 不需要主题切换
    const themeBtn = document.getElementById('theme-toggle');
    if (style === 'frutiger') {
        if (themeBtn) themeBtn.style.opacity = '0.3';
        if (themeBtn) themeBtn.style.pointerEvents = 'none';
        // 强制 light 主题用于 frutiger
        if (currentTheme === 'dark') {
            applyTheme('light');
        }
    } else {
        if (themeBtn) {
            themeBtn.style.opacity = '1';
            themeBtn.style.pointerEvents = '';
        }
    }

    // 激活/非激活 Frutiger Aero 动画元素
    const aeroElements = document.querySelectorAll('.aero-sun, .aero-ground, .aero-cloud, .aero-bubble');
    aeroElements.forEach(el => {
        if (style === 'frutiger') {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    // 保存到 localStorage
    localStorage.setItem('preferredStyle', style);
}

function cycleStyle() {
    const idx = styleNames.indexOf(currentStyle);
    const nextIdx = (idx + 1) % styleNames.length;
    applyStyle(styleNames[nextIdx]);
}

// 初始化风格
const savedStyle = localStorage.getItem('preferredStyle');
if (savedStyle && styleNames.includes(savedStyle)) {
    applyStyle(savedStyle);
} else {
    applyStyle('default');
}

const styleToggle = document.getElementById('style-toggle');
if (styleToggle) {
    styleToggle.addEventListener('click', cycleStyle);
}

// ========================================
// 主题切换
// ========================================

function updateThemeColors() {
    // Glass 风格用不同颜色
    if (currentStyle === 'glass') {
        if (currentTheme === 'dark') {
            dotColor = 'rgba(255, 255, 255, 0.015)';
            dotGlow = 'rgba(255, 255, 255, 0.02)';
            bgColorStart = { r: 8, g: 8, b: 12 };
            bgColorEnd = { r: 12, g: 12, b: 18 };
        } else {
            dotColor = 'rgba(0, 0, 0, 0.01)';
            dotGlow = 'rgba(0, 0, 0, 0.015)';
            bgColorStart = { r: 242, g: 242, b: 247 };
            bgColorEnd = { r: 229, g: 229, b: 234 };
        }
        return;
    }

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

    // 保存到 localStorage
    localStorage.setItem('preferredTheme', theme);
}

// 初始化主题
const savedTheme = localStorage.getItem('preferredTheme');
if (savedTheme && savedTheme !== 'dark' && savedTheme !== 'light') {
    // invalid value, use default
    applyTheme('light');
} else if (savedTheme) {
    // 如果是 frutiger 风格，强制 light
    if (currentStyle === 'frutiger') {
        applyTheme('light');
    } else {
        applyTheme(savedTheme);
    }
} else {
    applyTheme('light');
}

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        // Frutiger 不切换主题
        if (currentStyle === 'frutiger') return;
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
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

// ========================================
// 雅思词库入口 - 输入 "ielts"
// ========================================

const ieltsCode = 'ielts';
let ieltsBuffer = '';
let ieltsTimer = null;

document.addEventListener('keydown', (e) => {
    // 只在首页生效
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' && !window.location.pathname.endsWith('/')) {
        return;
    }

    // 忽略输入框内的按键
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    // 累积按键
    ieltsBuffer += e.key.toLowerCase();

    // 只保留最后5个字符
    if (ieltsBuffer.length > 5) {
        ieltsBuffer = ieltsBuffer.slice(-5);
    }

    // 清除之前的计时器
    if (ieltsTimer) clearTimeout(ieltsTimer);

    // 3秒内无输入则重置
    ieltsTimer = setTimeout(() => {
        ieltsBuffer = '';
    }, 3000);

    // 匹配成功
    if (ieltsBuffer === ieltsCode) {
        ieltsBuffer = '';
        // 终端风格绿光闪烁
        document.body.style.transition = 'filter 0.2s';
        document.body.style.filter = 'brightness(0.3) sepia(1) hue-rotate(70deg) saturate(3)';
        setTimeout(() => {
            document.body.style.filter = 'brightness(1.5)';
            setTimeout(() => {
                window.location.href = 'ielts.html';
            }, 200);
        }, 150);
    }
});

// ========================================
// 乱码解码动画效果
// ========================================

// 乱码字符池
const glitchChars = {
    en: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*',
    zh: '的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严',
    hk: '的一是在不了有和人這中大為上個國我以要他時來用們生到作地於出就分對成會可主發年動同工也能下過子說產種面而方後多定行學法所民得經十三之進著等部度家電力裡如水化高自二理起小物現實加量都兩體制機當使點從業本去把性好應開它合還因由其些然前外天政四日那社義事平形相全表間樣與關各重新線內數正心反你明看原又麼利比或但質氣第向道命此變條只沒結解問意建月公無系軍很情者最立代想已通並提直題黨程展五果料象員革位入常文總次品式活設及管特件長求老頭基資邊流路級少圖山統接知較將組見計別她手角期根論運農指幾九區強放決西被幹做必戰先回則任取據處隊南給色光門即保治北造百規熱領七海口東導器壓志世金增爭濟階油思術極交受聯什認六共權收證改清己美再采轉更單風切打白教速花帶安場身車例真務具萬每目至達走積示議聲報鬥完類八離華名確才科張信馬節話米整空元況今集溫傳土許步群廣石記需段研界拉林律叫且究觀越織裝影算低持音眾書布復容兒須際商非驗連斷深難近礦千周委素技備半辦青省列習響約支般史感勞便團往酸歷市克何除消構府稱太準精值號率族維劃選標寫存候毛親快效斯院查江型眼王按格養易置派層片始卻專狀育廠京識適屬圓包火住調滿縣局照參紅細引聽該鐵價嚴',
    symbols: '!@#$%^&*()_+-=[]{}|;:\'",.<>?/~`'
};

// 存储原始文本
const originalTexts = new WeakMap();
const decodedFlags = new WeakSet();

// 生成单个随机字符
function getRandomChar(originalChar, lang) {
    const pool = (lang === 'zh' ? glitchChars.zh :
                  lang === 'hk' ? glitchChars.hk :
                  glitchChars.en) + glitchChars.symbols;

    // 如果原字符是空格或特殊字符，保持不变
    if (originalChar === ' ' || originalChar === '\n' || originalChar === '\t') {
        return originalChar;
    }

    // 随机返回乱码或原字符
    return pool[Math.floor(Math.random() * pool.length)];
}

// 执行乱码解码动画
function animateDecode(element, originalText, lang) {
    if (decodedFlags.has(element)) return;
    decodedFlags.add(element);

    // 锁定元素高度，防止布局抖动
    const computedStyle = window.getComputedStyle(element);
    const originalHeight = element.offsetHeight;
    const originalLineHeight = computedStyle.lineHeight;
    element.style.minHeight = originalHeight + 'px';
    element.style.lineHeight = originalLineHeight;

    const duration = 400; // 总动画时长 ms (缩短一半)
    const interval = 16;  // 每帧间隔 ms (~60fps)
    const steps = duration / interval;

    let currentStep = 0;

    const animate = () => {
        currentStep++;
        const progress = currentStep / steps;

        // 计算当前应该显示的原字符数量
        const revealCount = Math.floor(originalText.length * progress);

        let result = '';
        for (let i = 0; i < originalText.length; i++) {
            const char = originalText[i];

            // 已解码的部分显示原字符
            if (i < revealCount) {
                result += char;
            }
            // 未解码的部分显示乱码
            else if (char !== ' ' && char !== '\n' && char !== '\t') {
                result += getRandomChar(char, lang);
            }
            else {
                result += char;
            }
        }

        element.textContent = result;

        if (currentStep < steps) {
            requestAnimationFrame(() => setTimeout(animate, interval));
        } else {
            // 确保最后显示完整文本，并恢复样式
            element.textContent = originalText;
            element.style.minHeight = '';
        }
    };

    animate();
}

// 初始化解码效果
function initDecodeEffect() {
    // 需要应用效果的元素选择器
    const selectors = [
        '.greeting', '.name', '.subtitle',
        '.section-title',
        '.about-text p', '.skill-name', '.skill-desc',
        '.timeline-title', '.timeline-company', '.timeline-desc',
        '.project-title', '.project-desc',
        '.paper-title', '.paper-journal', '.paper-status', '.paper-authors',
        '.interest-item span',
        '.contact-text',
        '.nav-link',
        '.logo-name', '.logo-title',
        '.note-title', '.note-content', '.note-date',
        '.thought-text', '.thought-quote', '.thought-date',
        '.hidden-warning'
    ];

    // 收集所有需要效果的元素
    const elements = document.querySelectorAll(selectors.join(', '));

    // 存储原始文本
    elements.forEach(el => {
        // 获取当前语言对应的文本属性
        const dataAttr = `data-${currentLang}`;
        const text = el.getAttribute(dataAttr) || el.textContent;
        originalTexts.set(el, { text, lang: currentLang });
    });

    // 创建 IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const stored = originalTexts.get(el);

                if (stored && !decodedFlags.has(el)) {
                    // 稍微延迟一下，让视觉效果更自然
                    setTimeout(() => {
                        animateDecode(el, stored.text, stored.lang);
                    }, Math.random() * 150);
                }

                // 解码后不再观察
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // 开始观察所有元素
    elements.forEach(el => observer.observe(el));
}

// 页面加载后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initDecodeEffect, 100);
    });
} else {
    setTimeout(initDecodeEffect, 100);
}

// 语言切换时重新应用效果
const originalUpdateLanguage = updateLanguage;
updateLanguage = function(lang) {
    // 先清除所有已解码标记
    document.querySelectorAll('[data-en]').forEach(el => {
        decodedFlags.delete(el);
    });

    // 调用原始函数
    originalUpdateLanguage(lang);

    // 重新存储文本
    const selectors = [
        '.greeting', '.name', '.subtitle',
        '.section-title',
        '.about-text p', '.skill-name', '.skill-desc',
        '.timeline-title', '.timeline-company', '.timeline-desc',
        '.project-title', '.project-desc',
        '.paper-title', '.paper-journal', '.paper-status', '.paper-authors',
        '.interest-item span',
        '.contact-text',
        '.nav-link',
        '.logo-name', '.logo-title',
        '.note-title', '.note-content', '.note-date',
        '.thought-text', '.thought-quote', '.thought-date',
        '.hidden-warning'
    ];

    document.querySelectorAll(selectors.join(', ')).forEach(el => {
        const dataAttr = `data-${lang}`;
        const text = el.getAttribute(dataAttr) || el.textContent;
        originalTexts.set(el, { text, lang });
    });

    // 重新初始化解码效果
    setTimeout(initDecodeEffect, 50);
};
