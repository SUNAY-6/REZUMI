/* ============================================
   REZUMI - Library Page
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
    }
}

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
                    <div class="library-item-actions">
                        <button onclick="editProfile('${p.id}')" title="Edit"><i class="fas fa-pen"></i></button>
                        <button onclick="duplicateProfile('${p.id}')" title="Duplicate"><i class="fas fa-copy"></i></button>
                        <button onclick="deleteProfileItem('${p.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
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

function showLibraryProfileForm() {
    const form = document.getElementById('library-profile-form');
    if (!form) return;
    form.classList.remove('hidden');
    form.innerHTML = `
        <div class="glass-card" style="padding:24px;">
            <h3 style="margin-bottom:16px;font-size:16px;">New Profile</h3>
            <div class="form-grid">
                <div class="form-group">
                    <label>Full Name *</label>
                    <input type="text" class="form-input" id="lib-profile-name" placeholder="Full name">
                </div>
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" class="form-input" id="lib-profile-email" placeholder="email@example.com">
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" class="form-input" id="lib-profile-phone" placeholder="+91...">
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" class="form-input" id="lib-profile-address" placeholder="City, Country">
                </div>
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" class="form-input" id="lib-profile-title" placeholder="Software Engineer">
                </div>
                <div class="form-group">
                    <label>LinkedIn</label>
                    <input type="url" class="form-input" id="lib-profile-linkedin" placeholder="linkedin.com/in/...">
                </div>
                <div class="form-group">
                    <label>GitHub</label>
                    <input type="url" class="form-input" id="lib-profile-github" placeholder="github.com/...">
                </div>
                <div class="form-group">
                    <label>Portfolio</label>
                    <input type="url" class="form-input" id="lib-profile-portfolio" placeholder="yourwebsite.com">
                </div>
            </div>
            <div class="form-group full-width" style="margin-top:12px;">
                <label>Summary</label>
                <textarea class="form-input form-textarea" id="lib-profile-summary" rows="3" placeholder="Professional summary..."></textarea>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">
                <button class="btn btn-ghost" onclick="document.getElementById('library-profile-form').classList.add('hidden')">Cancel</button>
                <button class="btn btn-primary" onclick="saveLibraryProfile()">Save Profile</button>
            </div>
        </div>
    `;
}

function saveLibraryProfile() {
    const name = document.getElementById('lib-profile-name')?.value;
    if (!name) { showToast('Please enter a name', 'error'); return; }
    
    const profile = {
        fullName: name,
        email: document.getElementById('lib-profile-email')?.value || '',
        phone: document.getElementById('lib-profile-phone')?.value || '',
        address: document.getElementById('lib-profile-address')?.value || '',
        jobTitle: document.getElementById('lib-profile-title')?.value || '',
        linkedin: document.getElementById('lib-profile-linkedin')?.value || '',
        github: document.getElementById('lib-profile-github')?.value || '',
        portfolio: document.getElementById('lib-profile-portfolio')?.value || '',
        summary: document.getElementById('lib-profile-summary')?.value || ''
    };
    
    Storage.saveProfile(profile);
    showToast('Profile saved!', 'success');
    renderProfilesLibrary(document.getElementById('library-content'));
}

function editProfile(id) {
    const profile = Storage.getProfiles().find(p => p.id === id);
    if (!profile) return;
    
    const form = document.getElementById('library-profile-form');
    if (!form) return;
    form.classList.remove('hidden');
    form.innerHTML = `
        <div class="glass-card" style="padding:24px;">
            <h3 style="margin-bottom:16px;font-size:16px;">Edit Profile</h3>
            <div class="form-grid">
                <div class="form-group">
                    <label>Full Name *</label>
                    <input type="text" class="form-input" id="lib-profile-name" value="${profile.fullName || ''}">
                </div>
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" class="form-input" id="lib-profile-email" value="${profile.email || ''}">
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" class="form-input" id="lib-profile-phone" value="${profile.phone || ''}">
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" class="form-input" id="lib-profile-address" value="${profile.address || ''}">
                </div>
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" class="form-input" id="lib-profile-title" value="${profile.jobTitle || ''}">
                </div>
                <div class="form-group">
                    <label>LinkedIn</label>
                    <input type="url" class="form-input" id="lib-profile-linkedin" value="${profile.linkedin || ''}">
                </div>
                <div class="form-group">
                    <label>GitHub</label>
                    <input type="url" class="form-input" id="lib-profile-github" value="${profile.github || ''}">
                </div>
                <div class="form-group">
                    <label>Portfolio</label>
                    <input type="url" class="form-input" id="lib-profile-portfolio" value="${profile.portfolio || ''}">
                </div>
            </div>
            <div class="form-group full-width" style="margin-top:12px;">
                <label>Summary</label>
                <textarea class="form-input form-textarea" id="lib-profile-summary" rows="3">${profile.summary || ''}</textarea>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">
                <button class="btn btn-ghost" onclick="document.getElementById('library-profile-form').classList.add('hidden')">Cancel</button>
                <button class="btn btn-primary" onclick="updateProfile('${id}')">Update Profile</button>
            </div>
        </div>
    `;
}

function updateProfile(id) {
    const profile = Storage.getProfiles().find(p => p.id === id);
    if (!profile) return;
    
    profile.fullName = document.getElementById('lib-profile-name')?.value || profile.fullName;
    profile.email = document.getElementById('lib-profile-email')?.value || profile.email;
    profile.phone = document.getElementById('lib-profile-phone')?.value || profile.phone;
    profile.address = document.getElementById('lib-profile-address')?.value || profile.address;
    profile.jobTitle = document.getElementById('lib-profile-title')?.value || profile.jobTitle;
    profile.linkedin = document.getElementById('lib-profile-linkedin')?.value || profile.linkedin;
    profile.github = document.getElementById('lib-profile-github')?.value || profile.github;
    profile.portfolio = document.getElementById('lib-profile-portfolio')?.value || profile.portfolio;
    profile.summary = document.getElementById('lib-profile-summary')?.value || profile.summary;
    
    Storage.saveProfile(profile);
    showToast('Profile updated!', 'success');
    renderProfilesLibrary(document.getElementById('library-content'));
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

function deleteProfileItem(id) {
    if (confirm('Delete this profile?')) {
        Storage.deleteProfile(id);
        showToast('Profile deleted', 'info');
        renderProfilesLibrary(document.getElementById('library-content'));
    }
}

function renderEducationLibrary(container) {
    const education = Storage.getEducation();
    
    container.innerHTML = `
        <div class="library-list stagger-children">
            ${education.length === 0 ? `
                <div class="library-empty-state">
                    <i class="fas fa-graduation-cap"></i>
                    <h3>No education records</h3>
                    <p>Add your education details</p>
                    <button class="btn btn-primary" onclick="showAddEduLibraryForm()">
                        <i class="fas fa-plus"></i> Add Education
                    </button>
                </div>
            ` : education.map(e => `
                <div class="library-item">
                    <div class="library-item-icon"><i class="fas fa-graduation-cap"></i></div>
                    <div class="library-item-info">
                        <h4>${e.degree} ${e.course ? '- ' + e.course : ''}</h4>
                        <p>${e.institute || ''} ${e.cgpa ? '· CGPA: ' + e.cgpa : ''}</p>
                        <p style="font-size:11px;color:var(--text-tertiary);">${e.startYear || ''} - ${e.endYear || 'Present'}</p>
                    </div>
                    <div class="library-item-actions">
                        <button onclick="deleteEduItem('${e.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `).join('')}
        </div>
        ${education.length > 0 ? `
            <button class="add-item-btn" onclick="showAddEduLibraryForm()">
                <i class="fas fa-plus"></i> Add Education
            </button>
        ` : ''}
        <div id="library-edu-form" class="hidden" style="margin-top:16px;"></div>
    `;
}

function showAddEduLibraryForm() {
    const form = document.getElementById('library-edu-form');
    if (!form) return;
    form.classList.remove('hidden');
    form.innerHTML = `
        <div class="glass-card" style="padding:24px;">
            <div class="form-grid">
                <div class="form-group">
                    <label>Degree *</label>
                    <input type="text" class="form-input" id="lib-edu-degree" placeholder="B.Tech">
                </div>
                <div class="form-group">
                    <label>Course / Stream</label>
                    <input type="text" class="form-input" id="lib-edu-course" placeholder="Computer Science">
                </div>
                <div class="form-group">
                    <label>Institute *</label>
                    <input type="text" class="form-input" id="lib-edu-institute" placeholder="IIT Bombay">
                </div>
                <div class="form-group">
                    <label>CGPA / Percentage</label>
                    <input type="text" class="form-input" id="lib-edu-cgpa" placeholder="8.5">
                </div>
                <div class="form-group">
                    <label>Start Year</label>
                    <input type="number" class="form-input" id="lib-edu-start" placeholder="2020">
                </div>
                <div class="form-group">
                    <label>End Year</label>
                    <input type="number" class="form-input" id="lib-edu-end" placeholder="2024">
                </div>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">
                <button class="btn btn-ghost" onclick="document.getElementById('library-edu-form').classList.add('hidden')">Cancel</button>
                <button class="btn btn-primary" onclick="saveLibraryEducation()">Save</button>
            </div>
        </div>
    `;
}

function saveLibraryEducation() {
    const degree = document.getElementById('lib-edu-degree')?.value;
    const institute = document.getElementById('lib-edu-institute')?.value;
    if (!degree || !institute) { showToast('Fill required fields', 'error'); return; }
    
    Storage.saveEducation({
        degree,
        course: document.getElementById('lib-edu-course')?.value || '',
        institute,
        cgpa: document.getElementById('lib-edu-cgpa')?.value || '',
        startYear: document.getElementById('lib-edu-start')?.value || '',
        endYear: document.getElementById('lib-edu-end')?.value || ''
    });
    
    showToast('Education added!', 'success');
    renderEducationLibrary(document.getElementById('library-content'));
}

function deleteEduItem(id) {
    if (confirm('Delete this record?')) {
        Storage.deleteEducation(id);
        renderEducationLibrary(document.getElementById('library-content'));
    }
}

function renderExperienceLibrary(container) {
    const experience = Storage.getExperience();
    
    container.innerHTML = `
        <div class="library-list stagger-children">
            ${experience.length === 0 ? `
                <div class="library-empty-state">
                    <i class="fas fa-briefcase"></i>
                    <h3>No experience records</h3>
                    <p>Add your work experience</p>
                    <button class="btn btn-primary" onclick="showAddExpLibraryForm()">
                        <i class="fas fa-plus"></i> Add Experience
                    </button>
                </div>
            ` : experience.map(e => `
                <div class="library-item">
                    <div class="library-item-icon"><i class="fas fa-briefcase"></i></div>
                    <div class="library-item-info">
                        <h4>${e.role || 'Role'}</h4>
                        <p>${e.company || ''} ${e.type ? '· ' + e.type : ''}</p>
                        <p style="font-size:11px;color:var(--text-tertiary);">${e.startDate || ''} - ${e.current ? 'Present' : (e.endDate || '')}</p>
                    </div>
                    <div class="library-item-actions">
                        <button onclick="deleteExpItem('${e.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `).join('')}
        </div>
        ${experience.length > 0 ? `
            <button class="add-item-btn" onclick="showAddExpLibraryForm()">
                <i class="fas fa-plus"></i> Add Experience
            </button>
        ` : ''}
        <div id="library-exp-form" class="hidden" style="margin-top:16px;"></div>
    `;
}

function showAddExpLibraryForm() {
    const form = document.getElementById('library-exp-form');
    if (!form) return;
    form.classList.remove('hidden');
    form.innerHTML = `
        <div class="glass-card" style="padding:24px;">
            <div class="form-grid">
                <div class="form-group">
                    <label>Company *</label>
                    <input type="text" class="form-input" id="lib-exp-company" placeholder="Company name">
                </div>
                <div class="form-group">
                    <label>Role *</label>
                    <input type="text" class="form-input" id="lib-exp-role" placeholder="Your role">
                </div>
                <div class="form-group">
                    <label>Type</label>
                    <select class="form-input" id="lib-exp-type">
                        <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" class="form-input" id="lib-exp-location" placeholder="City">
                </div>
            </div>
            <div class="form-group full-width" style="margin-top:12px;">
                <label>Responsibilities</label>
                <textarea class="form-input form-textarea" id="lib-exp-resp" rows="3" placeholder="Key responsibilities..."></textarea>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">
                <button class="btn btn-ghost" onclick="document.getElementById('library-exp-form').classList.add('hidden')">Cancel</button>
                <button class="btn btn-primary" onclick="saveLibraryExperience()">Save</button>
            </div>
        </div>
    `;
}

function saveLibraryExperience() {
    const company = document.getElementById('lib-exp-company')?.value;
    const role = document.getElementById('lib-exp-role')?.value;
    if (!company || !role) { showToast('Fill required fields', 'error'); return; }
    
    Storage.saveExperience({
        company, role,
        type: document.getElementById('lib-exp-type')?.value || 'Full-time',
        location: document.getElementById('lib-exp-location')?.value || '',
        responsibilities: document.getElementById('lib-exp-resp')?.value || '',
        startDate: '', endDate: '', current: false
    });
    
    showToast('Experience added!', 'success');
    renderExperienceLibrary(document.getElementById('library-content'));
}

function deleteExpItem(id) {
    if (confirm('Delete this record?')) {
        Storage.deleteExperience(id);
        renderExperienceLibrary(document.getElementById('library-content'));
    }
}

function renderSkillsLibrary(container) {
    const skills = Storage.getSkills();
    
    container.innerHTML = `
        <div class="glass-card" style="padding:24px;">
            <h3 style="margin-bottom:16px;">Manage Skills</h3>
            <div class="chip-container" id="lib-skills-chips" style="min-height:60px;">
                ${skills.map(s => `
                    <span class="chip">${s} <span class="chip-remove" onclick="removeLibrarySkill('${s}')">&times;</span></span>
                `).join('')}
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

function removeLibrarySkill(skill) {
    const skills = Storage.getSkills().filter(s => s !== skill);
    Storage.saveSkills(skills);
    renderSkillsLibrary(document.getElementById('library-content'));
}

function renderProjectsLibrary(container) {
    const projects = Storage.getProjects();
    
    container.innerHTML = `
        <div class="library-list stagger-children">
            ${projects.length === 0 ? `
                <div class="library-empty-state">
                    <i class="fas fa-diagram-project"></i>
                    <h3>No projects</h3>
                    <p>Add your projects to reuse in resumes</p>
                    <button class="btn btn-primary" onclick="showAddProjectLibraryForm()">
                        <i class="fas fa-plus"></i> Add Project
                    </button>
                </div>
            ` : projects.map(p => `
                <div class="library-item">
                    <div class="library-item-icon"><i class="fas fa-diagram-project"></i></div>
                    <div class="library-item-info">
                        <h4>${p.name || 'Project'}</h4>
                        <p>${(p.techStack || '').substring(0, 50)}${(p.techStack || '').length > 50 ? '...' : ''}</p>
                    </div>
                    <div class="library-item-actions">
                        <button onclick="deleteProjectItem('${p.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `).join('')}
        </div>
        ${projects.length > 0 ? `
            <button class="add-item-btn" onclick="showAddProjectLibraryForm()">
                <i class="fas fa-plus"></i> Add Project
            </button>
        ` : ''}
        <div id="library-proj-form" class="hidden" style="margin-top:16px;"></div>
    `;
}

function showAddProjectLibraryForm() {
    const form = document.getElementById('library-proj-form');
    if (!form) return;
    form.classList.remove('hidden');
    form.innerHTML = `
        <div class="glass-card" style="padding:24px;">
            <div class="form-grid">
                <div class="form-group">
                    <label>Project Name *</label>
                    <input type="text" class="form-input" id="lib-proj-name" placeholder="Project name">
                </div>
                <div class="form-group">
                    <label>Tech Stack</label>
                    <input type="text" class="form-input" id="lib-proj-tech" placeholder="React, Node.js">
                </div>
            </div>
            <div class="form-group full-width" style="margin-top:12px;">
                <label>Description</label>
                <textarea class="form-input form-textarea" id="lib-proj-desc" rows="3" placeholder="Project description..."></textarea>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">
                <button class="btn btn-ghost" onclick="document.getElementById('library-proj-form').classList.add('hidden')">Cancel</button>
                <button class="btn btn-primary" onclick="saveLibraryProject()">Save</button>
            </div>
        </div>
    `;
}

function saveLibraryProject() {
    const name = document.getElementById('lib-proj-name')?.value;
    if (!name) { showToast('Enter project name', 'error'); return; }
    
    Storage.saveProject({
        name,
        techStack: document.getElementById('lib-proj-tech')?.value || '',
        description: document.getElementById('lib-proj-desc')?.value || ''
    });
    
    showToast('Project added!', 'success');
    renderProjectsLibrary(document.getElementById('library-content'));
}

function deleteProjectItem(id) {
    if (confirm('Delete this project?')) {
        Storage.deleteProject(id);
        renderProjectsLibrary(document.getElementById('library-content'));
    }
}

function renderCertsLibrary(container) {
    const certs = Storage.getCertifications();
    
    container.innerHTML = `
        <div class="library-list stagger-children">
            ${certs.length === 0 ? `
                <div class="library-empty-state">
                    <i class="fas fa-certificate"></i>
                    <h3>No certifications</h3>
                    <p>Add your certifications here</p>
                    <button class="btn btn-primary" onclick="showAddCertLibraryForm()">
                        <i class="fas fa-plus"></i> Add Certification
                    </button>
                </div>
            ` : certs.map(c => `
                <div class="library-item">
                    <div class="library-item-icon"><i class="fas fa-certificate"></i></div>
                    <div class="library-item-info">
                        <h4>${c.name || 'Certificate'}</h4>
                        <p>${c.org || ''} ${c.date ? '· ' + c.date : ''}</p>
                    </div>
                    <div class="library-item-actions">
                        <button onclick="deleteCertItem('${c.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `).join('')}
        </div>
        ${certs.length > 0 ? `
            <button class="add-item-btn" onclick="showAddCertLibraryForm()">
                <i class="fas fa-plus"></i> Add Certification
            </button>
        ` : ''}
        <div id="library-cert-form" class="hidden" style="margin-top:16px;"></div>
    `;
}

function showAddCertLibraryForm() {
    const form = document.getElementById('library-cert-form');
    if (!form) return;
    form.classList.remove('hidden');
    form.innerHTML = `
        <div class="glass-card" style="padding:24px;">
            <div class="form-grid">
                <div class="form-group">
                    <label>Certificate Name *</label>
                    <input type="text" class="form-input" id="lib-cert-name" placeholder="Certificate name">
                </div>
                <div class="form-group">
                    <label>Organization</label>
                    <input type="text" class="form-input" id="lib-cert-org" placeholder="Issuing organization">
                </div>
                <div class="form-group">
                    <label>Date</label>
                    <input type="month" class="form-input" id="lib-cert-date">
                </div>
                <div class="form-group">
                    <label>Credential URL</label>
                    <input type="url" class="form-input" id="lib-cert-url" placeholder="Verification URL">
                </div>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">
                <button class="btn btn-ghost" onclick="document.getElementById('library-cert-form').classList.add('hidden')">Cancel</button>
                <button class="btn btn-primary" onclick="saveLibraryCert()">Save</button>
            </div>
        </div>
    `;
}

function saveLibraryCert() {
    const name = document.getElementById('lib-cert-name')?.value;
    if (!name) { showToast('Enter certificate name', 'error'); return; }
    
    Storage.saveCertification({
        name,
        org: document.getElementById('lib-cert-org')?.value || '',
        date: document.getElementById('lib-cert-date')?.value || '',
        url: document.getElementById('lib-cert-url')?.value || ''
    });
    
    showToast('Certification added!', 'success');
    renderCertsLibrary(document.getElementById('library-content'));
}

function deleteCertItem(id) {
    if (confirm('Delete this certification?')) {
        Storage.deleteCertification(id);
        renderCertsLibrary(document.getElementById('library-content'));
    }
}

function openResume(id) {
    const resume = Storage.getResumes().find(r => r.id === id);
    if (resume) {
        currentResumeData = resume;
        navigateTo('preview');
    }
}

function deleteResumeItem(id) {
    if (confirm('Delete this resume?')) {
        Storage.deleteResume(id);
        renderRecentResumes();
        showToast('Resume deleted', 'info');
    }
}
