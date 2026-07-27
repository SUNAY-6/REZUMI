/* ============================================
   REZUMI - Learning Recommendations
   AI-powered learning paths by career role
   ============================================ */

const LearningRecommendations = {
    careerPaths: {
        'frontend': {
            title: 'Frontend Developer',
            skills: ['React', 'TypeScript', 'Next.js', 'CSS', 'Testing'],
            courses: ['React Advanced Patterns', 'TypeScript Masterclass', 'Web Performance'],
            platforms: ['Frontend Masters', 'freeCodeCamp', 'Codecademy'],
            books: ['Eloquent JavaScript', 'You Don\'t Know JS', 'CSS Secrets'],
            roadmap: 'HTML/CSS → JavaScript → React → TypeScript → Testing → Performance'
        },
        'backend': {
            title: 'Backend Developer',
            skills: ['Node.js', 'Python', 'SQL', 'Docker', 'API Design'],
            courses: ['Node.js Design Patterns', 'Python for Backend', 'Database Design'],
            platforms: ['Udemy', 'Pluralsight', 'Coursera'],
            books: ['Designing Data-Intensive Applications', 'Clean Code', 'System Design Interview'],
            roadmap: 'Programming → Databases → APIs → Docker → System Design → Architecture'
        },
        'fullstack': {
            title: 'Full Stack Developer',
            skills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
            courses: ['Full Stack Open', 'The Complete Web Developer', 'AWS Cloud Practitioner'],
            platforms: ['Udemy', 'freeCodeCamp', 'The Odin Project'],
            books: ['Fullstack React', 'Node.js Design Patterns', 'The Pragmatic Programmer'],
            roadmap: 'Frontend → Backend → Database → DevOps → Cloud → System Design'
        },
        'data': {
            title: 'Data Scientist',
            skills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'TensorFlow'],
            courses: ['Machine Learning by Andrew Ng', 'Data Science Specialization', 'Deep Learning'],
            platforms: ['Coursera', 'Kaggle', 'DataCamp'],
            books: ['Hands-On ML with Scikit-Learn', 'Python Data Science Handbook', 'ISLR'],
            roadmap: 'Python → Statistics → ML → Deep Learning → NLP → MLOps'
        },
        'devops': {
            title: 'DevOps Engineer',
            skills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'AWS'],
            courses: ['Docker & Kubernetes', 'AWS Solutions Architect', 'Terraform Associate'],
            platforms: ['A Cloud Guru', 'Linux Academy', 'Udemy'],
            books: ['The Phoenix Project', 'The DevOps Handbook', 'Site Reliability Engineering'],
            roadmap: 'Linux → Networking → Docker → Kubernetes → CI/CD → IaC → Monitoring'
        },
        'mobile': {
            title: 'Mobile Developer',
            skills: ['React Native', 'Swift', 'Kotlin', 'Flutter', 'Firebase'],
            courses: ['React Native Guide', 'SwiftUI Essentials', 'Flutter Bootcamp'],
            platforms: ['Udemy', 'Ray Wenderlich', 'CodePath'],
            books: ['Flutter in Action', 'iOS Programming Big Nerd Ranch', 'Android Programming'],
            roadmap: 'One Platform → Cross-Platform → State Management → Testing → Publishing'
        },
        'ai': {
            title: 'AI/ML Engineer',
            skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision'],
            courses: ['Deep Learning Specialization', 'NLP with Transformers', 'MLOps'],
            platforms: ['Coursera', 'Fast.ai', 'Papers With Code'],
            books: ['Deep Learning by Goodfellow', 'Pattern Recognition and ML', 'Hands-On ML'],
            roadmap: 'Math → Python → ML → Deep Learning → NLP/CV → MLOps → Research'
        },
        'design': {
            title: 'UI/UX Designer',
            skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility'],
            courses: ['Google UX Design Certificate', 'Interaction Design Foundation', 'Figma Mastery'],
            platforms: ['Coursera', 'Interaction Design Foundation', 'Skillshare'],
            books: ['Don\'t Make Me Think', 'Designing Interfaces', 'The Design of Everyday Things'],
            roadmap: 'Design Principles → Figma → User Research → Prototyping → Design Systems'
        },
        'security': {
            title: 'Cybersecurity',
            skills: ['Network Security', 'Penetration Testing', 'SIEM', 'Compliance', 'Cloud Security'],
            courses: ['CompTIA Security+', 'CEH', 'OSCP Preparation'],
            platforms: ['TryHackMe', 'Hack The Box', 'Cybrary'],
            books: ['The Art of Exploitation', 'Penetration Testing', 'Security Engineering'],
            roadmap: 'Networking → Linux → Security+ → Pentesting → Cloud Security → Management'
        },
        'product': {
            title: 'Product Management',
            skills: ['Roadmapping', 'User Stories', 'Analytics', 'A/B Testing', 'Agile'],
            courses: ['Product School', 'Reforge', 'Pragmatic Marketing'],
            platforms: ['Coursera', 'Udemy', 'Mind the Product'],
            books: ['Inspired', 'The Lean Startup', 'Cracking the PM Interview'],
            roadmap: 'Business Fundamentals → Agile → Analytics → Strategy → Leadership'
        },
        'testing': {
            title: 'QA/Testing Engineer',
            skills: ['Selenium', 'Cypress', 'Jest', 'API Testing', 'Performance Testing'],
            courses: ['Test Automation University', 'ISTQB Foundation', 'Cypress.io Course'],
            platforms: ['Test Automation University', 'Udemy', 'LambdaTest'],
            books: ['Agile Testing', 'The Art of Software Testing', 'Continuous Delivery'],
            roadmap: 'Manual Testing → Automation → API Testing → Performance → CI/CD → Strategy'
        },
        'cloud': {
            title: 'Cloud Engineer',
            skills: ['AWS', 'GCP', 'Azure', 'Terraform', 'Serverless'],
            courses: ['AWS Solutions Architect', 'GCP Associate', 'Azure Fundamentals'],
            platforms: ['A Cloud Guru', 'Cloud Academy', 'AWS Training'],
            books: ['AWS Certified Solutions Architect', 'Cloud Native patterns', 'Terraform Up & Running'],
            roadmap: 'One Cloud → Certifications → IaC → Containers → Serverless → Multi-Cloud'
        },
        'general': {
            title: 'Software Engineer',
            skills: ['Data Structures', 'Algorithms', 'System Design', 'Git', 'Communication'],
            courses: ['CS50', 'Grokking Algorithms', 'System Design Primer'],
            platforms: ['LeetCode', 'HackerRank', 'freeCodeCamp'],
            books: ['CTCI', 'Clean Code', 'Designing Data-Intensive Applications'],
            roadmap: 'Programming Fundamentals → DSA → System Design → Projects → Specialization'
        }
    },

    open() {
        const resume = currentResumeData || Storage.getResumes().slice(-1)[0];
        const role = (resume?.profile?.jobTitle || '').toLowerCase();
        
        // Auto-detect career path
        let pathKey = 'general';
        for (const [key, path] of Object.entries(this.careerPaths)) {
            if (role.includes(key)) {
                pathKey = key;
                break;
            }
        }
        // Additional keyword matching
        if (role.includes('front')) pathKey = 'frontend';
        if (role.includes('back')) pathKey = 'backend';
        if (role.includes('full')) pathKey = 'fullstack';
        if (role.includes('data') || role.includes('ml') || role.includes('ai')) pathKey = 'ai';
        if (role.includes('devops') || role.includes('sre')) pathKey = 'devops';
        if (role.includes('design') || role.includes('ux') || role.includes('ui')) pathKey = 'design';
        if (role.includes('security') || role.includes('pentest')) pathKey = 'security';
        if (role.includes('product')) pathKey = 'product';
        if (role.includes('test') || role.includes('qa')) pathKey = 'testing';
        if (role.includes('cloud')) pathKey = 'cloud';
        if (role.includes('mobile') || role.includes('android') || role.includes('ios')) pathKey = 'mobile';

        const path = this.careerPaths[pathKey];
        const saved = this.getSavedRecommendations();

        openModal('Learning Recommendations', `
            <div>
                <div style="text-align:center;margin-bottom:16px;">
                    <div style="font-size:13px;color:var(--text-secondary);">Recommended for</div>
                    <div style="font-size:20px;font-weight:800;color:var(--accent);margin-top:2px;">${path.title}</div>
                </div>

                <!-- Path Selector -->
                <div style="margin-bottom:16px;">
                    <label style="font-size:12px;font-weight:600;">Choose Career Path:</label>
                    <select class="form-input" style="margin-top:4px;" onchange="LearningRecommendations.switchPath(this.value)">
                        ${Object.entries(this.careerPaths).map(([k, v]) => 
                            `<option value="${k}" ${k === pathKey ? 'selected' : ''}>${v.title}</option>`
                        ).join('')}
                    </select>
                </div>

                <!-- Skills to Learn -->
                <div style="margin-bottom:14px;">
                    <div style="font-size:13px;font-weight:600;margin-bottom:8px;"><i class="fas fa-code" style="color:var(--accent);margin-right:6px;"></i>Skills to Master</div>
                    <div style="display:flex;flex-wrap:wrap;gap:6px;">
                        ${path.skills.map(s => {
                            const isDone = saved.completed?.includes(s);
                            const isBookmarked = saved.bookmarked?.includes(s);
                            return `<span class="tag" style="cursor:pointer;${isDone ? 'background:rgba(16,185,129,0.15);color:var(--success);border-color:var(--success);' : ''}" 
                                onclick="LearningRecommendations.toggleComplete('${s}', '${pathKey}')">
                                <i class="fas ${isDone ? 'fa-check' : 'fa-circle'}" style="font-size:8px;margin-right:3px;"></i>${s}
                                ${isBookmarked ? '<i class="fas fa-bookmark" style="margin-left:4px;font-size:8px;color:var(--warning);"></i>' : ''}
                            </span>`;
                        }).join('')}
                    </div>
                </div>

                <!-- Courses -->
                <div style="margin-bottom:14px;">
                    <div style="font-size:13px;font-weight:600;margin-bottom:8px;"><i class="fas fa-graduation-cap" style="color:#8b5cf6;margin-right:6px;"></i>Recommended Courses</div>
                    ${path.courses.map(c => `
                        <div style="padding:8px 12px;background:var(--bg-card);border-radius:var(--radius-sm);margin-bottom:4px;font-size:12px;display:flex;align-items:center;gap:8px;">
                            <i class="fas fa-play-circle" style="color:#8b5cf6;"></i> ${c}
                        </div>
                    `).join('')}
                </div>

                <!-- Platforms -->
                <div style="margin-bottom:14px;">
                    <div style="font-size:13px;font-weight:600;margin-bottom:8px;"><i class="fas fa-laptop-code" style="color:var(--success);margin-right:6px;"></i>Practice Platforms</div>
                    <div style="display:flex;flex-wrap:wrap;gap:6px;">
                        ${path.platforms.map(p => `<span class="tag">${p}</span>`).join('')}
                    </div>
                </div>

                <!-- Books -->
                <div style="margin-bottom:14px;">
                    <div style="font-size:13px;font-weight:600;margin-bottom:8px;"><i class="fas fa-book" style="color:var(--warning);margin-right:6px;"></i>Must-Read Books</div>
                    ${path.books.map(b => `
                        <div style="padding:8px 12px;background:var(--bg-card);border-radius:var(--radius-sm);margin-bottom:4px;font-size:12px;display:flex;align-items:center;gap:8px;">
                            <i class="fas fa-book-open" style="color:var(--warning);"></i> ${b}
                        </div>
                    `).join('')}
                </div>

                <!-- Roadmap -->
                <div style="margin-bottom:14px;">
                    <div style="font-size:13px;font-weight:600;margin-bottom:8px;"><i class="fas fa-route" style="color:var(--accent);margin-right:6px;"></i>Learning Roadmap</div>
                    <div style="padding:12px;background:var(--bg-card);border-radius:var(--radius-md);font-size:12px;line-height:1.8;">
                        ${path.roadmap.split(' → ').map((step, i, arr) => 
                            `<span style="padding:3px 8px;border-radius:var(--radius-full);background:${i < arr.length ? 'var(--accent-subtle)' : 'transparent'};color:var(--accent);font-weight:500;">${step}</span>${i < arr.length - 1 ? ' → ' : ''}`
                        ).join('')}
                    </div>
                </div>

                <!-- Progress -->
                <div style="margin-bottom:8px;">
                    <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
                        <span style="font-weight:600;">Your Progress</span>
                        <span style="color:var(--accent);">${saved.completed?.filter(c => path.skills.includes(c)).length || 0} / ${path.skills.length} skills</span>
                    </div>
                    <div style="height:6px;background:var(--bg-card);border-radius:3px;overflow:hidden;">
                        <div style="height:100%;background:var(--gradient-1);border-radius:3px;width:${((saved.completed?.filter(c => path.skills.includes(c)).length || 0) / path.skills.length) * 100}%;transition:0.3s;"></div>
                    </div>
                </div>
            </div>
        `, `<button class="btn btn-primary" onclick="closeModal()">Close</button>`);
    },

    switchPath(key) {
        // Re-render with new path
        const path = this.careerPaths[key];
        if (path && currentResumeData?.profile) {
            currentResumeData.profile.jobTitle = path.title;
        }
        this.open();
    },

    getSavedRecommendations() {
        return Storage.get('rezumi_learning') || { completed: [], bookmarked: [] };
    },

    toggleComplete(skill, pathKey) {
        const saved = this.getSavedRecommendations();
        if (!saved.completed) saved.completed = [];
        
        const idx = saved.completed.indexOf(skill);
        if (idx >= 0) {
            saved.completed.splice(idx, 1);
            showToast(skill + ' unmarked', 'info');
        } else {
            saved.completed.push(skill);
            showToast(skill + ' completed! 🎉', 'success');
        }
        
        Storage.set('rezumi_learning', saved);
        this.open(); // Re-render
    }
};

window.LearningRecommendations = LearningRecommendations;
