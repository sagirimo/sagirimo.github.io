---
name: resume-generator
description: Generate a formal academic PDF resume from the latest website content. Use when the user needs a CV/resume for PhD applications, professor outreach, or formal academic purposes.
---

# Resume Generator

Generate a polished academic PDF resume from the personal website's latest content.

## Workflow

### Step 1: Extract Data
```bash
node scripts/generate-resume.cjs > /tmp/resume-data.json
```
Read the output JSON to get all research items, publications, and personal info.

### Step 2: Ask User Preferences
Ask the user:
1. **Language**: English only, Chinese only, or bilingual?
2. **Audience**: PhD application, professor introduction (套磁), or general academic?
3. **Length preference**: 1 page compact or 2 pages with full detail? (default: 1 page for 套磁, 2 pages for PhD application)

### Step 3: Generate Resume HTML
Get today's date (YYYY-MM-DD format). Create the output directory and files at:
- `resumes/YYYY-MM-DD/CV_Pengyu_Zhan.html`
- `resumes/YYYY-MM-DD/CV_Pengyu_Zhan.pdf`

Do NOT create any files in the project root. Use the guidelines below:

**Design (Academic CV Standard):**
- Clean, minimal, black text on white background
- Font: use system fonts (`-apple-system, 'Inter', 'Helvetica Neue', Arial, sans-serif`)
- Print-optimized: A4 size, margins for printing
- No colors except for hyperlinks (subtle blue)
- Section dividers: thin horizontal rules or subtle borders
- Print CSS: `@media print { ... }` with proper page breaks

**Header:**
- Name (large, bold)
- Email, GitHub, Google Scholar, LinkedIn — as clickable links
- No phone number (user can add manually if needed)

**Sections (in order):**

1. **Research Interests** — 2-3 lines synthesized from the About section
2. **Education** — Peking University Health Science Center, Clinical Medicine (Bachelor of Medicine, 2022–Present). Include location: Beijing, China.
3. **Research Experience** — Condense the 8 website items. For each:
   - Project title (bold)
   - Affiliation + dates (right-aligned or inline)
   - 1-3 bullet points describing contributions, methods, and outcomes
   - Keep bullets concise — focus on what was achieved, methods used, and impact
   - For early-stage projects, mention the direction and methodology
4. **Publications** — Full citations in standard academic format. Bold your name (Zhan P) in author lists where applicable.
5. **Skills** — Categorize: **Computational** (Python, PyTorch, PointNet++, Diffusion Models, etc.) and **Clinical** (Robotic Surgery, UKA, ACL, CT Planning, RCT Design, etc.)
6. **Languages** — Chinese (Native), English (TOEFL iBT: 5.0/6.0)

**Content Guidelines:**
- Use the extracted JSON data — don't make up new achievements
- For research descriptions, condense to 1-3 bullet points (website descriptions are verbose)
- Highlight first-author positions, grant involvement (NSFC), and competition awards
- Remove "Early stage" caveats — present direction confidently
- For publications, use standard citation format: "Authors. Title. *Journal*, Year."
- Bold your name in author lists

### Step 4: Generate PDF
Use Node.js + Playwright to convert the HTML to PDF. Replace `YYYY-MM-DD` with today's date:

```js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const absPath = path.resolve('resumes/YYYY-MM-DD/CV_Pengyu_Zhan.html').split(path.sep).join('/');
  await page.goto('file:///' + absPath, { waitUntil: 'networkidle' });
  await page.pdf({
    path: 'resumes/YYYY-MM-DD/CV_Pengyu_Zhan.pdf',
    format: 'A4',
    printBackground: false,
    margin: { top: '0.6in', bottom: '0.6in', left: '0.7in', right: '0.7in' }
  });
  await browser.close();
  console.log('PDF saved');
})();
```

Run via: `node -e "<above code>"`

Verify the PDF was created: check file size > 0

### Step 5: Summary
Tell the user:
- Where the files are: `resumes/YYYY-MM-DD/CV_Pengyu_Zhan.html` and `.pdf`
- Page count
- Key sections included
- Remind them to add phone number if needed
