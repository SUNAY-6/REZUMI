/* ============================================
   REZUMI - Advanced Portfolio Builder
   5 Premium Animated Portfolio Templates
   ============================================ */

const PortfolioAdvanced = {
    templates: {
        minimal: {
            name: 'Minimal',
            desc: 'Clean whitespace-focused design',
            bg: '#ffffff', text: '#1a1a1a', accent: '#333333', font: 'Inter',
            animation: 'fade', heroStyle: 'center'
        },
        modern: {
            name: 'Modern',
            desc: 'Bold gradients with smooth scroll',
            bg: '#0f172a', text: '#e2e8f0', accent: '#3b82f6', font: 'Inter',
            animation: 'slide', heroStyle: 'split'
        },
        creative: {
            name: 'Creative',
            desc: 'Colorful with parallax effects',
            bg: '#1a1a2e', text: '#ffffff', accent: '#ec4899', font: 'Poppins',
            animation: 'zoom', heroStyle: 'full'
        },
        developer: {
            name: 'Developer',
            desc: 'Dark terminal-inspired aesthetic',
            bg: '#0d1117', text: '#c9d1d9', accent: '#58a6ff', font: 'JetBrains Mono',
            animation: 'type', heroStyle: 'terminal'
        },
        executive: {
            name: 'Executive',
            desc: 'Elegant serif with gold accents',
            bg: '#faf9f6', text: '#1a1a1a', accent: '#b45309', font: 'Playfair Display',
            animation: 'reveal', heroStyle: 'sidebar'
        }
    },

    selectedTemplate: 'modern',
    customization: {},
    visibleSections: { hero: true, about: true, skills: true, experience: true, education: true, projects: true, certifications: true, contact: true },

    open() {
        const resume = currentResumeData || Storage.getResumes().slice(-1)[0];
        if (!resume) { showToast('Create a resume first to build your portfolio', 'error'); return; }
        this._resume = resume;
        this.renderBuilder();
    },

    renderBuilder() {
        const t = this.templates[this.selectedTemplate];
        navigateTo('portfolio-builder');
        const page = document.getElementById('page-portfolio-builder');
        if (!page) return;

        page.innerHTML = `
        <div class="page-container">
            <div style="text-align:center;margin-bottom:24px;">
                <h1 style="font-size:28px;font-weight:800;"><i class="fas fa-globe" style="color:var(--accent);"></i> Advanced Portfolio Builder</h1>
                <p style="color:var(--text-secondary);">5 premium templates with animations & full offline export</p>
            </div>

            <!-- Template Selection -->
            <div style="margin-bottom:20px;">
                <div style="font-size:14px;font-weight:600;margin-bottom:10px;">Choose Template</div>
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;">
                    ${Object.entries(this.templates).map(([id, tpl]) => `
                        <div onclick="PortfolioAdvanced.selectTemplate('${id}')" 
                             style="padding:14px;border-radius:var(--radius-md);cursor:pointer;border:2px solid ${this.selectedTemplate === id ? 'var(--accent)' : 'var(--border-color)'};background:${tpl.bg};transition:0.2s;text-align:center;"
                             onmouseenter="this.style.borderColor='var(--accent)'"
                             onmouseleave="this.style.borderColor='${this.selectedTemplate === id ? 'var(--accent)' : 'var(--border-color)'}'">
                            <div style="font-size:24px;margin-bottom:6px;">${this._getIcon(id)}</div>
                            <div style="font-size:13px;font-weight:700;color:${tpl.text};">${tpl.name}</div>
                            <div style="font-size:10px;color:${tpl.text};opacity:0.7;margin-top:2px;">${tpl.desc}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Customization -->
            <div class="glass-card" style="padding:16px;margin-bottom:16px;">
                <div style="font-size:14px;font-weight:600;margin-bottom:12px;"><i class="fas fa-sliders-h" style="color:var(--accent);margin-right:6px;"></i>Customize</div>
                <div class="form-grid">
                    <div class="form-group">
                        <label style="font-size:11px;">Accent Color</label>
                        <input type="color" class="form-input" value="${this.customization.accent || t.accent}" onchange="PortfolioAdvanced.customization.accent=this.value;PortfolioAdvanced.refreshPreview()" style="height:36px;padding:4px;">
                    </div>
                    <div class="form-group">
                        <label style="font-size:11px;">Background</label>
                        <input type="color" class="form-input" value="${this.customization.bg || t.bg}" onchange="PortfolioAdvanced.customization.bg=this.value;PortfolioAdvanced.refreshPreview()" style="height:36px;padding:4px;">
                    </div>
                    <div class="form-group">
                        <label style="font-size:11px;">Text Color</label>
                        <input type="color" class="form-input" value="${this.customization.text || t.text}" onchange="PortfolioAdvanced.customization.text=this.value;PortfolioAdvanced.refreshPreview()" style="height:36px;padding:4px;">
                    </div>
                    <div class="form-group">
                        <label style="font-size:11px;">Font</label>
                        <select class="form-input" onchange="PortfolioAdvanced.customization.font=this.value;PortfolioAdvanced.refreshPreview()">
                            ${['Inter','Poppins','Playfair Display','JetBrains Mono','Georgia','system-ui'].map(f => 
                                `<option value="${f}" ${(this.customization.font || t.font) === f ? 'selected' : ''}>${f}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label style="font-size:11px;">Animation Style</label>
                        <select class="form-input" onchange="PortfolioAdvanced.customization.animation=this.value;PortfolioAdvanced.refreshPreview()">
                            ${['fade','slide','zoom','type','reveal','none'].map(a =>
                                `<option value="${a}" ${(this.customization.animation || t.animation) === a ? 'selected' : ''}>${a}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                <div style="margin-top:12px;font-size:12px;font-weight:600;">Visible Sections</div>
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
                    ${Object.entries(this.visibleSections).map(([k,v]) => `
                        <label style="display:flex;align-items:center;gap:4px;padding:4px 10px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-full);font-size:11px;cursor:pointer;">
                            <input type="checkbox" ${v ? 'checked' : ''} onchange="PortfolioAdvanced.visibleSections['${k}']=this.checked;PortfolioAdvanced.refreshPreview()"> ${k}
                        </label>
                    `).join('')}
                </div>
            </div>

            <!-- Live Preview -->
            <div style="margin-bottom:16px;">
                <div style="font-size:14px;font-weight:600;margin-bottom:8px;"><i class="fas fa-eye" style="color:var(--accent);margin-right:6px;"></i>Live Preview</div>
                <div style="border:1px solid var(--border-color);border-radius:var(--radius-md);overflow:hidden;max-height:500px;overflow-y:auto;">
                    <div id="portfolio-live-preview" style="transform:scale(0.55);transform-origin:top center;width:181%;min-height:900px;">
                        ${this._generateHTML(this._resume)}
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div style="display:flex;gap:10px;justify-content:center;">
                <button class="btn btn-primary btn-lg" onclick="PortfolioAdvanced.downloadZip()">
                    <i class="fas fa-download"></i> Download ZIP (Offline Website)
                </button>
                <button class="btn btn-glass btn-lg" onclick="PortfolioAdvanced.previewFullscreen()">
                    <i class="fas fa-expand"></i> Full Preview
                </button>
            </div>
        </div>`;
    },

    _getIcon(id) {
        const icons = { minimal: '⬜', modern: '🔷', creative: '🎨', developer: '💻', executive: '👔' };
        return icons[id] || '🌐';
    },

    selectTemplate(id) {
        this.selectedTemplate = id;
        const t = this.templates[id];
        this.customization = { accent: t.accent, bg: t.bg, text: t.text, font: t.font, animation: t.animation };
        this.renderBuilder();
    },

    refreshPreview() {
        const preview = document.getElementById('portfolio-live-preview');
        if (preview && this._resume) {
            preview.innerHTML = this._generateHTML(this._resume);
        }
    },

    _generateHTML(resume) {
        const t = this.templates[this.selectedTemplate];
        const accent = this.customization.accent || t.accent;
        const bg = this.customization.bg || t.bg;
        const text = this.customization.text || t.text;
        const font = this.customization.font || t.font;
        const anim = this.customization.animation || t.animation;
        const vis = this.visibleSections;
        const p = resume.profile || {};
        const skills = resume.skills || [];
        const exp = resume.experience || [];
        const edu = resume.education || [];
        const proj = resume.projects || [];
        const certs = resume.certifications || [];

        const animCSS = this._getAnimCSS(anim);

        let html = `<div style="font-family:'${font}',sans-serif;background:${bg};color:${text};min-height:100vh;margin:0;">`;
        
        // CSS
        html += `<style>${animCSS}
            .pf-section{padding:60px 40px;max-width:900px;margin:0 auto;}
            .pf-h2{font-size:28px;font-weight:800;margin-bottom:24px;color:${accent};}
            .pf-card{background:${bg};border:1px solid ${text}15;border-radius:12px;padding:20px;margin-bottom:12px;transition:transform 0.3s,box-shadow 0.3s;}
            .pf-card:hover{transform:translateY(-4px);box-shadow:0 8px 24px ${accent}20;}
            .pf-skill{display:inline-block;padding:6px 16px;margin:4px;border-radius:20px;font-size:13px;background:${accent}15;border:1px solid ${accent}30;color:${accent};}
            .pf-a{color:${accent};text-decoration:none;}
            .pf-a:hover{text-decoration:underline;}
            @media(max-width:768px){.pf-section{padding:32px 16px;}.pf-h2{font-size:22px;}}
        </style>`;

        // Hero
        if (vis.hero) {
            html += `<section class="pf-hero" style="padding:80px 40px;text-align:center;position:relative;overflow:hidden;">
                <div style="position:absolute;inset:0;background:linear-gradient(135deg,${accent}10,transparent);pointer-events:none;"></div>
                <div style="position:relative;z-index:1;" class="${anim === 'fade' ? 'pf-anim-fade' : anim === 'slide' ? 'pf-anim-slide' : anim === 'zoom' ? 'pf-anim-zoom' : ''}">
                    ${p.photo ? `<img src="${p.photo}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;margin-bottom:16px;border:4px solid ${accent};">` : `<div style="width:100px;height:100px;border-radius:50%;background:${accent};margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:800;color:white;">${(p.fullName||'?')[0]}</div>`}
                    <h1 style="font-size:42px;font-weight:800;margin-bottom:8px;">${p.fullName || 'Your Name'}</h1>
                    <p style="font-size:20px;opacity:0.8;">${p.jobTitle || 'Professional'}</p>
                    <div style="display:flex;justify-content:center;gap:16px;margin-top:20px;flex-wrap:wrap;">
                        ${p.email ? `<a href="mailto:${p.email}" class="pf-a">${p.email}</a>` : ''}
                        ${p.linkedin ? `<a href="${p.linkedin}" target="_blank" class="pf-a">LinkedIn</a>` : ''}
                        ${p.github ? `<a href="${p.github}" target="_blank" class="pf-a">GitHub</a>` : ''}
                        ${p.portfolio ? `<a href="${p.portfolio}" target="_blank" class="pf-a">Portfolio</a>` : ''}
                    </div>
                </div>
            </section>`;
        }

        // About
        if (vis.about && p.summary) {
            html += `<section class="pf-section ${anim === 'reveal' ? 'pf-anim-reveal' : ''}">
                <h2 class="pf-h2">About Me</h2>
                <p style="font-size:16px;line-height:1.8;opacity:0.9;max-width:700px;">${p.summary}</p>
            </section>`;
        }

        // Skills
        if (vis.skills && skills.length) {
            html += `<section class="pf-section">
                <h2 class="pf-h2">Skills</h2>
                <div style="display:flex;flex-wrap:wrap;gap:8px;">${skills.map(s => `<span class="pf-skill">${s}</span>`).join('')}</div>
            </section>`;
        }

        // Experience
        if (vis.experience && exp.length) {
            html += `<section class="pf-section">
                <h2 class="pf-h2">Experience</h2>
                ${exp.map(e => `<div class="pf-card">
                    <div style="font-weight:700;font-size:16px;">${e.role || ''}</div>
                    <div style="font-size:13px;color:${accent};margin:2px 0;">${e.company || ''}${e.location ? ' · ' + e.location : ''}</div>
                    <div style="font-size:11px;opacity:0.6;">${this._fmtDate(e.startDate)} – ${e.current ? 'Present' : this._fmtDate(e.endDate)}</div>
                    ${e.responsibilities ? `<div style="font-size:13px;margin-top:8px;line-height:1.6;opacity:0.85;white-space:pre-line;">${e.responsibilities.substring(0, 300)}</div>` : ''}
                </div>`).join('')}
            </section>`;
        }

        // Education
        if (vis.education && edu.length) {
            html += `<section class="pf-section">
                <h2 class="pf-h2">Education</h2>
                ${edu.map(e => `<div class="pf-card">
                    <div style="font-weight:700;">${e.degree || ''} ${e.course || ''}</div>
                    <div style="font-size:13px;color:${accent};">${e.institute || ''}</div>
                    <div style="font-size:11px;opacity:0.6;">${e.startYear || ''} – ${e.endYear || ''} ${e.cgpa ? '| ' + e.cgpa : ''}</div>
                </div>`).join('')}
            </section>`;
        }

        // Projects
        if (vis.projects && proj.length) {
            html += `<section class="pf-section">
                <h2 class="pf-h2">Projects</h2>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;">
                ${proj.map(p => `<div class="pf-card">
                    <div style="font-weight:700;font-size:15px;">${p.name || ''}</div>
                    ${p.techStack ? `<div style="font-size:12px;color:${accent};margin:4px 0;">${p.techStack}</div>` : ''}
                    ${p.description ? `<div style="font-size:13px;opacity:0.8;">${p.description.substring(0, 150)}</div>` : ''}
                </div>`).join('')}
                </div>
            </section>`;
        }

        // Certifications
        if (vis.certifications && certs.length) {
            html += `<section class="pf-section">
                <h2 class="pf-h2">Certifications</h2>
                ${certs.map(c => `<div class="pf-card" style="display:flex;align-items:center;gap:12px;">
                    <div style="width:40px;height:40px;border-radius:50%;background:${accent}15;display:flex;align-items:center;justify-content:center;color:${accent};flex-shrink:0;"><i class="fas fa-certificate"></i></div>
                    <div><div style="font-weight:600;">${c.name || ''}</div><div style="font-size:12px;opacity:0.7;">${c.org || ''} ${c.date ? '· ' + c.date : ''}</div></div>
                </div>`).join('')}
            </section>`;
        }

        // Contact
        if (vis.contact) {
            html += `<section class="pf-section" style="text-align:center;border-top:1px solid ${text}15;">
                <h2 class="pf-h2">Get In Touch</h2>
                <p style="font-size:15px;opacity:0.8;margin-bottom:20px;">Feel free to reach out for collaborations or opportunities.</p>
                <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
                    ${p.email ? `<a href="mailto:${p.email}" style="padding:10px 24px;background:${accent};color:white;border-radius:8px;text-decoration:none;font-weight:600;">Email Me</a>` : ''}
                    ${p.linkedin ? `<a href="${p.linkedin}" target="_blank" style="padding:10px 24px;border:2px solid ${accent};color:${accent};border-radius:8px;text-decoration:none;font-weight:600;">LinkedIn</a>` : ''}
                    ${p.github ? `<a href="${p.github}" target="_blank" style="padding:10px 24px;border:2px solid ${accent};color:${accent};border-radius:8px;text-decoration:none;font-weight:600;">GitHub</a>` : ''}
                </div>
            </section>`;
        }

        // Footer
        html += `<footer style="padding:24px;text-align:center;font-size:12px;opacity:0.5;border-top:1px solid ${text}10;">
            &copy; ${new Date().getFullYear()} ${p.fullName || ''} · Built with REZUMI
        </footer>`;

        html += `</div>`;
        return html;
    },

    _getAnimCSS(anim) {
        const base = `
            @keyframes pfFadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
            @keyframes pfSlideIn{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
            @keyframes pfZoomIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
            @keyframes pfReveal{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
            .pf-anim-fade{animation:pfFadeIn 0.8s ease forwards}
            .pf-anim-slide{animation:pfSlideIn 0.8s ease forwards}
            .pf-anim-zoom{animation:pfZoomIn 0.8s ease forwards}
            .pf-anim-reveal{animation:pfReveal 1s ease forwards}
        `;
        if (anim === 'type') {
            return base + `.pf-hero h1{border-right:3px solid currentColor;animation:pfBlink 0.8s step-end infinite;overflow:hidden;white-space:nowrap;width:0;animation:pfType 2s steps(30) forwards,pfBlink 0.8s step-end infinite 2s;}
            @keyframes pfType{from{width:0}to{width:100%}}@keyframes pfBlink{50%{border-color:transparent}}`;
        }
        return base;
    },

    _fmtDate(d) {
        if (!d) return '';
        try { const dt = new Date(d); return isNaN(dt.getTime()) ? d : dt.toLocaleDateString('en-US',{month:'short',year:'numeric'}); } catch { return d; }
    },

    downloadZip() {
        if (typeof JSZip === 'undefined') {
            showToast('Loading ZIP library...', 'info');
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            s.onload = () => this.downloadZip();
            document.head.appendChild(s);
            return;
        }

        const resume = this._resume;
        if (!resume) { showToast('No resume data', 'error'); return; }

        showToast('Building ZIP package...', 'info');
        const p = resume.profile || {};
        const accent = this.customization.accent || this.templates[this.selectedTemplate].accent;
        const bg = this.customization.bg || this.templates[this.selectedTemplate].bg;
        const text = this.customization.text || this.templates[this.selectedTemplate].text;
        const font = this.customization.font || this.templates[this.selectedTemplate].font;
        const anim = this.customization.animation || this.templates[this.selectedTemplate].animation;

        const html = this._generateHTML(resume);
        const css = this._generateCSS();
        const js = this._generateJS(anim);

        const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${p.fullName || 'Portfolio'} - Personal Website</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=${font.replace(/ /g,'+')}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
${html}
<script src="script.js"><\/script>
</body>
</html>`;

        const readme = `# ${p.fullName || 'Portfolio'} - Personal Website

Generated by REZUMI AI Resume Builder.

## How to Use
Simply open \`index.html\` in any web browser. No server required.

## Files
- \`index.html\` - Main page
- \`style.css\` - Styles and animations
- \`script.js\` - Interactions and scroll effects

## Customize
Edit \`style.css\` to change colors, fonts, and animations.

---
Built with ❤️ by REZUMI`;

        const zip = new JSZip();
        zip.file('index.html', fullHTML);
        zip.file('style.css', css);
        zip.file('script.js', js);
        zip.file('README.md', readme);

        // Save photo if exists
        if (p.photo) {
            try {
                const base64 = p.photo.split(',')[1];
                zip.file('assets/profile.jpg', base64, { base64: true });
            } catch(e) {}
        }

        zip.generateAsync({ type: 'blob' }).then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${(p.fullName || 'portfolio').replace(/\s+/g, '_')}_website.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('Portfolio ZIP downloaded! Open index.html offline.', 'success');
            Storage.incrementAnalytics('downloads');
        });
    },

    _generateCSS() {
        const t = this.templates[this.selectedTemplate];
        const accent = this.customization.accent || t.accent;
        const bg = this.customization.bg || t.bg;
        const text = this.customization.text || t.text;
        const font = this.customization.font || t.font;

        return `/* Portfolio Styles - Generated by REZUMI */
:root {
    --bg: ${bg};
    --text: ${text};
    --accent: ${accent};
    --font: '${font}', sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
}

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

img { max-width: 100%; height: auto; }

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
}

@keyframes zoomIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}

.animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

.animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
    .pf-section { padding: 32px 16px !important; }
    .pf-h2 { font-size: 22px !important; }
    h1 { font-size: 28px !important; }
    [style*="grid-template-columns: repeat(auto-fit"] { grid-template-columns: 1fr !important; }
}`;
    },

    _generateJS(anim) {
        return `/* Portfolio Interactions - Generated by REZUMI */
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Scroll reveal animation
    var sections = document.querySelectorAll('.pf-section');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(function(section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Card hover effects
    document.querySelectorAll('.pf-card').forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});`;
    },

    previewFullscreen() {
        const resume = this._resume;
        if (!resume) return;
        const html = this._generateHTML(resume);
        openModal('Portfolio Preview', `
            <div style="margin:-16px;border-radius:0;overflow:hidden;max-height:75vh;overflow-y:auto;">
                ${html}
            </div>
        `, `<button class="btn btn-primary" onclick="PortfolioAdvanced.downloadZip()"><i class="fas fa-download"></i> Download ZIP</button>
            <button class="btn btn-ghost" onclick="closeModal()">Close</button>`);
    }
};

window.PortfolioAdvanced = PortfolioAdvanced;
