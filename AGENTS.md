# personal-site — Zhan Pengyu Academic Homepage

## Overview

- **Static HTML/CSS/JS** — no build step, no framework
- **GitHub Pages** repo: `sagirimo/sagirimo.github.io`
- Deploy: push to `main`, served at https://zhanpengyu.me (custom domain)

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main page — trilingual (EN/ZH/HK), bio, education, research |
| `ielts.html` | IELTS vocab database (cyberpunk ARASAKA theme) |
| `hidden.html` | Hidden personal page |
| `notes.html` | Notes viewer |
| `photos.html` | Photo gallery |
| `frutiger-aero.html` | Design demo page |
| `style-preview.html` | CSS style reference |
| `style.css` | All styles — Frutiger Aero aesthetic (glassmorphism, sky gradients, bubbles) |
| `script.js` | Client-side logic — canvas background, navigation, effects |
| `notes.json` | Personal notes (dated entries) |
| `vocabulary.json` | Medical English vocabulary with pronunciation |

## Conventions

- **Frutiger Aero** visual style: sky gradients, clouds, bubbles, glassmorphism, Inter font
- Trilingual content: English / 简体中文 / 粵文(香港)
- Photos under `photos/` — both full-size and thumbnail versions
- `aceternity-demo/` is an untracked experiment directory (not part of the site)
- No package.json, no build tools — edit and reload
