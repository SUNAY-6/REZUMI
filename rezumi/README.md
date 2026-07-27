<div align="center">

<!-- Logo -->
<img src="assets/logo-icon.svg" alt="REZUMI Logo" width="80" height="80" />

# 🚀 REZUMI

### **Create a Professional Resume in Under 2 Minutes**

*AI-Powered Smart Resume Builder with 30+ Premium Templates*

[![Version](https://img.shields.io/badge/version-2.0-blue?style=flat-square)]()
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)]()
[![Templates](https://img.shields.io/badge/templates-30+-purple?style=flat-square)]()
[![ATS](https://img.shields.io/badge/ATS-Optimized-brightgreen?style=flat-square)]()
[![Made with](https://img.shields.io/badge/made%20with-%E2%9D%A4-red?style=flat-square)]()

[Features](#-features) • [Quick Start](#-quick-start) • [Usage](#-usage-guide) • [FAQ](#-faq) • [Contributing](#-contributing)

</div>

---

## 📖 About

**REZUMI** is a premium, AI-powered resume builder that combines stunning UI/UX with intelligent resume generation. Designed to help job seekers create professional, ATS-optimized resumes in under 2 minutes — with reusable profile libraries, 30+ unique templates, AI suggestions, and pixel-perfect PDF export.

> Built with the design philosophy of products like Notion, Linear, Stripe, and Apple — every interaction is smooth, visually stunning, and highly functional.

---

## ✨ Features

### 🎯 Core Features

| Feature | Description |
|---------|-------------|
| ⚡ **Quick Resume** | Build a complete resume in under 2 minutes using saved profiles |
| ✍️ **Manual Builder** | Full split-screen editor with live preview and 30+ templates |
| 🤖 **AI Resume Builder** | Multi-step AI workflow with profile selection, review, and suggestions |
| 🎨 **30+ Templates** | Modern, Minimal, Corporate, Creative, Developer, ATS-Optimized & more |
| 📄 **Custom Templates** | Upload DOCX templates with `{{placeholder}}` auto-fill |
| 📚 **Data Library** | Reusable profiles, education, experience, skills, projects |
| ✏️ **Final Editor** | Edit anything before export — including template switching |
| 📥 **Pixel-Perfect Export** | PDF, DOCX, TXT — preserves all styling and fonts |
| 🌙 **3 Themes** | Dark, Light, and AMOLED with 6 accent colors |

### 🧠 AI Features

| Feature | Description |
|---------|-------------|
| 🧠 **AI Resume Review** | 0–100 rating with priority improvements and impact suggestions |
| 📊 **ATS Score Analyzer** | Compatibility score with keyword analysis and formatting checks |
| 📝 **Grammar Checker** | Spelling, grammar, punctuation, and tone with one-click fixes |
| ✉️ **Cover Letter Generator** | AI-generated, editable cover letters based on role & company |
| 💬 **Interview Preparation** | HR, Technical, Behavioral, Project & Role-specific questions |
| 📋 **AI CV Generator** | Academic, Research, Professional, International, Fresher & Experienced CVs |

### ☁️ Cloud & Premium

| Feature | Description |
|---------|-------------|
| ☁️ **Cloud Sync** | Google Login, sync across devices, backup & restore |
| 🔒 **Auto-Save** | Never lose your work — everything saves automatically |
| 📊 **Analytics** | Track resumes created, downloads, and ATS scores |
| 🔍 **Global Search** | Ctrl+K to search across all profiles, skills, and projects |
| ⌨️ **Keyboard Shortcuts** | Ctrl+N (new resume), Ctrl+S (save), Ctrl+E (export) |

---

## 📸 Screenshots

> *Screenshots coming soon*

| Home Dashboard | Quick Resume Builder | Template Gallery |
|:---:|:---:|:---:|
| *Screenshot* | *Screenshot* | *Screenshot* |

| Manual Builder | AI Builder | Final Editor |
|:---:|:---:|:---:|
| *Screenshot* | *Screenshot* | *Screenshot* |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Styling** | Custom CSS with Glassmorphism, Neumorphism, Gradients |
| **Animations** | CSS Animations, Canvas API (particles) |
| **Icons** | Font Awesome 6.5 |
| **Typography** | Inter, JetBrains Mono (Google Fonts) |
| **Export** | html2canvas 1.4.1, jsPDF 2.5.1 |
| **Storage** | localStorage (client-side) |
| **Architecture** | Single Page Application (SPA) |

---

## 📁 Folder Structure

```
rezumi/
├── index.html                  # Main SPA entry point
├── README.md                   # This file
│
├── assets/
│   └── logo-icon.svg           # REZUMI logo (SVG)
│
├── css/
│   ├── main.css                # Core styles, layout, components
│   ├── animations.css          # Splash screen & UI animations
│   ├── themes.css              # Dark, Light, AMOLED themes + accents
│   ├── components.css          # Reusable component styles
│   ├── resume-templates.css    # Resume template rendering + print CSS
│   └── tour.css                # Interactive tour guide styles
│
└── js/
    ├── storage.js              # localStorage data management
    ├── splash.js               # Splash screen with particle canvas
    ├── navigation.js           # SPA routing & page switching
    ├── 30-templates.js         # 30+ resume template renderers
    ├── builder.js              # Quick Resume (9-step wizard)
    ├── templates.js            # Templates page & custom upload
    ├── manual-builder.js       # Manual split-screen editor
    ├── library.js              # Data library (CRUD)
    ├── ai-builder.js           # Multi-step AI resume builder
    ├── preview.js              # Resume preview & pixel-perfect export
    ├── premium-features.js     # AI Review, ATS, Grammar, Cover Letter, etc.
    ├── theme.js                # Theme manager
    ├── utils.js                # Toast, modals, keyboard shortcuts
    ├── tour.js                 # Interactive website tour guide
    └── app.js                  # App initialization & sample data
```

---

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local HTTP server (any static file server)
- No build tools, no npm, no frameworks needed!

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/rezumi.git

# Navigate to the project
cd rezumi

# Start a local server (choose one)
python3 -m http.server 8080
# OR
npx serve .
# OR
php -S localhost:8080

# Open in browser
open http://localhost:8080
```

### Running Locally

1. Start the local server
2. Open `http://localhost:8080` in your browser
3. Watch the splash screen animation (~3 seconds)
4. The tour guide starts automatically for first-time users
5. Start building your resume!

---

## 📖 Usage Guide

### Quick Resume Workflow

```
Step 1: Select Profile    → Choose or create a personal profile
Step 2: Education         → Select education records from library
Step 3: Experience        → Select work experiences
Step 4: Skills            → Add skills (with AI suggestions)
Step 5: Projects          → Select projects to include
Step 6: Certifications    → Add certs and achievements
Step 7: Extra             → Languages, hobbies, internships
Step 8: Template          → Choose from 30+ templates
Step 9: Review & Edit     → Final review with edit buttons
        ↓
   Generate Resume → Preview → Final Edit → Export PDF
```

### AI Resume Builder Workflow

```
Step 1: Choose Profile    → Select whose data to use
Step 2: Review Data       → Review with AI Improve suggestions
Step 3: Target Role       → Enter job role, company, level
Step 4: AI Review         → See ATS Score, Grade, improvements
        ↓
   View Resume → Edit → Export
```

### Manual Builder Workflow

```
1. Open Manual Builder from nav
2. Edit sections: Personal, Summary, Experience, Education, Skills, Projects
3. Switch templates anytime via dropdown
4. See live preview on the right
5. Click Save → Preview → Final Edit → Export
```

---

## 🔄 Project Workflow

```
┌──────────────────────────────────────────────────────┐
│                    REZUMI WORKFLOW                     │
├──────────────────────────────────────────────────────┤
│                                                        │
│  ┌─────────┐    ┌──────────┐    ┌──────────────┐     │
│  │  Quick   │    │  Manual  │    │     AI       │     │
│  │  Resume  │    │ Builder  │    │   Builder    │     │
│  └────┬─────┘    └────┬─────┘    └──────┬───────┘     │
│       │                │                  │             │
│       └────────────────┼──────────────────┘             │
│                        │                                │
│                        ▼                                │
│              ┌──────────────────┐                       │
│              │  Data Library    │                       │
│              │  (Reusable Data) │                       │
│              └────────┬─────────┘                       │
│                       │                                 │
│                       ▼                                 │
│              ┌──────────────────┐                       │
│              │   30+ Templates  │                       │
│              │  (Any Template)  │                       │
│              └────────┬─────────┘                       │
│                       │                                 │
│                       ▼                                 │
│              ┌──────────────────┐                       │
│              │  Final Editor    │                       │
│              │  (Edit Anything) │                       │
│              └────────┬─────────┘                       │
│                       │                                 │
│                       ▼                                 │
│              ┌──────────────────┐                       │
│              │  Pixel-Perfect   │                       │
│              │  PDF/DOCX Export │                       │
│              └──────────────────┘                       │
│                                                        │
└──────────────────────────────────────────────────────┘
```

---

## ❓ FAQ

<details>
<summary><strong>Do I need an internet connection?</strong></summary>

The app works offline after the first load. Google Fonts and Font Awesome are loaded from CDN on first visit and cached by the browser. Export libraries (html2canvas, jsPDF) are also cached.
</details>

<details>
<summary><strong>Where is my data stored?</strong></summary>

All data is stored locally in your browser's `localStorage`. Nothing is sent to any server. Use Settings → Export to back up your data as JSON.
</details>

<details>
<summary><strong>How does the AI feature work?</strong></summary>

REZUMI uses built-in AI logic (rule-based suggestions, role-specific skill mapping, keyword optimization, grammar rules). No external API calls are made — everything runs locally in your browser.
</details>

<details>
<summary><strong>Can I use my own DOCX template?</strong></summary>

Yes! Go to Templates page → scroll to the bottom → click "Use Custom Template". Upload a DOCX file with placeholders like `{{Name}}`, `{{Skills}}`, `{{Experience}}`. REZUMI will auto-detect and map them.
</details>

<details>
<summary><strong>Is the PDF export really pixel-perfect?</strong></summary>

Yes! We use html2canvas to render the exact same HTML at 2x resolution, then embed it into jsPDF. Fonts, colors, icons, layouts, and multi-page support are all preserved.
</details>

<details>
<summary><strong>How do I restart the tour guide?</strong></summary>

After the tour, open browser DevTools console and type: `restartTour()`. Or clear localStorage for the site.
</details>

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Splash screen stuck** | Refresh the page. If persistent, clear browser cache. |
| **PDF export blank** | Ensure html2canvas CDN loaded (check network tab). Retry after 2 seconds. |
| **Templates blank** | Templates require saved profile data. Create a profile in Library first. |
| **Dark theme text invisible** | This was fixed in v2.0. Clear cache and reload. |
| **Data lost after clearing cache** | localStorage is cleared. Always export backup from Settings. |
| **Export libraries not loading** | Check internet connection. CDNs require one-time internet access. |

---

## 🔮 Future Enhancements

- [ ] Backend integration (Node.js + MongoDB)
- [ ] Real AI/LLM integration (GPT-4, Claude API)
- [ ] Real Google OAuth for cloud sync
- [ ] Team collaboration features
- [ ] Resume analytics dashboard (views, downloads)
- [ ] More templates (50+ total)
- [ ] Resume builder for specific industries
- [ ] Multi-language support (i18n)
- [ ] Progressive Web App (PWA) support
- [ ] Resume comparison tool
- [ ] Job application tracker

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Guidelines

- Follow existing code style and patterns
- Don't break existing functionality
- Add comments for complex logic
- Test thoroughly before submitting
- Keep PRs focused on a single change

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 REZUMI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 Author

**REZUMI Team**

- 🌐 Website: [rezumi.app](#)
- 📧 Email: [hello@rezumi.app](#)
- 🐦 Twitter: [@rezumi_app](#)
- 💼 LinkedIn: [REZUMI](#)
- 🐙 GitHub: [REZUMI](#)

---

## 🙏 Acknowledgements

- [html2canvas](https://html2canvas.hertzen.com/) — For pixel-perfect HTML-to-canvas rendering
- [jsPDF](https://github.com/parallax/jsPDF) — For PDF generation in the browser
- [Font Awesome](https://fontawesome.com/) — For beautiful icon library
- [Google Fonts](https://fonts.google.com/) — For Inter and JetBrains Mono typefaces
- [Notion](https://notion.so), [Linear](https://linear.app), [Stripe](https://stripe.com) — Design inspiration
- All open-source contributors who make tools like this possible

---

<div align="center">

**Made with ❤️ for job seekers everywhere**

*If REZUMI helped you land your dream job, consider ⭐ starring the repo!*

[⬆ Back to Top](#-rezumi)

</div>
