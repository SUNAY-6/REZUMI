/* ============================================
   REZUMI - Builder (Quick Resume)
   ============================================ */

let currentStep = 1;
const totalSteps = 9;
let builderState = {};

function initBuilderPage() {
    builderState = Storage.getCurrentResumeState();
    currentStep = builderState.step || 1;
    renderStep(currentStep);
    updateStepIndicator();
}

function renderStep(step) {
    const content = document.getElementById('step-content');
    if (!content) return;
    
    content.style.opacity = '0';
    content.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        switch(step) {
            case 1: renderProfileStep(content); break;
            case 2: renderEducationStep(content); break;
            case 3: renderExperienceStep(content); break;
            case 4: renderSkillsStep(content); break;
            case 5: renderProjectsStep(content); break;
            case 6: renderCertsStep(content); break;
            case 7: renderExtraStep(content); break;
            case 8: renderTemplateStep(content); break;
            case 9: renderCompletionStep(content); break;
        }
        
        content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
    }, 150);
    
    updateStepIndicator();
    updateStepNav();
}

function updateStepIndicator() {
    const fill = document.getElementById('step-progress-fill');
    if (fill) {
        fill.style.width = `${(currentStep / totalSteps) * 100}%`;
    }
    
    document.querySelectorAll('.step-item').forEach(item => {
        const step = parseInt(item.dataset.step);
        item.classList.remove('active', 'completed');
        if (step === currentStep) item.classList.add('active');
        else if (step < currentStep) item.classList.add('completed');
    });
}

function updateStepNav() {
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const counter = document.getElementById('step-counter');
    
    if (prevBtn) prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    if (counter) counter.textContent = `Step ${currentStep} of ${totalSteps}`;
    
    if (nextBtn) {
        if (currentStep === totalSteps) {
            // Review step - show Generate button
            nextBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generate Resume';
        } else if (currentStep === totalSteps - 1) {
            // Template step -> go to review
            nextBtn.innerHTML = 'Review <i class="fas fa-clipboard-check"></i>';
        } else {
            nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
        }
    }
}

function nextStep() {
    saveCurrentStepData();
    
    if (currentStep === totalSteps) {
        // On review step -> Generate resume
        generateResumeFromState();
        return;
    }
    
    currentStep++;
    builderState.step = currentStep;
    Storage.saveCurrentResumeState(builderState);
    renderStep(currentStep);
}

function prevStep() {
    if (currentStep > 1) {
        saveCurrentStepData();
        currentStep--;
        builderState.step = currentStep;
        Storage.saveCurrentResumeState(builderState);
        renderStep(currentStep);
    }
}

function saveCurrentStepData() {
    // Data is saved as user interacts, this is a fallback
    Storage.saveCurrentResumeState(builderState);
}

// ============================================
// Step 1: Profile Selection
// ============================================
function renderProfileStep(container) {
    const profiles = Storage.getProfiles();
    
    container.innerHTML = `
        <div class="step-form">
            <h2>Select Personal Profile</h2>
            <p class="step-description">Choose a saved profile or create a new one</p>
            
            <div id="profiles-list">
                ${profiles.length === 0 ? `
                    <div class="library-empty-state">
                        <i class="fas fa-id-card"></i>
                        <h3>No profiles yet</h3>
                        <p>Create your first personal profile to get started</p>
                    </div>
                ` : profiles.map(p => `
                    <div class="profile-card glass-card ${builderState.profileId === p.id ? 'selected' : ''}" onclick="selectProfile('${p.id}')">
                        <div class="profile-name">${p.fullName || 'Unnamed'}</div>
                        <div class="profile-email">${p.email || ''}</div>
                        <div class="profile-links">
                            ${p.linkedin ? '<span class="profile-link-icon"><i class="fab fa-linkedin"></i></span>' : ''}
                            ${p.github ? '<span class="profile-link-icon"><i class="fab fa-github"></i></span>' : ''}
                            ${p.portfolio ? '<span class="profile-link-icon"><i class="fas fa-globe"></i></span>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <button class="add-item-btn" onclick="showNewProfileForm()">
                <i class="fas fa-plus"></i> Create New Profile
            </button>
            
            <div id="new-profile-form" class="hidden" style="margin-top:16px;"></div>
        </div>
    `;
}

function selectProfile(id) {
    builderState.profileId = id;
    document.querySelectorAll('.profile-card').forEach(c => c.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
}

function showNewProfileForm() {
    const form = document.getElementById('new-profile-form');
    if (!form) return;
    
    form.classList.remove('hidden');
    form.innerHTML = `
        <div class="inline-add-form">
            <div class="form-grid">
                <div class="form-group">
                    <label>Full Name *</label>
                    <input type="text" class="form-input" id="new-profile-name" placeholder="John Doe">
                </div>
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" class="form-input" id="new-profile-email" placeholder="john@example.com">
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" class="form-input" id="new-profile-phone" placeholder="+91 9876543210">
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" class="form-input" id="new-profile-address" placeholder="Bengaluru, India">
                </div>
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" class="form-input" id="new-profile-title" placeholder="Software Engineer">
                </div>
                <div class="form-group">
                    <label>Date of Birth</label>
                    <input type="date" class="form-input" id="new-profile-dob">
                </div>
            </div>
            <div class="form-section-title" style="margin-top:16px;"><i class="fas fa-link"></i> Social Links</div>
            <div class="social-links-grid">
                <div class="social-link-input">
                    <i class="fab fa-linkedin"></i>
                    <input type="url" placeholder="LinkedIn URL" id="new-profile-linkedin">
                </div>
                <div class="social-link-input">
                    <i class="fab fa-github"></i>
                    <input type="url" placeholder="GitHub URL" id="new-profile-github">
                </div>
                <div class="social-link-input">
                    <i class="fas fa-globe"></i>
                    <input type="url" placeholder="Portfolio URL" id="new-profile-portfolio">
                </div>
                <div class="social-link-input">
                    <i class="fab fa-leetcode" style="font-family:sans-serif;font-weight:700;font-size:12px;">LC</i>
                    <input type="url" placeholder="LeetCode URL" id="new-profile-leetcode">
                </div>
            </div>
            <div class="form-group full-width" style="margin-top:16px;">
                <label>Professional Summary</label>
                <textarea class="form-input form-textarea" id="new-profile-summary" rows="3" placeholder="Brief professional summary..."></textarea>
            </div>
            <div class="inline-add-actions" style="margin-top:16px;">
                <button class="btn btn-ghost" onclick="document.getElementById('new-profile-form').classList.add('hidden')">Cancel</button>
                <button class="btn btn-primary" onclick="saveNewProfile()">Save Profile</button>
            </div>
        </div>
    `;
}

function saveNewProfile() {
    const name = document.getElementById('new-profile-name')?.value;
    const email = document.getElementById('new-profile-email')?.value;
    
    if (!name) {
        showToast('Please enter your name', 'error');
        return;
    }
    
    const profile = {
        fullName: name,
        email: email || '',
        phone: document.getElementById('new-profile-phone')?.value || '',
        address: document.getElementById('new-profile-address')?.value || '',
        jobTitle: document.getElementById('new-profile-title')?.value || '',
        dob: document.getElementById('new-profile-dob')?.value || '',
        linkedin: document.getElementById('new-profile-linkedin')?.value || '',
        github: document.getElementById('new-profile-github')?.value || '',
        portfolio: document.getElementById('new-profile-portfolio')?.value || '',
        leetcode: document.getElementById('new-profile-leetcode')?.value || '',
        summary: document.getElementById('new-profile-summary')?.value || ''
    };
    
    const saved = Storage.saveProfile(profile);
    builderState.profileId = saved.id;
    
    showToast('Profile saved successfully!', 'success');
    renderProfileStep(document.getElementById('step-content'));
}

// ============================================
// Step 2: Education
// ============================================
function renderEducationStep(container) {
    const education = Storage.getEducation();
    const selectedIds = builderState.educationIds || [];
    
    container.innerHTML = `
        <div class="step-form">
            <h2>Education</h2>
            <p class="step-description">Select education records to include or add new ones</p>
            
            <div class="checkbox-list" id="education-list">
                ${education.length === 0 ? `
                    <div class="library-empty-state" style="padding:30px;">
                        <i class="fas fa-graduation-cap"></i>
                        <h3>No education records</h3>
                        <p>Add your education details below</p>
                    </div>
                ` : education.map(e => `
                    <div class="checkbox-item ${selectedIds.includes(e.id) ? 'checked' : ''}" onclick="toggleEducation('${e.id}')">
                        <input type="checkbox" ${selectedIds.includes(e.id) ? 'checked' : ''}>
                        <label>
                            <div style="font-weight:600;">${e.degree} ${e.course ? '- ' + e.course : ''}</div>
                            <div style="font-size:12px;color:var(--text-secondary);">${e.institute || ''} ${e.cgpa ? '· CGPA: ' + e.cgpa : ''}</div>
                            <div style="font-size:11px;color:var(--text-tertiary);">${e.startYear || ''} - ${e.endYear || 'Present'}</div>
                        </label>
                    </div>
                `).join('')}
            </div>
            
            <button class="add-item-btn" onclick="showAddEducationForm()">
                <i class="fas fa-plus"></i> Add Education
            </button>
            
            <div id="new-education-form" class="hidden" style="margin-top:16px;"></div>
        </div>
    `;
}

function toggleEducation(id) {
    if (!builderState.educationIds) builderState.educationIds = [];
    const idx = builderState.educationIds.indexOf(id);
    if (idx >= 0) builderState.educationIds.splice(idx, 1);
    else builderState.educationIds.push(id);
    
    renderEducationStep(document.getElementById('step-content'));
}

function showAddEducationForm() {
    const form = document.getElementById('new-education-form');
    if (!form) return;
    
    form.classList.remove('hidden');
    form.innerHTML = `
        <div class="inline-add-form">
            <div class="form-grid">
                <div class="form-group">
                    <label>Degree *</label>
                    <select class="form-input" id="new-edu-degree">
                        <option value="">Select degree</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="B.E.">B.E.</option>
                        <option value="B.Sc">B.Sc</option>
                        <option value="BCA">BCA</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="M.Sc">M.Sc</option>
                        <option value="MCA">MCA</option>
                        <option value="MBA">MBA</option>
                        <option value="Ph.D">Ph.D</option>
                        <option value="Diploma">Diploma</option>
                        <option value="12th">12th / HSC</option>
                        <option value="10th">10th / SSC</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Course / Stream</label>
                    <input type="text" class="form-input" id="new-edu-course" placeholder="Computer Science">
                </div>
                <div class="form-group">
                    <label>Institute *</label>
                    <input type="text" class="form-input" id="new-edu-institute" placeholder="IIT Bombay">
                </div>
                <div class="form-group">
                    <label>University</label>
                    <input type="text" class="form-input" id="new-edu-university" placeholder="University name">
                </div>
                <div class="form-group">
                    <label>CGPA / Percentage</label>
                    <input type="text" class="form-input" id="new-edu-cgpa" placeholder="8.5 / 85%">
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" class="form-input" id="new-edu-location" placeholder="Mumbai, India">
                </div>
                <div class="form-group">
                    <label>Start Year</label>
                    <input type="number" class="form-input" id="new-edu-start" placeholder="2020">
                </div>
                <div class="form-group">
                    <label>End Year</label>
                    <input type="number" class="form-input" id="new-edu-end" placeholder="2024">
                </div>
            </div>
            <div class="inline-add-actions" style="margin-top:16px;">
                <button class="btn btn-ghost" onclick="document.getElementById('new-education-form').classList.add('hidden')">Cancel</button>
                <button class="btn btn-primary" onclick="saveNewEducation()">Save</button>
            </div>
        </div>
    `;
}

function saveNewEducation() {
    const degree = document.getElementById('new-edu-degree')?.value;
    const institute = document.getElementById('new-edu-institute')?.value;
    
    if (!degree || !institute) {
        showToast('Please fill degree and institute', 'error');
        return;
    }
    
    const edu = {
        degree,
        course: document.getElementById('new-edu-course')?.value || '',
        institute,
        university: document.getElementById('new-edu-university')?.value || '',
        cgpa: document.getElementById('new-edu-cgpa')?.value || '',
        location: document.getElementById('new-edu-location')?.value || '',
        startYear: document.getElementById('new-edu-start')?.value || '',
        endYear: document.getElementById('new-edu-end')?.value || ''
    };
    
    const saved = Storage.saveEducation(edu);
    if (!builderState.educationIds) builderState.educationIds = [];
    builderState.educationIds.push(saved.id);
    
    showToast('Education added!', 'success');
    renderEducationStep(document.getElementById('step-content'));
}

// ============================================
// Step 3: Experience
// ============================================
function renderExperienceStep(container) {
    const experience = Storage.getExperience();
    const selectedIds = builderState.experienceIds || [];
    
    container.innerHTML = `
        <div class="step-form">
            <h2>Experience</h2>
            <p class="step-description">Select experiences to include or add new ones</p>
            
            <div class="checkbox-list" id="experience-list">
                ${experience.length === 0 ? `
                    <div class="library-empty-state" style="padding:30px;">
                        <i class="fas fa-briefcase"></i>
                        <h3>No experience records</h3>
                        <p>Add your work experience below</p>
                    </div>
                ` : experience.map(e => `
                    <div class="checkbox-item ${selectedIds.includes(e.id) ? 'checked' : ''}" onclick="toggleExperience('${e.id}')">
                        <input type="checkbox" ${selectedIds.includes(e.id) ? 'checked' : ''}>
                        <label>
                            <div style="font-weight:600;">${e.role || 'Role'}</div>
                            <div style="font-size:12px;color:var(--text-secondary);">${e.company || ''} ${e.type ? '· ' + e.type : ''}</div>
                            <div style="font-size:11px;color:var(--text-tertiary);">${e.startDate || ''} - ${e.current ? 'Present' : (e.endDate || '')}</div>
                        </label>
                    </div>
                `).join('')}
            </div>
            
            <button class="add-item-btn" onclick="showAddExperienceForm()">
                <i class="fas fa-plus"></i> Add Experience
            </button>
            
            <div id="new-experience-form" class="hidden" style="margin-top:16px;"></div>
        </div>
    `;
}

function toggleExperience(id) {
    if (!builderState.experienceIds) builderState.experienceIds = [];
    const idx = builderState.experienceIds.indexOf(id);
    if (idx >= 0) builderState.experienceIds.splice(idx, 1);
    else builderState.experienceIds.push(id);
    
    renderExperienceStep(document.getElementById('step-content'));
}

function showAddExperienceForm() {
    const form = document.getElementById('new-experience-form');
    if (!form) return;
    
    form.classList.remove('hidden');
    form.innerHTML = `
        <div class="inline-add-form">
            <div class="form-grid">
                <div class="form-group">
                    <label>Company *</label>
                    <input type="text" class="form-input" id="new-exp-company" placeholder="Google">
                </div>
                <div class="form-group">
                    <label>Role *</label>
                    <input type="text" class="form-input" id="new-exp-role" placeholder="Software Engineer">
                </div>
                <div class="form-group">
                    <label>Employment Type</label>
                    <select class="form-input" id="new-exp-type">
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" class="form-input" id="new-exp-location" placeholder="Bengaluru">
                </div>
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="month" class="form-input" id="new-exp-start">
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="month" class="form-input" id="new-exp-end">
                </div>
            </div>
            <div class="form-group full-width" style="margin-top:12px;">
                <label>Key Responsibilities & Achievements</label>
                <textarea class="form-input form-textarea" id="new-exp-responsibilities" rows="4" placeholder="• Led development of...&#10;• Improved performance by...&#10;• Collaborated with..."></textarea>
            </div>
            <div class="form-group full-width">
                <label>Technologies Used</label>
                <input type="text" class="form-input" id="new-exp-tech" placeholder="React, Node.js, AWS (comma separated)">
            </div>
            <div class="inline-add-actions" style="margin-top:16px;">
                <button class="btn btn-ghost" onclick="document.getElementById('new-experience-form').classList.add('hidden')">Cancel</button>
                <button class="btn btn-primary" onclick="saveNewExperience()">Save</button>
            </div>
        </div>
    `;
}

function saveNewExperience() {
    const company = document.getElementById('new-exp-company')?.value;
    const role = document.getElementById('new-exp-role')?.value;
    
    if (!company || !role) {
        showToast('Please fill company and role', 'error');
        return;
    }
    
    const exp = {
        company,
        role,
        type: document.getElementById('new-exp-type')?.value || 'Full-time',
        location: document.getElementById('new-exp-location')?.value || '',
        startDate: document.getElementById('new-exp-start')?.value || '',
        endDate: document.getElementById('new-exp-end')?.value || '',
        current: false,
        responsibilities: document.getElementById('new-exp-responsibilities')?.value || '',
        techUsed: document.getElementById('new-exp-tech')?.value || ''
    };
    
    const saved = Storage.saveExperience(exp);
    if (!builderState.experienceIds) builderState.experienceIds = [];
    builderState.experienceIds.push(saved.id);
    
    showToast('Experience added!', 'success');
    renderExperienceStep(document.getElementById('step-content'));
}

// ============================================
// Step 4: Skills
// ============================================
function renderSkillsStep(container) {
    const currentSkills = builderState.skills || [];
    const categories = [
        { name: 'Programming Languages', icon: 'fa-code', suggestions: ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go', 'Rust', 'C#'] },
        { name: 'Frameworks', icon: 'fa-layer-group', suggestions: ['React', 'Angular', 'Vue', 'Node.js', 'Django', 'Spring Boot', 'Next.js', 'Express'] },
        { name: 'Databases', icon: 'fa-database', suggestions: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase', 'DynamoDB'] },
        { name: 'Cloud & DevOps', icon: 'fa-cloud', suggestions: ['AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'] },
        { name: 'Tools', icon: 'fa-wrench', suggestions: ['Git', 'VS Code', 'Figma', 'Jira', 'Postman', 'Linux'] },
        { name: 'Soft Skills', icon: 'fa-users', suggestions: ['Leadership', 'Communication', 'Problem Solving', 'Team Work', 'Agile'] }
    ];
    
    container.innerHTML = `
        <div class="step-form">
            <h2>Skills</h2>
            <p class="step-description">Add your technical and soft skills</p>
            
            <div class="chip-container" id="skills-chip-container">
                ${currentSkills.map(s => `
                    <span class="chip">
                        ${s}
                        <span class="chip-remove" onclick="removeSkill('${s}')">&times;</span>
                    </span>
                `).join('')}
                <input type="text" class="chip-input" id="skill-input" placeholder="Type a skill and press Enter..." onkeydown="handleSkillInput(event)">
            </div>
            
            <div style="margin-top:24px;">
                ${categories.map(cat => `
                    <div class="skills-category">
                        <div class="skills-category-header">
                            <span class="skills-category-title"><i class="fas ${cat.icon}" style="margin-right:6px;"></i>${cat.name}</span>
                        </div>
                        <div class="skill-tags">
                            ${cat.suggestions.filter(s => !currentSkills.includes(s)).map(s => `
                                <span class="tag" onclick="addSkillFromSuggestion('${s}')" style="cursor:pointer;">
                                    ${s} <i class="fas fa-plus" style="font-size:8px;margin-left:4px;opacity:0.5;"></i>
                                </span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function handleSkillInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const input = document.getElementById('skill-input');
        const value = input.value.trim();
        if (value) {
            addSkill(value);
            input.value = '';
        }
    }
}

function addSkill(skill) {
    if (!builderState.skills) builderState.skills = [];
    if (!builderState.skills.includes(skill)) {
        builderState.skills.push(skill);
        renderSkillsStep(document.getElementById('step-content'));
    }
}

function addSkillFromSuggestion(skill) {
    addSkill(skill);
}

function removeSkill(skill) {
    builderState.skills = (builderState.skills || []).filter(s => s !== skill);
    renderSkillsStep(document.getElementById('step-content'));
}

// ============================================
// Step 5: Projects
// ============================================
function renderProjectsStep(container) {
    const projects = Storage.getProjects();
    const selectedIds = builderState.projectIds || [];
    
    container.innerHTML = `
        <div class="step-form">
            <h2>Projects</h2>
            <p class="step-description">Select projects to include or add new ones</p>
            
            <div class="checkbox-list" id="projects-list">
                ${projects.length === 0 ? `
                    <div class="library-empty-state" style="padding:30px;">
                        <i class="fas fa-diagram-project"></i>
                        <h3>No projects yet</h3>
                        <p>Add your projects below</p>
                    </div>
                ` : projects.map(p => `
                    <div class="checkbox-item ${selectedIds.includes(p.id) ? 'checked' : ''}" onclick="toggleProject('${p.id}')">
                        <input type="checkbox" ${selectedIds.includes(p.id) ? 'checked' : ''}>
                        <label>
                            <div style="font-weight:600;">${p.name || 'Unnamed Project'}</div>
                            <div style="font-size:12px;color:var(--text-secondary);">${(p.techStack || '').substring(0, 60)}${(p.techStack || '').length > 60 ? '...' : ''}</div>
                        </label>
                    </div>
                `).join('')}
            </div>
            
            <button class="add-item-btn" onclick="showAddProjectForm()">
                <i class="fas fa-plus"></i> Add Project
            </button>
            
            <div id="new-project-form" class="hidden" style="margin-top:16px;"></div>
        </div>
    `;
}

function toggleProject(id) {
    if (!builderState.projectIds) builderState.projectIds = [];
    const idx = builderState.projectIds.indexOf(id);
    if (idx >= 0) builderState.projectIds.splice(idx, 1);
    else builderState.projectIds.push(id);
    
    renderProjectsStep(document.getElementById('step-content'));
}

function showAddProjectForm() {
    const form = document.getElementById('new-project-form');
    if (!form) return;
    
    form.classList.remove('hidden');
    form.innerHTML = `
        <div class="inline-add-form">
            <div class="form-grid">
                <div class="form-group">
                    <label>Project Name *</label>
                    <input type="text" class="form-input" id="new-proj-name" placeholder="E-Commerce Platform">
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <input type="text" class="form-input" id="new-proj-role" placeholder="Full Stack Developer">
                </div>
                <div class="form-group">
                    <label>GitHub URL</label>
                    <input type="url" class="form-input" id="new-proj-github" placeholder="https://github.com/...">
                </div>
                <div class="form-group">
                    <label>Live Demo URL</label>
                    <input type="url" class="form-input" id="new-proj-demo" placeholder="https://...">
                </div>
            </div>
            <div class="form-group full-width" style="margin-top:12px;">
                <label>Description</label>
                <textarea class="form-input form-textarea" id="new-proj-desc" rows="3" placeholder="Brief description of the project..."></textarea>
            </div>
            <div class="form-group full-width">
                <label>Tech Stack (comma separated)</label>
                <input type="text" class="form-input" id="new-proj-tech" placeholder="React, Node.js, MongoDB, AWS">
            </div>
            <div class="inline-add-actions" style="margin-top:16px;">
                <button class="btn btn-ghost" onclick="document.getElementById('new-project-form').classList.add('hidden')">Cancel</button>
                <button class="btn btn-primary" onclick="saveNewProject()">Save</button>
            </div>
        </div>
    `;
}

function saveNewProject() {
    const name = document.getElementById('new-proj-name')?.value;
    if (!name) {
        showToast('Please enter project name', 'error');
        return;
    }
    
    const project = {
        name,
        role: document.getElementById('new-proj-role')?.value || '',
        github: document.getElementById('new-proj-github')?.value || '',
        demo: document.getElementById('new-proj-demo')?.value || '',
        description: document.getElementById('new-proj-desc')?.value || '',
        techStack: document.getElementById('new-proj-tech')?.value || ''
    };
    
    const saved = Storage.saveProject(project);
    if (!builderState.projectIds) builderState.projectIds = [];
    builderState.projectIds.push(saved.id);
    
    showToast('Project added!', 'success');
    renderProjectsStep(document.getElementById('step-content'));
}

// ============================================
// Step 6: Certifications & Achievements
// ============================================
function renderCertsStep(container) {
    const certs = Storage.getCertifications();
    const selectedIds = builderState.certificationIds || [];
    const achievements = Storage.getAchievements();
    const achSelectedIds = builderState.achievementIds || [];
    
    container.innerHTML = `
        <div class="step-form">
            <h2>Certifications & Achievements</h2>
            <p class="step-description">Add your certifications and notable achievements</p>
            
            <div class="form-section">
                <div class="form-section-title"><i class="fas fa-certificate"></i> Certifications</div>
                <div class="checkbox-list">
                    ${certs.length === 0 ? '<p style="font-size:13px;color:var(--text-tertiary);padding:8px 0;">No certifications added</p>' : 
                    certs.map(c => `
                        <div class="checkbox-item ${selectedIds.includes(c.id) ? 'checked' : ''}" onclick="toggleCert('${c.id}')">
                            <input type="checkbox" ${selectedIds.includes(c.id) ? 'checked' : ''}>
                            <label>
                                <div style="font-weight:600;">${c.name || 'Certificate'}</div>
                                <div style="font-size:12px;color:var(--text-secondary);">${c.org || ''} ${c.date ? '· ' + c.date : ''}</div>
                            </label>
                        </div>
                    `).join('')}
                </div>
                <button class="add-item-btn" onclick="showAddCertForm()">
                    <i class="fas fa-plus"></i> Add Certification
                </button>
                <div id="new-cert-form" class="hidden" style="margin-top:12px;"></div>
            </div>
            
            <div class="form-section" style="margin-top:24px;">
                <div class="form-section-title"><i class="fas fa-trophy"></i> Achievements</div>
                <div class="checkbox-list">
                    ${achievements.length === 0 ? '<p style="font-size:13px;color:var(--text-tertiary);padding:8px 0;">No achievements added</p>' : 
                    achievements.map(a => `
                        <div class="checkbox-item ${achSelectedIds.includes(a.id) ? 'checked' : ''}" onclick="toggleAchievement('${a.id}')">
                            <input type="checkbox" ${achSelectedIds.includes(a.id) ? 'checked' : ''}>
                            <label>
                                <div style="font-weight:600;">${a.title || 'Achievement'}</div>
                                <div style="font-size:12px;color:var(--text-secondary);">${a.description || ''}</div>
                            </label>
                        </div>
                    `).join('')}
                </div>
                <button class="add-item-btn" onclick="showAddAchievementForm()">
                    <i class="fas fa-plus"></i> Add Achievement
                </button>
                <div id="new-achievement-form" class="hidden" style="margin-top:12px;"></div>
            </div>
        </div>
    `;
}

function toggleCert(id) {
    if (!builderState.certificationIds) builderState.certificationIds = [];
    const idx = builderState.certificationIds.indexOf(id);
    if (idx >= 0) builderState.certificationIds.splice(idx, 1);
    else builderState.certificationIds.push(id);
    renderCertsStep(document.getElementById('step-content'));
}

function toggleAchievement(id) {
    if (!builderState.achievementIds) builderState.achievementIds = [];
    const idx = builderState.achievementIds.indexOf(id);
    if (idx >= 0) builderState.achievementIds.splice(idx, 1);
    else builderState.achievementIds.push(id);
    renderCertsStep(document.getElementById('step-content'));
}

function showAddCertForm() {
    const form = document.getElementById('new-cert-form');
    if (!form) return;
    form.classList.remove('hidden');
    form.innerHTML = `
        <div class="inline-add-form">
            <div class="form-grid">
                <div class="form-group">
                    <label>Certificate Name *</label>
                    <input type="text" class="form-input" id="new-cert-name" placeholder="AWS Solutions Architect">
                </div>
                <div class="form-group">
                    <label>Organization</label>
                    <input type="text" class="form-input" id="new-cert-org" placeholder="Amazon Web Services">
                </div>
                <div class="form-group">
                    <label>Issue Date</label>
                    <input type="month" class="form-input" id="new-cert-date">
                </div>
                <div class="form-group">
                    <label>Credential URL</label>
                    <input type="url" class="form-input" id="new-cert-url" placeholder="https://...">
                </div>
            </div>
            <div class="inline-add-actions" style="margin-top:12px;">
                <button class="btn btn-ghost" onclick="document.getElementById('new-cert-form').classList.add('hidden')">Cancel</button>
                <button class="btn btn-primary" onclick="saveNewCert()">Save</button>
            </div>
        </div>
    `;
}

function saveNewCert() {
    const name = document.getElementById('new-cert-name')?.value;
    if (!name) { showToast('Please enter certificate name', 'error'); return; }
    
    const cert = {
        name,
        org: document.getElementById('new-cert-org')?.value || '',
        date: document.getElementById('new-cert-date')?.value || '',
        url: document.getElementById('new-cert-url')?.value || ''
    };
    
    const saved = Storage.saveCertification(cert);
    if (!builderState.certificationIds) builderState.certificationIds = [];
    builderState.certificationIds.push(saved.id);
    showToast('Certification added!', 'success');
    renderCertsStep(document.getElementById('step-content'));
}

function showAddAchievementForm() {
    const form = document.getElementById('new-achievement-form');
    if (!form) return;
    form.classList.remove('hidden');
    form.innerHTML = `
        <div class="inline-add-form">
            <div class="form-grid">
                <div class="form-group">
                    <label>Title *</label>
                    <input type="text" class="form-input" id="new-ach-title" placeholder="Hackathon Winner 2024">
                </div>
                <div class="form-group">
                    <label>Type</label>
                    <select class="form-input" id="new-ach-type">
                        <option value="Hackathon">Hackathon</option>
                        <option value="Award">Award</option>
                        <option value="Scholarship">Scholarship</option>
                        <option value="Competition">Competition</option>
                        <option value="Research">Research Paper</option>
                        <option value="Patent">Patent</option>
                    </select>
                </div>
            </div>
            <div class="form-group full-width" style="margin-top:12px;">
                <label>Description</label>
                <input type="text" class="form-input" id="new-ach-desc" placeholder="Brief description...">
            </div>
            <div class="inline-add-actions" style="margin-top:12px;">
                <button class="btn btn-ghost" onclick="document.getElementById('new-achievement-form').classList.add('hidden')">Cancel</button>
                <button class="btn btn-primary" onclick="saveNewAchievement()">Save</button>
            </div>
        </div>
    `;
}

function saveNewAchievement() {
    const title = document.getElementById('new-ach-title')?.value;
    if (!title) { showToast('Please enter title', 'error'); return; }
    
    const ach = {
        title,
        type: document.getElementById('new-ach-type')?.value || 'Award',
        description: document.getElementById('new-ach-desc')?.value || ''
    };
    
    const saved = Storage.saveAchievement(ach);
    if (!builderState.achievementIds) builderState.achievementIds = [];
    builderState.achievementIds.push(saved.id);
    showToast('Achievement added!', 'success');
    renderCertsStep(document.getElementById('step-content'));
}

// ============================================
// Step 7: Extra (Languages, Hobbies, Internships)
// ============================================
function renderExtraStep(container) {
    const languages = builderState.languages || [];
    const hobbies = builderState.hobbies || '';
    
    container.innerHTML = `
        <div class="step-form">
            <h2>Additional Information</h2>
            <p class="step-description">Languages, hobbies, and internships (optional)</p>
            
            <div class="form-section">
                <div class="form-section-title"><i class="fas fa-language"></i> Languages</div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Language 1</label>
                        <div style="display:flex;gap:8px;">
                            <input type="text" class="form-input" id="lang-1" placeholder="English" value="${languages[0]?.name || ''}">
                            <select class="form-input" id="lang-1-level" style="width:140px;">
                                <option value="Native" ${(languages[0]?.level||'') === 'Native' ? 'selected' : ''}>Native</option>
                                <option value="Fluent" ${(languages[0]?.level||'') === 'Fluent' ? 'selected' : ''}>Fluent</option>
                                <option value="Professional" ${(languages[0]?.level||'') === 'Professional' ? 'selected' : ''}>Professional</option>
                                <option value="Intermediate" ${(languages[0]?.level||'') === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                                <option value="Basic" ${(languages[0]?.level||'') === 'Basic' ? 'selected' : ''}>Basic</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Language 2</label>
                        <div style="display:flex;gap:8px;">
                            <input type="text" class="form-input" id="lang-2" placeholder="Hindi" value="${languages[1]?.name || ''}">
                            <select class="form-input" id="lang-2-level" style="width:140px;">
                                <option value="Native" ${(languages[1]?.level||'') === 'Native' ? 'selected' : ''}>Native</option>
                                <option value="Fluent" ${(languages[1]?.level||'') === 'Fluent' ? 'selected' : ''}>Fluent</option>
                                <option value="Professional" ${(languages[1]?.level||'') === 'Professional' ? 'selected' : ''}>Professional</option>
                                <option value="Intermediate" ${(languages[1]?.level||'') === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                                <option value="Basic" ${(languages[1]?.level||'') === 'Basic' ? 'selected' : ''}>Basic</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Language 3</label>
                        <div style="display:flex;gap:8px;">
                            <input type="text" class="form-input" id="lang-3" placeholder="Kannada" value="${languages[2]?.name || ''}">
                            <select class="form-input" id="lang-3-level" style="width:140px;">
                                <option value="">Select</option>
                                <option value="Native" ${(languages[2]?.level||'') === 'Native' ? 'selected' : ''}>Native</option>
                                <option value="Fluent" ${(languages[2]?.level||'') === 'Fluent' ? 'selected' : ''}>Fluent</option>
                                <option value="Professional" ${(languages[2]?.level||'') === 'Professional' ? 'selected' : ''}>Professional</option>
                                <option value="Intermediate" ${(languages[2]?.level||'') === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                                <option value="Basic" ${(languages[2]?.level||'') === 'Basic' ? 'selected' : ''}>Basic</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="form-section">
                <div class="form-section-title"><i class="fas fa-heart"></i> Hobbies & Interests</div>
                <input type="text" class="form-input" id="hobbies-input" placeholder="Reading, Open Source, Photography..." value="${hobbies}">
            </div>
        </div>
    `;
}

// ============================================
// Step 8: Template Selection (30+ Templates)
// ============================================
function renderTemplateStep(container) {
    const templates = typeof ResumeTemplates !== 'undefined' ? ResumeTemplates.registry : [
        { id: 'modern', name: 'Modern' }, { id: 'minimal', name: 'Minimal' },
        { id: 'corporate', name: 'Corporate' }, { id: 'developer', name: 'Developer' },
        { id: 'creative', name: 'Creative' }, { id: 'ats', name: 'ATS Optimized' }
    ];
    
    container.innerHTML = `
        <div class="step-form">
            <h2>Choose Template</h2>
            <p class="step-description">Select from 30+ professionally designed templates</p>
            
            <div class="template-filters" style="margin-bottom:20px;">
                <button class="filter-btn active" onclick="filterBuilderTemplates('all', this)">All</button>
                <button class="filter-btn" onclick="filterBuilderTemplates('modern', this)">Modern</button>
                <button class="filter-btn" onclick="filterBuilderTemplates('minimal', this)">Minimal</button>
                <button class="filter-btn" onclick="filterBuilderTemplates('corporate', this)">Corporate</button>
                <button class="filter-btn" onclick="filterBuilderTemplates('creative', this)">Creative</button>
                <button class="filter-btn" onclick="filterBuilderTemplates('developer', this)">Developer</button>
                <button class="filter-btn" onclick="filterBuilderTemplates('ats', this)">ATS</button>
            </div>
            
            <div class="template-select-grid" id="builder-template-grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr));">
                ${templates.map(t => `
                    <div class="template-select-card ${builderState.templateId === t.id ? 'selected' : ''}" data-category="${t.category}" onclick="selectTemplate('${t.id}')">
                        <div class="template-select-preview" style="height:180px;">
                            <div style="width:100%;height:100%;transform:scale(0.75);transform-origin:top left;">
                                ${typeof getTemplateMiniHTML === 'function' ? getTemplateMiniHTML(t.id) : '<div style="padding:8px;font-size:5px;"><div style="font-weight:700;">Name</div></div>'}
                            </div>
                        </div>
                        <div class="template-select-name" style="font-size:11px;">${t.name}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function filterBuilderTemplates(category, btn) {
    // Update filter buttons
    btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Filter cards
    document.querySelectorAll('#builder-template-grid .template-select-card').forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

function getMiniResumeHTML(templateId) {
    if (typeof getTemplateMiniHTML === "function") {
        return getTemplateMiniHTML(templateId);
    }
    const lines = '<div class="mini-line"></div><div class="mini-line short"></div>';
    return '<div style="padding:8px;"><div style="font-size:6px;font-weight:700;margin-bottom:4px;">Name</div>' + lines + '</div>';
}

function selectTemplate(id) {
    builderState.templateId = id;
    document.querySelectorAll('.template-select-card').forEach(c => c.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
}

// ============================================
// Step 9: Review & Edit (Comprehensive)
// ============================================
function renderCompletionStep(container) {
    const profile = Storage.getProfiles().find(p => p.id === builderState.profileId);
    const education = (builderState.educationIds || []).map(id => Storage.getEducation().find(e => e.id === id)).filter(Boolean);
    const experience = (builderState.experienceIds || []).map(id => Storage.getExperience().find(e => e.id === id)).filter(Boolean);
    const projects = (builderState.projectIds || []).map(id => Storage.getProjects().find(p => p.id === id)).filter(Boolean);
    const certifications = (builderState.certificationIds || []).map(id => Storage.getCertifications().find(c => c.id === id)).filter(Boolean);
    const achievements = (builderState.achievementIds || []).map(id => Storage.getAchievements().find(a => a.id === id)).filter(Boolean);
    const skills = builderState.skills || [];
    const languages = builderState.languages || [];
    const hobbies = builderState.hobbies || '';
    const template = typeof ResumeTemplates !== 'undefined' ? ResumeTemplates.get(builderState.templateId || 'modern') : { name: builderState.templateId || 'Modern' };

    container.innerHTML = `
        <div class="step-form" style="max-width:800px;">
            <h2><i class="fas fa-clipboard-check" style="color:var(--accent);margin-right:8px;"></i>Review & Edit</h2>
            <p class="step-description">Review everything before generating your resume. Click Edit on any section to make changes.</p>

            <!-- Summary Stats -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:10px;margin-bottom:24px;">
                <div class="glass-card" style="padding:12px;text-align:center;">
                    <div style="font-size:20px;font-weight:700;color:var(--accent);">${profile ? '✓' : '—'}</div>
                    <div style="font-size:10px;color:var(--text-tertiary);">Profile</div>
                </div>
                <div class="glass-card" style="padding:12px;text-align:center;">
                    <div style="font-size:20px;font-weight:700;color:var(--accent);">${education.length}</div>
                    <div style="font-size:10px;color:var(--text-tertiary);">Education</div>
                </div>
                <div class="glass-card" style="padding:12px;text-align:center;">
                    <div style="font-size:20px;font-weight:700;color:var(--accent);">${experience.length}</div>
                    <div style="font-size:10px;color:var(--text-tertiary);">Experience</div>
                </div>
                <div class="glass-card" style="padding:12px;text-align:center;">
                    <div style="font-size:20px;font-weight:700;color:var(--accent);">${skills.length}</div>
                    <div style="font-size:10px;color:var(--text-tertiary);">Skills</div>
                </div>
                <div class="glass-card" style="padding:12px;text-align:center;">
                    <div style="font-size:20px;font-weight:700;color:var(--accent);">${projects.length}</div>
                    <div style="font-size:10px;color:var(--text-tertiary);">Projects</div>
                </div>
                <div class="glass-card" style="padding:12px;text-align:center;">
                    <div style="font-size:20px;font-weight:700;color:var(--accent);">${certifications.length}</div>
                    <div style="font-size:10px;color:var(--text-tertiary);">Certs</div>
                </div>
            </div>

            <!-- Review Sections -->
            <div style="display:flex;flex-direction:column;gap:12px;">

                <!-- Personal Details -->
                <div class="glass-card review-section" style="padding:16px 20px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                        <div class="review-section-title" style="font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;">
                            <i class="fas fa-user" style="color:var(--accent);font-size:13px;"></i> Personal Details
                        </div>
                        <button class="btn btn-ghost btn-sm" onclick="reviewEditSection(1)"><i class="fas fa-pen"></i> Edit</button>
                    </div>
                    <div class="review-section-content" style="font-size:13px;">
                        ${profile ? `
                            <div style="font-weight:600;">${profile.fullName || 'Not set'}</div>
                            <div style="color:var(--text-secondary);font-size:12px;">${profile.email || ''} ${profile.phone ? '· ' + profile.phone : ''}</div>
                            <div style="color:var(--text-tertiary);font-size:11px;">${profile.address || ''} ${profile.jobTitle ? '· ' + profile.jobTitle : ''}</div>
                        ` : '<span style="color:var(--text-muted);font-size:12px;">No profile selected</span>'}
                    </div>
                </div>

                <!-- Education -->
                <div class="glass-card review-section" style="padding:16px 20px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                        <div class="review-section-title" style="font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;">
                            <i class="fas fa-graduation-cap" style="color:var(--accent);font-size:13px;"></i> Education (${education.length})
                        </div>
                        <button class="btn btn-ghost btn-sm" onclick="reviewEditSection(2)"><i class="fas fa-pen"></i> Edit</button>
                    </div>
                    <div class="review-section-content">
                        ${education.length === 0 ? '<span style="color:var(--text-muted);font-size:12px;">None selected</span>' :
                        education.map(e => `<div style="font-size:12px;margin-bottom:4px;"><strong>${e.degree}</strong> ${e.course ? '- ' + e.course : ''} — ${e.institute || ''} ${e.cgpa ? '(' + e.cgpa + ')' : ''}</div>`).join('')}
                    </div>
                </div>

                <!-- Experience -->
                <div class="glass-card review-section" style="padding:16px 20px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                        <div class="review-section-title" style="font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;">
                            <i class="fas fa-briefcase" style="color:var(--accent);font-size:13px;"></i> Experience (${experience.length})
                        </div>
                        <button class="btn btn-ghost btn-sm" onclick="reviewEditSection(3)"><i class="fas fa-pen"></i> Edit</button>
                    </div>
                    <div class="review-section-content">
                        ${experience.length === 0 ? '<span style="color:var(--text-muted);font-size:12px;">None selected</span>' :
                        experience.map(e => `<div style="font-size:12px;margin-bottom:4px;"><strong>${e.role || ''}</strong> at ${e.company || ''} ${e.startDate ? '(' + e.startDate + ')' : ''}</div>`).join('')}
                    </div>
                </div>

                <!-- Skills -->
                <div class="glass-card review-section" style="padding:16px 20px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                        <div class="review-section-title" style="font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;">
                            <i class="fas fa-code" style="color:var(--accent);font-size:13px;"></i> Skills (${skills.length})
                        </div>
                        <button class="btn btn-ghost btn-sm" onclick="reviewEditSection(4)"><i class="fas fa-pen"></i> Edit</button>
                    </div>
                    <div class="review-section-content">
                        ${skills.length === 0 ? '<span style="color:var(--text-muted);font-size:12px;">None added</span>' :
                        '<div style="display:flex;flex-wrap:wrap;gap:4px;">' + skills.map(s => `<span class="tag">${s}</span>`).join('') + '</div>'}
                    </div>
                </div>

                <!-- Projects -->
                <div class="glass-card review-section" style="padding:16px 20px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                        <div class="review-section-title" style="font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;">
                            <i class="fas fa-diagram-project" style="color:var(--accent);font-size:13px;"></i> Projects (${projects.length})
                        </div>
                        <button class="btn btn-ghost btn-sm" onclick="reviewEditSection(5)"><i class="fas fa-pen"></i> Edit</button>
                    </div>
                    <div class="review-section-content">
                        ${projects.length === 0 ? '<span style="color:var(--text-muted);font-size:12px;">None selected</span>' :
                        projects.map(p => `<div style="font-size:12px;margin-bottom:4px;"><strong>${p.name || ''}</strong>${p.techStack ? ' — ' + p.techStack : ''}</div>`).join('')}
                    </div>
                </div>

                <!-- Certifications & Achievements -->
                <div class="glass-card review-section" style="padding:16px 20px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                        <div class="review-section-title" style="font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;">
                            <i class="fas fa-certificate" style="color:var(--accent);font-size:13px;"></i> Certifications (${certifications.length}) & Achievements (${achievements.length})
                        </div>
                        <button class="btn btn-ghost btn-sm" onclick="reviewEditSection(6)"><i class="fas fa-pen"></i> Edit</button>
                    </div>
                    <div class="review-section-content">
                        ${certifications.length === 0 && achievements.length === 0 ? '<span style="color:var(--text-muted);font-size:12px;">None added</span>' : ''}
                        ${certifications.map(c => `<div style="font-size:12px;margin-bottom:3px;"><i class="fas fa-certificate" style="color:var(--accent);font-size:10px;margin-right:4px;"></i>${c.name || ''} ${c.org ? '— ' + c.org : ''}</div>`).join('')}
                        ${achievements.map(a => `<div style="font-size:12px;margin-bottom:3px;"><i class="fas fa-trophy" style="color:#f59e0b;font-size:10px;margin-right:4px;"></i>${a.title || ''}</div>`).join('')}
                    </div>
                </div>

                <!-- Languages -->
                <div class="glass-card review-section" style="padding:16px 20px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                        <div class="review-section-title" style="font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;">
                            <i class="fas fa-language" style="color:var(--accent);font-size:13px;"></i> Languages & Other
                        </div>
                        <button class="btn btn-ghost btn-sm" onclick="reviewEditSection(7)"><i class="fas fa-pen"></i> Edit</button>
                    </div>
                    <div class="review-section-content">
                        ${languages.length === 0 && !hobbies ? '<span style="color:var(--text-muted);font-size:12px;">None added</span>' : ''}
                        ${languages.map(l => `<span style="font-size:12px;margin-right:12px;">${l.name} (${l.level})</span>`).join('')}
                        ${hobbies ? `<div style="font-size:12px;margin-top:4px;color:var(--text-secondary);"><i class="fas fa-heart" style="color:#ec4899;font-size:10px;margin-right:4px;"></i>${hobbies}</div>` : ''}
                    </div>
                </div>

                <!-- Template -->
                <div class="glass-card review-section" style="padding:16px 20px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                        <div class="review-section-title" style="font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;">
                            <i class="fas fa-palette" style="color:var(--accent);font-size:13px;"></i> Template
                        </div>
                        <button class="btn btn-ghost btn-sm" onclick="reviewEditSection(8)"><i class="fas fa-pen"></i> Change</button>
                    </div>
                    <div class="review-section-content">
                        <div style="display:flex;align-items:center;gap:12px;">
                            <div style="width:60px;height:80px;background:white;border-radius:4px;overflow:hidden;flex-shrink:0;border:1px solid var(--border-color);">
                                <div style="transform:scale(0.3);transform-origin:top left;width:200px;height:260px;">
                                    ${typeof getTemplateMiniHTML === 'function' ? getTemplateMiniHTML(builderState.templateId || 'modern') : ''}
                                </div>
                            </div>
                            <div>
                                <div style="font-size:13px;font-weight:600;">${template.name || builderState.templateId || 'Modern'}</div>
                                <div style="font-size:11px;color:var(--text-tertiary);">${template.desc || template.category || ''}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reselect Options -->
            <div style="margin-top:20px;padding:16px 20px;border:1px dashed var(--border-color);border-radius:var(--radius-md);">
                <div style="font-size:12px;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Quick Actions</div>
                <div style="display:flex;flex-wrap:wrap;gap:8px;">
                    <button class="btn btn-glass btn-sm" onclick="reviewEditSection(1)"><i class="fas fa-user"></i> Edit Person</button>
                    <button class="btn btn-glass btn-sm" onclick="reviewEditSection(8)"><i class="fas fa-palette"></i> Change Template</button>
                    <button class="btn btn-glass btn-sm" onclick="currentStep=1;builderState={step:1,profileId:null,educationIds:[],experienceIds:[],skills:[],projectIds:[],certificationIds:[],achievementIds:[],languages:[],hobbies:'',templateId:'modern',customization:{}};Storage.saveCurrentResumeState(builderState);renderStep(1);"><i class="fas fa-redo"></i> Restart</button>
                </div>
            </div>

            <!-- Generate Button -->
            <div style="margin-top:24px;text-align:center;">
                <button class="btn btn-primary btn-lg" onclick="generateResumeFromState()" style="min-width:240px;">
                    <i class="fas fa-wand-magic-sparkles"></i> Generate Resume
                </button>
            </div>
        </div>
    `;
}

// Navigate to a specific step for editing from the Review page
function reviewEditSection(step) {
    // Save any current form data first (languages/hobbies from step 7)
    const lang1 = document.getElementById('lang-1');
    if (lang1) {
        builderState.languages = [];
        for (let i = 1; i <= 3; i++) {
            const name = document.getElementById('lang-' + i)?.value;
            const level = document.getElementById('lang-' + i + '-level')?.value;
            if (name) builderState.languages.push({ name: name, level: level || 'Intermediate' });
        }
        builderState.hobbies = document.getElementById('hobbies-input')?.value || '';
    }
    currentStep = step;
    builderState.step = step;
    Storage.saveCurrentResumeState(builderState);
    renderStep(step);
}

// ============================================
// Generate Resume
// ============================================
function generateResumeFromState() {
    // Save extra data from step 7
    const lang1 = document.getElementById('lang-1');
    if (lang1) {
        builderState.languages = [];
        for (let i = 1; i <= 3; i++) {
            const name = document.getElementById(`lang-${i}`)?.value;
            const level = document.getElementById(`lang-${i}-level`)?.value;
            if (name) builderState.languages.push({ name, level: level || 'Intermediate' });
        }
        builderState.hobbies = document.getElementById('hobbies-input')?.value || '';
    }
    
    // Build resume data
    const profile = Storage.getProfiles().find(p => p.id === builderState.profileId);
    const education = (builderState.educationIds || []).map(id => Storage.getEducation().find(e => e.id === id)).filter(Boolean);
    const experience = (builderState.experienceIds || []).map(id => Storage.getExperience().find(e => e.id === id)).filter(Boolean);
    const projects = (builderState.projectIds || []).map(id => Storage.getProjects().find(p => p.id === id)).filter(Boolean);
    const certifications = (builderState.certificationIds || []).map(id => Storage.getCertifications().find(c => c.id === id)).filter(Boolean);
    const achievements = (builderState.achievementIds || []).map(id => Storage.getAchievements().find(a => a.id === id)).filter(Boolean);
    
    const resume = {
        name: (profile?.fullName || 'My Resume') + ' - Resume',
        template: builderState.templateId,
        profile,
        education,
        experience,
        skills: builderState.skills || [],
        projects,
        certifications,
        achievements,
        languages: builderState.languages || [],
        hobbies: builderState.hobbies || '',
        customization: builderState.customization || {},
        createdAt: Date.now()
    };
    
    // Save resume
    const saved = Storage.saveResume(resume);
    Storage.incrementAnalytics('resumesCreated');
    
    // Reset builder state
    builderState = {
        step: 1,
        profileId: null,
        educationIds: [],
        experienceIds: [],
        skills: [],
        projectIds: [],
        certificationIds: [],
        achievementIds: [],
        languages: [],
        hobbies: '',
        templateId: 'modern',
        customization: {}
    };
    Storage.saveCurrentResumeState(builderState);
    
    showToast('Resume generated successfully!', 'success');
    
    // Navigate to preview
    currentResumeData = resume;
    navigateTo('preview');
}
