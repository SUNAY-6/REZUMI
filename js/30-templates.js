/* ============================================
   REZUMI - 30+ Resume Templates
   Each has a unique layout, typography,
   colors, spacing, and section arrangement.
   ============================================ */

const ResumeTemplates = {
    // Registry of all templates
    registry: [
        { id: 'modern', name: 'Modern', category: 'modern', colors: '#1e3a5f / #2563eb', desc: 'Two-column, colored header, sidebar' },
        { id: 'minimal', name: 'Minimal', category: 'minimal', colors: '#1a1a1a / #9ca3af', desc: 'Clean centered single-column' },
        { id: 'corporate', name: 'Corporate', category: 'corporate', colors: '#1a1a2e / #4b5563', desc: 'Formal business layout' },
        { id: 'developer', name: 'Developer', category: 'developer', colors: '#10b981 / #1a1a1a', desc: 'Code-inspired monospace' },
        { id: 'creative', name: 'Creative', category: 'creative', colors: '#7c3aed / #ec4899', desc: 'Bold gradient header' },
        { id: 'ats', name: 'ATS Optimized', category: 'ats', colors: '#000000 / #374151', desc: 'Simple parseable format' },
        { id: 'executive', name: 'Executive', category: 'corporate', colors: '#1e293b / #475569', desc: 'Elegant serif typography' },
        { id: 'elegant', name: 'Elegant', category: 'modern', colors: '#78350f / #b45309', desc: 'Gold accent, refined spacing' },
        { id: 'professional', name: 'Professional', category: 'modern', colors: '#0f172a / #334155', desc: 'Balanced modern layout' },
        { id: 'compact', name: 'Compact', category: 'minimal', colors: '#374151 / #6b7280', desc: 'Dense information, small margins' },
        { id: 'timeline', name: 'Timeline', category: 'modern', colors: '#0891b2 / #06b6d4', desc: 'Vertical timeline for experience' },
        { id: 'infographic', name: 'Infographic', category: 'creative', colors: '#e11d48 / #f43f5e', desc: 'Visual skill bars, icons' },
        { id: 'twotone', name: 'Two-Tone', category: 'modern', colors: '#4338ca / #6366f1', desc: 'Split background tones' },
        { id: 'sidebar-left', name: 'Sidebar Left', category: 'modern', colors: '#1e40af / #3b82f6', desc: 'Left sidebar with dark bg' },
        { id: 'header-bar', name: 'Header Bar', category: 'corporate', colors: '#991b1b / #dc2626', desc: 'Full-width colored bar' },
        { id: 'classic', name: 'Classic', category: 'corporate', colors: '#1c1917 / #57534e', desc: 'Traditional serif resume' },
        { id: 'bold', name: 'Bold', category: 'creative', colors: '#7c2d12 / #ea580c', desc: 'Large typography, strong contrast' },
        { id: 'slim', name: 'Slim', category: 'minimal', colors: '#4b5563 / #9ca3af', desc: 'Narrow columns, generous whitespace' },
        { id: 'accented', name: 'Accented', category: 'modern', colors: '#065f46 / #059669', desc: 'Green accent lines and markers' },
        { id: 'gradient-header', name: 'Gradient Header', category: 'creative', colors: '#5b21b6 / #ec4899', desc: 'Full gradient header banner' },
        { id: 'minimal-dark', name: 'Minimal Dark', category: 'minimal', colors: '#111827 / #374151', desc: 'Dark sections on white' },
        { id: 'boxed', name: 'Boxed', category: 'modern', colors: '#1d4ed8 / #60a5fa', desc: 'Bordered sections, structured' },
        { id: 'split', name: 'Split', category: 'modern', colors: '#0e7490 / #22d3ee', desc: '50/50 two-tone split' },
        { id: 'centered', name: 'Centered', category: 'minimal', colors: '#6d28d9 / #8b5cf6', desc: 'Everything centered, symmetrical' },
        { id: 'technical', name: 'Technical', category: 'developer', colors: '#047857 / #10b981', desc: 'Skill categories, technical focus' },
        { id: 'startup', name: 'Startup', category: 'creative', colors: '#c026d3 / #e879f9', desc: 'Modern purple, dynamic sections' },
        { id: 'academic', name: 'Academic', category: 'corporate', colors: '#1e3a5f / #3b82f6', desc: 'Publications, research focus' },
        { id: 'freelancer', name: 'Freelancer', category: 'creative', colors: '#d97706 / #f59e0b', desc: 'Portfolio-style, project-heavy' },
        { id: 'leader', name: 'Leader', category: 'corporate', colors: '#1e293b / #64748b', desc: 'Executive summary, achievements' },
        { id: 'innovator', name: 'Innovator', category: 'creative', colors: '#be123c / #fb7185', desc: 'Asymmetric, modern design' },
    ],

    // Get template by ID
    get(id) {
        return this.registry.find(t => t.id === id) || this.registry[0];
    },

    // Render a template
    render(id, data) {
        const renderFn = this[`render_${id.replace(/-/g, '_')}`] || this.render_modern;
        return renderFn.call(this, data);
    },

    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    _header(data, styles = {}) {
        const p = data.profile || {};
        const contactItems = [];
        if (p.email) contactItems.push(`<span>${p.email}</span>`);
        if (p.phone) contactItems.push(`<span>${p.phone}</span>`);
        if (p.address) contactItems.push(`<span>${p.address}</span>`);
        if (p.linkedin) contactItems.push(`<span>LinkedIn</span>`);
        if (p.github) contactItems.push(`<span>GitHub</span>`);
        if (p.portfolio) contactItems.push(`<span>Portfolio</span>`);
        return { name: p.fullName || 'Your Name', title: p.jobTitle || '', contact: contactItems.join(''), summary: p.summary || '' };
    },

    _exp(data) {
        return (data.experience || []).map(e => {
            const start = this._fmtDate(e.startDate);
            const end = e.current ? 'Present' : this._fmtDate(e.endDate);
            const bullets = e.responsibilities ? this._bullets(e.responsibilities) : '';
            return { role: e.role || '', company: e.company || '', location: e.location || '', start, end, bullets, tech: e.techUsed || '' };
        });
    },

    _edu(data) {
        return (data.education || []).map(e => ({
            degree: e.degree || '', course: e.course || '', institute: e.institute || '',
            cgpa: e.cgpa || '', start: e.startYear || '', end: e.endYear || '', location: e.location || ''
        }));
    },

    _skills(data) { return data.skills || []; },
    _projects(data) {
        return (data.projects || []).map(p => ({
            name: p.name || '', desc: p.description || '', tech: p.techStack || '', role: p.role || '',
            github: p.github || '', demo: p.demo || ''
        }));
    },
    _certs(data) {
        return (data.certifications || []).map(c => ({ name: c.name || '', org: c.org || '', date: c.date || '' }));
    },
    _achievements(data) {
        return (data.achievements || []).map(a => ({ title: a.title || '', type: a.type || '', desc: a.description || '' }));
    },
    _languages(data) { return data.languages || []; },

    _fmtDate(d) {
        if (!d) return '';
        try { const dt = new Date(d); if (isNaN(dt.getTime())) return d; return dt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); } catch { return d; }
    },

    _bullets(text) {
        if (!text) return '';
        const lines = text.split(/\n|•|·/).map(l => l.trim()).filter(Boolean);
        if (lines.length <= 1) return text;
        return lines.map(l => `• ${l}`).join('\n');
    },

    _section(title, content) {
        return content ? `<div class="rt-section"><div class="rt-section-title">${title}</div>${content}</div>` : '';
    },

    // ============================================
    // TEMPLATE RENDERERS
    // ============================================

    // 1. MODERN
    render_modern(data) {
        const h = this._header(data); const exp = this._exp(data); const edu = this._edu(data);
        const sk = this._skills(data); const proj = this._projects(data); const certs = this._certs(data); const langs = this._languages(data);
        return `
        <div style="font-family:'Inter',sans-serif;color:#1a1a1a;">
            <div style="background:linear-gradient(135deg,#1e3a5f,#2563eb);padding:36px 40px;color:white;">
                <div style="font-size:30px;font-weight:800;margin-bottom:4px;">${h.name}</div>
                <div style="font-size:15px;opacity:0.9;margin-bottom:14px;">${h.title}</div>
                <div style="display:flex;flex-wrap:wrap;gap:14px;font-size:11px;opacity:0.85;">${h.contact}</div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 240px;">
                <div style="padding:24px 32px;">
                    ${h.summary ? this._section('Summary', `<div style="font-size:11.5px;line-height:1.6;color:#374151;">${h.summary}</div>`) : ''}
                    ${exp.length ? this._section('Experience', exp.map(e => `<div style="margin-bottom:14px;"><div style="font-size:13px;font-weight:600;">${e.role}</div><div style="font-size:11px;color:#6b7280;">${e.company}${e.location ? ' · '+e.location : ''}</div><div style="font-size:10px;color:#9ca3af;margin-bottom:3px;">${e.start} – ${e.end}</div>${e.bullets ? `<div style="font-size:11px;color:#374151;line-height:1.6;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')) : ''}
                    ${proj.length ? this._section('Projects', proj.map(p => `<div style="margin-bottom:10px;"><div style="font-size:12px;font-weight:600;">${p.name}</div>${p.tech ? `<div style="font-size:10px;color:#6b7280;">${p.tech}</div>` : ''}${p.desc ? `<div style="font-size:11px;color:#374151;margin-top:2px;">${p.desc}</div>` : ''}</div>`).join('')) : ''}
                </div>
                <div style="background:#f8f9fc;padding:24px 20px;border-left:1px solid #e5e7eb;">
                    ${sk.length ? this._section('Skills', `<div style="display:flex;flex-wrap:wrap;gap:5px;">${sk.map(s => `<span style="padding:3px 8px;background:#e8edf4;border-radius:3px;font-size:10px;color:#1e3a5f;">${s}</span>`).join('')}</div>`) : ''}
                    ${edu.length ? this._section('Education', edu.map(e => `<div style="margin-bottom:10px;"><div style="font-size:11px;font-weight:600;">${e.degree}${e.course ? ' – '+e.course : ''}</div><div style="font-size:10px;color:#6b7280;">${e.institute}</div>${e.cgpa ? `<div style="font-size:10px;color:#6b7280;">CGPA: ${e.cgpa}</div>` : ''}<div style="font-size:9px;color:#9ca3af;">${e.start} – ${e.end}</div></div>`).join('')) : ''}
                    ${certs.length ? this._section('Certifications', certs.map(c => `<div style="margin-bottom:6px;"><div style="font-size:10px;font-weight:600;">${c.name}</div><div style="font-size:9px;color:#6b7280;">${c.org}</div></div>`).join('')) : ''}
                    ${langs.length ? this._section('Languages', langs.map(l => `<div style="font-size:10px;margin-bottom:3px;">${l.name} <span style="color:#6b7280;">(${l.level})</span></div>`).join('')) : ''}
                </div>
            </div>
        </div>`;
    },

    // 2. MINIMAL
    render_minimal(data) {
        const h = this._header(data); const exp = this._exp(data); const edu = this._edu(data);
        const sk = this._skills(data); const proj = this._projects(data);
        return `
        <div style="font-family:'Inter',sans-serif;padding:48px 44px;color:#1a1a1a;">
            <div style="text-align:center;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid #e5e7eb;">
                <div style="font-size:26px;font-weight:300;letter-spacing:4px;text-transform:uppercase;">${h.name}</div>
                <div style="font-size:12px;color:#6b7280;letter-spacing:2px;text-transform:uppercase;margin-top:6px;">${h.title}</div>
                <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:14px;font-size:11px;color:#6b7280;margin-top:10px;">${h.contact}</div>
            </div>
            ${h.summary ? this._section('About', `<div style="font-size:11.5px;line-height:1.7;color:#374151;">${h.summary}</div>`) : ''}
            ${exp.length ? this._section('Experience', exp.map(e => `<div style="display:grid;grid-template-columns:100px 1fr;gap:14px;margin-bottom:14px;"><div style="font-size:10px;color:#9ca3af;padding-top:2px;">${e.start} — ${e.end}</div><div><div style="font-size:13px;font-weight:500;">${e.role}</div><div style="font-size:11px;color:#6b7280;">${e.company}</div>${e.bullets ? `<div style="font-size:11px;color:#374151;line-height:1.7;margin-top:4px;white-space:pre-line;">${e.bullets}</div>` : ''}</div></div>`).join('')) : ''}
            ${edu.length ? this._section('Education', edu.map(e => `<div style="display:grid;grid-template-columns:100px 1fr;gap:14px;margin-bottom:10px;"><div style="font-size:10px;color:#9ca3af;">${e.start} — ${e.end}</div><div><div style="font-size:12px;font-weight:500;">${e.degree} ${e.course}</div><div style="font-size:11px;color:#6b7280;">${e.institute}</div></div></div>`).join('')) : ''}
            ${proj.length ? this._section('Projects', proj.map(p => `<div style="display:grid;grid-template-columns:100px 1fr;gap:14px;margin-bottom:10px;"><div></div><div><div style="font-size:12px;font-weight:500;">${p.name}</div>${p.tech ? `<div style="font-size:10px;color:#6b7280;">${p.tech}</div>` : ''}${p.desc ? `<div style="font-size:11px;color:#374151;margin-top:2px;">${p.desc}</div>` : ''}</div></div>`).join('')) : ''}
            ${sk.length ? this._section('Skills', `<div style="font-size:11.5px;color:#374151;">${sk.join(' · ')}</div>`) : ''}
        </div>`;
    },

    // 3. CORPORATE
    render_corporate(data) {
        const h = this._header(data); const exp = this._exp(data); const edu = this._edu(data);
        const sk = this._skills(data); const proj = this._projects(data); const certs = this._certs(data);
        return `
        <div style="font-family:'Inter',sans-serif;padding:36px 40px;color:#1a1a1a;">
            <div style="border-bottom:3px solid #1a1a2e;padding-bottom:16px;margin-bottom:20px;">
                <div style="font-size:24px;font-weight:700;">${h.name.toUpperCase()}</div>
                <div style="font-size:13px;color:#4b5563;margin-top:3px;">${h.title}</div>
                <div style="display:flex;flex-wrap:wrap;gap:16px;font-size:11px;color:#6b7280;margin-top:8px;">${h.contact}</div>
            </div>
            ${h.summary ? this._section('Professional Summary', `<div style="font-size:11.5px;line-height:1.6;color:#374151;">${h.summary}</div>`) : ''}
            ${exp.length ? this._section('Professional Experience', exp.map(e => `<div style="margin-bottom:14px;"><div style="display:flex;justify-content:space-between;align-items:baseline;"><div style="font-size:12.5px;font-weight:600;">${e.role}</div><div style="font-size:10px;color:#9ca3af;">${e.start} – ${e.end}</div></div><div style="font-size:11px;color:#4b5563;font-style:italic;">${e.company}${e.location ? ' | '+e.location : ''}</div>${e.bullets ? `<div style="font-size:11px;color:#374151;line-height:1.6;margin-top:4px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')) : ''}
            ${edu.length ? this._section('Education', edu.map(e => `<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;"><div style="font-size:12px;font-weight:600;">${e.degree} ${e.course ? 'in '+e.course : ''}</div><div style="font-size:10px;color:#9ca3af;">${e.start} – ${e.end}</div></div><div style="font-size:11px;color:#4b5563;">${e.institute}${e.cgpa ? ' | CGPA: '+e.cgpa : ''}</div></div>`).join('')) : ''}
            ${sk.length ? this._section('Technical Skills', `<div style="font-size:11.5px;color:#374151;">${sk.join(' | ')}</div>`) : ''}
            ${proj.length ? this._section('Projects', proj.map(p => `<div style="margin-bottom:8px;"><div style="font-size:12px;font-weight:600;">${p.name}</div>${p.tech ? `<div style="font-size:10px;color:#4b5563;">${p.tech}</div>` : ''}${p.desc ? `<div style="font-size:11px;color:#374151;margin-top:2px;">${p.desc}</div>` : ''}</div>`).join('')) : ''}
            ${certs.length ? this._section('Certifications', certs.map(c => `<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><div style="font-size:11px;font-weight:600;">${c.name}</div><div style="font-size:10px;color:#9ca3af;">${c.date}</div></div><div style="font-size:10px;color:#4b5563;margin-bottom:6px;">${c.org}</div>`).join('')) : ''}
        </div>`;
    },

    // 4. DEVELOPER
    render_developer(data) {
        const h = this._header(data); const exp = this._exp(data); const edu = this._edu(data);
        const sk = this._skills(data); const proj = this._projects(data);
        return `
        <div style="font-family:'JetBrains Mono',monospace;padding:36px 40px;color:#1a1a1a;">
            <div style="margin-bottom:24px;">
                <div style="font-size:24px;font-weight:700;"><span style="color:#10b981;">&gt; </span>${h.name}</div>
                <div style="font-size:13px;color:#6b7280;margin-top:3px;">${h.title}</div>
                <div style="display:flex;flex-wrap:wrap;gap:10px;font-size:10px;margin-top:10px;">${h.contact.split('</span>').map(c => c ? `<span style="color:#6b7280;"><span style="color:#10b981;">// </span>${c.replace('<span>','')}</span>` : '').join('')}</div>
            </div>
            ${sk.length ? this._section('tech_stack', `<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:8px;">${sk.map(s => `<span style="padding:3px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:3px;font-size:10px;color:#166534;">${s}</span>`).join('')}</div>`, '#10b981') : ''}
            ${exp.length ? this._section('experience', exp.map(e => `<div style="margin-bottom:14px;padding-left:14px;border-left:2px solid #e5e7eb;"><div style="font-size:12px;font-weight:600;">${e.role}</div><div style="font-size:11px;color:#6b7280;">${e.company}</div><div style="font-size:10px;color:#9ca3af;">${e.start} – ${e.end}</div>${e.bullets ? `<div style="font-size:11px;color:#374151;line-height:1.6;margin-top:4px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join(''), '#10b981') : ''}
            ${proj.length ? this._section('projects', proj.map(p => `<div style="margin-bottom:10px;padding-left:14px;border-left:2px solid #e5e7eb;"><div style="font-size:12px;font-weight:600;">${p.name}</div>${p.tech ? `<div style="font-size:10px;color:#6b7280;">${p.tech}</div>` : ''}${p.desc ? `<div style="font-size:11px;color:#374151;margin-top:2px;">${p.desc}</div>` : ''}</div>`).join(''), '#10b981') : ''}
            ${edu.length ? this._section('education', edu.map(e => `<div style="margin-bottom:8px;padding-left:14px;border-left:2px solid #e5e7eb;"><div style="font-size:11px;font-weight:600;">${e.degree} ${e.course}</div><div style="font-size:10px;color:#6b7280;">${e.institute}</div><div style="font-size:10px;color:#9ca3af;">${e.start} – ${e.end}</div></div>`).join(''), '#10b981') : ''}
        </div>`;
    },

    // 5. CREATIVE
    render_creative(data) {
        const h = this._header(data); const exp = this._exp(data); const edu = this._edu(data);
        const sk = this._skills(data); const proj = this._projects(data);
        return `
        <div style="font-family:'Inter',sans-serif;color:#1a1a1a;">
            <div style="background:linear-gradient(135deg,#7c3aed,#ec4899);padding:44px 40px;color:white;position:relative;overflow:hidden;">
                <div style="position:absolute;top:-30%;right:-5%;width:200px;height:200px;background:rgba(255,255,255,0.05);border-radius:50%;"></div>
                <div style="font-size:34px;font-weight:900;margin-bottom:4px;">${h.name}</div>
                <div style="font-size:15px;font-weight:300;opacity:0.9;">${h.title}</div>
            </div>
            <div style="padding:28px 40px;">
                ${h.summary ? this._section('About Me', `<div style="font-size:11.5px;line-height:1.6;color:#374151;">${h.summary}</div>`, '#7c3aed') : ''}
                ${exp.length ? this._section('Experience', exp.map(e => `<div style="margin-bottom:14px;"><div style="font-size:13px;font-weight:600;">${e.role}</div><div style="font-size:11px;color:#7c3aed;">${e.company}</div><div style="font-size:10px;color:#9ca3af;">${e.start} – ${e.end}</div>${e.bullets ? `<div style="font-size:11px;color:#374151;line-height:1.6;margin-top:3px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join(''), '#7c3aed') : ''}
                ${proj.length ? this._section('Projects', proj.map(p => `<div style="margin-bottom:10px;"><div style="font-size:12px;font-weight:600;">${p.name}</div>${p.tech ? `<div style="font-size:10px;color:#7c3aed;">${p.tech}</div>` : ''}${p.desc ? `<div style="font-size:11px;color:#374151;margin-top:2px;">${p.desc}</div>` : ''}</div>`).join(''), '#7c3aed') : ''}
                ${sk.length ? this._section('Skills', `<div style="font-size:11.5px;color:#374151;">${sk.join(' · ')}</div>`, '#7c3aed') : ''}
                ${edu.length ? this._section('Education', edu.map(e => `<div style="margin-bottom:8px;"><div style="font-size:12px;font-weight:600;">${e.degree} ${e.course}</div><div style="font-size:11px;color:#6b7280;">${e.institute}</div><div style="font-size:10px;color:#9ca3af;">${e.start} – ${e.end}</div></div>`).join(''), '#7c3aed') : ''}
            </div>
        </div>`;
    },

    // 6. ATS
    render_ats(data) {
        const h = this._header(data); const exp = this._exp(data); const edu = this._edu(data);
        const sk = this._skills(data); const proj = this._projects(data); const certs = this._certs(data);
        return `
        <div style="font-family:'Inter',sans-serif;padding:36px 40px;color:#1a1a1a;">
            <div style="margin-bottom:20px;">
                <div style="font-size:22px;font-weight:700;">${h.name.toUpperCase()}</div>
                <div style="font-size:13px;color:#374151;margin-top:3px;">${h.title}</div>
                <div style="font-size:11px;color:#6b7280;margin-top:6px;line-height:1.6;">${h.contact}</div>
            </div>
            ${h.summary ? this._section('SUMMARY', `<div style="font-size:11.5px;line-height:1.7;color:#1a1a1a;">${h.summary}</div>`) : ''}
            ${sk.length ? this._section('SKILLS', `<div style="font-size:11.5px;color:#1a1a1a;">${sk.join(', ')}</div>`) : ''}
            ${exp.length ? this._section('EXPERIENCE', exp.map(e => `<div style="margin-bottom:12px;"><div style="display:flex;justify-content:space-between;"><div style="font-size:12px;font-weight:600;">${e.role} | ${e.company}</div><div style="font-size:10px;color:#6b7280;">${e.start} – ${e.end}</div></div>${e.bullets ? `<div style="font-size:11px;color:#1a1a1a;line-height:1.7;margin-top:3px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')) : ''}
            ${proj.length ? this._section('PROJECTS', proj.map(p => `<div style="margin-bottom:8px;"><div style="font-size:12px;font-weight:600;">${p.name}</div>${p.tech ? `<div style="font-size:10px;color:#374151;">Technologies: ${p.tech}</div>` : ''}${p.desc ? `<div style="font-size:11px;color:#1a1a1a;margin-top:2px;">${p.desc}</div>` : ''}</div>`).join('')) : ''}
            ${edu.length ? this._section('EDUCATION', edu.map(e => `<div style="margin-bottom:6px;"><div style="display:flex;justify-content:space-between;"><div style="font-size:12px;font-weight:600;">${e.degree} ${e.course} | ${e.institute}</div><div style="font-size:10px;color:#6b7280;">${e.start} – ${e.end}</div></div>${e.cgpa ? `<div style="font-size:10px;color:#374151;">CGPA: ${e.cgpa}</div>` : ''}</div>`).join('')) : ''}
            ${certs.length ? this._section('CERTIFICATIONS', certs.map(c => `<div style="font-size:11px;margin-bottom:3px;">${c.name} – ${c.org} (${c.date})</div>`).join('')) : ''}
        </div>`;
    },
};

// ============================================
// DYNAMIC TEMPLATE GENERATION FOR 7-30
// These templates are generated from base layouts
// with unique color schemes, typography, and spacing.
// ============================================

const TemplateVariants = {
    // Color palettes for each template
    palettes: {
        executive: { primary: '#1e293b', secondary: '#475569', bg: '#f8fafc', accent: '#1e293b' },
        elegant: { primary: '#78350f', secondary: '#b45309', bg: '#fffbeb', accent: '#92400e' },
        professional: { primary: '#0f172a', secondary: '#334155', bg: '#f1f5f9', accent: '#0f172a' },
        compact: { primary: '#374151', secondary: '#6b7280', bg: '#ffffff', accent: '#374151' },
        timeline: { primary: '#0891b2', secondary: '#06b6d4', bg: '#ecfeff', accent: '#0e7490' },
        infographic: { primary: '#e11d48', secondary: '#f43f5e', bg: '#fff1f2', accent: '#be123c' },
        twotone: { primary: '#4338ca', secondary: '#6366f1', bg: '#eef2ff', accent: '#4338ca' },
        'sidebar-left': { primary: '#1e40af', secondary: '#3b82f6', bg: '#dbeafe', accent: '#1e40af' },
        'header-bar': { primary: '#991b1b', secondary: '#dc2626', bg: '#fef2f2', accent: '#991b1b' },
        classic: { primary: '#1c1917', secondary: '#57534e', bg: '#fafaf9', accent: '#1c1917' },
        bold: { primary: '#7c2d12', secondary: '#ea580c', bg: '#fff7ed', accent: '#9a3412' },
        slim: { primary: '#4b5563', secondary: '#9ca3af', bg: '#ffffff', accent: '#4b5563' },
        accented: { primary: '#065f46', secondary: '#059669', bg: '#ecfdf5', accent: '#065f46' },
        'gradient-header': { primary: '#5b21b6', secondary: '#ec4899', bg: '#faf5ff', accent: '#7c3aed' },
        'minimal-dark': { primary: '#111827', secondary: '#374151', bg: '#f9fafb', accent: '#111827' },
        boxed: { primary: '#1d4ed8', secondary: '#60a5fa', bg: '#eff6ff', accent: '#1d4ed8' },
        split: { primary: '#0e7490', secondary: '#22d3ee', bg: '#ecfeff', accent: '#0e7490' },
        centered: { primary: '#6d28d9', secondary: '#8b5cf6', bg: '#f5f3ff', accent: '#6d28d9' },
        technical: { primary: '#047857', secondary: '#10b981', bg: '#f0fdf4', accent: '#047857' },
        startup: { primary: '#c026d3', secondary: '#e879f9', bg: '#fdf4ff', accent: '#a21caf' },
        academic: { primary: '#1e3a5f', secondary: '#3b82f6', bg: '#eff6ff', accent: '#1e3a5f' },
        freelancer: { primary: '#d97706', secondary: '#f59e0b', bg: '#fffbeb', accent: '#b45309' },
        leader: { primary: '#1e293b', secondary: '#64748b', bg: '#f8fafc', accent: '#1e293b' },
        innovator: { primary: '#be123c', secondary: '#fb7185', bg: '#fff1f2', accent: '#9f1239' },
    },

    // Generate render function for a template
    generate(id) {
        const p = this.palettes[id] || this.palettes.executive;
        
        // Different layout types
        const layouts = {
            executive: 'sidebar-right',
            elegant: 'centered-elegant',
            professional: 'sidebar-right',
            compact: 'single-compact',
            timeline: 'timeline',
            infographic: 'sidebar-right',
            twotone: 'twotone',
            'sidebar-left': 'sidebar-left',
            'header-bar': 'header-bar',
            classic: 'single-serif',
            bold: 'single-bold',
            slim: 'single-slim',
            accented: 'sidebar-right',
            'gradient-header': 'gradient-header',
            'minimal-dark': 'single-dark-sections',
            boxed: 'boxed',
            split: 'split',
            centered: 'centered',
            technical: 'sidebar-right',
            startup: 'gradient-header',
            academic: 'single-serif',
            freelancer: 'sidebar-left',
            leader: 'sidebar-right',
            innovator: 'asymmetric',
        };

        const layout = layouts[id] || 'sidebar-right';
        
        return function(data) {
            const h = ResumeTemplates._header(data);
            const exp = ResumeTemplates._exp(data);
            const edu = ResumeTemplates._edu(data);
            const sk = ResumeTemplates._skills(data);
            const proj = ResumeTemplates._projects(data);
            const certs = ResumeTemplates._certs(data);
            const langs = ResumeTemplates._languages(data);
            const ach = ResumeTemplates._achievements(data);

            // Build based on layout type
            switch(layout) {
                case 'sidebar-right': return buildSidebarRight(h, exp, edu, sk, proj, certs, langs, p, id);
                case 'sidebar-left': return buildSidebarLeft(h, exp, edu, sk, proj, certs, langs, p, id);
                case 'centered-elegant': return buildCenteredElegant(h, exp, edu, sk, proj, certs, langs, p);
                case 'single-compact': return buildSingleCompact(h, exp, edu, sk, proj, certs, p);
                case 'timeline': return buildTimeline(h, exp, edu, sk, proj, p);
                case 'twotone': return buildTwotone(h, exp, edu, sk, proj, certs, p);
                case 'header-bar': return buildHeaderBar(h, exp, edu, sk, proj, certs, p);
                case 'single-serif': return buildSingleSerif(h, exp, edu, sk, proj, certs, p);
                case 'single-bold': return buildSingleBold(h, exp, edu, sk, proj, p);
                case 'single-slim': return buildSingleSlim(h, exp, edu, sk, proj, p);
                case 'gradient-header': return buildGradientHeader(h, exp, edu, sk, proj, certs, p);
                case 'single-dark-sections': return buildSingleDark(h, exp, edu, sk, proj, p);
                case 'boxed': return buildBoxed(h, exp, edu, sk, proj, certs, p);
                case 'split': return buildSplit(h, exp, edu, sk, proj, certs, p);
                case 'centered': return buildCentered(h, exp, edu, sk, proj, certs, p);
                case 'asymmetric': return buildAsymmetric(h, exp, edu, sk, proj, certs, p);
                default: return buildSidebarRight(h, exp, edu, sk, proj, certs, langs, p, id);
            }
        };
    }
};

// ============================================
// LAYOUT BUILDERS
// ============================================

function buildSidebarRight(h, exp, edu, sk, proj, certs, langs, p, id) {
    const st = (title, content, color) => content ? `<div style="margin-bottom:18px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${color||p.primary};border-bottom:1.5px solid ${color||p.primary};padding-bottom:4px;margin-bottom:10px;">${title}</div>${content}</div>` : '';
    
    return `<div style="font-family:'Inter',sans-serif;color:#1a1a1a;">
        <div style="background:${p.primary};padding:32px 36px;color:white;">
            <div style="font-size:28px;font-weight:800;margin-bottom:3px;">${h.name}</div>
            <div style="font-size:14px;opacity:0.85;margin-bottom:12px;">${h.title}</div>
            <div style="display:flex;flex-wrap:wrap;gap:12px;font-size:10px;opacity:0.8;">${h.contact}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 220px;">
            <div style="padding:22px 28px;">
                ${h.summary ? st('Summary', `<div style="font-size:11px;line-height:1.6;color:#374151;">${h.summary}</div>`) : ''}
                ${exp.length ? st('Experience', exp.map(e => `<div style="margin-bottom:12px;"><div style="font-size:12px;font-weight:600;">${e.role}</div><div style="font-size:10px;color:${p.secondary};">${e.company}</div><div style="font-size:9px;color:#9ca3af;margin-bottom:2px;">${e.start} – ${e.end}</div>${e.bullets ? `<div style="font-size:10.5px;color:#374151;line-height:1.5;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')) : ''}
                ${proj.length ? st('Projects', proj.map(pr => `<div style="margin-bottom:8px;"><div style="font-size:11px;font-weight:600;">${pr.name}</div>${pr.tech ? `<div style="font-size:9px;color:${p.secondary};">${pr.tech}</div>` : ''}${pr.desc ? `<div style="font-size:10px;color:#374151;margin-top:2px;">${pr.desc}</div>` : ''}</div>`).join('')) : ''}
            </div>
            <div style="background:${p.bg};padding:22px 18px;border-left:1px solid #e5e7eb;">
                ${sk.length ? st('Skills', `<div style="display:flex;flex-wrap:wrap;gap:4px;">${sk.map(s => `<span style="padding:2px 7px;background:white;border:1px solid ${p.secondary}30;border-radius:3px;font-size:9px;color:${p.primary};">${s}</span>`).join('')}</div>`) : ''}
                ${edu.length ? st('Education', edu.map(e => `<div style="margin-bottom:8px;"><div style="font-size:10px;font-weight:600;">${e.degree} ${e.course}</div><div style="font-size:9px;color:#6b7280;">${e.institute}</div>${e.cgpa ? `<div style="font-size:9px;color:#6b7280;">${e.cgpa}</div>` : ''}<div style="font-size:8px;color:#9ca3af;">${e.start} – ${e.end}</div></div>`).join('')) : ''}
                ${certs.length ? st('Certifications', certs.map(c => `<div style="margin-bottom:5px;"><div style="font-size:9px;font-weight:600;">${c.name}</div><div style="font-size:8px;color:#6b7280;">${c.org}</div></div>`).join('')) : ''}
                ${langs.length ? st('Languages', langs.map(l => `<div style="font-size:9px;margin-bottom:2px;">${l.name} (${l.level})</div>`).join('')) : ''}
            </div>
        </div>
    </div>`;
}

function buildSidebarLeft(h, exp, edu, sk, proj, certs, langs, p, id) {
    const st = (title, content, color) => content ? `<div style="margin-bottom:16px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${color||'white'};margin-bottom:8px;">${title}</div>${content}</div>` : '';
    
    return `<div style="font-family:'Inter',sans-serif;color:#1a1a1a;display:grid;grid-template-columns:220px 1fr;">
        <div style="background:${p.primary};padding:32px 20px;color:white;">
            <div style="font-size:22px;font-weight:800;margin-bottom:3px;">${h.name}</div>
            <div style="font-size:12px;opacity:0.8;margin-bottom:20px;">${h.title}</div>
            <div style="font-size:9px;opacity:0.7;line-height:1.8;">${h.contact.split('</span>').join('<br>')}</div>
            <div style="margin-top:24px;">
                ${sk.length ? st('Skills', sk.map(s => `<div style="font-size:9px;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.1);">${s}</div>`).join('')) : ''}
                ${edu.length ? st('Education', edu.map(e => `<div style="margin-bottom:8px;"><div style="font-size:9px;font-weight:600;">${e.degree}</div><div style="font-size:8px;opacity:0.7;">${e.institute}</div></div>`).join('')) : ''}
                ${langs.length ? st('Languages', langs.map(l => `<div style="font-size:9px;margin-bottom:2px;">${l.name}</div>`).join('')) : ''}
            </div>
        </div>
        <div style="padding:32px 36px;">
            ${h.summary ? `<div style="font-size:11px;line-height:1.6;color:#374151;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #e5e7eb;">${h.summary}</div>` : ''}
            ${exp.length ? `<div style="margin-bottom:24px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${p.primary};margin-bottom:14px;border-bottom:2px solid ${p.primary};padding-bottom:4px;">Experience</div>${exp.map(e => `<div style="margin-bottom:14px;"><div style="font-size:12px;font-weight:600;">${e.role}</div><div style="font-size:10px;color:${p.secondary};">${e.company}</div><div style="font-size:9px;color:#9ca3af;">${e.start} – ${e.end}</div>${e.bullets ? `<div style="font-size:10.5px;color:#374151;line-height:1.5;margin-top:3px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')}</div>` : ''}
            ${proj.length ? `<div style="margin-bottom:24px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${p.primary};margin-bottom:14px;border-bottom:2px solid ${p.primary};padding-bottom:4px;">Projects</div>${proj.map(pr => `<div style="margin-bottom:10px;"><div style="font-size:11px;font-weight:600;">${pr.name}</div>${pr.tech ? `<div style="font-size:9px;color:${p.secondary};">${pr.tech}</div>` : ''}${pr.desc ? `<div style="font-size:10px;color:#374151;margin-top:2px;">${pr.desc}</div>` : ''}</div>`).join('')}</div>` : ''}
            ${certs.length ? `<div><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${p.primary};margin-bottom:10px;border-bottom:2px solid ${p.primary};padding-bottom:4px;">Certifications</div>${certs.map(c => `<div style="margin-bottom:5px;"><div style="font-size:10px;font-weight:600;">${c.name}</div><div style="font-size:9px;color:#6b7280;">${c.org}</div></div>`).join('')}</div>` : ''}
        </div>
    </div>`;
}

function buildCenteredElegant(h, exp, edu, sk, proj, certs, langs, p) {
    const st = (title, content) => content ? `<div style="margin-bottom:20px;text-align:center;"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:3px;color:${p.secondary};margin-bottom:10px;">— ${title} —</div>${content}</div>` : '';
    
    return `<div style="font-family:Georgia,serif;padding:44px 48px;color:#1a1a1a;">
        <div style="text-align:center;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid ${p.secondary}40;">
            <div style="font-size:30px;font-weight:400;letter-spacing:3px;color:${p.primary};">${h.name}</div>
            <div style="font-size:13px;color:${p.secondary};letter-spacing:2px;text-transform:uppercase;margin-top:8px;">${h.title}</div>
            <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:16px;font-size:11px;color:#6b7280;margin-top:12px;">${h.contact}</div>
        </div>
        ${h.summary ? st('Profile', `<div style="font-size:12px;line-height:1.8;color:#374151;max-width:500px;margin:0 auto;font-style:italic;">${h.summary}</div>`) : ''}
        ${exp.length ? st('Experience', exp.map(e => `<div style="margin-bottom:16px;text-align:left;max-width:520px;margin-left:auto;margin-right:auto;"><div style="font-size:13px;font-weight:600;color:${p.primary};">${e.role}</div><div style="font-size:11px;color:${p.secondary};font-style:italic;">${e.company} · ${e.start} – ${e.end}</div>${e.bullets ? `<div style="font-size:11px;color:#374151;line-height:1.7;margin-top:4px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')) : ''}
        ${edu.length ? st('Education', edu.map(e => `<div style="text-align:left;max-width:520px;margin:0 auto 8px;"><div style="font-size:12px;font-weight:600;">${e.degree} ${e.course}</div><div style="font-size:11px;color:#6b7280;">${e.institute}${e.cgpa ? ' · '+e.cgpa : ''}</div></div>`).join('')) : ''}
        ${sk.length ? st('Skills', `<div style="font-size:11px;color:#374151;">${sk.join(' · ')}</div>`) : ''}
        ${proj.length ? st('Projects', proj.map(pr => `<div style="text-align:left;max-width:520px;margin:0 auto 8px;"><div style="font-size:12px;font-weight:600;">${pr.name}</div>${pr.desc ? `<div style="font-size:10.5px;color:#374151;margin-top:2px;">${pr.desc}</div>` : ''}</div>`).join('')) : ''}
    </div>`;
}

function buildSingleCompact(h, exp, edu, sk, proj, certs, p) {
    const st = (title, content) => content ? `<div style="margin-bottom:10px;"><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${p.primary};border-bottom:1px solid #e5e7eb;padding-bottom:2px;margin-bottom:6px;">${title}</div>${content}</div>` : '';
    
    return `<div style="font-family:'Inter',sans-serif;padding:28px 32px;color:#1a1a1a;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid ${p.primary};">
            <div><div style="font-size:20px;font-weight:700;">${h.name}</div><div style="font-size:11px;color:#6b7280;">${h.title}</div></div>
            <div style="font-size:9px;color:#6b7280;text-align:right;line-height:1.6;">${h.contact.split('</span>').join('<br>')}</div>
        </div>
        ${h.summary ? st('', `<div style="font-size:10px;line-height:1.5;color:#374151;">${h.summary}</div>`) : ''}
        ${exp.length ? st('Experience', exp.map(e => `<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;"><span style="font-size:11px;font-weight:600;">${e.role}, ${e.company}</span><span style="font-size:9px;color:#9ca3af;">${e.start}–${e.end}</span></div>${e.bullets ? `<div style="font-size:10px;color:#374151;line-height:1.4;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')) : ''}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div>${edu.length ? st('Education', edu.map(e => `<div style="margin-bottom:6px;"><div style="font-size:10px;font-weight:600;">${e.degree}</div><div style="font-size:9px;color:#6b7280;">${e.institute} ${e.start}–${e.end}</div></div>`).join('')) : ''}</div>
            <div>${sk.length ? st('Skills', `<div style="display:flex;flex-wrap:wrap;gap:3px;">${sk.map(s => `<span style="padding:1px 5px;background:#f3f4f6;border-radius:2px;font-size:8px;">${s}</span>`).join('')}</div>`) : ''}</div>
        </div>
        ${proj.length ? st('Projects', proj.map(pr => `<div style="margin-bottom:5px;"><span style="font-size:10px;font-weight:600;">${pr.name}</span>${pr.tech ? ` <span style="font-size:8px;color:#6b7280;">[${pr.tech}]</span>` : ''}${pr.desc ? `<div style="font-size:9px;color:#374151;">${pr.desc}</div>` : ''}</div>`).join('')) : ''}
    </div>`;
}

function buildTimeline(h, exp, edu, sk, proj, p) {
    return `<div style="font-family:'Inter',sans-serif;padding:36px 40px;color:#1a1a1a;">
        <div style="text-align:center;margin-bottom:28px;">
            <div style="font-size:28px;font-weight:800;color:${p.primary};">${h.name}</div>
            <div style="font-size:13px;color:${p.secondary};margin-top:4px;">${h.title}</div>
            <div style="display:flex;justify-content:center;gap:14px;font-size:10px;color:#6b7280;margin-top:8px;">${h.contact}</div>
        </div>
        ${h.summary ? `<div style="font-size:11px;color:#374151;text-align:center;max-width:500px;margin:0 auto 24px;line-height:1.6;">${h.summary}</div>` : ''}
        ${exp.length ? `<div style="margin-bottom:24px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${p.primary};margin-bottom:16px;">Experience</div>
            <div style="border-left:2px solid ${p.secondary};padding-left:20px;margin-left:10px;">
                ${exp.map(e => `<div style="margin-bottom:16px;position:relative;"><div style="position:absolute;left:-27px;top:0;width:12px;height:12px;border-radius:50%;background:${p.primary};border:2px solid ${p.secondary};"></div><div style="font-size:12px;font-weight:600;">${e.role}</div><div style="font-size:10px;color:${p.secondary};">${e.company} · <span style="color:#9ca3af;">${e.start} – ${e.end}</span></div>${e.bullets ? `<div style="font-size:10.5px;color:#374151;line-height:1.5;margin-top:3px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')}
            </div>
        </div>` : ''}
        ${edu.length ? `<div style="margin-bottom:20px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${p.primary};margin-bottom:12px;">Education</div>
            <div style="border-left:2px solid ${p.secondary};padding-left:20px;margin-left:10px;">
                ${edu.map(e => `<div style="margin-bottom:10px;position:relative;"><div style="position:absolute;left:-27px;top:0;width:12px;height:12px;border-radius:50%;background:${p.primary};border:2px solid ${p.secondary};"></div><div style="font-size:11px;font-weight:600;">${e.degree} ${e.course}</div><div style="font-size:10px;color:#6b7280;">${e.institute} · ${e.start}–${e.end}</div></div>`).join('')}
            </div>
        </div>` : ''}
        ${sk.length ? `<div style="margin-bottom:16px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${p.primary};margin-bottom:8px;">Skills</div><div style="display:flex;flex-wrap:wrap;gap:5px;">${sk.map(s => `<span style="padding:3px 10px;border:1px solid ${p.secondary};border-radius:12px;font-size:10px;color:${p.primary};">${s}</span>`).join('')}</div></div>` : ''}
        ${proj.length ? `<div><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${p.primary};margin-bottom:10px;">Projects</div>${proj.map(pr => `<div style="margin-bottom:8px;"><div style="font-size:11px;font-weight:600;">${pr.name}</div>${pr.desc ? `<div style="font-size:10px;color:#374151;">${pr.desc}</div>` : ''}</div>`).join('')}</div>` : ''}
    </div>`;
}

function buildTwotone(h, exp, edu, sk, proj, certs, p) {
    return `<div style="font-family:'Inter',sans-serif;color:#1a1a1a;">
        <div style="display:grid;grid-template-columns:1fr 1fr;">
            <div style="background:${p.primary};padding:36px 28px;color:white;">
                <div style="font-size:24px;font-weight:800;margin-bottom:4px;">${h.name}</div>
                <div style="font-size:12px;opacity:0.8;margin-bottom:20px;">${h.title}</div>
                <div style="font-size:9px;opacity:0.7;line-height:1.8;margin-bottom:24px;">${h.contact.split('</span>').join('<br>')}</div>
                ${sk.length ? `<div style="margin-bottom:20px;"><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;opacity:0.6;margin-bottom:8px;">Skills</div>${sk.map(s => `<div style="font-size:9px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1);">${s}</div>`).join('')}</div>` : ''}
                ${edu.length ? `<div><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;opacity:0.6;margin-bottom:8px;">Education</div>${edu.map(e => `<div style="margin-bottom:6px;"><div style="font-size:9px;font-weight:600;">${e.degree}</div><div style="font-size:8px;opacity:0.7;">${e.institute}</div></div>`).join('')}</div>` : ''}
            </div>
            <div style="padding:36px 28px;background:white;">
                ${h.summary ? `<div style="font-size:10.5px;line-height:1.6;color:#374151;margin-bottom:20px;">${h.summary}</div>` : ''}
                ${exp.length ? `<div style="margin-bottom:18px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${p.primary};margin-bottom:10px;">Experience</div>${exp.map(e => `<div style="margin-bottom:12px;"><div style="font-size:11px;font-weight:600;">${e.role}</div><div style="font-size:10px;color:${p.secondary};">${e.company}</div><div style="font-size:9px;color:#9ca3af;">${e.start} – ${e.end}</div>${e.bullets ? `<div style="font-size:10px;color:#374151;line-height:1.5;margin-top:2px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')}</div>` : ''}
                ${proj.length ? `<div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${p.primary};margin-bottom:10px;">Projects</div>${proj.map(pr => `<div style="margin-bottom:8px;"><div style="font-size:10px;font-weight:600;">${pr.name}</div>${pr.desc ? `<div style="font-size:9.5px;color:#374151;">${pr.desc}</div>` : ''}</div>`).join('')}</div>` : ''}
            </div>
        </div>
    </div>`;
}

function buildHeaderBar(h, exp, edu, sk, proj, certs, p) {
    return `<div style="font-family:'Inter',sans-serif;color:#1a1a1a;">
        <div style="background:${p.primary};padding:20px 36px;display:flex;justify-content:space-between;align-items:center;">
            <div style="color:white;"><div style="font-size:24px;font-weight:800;">${h.name}</div><div style="font-size:12px;opacity:0.85;">${h.title}</div></div>
            <div style="color:white;font-size:10px;opacity:0.8;text-align:right;line-height:1.6;">${h.contact.split('</span>').join('<br>')}</div>
        </div>
        <div style="padding:24px 36px;">
            ${h.summary ? `<div style="font-size:11px;line-height:1.6;color:#374151;margin-bottom:20px;padding:12px;background:${p.primary}08;border-left:3px solid ${p.primary};">${h.summary}</div>` : ''}
            ${exp.length ? `<div style="margin-bottom:20px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;color:${p.primary};margin-bottom:12px;padding-bottom:4px;border-bottom:2px solid ${p.primary};">Experience</div>${exp.map(e => `<div style="margin-bottom:12px;"><div style="display:flex;justify-content:space-between;"><span style="font-size:12px;font-weight:600;">${e.role}</span><span style="font-size:9px;color:#9ca3af;">${e.start} – ${e.end}</span></div><div style="font-size:10px;color:${p.secondary};">${e.company}</div>${e.bullets ? `<div style="font-size:10.5px;color:#374151;line-height:1.5;margin-top:3px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')}</div>` : ''}
            ${sk.length ? `<div style="margin-bottom:16px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;color:${p.primary};margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid ${p.primary};">Skills</div><div style="display:flex;flex-wrap:wrap;gap:4px;">${sk.map(s => `<span style="padding:3px 8px;background:${p.primary};color:white;border-radius:3px;font-size:9px;">${s}</span>`).join('')}</div></div>` : ''}
            ${edu.length ? `<div style="margin-bottom:16px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;color:${p.primary};margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid ${p.primary};">Education</div>${edu.map(e => `<div style="margin-bottom:6px;"><div style="font-size:11px;font-weight:600;">${e.degree} ${e.course}</div><div style="font-size:10px;color:#6b7280;">${e.institute}</div></div>`).join('')}</div>` : ''}
            ${proj.length ? `<div><div style="font-size:11px;font-weight:700;text-transform:uppercase;color:${p.primary};margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid ${p.primary};">Projects</div>${proj.map(pr => `<div style="margin-bottom:8px;"><div style="font-size:11px;font-weight:600;">${pr.name}</div>${pr.desc ? `<div style="font-size:10px;color:#374151;">${pr.desc}</div>` : ''}</div>`).join('')}</div>` : ''}
        </div>
    </div>`;
}

function buildSingleSerif(h, exp, edu, sk, proj, certs, p) {
    return `<div style="font-family:Georgia,serif;padding:40px 44px;color:#1a1a1a;">
        <div style="text-align:center;border-bottom:2px solid ${p.primary};padding-bottom:16px;margin-bottom:24px;">
            <div style="font-size:26px;font-weight:700;color:${p.primary};">${h.name}</div>
            <div style="font-size:13px;color:${p.secondary};margin-top:4px;font-style:italic;">${h.title}</div>
            <div style="display:flex;justify-content:center;gap:16px;font-size:10px;color:#6b7280;margin-top:8px;">${h.contact}</div>
        </div>
        ${h.summary ? `<div style="font-size:12px;line-height:1.7;color:#374151;margin-bottom:20px;text-align:justify;">${h.summary}</div>` : ''}
        ${exp.length ? `<div style="margin-bottom:20px;"><div style="font-size:13px;font-weight:700;color:${p.primary};border-bottom:1px solid #d1d5db;padding-bottom:4px;margin-bottom:12px;">EXPERIENCE</div>${exp.map(e => `<div style="margin-bottom:12px;"><div style="display:flex;justify-content:space-between;"><span style="font-size:12px;font-weight:600;">${e.role}, ${e.company}</span><span style="font-size:10px;color:#9ca3af;font-style:italic;">${e.start} – ${e.end}</span></div>${e.bullets ? `<div style="font-size:11px;color:#374151;line-height:1.6;margin-top:4px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')}</div>` : ''}
        ${edu.length ? `<div style="margin-bottom:20px;"><div style="font-size:13px;font-weight:700;color:${p.primary};border-bottom:1px solid #d1d5db;padding-bottom:4px;margin-bottom:12px;">EDUCATION</div>${edu.map(e => `<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;"><span style="font-size:12px;font-weight:600;">${e.degree} ${e.course}</span><span style="font-size:10px;color:#9ca3af;">${e.start} – ${e.end}</span></div><div style="font-size:11px;color:#6b7280;font-style:italic;">${e.institute}${e.cgpa ? ' · '+e.cgpa : ''}</div></div>`).join('')}</div>` : ''}
        ${sk.length ? `<div style="margin-bottom:16px;"><div style="font-size:13px;font-weight:700;color:${p.primary};border-bottom:1px solid #d1d5db;padding-bottom:4px;margin-bottom:10px;">SKILLS</div><div style="font-size:11px;color:#374151;">${sk.join(' · ')}</div></div>` : ''}
        ${proj.length ? `<div><div style="font-size:13px;font-weight:700;color:${p.primary};border-bottom:1px solid #d1d5db;padding-bottom:4px;margin-bottom:10px;">PROJECTS</div>${proj.map(pr => `<div style="margin-bottom:8px;"><div style="font-size:12px;font-weight:600;">${pr.name}</div>${pr.desc ? `<div style="font-size:11px;color:#374151;margin-top:2px;">${pr.desc}</div>` : ''}</div>`).join('')}</div>` : ''}
    </div>`;
}

function buildSingleBold(h, exp, edu, sk, proj, p) {
    return `<div style="font-family:'Inter',sans-serif;padding:36px 40px;color:#1a1a1a;">
        <div style="font-size:40px;font-weight:900;color:${p.primary};line-height:1;margin-bottom:4px;">${h.name}</div>
        <div style="font-size:16px;font-weight:300;color:${p.secondary};margin-bottom:16px;">${h.title}</div>
        <div style="display:flex;flex-wrap:wrap;gap:16px;font-size:11px;color:#6b7280;padding-bottom:16px;border-bottom:3px solid ${p.primary};">
            ${h.contact}
        </div>
        <div style="padding-top:20px;">
            ${h.summary ? `<div style="font-size:13px;line-height:1.6;color:#374151;margin-bottom:24px;">${h.summary}</div>` : ''}
            ${exp.length ? `<div style="margin-bottom:24px;"><div style="font-size:16px;font-weight:800;color:${p.primary};margin-bottom:14px;">EXPERIENCE</div>${exp.map(e => `<div style="margin-bottom:16px;padding-left:16px;border-left:3px solid ${p.secondary};"><div style="font-size:14px;font-weight:700;">${e.role}</div><div style="font-size:12px;color:${p.secondary};">${e.company} · ${e.start} – ${e.end}</div>${e.bullets ? `<div style="font-size:11.5px;color:#374151;line-height:1.6;margin-top:4px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')}</div>` : ''}
            ${sk.length ? `<div style="margin-bottom:20px;"><div style="font-size:16px;font-weight:800;color:${p.primary};margin-bottom:10px;">SKILLS</div><div style="display:flex;flex-wrap:wrap;gap:6px;">${sk.map(s => `<span style="padding:4px 12px;background:${p.primary};color:white;border-radius:4px;font-size:11px;font-weight:500;">${s}</span>`).join('')}</div></div>` : ''}
            ${edu.length ? `<div style="margin-bottom:20px;"><div style="font-size:16px;font-weight:800;color:${p.primary};margin-bottom:10px;">EDUCATION</div>${edu.map(e => `<div style="margin-bottom:8px;"><div style="font-size:13px;font-weight:600;">${e.degree} ${e.course}</div><div style="font-size:11px;color:#6b7280;">${e.institute}</div></div>`).join('')}</div>` : ''}
            ${proj.length ? `<div><div style="font-size:16px;font-weight:800;color:${p.primary};margin-bottom:10px;">PROJECTS</div>${proj.map(pr => `<div style="margin-bottom:10px;"><div style="font-size:13px;font-weight:600;">${pr.name}</div>${pr.desc ? `<div style="font-size:11px;color:#374151;">${pr.desc}</div>` : ''}</div>`).join('')}</div>` : ''}
        </div>
    </div>`;
}

function buildSingleSlim(h, exp, edu, sk, proj, p) {
    return `<div style="font-family:'Inter',sans-serif;padding:48px 56px;color:#1a1a1a;">
        <div style="margin-bottom:32px;"><div style="font-size:22px;font-weight:600;color:${p.primary};">${h.name}</div><div style="font-size:12px;color:${p.secondary};margin-top:3px;">${h.title}</div><div style="display:flex;gap:14px;font-size:10px;color:#9ca3af;margin-top:6px;">${h.contact}</div></div>
        ${h.summary ? `<div style="font-size:11px;line-height:1.7;color:#6b7280;margin-bottom:28px;max-width:480px;">${h.summary}</div>` : ''}
        ${exp.length ? `<div style="margin-bottom:28px;"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;margin-bottom:14px;">Experience</div>${exp.map(e => `<div style="margin-bottom:16px;"><div style="font-size:12px;font-weight:500;">${e.role}</div><div style="font-size:11px;color:${p.secondary};">${e.company} · ${e.start} – ${e.end}</div>${e.bullets ? `<div style="font-size:10.5px;color:#6b7280;line-height:1.6;margin-top:4px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')}</div>` : ''}
        ${sk.length ? `<div style="margin-bottom:24px;"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;margin-bottom:10px;">Skills</div><div style="font-size:11px;color:#6b7280;">${sk.join(' · ')}</div></div>` : ''}
        ${edu.length ? `<div style="margin-bottom:24px;"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;margin-bottom:10px;">Education</div>${edu.map(e => `<div style="margin-bottom:8px;"><div style="font-size:12px;">${e.degree} ${e.course}</div><div style="font-size:10px;color:#9ca3af;">${e.institute} · ${e.start}–${e.end}</div></div>`).join('')}</div>` : ''}
    </div>`;
}

function buildGradientHeader(h, exp, edu, sk, proj, certs, p) {
    return `<div style="font-family:'Inter',sans-serif;color:#1a1a1a;">
        <div style="background:linear-gradient(135deg,${p.primary},${p.secondary});padding:40px 36px;color:white;">
            <div style="font-size:30px;font-weight:800;margin-bottom:4px;">${h.name}</div>
            <div style="font-size:14px;opacity:0.9;margin-bottom:12px;">${h.title}</div>
            <div style="display:flex;flex-wrap:wrap;gap:14px;font-size:10px;opacity:0.8;">${h.contact}</div>
        </div>
        <div style="padding:24px 36px;">
            ${h.summary ? `<div style="font-size:11px;line-height:1.6;color:#374151;margin-bottom:20px;">${h.summary}</div>` : ''}
            ${exp.length ? `<div style="margin-bottom:20px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${p.primary};margin-bottom:10px;">Experience</div>${exp.map(e => `<div style="margin-bottom:12px;"><div style="font-size:12px;font-weight:600;">${e.role}</div><div style="font-size:10px;color:${p.secondary};">${e.company} · ${e.start} – ${e.end}</div>${e.bullets ? `<div style="font-size:10.5px;color:#374151;line-height:1.5;margin-top:3px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')}</div>` : ''}
            ${sk.length ? `<div style="margin-bottom:16px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${p.primary};margin-bottom:8px;">Skills</div><div style="display:flex;flex-wrap:wrap;gap:4px;">${sk.map(s => `<span style="padding:3px 8px;background:${p.primary}10;border:1px solid ${p.secondary}30;border-radius:4px;font-size:10px;color:${p.primary};">${s}</span>`).join('')}</div></div>` : ''}
            ${edu.length ? `<div style="margin-bottom:16px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${p.primary};margin-bottom:8px;">Education</div>${edu.map(e => `<div style="margin-bottom:6px;"><div style="font-size:11px;font-weight:600;">${e.degree} ${e.course}</div><div style="font-size:10px;color:#6b7280;">${e.institute}</div></div>`).join('')}</div>` : ''}
            ${proj.length ? `<div><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${p.primary};margin-bottom:8px;">Projects</div>${proj.map(pr => `<div style="margin-bottom:8px;"><div style="font-size:11px;font-weight:600;">${pr.name}</div>${pr.desc ? `<div style="font-size:10px;color:#374151;">${pr.desc}</div>` : ''}</div>`).join('')}</div>` : ''}
        </div>
    </div>`;
}

function buildSingleDark(h, exp, edu, sk, proj, p) {
    return `<div style="font-family:'Inter',sans-serif;padding:36px 40px;color:#1a1a1a;">
        <div style="margin-bottom:24px;"><div style="font-size:26px;font-weight:800;color:${p.primary};">${h.name}</div><div style="font-size:13px;color:#6b7280;">${h.title}</div><div style="display:flex;gap:14px;font-size:10px;color:#9ca3af;margin-top:6px;">${h.contact}</div></div>
        ${h.summary ? `<div style="font-size:11px;line-height:1.6;color:#374151;background:#f3f4f6;padding:14px;border-radius:6px;margin-bottom:24px;">${h.summary}</div>` : ''}
        ${exp.length ? `<div style="margin-bottom:20px;background:${p.primary}05;padding:16px;border-radius:6px;border:1px solid #e5e7eb;"><div style="font-size:11px;font-weight:700;color:${p.primary};margin-bottom:12px;">EXPERIENCE</div>${exp.map(e => `<div style="margin-bottom:10px;"><div style="font-size:12px;font-weight:600;">${e.role} <span style="font-weight:400;color:#6b7280;">at ${e.company}</span></div><div style="font-size:9px;color:#9ca3af;">${e.start} – ${e.end}</div>${e.bullets ? `<div style="font-size:10.5px;color:#374151;line-height:1.5;margin-top:3px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')}</div>` : ''}
        ${sk.length ? `<div style="margin-bottom:16px;background:#f9fafb;padding:14px;border-radius:6px;"><div style="font-size:11px;font-weight:700;color:${p.primary};margin-bottom:8px;">SKILLS</div><div style="display:flex;flex-wrap:wrap;gap:4px;">${sk.map(s => `<span style="padding:2px 8px;background:white;border:1px solid #e5e7eb;border-radius:3px;font-size:10px;">${s}</span>`).join('')}</div></div>` : ''}
        ${edu.length ? `<div style="margin-bottom:16px;background:#f9fafb;padding:14px;border-radius:6px;"><div style="font-size:11px;font-weight:700;color:${p.primary};margin-bottom:8px;">EDUCATION</div>${edu.map(e => `<div style="margin-bottom:6px;"><div style="font-size:11px;font-weight:600;">${e.degree} ${e.course}</div><div style="font-size:10px;color:#6b7280;">${e.institute}</div></div>`).join('')}</div>` : ''}
    </div>`;
}

function buildBoxed(h, exp, edu, sk, proj, certs, p) {
    return `<div style="font-family:'Inter',sans-serif;padding:32px 36px;color:#1a1a1a;">
        <div style="border:2px solid ${p.primary};padding:20px 24px;margin-bottom:20px;">
            <div style="font-size:24px;font-weight:800;color:${p.primary};">${h.name}</div>
            <div style="font-size:13px;color:${p.secondary};margin-top:3px;">${h.title}</div>
            <div style="display:flex;flex-wrap:wrap;gap:12px;font-size:10px;color:#6b7280;margin-top:8px;">${h.contact}</div>
        </div>
        ${h.summary ? `<div style="border:1px solid #e5e7eb;padding:14px;margin-bottom:16px;"><div style="font-size:11px;line-height:1.6;color:#374151;">${h.summary}</div></div>` : ''}
        ${exp.length ? `<div style="border:1px solid ${p.primary}30;padding:16px;margin-bottom:16px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;color:${p.primary};margin-bottom:10px;">Experience</div>${exp.map(e => `<div style="margin-bottom:10px;"><div style="font-size:12px;font-weight:600;">${e.role}</div><div style="font-size:10px;color:${p.secondary};">${e.company} · ${e.start} – ${e.end}</div>${e.bullets ? `<div style="font-size:10.5px;color:#374151;line-height:1.5;margin-top:3px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')}</div>` : ''}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            ${sk.length ? `<div style="border:1px solid ${p.primary}30;padding:14px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;color:${p.primary};margin-bottom:8px;">Skills</div><div style="display:flex;flex-wrap:wrap;gap:4px;">${sk.map(s => `<span style="padding:2px 7px;background:${p.primary}08;border:1px solid ${p.primary}20;border-radius:3px;font-size:9px;color:${p.primary};">${s}</span>`).join('')}</div></div>` : ''}
            ${edu.length ? `<div style="border:1px solid ${p.primary}30;padding:14px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;color:${p.primary};margin-bottom:8px;">Education</div>${edu.map(e => `<div style="margin-bottom:6px;"><div style="font-size:10px;font-weight:600;">${e.degree}</div><div style="font-size:9px;color:#6b7280;">${e.institute}</div></div>`).join('')}</div>` : ''}
        </div>
        ${proj.length ? `<div style="border:1px solid ${p.primary}30;padding:14px;margin-top:16px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;color:${p.primary};margin-bottom:8px;">Projects</div>${proj.map(pr => `<div style="margin-bottom:6px;"><div style="font-size:11px;font-weight:600;">${pr.name}</div>${pr.desc ? `<div style="font-size:10px;color:#374151;">${pr.desc}</div>` : ''}</div>`).join('')}</div>` : ''}
    </div>`;
}

function buildSplit(h, exp, edu, sk, proj, certs, p) {
    return `<div style="font-family:'Inter',sans-serif;color:#1a1a1a;">
        <div style="background:${p.primary};padding:28px 32px;color:white;text-align:center;">
            <div style="font-size:28px;font-weight:800;">${h.name}</div>
            <div style="font-size:13px;opacity:0.85;margin-top:4px;">${h.title}</div>
            <div style="display:flex;justify-content:center;gap:14px;font-size:10px;opacity:0.75;margin-top:8px;">${h.contact}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;">
            <div style="padding:24px 28px;border-right:1px solid #e5e7eb;">
                ${h.summary ? `<div style="font-size:10.5px;line-height:1.6;color:#374151;margin-bottom:18px;">${h.summary}</div>` : ''}
                ${exp.length ? `<div style="margin-bottom:18px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${p.primary};margin-bottom:10px;">Experience</div>${exp.map(e => `<div style="margin-bottom:10px;"><div style="font-size:11px;font-weight:600;">${e.role}</div><div style="font-size:10px;color:${p.secondary};">${e.company}</div><div style="font-size:9px;color:#9ca3af;">${e.start} – ${e.end}</div>${e.bullets ? `<div style="font-size:10px;color:#374151;line-height:1.5;margin-top:2px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')}</div>` : ''}
                ${proj.length ? `<div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${p.primary};margin-bottom:10px;">Projects</div>${proj.map(pr => `<div style="margin-bottom:6px;"><div style="font-size:10px;font-weight:600;">${pr.name}</div>${pr.desc ? `<div style="font-size:9.5px;color:#374151;">${pr.desc}</div>` : ''}</div>`).join('')}</div>` : ''}
            </div>
            <div style="padding:24px 28px;background:${p.bg||'#f8fafc'};">
                ${sk.length ? `<div style="margin-bottom:18px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${p.primary};margin-bottom:10px;">Skills</div>${sk.map(s => `<div style="font-size:9px;padding:4px 0;border-bottom:1px solid #e5e7eb;">${s}</div>`).join('')}</div>` : ''}
                ${edu.length ? `<div style="margin-bottom:18px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${p.primary};margin-bottom:10px;">Education</div>${edu.map(e => `<div style="margin-bottom:8px;"><div style="font-size:10px;font-weight:600;">${e.degree}</div><div style="font-size:9px;color:#6b7280;">${e.institute}</div></div>`).join('')}</div>` : ''}
                ${certs.length ? `<div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${p.primary};margin-bottom:8px;">Certifications</div>${certs.map(c => `<div style="font-size:9px;margin-bottom:4px;">${c.name}</div>`).join('')}</div>` : ''}
            </div>
        </div>
    </div>`;
}

function buildCentered(h, exp, edu, sk, proj, certs, p) {
    return `<div style="font-family:'Inter',sans-serif;padding:40px 48px;color:#1a1a1a;text-align:center;">
        <div style="margin-bottom:28px;"><div style="font-size:28px;font-weight:700;color:${p.primary};">${h.name}</div><div style="font-size:13px;color:${p.secondary};margin-top:4px;">${h.title}</div><div style="display:flex;justify-content:center;flex-wrap:wrap;gap:14px;font-size:10px;color:#9ca3af;margin-top:8px;">${h.contact}</div></div>
        ${h.summary ? `<div style="font-size:11px;line-height:1.6;color:#374151;max-width:500px;margin:0 auto 24px;">${h.summary}</div>` : ''}
        ${exp.length ? `<div style="margin-bottom:24px;text-align:left;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${p.primary};text-align:center;margin-bottom:14px;">Experience</div>${exp.map(e => `<div style="margin-bottom:12px;text-align:center;"><div style="font-size:12px;font-weight:600;">${e.role}</div><div style="font-size:10px;color:${p.secondary};">${e.company} · ${e.start} – ${e.end}</div>${e.bullets ? `<div style="font-size:10.5px;color:#374151;line-height:1.5;margin-top:3px;white-space:pre-line;max-width:500px;margin-left:auto;margin-right:auto;">${e.bullets}</div>` : ''}</div>`).join('')}</div>` : ''}
        ${sk.length ? `<div style="margin-bottom:20px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${p.primary};margin-bottom:10px;">Skills</div><div style="display:flex;flex-wrap:wrap;justify-content:center;gap:6px;">${sk.map(s => `<span style="padding:3px 10px;border:1px solid ${p.secondary};border-radius:16px;font-size:10px;color:${p.primary};">${s}</span>`).join('')}</div></div>` : ''}
        ${edu.length ? `<div style="margin-bottom:20px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${p.primary};margin-bottom:10px;">Education</div>${edu.map(e => `<div style="margin-bottom:6px;"><div style="font-size:12px;font-weight:600;">${e.degree} ${e.course}</div><div style="font-size:10px;color:#6b7280;">${e.institute}</div></div>`).join('')}</div>` : ''}
    </div>`;
}

function buildAsymmetric(h, exp, edu, sk, proj, certs, p) {
    return `<div style="font-family:'Inter',sans-serif;color:#1a1a1a;">
        <div style="position:relative;padding:36px 40px 36px 60px;">
            <div style="position:absolute;left:0;top:0;bottom:0;width:40px;background:${p.primary};"></div>
            <div style="font-size:32px;font-weight:900;color:${p.primary};margin-bottom:3px;">${h.name}</div>
            <div style="font-size:14px;color:${p.secondary};margin-bottom:12px;">${h.title}</div>
            <div style="display:flex;flex-wrap:wrap;gap:14px;font-size:10px;color:#6b7280;">${h.contact}</div>
        </div>
        <div style="padding:0 40px 32px 60px;">
            ${h.summary ? `<div style="font-size:11px;line-height:1.6;color:#374151;margin-bottom:24px;padding-left:16px;border-left:2px solid ${p.secondary};">${h.summary}</div>` : ''}
            ${exp.length ? `<div style="margin-bottom:20px;"><div style="font-size:12px;font-weight:700;color:${p.primary};margin-bottom:12px;">EXPERIENCE</div>${exp.map(e => `<div style="margin-bottom:14px;padding-left:16px;border-left:2px solid ${p.secondary}40;"><div style="font-size:12px;font-weight:600;">${e.role}</div><div style="font-size:10px;color:${p.secondary};">${e.company} · ${e.start} – ${e.end}</div>${e.bullets ? `<div style="font-size:10.5px;color:#374151;line-height:1.5;margin-top:3px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')}</div>` : ''}
            ${sk.length ? `<div style="margin-bottom:16px;"><div style="font-size:12px;font-weight:700;color:${p.primary};margin-bottom:8px;">SKILLS</div><div style="display:flex;flex-wrap:wrap;gap:5px;">${sk.map(s => `<span style="padding:3px 10px;background:${p.primary};color:white;border-radius:3px;font-size:10px;">${s}</span>`).join('')}</div></div>` : ''}
            ${edu.length ? `<div style="margin-bottom:16px;"><div style="font-size:12px;font-weight:700;color:${p.primary};margin-bottom:8px;">EDUCATION</div>${edu.map(e => `<div style="margin-bottom:6px;"><div style="font-size:11px;font-weight:600;">${e.degree} ${e.course}</div><div style="font-size:10px;color:#6b7280;">${e.institute}</div></div>`).join('')}</div>` : ''}
            ${proj.length ? `<div><div style="font-size:12px;font-weight:700;color:${p.primary};margin-bottom:8px;">PROJECTS</div>${proj.map(pr => `<div style="margin-bottom:8px;"><div style="font-size:11px;font-weight:600;">${pr.name}</div>${pr.desc ? `<div style="font-size:10px;color:#374151;">${pr.desc}</div>` : ''}</div>`).join('')}</div>` : ''}
        </div>
    </div>`;
}

// Register all variant templates
(function() {
    const variantIds = ['executive','elegant','professional','compact','timeline','infographic','twotone','sidebar-left','header-bar','classic','bold','slim','accented','gradient-header','minimal-dark','boxed','split','centered','technical','startup','academic','freelancer','leader','innovator'];
    
    variantIds.forEach(id => {
        const safeId = id.replace(/-/g, '_');
        ResumeTemplates[`render_${safeId}`] = TemplateVariants.generate(id);
    });
})();

// Get mini preview HTML for template cards
function getTemplateMiniHTML(id) {
    const p = TemplateVariants.palettes[id] || { primary: '#1e3a5f', secondary: '#2563eb', bg: '#f0f2f7' };
    const hasSidebar = ['modern','sidebar-left','twotone','split','sidebar-right'].some(t => id.includes(t) || ['executive','elegant','professional','infographic','accented','technical','leader'].includes(id));
    const hasGradient = ['creative','gradient-header','startup'].includes(id);
    const isMinimal = ['minimal','slim','centered','slim','compact'].includes(id);
    
    if (id === 'modern') return `<div class="mini-header" style="background:linear-gradient(135deg,#1e3a5f,#2563eb);padding:10px;"><div class="mini-name" style="font-size:7px;font-weight:700;color:white;">Your Name</div></div><div style="display:grid;grid-template-columns:1fr 80px;"><div style="padding:6px 8px;"><div class="mini-line"></div><div class="mini-line short"></div><div class="mini-line"></div></div><div style="background:#f0f2f7;padding:6px;"><div class="mini-line"></div><div class="mini-line short"></div></div></div>`;
    if (id === 'minimal') return `<div style="padding:12px;text-align:center;"><div style="font-size:6px;font-weight:300;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid #e5e7eb;padding-bottom:4px;margin-bottom:6px;">YOUR NAME</div><div class="mini-line"></div><div class="mini-line short"></div><div class="mini-line"></div></div>`;
    if (id === 'corporate') return `<div style="padding:8px;border-bottom:2px solid #1a1a2e;margin-bottom:6px;"><div style="font-size:6px;font-weight:700;">YOUR NAME</div></div><div style="padding:4px 8px;"><div class="mini-line"></div><div class="mini-line short"></div><div class="mini-line"></div></div>`;
    if (id === 'developer') return `<div style="padding:8px;font-family:monospace;"><div style="font-size:6px;"><span style="color:#10b981;">&gt; </span>name</div><div class="mini-line" style="background:#f0fdf4;"></div><div class="mini-line" style="background:#f0fdf4;"></div></div>`;
    if (id === 'creative') return `<div style="background:linear-gradient(135deg,#7c3aed,#ec4899);padding:12px;"><div style="font-size:7px;font-weight:800;color:white;">Your Name</div></div><div style="padding:6px 8px;"><div class="mini-line"></div><div class="mini-line short"></div></div>`;
    if (id === 'ats') return `<div style="padding:8px;"><div style="font-size:6px;font-weight:700;border-bottom:1px solid #000;padding-bottom:2px;margin-bottom:4px;">NAME</div><div class="mini-line"></div><div class="mini-line short"></div></div>`;
    
    // Generic for variants
    if (hasGradient) return `<div style="background:linear-gradient(135deg,${p.primary},${p.secondary});padding:10px;"><div style="font-size:7px;font-weight:700;color:white;">Name</div></div><div style="padding:6px 8px;"><div class="mini-line"></div><div class="mini-line short"></div></div>`;
    if (['sidebar-left','freelancer'].includes(id)) return `<div style="display:grid;grid-template-columns:70px 1fr;"><div style="background:${p.primary};padding:8px;"><div style="font-size:5px;color:white;font-weight:700;">Name</div><div style="height:2px;background:rgba(255,255,255,0.2);margin:3px 0;"></div><div style="height:2px;background:rgba(255,255,255,0.2);margin:3px 0;"></div></div><div style="padding:6px;"><div class="mini-line"></div><div class="mini-line short"></div></div></div>`;
    if (['timeline'].includes(id)) return `<div style="padding:8px;text-align:center;font-size:6px;font-weight:700;color:${p.primary};">Name</div><div style="padding:2px 8px;border-left:2px solid ${p.secondary};margin-left:12px;"><div class="mini-line"></div><div class="mini-line short"></div><div class="mini-line"></div></div>`;
    if (['boxed'].includes(id)) return `<div style="border:2px solid ${p.primary};margin:6px;padding:6px;"><div style="font-size:6px;font-weight:700;color:${p.primary};">Name</div><div class="mini-line" style="margin-top:4px;"></div><div class="mini-line short"></div></div>`;
    if (['twotone','split'].includes(id)) return `<div style="display:grid;grid-template-columns:1fr 1fr;"><div style="background:${p.primary};padding:8px;"><div style="font-size:5px;color:white;font-weight:700;">Name</div></div><div style="padding:6px;"><div class="mini-line"></div><div class="mini-line short"></div></div></div>`;
    if (['bold','innovator'].includes(id)) return `<div style="padding:8px;"><div style="font-size:9px;font-weight:900;color:${p.primary};">Name</div><div style="border-bottom:2px solid ${p.primary};margin:4px 0;"></div><div class="mini-line"></div><div class="mini-line short"></div></div>`;
    if (['classic','academic'].includes(id)) return `<div style="padding:8px;text-align:center;border-bottom:2px solid ${p.primary};"><div style="font-size:6px;font-weight:700;color:${p.primary};font-family:serif;">Name</div></div><div style="padding:4px 8px;"><div class="mini-line"></div><div class="mini-line short"></div></div>`;
    if (['header-bar'].includes(id)) return `<div style="background:${p.primary};padding:6px 10px;display:flex;justify-content:space-between;"><div style="font-size:6px;color:white;font-weight:700;">Name</div></div><div style="padding:6px 8px;"><div class="mini-line"></div><div class="mini-line short"></div></div>`;
    
    // Default sidebar-right style
    return `<div style="background:${p.primary};padding:8px;"><div style="font-size:6px;font-weight:700;color:white;">Name</div></div><div style="display:grid;grid-template-columns:1fr 70px;"><div style="padding:6px;"><div class="mini-line"></div><div class="mini-line short"></div></div><div style="background:${p.bg||'#f0f2f7'};padding:6px;"><div class="mini-line"></div></div></div>`;
}
