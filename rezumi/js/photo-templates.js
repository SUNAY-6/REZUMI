/* ============================================
   REZUMI - Photo Resume Templates
   Upload, crop, and display profile photos
   ============================================ */

const PhotoTemplates = {
    // Photo-based template IDs
    photoTemplateIds: [
        'photo-modern', 'photo-corporate', 'photo-elegant',
        'photo-executive', 'photo-creative'
    ],

    // Upload photo UI — delegates to ImageEditor for full crop/resize/shape support
    openPhotoUpload(resumeData) {
        if (typeof ImageEditor !== "undefined") {
            ImageEditor.open(resumeData);
            return;
        }
        const data = resumeData || currentResumeData;
        
        openModal('Profile Photo', `
            <div style="text-align:center;">
                <div id="photo-preview-area" style="width:120px;height:120px;border-radius:50%;border:2px dashed var(--border-color);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:var(--bg-card);position:relative;">
                    ${data?.profile?.photo ? 
                        `<img src="${data.profile.photo}" style="width:100%;height:100%;object-fit:cover;">` :
                        `<i class="fas fa-camera" style="font-size:28px;color:var(--text-muted);"></i>`
                    }
                </div>
                
                <div style="display:flex;flex-direction:column;gap:8px;align-items:center;">
                    <button class="btn btn-primary" onclick="PhotoTemplates.selectPhoto()">
                        <i class="fas fa-upload"></i> ${data?.profile?.photo ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    
                    ${data?.profile?.photo ? `
                        <button class="btn btn-glass btn-sm" onclick="PhotoTemplates.removePhoto()">
                            <i class="fas fa-trash"></i> Remove Photo
                        </button>
                    ` : ''}
                </div>
                
                <div style="margin-top:16px;font-size:11px;color:var(--text-tertiary);">
                    Recommended: 300×300px, JPG or PNG, under 2MB
                </div>
                
                <!-- Photo shape selector -->
                <div style="margin-top:16px;display:flex;justify-content:center;gap:16px;">
                    <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;">
                        <input type="radio" name="photo-shape" value="circle" ${!data?.profile?.photoShape || data?.profile?.photoShape === 'circle' ? 'checked' : ''} onchange="PhotoTemplates.setShape('circle')"> 
                        <i class="fas fa-circle"></i> Circle
                    </label>
                    <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;">
                        <input type="radio" name="photo-shape" value="square" ${data?.profile?.photoShape === 'square' ? 'checked' : ''} onchange="PhotoTemplates.setShape('square')"> 
                        <i class="far fa-square"></i> Square
                    </label>
                </div>
            </div>
        `, `<button class="btn btn-primary" onclick="closeModal()">Done</button>`);
    },

    selectPhoto() {
        if (typeof ImageEditor !== "undefined") {
            ImageEditor.upload();
            return;
        }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg,image/png,image/webp';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            if (file.size > 2 * 1024 * 1024) {
                showToast('Image too large (max 2MB)', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (ev) => {
                // Crop/resize to reasonable dimensions
                this.processImage(ev.target.result, (dataUrl) => {
                    this.savePhoto(dataUrl);
                });
            };
            reader.readAsDataURL(file);
        };
        input.click();
    },

    processImage(dataUrl, callback) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxSize = 300;
            let w = img.width, h = img.height;
            
            if (w > h) {
                if (w > maxSize) { h *= maxSize / w; w = maxSize; }
            } else {
                if (h > maxSize) { w *= maxSize / h; h = maxSize; }
            }
            
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            
            callback(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = dataUrl;
    },

    savePhoto(dataUrl) {
        const data = currentResumeData || {};
        if (!data.profile) data.profile = {};
        data.profile.photo = dataUrl;
        currentResumeData = data;
        Storage.saveResume(data);
        
        // Update preview
        const preview = document.querySelector('#photo-preview-area');
        if (preview) {
            preview.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;">`;
        }
        
        // Refresh resume preview
        if (typeof renderResumePreview === 'function') renderResumePreview();
        
        showToast('Photo saved!', 'success');
    },

    removePhoto() {
        const data = currentResumeData || {};
        if (data.profile) delete data.profile.photo;
        currentResumeData = data;
        Storage.saveResume(data);
        
        closeModal();
        if (typeof renderResumePreview === 'function') renderResumePreview();
        
        showToast('Photo removed', 'info');
    },

    setShape(shape) {
        const data = currentResumeData || {};
        if (!data.profile) data.profile = {};
        data.profile.photoShape = shape;
        currentResumeData = data;
        Storage.saveResume(data);
    },

    // Generate photo HTML for templates
    getPhotoHTML(resumeData, shape) {
        const photo = resumeData?.profile?.photo;
        if (!photo) return '';
        
        const borderStyle = shape === 'circle' ? 'border-radius:50%;' : 'border-radius:8px;';
        return `<img src="${photo}" style="width:80px;height:80px;object-fit:cover;${borderStyle}border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.15);">`;
    },

    // Check if template supports photos
    isPhotoTemplate(templateId) {
        return this.photoTemplateIds.includes(templateId);
    }
};

// Register photo templates in the template registry
function registerPhotoTemplates() {
    if (typeof ResumeTemplates === 'undefined') return;

    const photoTemplates = [
        { id: 'photo-modern', name: 'Photo Modern', category: 'modern', colors: '#1e3a5f / #2563eb', desc: 'Two-column with photo, colored header' },
        { id: 'photo-corporate', name: 'Photo Corporate', category: 'corporate', colors: '#1a1a2e / #4b5563', desc: 'Formal layout with headshot' },
        { id: 'photo-elegant', name: 'Photo Elegant', category: 'modern', colors: '#78350f / #b45309', desc: 'Gold accent, centered photo' },
        { id: 'photo-executive', name: 'Photo Executive', category: 'corporate', colors: '#1e293b / #475569', desc: 'Executive layout with photo sidebar' },
        { id: 'photo-creative', name: 'Photo Creative', category: 'creative', colors: '#7c3aed / #ec4899', desc: 'Bold gradient with photo circle' }
    ];

    // Add to registry
    photoTemplates.forEach(t => {
        if (!ResumeTemplates.registry.find(r => r.id === t.id)) {
            ResumeTemplates.registry.push(t);
        }
    });

    // Add render functions
    ResumeTemplates.render_photo_modern = function(data) {
        return renderPhotoTemplate(data, 'modern', '#1e3a5f', '#2563eb', 'sidebar');
    };
    ResumeTemplates.render_photo_corporate = function(data) {
        return renderPhotoTemplate(data, 'corporate', '#1a1a2e', '#4b5563', 'top');
    };
    ResumeTemplates.render_photo_elegant = function(data) {
        return renderPhotoTemplate(data, 'elegant', '#78350f', '#b45309', 'center');
    };
    ResumeTemplates.render_photo_executive = function(data) {
        return renderPhotoTemplate(data, 'executive', '#1e293b', '#475569', 'sidebar');
    };
    ResumeTemplates.render_photo_creative = function(data) {
        return renderPhotoTemplate(data, 'creative', '#7c3aed', '#ec4899', 'top');
    };

    // Add mini preview HTML
    if (typeof getTemplateMiniHTML !== 'undefined') {
        const origFn = getTemplateMiniHTML;
        getTemplateMiniHTML = function(id) {
            if (PhotoTemplates.isPhotoTemplate(id)) {
                return getPhotoMiniHTML(id);
            }
            return origFn(id);
        };
    }
}

function renderPhotoTemplate(data, style, primary, secondary, layout) {
    const h = ResumeTemplates._header ? ResumeTemplates._header.call(ResumeTemplates, data) : { name: data.profile?.fullName || 'Name', title: data.profile?.jobTitle || '', contact: '', summary: data.profile?.summary || '' };
    const exp = ResumeTemplates._exp ? ResumeTemplates._exp.call(ResumeTemplates, data) : [];
    const edu = ResumeTemplates._edu ? ResumeTemplates._edu.call(ResumeTemplates, data) : [];
    const sk = ResumeTemplates._skills ? ResumeTemplates._skills.call(ResumeTemplates, data) : [];
    const proj = data.projects || [];
    const photo = PhotoTemplates.getPhotoHTML(data, data.profile?.photoShape || 'circle');

    if (layout === 'sidebar') {
        return `
        <div style="font-family:Inter,sans-serif;color:#1a1a1a;">
            <div style="display:grid;grid-template-columns:220px 1fr;">
                <div style="background:${primary};padding:28px 20px;color:white;text-align:center;">
                    ${photo ? `<div style="margin-bottom:16px;">${photo}</div>` : `<div style="width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.15);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-user" style="font-size:28px;opacity:0.5;"></i></div>`}
                    <div style="font-size:18px;font-weight:700;margin-bottom:3px;">${h.name}</div>
                    <div style="font-size:11px;opacity:0.8;margin-bottom:16px;">${h.title}</div>
                    <div style="font-size:9px;opacity:0.7;line-height:1.8;text-align:left;">${h.contact.replace(/<span>/g, '').replace(/<\/span>/g, '<br>')}</div>
                    ${sk.length ? `<div style="margin-top:20px;text-align:left;"><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:0.6;margin-bottom:6px;">Skills</div>${sk.map(s => `<div style="font-size:9px;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.1);">${s}</div>`).join('')}</div>` : ''}
                    ${edu.length ? `<div style="margin-top:16px;text-align:left;"><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:0.6;margin-bottom:6px;">Education</div>${edu.map(e => `<div style="margin-bottom:6px;"><div style="font-size:9px;font-weight:600;">${e.degree}</div><div style="font-size:8px;opacity:0.7;">${e.institute}</div></div>`).join('')}</div>` : ''}
                </div>
                <div style="padding:28px 32px;">
                    ${h.summary ? `<div style="font-size:11px;line-height:1.6;color:#374151;margin-bottom:20px;">${h.summary}</div>` : ''}
                    ${exp.length ? `<div style="margin-bottom:18px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${primary};margin-bottom:10px;">Experience</div>${exp.map(e => `<div style="margin-bottom:12px;"><div style="font-size:12px;font-weight:600;">${e.role}</div><div style="font-size:10px;color:${secondary};">${e.company}</div><div style="font-size:9px;color:#9ca3af;">${e.start} – ${e.end}</div>${e.bullets ? `<div style="font-size:10.5px;color:#374151;line-height:1.5;margin-top:3px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')}</div>` : ''}
                    ${proj.length ? `<div><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${primary};margin-bottom:10px;">Projects</div>${proj.map(p => `<div style="margin-bottom:8px;"><div style="font-size:11px;font-weight:600;">${p.name || ''}</div>${p.techStack ? `<div style="font-size:9px;color:${secondary};">${p.techStack}</div>` : ''}</div>`).join('')}</div>` : ''}
                </div>
            </div>
        </div>`;
    }

    if (layout === 'center') {
        return `
        <div style="font-family:Georgia,serif;padding:36px 40px;color:#1a1a1a;text-align:center;">
            <div style="margin-bottom:20px;">
                ${photo ? `<div style="margin-bottom:12px;">${photo}</div>` : ''}
                <div style="font-size:26px;font-weight:400;letter-spacing:3px;text-transform:uppercase;color:${primary};">${h.name}</div>
                <div style="font-size:12px;color:${secondary};letter-spacing:2px;text-transform:uppercase;margin-top:6px;">${h.title}</div>
                <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:14px;font-size:10px;color:#6b7280;margin-top:10px;">${h.contact.replace(/<span>/g, '').replace(/<\/span>/g, ' · ')}</div>
            </div>
            ${h.summary ? `<div style="font-size:11.5px;line-height:1.7;color:#374151;max-width:500px;margin:0 auto 24px;font-style:italic;text-align:left;">${h.summary}</div>` : ''}
            ${exp.length ? `<div style="text-align:left;margin-bottom:20px;"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:3px;color:${secondary};margin-bottom:12px;text-align:center;">— Experience —</div>${exp.map(e => `<div style="margin-bottom:12px;"><div style="font-size:12px;font-weight:600;color:${primary};">${e.role}</div><div style="font-size:11px;color:${secondary};font-style:italic;">${e.company} · ${e.start} – ${e.end}</div>${e.bullets ? `<div style="font-size:11px;color:#374151;line-height:1.6;margin-top:4px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')}</div>` : ''}
            ${sk.length ? `<div style="margin-bottom:16px;"><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:3px;color:${secondary};margin-bottom:8px;text-align:center;">— Skills —</div><div style="font-size:11px;color:#374151;">${sk.join(' · ')}</div></div>` : ''}
            ${edu.length ? `<div><div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:3px;color:${secondary};margin-bottom:8px;text-align:center;">— Education —</div>${edu.map(e => `<div style="margin-bottom:6px;"><div style="font-size:12px;font-weight:600;">${e.degree} ${e.course}</div><div style="font-size:11px;color:#6b7280;">${e.institute}</div></div>`).join('')}</div>` : ''}
        </div>`;
    }

    // Default: top layout
    return `
    <div style="font-family:Inter,sans-serif;color:#1a1a1a;">
        <div style="background:${primary};padding:28px 36px;color:white;display:flex;align-items:center;gap:20px;">
            ${photo ? `<div>${photo}</div>` : `<div style="width:70px;height:70px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas fa-user" style="font-size:24px;opacity:0.5;"></i></div>`}
            <div>
                <div style="font-size:26px;font-weight:800;margin-bottom:3px;">${h.name}</div>
                <div style="font-size:13px;opacity:0.85;margin-bottom:8px;">${h.title}</div>
                <div style="display:flex;flex-wrap:wrap;gap:12px;font-size:10px;opacity:0.8;">${h.contact.replace(/<span>/g, '').replace(/<\/span>/g, ' · ')}</div>
            </div>
        </div>
        <div style="padding:24px 36px;">
            ${h.summary ? `<div style="font-size:11px;line-height:1.6;color:#374151;margin-bottom:20px;">${h.summary}</div>` : ''}
            ${exp.length ? `<div style="margin-bottom:18px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${primary};margin-bottom:10px;border-bottom:2px solid ${primary};padding-bottom:4px;">Experience</div>${exp.map(e => `<div style="margin-bottom:12px;"><div style="font-size:12px;font-weight:600;">${e.role}</div><div style="font-size:10px;color:${secondary};">${e.company}</div><div style="font-size:9px;color:#9ca3af;">${e.start} – ${e.end}</div>${e.bullets ? `<div style="font-size:10.5px;color:#374151;line-height:1.5;margin-top:3px;white-space:pre-line;">${e.bullets}</div>` : ''}</div>`).join('')}</div>` : ''}
            ${sk.length ? `<div style="margin-bottom:16px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${primary};margin-bottom:8px;border-bottom:2px solid ${primary};padding-bottom:4px;">Skills</div><div style="display:flex;flex-wrap:wrap;gap:4px;">${sk.map(s => `<span style="padding:3px 8px;background:${primary}10;border:1px solid ${secondary}30;border-radius:4px;font-size:10px;color:${primary};">${s}</span>`).join('')}</div></div>` : ''}
            ${edu.length ? `<div><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${primary};margin-bottom:8px;border-bottom:2px solid ${primary};padding-bottom:4px;">Education</div>${edu.map(e => `<div style="margin-bottom:6px;"><div style="font-size:11px;font-weight:600;">${e.degree} ${e.course}</div><div style="font-size:10px;color:#6b7280;">${e.institute}</div></div>`).join('')}</div>` : ''}
        </div>
    </div>`;
}

function getPhotoMiniHTML(id) {
    const palettes = {
        'photo-modern': { primary: '#1e3a5f', layout: 'sidebar' },
        'photo-corporate': { primary: '#1a1a2e', layout: 'top' },
        'photo-elegant': { primary: '#78350f', layout: 'center' },
        'photo-executive': { primary: '#1e293b', layout: 'sidebar' },
        'photo-creative': { primary: '#7c3aed', layout: 'top' }
    };
    const p = palettes[id] || palettes['photo-modern'];
    
    if (p.layout === 'sidebar') {
        return `<div style="display:grid;grid-template-columns:70px 1fr;"><div style="background:${p.primary};padding:8px;text-align:center;"><div style="width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,0.2);margin:0 auto 4px;"></div><div style="font-size:4px;color:white;font-weight:700;">Name</div></div><div style="padding:6px;"><div class="mini-line"></div><div class="mini-line short"></div><div class="mini-line"></div></div></div>`;
    }
    if (p.layout === 'center') {
        return `<div style="padding:8px;text-align:center;"><div style="width:24px;height:24px;border-radius:50%;background:${p.primary}30;margin:0 auto 3px;"></div><div style="font-size:5px;font-weight:400;letter-spacing:1px;text-transform:uppercase;color:${p.primary};">Name</div><div class="mini-line" style="margin-top:4px;"></div><div class="mini-line short"></div></div>`;
    }
    return `<div style="background:${p.primary};padding:6px 8px;display:flex;align-items:center;gap:6px;"><div style="width:20px;height:20px;border-radius:50%;background:rgba(255,255,255,0.2);flex-shrink:0;"></div><div><div style="font-size:5px;color:white;font-weight:700;">Name</div></div></div><div style="padding:4px 8px;"><div class="mini-line"></div><div class="mini-line short"></div></div>`;
}

// Register on load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(registerPhotoTemplates, 500);
    });
}

// Make globally accessible
window.PhotoTemplates = PhotoTemplates;
