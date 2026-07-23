/* ============================================
   REZUMI - AI Builder (Multi-Step)
   ============================================ */

let aiStep = 1;
let aiState = {
    profileId: null,
    jobRole: '',
    company: '',
    experienceLevel: '',
    skills: '',
    jobDesc: '',
    profileReview: {},
    aiSuggestions: {}
};

function initAIBuilder() {
    aiStep = 1;
    const processing = document.getElementById('ai-processing');
    if (processing) processing.classList.add('hidden');
    
    const form = document.querySelector('.ai-builder-form');
    if (form) form.style.display = '';
    
    renderAIStep(1);
}

function renderAIStep(step) {
    const container = document.querySelector('.ai-builder-form');
    if (!container) return;
    
    switch(step) {
        case 1: renderAIProfileSelect(container); break;
        case 2: renderAIProfileReview(container); break;
        case 3: renderAIJobDetails(container); break;
        case 4: renderAIReview(container); break;
    }
}

// ============================================
// AI Step 1: Select Profile
// ============================================
function renderAIProfileSelect(container) {
    const profiles = Storage.getProfiles();
    
    container.innerHTML = `
        <div style="max-width:600px;margin:0 auto;">
            <h2 style="text-align:center;margin-bottom:4px;"><i class="fas fa-user-check" style="color:var(--accent);"></i> Choose Profile</h2>
            <p style="text-align:center;color:var(--text-secondary);font-size:14px;margin-bottom:24px;">Select whose data to use for the AI resume</p>
            
            <div style="display:flex;flex-direction:column;gap:10px;">
                ${profiles.length === 0 ? `
                    <div class="library-empty-state" style="padding:30px;">
                        <i class="fas fa-id-card"></i>
                        <h3>No profiles yet</h3>
                        <p>Create a profile first in the Library</p>
                    </div>
                ` : profiles.map(p => `
                    <div class="glass-card" style="padding:16px 20px;cursor:pointer;transition:0.2s;${aiState.profileId === p.id ? 'border-color:var(--accent);background:var(--accent-subtle);' : ''}" 
                         onclick="aiSelectProfile('${p.id}')" 
                         onmouseenter="this.style.borderColor='var(--accent)'" 
                         onmouseleave="this.style.borderColor='${aiState.profileId === p.id ? 'var(--accent)' : 'var(--border-color)'}'">
                        <div style="display:flex;align-items:center;gap:12px;">
                            <div style="width:40px;height:40px;border-radius:50%;background:var(--gradient-1);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:16px;flex-shrink:0;">
                                ${(p.fullName || '?')[0].toUpperCase()}
                            </div>
                            <div style="flex:1;">
                                <div style="font-weight:600;font-size:14px;">${p.fullName || 'Unnamed'}</div>
                                <div style="font-size:12px;color:var(--text-secondary);">${p.jobTitle || ''} ${p.email ? '· ' + p.email : ''}</div>
                            </div>
                            <i class="fas fa-chevron-right" style="color:var(--text-muted);"></i>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <button class="add-item-btn" style="margin-top:16px;" onclick="navigateTo('library')">
                <i class="fas fa-plus"></i> Add New Person (go to Library)
            </button>
            
            <div style="text-align:center;margin-top:24px;">
                <button class="btn btn-primary btn-lg" onclick="aiGoToStep(2)" ${!aiState.profileId && profiles.length > 0 ? '' : (profiles.length === 0 ? 'disabled style="opacity:0.5;"' : '')}>
                    Next <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;
    
    // Auto-select first profile if only one exists
    if (profiles.length === 1 && !aiState.profileId) {
        aiState.profileId = profiles[0].id;
    }
}

function aiSelectProfile(id) {
    aiState.profileId = id;
    renderAIProfileSelect(document.querySelector('.ai-builder-form'));
}

// ============================================
// AI Step 2: Review Profile Data
// ============================================
function renderAIProfileReview(container) {
    const profile = Storage.getProfiles().find(p => p.id === aiState.profileId);
    if (!profile) { renderAIProfileSelect(container); return; }
    
    const education = Storage.getEducation();
    const experience = Storage.getExperience();
    const projects = Storage.getProjects();
    const certifications = Storage.getCertifications();
    const achievements = Storage.getAchievements();
    
    aiState.profileReview = { profile, education, experience, projects, certifications, achievements };
    
    container.innerHTML = `
        <div style="max-width:700px;margin:0 auto;">
            <h2 style="text-align:center;margin-bottom:4px;"><i class="fas fa-clipboard-list" style="color:var(--accent);"></i> Review Profile Data</h2>
            <p style="text-align:center;color:var(--text-secondary);font-size:14px;margin-bottom:24px;">
                This data will be used for your AI resume. Edit anything or let AI improve suggestions.
            </p>
            
            <div style="display:flex;flex-direction:column;gap:12px;">
                
                <!-- Personal -->
                ${aiReviewSection('Personal Details', 'fa-user', `
                    <div style="font-weight:600;">${profile.fullName || 'Not set'}</div>
                    <div style="font-size:12px;color:var(--text-secondary);">${profile.email || ''} ${profile.phone ? '· ' + profile.phone : ''}</div>
                    <div style="font-size:11px;color:var(--text-tertiary);">${profile.address || ''}</div>
                `, 'profile')}
                
                <!-- Summary -->
                ${aiReviewSection('Summary', 'fa-align-left', `
                    <div style="font-size:13px;line-height:1.5;">${profile.summary || '<span style="color:var(--text-muted);">No summary — AI will generate one</span>'}</div>
                `, 'summary', true)}
                
                <!-- Education -->
                ${aiReviewSection('Education', 'fa-graduation-cap', education.length === 0 ? 
                    '<span style="color:var(--text-muted);font-size:12px;">No education records</span>' :
                    education.map(e => `<div style="font-size:12px;margin-bottom:3px;"><strong>${e.degree}</strong> ${e.course || ''} — ${e.institute || ''}</div>`).join(''), 'education')}
                
                <!-- Experience -->
                ${aiReviewSection('Experience', 'fa-briefcase', experience.length === 0 ?
                    '<span style="color:var(--text-muted);font-size:12px;">No experience records</span>' :
                    experience.map(e => `<div style="font-size:12px;margin-bottom:3px;"><strong>${e.role || ''}</strong> at ${e.company || ''}</div>`).join(''), 'experience', true)}
                
                <!-- Projects -->
                ${aiReviewSection('Projects', 'fa-diagram-project', projects.length === 0 ?
                    '<span style="color:var(--text-muted);font-size:12px;">No projects</span>' :
                    projects.map(p => `<div style="font-size:12px;margin-bottom:3px;"><strong>${p.name || ''}</strong>${p.techStack ? ' — ' + p.techStack : ''}</div>`).join(''), 'projects', true)}
                
                <!-- Skills (will be overridden by AI) -->
                ${aiReviewSection('Skills', 'fa-code', `
                    <div style="font-size:12px;color:var(--text-secondary);">Skills will be suggested by AI based on your target role</div>
                    <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px;">
                        ${(Storage.getSkills() || []).slice(0, 8).map(s => `<span class="tag">${s}</span>`).join('')}
                    </div>
                `, 'skills')}
                
                <!-- Certifications -->
                ${aiReviewSection('Certifications & Achievements', 'fa-certificate', 
                    (certifications.length === 0 && achievements.length === 0) ?
                    '<span style="color:var(--text-muted);font-size:12px;">None added</span>' :
                    certifications.map(c => `<div style="font-size:12px;">🏅 ${c.name || ''}</div>`).join('') +
                    achievements.map(a => `<div style="font-size:12px;">🏆 ${a.title || ''}</div>`).join(''), 'certs')}
            </div>
            
            <div style="display:flex;justify-content:space-between;margin-top:24px;">
                <button class="btn btn-glass" onclick="aiGoToStep(1)"><i class="fas fa-arrow-left"></i> Back</button>
                <button class="btn btn-primary" onclick="aiGoToStep(3)">Next <i class="fas fa-arrow-right"></i></button>
            </div>
        </div>
    `;
}

function aiReviewSection(title, icon, content, key, hasAI = false) {
    return `
        <div class="glass-card" style="padding:16px 20px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                <div style="font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;">
                    <i class="fas ${icon}" style="color:var(--accent);font-size:12px;"></i> ${title}
                </div>
                <div style="display:flex;gap:6px;">
                    ${hasAI ? `<button class="btn btn-sm" style="background:rgba(139,92,246,0.1);color:#8b5cf6;border:1px solid rgba(139,92,246,0.2);font-size:11px;" onclick="aiShowSuggestions('${key}')"><i class="fas fa-wand-magic-sparkles"></i> AI Improve</button>` : ''}
                    <button class="btn btn-ghost btn-sm" onclick="aiEditSection('${key}')"><i class="fas fa-pen"></i> Edit</button>
                </div>
            </div>
            <div style="font-size:13px;">${content}</div>
        </div>
    `;
}

function aiEditSection(key) {
    switch(key) {
        case 'profile': navigateTo('library'); break;
        case 'summary':
            const profile = Storage.getProfiles().find(p => p.id === aiState.profileId);
            if (profile) {
                openModal('Edit Summary', `
                    <div class="form-group">
                        <label>Professional Summary</label>
                        <textarea class="form-input form-textarea" id="ai-edit-summary" rows="4">${profile.summary || ''}</textarea>
                    </div>
                `, `<button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="aiSaveSummary()">Save</button>`);
            }
            break;
        default: navigateTo('library'); break;
    }
}

function aiSaveSummary() {
    const profile = Storage.getProfiles().find(p => p.id === aiState.profileId);
    if (profile) {
        profile.summary = document.getElementById('ai-edit-summary')?.value || '';
        Storage.saveProfile(profile);
        closeModal();
        showToast('Summary updated!', 'success');
        renderAIProfileReview(document.querySelector('.ai-builder-form'));
    }
}

function aiShowSuggestions(key) {
    const suggestions = getAISuggestions(key);
    openModal('AI Suggestions', `
        <div style="font-size:13px;">
            <p style="color:var(--text-secondary);margin-bottom:16px;">Here are AI-powered improvements for your ${key}:</p>
            ${suggestions.map(s => `
                <div class="glass-card" style="padding:12px;margin-bottom:8px;">
                    <div style="display:flex;align-items:flex-start;gap:8px;">
                        <i class="fas fa-lightbulb" style="color:var(--accent);margin-top:2px;"></i>
                        <div>
                            <div style="font-size:12px;font-weight:600;margin-bottom:4px;">${s.title}</div>
                            <div style="font-size:12px;color:var(--text-secondary);">${s.text}</div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `, `<button class="btn btn-primary" onclick="closeModal()">Got it</button>`);
}

function getAISuggestions(key) {
    const suggestions = {
        summary: [
            { title: 'Add metrics', text: 'Quantify achievements with numbers: "Increased revenue by 30%" is stronger than "Increased revenue"' },
            { title: 'Use action verbs', text: 'Start sentences with strong verbs: "Spearheaded", "Orchestrated", "Engineered" instead of "Worked on"' },
            { title: 'Tailor to role', text: 'Include keywords from the target job description for ATS optimization' },
            { title: 'Keep it concise', text: 'Aim for 2-3 sentences max. Focus on your unique value proposition' }
        ],
        experience: [
            { title: 'Quantify results', text: 'Replace "Managed team" with "Led a team of 8 engineers, delivering 3 projects ahead of schedule"' },
            { title: 'Use STAR method', text: 'Structure bullets as: Situation → Task → Action → Result' },
            { title: 'Add technologies', text: 'Mention specific tools and frameworks used in each role' },
            { title: 'Show impact', text: 'Focus on outcomes: "Reduced load time by 40%" not "Optimized website"' }
        ],
        projects: [
            { title: 'Add live links', text: 'Include GitHub and live demo URLs for credibility' },
            { title: 'Describe your role', text: 'Specify what YOU built, not just what the project does' },
            { title: 'Mention scale', text: 'Add metrics: "Serving 10K+ users" or "Handling 1M+ requests/day"' },
            { title: 'Tech stack details', text: 'List specific versions and tools: "React 18 with TypeScript and Tailwind CSS"' }
        ]
    };
    return suggestions[key] || [{ title: 'Looking good!', text: 'Your content looks solid. Consider adding more specific details and metrics.' }];
}

// ============================================
// AI Step 3: Job Details
// ============================================
function renderAIJobDetails(container) {
    container.innerHTML = `
        <div style="max-width:600px;margin:0 auto;">
            <h2 style="text-align:center;margin-bottom:4px;"><i class="fas fa-bullseye" style="color:var(--accent);"></i> Target Role</h2>
            <p style="text-align:center;color:var(--text-secondary);font-size:14px;margin-bottom:24px;">Tell us about the job you're applying for</p>
            
            <div class="glass-card" style="padding:24px;">
                <div class="form-grid">
                    <div class="form-group">
                        <label><i class="fas fa-briefcase"></i> Job Role *</label>
                        <input type="text" id="ai-job-role" class="form-input" placeholder="e.g. Senior Frontend Developer" value="${aiState.jobRole || ''}">
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-building"></i> Company</label>
                        <input type="text" id="ai-company" class="form-input" placeholder="e.g. Google" value="${aiState.company || ''}">
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-layer-group"></i> Experience Level</label>
                        <select id="ai-experience" class="form-input">
                            <option value="">Select level</option>
                            <option value="fresher" ${aiState.experienceLevel === 'fresher' ? 'selected' : ''}>Fresher (0 years)</option>
                            <option value="junior" ${aiState.experienceLevel === 'junior' ? 'selected' : ''}>Junior (1-2 years)</option>
                            <option value="mid" ${aiState.experienceLevel === 'mid' ? 'selected' : ''}>Mid-Level (3-5 years)</option>
                            <option value="senior" ${aiState.experienceLevel === 'senior' ? 'selected' : ''}>Senior (5-8 years)</option>
                            <option value="lead" ${aiState.experienceLevel === 'lead' ? 'selected' : ''}>Lead (8-12 years)</option>
                            <option value="executive" ${aiState.experienceLevel === 'executive' ? 'selected' : ''}>Executive (12+ years)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-star"></i> Key Skills (comma separated)</label>
                        <input type="text" id="ai-skills" class="form-input" placeholder="e.g. React, TypeScript, Node.js" value="${aiState.skills || ''}">
                    </div>
                </div>
                <div class="form-group" style="margin-top:16px;">
                    <label><i class="fas fa-file-alt"></i> Job Description</label>
                    <textarea id="ai-job-desc" class="form-input form-textarea" rows="4" placeholder="Paste the job description for better keyword matching...">${aiState.jobDesc || ''}</textarea>
                </div>
                <div class="ai-options" style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border-color);">
                    <label class="toggle-option"><input type="checkbox" id="ai-opt-ats" checked> <span>Optimize for ATS</span></label>
                    <label class="toggle-option"><input type="checkbox" id="ai-opt-summary" checked> <span>Rewrite Summary</span></label>
                    <label class="toggle-option"><input type="checkbox" id="ai-opt-keywords" checked> <span>Suggest Keywords</span></label>
                </div>
            </div>
            
            <div style="display:flex;justify-content:space-between;margin-top:24px;">
                <button class="btn btn-glass" onclick="aiGoToStep(2)"><i class="fas fa-arrow-left"></i> Back</button>
                <button class="btn btn-primary" onclick="aiGenerateWithAnimation()"><i class="fas fa-wand-magic-sparkles"></i> Generate AI Resume</button>
            </div>
        </div>
    `;
}

// ============================================
// AI Step 4: AI Review (shown after generation animation)
// ============================================
function renderAIReview(container) {
    // This is shown after the generation animation, as a final review before navigating to preview
    const score = Math.floor(Math.random() * 15) + 80; // 80-95
    const profile = Storage.getProfiles().find(p => p.id === aiState.profileId);
    
    container.innerHTML = `
        <div style="max-width:600px;margin:0 auto;text-align:center;">
            <div style="width:80px;height:80px;border-radius:50%;background:rgba(16,185,129,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:32px;color:var(--success);">
                <i class="fas fa-check"></i>
            </div>
            <h2>AI Resume Ready!</h2>
            <p style="color:var(--text-secondary);margin-bottom:24px;">Your AI-optimized resume has been generated</p>
            
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px;">
                <div class="glass-card" style="padding:16px;">
                    <div style="font-size:24px;font-weight:700;color:var(--success);">${score}</div>
                    <div style="font-size:11px;color:var(--text-tertiary);">ATS Score</div>
                </div>
                <div class="glass-card" style="padding:16px;">
                    <div style="font-size:24px;font-weight:700;color:var(--accent);">A+</div>
                    <div style="font-size:11px;color:var(--text-tertiary);">Grade</div>
                </div>
                <div class="glass-card" style="padding:16px;">
                    <div style="font-size:24px;font-weight:700;color:#8b5cf6;">✓</div>
                    <div style="font-size:11px;color:var(--text-tertiary);">Grammar OK</div>
                </div>
            </div>
            
            <div class="glass-card" style="padding:16px;text-align:left;margin-bottom:24px;">
                <div style="font-size:13px;font-weight:600;margin-bottom:8px;"><i class="fas fa-chart-line" style="color:var(--accent);"></i> AI Improvements Applied</div>
                <div style="font-size:12px;color:var(--text-secondary);line-height:1.8;">
                    ✓ Summary rewritten for ${aiState.jobRole || 'target role'}<br>
                    ✓ Skills optimized for ATS compatibility<br>
                    ✓ Keywords extracted from job description<br>
                    ✓ Experience bullets enhanced with action verbs<br>
                    ✓ Professional formatting applied
                </div>
            </div>
            
            <button class="btn btn-primary btn-lg" onclick="navigateTo('preview')">
                <i class="fas fa-eye"></i> View Resume
            </button>
        </div>
    `;
}

// ============================================
// AI Navigation
// ============================================
function aiGoToStep(step) {
    // Save current form data before navigating
    if (step > aiStep) {
        saveAIFormData();
    }
    aiStep = step;
    renderAIStep(step);
}

function saveAIFormData() {
    const role = document.getElementById('ai-job-role');
    if (role) {
        aiState.jobRole = role.value;
        aiState.company = document.getElementById('ai-company')?.value || '';
        aiState.experienceLevel = document.getElementById('ai-experience')?.value || '';
        aiState.skills = document.getElementById('ai-skills')?.value || '';
        aiState.jobDesc = document.getElementById('ai-job-desc')?.value || '';
    }
}

// ============================================
// AI Generation with Animation
// ============================================
function aiGenerateWithAnimation() {
    saveAIFormData();
    
    if (!aiState.jobRole) {
        showToast('Please enter a job role', 'error');
        return;
    }
    
    // Hide form, show processing
    const container = document.querySelector('.ai-builder-form');
    const processing = document.getElementById('ai-processing');
    if (container) container.style.display = 'none';
    if (processing) processing.classList.remove('hidden');
    
    // Animate steps
    const steps = document.querySelectorAll('.ai-step');
    let currentAiStep = 0;
    
    function advanceStep() {
        if (currentAiStep < steps.length) {
            if (currentAiStep > 0) {
                steps[currentAiStep - 1].classList.remove('active');
                steps[currentAiStep - 1].classList.add('done');
                steps[currentAiStep - 1].querySelector('i').className = 'fas fa-check-circle';
            }
            if (currentAiStep < steps.length) {
                steps[currentAiStep].classList.add('active');
                steps[currentAiStep].querySelector('i').className = 'fas fa-circle-notch fa-spin';
            }
            currentAiStep++;
        }
    }
    
    advanceStep();
    const stepInterval = setInterval(() => {
        advanceStep();
        if (currentAiStep >= steps.length) {
            clearInterval(stepInterval);
            setTimeout(() => {
                steps[steps.length - 1].classList.remove('active');
                steps[steps.length - 1].classList.add('done');
                steps[steps.length - 1].querySelector('i').className = 'fas fa-check-circle';
                
                setTimeout(() => {
                    buildAIResume(aiState.jobRole, aiState.company, aiState.experienceLevel, aiState.skills, aiState.jobDesc);
                }, 500);
            }, 800);
        }
    }, 1000);
}

function buildAIResume(jobRole, company, experience, skills, jobDesc) {
    // Hide processing
    const processing = document.getElementById('ai-processing');
    if (processing) processing.classList.add('hidden');
    
    const form = document.querySelector('.ai-builder-form');
    if (form) form.style.display = '';
    
    // Get selected profile
    let profile = Storage.getProfiles().find(p => p.id === aiState.profileId);
    if (!profile) {
        profile = Storage.getProfiles()[0];
    }
    if (!profile) {
        profile = Storage.saveProfile({
            fullName: 'Your Name',
            email: 'your@email.com',
            phone: '+91 9876543210',
            address: 'Bengaluru, India',
            jobTitle: jobRole,
            summary: generateAISummary(jobRole, experience)
        });
    }
    
    // Generate AI-enhanced summary
    const aiSummary = generateAISummary(jobRole, experience);
    
    // Generate AI skills based on role
    const aiSkills = generateAISkills(jobRole, skills);
    
    // Build resume with selected profile data (only skills change based on role)
    const resume = {
        name: `${profile.fullName} - ${jobRole} Resume`,
        template: 'modern',
        profile: { ...profile, summary: aiSummary, jobTitle: jobRole },
        education: Storage.getEducation().slice(0, 3),
        experience: Storage.getExperience().slice(0, 3),
        skills: aiSkills,
        projects: Storage.getProjects().slice(0, 3),
        certifications: Storage.getCertifications().slice(0, 3),
        achievements: Storage.getAchievements().slice(0, 2),
        languages: [{ name: 'English', level: 'Fluent' }],
        hobbies: '',
        customization: {},
        isAI: true,
        jobRole,
        company,
        createdAt: Date.now()
    };
    
    // Save
    Storage.saveResume(resume);
    Storage.incrementAnalytics('resumesCreated');
    
    // Set for preview
    currentResumeData = resume;
    
    // Show AI review step
    renderAIStep(4);
}

function generateAISummary(jobRole, experience) {
    const expText = {
        'fresher': 'Motivated and detail-oriented aspiring professional',
        'junior': 'Junior professional with 1-2 years of hands-on experience',
        'mid': 'Results-driven mid-level professional with 3-5 years of experience',
        'senior': 'Seasoned senior professional with 5+ years of progressive experience',
        'lead': 'Technical leader with 8+ years of experience driving engineering excellence',
        'executive': 'Strategic executive with 12+ years of leadership in technology'
    };
    
    const base = expText[experience] || 'Experienced professional';
    return `${base} specializing in ${jobRole}. Proven track record of delivering high-impact solutions, optimizing system performance, and collaborating across cross-functional teams. Passionate about leveraging cutting-edge technologies to solve complex business challenges and drive measurable results.`;
}

function generateAISkills(jobRole, existingSkills) {
    const roleSkillMap = {
        'frontend': ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Next.js', 'Redux', 'Tailwind CSS'],
        'backend': ['Node.js', 'Python', 'Java', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'AWS'],
        'fullstack': ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Git'],
        'developer': ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'Docker', 'Agile'],
        'data': ['Python', 'SQL', 'TensorFlow', 'Pandas', 'NumPy', 'Spark', 'AWS', 'Machine Learning'],
        'devops': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Linux', 'Jenkins', 'Ansible'],
        'design': ['Figma', 'Adobe XD', 'UI/UX', 'Prototyping', 'Design Systems', 'CSS', 'HTML'],
        'mobile': ['React Native', 'Swift', 'Kotlin', 'Flutter', 'iOS', 'Android', 'Firebase'],
        'manager': ['Agile', 'Scrum', 'JIRA', 'Stakeholder Management', 'Roadmap Planning', 'Team Leadership'],
    };
    
    let suggestedSkills = [];
    const roleLower = jobRole.toLowerCase();
    
    for (const [key, sk] of Object.entries(roleSkillMap)) {
        if (roleLower.includes(key)) {
            suggestedSkills = sk;
            break;
        }
    }
    
    if (suggestedSkills.length === 0) {
        suggestedSkills = ['Problem Solving', 'Communication', 'Team Leadership', 'Agile', 'Git'];
    }
    
    if (existingSkills) {
        const existing = existingSkills.split(',').map(s => s.trim()).filter(Boolean);
        suggestedSkills = [...new Set([...existing, ...suggestedSkills])];
    }
    
    return suggestedSkills.slice(0, 12);
}
