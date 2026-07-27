/* ============================================
   REZUMI - Personal Portfolio Website Builder
   Generate responsive portfolio sites from resumes
   ============================================ */

const PortfolioBuilder = {
    templates: {
        minimal: { name: 'Minimal', bg: '#ffffff', text: '#1a1a1a', accent: '#333333' },
        modern: { name: 'Modern', bg: '#0f172a', text: '#e2e8f0', accent: '#3b82f6' },
        corporate: { name: 'Corporate', bg: '#1e293b', text: '#f8fafc', accent: '#2563eb' },
        creative: { name: 'Creative', bg: '#1a1a2e', text: '#ffffff', accent: '#ec4899' },
        portfolio: { name: 'Portfolio', bg: '#111827', text: '#f3f4f6', accent: '#8b5cf6' },
        developer: { name: 'Developer', bg: '#0d1117', text: '#c9d1d9', accent: '#58a6ff' },
        designer: { name: 'Designer', bg: '#fafafa', text: '#18181b', accent: '#f43f5e' },
        student: { name: 'Student', bg: '#f0fdf4', text: '#14532d', accent: '#16a34a' },
        dark: { name: 'Dark', bg: '#000000', text: '#ffffff', accent: '#6366f1' },
        light: { name: 'Light', bg: '#ffffff', text: '#111827', accent: '#2563eb' }
    },

    selectedTemplate: 'modern',
    customization: {},

    open() {
        const resume = currentResumeData || Storage.getResumes().slice(-1)[0];
        if (!resume) {
            showToast('No resume data to build from. Create a resume first.', 'error');
            return;
        }
        
        // Ensure resume data is fully populated for portfolio
        this._resume = resume;

        openModal('Portfolio Website Builder', `
            <div>
                <div style="text-align:center;margin-bottom:16px;">
                    <div style="font-size:18px;font-weight:700;">Generate Your Portfolio</div>
                    <div style="font-size:12px;color:var(--text-secondary);">Build a personal website from your resume</div>
                </div>

                <!-- Template Selection -->
                <div style="margin-bottom:16px;">
                    <label style="font-size:12px;font-weight:600;">Choose Template</label>
                    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:6px;">
                        ${Object.entries(this.templates).map(([id, t]) => `
                            <div onclick="PortfolioBuilder.selectTemplate('${id}')" 
                                 style="padding:8px 4px;border-radius:var(--radius-sm);text-align:center;cursor:pointer;
                                        border:2px solid ${this.selectedTemplate === id ? 'var(--accent)' : 'var(--border-color)'};
                                        background:${t.bg};transition:0.2s;"
                                 onmouseenter="this.style.borderColor='var(--accent)'"
                                 onmouseleave="this.style.borderColor='${this.selectedTemplate === id ? 'var(--accent)' : 'var(--border-color)'}'">
                                <div style="width:20px;height:20px;border-radius:50%;background:${t.accent};margin:0 auto 4px;"></div>
                                <div style="font-size:9px;color:${t.text};font-weight:600;">${t.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Customization -->
                <div style="margin-bottom:16px;">
                    <label style="font-size:12px;font-weight:600;">Customize</label>
                    <div class="form-grid" style="margin-top:6px;">
                        <div class="form-group">
                            <label style="font-size:11px;">Accent Color</label>
                            <input type="color" class="form-input" id="portfolio-accent" value="${this.templates[this.selectedTemplate]?.accent || '#3b82f6'}" style="height:36px;padding:4px;" onchange="PortfolioBuilder.customization.accent=this.value">
                        </div>
                        <div class="form-group">
                            <label style="font-size:11px;">Font</label>
                            <select class="form-input" id="portfolio-font" style="font-size:12px;" onchange="PortfolioBuilder.customization.font=this.value">
                                <option value="Inter">Inter</option>
                                <option value="Georgia">Georgia (Serif)</option>
                                <option value="JetBrains Mono">Monospace</option>
                                <option value="system-ui">System</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Live Preview -->
                <div style="margin-bottom:16px;">
                    <label style="font-size:12px;font-weight:600;">Preview</label>
                    <div style="border:1px solid var(--border-color);border-radius:var(--radius-md);overflow:hidden;margin-top:6px;max-height:250px;overflow-y:auto;">
                        <div id="portfolio-preview" style="transform:scale(0.5);transform-origin:top left;width:200%;min-height:500px;">
                            ${this.generateHTML(resume)}
                        </div>
                    </div>
                </div>

                <!-- Section Controls -->
                <div style="margin-bottom:16px;">
                    <label style="font-size:12px;font-weight:600;">Sections</label>
                    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
                        ${['hero','about','skills','experience','education','projects','certifications','contact'].map(s => `
                            <label style="display:flex;align-items:center;gap:4px;font-size:11px;padding:4px 8px;background:var(--bg-card);border-radius:var(--radius-full);cursor:pointer;">
                                <input type="checkbox" checked data-section="${s}"> ${s}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <button class="btn btn-primary btn-full" onclick="PortfolioBuilder.download(resume)">
                    <i class="fas fa-download"></i> Download Website (ZIP)
                </button>
            </div>
        `, `<button class="btn btn-ghost" onclick="closeModal()">Close</button>
            <button class="btn btn-glass" onclick="PortfolioBuilder.previewFullscreen()"><i class="fas fa-expand"></i> Full Preview</button>`);
    },

    selectTemplate(id) {
        this.selectedTemplate = id;
        const resume = currentResumeData || Storage.getResumes().slice(-1)[0];
        if (resume) {
            const preview = document.getElementById('portfolio-preview');
            if (preview) preview.innerHTML = this.generateHTML(resume);
        }
        this.open();
    },

    generateHTML(resume) {
        const t = this.templates[this.selectedTemplate] || this.templates.modern;
        const accent = this.customization.accent || t.accent;
        const font = this.customization.font || 'Inter';
        const p = resume.profile || {};
        const skills = resume.skills || [];
        const exp = resume.experience || [];
        const edu = resume.education || [];
        const proj = resume.projects || [];
        const certs = resume.certifications || [];

        return `
        <div style="font-family:'${font}',sans-serif;background:${t.bg};color:${t.text};min-height:100vh;padding:0;margin:0;">
            <!-- Hero -->
            <section style="padding:80px 40px;text-align:center;position:relative;overflow:hidden;">
                <div style="position:absolute;inset:0;background:linear-gradient(135deg,${accent}15,transparent);pointer-events:none;"></div>
                <div style="position:relative;z-index:1;">
                    ${p.photo ? `<img src="${p.photo}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;margin-bottom:16px;border:3px solid ${accent};">` : `<div style="width:80px;height:80px;border-radius:50%;background:${accent};margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;color:white;">${(p.fullName || '?')[0]}</div>`}
                    <h1 style="font-size:36px;font-weight:800;margin-bottom:8px;">${p.fullName || 'Your Name'}</h1>
                    <p style="font-size:18px;opacity:0.8;">${p.jobTitle || 'Professional'}</p>
                    <div style="display:flex;justify-content:center;gap:12px;margin-top:16px;flex-wrap:wrap;">
                        ${p.email ? `<a href="mailto:${p.email}" style="color:${accent};text-decoration:none;font-size:13px;">${p.email}</a>` : ''}
                        ${p.linkedin ? `<a href="${p.linkedin}" style="color:${accent};text-decoration:none;font-size:13px;">LinkedIn</a>` : ''}
                        ${p.github ? `<a href="${p.github}" style="color:${accent};text-decoration:none;font-size:13px;">GitHub</a>` : ''}
                    </div>
                </div>
            </section>

            <!-- About -->
            ${p.summary ? `
            <section style="padding:40px;max-width:700px;margin:0 auto;">
                <h2 style="font-size:22px;font-weight:700;margin-bottom:12px;color:${accent};">About</h2>
                <p style="font-size:14px;line-height:1.7;opacity:0.85;">${p.summary}</p>
            </section>` : ''}

            <!-- Skills -->
            ${skills.length > 0 ? `
            <section style="padding:40px;">
                <h2 style="font-size:22px;font-weight:700;margin-bottom:16px;text-align:center;color:${accent};">Skills</h2>
                <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:600px;margin:0 auto;">
                    ${skills.map(s => `<span style="padding:6px 16px;background:${accent}15;border:1px solid ${accent}30;border-radius:20px;font-size:13px;color:${accent};">${s}</span>`).join('')}
                </div>
            </section>` : ''}

            <!-- Experience -->
            ${exp.length > 0 ? `
            <section style="padding:40px;max-width:700px;margin:0 auto;">
                <h2 style="font-size:22px;font-weight:700;margin-bottom:16px;color:${accent};">Experience</h2>
                ${exp.map(e => `
                    <div style="padding:16px;margin-bottom:12px;border-left:3px solid ${accent};padding-left:16px;">
                        <div style="font-weight:600;font-size:14px;">${e.role || ''}</div>
                        <div style="font-size:12px;opacity:0.7;">${e.company || ''} · ${e.startDate || ''}</div>
                        ${e.responsibilities ? `<div style="font-size:12px;margin-top:6px;opacity:0.8;white-space:pre-line;">${e.responsibilities.substring(0, 200)}</div>` : ''}
                    </div>
                `).join('')}
            </section>` : ''}

            <!-- Projects -->
            ${proj.length > 0 ? `
            <section style="padding:40px;max-width:700px;margin:0 auto;">
                <h2 style="font-size:22px;font-weight:700;margin-bottom:16px;color:${accent};">Projects</h2>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    ${proj.map(p => `
                        <div style="padding:16px;background:${t.text}08;border-radius:8px;border:1px solid ${t.text}15;">
                            <div style="font-weight:600;font-size:13px;margin-bottom:4px;">${p.name || ''}</div>
                            ${p.techStack ? `<div style="font-size:11px;color:${accent};margin-bottom:4px;">${p.techStack}</div>` : ''}
                            ${p.description ? `<div style="font-size:11px;opacity:0.7;">${p.description.substring(0, 100)}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </section>` : ''}

            <!-- Education -->
            ${edu.length > 0 ? `
            <section style="padding:40px;max-width:700px;margin:0 auto;">
                <h2 style="font-size:22px;font-weight:700;margin-bottom:16px;color:${accent};">Education</h2>
                ${edu.map(e => `
                    <div style="padding:12px;margin-bottom:8px;border-left:3px solid ${accent};padding-left:16px;">
                        <div style="font-weight:600;font-size:13px;">${e.degree || ''} ${e.course || ''}</div>
                        <div style="font-size:12px;opacity:0.7;">${e.institute || ''} · ${e.startYear || ''}-${e.endYear || ''}</div>
                    </div>
                `).join('')}
            </section>` : ''}

            <!-- Contact Footer -->
            <footer style="padding:40px;text-align:center;border-top:1px solid ${t.text}15;margin-top:40px;">
                <p style="font-size:12px;opacity:0.6;">© ${new Date().getFullYear()} ${p.fullName || ''} · Built with REZUMI</p>
            </footer>
        </div>`;
    },

    download(resume) {
        const data = resume || this._resume || currentResumeData;
        if (!data) { showToast('No data to export', 'error'); return; }
        const html = this.generateHTML(data);
        const t = this.templates[this.selectedTemplate] || this.templates.modern;
        const font = this.customization.font || 'Inter';

        const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resume.profile?.fullName || 'Portfolio'} - Personal Website</title>
    <link href="https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: '${font}', sans-serif; }
        a { color: ${t.accent}; }
        img { max-width: 100%; }
        @media (max-width: 768px) {
            section { padding: 24px 16px !important; }
            h1 { font-size: 24px !important; }
            h2 { font-size: 18px !important; }
            div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
    </style>
</head>
<body>
${html}
<script>
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
        });
    });
</script>
</body>
</html>`;

        // Download as HTML
        downloadFile(fullHTML, 'portfolio.html', 'text/html');

        // Also generate a basic CSS file
        const css = `/* Portfolio Styles - Generated by REZUMI */
:root {
    --bg: ${t.bg};
    --text: ${t.text};
    --accent: ${t.accent};
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: '${font}', sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
}

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

section { padding: 60px 40px; }

h1 { font-size: 42px; font-weight: 800; }
h2 { font-size: 28px; font-weight: 700; color: var(--accent); margin-bottom: 20px; }

@media (max-width: 768px) {
    section { padding: 32px 16px; }
    h1 { font-size: 28px; }
    h2 { font-size: 22px; }
}`;

        downloadFile(css, 'style.css', 'text/css');

        showToast('Portfolio website downloaded!', 'success');
    },

    previewFullscreen() {
        const resume = this._resume || currentResumeData || Storage.getResumes().slice(-1)[0];
        if (!resume) return;
        
        const html = this.generateHTML(resume);
        const t = this.templates[this.selectedTemplate] || this.templates.modern;
        
        openModal('Portfolio Preview', `
            <div style="margin:-16px;border-radius:0;overflow:hidden;max-height:70vh;overflow-y:auto;">
                ${html}
            </div>
        `, `<button class="btn btn-primary" onclick="PortfolioBuilder.download(ResumeVerification ? (currentResumeData || Storage.getResumes().slice(-1)[0]) : null)">Download</button>
            <button class="btn btn-ghost" onclick="closeModal()">Close</button>`);
    }
};

window.PortfolioBuilder = PortfolioBuilder;
