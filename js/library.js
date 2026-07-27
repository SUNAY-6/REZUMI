/* ============================================
   REZUMI - Data Library (Enhanced)
   Edit icons, icon-only actions, Recently Deleted
   ============================================ */

let currentLibraryTab = 'profiles';

function initLibraryPage() {
    renderLibraryContent();
}

function switchLibraryTab(tab) {
    currentLibraryTab = tab;
    document.querySelectorAll('.lib-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    renderLibraryContent();
}

function renderLibraryContent() {
    const content = document.getElementById('library-content');
    if (!content) return;
    
    switch(currentLibraryTab) {
        case 'profiles': renderProfilesLibrary(content); break;
        case 'education': renderEducationLibrary(content); break;
        case 'experience': renderExperienceLibrary(content); break;
        case 'skills': renderSkillsLibrary(content); break;
        case 'projects': renderProjectsLibrary(content); break;
        case 'certs': renderCertsLibrary(content); break;
        case 'deleted': renderRecentlyDeleted(content); break;
    }
}

// ============================================
// ICON-ACTION HELPER
// ============================================
function libActions(buttons) {
    return `<div class="library-item-actions">${buttons}</div>`;
}

function libIconBtn(icon, onclick, title, color) {
    return `<button onclick="${onclick}" title="${title}" style="${color ? 'color:'+color+';' : ''}"><i class="${icon}"></i></button>`;
}

// ============================================
// PROFILES
// ============================================
function renderProfilesLibrary(container) {
    const profiles = Storage.getProfiles();
    
    container.innerHTML = `
        <div class="library-list stagger-children">
            ${profiles.length === 0 ? `
                <div class="library-empty-state">
                    <i class="fas fa-id-card"></i>
                    <h3>No profiles saved</h3>
                    <p>Create a personal profile to reuse across multiple resumes</p>
                    <button class="btn btn-primary" onclick="showLibraryProfileForm()">
                        <i class="fas fa-plus"></i> Create Profile
                    </button>
                </div>
            ` : profiles.map(p => `
                <div class="library-item">
                    <div class="library-item-icon"><i class="fas fa-user"></i></div>
                    <div class="library-item-info">
                        <h4>${p.fullName || 'Unnamed'}</h4>
                        <p>${p.email || ''} ${p.phone ? '· ' + p.phone : ''} ${p.jobTitle ? '· ' + p.jobTitle : ''}</p>
                    </div>
                    ${libActions(
                        libIconBtn('fas fa-pen', `editProfileDirect('${p.id}')`, 'Edit', 'var(--accent)') +
                        libIconBtn('fas fa-copy', `duplicateProfile('${p.id}')`, 'Duplicate') +
                        libIconBtn('fas fa-trash', `moveProfileToTrash('${p.id}')`, 'Delete', 'var(--danger)')
                    )}
                </div>
            `).join('')}
        </div>
        ${profiles.length > 0 ? `
            <button class="add-item-btn" onclick="showLibraryProfileForm()">
                <i class="fas fa-plus"></i> Add New Profile
            </button>
        ` : ''}
        <div id="library-profile-form" class="hidden" style="margin-top:16px;"></div>
    `;
}

function showLibraryProfileForm(editId) {
    const form = document.getElementById('library-profile-form');
    if (!form) return;
    form.classList.remove('hidden');
    
    const profile = editId ? Storage.getProfiles().find(p => p.id === editId) : null;
    const p = profile || {};
    
    form.innerHTML = `
        <div class="glass-card" style="padding:24px;">
            <h3 style="margin-bottom:16px;font-size:16px;">${editId ? 'Edit' : 'New'} Profile</h3>
            <div class="form-grid">
                <div class="form-group"><label>Full Name *</label><input type="text" class="form-input" id="lib-profile-name" value="${p.fullName || ''}" placeholder="Full name"></div>
                <div class="form-group"><label>Email *</label><input type="email" class="form-input" id="lib-profile-email" value="${p.email || ''}" placeholder="email@example.com"></div>
                <div class="form-group"><label>Phone</label><input type="tel" class="form-input" id="lib-profile-phone" value="${p.phone || ''}" placeholder="+91..."></div>
                <div class="form-group"><label>Location</label><input type="text" class="form-input" id="lib-profile-address" value="${p.address || ''}" placeholder="City, Country"></div>
                <div class="form-group"><label>Job Title</label><input type="text" class="form-input" id="lib-profile-title" value="${p.jobTitle || ''}" placeholder="Software Engineer"></div>
                <div class="form-group"><label>LinkedIn</label><input type="url" class="form-input" id="lib-profile-linkedin" value="${p.linkedin || ''}" placeholder="linkedin.com/in/..."></div>
                <div class="form-group"><label>GitHub</label><input type="url" class="form-input" id="lib-profile-github" value="${p.github || ''}" placeholder="github.com/..."></div>
                <div class="form-group"><label>Portfolio</label><input type="url" class="form-input" id="lib-profile-portfolio" value="${p.portfolio || ''}" placeholder="yourwebsite.com"></div>
            </div>
            <div class="form-group full-width" style="margin-top:12px;">
                <label>Summary</label>
                <textarea class="form-input form-textarea" id="lib-profile-summary" rows="3">${p.summary || ''}</textarea>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">
                <button class="btn btn-ghost" onclick="document.getElementById('library-profile-form').classList.add('hidden')">Cancel</button>
                <button class="btn btn-primary" onclick="saveLibraryProfileDirect('${editId || ''}')">${editId ? 'Update' : 'Save'} Profile</button>
            </div>
        </div>
    `;
}

function saveLibraryProfileDirect(editId) {
    const name = document.getElementById('lib-profile-name')?.value;
    if (!name) { showToast('Please enter a name', 'error'); return; }
    
    const profile = editId ? Storage.getProfiles().find(p => p.id === editId) || {} : {};
    profile.fullName = name;
    profile.email = document.getElementById('lib-profile-email')?.value || '';
    profile.phone = document.getElementById('lib-profile-phone')?.value || '';
    profile.address = document.getElementById('lib-profile-address')?.value || '';
    profile.jobTitle = document.getElementById('lib-profile-title')?.value || '';
    profile.linkedin = document.getElementById('lib-profile-linkedin')?.value || '';
    profile.github = document.getElementById('lib-profile-github')?.value || '';
    profile.portfolio = document.getElementById('lib-profile-portfolio')?.value || '';
    profile.summary = document.getElementById('lib-profile-summary')?.value || '';
    
    Storage.saveProfile(profile);
    showToast(editId ? 'Profile updated!' : 'Profile saved!', 'success');
    document.getElementById('library-profile-form')?.classList.add('hidden');
    renderProfilesLibrary(document.getElementById('library-content'));
}

function editProfileDirect(id) {
    showLibraryProfileForm(id);
}

function duplicateProfile(id) {
    const profile = Storage.getProfiles().find(p => p.id === id);
    if (!profile) return;
    const dup = { ...profile };
    delete dup.id;
    dup.fullName = (dup.fullName || '') + ' (Copy)';
    Storage.saveProfile(dup);
    showToast('Profile duplicated!', 'success');
    renderProfilesLibrary(document.getElementById('library-content'));
}

function moveProfileToTrash(id) {
    const profile = Storage.getProfiles().find(p => p.id === id);
    if (!profile) return;
    Storage.moveToLibraryTrash('profile', profile);
    Storage.deleteProfile(id);
    showToast('Profile moved to Recently Deleted', 'info');
    renderProfilesLibrary(document.getElementById('library-content'));
}

// ============================================
// EDUCATION
// ============================================
function renderEducationLibrary(container) {
    const education = Storage.getEducation();
    
    container.innerHTML = `
        <div class="library-list stagger-children">
            ${education.length === 0 ? `
                <div class="library-empty-state">
                    <i class="fas fa-graduation-cap"></i>
                    <h3>No education records</h3>
                    <p>Add your education details</p>
                    <button class="btn btn-primary" onclick="showEditEduForm()"><i class="fas fa-plus"></i> Add Education</button>
                </div>
            ` : education.map(e => `
                <div class="library-item">
                    <div class="library-item-icon"><i class="fas fa-graduation-cap"></i></div>
                    <div class="library-item-info">
                        <h4>${e.degree} ${e.course ? '- ' + e.course : ''}</h4>
                        <p>${e.institute || ''} ${e.cgpa ? '· CGPA: ' + e.cgpa : ''}</p>
                        <p style="font-size:11px;color:var(--text-tertiary);">${e.startYear || ''} - ${e.endYear || 'Present'}</p>
                    </div>
                    ${libActions(
                        libIconBtn('fas fa-pen', `showEditEduForm('${e.id}')`, 'Edit', 'var(--accent)') +
                        libIconBtn('fas fa-trash', `moveEduToTrash('${e.id}')`, 'Delete', 'var(--danger)')
                    )}
                </div>
            `).join('')}
        </div>
        ${education.length > 0 ? `<button class="add-item-btn" onclick="showEditEduForm()"><i class="fas fa-plus"></i> Add Education</button>` : ''}
        <div id="library-edu-form" class="hidden" style="margin-top:16px;"></div>
    `;
}

function showEditEduForm(editId) {
    const form = document.getElementById('library-edu-form');
    if (!form) return;
    form.classList.remove('hidden');
    
    const edu = editId ? Storage.getEducation().find(e => e.id === editId) : null;
    const e = edu || {};
    
    form.innerHTML = `
        <div class="glass-card" style="padding:24px;">
            <div class="form-grid">
                <div class="form-group"><label>Degree *</label><input type="text" class="form-input" id="lib-edu-degree" value="${e.degree || ''}" placeholder="B.Tech"></div>
                <div class="form-group"><label>Course</label><input type="text" class="form-input" id="lib-edu-course" value="${e.course || ''}" placeholder="Computer Science"></div>
                <div class="form-group"><label>Institute *</label><input type="text" class="form-input" id="lib-edu-institute" value="${e.institute || ''}" placeholder="IIT Bombay"></div>
                <div class="form-group"><label>CGPA</label><input type="text" class="form-input" id="lib-edu-cgpa" value="${e.cgpa || ''}" placeholder="8.5"></div>
                <div class="form-group"><label>Start Year</label><input type="number" class="form-input" id="lib-edu-start" value="${e.startYear || ''}" placeholder="2020"></div>
                <div class="form-group"><label>End Year</label><input type="number" class="form-input" id="lib-edu-end" value="${e.endYear || ''}" placeholder="2024"></div>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">
                <button class="btn btn-ghost" onclick="document.getElementById('library-edu-form').classList.add('hidden')">Cancel</button>
                <button class="btn btn-primary" onclick="saveEduDirect('${editId || ''}')">${editId ? 'Update' : 'Save'}</button>
            </div>
        </div>
    `;
}

function saveEduDirect(editId) {
    const degree = document.getElementById('lib-edu-degree')?.value;
    const institute = document.getElementById('lib-edu-institute')?.value;
    if (!degree || !institute) { showToast('Fill required fields', 'error'); return; }
    
    const edu = editId ? Storage.getEducation().find(e => e.id === editId) || {} : {};
    edu.degree = degree;
    edu.course = document.getElementById('lib-edu-course')?.value || '';
    edu.institute = institute;
    edu.cgpa = document.getElementById('lib-edu-cgpa')?.value || '';
    edu.startYear = document.getElementById('lib-edu-start')?.value || '';
    edu.endYear = document.getElementById('lib-edu-end')?.value || '';
    
    Storage.saveEducation(edu);
    showToast(editId ? 'Education updated!' : 'Education saved!', 'success');
    document.getElementById('library-edu-form')?.classList.add('hidden');
    renderEducationLibrary(document.getElementById('library-content'));
}

function moveEduToTrash(id) {
    const edu = Storage.getEducation().find(e => e.id === id);
    if (!edu) return;
    Storage.moveToLibraryTrash('education', edu);
    Storage.deleteEducation(id);
    showToast('Moved to Recently Deleted', 'info');
    renderEducationLibrary(document.getElementById('library-content'));
}

// ============================================
// EXPERIENCE
// ============================================
function renderExperienceLibrary(container) {
    const experience = Storage.getExperience();
    
    container.innerHTML = `
        <div class="library-list stagger-children">
            ${experience.length === 0 ? `
                <div class="library-empty-state">
                    <i class="fas fa-briefcase"></i>
                    <h3>No experience records</h3>
                    <p>Add your work experience</p>
                    <button class="btn btn-primary" onclick="showEditExpForm()"><i class="fas fa-plus"></i> Add Experience</button>
                </div>
            ` : experience.map(e => `
                <div class="library-item">
                    <div class="library-item-icon"><i class="fas fa-briefcase"></i></div>
                    <div class="library-item-info">
                        <h4>${e.role || 'Role'}</h4>
                        <p>${e.company || ''} ${e.type ? '· ' + e.type : ''}</p>
                        <p style="font-size:11px;color:var(--text-tertiary);">${e.startDate || ''} - ${e.current ? 'Present' : (e.endDate || '')}</p>
                    </div>
                    ${libActions(
                        libIconBtn('fas fa-pen', `showEditExpForm('${e.id}')`, 'Edit', 'var(--accent)') +
                        libIconBtn('fas fa-trash', `moveExpToTrash('${e.id}')`, 'Delete', 'var(--danger)')
                    )}
                </div>
            `).join('')}
        </div>
        ${experience.length > 0 ? `<button class="add-item-btn" onclick="showEditExpForm()"><i class="fas fa-plus"></i> Add Experience</button>` : ''}
        <div id="library-exp-form" class="hidden" style="margin-top:16px;"></div>
    `;
}

function showEditExpForm(editId) {
    const form = document.getElementById('library-exp-form');
    if (!form) return;
    form.classList.remove('hidden');
    
    const exp = editId ? Storage.getExperience().find(e => e.id === editId) : null;
    const e = exp || {};
    
    form.innerHTML = `
        <div class="glass-card" style="padding:24px;">
            <div class="form-grid">
                <div class="form-group"><label>Company *</label><input type="text" class="form-input" id="lib-exp-company" value="${e.company || ''}" placeholder="Company name"></div>
                <div class="form-group"><label>Role *</label><input type="text" class="form-input" id="lib-exp-role" value="${e.role || ''}" placeholder="Your role"></div>
                <div class="form-group"><label>Type</label>
                    <select class="form-input" id="lib-exp-type">
                        ${['Full-time','Part-time','Contract','Internship','Freelance'].map(t => `<option ${e.type === t ? 'selected' : ''}>${t}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>Location</label><input type="text" class="form-input" id="lib-exp-location" value="${e.location || ''}" placeholder="City"></div>
            </div>
            <div class="form-group full-width" style="margin-top:12px;">
                <label>Responsibilities</label>
                <textarea class="form-input form-textarea" id="lib-exp-resp" rows="3">${e.responsibilities || ''}</textarea>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">
                <button class="btn btn-ghost" onclick="document.getElementById('library-exp-form').classList.add('hidden')">Cancel</button>
                <button class="btn btn-primary" onclick="saveExpDirect('${editId || ''}')">${editId ? 'Update' : 'Save'}</button>
            </div>
        </div>
    `;
}

function saveExpDirect(editId) {
    const company = document.getElementById('lib-exp-company')?.value;
    const role = document.getElementById('lib-exp-role')?.value;
    if (!company || !role) { showToast('Fill required fields', 'error'); return; }
    
    const exp = editId ? Storage.getExperience().find(e => e.id === editId) || {} : {};
    exp.company = company;
    exp.role = role;
    exp.type = document.getElementById('lib-exp-type')?.value || 'Full-time';
    exp.location = document.getElementById('lib-exp-location')?.value || '';
    exp.responsibilities = document.getElementById('lib-exp-resp')?.value || '';
    
    Storage.saveExperience(exp);
    showToast(editId ? 'Experience updated!' : 'Experience saved!', 'success');
    document.getElementById('library-exp-form')?.classList.add('hidden');
    renderExperienceLibrary(document.getElementById('library-content'));
}

function moveExpToTrash(id) {
    const exp = Storage.getExperience().find(e => e.id === id);
    if (!exp) return;
    Storage.moveToLibraryTrash('experience', exp);
    Storage.deleteExperience(id);
    showToast('Moved to Recently Deleted', 'info');
    renderExperienceLibrary(document.getElementById('library-content'));
}

// ============================================
// SKILLS
// ============================================
function renderSkillsLibrary(container) {
    const skills = Storage.getSkills();
    
    container.innerHTML = `
        <div class="glass-card" style="padding:24px;">
            <h3 style="margin-bottom:16px;">Manage Skills</h3>
            <div class="chip-container" id="lib-skills-chips" style="min-height:60px;">
                ${skills.map(s => `<span class="chip">${s} <span class="chip-remove" onclick="removeLibrarySkillDirect('${s}')">&times;</span></span>`).join('')}
                <input type="text" class="chip-input" id="lib-skill-input" placeholder="Add a skill..." onkeydown="handleLibSkillInput(event)">
            </div>
            <p style="font-size:12px;color:var(--text-tertiary);margin-top:8px;">Press Enter to add. Skills are reused across resumes.</p>
        </div>
    `;
}

function handleLibSkillInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const input = document.getElementById('lib-skill-input');
        const value = input.value.trim();
        if (value) {
            const skills = Storage.getSkills();
            if (!skills.includes(value)) {
                skills.push(value);
                Storage.saveSkills(skills);
            }
            renderSkillsLibrary(document.getElementById('library-content'));
        }
    }
}

function removeLibrarySkillDirect(skill) {
    const skills = Storage.getSkills().filter(s => s !== skill);
    Storage.saveSkills(skills);
    Storage.moveToLibraryTrash('skill', { name: skill });
    renderSkillsLibrary(document.getElementById('library-content'));
}

// ============================================
// PROJECTS
// ============================================
function renderProjectsLibrary(container) {
    const projects = Storage.getProjects();
    
    container.innerHTML = `
        <div class="library-list stagger-children">
            ${projects.length === 0 ? `
                <div class="library-empty-state">
                    <i class="fas fa-diagram-project"></i>
                    <h3>No projects</h3>
                    <p>Add your projects to reuse in resumes</p>
                    <button class="btn btn-primary" onclick="showEditProjForm()"><i class="fas fa-plus"></i> Add Project</button>
                </div>
            ` : projects.map(p => `
                <div class="library-item">
                    <div class="library-item-icon"><i class="fas fa-diagram-project"></i></div>
                    <div class="library-item-info">
                        <h4>${p.name || 'Project'}</h4>
                        <p>${(p.techStack || '').substring(0, 50)}${(p.techStack || '').length > 50 ? '...' : ''}</p>
                    </div>
                    ${libActions(
                        libIconBtn('fas fa-pen', `showEditProjForm('${p.id}')`, 'Edit', 'var(--accent)') +
                        libIconBtn('fas fa-trash', `moveProjToTrash('${p.id}')`, 'Delete', 'var(--danger)')
                    )}
                </div>
            `).join('')}
        </div>
        ${projects.length > 0 ? `<button class="add-item-btn" onclick="showEditProjForm()"><i class="fas fa-plus"></i> Add Project</button>` : ''}
        <div id="library-proj-form" class="hidden" style="margin-top:16px;"></div>
    `;
}

function showEditProjForm(editId) {
    const form = document.getElementById('library-proj-form');
    if (!form) return;
    form.classList.remove('hidden');
    
    const proj = editId ? Storage.getProjects().find(p => p.id === editId) : null;
    const p = proj || {};
    
    form.innerHTML = `
        <div class="glass-card" style="padding:24px;">
            <div class="form-grid">
                <div class="form-group"><label>Name *</label><input type="text" class="form-input" id="lib-proj-name" value="${p.name || ''}" placeholder="Project name"></div>
                <div class="form-group"><label>Tech Stack</label><input type="text" class="form-input" id="lib-proj-tech" value="${p.techStack || ''}" placeholder="React, Node.js"></div>
            </div>
            <div class="form-group full-width" style="margin-top:12px;">
                <label>Description</label>
                <textarea class="form-input form-textarea" id="lib-proj-desc" rows="3">${p.description || ''}</textarea>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">
                <button class="btn btn-ghost" onclick="document.getElementById('library-proj-form').classList.add('hidden')">Cancel</button>
                <button class="btn btn-primary" onclick="saveProjDirect('${editId || ''}')">${editId ? 'Update' : 'Save'}</button>
            </div>
        </div>
    `;
}

function saveProjDirect(editId) {
    const name = document.getElementById('lib-proj-name')?.value;
    if (!name) { showToast('Enter project name', 'error'); return; }
    
    const proj = editId ? Storage.getProjects().find(p => p.id === editId) || {} : {};
    proj.name = name;
    proj.techStack = document.getElementById('lib-proj-tech')?.value || '';
    proj.description = document.getElementById('lib-proj-desc')?.value || '';
    
    Storage.saveProject(proj);
    showToast(editId ? 'Project updated!' : 'Project saved!', 'success');
    document.getElementById('library-proj-form')?.classList.add('hidden');
    renderProjectsLibrary(document.getElementById('library-content'));
}

function moveProjToTrash(id) {
    const proj = Storage.getProjects().find(p => p.id === id);
    if (!proj) return;
    Storage.moveToLibraryTrash('project', proj);
    Storage.deleteProject(id);
    showToast('Moved to Recently Deleted', 'info');
    renderProjectsLibrary(document.getElementById('library-content'));
}

// ============================================
// CERTIFICATIONS
// ============================================
function renderCertsLibrary(container) {
    const certs = Storage.getCertifications();
    
    container.innerHTML = `
        <div class="library-list stagger-children">
            ${certs.length === 0 ? `
                <div class="library-empty-state">
                    <i class="fas fa-certificate"></i>
                    <h3>No certifications</h3>
                    <p>Add your certifications here</p>
                    <button class="btn btn-primary" onclick="showEditCertForm()"><i class="fas fa-plus"></i> Add Certification</button>
                </div>
            ` : certs.map(c => `
                <div class="library-item">
                    <div class="library-item-icon"><i class="fas fa-certificate"></i></div>
                    <div class="library-item-info">
                        <h4>${c.name || 'Certificate'}</h4>
                        <p>${c.org || ''} ${c.date ? '· ' + c.date : ''}</p>
                    </div>
                    ${libActions(
                        libIconBtn('fas fa-pen', `showEditCertForm('${c.id}')`, 'Edit', 'var(--accent)') +
                        libIconBtn('fas fa-trash', `moveCertToTrash('${c.id}')`, 'Delete', 'var(--danger)')
                    )}
                </div>
            `).join('')}
        </div>
        ${certs.length > 0 ? `<button class="add-item-btn" onclick="showEditCertForm()"><i class="fas fa-plus"></i> Add Certification</button>` : ''}
        <div id="library-cert-form" class="hidden" style="margin-top:16px;"></div>
    `;
}

function showEditCertForm(editId) {
    const form = document.getElementById('library-cert-form');
    if (!form) return;
    form.classList.remove('hidden');
    
    const cert = editId ? Storage.getCertifications().find(c => c.id === editId) : null;
    const c = cert || {};
    
    form.innerHTML = `
        <div class="glass-card" style="padding:24px;">
            <div class="form-grid">
                <div class="form-group"><label>Certificate Name *</label><input type="text" class="form-input" id="lib-cert-name" value="${c.name || ''}" placeholder="Certificate name"></div>
                <div class="form-group"><label>Organization</label><input type="text" class="form-input" id="lib-cert-org" value="${c.org || ''}" placeholder="Issuing organization"></div>
                <div class="form-group"><label>Date</label><input type="month" class="form-input" id="lib-cert-date" value="${c.date || ''}"></div>
                <div class="form-group"><label>Credential URL</label><input type="url" class="form-input" id="lib-cert-url" value="${c.url || ''}" placeholder="Verification URL"></div>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">
                <button class="btn btn-ghost" onclick="document.getElementById('library-cert-form').classList.add('hidden')">Cancel</button>
                <button class="btn btn-primary" onclick="saveCertDirect('${editId || ''}')">${editId ? 'Update' : 'Save'}</button>
            </div>
        </div>
    `;
}

function saveCertDirect(editId) {
    const name = document.getElementById('lib-cert-name')?.value;
    if (!name) { showToast('Enter certificate name', 'error'); return; }
    
    const cert = editId ? Storage.getCertifications().find(c => c.id === editId) || {} : {};
    cert.name = name;
    cert.org = document.getElementById('lib-cert-org')?.value || '';
    cert.date = document.getElementById('lib-cert-date')?.value || '';
    cert.url = document.getElementById('lib-cert-url')?.value || '';
    
    Storage.saveCertification(cert);
    showToast(editId ? 'Certification updated!' : 'Certification saved!', 'success');
    document.getElementById('library-cert-form')?.classList.add('hidden');
    renderCertsLibrary(document.getElementById('library-content'));
}

function moveCertToTrash(id) {
    const cert = Storage.getCertifications().find(c => c.id === id);
    if (!cert) return;
    Storage.moveToLibraryTrash('certification', cert);
    Storage.deleteCertification(id);
    showToast('Moved to Recently Deleted', 'info');
    renderCertsLibrary(document.getElementById('library-content'));
}

// ============================================
// RECENTLY DELETED
// ============================================
function renderRecentlyDeleted(container) {
    const trash = Storage.getLibraryTrash();
    const resumeTrash = Storage.getTrash();
    const totalItems = trash.length + resumeTrash.length;
    
    container.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3 style="font-size:16px;"><i class="fas fa-trash-alt" style="color:var(--danger);margin-right:8px;"></i>Recently Deleted (${totalItems})</h3>
            ${totalItems > 0 ? `<button class="btn btn-danger btn-sm" onclick="emptyAllTrash()"><i class="fas fa-trash"></i> Empty All</button>` : ''}
        </div>
        
        ${totalItems === 0 ? `
            <div class="library-empty-state">
                <i class="fas fa-trash-alt"></i>
                <h3>Nothing deleted</h3>
                <p>Items moved to trash will appear here. You can restore them anytime.</p>
            </div>
        ` : `
            <div class="library-list stagger-children">
                ${trash.map((item, i) => `
                    <div class="library-item">
                        <div class="library-item-icon" style="background:rgba(239,68,68,0.1);color:var(--danger);">
                            <i class="fas ${_trashIcon(item._originalType)}"></i>
                        </div>
                        <div class="library-item-info">
                            <h4>${item.fullName || item.name || item.degree || item.role || item.title || 'Unknown'}</h4>
                            <p>${item._originalType || 'Item'} · Deleted ${_timeAgo(item._deletedAt)}</p>
                        </div>
                        <div class="library-item-actions">
                            <button onclick="restoreLibItem(${i})" title="Restore" style="color:var(--success);"><i class="fas fa-undo"></i></button>
                            <button onclick="permDeleteLibItem(${i})" title="Delete Forever"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                `).join('')}
                
                ${resumeTrash.map(r => `
                    <div class="library-item">
                        <div class="library-item-icon" style="background:rgba(239,68,68,0.1);color:var(--danger);">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="library-item-info">
                            <h4>${r.name || 'Resume'}</h4>
                            <p>Resume · Deleted ${_timeAgo(r.deletedAt)}</p>
                        </div>
                        <div class="library-item-actions">
                            <button onclick="Storage.restoreFromTrash('${r.id}');showToast('Restored!','success');renderRecentlyDeleted(document.getElementById('library-content'));" title="Restore" style="color:var(--success);"><i class="fas fa-undo"></i></button>
                            <button onclick="Storage.permanentDelete('${r.id}');showToast('Permanently deleted','info');renderRecentlyDeleted(document.getElementById('library-content'));" title="Delete Forever"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `}
    `;
}

function _trashIcon(type) {
    const icons = { profile: 'fa-user', education: 'fa-graduation-cap', experience: 'fa-briefcase', project: 'fa-diagram-project', certification: 'fa-certificate', achievement: 'fa-trophy', skill: 'fa-code' };
    return icons[type] || 'fa-file';
}

function _timeAgo(ts) {
    if (!ts) return 'recently';
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s/60) + 'm ago';
    if (s < 86400) return Math.floor(s/3600) + 'h ago';
    return Math.floor(s/86400) + 'd ago';
}

function restoreLibItem(index) {
    if (Storage.restoreFromLibraryTrash(index)) {
        showToast('Item restored!', 'success');
        renderRecentlyDeleted(document.getElementById('library-content'));
    }
}

function permDeleteLibItem(index) {
    if (Storage.permanentDeleteFromLibraryTrash(index)) {
        showToast('Permanently deleted', 'info');
        renderRecentlyDeleted(document.getElementById('library-content'));
    }
}

function emptyAllTrash() {
    if (confirm('Empty the entire Recently Deleted? This cannot be undone.')) {
        Storage.emptyLibraryTrash();
        Storage.emptyTrash();
        showToast('All trash emptied', 'info');
        renderRecentlyDeleted(document.getElementById('library-content'));
    }
}

function openResume(id) {
    const resume = Storage.getResumes().find(r => r.id === id);
    if (resume) {
        // Deep copy to prevent reference issues, preserve saved template
        currentResumeData = JSON.parse(JSON.stringify(resume));
        navigateTo('preview');
    }
}

function deleteResumeItem(id) {
    if (confirm('Delete this resume?')) {
        Storage.deleteResume(id);
        showToast('Resume deleted', 'info');
        if (typeof renderRecentResumes === 'function') renderRecentResumes();
    }
}
