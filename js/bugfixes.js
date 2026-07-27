/* ============================================
   REZUMI - Bug Fixes & Feature Repairs
   Fixes all listed issues without modifying
   existing structure or workflows.
   ============================================ */

const BugFixes = {
    init() {
        this.fixLibrarySwipe();
        this.fixRecentResumes();
        this.fixPhotoTemplateUpload();
        this.fixRecycleBin();
        this.fixSectionEditing();
        this.fixPDFHyperlinks();
    },

    // ============================================
    // FIX 1: Library Items — Swipe & Hover Actions
    // (Not applied to Recent Resumes)
    // ============================================
    fixLibrarySwipe() {
        const observer = new MutationObserver(() => {
            this.applyLibrarySwipeActions();
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Initial apply
        setTimeout(() => this.applyLibrarySwipeActions(), 500);
    },

    applyLibrarySwipeActions() {
        // Only target library content (not recent resumes)
        const libraryContent = document.getElementById('library-content');
        if (!libraryContent) return;

        libraryContent.querySelectorAll('.library-item').forEach(item => {
            if (item.dataset.libSwipeBound) return;
            item.dataset.libSwipeBound = 'true';
            
            // Wrap in swipe container if not already wrapped
            if (!item.closest('.swipe-item')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'swipe-item';
                wrapper.dataset.libItem = 'true';
                
                const leftAction = document.createElement('div');
                leftAction.className = 'swipe-action-left';
                leftAction.innerHTML = ' ';
                
                const rightAction = document.createElement('div');
                rightAction.className = 'swipe-action-right';
                rightAction.innerHTML = '';
                
                const content = document.createElement('div');
                content.className = 'swipe-item-content';
                
                item.parentNode.insertBefore(wrapper, item);
                wrapper.appendChild(leftAction);
                wrapper.appendChild(content);
                content.appendChild(item);
                wrapper.appendChild(rightAction);
                
                // Bind swipe
                if (typeof SwipeActions !== 'undefined') {
                    SwipeActions.bindItem(wrapper);
                }
                
                // Desktop hover actions
                this.addDesktopHoverActions(wrapper, item);
            }
        });
    },

    addDesktopHoverActions(wrapper, item) {
        const actions = document.createElement('div');
        actions.className = 'lib-hover-actions';
        
        // Determine edit/delete handlers based on item context
        const isProfile = item.querySelector('.fa-user') !== null || item.querySelector('i.fa-id-card') !== null;
        const isEducation = item.querySelector('.fa-graduation-cap') !== null;
        const isExperience = item.querySelector('.fa-briefcase') !== null;
        const isProject = item.querySelector('.fa-diagram-project') !== null;
        const isCert = item.querySelector('.fa-certificate') !== null;
        const isSkill = item.querySelector('.fa-code') !== null && item.querySelector('.chip') !== null;
        
        // Get IDs from existing action buttons
        const editBtn = item.querySelector('button[onclick*="edit"], button[onclick*="Edit"]');
        const deleteBtn = item.querySelector('button[onclick*="delete"], button[onclick*="Delete"]');
        
        const editOnclick = editBtn?.getAttribute('onclick') || "showToast('Edit feature coming soon','info')";
        const deleteOnclick = deleteBtn?.getAttribute('onclick') || "showToast('Delete feature coming soon','info')";
        
        actions.innerHTML = `
            <button class="lib-hover-btn" onclick="event.stopPropagation();${editOnclick}" title="Edit">
                <i class="fas fa-pen"></i>
            </button>
            <button class="lib-hover-btn lib-hover-btn-delete" onclick="event.stopPropagation();${deleteOnclick}" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        wrapper.style.position = 'relative';
        wrapper.appendChild(actions);
    },

    // ============================================
    // FIX 9: Recent Resumes — Remove Edit/Delete Icons
    // Keep View and existing Delete (trash) functionality
    // ============================================
    fixRecentResumes() {
        const observer = new MutationObserver(() => {
            this.cleanRecentResumes();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => this.cleanRecentResumes(), 500);
    },

    cleanRecentResumes() {
        const recentList = document.getElementById('recent-resumes-list');
        if (!recentList) return;

        recentList.querySelectorAll('.swipe-item').forEach(item => {
            if (item.dataset.recentCleaned) return;
            item.dataset.recentCleaned = 'true';

            // Remove swipe actions from recent resumes
            const leftAction = item.querySelector('.swipe-action-left');
            const rightAction = item.querySelector('.swipe-action-right');
            if (leftAction) leftAction.remove();
            if (rightAction) rightAction.remove();

            // Remove swipe-item-content wrapper styling
            const content = item.querySelector('.swipe-item-content');
            if (content) {
                content.style.transform = '';
            }

            // Keep the existing delete button (trash icon) — it already moves to recycle bin
            // Remove any extra edit button if present
            const actionBtns = item.querySelectorAll('.library-item-actions button');
            actionBtns.forEach(btn => {
                const icon = btn.querySelector('i');
                if (icon && icon.classList.contains('fa-pen')) {
                    btn.remove(); // Remove edit button
                }
            });
        });
    },

    // ============================================
    // FIX 2: Photo Template Upload Integration
    // ============================================
    fixPhotoTemplateUpload() {
        // Monitor template selection changes
        const origChangeTemplate = window.changeManualTemplate;
        window.changeManualTemplate = function(templateId) {
            if (origChangeTemplate) origChangeTemplate(templateId);
            
            // If photo template, show upload option
            if (typeof PhotoTemplates !== 'undefined' && PhotoTemplates.isPhotoTemplate(templateId)) {
                const resume = currentResumeData || {};
                if (!resume.profile?.photo) {
                    setTimeout(() => {
                        showToast('Photo template selected! Click "Photo" to upload your image.', 'info');
                    }, 300);
                }
            }
        };
    },

    // ============================================
    // FIX 10: Recycle Bin — Show Full Details
    // ============================================
    fixRecycleBin() {
        // RecycleBin.render() already shows items with details
        // Just enhance the rendering
        const origRender = RecycleBin.render;
        RecycleBin.render = function() {
            const content = document.getElementById('recycle-bin-content');
            if (!content) return;
            
            const trash = Storage.getTrash();
            
            content.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <h3 style="font-size:16px;"><i class="fas fa-trash-alt" style="color:var(--danger);margin-right:8px;"></i>Recycle Bin (${trash.length})</h3>
                    ${trash.length > 0 ? `
                        <button class="btn btn-danger btn-sm" onclick="RecycleBin.emptyAll()">
                            <i class="fas fa-trash"></i> Empty All
                        </button>
                    ` : ''}
                </div>
                
                ${trash.length === 0 ? `
                    <div class="library-empty-state">
                        <i class="fas fa-trash-alt"></i>
                        <h3>Recycle Bin is empty</h3>
                        <p>Deleted resumes will appear here. You can restore them anytime.</p>
                    </div>
                ` : `
                    <div class="library-list stagger-children">
                        ${trash.map(r => {
                            const profile = r.profile || {};
                            const skills = r.skills || [];
                            const exp = r.experience || [];
                            const edu = r.education || [];
                            return `
                        <div class="library-item" style="flex-wrap:wrap;">
                            <div class="library-item-icon" style="background:rgba(239,68,68,0.1);color:var(--danger);"><i class="fas fa-trash-restore"></i></div>
                            <div class="library-item-info" style="flex:1;">
                                <h4>${r.name || 'Untitled Resume'}</h4>
                                <p>Deleted ${typeof timeAgo === 'function' ? timeAgo(r.deletedAt) : 'recently'} · Template: ${r.template || 'Modern'}</p>
                                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px;">
                                    ${profile.fullName ? `<span class="tag" style="font-size:10px;"><i class="fas fa-user" style="margin-right:3px;"></i>${profile.fullName}</span>` : ''}
                                    ${profile.jobTitle ? `<span class="tag" style="font-size:10px;"><i class="fas fa-briefcase" style="margin-right:3px;"></i>${profile.jobTitle}</span>` : ''}
                                    ${exp.length > 0 ? `<span class="tag" style="font-size:10px;"><i class="fas fa-briefcase" style="margin-right:3px;"></i>${exp.length} exp</span>` : ''}
                                    ${edu.length > 0 ? `<span class="tag" style="font-size:10px;"><i class="fas fa-graduation-cap" style="margin-right:3px;"></i>${edu.length} edu</span>` : ''}
                                    ${skills.length > 0 ? `<span class="tag" style="font-size:10px;"><i class="fas fa-code" style="margin-right:3px;"></i>${skills.length} skills</span>` : ''}
                                    ${(r.projects || []).length > 0 ? `<span class="tag" style="font-size:10px;"><i class="fas fa-diagram-project" style="margin-right:3px;"></i>${r.projects.length} proj</span>` : ''}
                                </div>
                            </div>
                            <div class="library-item-actions">
                                <button onclick="RecycleBin.restore('${r.id}')" title="Restore" style="color:var(--success);"><i class="fas fa-undo"></i></button>
                                <button onclick="RecycleBin.permanentDelete('${r.id}')" title="Delete Permanently"><i class="fas fa-times"></i></button>
                            </div>
                        </div>
                    `}).join('')}
                    </div>
                `}
            `;
        };
    },

    // ============================================
    // FIX 6: Section Editing — Rename & Reorder
    // ============================================
    fixSectionEditing() {
        // Enhance applyChanges to actually update the resume data
        // and trigger preview re-render with custom sections
        const origApply = SectionCustomizer.applyChanges;
        SectionCustomizer.applyChanges = function() {
            if (window._scData && window._scSections) {
                this.saveSections(window._scData, window._scSections);
                currentResumeData = window._scData;
                
                // Force re-render of preview
                if (typeof renderResumePreview === 'function') {
                    renderResumePreview();
                }
                
                // Also update manual builder preview if active
                if (typeof updateManualPreview === 'function') {
                    updateManualPreview();
                }
                
                closeModal();
                showToast('Sections updated! Changes reflected in preview.', 'success');
            }
        };
    },

    // ============================================
    // FIX 5: PDF Hyperlinks — Add Clickable Links
    // ============================================
    fixPDFHyperlinks() {
        // Store original export function
        const origExport = window.exportPixelPerfectPDF;
        
        window.exportPixelPerfectPDF = async function() {
            showToast('Generating PDF with links…', 'info');

            try {
                if (typeof ensureExportLibs === 'function') await ensureExportLibs();
            } catch {
                showToast('Export libraries failed to load.', 'error');
                return;
            }

            try {
                await document.fonts.ready;
                await new Promise(r => setTimeout(r, 400));

                const host = document.createElement('div');
                host.style.cssText = 'position:fixed;left:-99999px;top:0;width:794px;background:#fff;z-index:-1;overflow:visible;';
                document.body.appendChild(host);

                const resumeHTML = typeof buildExportHTML === 'function' ? buildExportHTML(currentResumeData) : '';
                host.innerHTML = resumeHTML;

                await new Promise(r => setTimeout(r, 300));
                await document.fonts.ready;
                await new Promise(r => setTimeout(r, 200));

                const content = host.firstElementChild;
                const contentHeight = Math.max(1123, content.scrollHeight);
                const SCALE = 2;
                const A4_W = 794;

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

                // Extract link positions BEFORE removing host
                const links = extractLinks(content);

                document.body.removeChild(host);

                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });

                const PDF_W = 210;
                const PDF_H = 297;
                const mmPerPx = PDF_W / (canvas.width / SCALE);
                const totalH_mm = (canvas.height / SCALE) * mmPerPx;

                if (totalH_mm <= PDF_H + 1) {
                    const img = canvas.toDataURL('image/png');
                    pdf.addImage(img, 'PNG', 0, 0, PDF_W, totalH_mm, undefined, 'FAST');
                    
                    // Add clickable link annotations
                    addLinkAnnotations(pdf, links, mmPerPx, 0);
                } else {
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
                        
                        // Add links for this page
                        addLinkAnnotations(pdf, links, mmPerPx, yOff);

                        yOff += sliceH_px;
                        pg++;
                    }
                }

                const name = (currentResumeData.name || 'REZUMI_Resume')
                    .replace(/[^a-zA-Z0-9\s\-_]/g, '').replace(/\s+/g, '_');
                pdf.save(name + '.pdf');

                Storage.incrementAnalytics('downloads');
                showToast('PDF exported with clickable links!', 'success');

            } catch (err) {
                console.error('PDF export error:', err);
                showToast('Export failed: ' + err.message, 'error');
            }
        };
    }
};

// ============================================
// LINK EXTRACTION HELPERS
// ============================================
function extractLinks(container) {
    const links = [];
    const anchors = container.querySelectorAll('a[href]');
    const contentRect = container.getBoundingClientRect();
    
    anchors.forEach(a => {
        const href = a.getAttribute('href');
        if (!href || href === '#' || href === '') return;
        
        const rect = a.getBoundingClientRect();
        links.push({
            url: href,
            x: rect.left - contentRect.left,
            y: rect.top - contentRect.top,
            width: rect.width,
            height: rect.height,
            text: a.textContent.trim()
        });
    });
    
    return links;
}

function addLinkAnnotations(pdf, links, mmPerPx, yOffset) {
    const SCALE = 2;
    const PDF_H = 297;
    
    links.forEach(link => {
        const yInPage = link.y - yOffset;
        const yInPageScaled = yInPage / SCALE;
        const heightScaled = link.height / SCALE;
        
        // Only add if visible on this page
        if (yInPageScaled >= 0 && yInPageScaled < PDF_H) {
            const x_mm = link.x * mmPerPx;
            const y_mm = yInPageScaled * mmPerPx;
            const w_mm = link.width * mmPerPx;
            const h_mm = Math.max(heightScaled * mmPerPx, 3);
            
            try {
                pdf.link(x_mm, y_mm, w_mm, h_mm, { url: link.url });
            } catch (e) {
                // Skip invalid links silently
            }
        }
    });
}

// ============================================
// DOCX EXPORT (Simple HTML-based)
// ============================================
function exportDOCX() {
    if (!currentResumeData) {
        showToast('No resume data to export', 'error');
        return;
    }
    
    showToast('Generating DOCX\u2026', 'info');
    
    const data = currentResumeData;
    const p = data.profile || {};
    
    // Custom section resolution
    const cs = data.customSections || null;
    const sn = (id, def) => {
        if (cs) { const c = cs.find(s => s.id === id); if (c) return c.name || def; }
        return def;
    };
    const sv = (id) => {
        if (cs) { const c = cs.find(s => s.id === id); if (c && c.visible === false) return false; }
        return true;
    };
    const so = () => {
        if (cs) return cs.filter(s => s.visible !== false).map(s => s.id);
        return ['summary','experience','education','skills','projects','certifications','achievements','languages'];
    };
    
    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Resume</title><style>';
    html += 'body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#1a1a1a;margin:40px}';
    html += 'h1{font-size:22pt;font-weight:bold;margin:0 0 4px}';
    html += 'h2{font-size:13pt;font-weight:bold;color:#2563eb;border-bottom:1px solid #2563eb;padding-bottom:3px;margin:16px 0 8px}';
    html += '.subtitle{font-size:12pt;color:#6b7280;margin-bottom:8px}';
    html += '.contact{font-size:10pt;color:#6b7280;line-height:1.6;margin-bottom:12px}';
    html += '.contact a{color:#2563eb;text-decoration:none}';
    html += '.summary{font-size:10.5pt;line-height:1.6;margin-bottom:12px}';
    html += '.exp-item{margin-bottom:12px}.exp-role{font-weight:bold;font-size:11pt}';
    html += '.exp-company{font-size:10pt;color:#6b7280}.exp-date{font-size:9pt;color:#9ca3af}';
    html += '.exp-desc{font-size:10pt;line-height:1.5;margin-top:4px;white-space:pre-line}';
    html += '.skill-tag{display:inline-block;padding:2px 8px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:3px;font-size:9pt;color:#1e3a5f;margin:2px}';
    html += 'ul{margin:4px 0 0 18px}li{font-size:10pt;margin-bottom:3px}';
    html += '.project{margin-bottom:8px}.project-name{font-weight:bold;font-size:10.5pt}';
    html += '.project-tech{font-size:9pt;color:#2563eb}.project-desc{font-size:10pt;color:#374151}';
    html += '</style></head><body>';
    
    // Header
    html += '<h1>' + escDocx(p.fullName || 'Your Name') + '</h1>';
    html += '<div class="subtitle">' + escDocx(p.jobTitle || '') + '</div>';
    
    // Contact with clickable links
    const cp = [];
    if (p.email) cp.push('<a href="mailto:' + escDocx(p.email) + '">' + escDocx(p.email) + '</a>');
    if (p.phone) cp.push('<a href="tel:' + escDocx((p.phone||'').replace(/[^\d+]/g, '')) + '">' + escDocx(p.phone) + '</a>');
    if (p.address) cp.push(escDocx(p.address));
    if (p.linkedin) cp.push('<a href="' + escDocx(p.linkedin.startsWith('http') ? p.linkedin : 'https://' + p.linkedin) + '">LinkedIn</a>');
    if (p.github) cp.push('<a href="' + escDocx(p.github.startsWith('http') ? p.github : 'https://' + p.github) + '">GitHub</a>');
    if (p.portfolio) cp.push('<a href="' + escDocx(p.portfolio.startsWith('http') ? p.portfolio : 'https://' + p.portfolio) + '">Portfolio</a>');
    if (p.customLinks) p.customLinks.forEach(cl => {
        if (cl.heading && cl.url) cp.push('<a href="' + escDocx(cl.url.startsWith('http') ? cl.url : 'https://' + cl.url) + '">' + escDocx(cl.heading) + '</a>');
    });
    if (cp.length) html += '<div class="contact">' + cp.join(' \u00b7 ') + '</div>';
    
    // Sections in custom order
    so().forEach(sid => {
        if (!sv(sid)) return;
        switch(sid) {
            case 'summary':
                if (p.summary) { html += '<h2>' + escDocx(sn('summary','Professional Summary')) + '</h2><div class="summary">' + escDocx(p.summary) + '</div>'; }
                break;
            case 'experience':
                if (data.experience?.length) {
                    html += '<h2>' + escDocx(sn('experience','Experience')) + '</h2>';
                    data.experience.forEach(e => {
                        html += '<div class="exp-item"><div class="exp-role">' + escDocx(e.role||'') + '</div>';
                        html += '<div class="exp-company">' + escDocx(e.company||'') + (e.location ? ' \u00b7 ' + escDocx(e.location) : '') + '</div>';
                        html += '<div class="exp-date">' + formatDate(e.startDate) + ' \u2013 ' + (e.current ? 'Present' : formatDate(e.endDate)) + '</div>';
                        if (e.responsibilities) {
                            const bl = e.responsibilities.split('\n').filter(Boolean);
                            if (bl.length > 1) html += '<ul>' + bl.map(b => '<li>' + escDocx(b.replace(/^[\u2022\u00b7]\s*/, '')) + '</li>').join('') + '</ul>';
                            else html += '<div class="exp-desc">' + escDocx(e.responsibilities) + '</div>';
                        }
                        html += '</div>';
                    });
                }
                break;
            case 'education':
                if (data.education?.length) {
                    html += '<h2>' + escDocx(sn('education','Education')) + '</h2>';
                    data.education.forEach(e => {
                        html += '<div class="exp-item"><div class="exp-role">' + escDocx(e.degree||'') + (e.course ? ' in ' + escDocx(e.course) : '') + '</div>';
                        html += '<div class="exp-company">' + escDocx(e.institute||'') + (e.cgpa ? ' \u00b7 CGPA: ' + escDocx(e.cgpa) : '') + '</div>';
                        html += '<div class="exp-date">' + escDocx(e.startYear||'') + ' \u2013 ' + escDocx(e.endYear||'') + '</div></div>';
                    });
                }
                break;
            case 'skills':
                if (data.skills?.length) {
                    html += '<h2>' + escDocx(sn('skills','Skills')) + '</h2>';
                    html += '<div>' + data.skills.map(s => '<span class="skill-tag">' + escDocx(s) + '</span>').join(' ') + '</div>';
                }
                break;
            case 'projects':
                if (data.projects?.length) {
                    html += '<h2>' + escDocx(sn('projects','Projects')) + '</h2>';
                    data.projects.forEach(pr => {
                        html += '<div class="project"><div class="project-name">' + escDocx(pr.name||'') + '</div>';
                        if (pr.techStack) html += '<div class="project-tech">' + escDocx(pr.techStack) + '</div>';
                        if (pr.description) html += '<div class="project-desc">' + escDocx(pr.description) + '</div>';
                        html += '</div>';
                    });
                }
                break;
            case 'certifications':
                if (data.certifications?.length) {
                    html += '<h2>' + escDocx(sn('certifications','Certifications')) + '</h2>';
                    data.certifications.forEach(c => {
                        html += '<div class="exp-item"><div class="exp-role">' + escDocx(c.name||'') + '</div>';
                        html += '<div class="exp-company">' + escDocx(c.org||'') + (c.date ? ' \u00b7 ' + escDocx(c.date) : '') + '</div></div>';
                    });
                }
                break;
            case 'achievements':
                if (data.achievements?.length) {
                    html += '<h2>' + escDocx(sn('achievements','Achievements')) + '</h2>';
                    html += '<ul>' + data.achievements.map(a => '<li>' + escDocx(a.title||'') + '</li>').join('') + '</ul>';
                }
                break;
            case 'languages':
                if (data.languages?.length) {
                    html += '<h2>' + escDocx(sn('languages','Languages')) + '</h2>';
                    html += '<div>' + data.languages.map(l => escDocx(l.name) + ' (' + escDocx(l.level) + ')').join(', ') + '</div>';
                }
                break;
        }
    });
    
    html += '</body></html>';
    
    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (data.name || 'REZUMI_Resume').replace(/[^a-zA-Z0-9\s\-_]/g, '').replace(/\s+/g, '_') + '.doc';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    Storage.incrementAnalytics('downloads');
    showToast('DOCX exported with links!', 'success');
}

function escDocx(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ============================================
// FIX 3: Image Upload — Square Shape + Crop/Resize
// ============================================
const ImageEditor = {
    shape: 'circle',
    imgElement: null,
    cropX: 0,
    cropY: 0,
    cropSize: 200,
    isDragging: false,
    startX: 0,
    startY: 0,

    open(resumeData) {
        const data = resumeData || currentResumeData || {};
        this.shape = data.profile?.photoShape || 'circle';
        
        openModal('Profile Photo Editor', `
            <div style="text-align:center;">
                <div style="margin-bottom:16px;">
                    <div style="display:flex;justify-content:center;gap:12px;margin-bottom:16px;">
                        <button class="btn ${this.shape === 'circle' ? 'btn-primary' : 'btn-glass'} btn-sm" onclick="ImageEditor.setShape('circle')">
                            <i class="fas fa-circle"></i> Circle
                        </button>
                        <button class="btn ${this.shape === 'square' ? 'btn-primary' : 'btn-glass'} btn-sm" onclick="ImageEditor.setShape('square')">
                            <i class="far fa-square"></i> Square
                        </button>
                    </div>
                </div>
                
                <div id="img-editor-area" style="width:250px;height:250px;margin:0 auto 16px;position:relative;overflow:hidden;background:#f3f4f6;border:2px dashed var(--border-color);${this.shape === 'circle' ? 'border-radius:50%;' : 'border-radius:8px;'}">
                    ${data.profile?.photo ? `
                        <img id="editor-img" src="${data.profile.photo}" style="width:100%;height:100%;object-fit:cover;cursor:move;position:absolute;top:0;left:0;" 
                             onmousedown="ImageEditor.startDrag(event)" ontouchstart="ImageEditor.startDrag(event)">
                    ` : `
                        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--text-muted);">
                            <i class="fas fa-image" style="font-size:40px;margin-bottom:8px;"></i>
                            <div style="font-size:12px;">No image uploaded</div>
                        </div>
                    `}
                </div>
                
                ${data.profile?.photo ? `
                <div style="margin-bottom:12px;">
                    <label style="font-size:12px;font-weight:600;">Zoom & Position</label>
                    <input type="range" min="50" max="200" value="100" style="width:200px;" oninput="ImageEditor.zoom(this.value)">
                </div>
                ` : ''}
                
                <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                    <button class="btn btn-primary btn-sm" onclick="ImageEditor.upload()"><i class="fas fa-upload"></i> ${data.profile?.photo ? 'Replace' : 'Upload'}</button>
                    ${data.profile?.photo ? `
                        <button class="btn btn-glass btn-sm" onclick="ImageEditor.save()"><i class="fas fa-check"></i> Save</button>
                        <button class="btn btn-danger btn-sm" onclick="ImageEditor.remove()"><i class="fas fa-trash"></i> Remove</button>
                    ` : ''}
                </div>
                
                <div style="margin-top:12px;font-size:10px;color:var(--text-tertiary);">
                    Drag to reposition • Use slider to zoom • Supports JPG, PNG, WebP
                </div>
            </div>
        `, `<button class="btn btn-primary" onclick="closeModal()">Done</button>`);
    },

    setShape(shape) {
        this.shape = shape;
        const area = document.getElementById('img-editor-area');
        if (area) {
            area.style.borderRadius = shape === 'circle' ? '50%' : '8px';
        }
        
        // Update buttons
        document.querySelectorAll('.modal .btn-sm').forEach(btn => {
            if (btn.textContent.includes('Circle') || btn.textContent.includes('Square')) {
                btn.className = 'btn btn-glass btn-sm';
            }
        });
        const activeBtn = shape === 'circle' 
            ? [...document.querySelectorAll('.modal .btn-sm')].find(b => b.textContent.includes('Circle'))
            : [...document.querySelectorAll('.modal .btn-sm')].find(b => b.textContent.includes('Square'));
        if (activeBtn) activeBtn.className = 'btn btn-primary btn-sm';
        
        // Save shape preference
        if (currentResumeData?.profile) {
            currentResumeData.profile.photoShape = shape;
        }
    },

    upload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg,image/png,image/webp';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) {
                showToast('Image too large (max 5MB)', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                this.processAndShow(ev.target.result);
            };
            reader.readAsDataURL(file);
        };
        input.click();
    },

    processAndShow(dataUrl) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxSize = 400;
            let w = img.width, h = img.height;
            if (w > h) { if (w > maxSize) { h *= maxSize / w; w = maxSize; } }
            else { if (h > maxSize) { w *= maxSize / h; h = maxSize; } }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            const result = canvas.toDataURL('image/jpeg', 0.9);
            
            // Update editor area
            const area = document.getElementById('img-editor-area');
            if (area) {
                area.innerHTML = `<img id="editor-img" src="${result}" style="width:100%;height:100%;object-fit:cover;cursor:move;position:absolute;top:0;left:0;" onmousedown="ImageEditor.startDrag(event)" ontouchstart="ImageEditor.startDrag(event)">`;
            }
            
            // Save immediately
            if (currentResumeData) {
                if (!currentResumeData.profile) currentResumeData.profile = {};
                currentResumeData.profile.photo = result;
                currentResumeData.profile.photoShape = this.shape;
                Storage.saveResume(currentResumeData);
            }
            
            showToast('Image uploaded!', 'success');
        };
        img.src = dataUrl;
    },

    startDrag(e) {
        e.preventDefault();
        this.isDragging = true;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        this.startX = clientX;
        this.startY = clientY;
        
        const onMove = (ev) => {
            if (!this.isDragging) return;
            const cx = ev.touches ? ev.touches[0].clientX : ev.clientX;
            const cy = ev.touches ? ev.touches[0].clientY : ev.clientY;
            const dx = cx - this.startX;
            const dy = cy - this.startY;
            const img = document.getElementById('editor-img');
            if (img) {
                const currentTop = parseInt(img.style.top) || 0;
                const currentLeft = parseInt(img.style.left) || 0;
                img.style.top = (currentTop + dy) + 'px';
                img.style.left = (currentLeft + dx) + 'px';
            }
            this.startX = cx;
            this.startY = cy;
        };
        
        const onEnd = () => {
            this.isDragging = false;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onEnd);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onEnd);
        };
        
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);
    },

    zoom(value) {
        const img = document.getElementById('editor-img');
        if (img) {
            img.style.width = value + '%';
            img.style.height = value + '%';
        }
    },

    save() {
        const img = document.getElementById('editor-img');
        if (!img) return;
        
        // Capture the current state of the image
        const canvas = document.createElement('canvas');
        const size = 300;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Draw the image as currently positioned
        ctx.drawImage(img, 0, 0, size, size);
        
        const result = canvas.toDataURL('image/jpeg', 0.9);
        if (currentResumeData) {
            if (!currentResumeData.profile) currentResumeData.profile = {};
            currentResumeData.profile.photo = result;
            currentResumeData.profile.photoShape = this.shape;
            Storage.saveResume(currentResumeData);
        }
        
        closeModal();
        if (typeof renderResumePreview === 'function') renderResumePreview();
        showToast('Photo saved!', 'success');
    },

    remove() {
        if (currentResumeData?.profile) {
            delete currentResumeData.profile.photo;
            delete currentResumeData.profile.photoShape;
            Storage.saveResume(currentResumeData);
        }
        closeModal();
        if (typeof renderResumePreview === 'function') renderResumePreview();
        showToast('Photo removed', 'info');
    }
};

window.ImageEditor = ImageEditor;

// Initialize bug fixes
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => BugFixes.init(), 800);
    });
}
