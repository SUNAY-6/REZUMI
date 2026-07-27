/* ============================================
   REZUMI - Manual Resume Builder
   ============================================ */

let manualData = {
    profile: {},
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
    hobbies: '',
    template: 'modern'
};

let currentManualSection = 'personal';
let manualDebounceTimer = null;

function initManualBuilder() {
    // Load existing data or initialize fresh
    const saved = Storage.get('rezumi_manual_resume');
    if (saved) {
        manualData = saved;
    } else {
        // Pre-fill from library data
        const profiles = Storage.getProfiles();
        if (profiles.length > 0) {
            const p = profiles[0];
            manualData.profile = { ...p };
            manualData.summary = p.summary || '';
        }
        manualData.experience = Storage.getExperience().slice(0, 3).map(e => ({...e}));
        manualData.education = Storage.getEducation().slice(0, 2).map(e => ({...e}));
        manualData.skills = Storage.getSkills().slice(0, 10);
        manualData.projects = Storage.getProjects().slice(0, 3).map(p => ({...p}));
        manualData.certifications = Storage.getCertifications().map(c => ({...c}));
        manualData.achievements = Storage.getAchievements().map(a => ({...a}));
    }
    
    // Set template selector
    const sel = document.getElementById('manual-template-select');
    if (sel) sel.value = manualData.template || 'modern';
    
    currentManualSection = 'personal';
    switchManualSection('personal');
    updateManualPreview();
}

function switchManualSection(section) {
    currentManualSection = section;
    
    // Update tabs
    document.querySelectorAll('.manual-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.section === section);
    });
    
    const content = document.getElementById('manual-editor-content');
    if (!content) return;
    
    switch(section) {
        case 'personal': renderManualPersonal(content); break;
        case 'summary': renderManualSummary(content); break;
        case 'experience': renderManualExperience(content); break;
        case 'education': renderManualEducation(content); break;
        case 'skills': renderManualSkills(content); break;
        case 'projects': renderManualProjects(content); break;
        case 'extra': renderManualExtra(content); break;
    }
}

function renderManualPersonal(container) {
    const p = manualData.profile;
    container.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label><i class="fas fa-user"></i> Full Name</label>
                <input type="text" class="form-input" value="${p.fullName || ''}" oninput="updateManualField('profile.fullName', this.value)">
            </div>
            <div class="form-group">
                <label><i class="fas fa-briefcase"></i> Job Title</label>
                <input type="text" class="form-input" value="${p.jobTitle || ''}" oninput="updateManualField('profile.jobTitle', this.value)">
            </div>
            <div class="form-group">
                <label><i class="fas fa-envelope"></i> Email</label>
                <input type="email" class="form-input" value="${p.email || ''}" oninput="updateManualField('profile.email', this.value)">
            </div>
            <div class="form-group">
                <label><i class="fas fa-phone"></i> Phone</label>
                <input type="tel" class="form-input" value="${p.phone || ''}" oninput="updateManualField('profile.phone', this.value)">
            </div>
            <div class="form-group">
                <label><i class="fas fa-map-marker-alt"></i> Location</label>
                <input type="text" class="form-input" value="${p.address || ''}" oninput="updateManualField('profile.address', this.value)">
            </div>
            <div class="form-group">
                <label><i class="fab fa-linkedin"></i> LinkedIn</label>
                <input type="url" class="form-input" value="${p.linkedin || ''}" oninput="updateManualField('profile.linkedin', this.value)">
            </div>
            <div class="form-group">
                <label><i class="fab fa-github"></i> GitHub</label>
                <input type="url" class="form-input" value="${p.github || ''}" oninput="updateManualField('profile.github', this.value)">
            </div>
            <div class="form-group">
                <label><i class="fas fa-globe"></i> Portfolio</label>
                <input type="url" class="form-input" value="${p.portfolio || ''}" oninput="updateManualField('profile.portfolio', this.value)">
            </div>
        </div>
    `;
}

function renderManualSummary(container) {
    container.innerHTML = `
        <div class="form-group">
            <label><i class="fas fa-align-left"></i> Professional Summary</label>
            <textarea class="form-input form-textarea" rows="6" oninput="updateManualField('summary', this.value)" placeholder="Write a compelling professional summary...">${manualData.summary || ''}</textarea>
            <p style="font-size:11px;color:var(--text-tertiary);margin-top:6px;">Tip: Keep it 2-4 sentences. Focus on your key strengths and career goals.</p>
        </div>
        <div style="margin-top:16px;">
            <button class="btn btn-glass btn-sm" onclick="generateAISummary()">
                <i class="fas fa-wand-magic-sparkles"></i> AI Suggest Summary
            </button>
        </div>
    `;
}

function renderManualExperience(container) {
    container.innerHTML = `
        <div id="manual-exp-list">
            ${manualData.experience.map((e, i) => `
                <div class="glass-card" style="padding:16px;margin-bottom:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <span style="font-size:13px;font-weight:600;">Experience ${i + 1}</span>
                        <button class="btn btn-danger btn-sm" onclick="removeManualExp(${i})"><i class="fas fa-trash"></i></button>
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Role</label>
                            <input type="text" class="form-input" value="${e.role || ''}" oninput="updateManualExp(${i}, 'role', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Company</label>
                            <input type="text" class="form-input" value="${e.company || ''}" oninput="updateManualExp(${i}, 'company', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Start Date</label>
                            <input type="month" class="form-input" value="${e.startDate || ''}" oninput="updateManualExp(${i}, 'startDate', this.value)">
                        </div>
                        <div class="form-group">
                            <label>End Date</label>
                            <input type="month" class="form-input" value="${e.endDate || ''}" oninput="updateManualExp(${i}, 'endDate', this.value)" ${e.current ? 'disabled' : ''}>
                        </div>
                    </div>
                    <div class="form-group" style="margin-top:12px;">
                        <label>Responsibilities</label>
                        <textarea class="form-input form-textarea" rows="3" oninput="updateManualExp(${i}, 'responsibilities', this.value)" placeholder="• Key responsibility 1&#10;• Key responsibility 2">${e.responsibilities || ''}</textarea>
                    </div>
                    <div class="form-group" style="margin-top:8px;">
                        <label>Technologies</label>
                        <input type="text" class="form-input" value="${e.techUsed || ''}" oninput="updateManualExp(${i}, 'techUsed', this.value)">
                    </div>
                </div>
            `).join('')}
        </div>
        <button class="add-item-btn" onclick="addManualExperience()">
            <i class="fas fa-plus"></i> Add Experience
        </button>
    `;
}

function renderManualEducation(container) {
    container.innerHTML = `
        <div id="manual-edu-list">
            ${manualData.education.map((e, i) => `
                <div class="glass-card" style="padding:16px;margin-bottom:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <span style="font-size:13px;font-weight:600;">Education ${i + 1}</span>
                        <button class="btn btn-danger btn-sm" onclick="removeManualEdu(${i})"><i class="fas fa-trash"></i></button>
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Degree</label>
                            <input type="text" class="form-input" value="${e.degree || ''}" oninput="updateManualEdu(${i}, 'degree', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Course / Stream</label>
                            <input type="text" class="form-input" value="${e.course || ''}" oninput="updateManualEdu(${i}, 'course', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Institute</label>
                            <input type="text" class="form-input" value="${e.institute || ''}" oninput="updateManualEdu(${i}, 'institute', this.value)">
                        </div>
                        <div class="form-group">
                            <label>CGPA / Percentage</label>
                            <input type="text" class="form-input" value="${e.cgpa || ''}" oninput="updateManualEdu(${i}, 'cgpa', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Start Year</label>
                            <input type="text" class="form-input" value="${e.startYear || ''}" oninput="updateManualEdu(${i}, 'startYear', this.value)">
                        </div>
                        <div class="form-group">
                            <label>End Year</label>
                            <input type="text" class="form-input" value="${e.endYear || ''}" oninput="updateManualEdu(${i}, 'endYear', this.value)">
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        <button class="add-item-btn" onclick="addManualEducation()">
            <i class="fas fa-plus"></i> Add Education
        </button>
    `;
}

function renderManualSkills(container) {
    container.innerHTML = `
        <div class="form-group">
            <label><i class="fas fa-code"></i> Skills</label>
            <div class="chip-container" id="manual-skills-chips" style="min-height:80px;">
                ${manualData.skills.map(s => `<span class="chip">${s} <span class="chip-remove" onclick="removeManualSkill('${s}')">&times;</span></span>`).join('')}
                <input type="text" class="chip-input" id="manual-skill-input" placeholder="Type and press Enter..." onkeydown="handleManualSkillInput(event)">
            </div>
        </div>
        <div style="margin-top:16px;">
            <p style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;">Suggested skills (click to add):</p>
            <div class="skill-tags">
                ${['JavaScript','Python','React','Node.js','TypeScript','AWS','Docker','SQL','Git','Agile','Communication','Leadership']
                    .filter(s => !manualData.skills.includes(s))
                    .map(s => `<span class="tag" style="cursor:pointer;" onclick="addManualSkill('${s}')">${s} <i class="fas fa-plus" style="font-size:8px;margin-left:3px;opacity:0.5;"></i></span>`).join('')}
            </div>
        </div>
    `;
}

function renderManualProjects(container) {
    container.innerHTML = `
        <div id="manual-proj-list">
            ${manualData.projects.map((p, i) => `
                <div class="glass-card" style="padding:16px;margin-bottom:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <span style="font-size:13px;font-weight:600;">Project ${i + 1}</span>
                        <button class="btn btn-danger btn-sm" onclick="removeManualProject(${i})"><i class="fas fa-trash"></i></button>
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Project Name</label>
                            <input type="text" class="form-input" value="${p.name || ''}" oninput="updateManualProject(${i}, 'name', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Tech Stack</label>
                            <input type="text" class="form-input" value="${p.techStack || ''}" oninput="updateManualProject(${i}, 'techStack', this.value)">
                        </div>
                    </div>
                    <div class="form-group" style="margin-top:8px;">
                        <label>Description</label>
                        <textarea class="form-input form-textarea" rows="2" oninput="updateManualProject(${i}, 'description', this.value)">${p.description || ''}</textarea>
                    </div>
                </div>
            `).join('')}
        </div>
        <button class="add-item-btn" onclick="addManualProject()">
            <i class="fas fa-plus"></i> Add Project
        </button>
    `;
}

function renderManualExtra(container) {
    container.innerHTML = `
        <div class="form-section">
            <div class="form-section-title"><i class="fas fa-certificate"></i> Certifications</div>
            ${manualData.certifications.map((c, i) => `
                <div class="glass-card" style="padding:12px;margin-bottom:8px;display:flex;align-items:center;gap:12px;">
                    <div style="flex:1;">
                        <input type="text" class="form-input" style="margin-bottom:4px;" value="${c.name || ''}" oninput="updateManualCert(${i}, 'name', this.value)" placeholder="Certificate name">
                        <input type="text" class="form-input" value="${c.org || ''}" oninput="updateManualCert(${i}, 'org', this.value)" placeholder="Organization" style="font-size:12px;">
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="removeManualCert(${i})"><i class="fas fa-trash"></i></button>
                </div>
            `).join('')}
            <button class="add-item-btn" onclick="addManualCert()"><i class="fas fa-plus"></i> Add Certification</button>
        </div>
        
        <div class="form-section" style="margin-top:24px;">
            <div class="form-section-title"><i class="fas fa-language"></i> Languages</div>
            ${[0,1,2].map(i => {
                const l = manualData.languages[i] || {};
                return `<div style="display:flex;gap:8px;margin-bottom:8px;">
                    <input type="text" class="form-input" style="flex:1;" value="${l.name || ''}" oninput="updateManualLang(${i}, 'name', this.value)" placeholder="Language">
                    <select class="form-input" style="width:140px;" onchange="updateManualLang(${i}, 'level', this.value)">
                        <option value="" ${!l.level?'selected':''}>Level</option>
                        <option value="Native" ${l.level==='Native'?'selected':''}>Native</option>
                        <option value="Fluent" ${l.level==='Fluent'?'selected':''}>Fluent</option>
                        <option value="Professional" ${l.level==='Professional'?'selected':''}>Professional</option>
                        <option value="Intermediate" ${l.level==='Intermediate'?'selected':''}>Intermediate</option>
                        <option value="Basic" ${l.level==='Basic'?'selected':''}>Basic</option>
                    </select>
                </div>`;
            }).join('')}
        </div>
        
        <div class="form-section" style="margin-top:24px;">
            <div class="form-section-title"><i class="fas fa-trophy"></i> Achievements</div>
            ${manualData.achievements.map((a, i) => `
                <div class="glass-card" style="padding:12px;margin-bottom:8px;display:flex;align-items:center;gap:12px;">
                    <div style="flex:1;">
                        <input type="text" class="form-input" style="margin-bottom:4px;" value="${a.title || ''}" oninput="updateManualAch(${i}, 'title', this.value)" placeholder="Achievement">
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="removeManualAch(${i})"><i class="fas fa-trash"></i></button>
                </div>
            `).join('')}
            <button class="add-item-btn" onclick="addManualAch()"><i class="fas fa-plus"></i> Add Achievement</button>
        </div>
        
        <div class="form-section" style="margin-top:24px;">
            <div class="form-section-title"><i class="fas fa-heart"></i> Hobbies & Interests</div>
            <input type="text" class="form-input" value="${manualData.hobbies || ''}" oninput="updateManualField('hobbies', this.value)" placeholder="Reading, Open Source, Photography...">
        </div>
    `;
}

// ============================================
// UPDATE FUNCTIONS
// ============================================

function updateManualField(path, value) {
    const parts = path.split('.');
    let obj = manualData;
    for (let i = 0; i < parts.length - 1; i++) {
        obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    debounceUpdatePreview();
    autoSaveManual();
}

function updateManualExp(index, field, value) {
    if (manualData.experience[index]) {
        manualData.experience[index][field] = value;
        debounceUpdatePreview();
        autoSaveManual();
    }
}

function updateManualEdu(index, field, value) {
    if (manualData.education[index]) {
        manualData.education[index][field] = value;
        debounceUpdatePreview();
        autoSaveManual();
    }
}

function updateManualProject(index, field, value) {
    if (manualData.projects[index]) {
        manualData.projects[index][field] = value;
        debounceUpdatePreview();
        autoSaveManual();
    }
}

function updateManualCert(index, field, value) {
    if (manualData.certifications[index]) {
        manualData.certifications[index][field] = value;
        debounceUpdatePreview();
        autoSaveManual();
    }
}

function updateManualLang(index, field, value) {
    if (!manualData.languages[index]) manualData.languages[index] = {};
    manualData.languages[index][field] = value;
    debounceUpdatePreview();
    autoSaveManual();
}

function updateManualAch(index, field, value) {
    if (manualData.achievements[index]) {
        manualData.achievements[index][field] = value;
        debounceUpdatePreview();
        autoSaveManual();
    }
}

// ============================================
// ADD / REMOVE FUNCTIONS
// ============================================

function addManualExperience() {
    manualData.experience.push({ role: '', company: '', startDate: '', endDate: '', responsibilities: '', techUsed: '' });
    renderManualExperience(document.getElementById('manual-editor-content'));
    debounceUpdatePreview();
}

function removeManualExp(index) {
    manualData.experience.splice(index, 1);
    renderManualExperience(document.getElementById('manual-editor-content'));
    debounceUpdatePreview();
    autoSaveManual();
}

function addManualEducation() {
    manualData.education.push({ degree: '', course: '', institute: '', cgpa: '', startYear: '', endYear: '' });
    renderManualEducation(document.getElementById('manual-editor-content'));
    debounceUpdatePreview();
}

function removeManualEdu(index) {
    manualData.education.splice(index, 1);
    renderManualEducation(document.getElementById('manual-editor-content'));
    debounceUpdatePreview();
    autoSaveManual();
}

function addManualProject() {
    manualData.projects.push({ name: '', description: '', techStack: '' });
    renderManualProjects(document.getElementById('manual-editor-content'));
    debounceUpdatePreview();
}

function removeManualProject(index) {
    manualData.projects.splice(index, 1);
    renderManualProjects(document.getElementById('manual-editor-content'));
    debounceUpdatePreview();
    autoSaveManual();
}

function addManualCert() {
    manualData.certifications.push({ name: '', org: '', date: '' });
    renderManualExtra(document.getElementById('manual-editor-content'));
    debounceUpdatePreview();
}

function removeManualCert(index) {
    manualData.certifications.splice(index, 1);
    renderManualExtra(document.getElementById('manual-editor-content'));
    debounceUpdatePreview();
    autoSaveManual();
}

function addManualAch() {
    manualData.achievements.push({ title: '', type: 'Award', description: '' });
    renderManualExtra(document.getElementById('manual-editor-content'));
    debounceUpdatePreview();
}

function removeManualAch(index) {
    manualData.achievements.splice(index, 1);
    renderManualExtra(document.getElementById('manual-editor-content'));
    debounceUpdatePreview();
    autoSaveManual();
}

function addManualSkill(skill) {
    if (!manualData.skills.includes(skill)) {
        manualData.skills.push(skill);
        renderManualSkills(document.getElementById('manual-editor-content'));
        debounceUpdatePreview();
        autoSaveManual();
    }
}

function removeManualSkill(skill) {
    manualData.skills = manualData.skills.filter(s => s !== skill);
    renderManualSkills(document.getElementById('manual-editor-content'));
    debounceUpdatePreview();
    autoSaveManual();
}

function handleManualSkillInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const input = document.getElementById('manual-skill-input');
        if (input.value.trim()) {
            addManualSkill(input.value.trim());
        }
    }
}

// ============================================
// TEMPLATE CHANGE & PREVIEW
// ============================================

function changeManualTemplate(templateId) {
    manualData.template = templateId;
    updateManualPreview();
    autoSaveManual();
    
    // Show notification for photo templates
    const isPhoto = typeof PhotoTemplates !== 'undefined' && PhotoTemplates.isPhotoTemplate(templateId);
    if (isPhoto && !manualData.profile?.photo) {
        showToast('Photo template selected! Click "Add Photo" to upload your image.', 'info');
    }
}

function updateManualPreview() {
    const page = document.getElementById('manual-resume-page');
    if (!page) return;
    
    page.className = 'resume-page';
    page.style.padding = '0';
    page.innerHTML = ResumeTemplates.render(manualData.template, manualData);
    
    // Show/hide photo upload button based on template type
    updatePhotoButton();
}

function updatePhotoButton() {
    let btn = document.getElementById('manual-photo-btn');
    const isPhoto = typeof PhotoTemplates !== 'undefined' && PhotoTemplates.isPhotoTemplate(manualData.template);
    
    if (isPhoto) {
        if (!btn) {
            // Add photo button to editor toolbar
            const toolbar = document.querySelector('.editor-toolbar-actions');
            if (toolbar) {
                btn = document.createElement('button');
                btn.id = 'manual-photo-btn';
                btn.className = 'btn btn-sm';
                btn.style.cssText = 'background:rgba(236,72,153,0.15);color:#ec4899;border:1px solid rgba(236,72,153,0.3);margin-right:8px;';
                btn.innerHTML = '<i class="fas fa-camera"></i> ' + (manualData.profile?.photo ? 'Change Photo' : 'Add Photo');
                btn.onclick = function() {
                    if (typeof ImageEditor !== 'undefined') ImageEditor.open(manualData);
                    else if (typeof PhotoTemplates !== 'undefined') PhotoTemplates.openPhotoUpload(manualData);
                };
                toolbar.insertBefore(btn, toolbar.firstChild);
            }
        } else {
            btn.innerHTML = '<i class="fas fa-camera"></i> ' + (manualData.profile?.photo ? 'Change Photo' : 'Add Photo');
            btn.style.display = '';
        }
    } else {
        if (btn) btn.style.display = 'none';
    }
}

function debounceUpdatePreview() {
    clearTimeout(manualDebounceTimer);
    manualDebounceTimer = setTimeout(() => {
        updateManualPreview();
    }, 250);
}

function autoSaveManual() {
    Storage.set('rezumi_manual_resume', manualData);
}

// ============================================
// SAVE & EXPORT
// ============================================

function saveManualResume() {
    const resumeData = {
        name: (manualData.profile.fullName || 'My Resume') + ' - Resume',
        template: manualData.template,
        profile: manualData.profile,
        education: manualData.education.filter(e => e.degree || e.institute),
        experience: manualData.experience.filter(e => e.role || e.company),
        skills: manualData.skills,
        projects: manualData.projects.filter(p => p.name),
        certifications: manualData.certifications.filter(c => c.name),
        achievements: manualData.achievements.filter(a => a.title),
        languages: manualData.languages.filter(l => l.name),
        hobbies: manualData.hobbies,
        customization: {},
        createdAt: Date.now()
    };
    
    const saved = Storage.saveResume(resumeData);
    Storage.incrementAnalytics('resumesCreated');
    
    // Also update preview page data
    currentResumeData = resumeData;
    
    showToast('Resume saved successfully!', 'success');
}

async function exportManualPDF() {
    // Build the complete resume data object
    const exportData = {
        name: (manualData.profile.fullName || 'My Resume') + ' - Resume',
        template: manualData.template,
        profile: manualData.profile,
        education: manualData.education.filter(e => e.degree || e.institute),
        experience: manualData.experience.filter(e => e.role || e.company),
        skills: manualData.skills,
        projects: manualData.projects.filter(p => p.name),
        certifications: manualData.certifications.filter(c => c.name),
        achievements: manualData.achievements.filter(a => a.title),
        languages: manualData.languages.filter(l => l.name),
        hobbies: manualData.hobbies
    };
    
    // Temporarily swap data for export
    const prevData = currentResumeData;
    currentResumeData = exportData;
    
    // Render to the main preview page for export
    const mainPage = document.getElementById('resume-page');
    if (mainPage) {
        mainPage.className = 'resume-page';
        mainPage.style.cssText = 'padding:0; font-family: Inter, sans-serif; background:white; width:210mm; min-height:297mm;';
        mainPage.innerHTML = ResumeTemplates.render(exportData.template, exportData);
        
        await exportPixelPerfectPDF();
    }
    
    // Restore
    currentResumeData = prevData;
}

function exportManualTXT() {
    const exportData = {
        name: (manualData.profile.fullName || 'My Resume') + ' - Resume',
        template: manualData.template,
        profile: manualData.profile,
        education: manualData.education.filter(e => e.degree),
        experience: manualData.experience.filter(e => e.role),
        skills: manualData.skills,
        projects: manualData.projects.filter(p => p.name),
    };
    
    const prevData = currentResumeData;
    currentResumeData = exportData;
    exportPlainText();
    currentResumeData = prevData;
}

function generateAISummary() {
    const title = manualData.profile.jobTitle || 'professional';
    const summary = `Results-driven ${title} with a passion for delivering high-quality solutions. Proven ability to collaborate effectively in team environments and adapt to evolving technologies. Committed to continuous learning and professional growth.`;
    manualData.summary = summary;
    renderManualSummary(document.getElementById('manual-editor-content'));
    debounceUpdatePreview();
    showToast('AI summary generated!', 'success');
}
