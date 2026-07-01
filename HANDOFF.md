# Handoff — Personal Site & Resume Pipeline

## Project State (2026-07-01)

### Files
| File | Purpose |
|------|---------|
| `index.html` | Main site (dark, brittanychiang.com style) |
| `style.css` | All styles |
| `script.js` | Language toggle + spotlight + nav highlight |
| `resume.html` | Academic CV HTML (gitignored, generated) |
| `resume.pdf` | Academic CV PDF (gitignored, 2-page A4) |
| `worldline.html` | Research timeline visualization (Steins;Gate style) |
| `scripts/generate-resume.cjs` | Extract structured JSON from index.html |
| `.claude/skills/resume-generator/SKILL.md` | `/resume-generator` skill |

### Resume Pipeline
```
node scripts/generate-resume.cjs → JSON → LLM fills resume.html → Playwright → resume.pdf
```
Or invoke `/resume-generator` skill.

### Pending on Worldline
User has more research narrative to add (Track α/β details after the 2025 split). Current `worldline.html` covers:
- 2023 Biochem → 2024 Psych/PKU6th → 2024 Plastic Surgery → 2025 Aerospace → Track Split → 2026

### Next: Windows Machine
```bash
git clone git@github.com:sagirimo/sagirimo.github.io.git
cd sagirimo.github.io
```

Then tell Claude:
> 继续 worldline.html 的科研路线图。我已经讲了 2023 到 2025 年分叉前的内容，接下来要补充 Track α (临床研究/骨科) 和 Track β (计算/AI) 的详细内容。先读一下 worldline.html 了解现有结构，然后等我继续讲。
