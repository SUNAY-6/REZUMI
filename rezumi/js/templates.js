/* ============================================
   REZUMI - Templates Page (30+ with Sample Data)
   ============================================ */

let activeFilter = 'all';

function initTemplatesPage() {
    renderTemplates();
    initTemplateFilters();
}

function initTemplateFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            renderTemplates();
        });
    });
}

function renderTemplates() {
    const grid = document.getElementById('templates-grid');
    if (!grid) return;
    
    const allTemplates = typeof ResumeTemplates !== 'undefined' ? ResumeTemplates.registry : [];
    
    const filtered = activeFilter === 'all' 
        ? allTemplates 
        : allTemplates.filter(t => t.category === activeFilter);
    
    // Get sample data for previews
    const sampleData = getTemplateSampleData();
    
    grid.innerHTML = filtered.map(t => {
        // Render actual template with sample data for preview
        let previewHTML = '';
        if (typeof ResumeTemplates !== 'undefined') {
            try {
                previewHTML = ResumeTemplates.render(t.id, sampleData);
            } catch(e) {
                previewHTML = '<div style="padding:8px;font-size:5px;">Template preview</div>';
            }
        }
        
        return `
        <div class="template-card" data-category="${t.category}" onclick="previewTemplate('${t.id}')">
            <div class="template-preview" style="padding:0;overflow:hidden;">
                <div style="width:100%;height:100%;overflow:hidden;">
                    <div style="transform:scale(0.32);transform-origin:top left;width:312%;min-height:312%;">
                        ${previewHTML}
                    </div>
                </div>
            </div>
            <div class="template-info">
                <div>
                    <h4>${t.name}</h4>
                    <p style="font-size:11px;color:var(--text-tertiary);margin-top:2px;">${t.desc || t.category}</p>
                </div>
                <span class="template-tag">${t.category}</span>
            </div>
        </div>`;
    }).join('') + `
    <!-- Custom Template Upload Card -->
    <div class="template-card" onclick="uploadCustomTemplate()" style="border:2px dashed var(--border-hover);display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:360px;">
        <div style="text-align:center;padding:20px;">
            <div style="width:56px;height:56px;border-radius:50%;background:var(--accent-subtle);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:24px;color:var(--accent);">
                <i class="fas fa-file-arrow-up"></i>
            </div>
            <h4 style="font-size:14px;margin-bottom:6px;">Use Custom Template</h4>
            <p style="font-size:11px;color:var(--text-secondary);line-height:1.5;">Upload your own DOCX template with placeholders like {{Name}}, {{Skills}}, etc.</p>
            <button class="btn btn-primary btn-sm" style="margin-top:12px;"><i class="fas fa-upload"></i> Upload DOCX</button>
        </div>
    </div>`;
}

function getTemplateSampleData() {
    const profiles = Storage.getProfiles();
    const profile = profiles.length > 0 ? profiles[0] : {
        fullName: 'Arjun Sharma',
        email: 'arjun.sharma@email.com',
        phone: '+91 9876543210',
        address: 'Bengaluru, Karnataka',
        jobTitle: 'Full Stack Developer',
        linkedin: 'linkedin.com/in/arjunsharma',
        github: 'github.com/arjunsharma',
        portfolio: 'arjunsharma.dev',
        summary: 'Passionate Full Stack Developer with 3+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud technologies. Strong problem-solving skills with a focus on clean code and exceptional user experiences.'
    };
    
    const education = Storage.getEducation();
    const sampleEdu = education.length > 0 ? education : [
        { degree: 'B.Tech', course: 'Computer Science', institute: 'RV College of Engineering', cgpa: '8.7', startYear: '2018', endYear: '2022' }
    ];
    
    const experience = Storage.getExperience();
    const sampleExp = experience.length > 0 ? experience : [
        { role: 'Senior Software Engineer', company: 'Flipkart', startDate: '2023-01', current: true, location: 'Bengaluru', responsibilities: '• Led development of customer features serving 10M+ users\n• Improved performance by 40% through optimization\n• Mentored 3 junior developers', techUsed: 'React, Node.js, AWS' }
    ];
    
    const projects = Storage.getProjects();
    const sampleProj = projects.length > 0 ? projects : [
        { name: 'E-Commerce Platform', description: 'Full-featured marketplace with payment integration', techStack: 'React, Node.js, MongoDB, Stripe' }
    ];
    
    const skills = Storage.getSkills();
    const sampleSkills = skills.length > 0 ? skills : ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'MongoDB', 'Git'];
    
    const certs = Storage.getCertifications();
    const sampleCerts = certs.length > 0 ? certs : [
        { name: 'AWS Solutions Architect', org: 'Amazon Web Services', date: '2023-06' }
    ];
    
    return {
        profile,
        education: sampleEdu,
        experience: sampleExp,
        skills: sampleSkills,
        projects: sampleProj,
        certifications: sampleCerts,
        achievements: Storage.getAchievements().slice(0, 2),
        languages: [{ name: 'English', level: 'Fluent' }, { name: 'Hindi', level: 'Native' }],
        hobbies: 'Open Source, Photography',
        template: 'modern'
    };
}

function previewTemplate(templateId) {
    const sampleData = getTemplateSampleData();
    sampleData.template = templateId;
    
    let previewHTML = '';
    if (typeof ResumeTemplates !== 'undefined') {
        previewHTML = ResumeTemplates.render(templateId, sampleData);
    }
    
    const templateInfo = typeof ResumeTemplates !== 'undefined' ? ResumeTemplates.get(templateId) : { name: templateId };
    
    openModal(
        `${templateInfo.name} — Preview`,
        `<div style="max-height:500px;overflow:auto;border:1px solid var(--border-color);border-radius:8px;background:white;">
            <div style="width:210mm;min-height:297mm;background:white;padding:0;">
                ${previewHTML}
            </div>
        </div>`,
        `<button class="btn btn-ghost" onclick="closeModal()">Close</button>
         <button class="btn btn-primary" onclick="useTemplate('${templateId}')"><i class="fas fa-check"></i> Use This Template</button>`
    );
}

function useTemplate(templateId) {
    closeModal();
    
    if (currentPage === 'manual-builder') {
        const sel = document.getElementById('manual-template-select');
        if (sel) {
            sel.value = templateId;
            changeManualTemplate(templateId);
        }
        return;
    }
    
    builderState = Storage.getCurrentResumeState();
    builderState.templateId = templateId;
    Storage.saveCurrentResumeState(builderState);
    showToast(`Template "${ResumeTemplates.get(templateId).name}" selected!`, 'success');
    navigateTo('quick-resume');
    currentStep = 8;
    renderStep(8);
}

// ============================================
// CUSTOM TEMPLATE UPLOAD
// ============================================
function uploadCustomTemplate() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.docx,.doc,.html,.txt';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        showToast('Analyzing template...', 'info');
        
        const reader = new FileReader();
        
        if (file.name.endsWith('.txt') || file.name.endsWith('.html')) {
            reader.onload = (ev) => {
                processCustomTemplate(file.name, ev.target.result);
            };
            reader.readAsText(file);
        } else {
            // For DOCX, read as text (basic extraction)
            reader.onload = (ev) => {
                processCustomTemplate(file.name, ev.target.result);
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function processCustomTemplate(filename, content) {
    // Detect placeholders
    const placeholderRegex = /\{\{(\w+)\}\}/g;
    const placeholders = [];
    let match;
    while ((match = placeholderRegex.exec(content)) !== null) {
        if (!placeholders.includes(match[1])) {
            placeholders.push(match[1]);
        }
    }
    
    // Map common placeholders to resume fields
    const fieldMap = {
        'Name': 'profile.fullName',
        'FullName': 'profile.fullName',
        'Email': 'profile.email',
        'Phone': 'profile.phone',
        'Address': 'profile.address',
        'Location': 'profile.address',
        'Title': 'profile.jobTitle',
        'JobTitle': 'profile.jobTitle',
        'Role': 'profile.jobTitle',
        'Summary': 'profile.summary',
        'Objective': 'profile.summary',
        'LinkedIn': 'profile.linkedin',
        'Github': 'profile.github',
        'GitHub': 'profile.github',
        'Portfolio': 'profile.portfolio',
        'Website': 'profile.portfolio',
        'Education': 'education',
        'Experience': 'experience',
        'Skills': 'skills',
        'Projects': 'projects',
        'Certifications': 'certifications',
        'Languages': 'languages',
        'Hobbies': 'hobbies',
        'Interests': 'hobbies',
        'Achievements': 'achievements'
    };
    
    const sampleData = getTemplateSampleData();
    
    openModal('Custom Template — ' + filename, `
        <div>
            <div style="padding:12px;background:var(--accent-subtle);border-radius:var(--radius-md);margin-bottom:16px;font-size:12px;">
                <i class="fas fa-check-circle" style="color:var(--success);margin-right:6px;"></i>
                Template analyzed! Found <strong>${placeholders.length}</strong> placeholders.
            </div>
            
            ${placeholders.length === 0 ? `
                <div style="text-align:center;padding:20px;">
                    <i class="fas fa-file-circle-question" style="font-size:32px;color:var(--text-muted);margin-bottom:8px;"></i>
                    <p style="font-size:13px;">No placeholders found (e.g., {{Name}}, {{Skills}})</p>
                    <p style="font-size:11px;color:var(--text-tertiary);margin-top:4px;">Your template will be used as-is without auto-fill.</p>
                </div>
            ` : `
                <div style="font-size:13px;font-weight:600;margin-bottom:10px;">Detected Fields</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:16px;">
                    ${placeholders.map(p => {
                        const mapped = fieldMap[p];
                        return `<div style="padding:8px;background:var(--bg-card);border-radius:var(--radius-sm);font-size:11px;display:flex;align-items:center;gap:6px;">
                            <i class="fas ${mapped ? 'fa-link' : 'fa-circle-question'}" style="color:${mapped ? 'var(--success)' : 'var(--text-muted)'};"></i>
                            <span>{{${p}}}</span>
                            ${mapped ? '<span style="color:var(--success);font-size:10px;">→ mapped</span>' : '<span style="color:var(--text-muted);font-size:10px;">unmapped</span>'}
                        </div>`;
                    }).join('')}
                </div>
            `}
            
            <div style="font-size:13px;font-weight:600;margin-bottom:10px;">Preview</div>
            <div style="max-height:200px;overflow:auto;background:var(--bg-card);padding:12px;border-radius:var(--radius-md);font-size:11px;line-height:1.6;white-space:pre-wrap;font-family:var(--font-mono);">${(content || '').substring(0, 1000)}${content.length > 1000 ? '...' : ''}</div>
        </div>
    `, `<button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="applyCustomTemplate()"><i class="fas fa-check"></i> Use Template</button>`);
    
    // Store for later use
    window._customTemplate = { filename, content, placeholders, fieldMap };
}

function applyCustomTemplate() {
    closeModal();
    showToast('Custom template applied! You can edit and export.', 'success');
}

function getTemplateBaseId(id) {
    const base = id.split('-')[0];
    const valid = ['modern', 'minimal', 'corporate', 'developer', 'creative', 'ats'];
    return valid.includes(base) ? base : 'modern';
}

window.getMiniResumeHTML = function(id) {
    if (typeof getTemplateMiniHTML === 'function') {
        return getTemplateMiniHTML(id);
    }
    return '<div style="padding:8px;font-size:5px;"><div style="font-weight:700;margin-bottom:4px;">Name</div><div style="height:2px;background:#e5e7eb;margin:2px 0;"></div></div>';
};
