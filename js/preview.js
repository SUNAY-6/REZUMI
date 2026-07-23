/* ============================================
   REZUMI - Resume Preview & Pixel-Perfect Export
   ============================================ */

let currentResumeData = null;
let currentZoom = 100;

function initPreviewPage() {
    if (!currentResumeData) {
        const resumes = Storage.getResumes();
        if (resumes.length > 0) {
            currentResumeData = resumes[resumes.length - 1];
        }
    }
    
    if (currentResumeData) {
        renderResumePreview();
        const titleEl = document.getElementById('preview-title');
        if (titleEl) titleEl.textContent = currentResumeData.name || 'Resume Preview';
    } else {
        const previewArea = document.getElementById('preview-area');
        if (previewArea) {
            previewArea.innerHTML = `
                <div class="empty-state" style="margin:auto;">
                    <div class="empty-icon"><i class="fas fa-file-alt"></i></div>
                    <h4>No resume to preview</h4>
                    <p>Build a resume first to see the preview</p>
                    <button class="btn btn-primary" onclick="navigateTo('quick-resume')">
                        <i class="fas fa-bolt"></i> Create Resume
                    </button>
                </div>
            `;
        }
    }
}

function renderResumePreview() {
    const page = document.getElementById('resume-page');
    if (!page || !currentResumeData) return;
    
    const data = currentResumeData;
    const template = data.template || 'modern';
    
    page.className = 'resume-page';
    page.style.cssText = 'padding:0;font-family:Inter,sans-serif;background:white;width:210mm;min-height:297mm;';
    
    if (typeof ResumeTemplates !== 'undefined') {
        page.innerHTML = ResumeTemplates.render(template, data);
    }
}

// ============================================
// PIXEL-PERFECT PDF EXPORT
// Strategy: render resume HTML into an
// offscreen iframe at exact A4 size, wait
// for all resources, capture with html2canvas,
// then build a multi-page PDF with jsPDF.
// ============================================

function ensureExportLibs() {
    return new Promise((resolve, reject) => {
        if (typeof html2canvas !== 'undefined' && typeof window.jspdf !== 'undefined') {
            resolve();
            return;
        }
        let pending = 0;
        const done = () => { if (--pending <= 0) resolve(); };
        const fail = () => reject(new Error('Failed to load export library'));

        if (typeof html2canvas === 'undefined') {
            pending++;
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            s.onload = done;
            s.onerror = fail;
            document.head.appendChild(s);
        }
        if (typeof window.jspdf === 'undefined') {
            pending++;
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            s.onload = done;
            s.onerror = fail;
            document.head.appendChild(s);
        }
        if (pending === 0) resolve();
    });
}

async function exportResume(format) {
    if (!currentResumeData) {
        showToast('No resume data to export', 'error');
        return;
    }
    if (format === 'pdf') {
        await exportPixelPerfectPDF();
    } else {
        exportPlainText();
    }
}

async function exportPixelPerfectPDF() {
    showToast('Generating PDF…', 'info');

    try {
        await ensureExportLibs();
    } catch {
        showToast('Export libraries failed to load. Check connection.', 'error');
        return;
    }

    try {
        // Wait for all web fonts (Inter, JetBrains Mono, Font Awesome)
        await document.fonts.ready;
        await new Promise(r => setTimeout(r, 400));

        // ---- Build an off-screen render target ----
        const host = document.createElement('div');
        host.style.cssText = 'position:fixed;left:-99999px;top:0;width:794px;background:#fff;z-index:-1;overflow:visible;';
        document.body.appendChild(host);

        // Build resume HTML with all fonts and icons available inline
        const resumeHTML = buildExportHTML(currentResumeData);
        host.innerHTML = resumeHTML;

        // Wait for layout
        await new Promise(r => setTimeout(r, 300));
        await document.fonts.ready;
        await new Promise(r => setTimeout(r, 200));

        const content = host.firstElementChild;
        const contentHeight = Math.max(1123, content.scrollHeight);

        // ---- Capture with html2canvas ----
        const SCALE = 2; // retina quality
        const A4_W = 794; // px at 96dpi

        const canvas = await html2canvas(content, {
            scale: SCALE,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: A4_W,
            height: contentHeight,
            windowWidth: A4_W,
            windowHeight: contentHeight,
            logging: false,
            imageTimeout: 15000,
            removeContainer: false,
            letterRendering: true,
        });

        // Clean up
        document.body.removeChild(host);

        // ---- Build PDF ----
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });

        const PDF_W = 210;
        const PDF_H = 297;

        // mm per pixel ratio
        const mmPerPx = PDF_W / (canvas.width / SCALE);
        const totalH_mm = (canvas.height / SCALE) * mmPerPx;

        if (totalH_mm <= PDF_H + 1) {
            // Single page
            const img = canvas.toDataURL('image/png');
            pdf.addImage(img, 'PNG', 0, 0, PDF_W, totalH_mm, undefined, 'FAST');
        } else {
            // Multi-page: slice the canvas into A4-height chunks
            const sliceH_px = Math.round((PDF_H / mmPerPx) * SCALE);
            let yOff = 0, pg = 0;

            while (yOff < canvas.height && pg < 10) {
                if (pg > 0) pdf.addPage();

                const remain = canvas.height - yOff;
                const curH = Math.min(sliceH_px, remain);

                const slice = document.createElement('canvas');
                slice.width = canvas.width;
                slice.height = curH;
                const ctx = slice.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, slice.width, slice.height);
                ctx.drawImage(canvas, 0, yOff, canvas.width, curH, 0, 0, canvas.width, curH);

                const img = slice.toDataURL('image/png');
                const h_mm = (curH / SCALE) * mmPerPx;
                pdf.addImage(img, 'PNG', 0, 0, PDF_W, Math.min(h_mm, PDF_H), undefined, 'FAST');

                yOff += sliceH_px;
                pg++;
            }
        }

        const name = (currentResumeData.name || 'REZUMI_Resume')
            .replace(/[^a-zA-Z0-9\s\-_]/g, '').replace(/\s+/g, '_');
        pdf.save(name + '.pdf');

        Storage.incrementAnalytics('downloads');
        showToast('PDF exported!', 'success');

    } catch (err) {
        console.error('PDF export error:', err);
        showToast('Export failed: ' + err.message, 'error');
    }
}

/**
 * Build the complete HTML string for export.
 * Includes font imports + Font Awesome so icons render in html2canvas.
 */
function buildExportHTML(data) {
    const template = data.template || 'modern';
    let bodyHTML = '';
    if (typeof ResumeTemplates !== 'undefined') {
        bodyHTML = ResumeTemplates.render(template, data);
    }
    return `
    <div style="width:794px;min-height:1123px;background:#fff;font-family:Inter,sans-serif;position:relative;box-sizing:border-box;">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
            *{box-sizing:border-box;margin:0;padding:0;}
        </style>
        ${bodyHTML}
    </div>`;
}

function exportPlainText() {
    const text = generatePlainTextResume();
    const name = (currentResumeData?.name || 'REZUMI_Resume')
        .replace(/[^a-zA-Z0-9\s\-_]/g, '').replace(/\s+/g, '_') + '.txt';
    downloadFile(text, name, 'text/plain');
    Storage.incrementAnalytics('downloads');
    showToast('Text exported!', 'success');
}

function generatePlainTextResume() {
    const d = currentResumeData;
    if (!d) return '';
    const p = d.profile || {};
    let t = `${p.fullName||'Your Name'}\n${p.jobTitle||''}\n${[p.email,p.phone,p.address].filter(Boolean).join(' | ')}\n\n`;
    if (p.summary) t += `SUMMARY\n${p.summary}\n\n`;
    if (d.experience?.length) { t += 'EXPERIENCE\n'; d.experience.forEach(e => { t += `${e.role} at ${e.company}\n${e.responsibilities||''}\n\n`; }); }
    if (d.education?.length) { t += 'EDUCATION\n'; d.education.forEach(e => { t += `${e.degree} ${e.course||''}, ${e.institute}\n\n`; }); }
    if (d.skills?.length) t += `SKILLS\n${d.skills.join(', ')}\n\n`;
    if (d.projects?.length) { t += 'PROJECTS\n'; d.projects.forEach(pr => { t += `${pr.name}: ${pr.description||''}\n\n`; }); }
    if (d.certifications?.length) { t += 'CERTIFICATIONS\n'; d.certifications.forEach(c => { t += `${c.name} - ${c.org||''}\n`; }); t += '\n'; }
    if (d.achievements?.length) { t += 'ACHIEVEMENTS\n'; d.achievements.forEach(a => { t += `${a.title}\n`; }); }
    return t;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    try { const d = new Date(dateStr); return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US',{month:'short',year:'numeric'}); } catch { return dateStr; }
}

function formatBulletPoints(text) {
    if (!text) return '';
    const lines = text.split(/\n|•|·/).map(l=>l.trim()).filter(Boolean);
    return lines.length <= 1 ? `<p>${text}</p>` : '<ul>'+lines.map(l=>`<li>${l}</li>`).join('')+'</ul>';
}

function zoomIn() { currentZoom = Math.min(currentZoom+10,150); applyZoom(); }
function zoomOut() { currentZoom = Math.max(currentZoom-10,50); applyZoom(); }
function applyZoom() {
    const p = document.getElementById('resume-page');
    const l = document.getElementById('zoom-level');
    if (p) p.style.transform = `scale(${currentZoom/100})`;
    if (l) l.textContent = `${currentZoom}%`;
}

function downloadFile(content, filename, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content],{type}));
    a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function printResume() { window.print(); }

function shareResume() {
    if (navigator.share) {
        navigator.share({ title: currentResumeData?.name||'My Resume', text:'Built with REZUMI', url:location.href });
    } else {
        navigator.clipboard.writeText(location.href).then(()=>showToast('Link copied!','success'));
    }
}

// ============================================
// FINAL EDITOR - Pre-export editing
// ============================================
let finalEditorOpen = false;
let finalEditData = null;
let finalEditorTab = 'personal';

function toggleFinalEditor() {
    const panel = document.getElementById('final-editor-panel');
    if (!panel) return;
    finalEditorOpen = !finalEditorOpen;
    if (finalEditorOpen) {
        panel.classList.remove('hidden');
        finalEditData = JSON.parse(JSON.stringify(currentResumeData || {}));
        renderFinalEditor();
    } else {
        panel.classList.add('hidden');
    }
}

function renderFinalEditor() {
    const body = document.getElementById('final-editor-body');
    if (!body || !finalEditData) return;
    const d = finalEditData;
    const p = d.profile || {};
    const tab = (t) => finalEditorTab === t ? 'btn-primary' : 'btn-glass';

    body.innerHTML = `
        <div style="display:flex;gap:4px;margin-bottom:16px;overflow-x:auto;padding-bottom:4px;">
            <button class="btn btn-sm ${tab('personal')}" onclick="setFinalEditorTab('personal')">Personal</button>
            <button class="btn btn-sm ${tab('summary')}" onclick="setFinalEditorTab('summary')">Summary</button>
            <button class="btn btn-sm ${tab('experience')}" onclick="setFinalEditorTab('experience')">Experience</button>
            <button class="btn btn-sm ${tab('education')}" onclick="setFinalEditorTab('education')">Education</button>
            <button class="btn btn-sm ${tab('skills')}" onclick="setFinalEditorTab('skills')">Skills</button>
            <button class="btn btn-sm ${tab('projects')}" onclick="setFinalEditorTab('projects')">Projects</button>
            <button class="btn btn-sm ${tab('custom')}" onclick="setFinalEditorTab('custom')">+ Custom</button>
            <button class="btn btn-sm ${tab('template')}" onclick="setFinalEditorTab('template')">Template</button>
        </div>
        <div id="final-editor-tab-content">${renderFinalEditorTab()}</div>
    `;
}

function setFinalEditorTab(t) { finalEditorTab = t; renderFinalEditor(); }

function renderFinalEditorTab() {
    const d = finalEditData, p = d.profile || {};
    switch(finalEditorTab) {
        case 'personal': return `
            <div class="form-grid">
                <div class="form-group"><label>Full Name</label><input class="form-input" value="${esc(p.fullName)}" onchange="finalEditData.profile.fullName=this.value"></div>
                <div class="form-group"><label>Job Title</label><input class="form-input" value="${esc(p.jobTitle)}" onchange="finalEditData.profile.jobTitle=this.value"></div>
                <div class="form-group"><label>Email</label><input class="form-input" value="${esc(p.email)}" onchange="finalEditData.profile.email=this.value"></div>
                <div class="form-group"><label>Phone</label><input class="form-input" value="${esc(p.phone)}" onchange="finalEditData.profile.phone=this.value"></div>
                <div class="form-group"><label>Location</label><input class="form-input" value="${esc(p.address)}" onchange="finalEditData.profile.address=this.value"></div>
                <div class="form-group"><label>LinkedIn</label><input class="form-input" value="${esc(p.linkedin)}" onchange="finalEditData.profile.linkedin=this.value"></div>
                <div class="form-group"><label>GitHub</label><input class="form-input" value="${esc(p.github)}" onchange="finalEditData.profile.github=this.value"></div>
                <div class="form-group"><label>Portfolio</label><input class="form-input" value="${esc(p.portfolio)}" onchange="finalEditData.profile.portfolio=this.value"></div>
            </div>`;
        case 'summary': return `<div class="form-group"><label>Professional Summary</label><textarea class="form-input form-textarea" rows="5" onchange="finalEditData.profile.summary=this.value">${esc(p.summary)}</textarea></div>`;
        case 'experience': return (d.experience||[]).map((e,i)=>`
            <div class="glass-card" style="padding:12px;margin-bottom:8px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="font-weight:600;font-size:13px;">${esc(e.role)} at ${esc(e.company)}</span>
                <button class="btn btn-danger btn-sm" onclick="finalEditData.experience.splice(${i},1);renderFinalEditor();"><i class="fas fa-trash"></i></button></div>
                <div class="form-grid"><div class="form-group"><label>Role</label><input class="form-input" value="${esc(e.role)}" onchange="finalEditData.experience[${i}].role=this.value"></div>
                <div class="form-group"><label>Company</label><input class="form-input" value="${esc(e.company)}" onchange="finalEditData.experience[${i}].company=this.value"></div></div>
                <div class="form-group" style="margin-top:8px;"><label>Responsibilities</label><textarea class="form-input form-textarea" rows="3" onchange="finalEditData.experience[${i}].responsibilities=this.value">${esc(e.responsibilities)}</textarea></div>
            </div>`).join('')+`<button class="add-item-btn" onclick="finalEditData.experience.push({role:'',company:'',responsibilities:''});renderFinalEditor();"><i class="fas fa-plus"></i> Add Experience</button>`;
        case 'education': return (d.education||[]).map((e,i)=>`
            <div class="glass-card" style="padding:12px;margin-bottom:8px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="font-weight:600;font-size:13px;">${esc(e.degree)} — ${esc(e.institute)}</span>
                <button class="btn btn-danger btn-sm" onclick="finalEditData.education.splice(${i},1);renderFinalEditor();"><i class="fas fa-trash"></i></button></div>
                <div class="form-grid"><div class="form-group"><label>Degree</label><input class="form-input" value="${esc(e.degree)}" onchange="finalEditData.education[${i}].degree=this.value"></div>
                <div class="form-group"><label>Institute</label><input class="form-input" value="${esc(e.institute)}" onchange="finalEditData.education[${i}].institute=this.value"></div></div>
            </div>`).join('')+`<button class="add-item-btn" onclick="finalEditData.education.push({degree:'',institute:'',cgpa:'',startYear:'',endYear:''});renderFinalEditor();"><i class="fas fa-plus"></i> Add Education</button>`;
        case 'skills': return `<div class="form-group"><label>Skills (one per line)</label><textarea class="form-input form-textarea" rows="6" onchange="finalEditData.skills=this.value.split('\\n').map(function(s){return s.trim()}).filter(Boolean)">${(d.skills||[]).join('\n')}</textarea></div>`;
        case 'projects': return (d.projects||[]).map((pr,i)=>`
            <div class="glass-card" style="padding:12px;margin-bottom:8px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="font-weight:600;font-size:13px;">${esc(pr.name)}</span>
                <button class="btn btn-danger btn-sm" onclick="finalEditData.projects.splice(${i},1);renderFinalEditor();"><i class="fas fa-trash"></i></button></div>
                <div class="form-grid"><div class="form-group"><label>Name</label><input class="form-input" value="${esc(pr.name)}" onchange="finalEditData.projects[${i}].name=this.value"></div>
                <div class="form-group"><label>Tech</label><input class="form-input" value="${esc(pr.techStack)}" onchange="finalEditData.projects[${i}].techStack=this.value"></div></div>
                <div class="form-group" style="margin-top:8px;"><label>Description</label><textarea class="form-input form-textarea" rows="2" onchange="finalEditData.projects[${i}].description=this.value">${esc(pr.description)}</textarea></div>
            </div>`).join('')+`<button class="add-item-btn" onclick="finalEditData.projects.push({name:'',description:'',techStack:''});renderFinalEditor();"><i class="fas fa-plus"></i> Add Project</button>`;
        case 'template': return `
            <div style="text-align:center;padding:20px;">
                <p style="font-size:13px;margin-bottom:12px;">Current template: <strong>${typeof ResumeTemplates !== 'undefined' ? ResumeTemplates.get(finalEditData.template || 'modern').name : (finalEditData.template || 'Modern')}</strong></p>
                <div style="width:80px;height:100px;background:white;border-radius:4px;margin:0 auto 12px;overflow:hidden;border:1px solid var(--border-color);">
                    <div style="transform:scale(0.35);transform-origin:top left;width:220px;height:280px;">
                        ${typeof getTemplateMiniHTML === 'function' ? getTemplateMiniHTML(finalEditData.template || 'modern') : ''}
                    </div>
                </div>
                <button class="btn btn-primary" onclick="openTemplateChanger()"><i class="fas fa-palette"></i> Change Template</button>
                <p style="font-size:11px;color:var(--text-tertiary);margin-top:8px;">All resume data will be preserved</p>
            </div>`;
        case 'custom': return `
            <div class="form-group"><label>Custom Section Title</label><input class="form-input" id="cst-title" placeholder="e.g. Volunteer Work"></div>
            <div class="form-group" style="margin-top:12px;"><label>Content</label><textarea class="form-input form-textarea" id="cst-content" rows="4" placeholder="Add custom content..."></textarea></div>
            <button class="btn btn-primary btn-sm" style="margin-top:12px;" onclick="addCustomSection()"><i class="fas fa-plus"></i> Add Section</button>
            ${(d.customSections||[]).length ? '<div style="margin-top:16px;"><div style="font-size:12px;font-weight:600;margin-bottom:8px;">Custom Sections:</div>'+
            (d.customSections||[]).map((s,i)=>`<div class="glass-card" style="padding:10px;margin-bottom:6px;"><div style="display:flex;justify-content:space-between;"><strong style="font-size:12px;">${esc(s.title)}</strong><button class="btn btn-danger btn-sm" onclick="finalEditData.customSections.splice(${i},1);renderFinalEditor();"><i class="fas fa-trash"></i></button></div><div style="font-size:11px;color:var(--text-secondary);margin-top:4px;">${esc(s.content)}</div></div>`).join('')+'</div>' : ''}`;
        default: return '';
    }
}

function esc(s) { return (s||'').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

function addCustomSection() {
    const title = document.getElementById('cst-title')?.value;
    const content = document.getElementById('cst-content')?.value;
    if (!title) { showToast('Enter a section title', 'error'); return; }
    if (!finalEditData.customSections) finalEditData.customSections = [];
    finalEditData.customSections.push({ title, content: content || '' });
    renderFinalEditor();
    showToast('Custom section added!', 'success');
}

function applyFinalEdits() {
    if (!finalEditData) return;
    currentResumeData = JSON.parse(JSON.stringify(finalEditData));
    renderResumePreview();
    toggleFinalEditor();
    showToast('Changes applied to resume!', 'success');
}

// ============================================
// CHANGE TEMPLATE IN FINAL EDITOR
// ============================================
function openTemplateChanger() {
    if (!currentResumeData) { showToast('No resume to edit', 'error'); return; }
    const templates = typeof ResumeTemplates !== 'undefined' ? ResumeTemplates.registry : [];
    const current = currentResumeData.template || 'modern';
    
    openModal('Change Template', `
        <div>
            <p style="font-size:12px;color:var(--text-secondary);margin-bottom:16px;">Select a new template. All your resume data will be preserved.</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;max-height:400px;overflow-y:auto;padding:4px;">
                ${templates.map(t => `
                    <div onclick="applyTemplateChange('${t.id}')" style="cursor:pointer;border:2px solid ${current === t.id ? 'var(--accent)' : 'var(--border-color)'};border-radius:var(--radius-md);overflow:hidden;transition:0.2s;" onmouseenter="this.style.borderColor='var(--accent)'" onmouseleave="this.style.borderColor='${current === t.id ? 'var(--accent)' : 'var(--border-color)'}'">
                        <div style="height:140px;background:white;padding:4px;overflow:hidden;">
                            <div style="transform:scale(0.65);transform-origin:top left;">
                                ${typeof getTemplateMiniHTML === 'function' ? getTemplateMiniHTML(t.id) : ''}
                            </div>
                        </div>
                        <div style="padding:8px;text-align:center;font-size:11px;font-weight:600;background:var(--bg-card);">
                            ${t.name} ${current === t.id ? '<i class="fas fa-check" style="color:var(--accent);"></i>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `, `<button class="btn btn-primary" onclick="closeModal()">Done</button>`);
}

function applyTemplateChange(templateId) {
    if (!currentResumeData) return;
    currentResumeData.template = templateId;
    renderResumePreview();
    showToast('Template changed to ' + (typeof ResumeTemplates !== 'undefined' ? ResumeTemplates.get(templateId).name : templateId) + '!', 'success');
    closeModal();
}
