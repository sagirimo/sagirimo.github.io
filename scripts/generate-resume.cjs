/**
 * Extract structured resume data from index.html
 * Usage: node scripts/generate-resume.cjs [index.html]
 * Output: JSON to stdout
 */

const fs = require('fs');
const path = require('path');

const htmlPath = process.argv[2] || path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

/**
 * Extract the value of a data-en attribute from an HTML element.
 * Falls back to textContent.
 */
function attrDataEn(el) {
    const m = el.match(/data-en="([^"]*?)"/);
    return m ? unescapeEntities(m[1]) : stripTags(el).trim();
}

function unescapeEntities(str) {
    return str
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'");
}

function stripTags(str) {
    return str.replace(/<[^>]*>/g, '');
}

function extractBetween(html, start, end) {
    const idx = html.indexOf(start);
    if (idx === -1) return '';
    const slice = html.slice(idx + start.length);
    const endIdx = slice.indexOf(end);
    if (endIdx === -1) return slice;
    return slice.slice(0, endIdx);
}

// ── Name ──
const nameMatch = html.match(/<h1 class="site-name"[^>]*>([^<]*)</);
const name = nameMatch ? nameMatch[1].trim() : '';

// ── Role ──
const roleMatch = html.match(/<p class="site-role"[^>]*data-en="([^"]*)"/);
const role = roleMatch ? unescapeEntities(roleMatch[1]) : '';

// ── Tagline ──
const taglineMatch = html.match(/<p class="site-tagline"[^>]*data-en="([^"]*)"/);
const tagline = taglineMatch ? unescapeEntities(taglineMatch[1]) : '';

// ── About paragraphs ──
const aboutSection = extractBetween(html, 'id="about"', '</section>');
const aboutParas = [];
const paraRegex = /<p[^>]*data-en="([^"]*?)"/g;
let pm;
while ((pm = paraRegex.exec(aboutSection)) !== null) {
    aboutParas.push(stripTags(unescapeEntities(pm[1])));
}

// ── Research items ──
const researchSection = extractBetween(html, 'id="research"', '</section>');
const expItems = researchSection.split('<div class="exp-item">').slice(1);

const research = expItems.map(item => {
    const dateMatch = item.match(/<span class="exp-date">([^<]*)</);
    const typeMatch = item.match(/<span class="exp-type"[^>]*data-en="([^"]*)"/);
    const titleMatch = item.match(/<h3 class="exp-title"[^>]*data-en="([^"]*)"/);
    const orgMatch = item.match(/<p class="exp-org"[^>]*data-en="([^"]*)"/);
    const descMatch = item.match(/<p class="exp-desc"[^>]*data-en="([^"]*)"/);

    const tags = [];
    const tagRegex = /<li>([^<]*)<\/li>/g;
    let tm;
    while ((tm = tagRegex.exec(item)) !== null) {
        tags.push(tm[1].trim());
    }

    return {
        date: dateMatch ? dateMatch[1].trim() : '',
        type: typeMatch ? unescapeEntities(typeMatch[1]) : '',
        title: titleMatch ? unescapeEntities(titleMatch[1]) : '',
        org: orgMatch ? unescapeEntities(orgMatch[1]) : '',
        description: descMatch ? unescapeEntities(descMatch[1]) : '',
        tags,
    };
});

// ── Publications ──
const pubSection = extractBetween(html, 'id="publications"', '</section>');
const pubItems = pubSection.split('<div class="pub-item">').slice(1);

const publications = pubItems.map(item => {
    const title = stripTags(item.match(/<p class="pub-title"[^>]*>([\s\S]*?)<\/p>/)?.[1] || '').trim();
    const metaMatch = item.match(/<p class="pub-meta"[^>]*data-en="([^"]*)"/);
    const meta = metaMatch ? unescapeEntities(metaMatch[1]) : '';
    return { title, meta };
});

// ── Contact info ──
const emailMatch = html.match(/mailto:([^"]+)/);
const email = emailMatch ? emailMatch[1] : '';

const githubMatch = html.match(/https:\/\/github\.com\/sagirimo/);
const github = githubMatch ? 'github.com/sagirimo' : '';

const linkedinMatch = html.match(/https:\/\/www\.linkedin\.com\/[^"]+/);
const linkedin = linkedinMatch ? linkedinMatch[0] : '';

const scholarMatch = html.match(/https:\/\/scholar\.google\.com\/citations[^"]+/);
const scholar = scholarMatch ? scholarMatch[0] : '';

// ── Output ──
const data = {
    name,
    role,
    tagline,
    about: aboutParas,
    contact: { email, github, linkedin, scholar },
    research,
    publications,
    extractedAt: new Date().toISOString(),
};

process.stdout.write(JSON.stringify(data, null, 2));
