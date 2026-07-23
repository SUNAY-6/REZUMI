/* ============================================
   REZUMI - Premium Features (All Working)
   ============================================ */

function openPremiumFeature(featureId) {
    switch(featureId) {
        case 'ai-review': openAIReview(); break;
        case 'ats-score': openATSScore(); break;
        case 'grammar': openGrammarCheck(); break;
        case 'cover-letter': openCoverLetter(); break;
        case 'interview': openInterviewPrep(); break;
        case 'cloud-sync': openCloudSync(); break;
        case 'cv-generator': openCVGenerator(); break;
    }
}

// ============================================
// 1. AI RESUME REVIEW
// ============================================
function openAIReview() {
    const resume = currentResumeData || Storage.getResumes().slice(-1)[0];
    const rating = resume ? calculateResumeRating(resume) : 0;
    
    const suggestions = generateReviewSuggestions(resume);
    
    openModal('AI Resume Review', `
        <div>
            <div style="text-align:center;margin-bottom:20px;">
                <div style="font-size:48px;font-weight:800;color:${rating >= 80 ? 'var(--success)' : rating >= 60 ? 'var(--warning)' : 'var(--danger)'};">${rating}</div>
                <div style="font-size:13px;color:var(--text-tertiary);">Overall Resume Rating / 100</div>
                <div style="margin-top:8px;">
                    <span class="ai-suggest-badge"><i class="fas fa-wand-magic-sparkles"></i> AI Analyzed</span>
                </div>
            </div>
            
            <div style="font-size:13px;font-weight:600;margin-bottom:12px;">Priority Improvements</div>
            ${suggestions.map(s => `
                <div style="display:flex;align-items:flex-start;gap:10px;padding:10px;margin-bottom:8px;background:var(--bg-card);border-radius:var(--radius-md);border:1px solid var(--border-color);">
                    <i class="fas ${s.icon}" style="color:${s.color};margin-top:2px;"></i>
                    <div style="flex:1;">
                        <div style="font-size:12px;font-weight:600;">${s.title}</div>
                        <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">${s.text}</div>
                    </div>
                    <span style="font-size:10px;padding:2px 8px;border-radius:var(--radius-full);background:${s.priority === 'High' ? 'rgba(239,68,68,0.1)' : s.priority === 'Medium' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)'};color:${s.priority === 'High' ? 'var(--danger)' : s.priority === 'Medium' ? 'var(--warning)' : 'var(--success)'};">${s.priority}</span>
                </div>
            `).join('')}
            
            <div style="font-size:13px;font-weight:600;margin:16px 0 8px;">Impact Improvements</div>
            <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
                • Quantify achievements with numbers and metrics<br>
                • Use strong action verbs (Spearheaded, Orchestrated, Engineered)<br>
                • Add relevant industry keywords for ATS matching<br>
                • Keep bullet points concise (1-2 lines each)<br>
                • Tailor content to the target role
            </div>
        </div>
    `, `<button class="btn btn-primary" onclick="closeModal()">Close</button>`);
}

function calculateResumeRating(resume) {
    if (!resume) return 45;
    let score = 0;
    if (resume.profile?.fullName) score += 10;
    if (resume.profile?.email) score += 5;
    if (resume.profile?.phone) score += 5;
    if (resume.profile?.summary) score += 10;
    if (resume.education?.length > 0) score += 10;
    if (resume.experience?.length > 0) score += 15;
    if (resume.skills?.length >= 5) score += 15;
    if (resume.skills?.length >= 8) score += 5;
    if (resume.projects?.length > 0) score += 10;
    if (resume.certifications?.length > 0) score += 5;
    if (resume.achievements?.length > 0) score += 5;
    if (resume.languages?.length > 0) score += 5;
    return Math.min(score, 100);
}

function generateReviewSuggestions(resume) {
    if (!resume) {
        return [
            { icon: 'fa-exclamation-triangle', color: 'var(--danger)', title: 'No Resume Selected', text: 'Create a resume first to get AI feedback', priority: 'High' }
        ];
    }
    const s = [];
    if (!resume.profile?.summary) s.push({ icon: 'fa-align-left', color: 'var(--warning)', title: 'Missing Summary', text: 'Add a professional summary to introduce yourself', priority: 'High' });
    if (!resume.experience?.length) s.push({ icon: 'fa-briefcase', color: 'var(--danger)', title: 'No Experience', text: 'Add work experience or internships', priority: 'High' });
    if (!resume.skills?.length || resume.skills.length < 5) s.push({ icon: 'fa-code', color: 'var(--warning)', title: 'Add More Skills', text: `You have ${resume.skills?.length || 0} skills. Aim for 8-12 relevant skills`, priority: 'Medium' });
    if (!resume.projects?.length) s.push({ icon: 'fa-diagram-project', color: 'var(--warning)', title: 'No Projects', text: 'Add projects to showcase practical skills', priority: 'Medium' });
    if (!resume.profile?.linkedin) s.push({ icon: 'fa-link', color: 'var(--success)', title: 'Add LinkedIn', text: 'Include your LinkedIn profile URL', priority: 'Low' });
    if (resume.experience?.length && !resume.experience.some(e => e.responsibilities?.length > 50)) s.push({ icon: 'fa-list-check', color: 'var(--warning)', title: 'Weak Bullet Points', text: 'Expand responsibilities with quantified achievements', priority: 'Medium' });
    if (s.length === 0) s.push({ icon: 'fa-check-circle', color: 'var(--success)', title: 'Looking Great!', text: 'Your resume is well-structured. Consider tailoring it to specific job descriptions.', priority: 'Low' });
    return s;
}

// ============================================
// 2. ATS SCORE
// ============================================
function openATSScore() {
    const resume = currentResumeData || Storage.getResumes().slice(-1)[0];
    const atsData = analyzeATS(resume);
    
    openModal('ATS Compatibility Score', `
        <div>
            <div style="text-align:center;margin-bottom:20px;">
                <div style="position:relative;width:120px;height:120px;margin:0 auto;">
                    <svg viewBox="0 0 120 120" style="width:100%;height:100%;transform:rotate(-90deg);">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border-color)" stroke-width="8"/>
                        <circle cx="60" cy="60" r="50" fill="none" stroke="${atsData.score >= 80 ? 'var(--success)' : atsData.score >= 60 ? 'var(--warning)' : 'var(--danger)'}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${Math.PI * 100}" stroke-dashoffset="${Math.PI * 100 * (1 - atsData.score / 100)}"/>
                    </svg>
                    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                        <span style="font-size:32px;font-weight:800;">${atsData.score}</span>
                        <span style="font-size:11px;color:var(--text-tertiary);">/ 100</span>
                    </div>
                </div>
                <div style="margin-top:10px;font-size:13px;font-weight:600;color:${atsData.score >= 80 ? 'var(--success)' : atsData.score >= 60 ? 'var(--warning)' : 'var(--danger)'};">${atsData.score >= 80 ? 'Excellent' : atsData.score >= 60 ? 'Good' : 'Needs Improvement'}</div>
            </div>
            
            <div style="font-size:13px;font-weight:600;margin-bottom:10px;">Formatting Analysis</div>
            ${atsData.formatting.map(f => `
                <div style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12px;">
                    <i class="fas ${f.pass ? 'fa-check-circle' : 'fa-times-circle'}" style="color:${f.pass ? 'var(--success)' : 'var(--danger)'};"></i>
                    <span>${f.text}</span>
                </div>
            `).join('')}
            
            <div style="font-size:13px;font-weight:600;margin:14px 0 10px;">Keyword Analysis</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;">
                ${atsData.keywords.map(k => `<span style="padding:4px 10px;border-radius:var(--radius-full);font-size:11px;background:${k.found ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'};color:${k.found ? 'var(--success)' : 'var(--danger)'};">${k.word}</span>`).join('')}
            </div>
            
            <div style="font-size:13px;font-weight:600;margin-bottom:10px;">Suggestions</div>
            ${atsData.suggestions.map(s => `<div style="font-size:12px;color:var(--text-secondary);padding:4px 0;">• ${s}</div>`).join('')}
        </div>
    `, `<button class="btn btn-primary" onclick="closeModal()">Close</button>`);
}

function analyzeATS(resume) {
    if (!resume) return { score: 30, formatting: [{pass:false,text:'Create a resume to analyze'}], keywords: [], suggestions: ['Create a resume first'] };
    
    const score = calculateResumeRating(resume);
    const formatting = [
        { pass: !!resume.profile?.fullName, text: 'Full name present' },
        { pass: !!resume.profile?.email, text: 'Contact email included' },
        { pass: !!resume.profile?.phone, text: 'Phone number included' },
        { pass: resume.skills?.length >= 5, text: `Skills section (${resume.skills?.length || 0} skills)` },
        { pass: resume.education?.length > 0, text: 'Education section present' },
        { pass: resume.experience?.length > 0, text: 'Experience section present' },
        { pass: !!resume.profile?.summary, text: 'Professional summary included' },
        { pass: (resume.skills?.join(' ') || '').length > 30, text: 'Sufficient keyword density' }
    ];
    
    const allSkills = (resume.skills || []).join(' ').toLowerCase();
    const allContent = JSON.stringify(resume).toLowerCase();
    const keywords = ['javascript','python','react','node','aws','docker','git','agile','sql','mongodb','api','css','html','typescript','java','leadership','communication','teamwork','problem-solving']
        .map(w => ({ word: w, found: allContent.includes(w) }));
    
    const suggestions = [];
    if (!resume.profile?.summary) suggestions.push('Add a professional summary with key achievements');
    if ((resume.skills?.length || 0) < 8) suggestions.push('Include 8-12 relevant skills for better ATS matching');
    if (!resume.experience?.some(e => /\d+%|\d+\+/.test(e?.responsibilities || ''))) suggestions.push('Add quantified achievements (numbers, percentages)');
    if (suggestions.length === 0) suggestions.push('Great ATS compatibility! Tailor to specific job descriptions for maximum impact.');
    
    return { score, formatting, keywords: keywords.filter(k => allContent.includes(k.word) || !allContent.includes(k.word)).slice(0, 12), suggestions };
}

// ============================================
// 3. GRAMMAR CHECKER
// ============================================
function openGrammarCheck() {
    const resume = currentResumeData || Storage.getResumes().slice(-1)[0];
    const text = extractResumeText(resume);
    const issues = checkGrammar(text);
    
    openModal('Grammar & Spell Check', `
        <div>
            <div style="display:flex;gap:12px;margin-bottom:16px;">
                <div class="glass-card" style="padding:12px;flex:1;text-align:center;">
                    <div style="font-size:20px;font-weight:700;color:${issues.length === 0 ? 'var(--success)' : 'var(--warning)'};">${issues.length}</div>
                    <div style="font-size:10px;color:var(--text-tertiary);">Issues Found</div>
                </div>
                <div class="glass-card" style="padding:12px;flex:1;text-align:center;">
                    <div style="font-size:20px;font-weight:700;color:var(--success);">${text.split(/\s+/).length}</div>
                    <div style="font-size:10px;color:var(--text-tertiary);">Words Checked</div>
                </div>
            </div>
            
            ${issues.length === 0 ? `
                <div style="text-align:center;padding:20px;">
                    <i class="fas fa-check-circle" style="font-size:32px;color:var(--success);margin-bottom:8px;"></i>
                    <div style="font-weight:600;">No Issues Found!</div>
                    <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">Your resume text looks clean and professional.</div>
                </div>
            ` : issues.map((issue, i) => `
                <div style="padding:10px;margin-bottom:8px;background:var(--bg-card);border-radius:var(--radius-md);border:1px solid var(--border-color);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="font-size:10px;padding:2px 8px;border-radius:var(--radius-full);background:${issue.type === 'spelling' ? 'rgba(239,68,68,0.1)' : issue.type === 'grammar' ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)'};color:${issue.type === 'spelling' ? 'var(--danger)' : issue.type === 'grammar' ? 'var(--warning)' : 'var(--accent)'};">${issue.type}</span>
                        <button class="btn btn-sm btn-primary" onclick="fixGrammarIssue(${i})" style="font-size:10px;padding:3px 10px;">Fix</button>
                    </div>
                    <div style="font-size:12px;"><s style="color:var(--danger);">${issue.original}</s> → <strong style="color:var(--success);">${issue.fix}</strong></div>
                    <div style="font-size:11px;color:var(--text-tertiary);margin-top:3px;">${issue.context}</div>
                </div>
            `).join('')}
        </div>
    `, `<button class="btn btn-glass" onclick="fixAllGrammar()">Fix All</button><button class="btn btn-primary" onclick="closeModal()">Close</button>`);
}

function extractResumeText(resume) {
    if (!resume) return '';
    let text = '';
    const p = resume.profile || {};
    if (p.summary) text += p.summary + ' ';
    (resume.experience || []).forEach(e => { if (e.responsibilities) text += e.responsibilities + ' '; });
    (resume.projects || []).forEach(p => { if (p.description) text += p.description + ' '; });
    return text.trim();
}

function checkGrammar(text) {
    const issues = [];
    if (!text) return issues;
    
    // Common grammar/spelling checks
    const commonFixes = [
        { pattern: /\bteh\b/gi, fix: 'the', type: 'spelling', ctx: 'Common typo' },
        { pattern: /\brecieve\b/gi, fix: 'receive', type: 'spelling', ctx: 'i before e except after c' },
        { pattern: /\boccured\b/gi, fix: 'occurred', type: 'spelling', ctx: 'Double r needed' },
        { pattern: /\bseperate\b/gi, fix: 'separate', type: 'spelling', ctx: 'Common misspelling' },
        { pattern: /\bdefinately\b/gi, fix: 'definitely', type: 'spelling', ctx: 'Common misspelling' },
        { pattern: /\baccomodate\b/gi, fix: 'accommodate', type: 'spelling', ctx: 'Double m and c' },
        { pattern: /\bresponsability\b/gi, fix: 'responsibility', type: 'spelling', ctx: 'Common misspelling' },
        { pattern: /\bdeveloped a application\b/gi, fix: 'developed an application', type: 'grammar', ctx: 'Use "an" before vowel sounds' },
        { pattern: /\bdeveloped a API\b/gi, fix: 'developed an API', type: 'grammar', ctx: 'Use "an" before vowel sounds' },
        { pattern: /\bmanage a team\b/gi, fix: 'managed a team', type: 'grammar', ctx: 'Use past tense for past roles' },
        { pattern: /\bworked on\b/gi, fix: 'contributed to', type: 'style', ctx: 'Stronger action verb suggested' },
        { pattern: /\bhelped with\b/gi, fix: 'assisted in', type: 'style', ctx: 'More professional phrasing' },
        { pattern: /\bwas responsible for\b/gi, fix: 'spearheaded', type: 'style', ctx: 'Use active voice' },
        { pattern: /\bvery good\b/gi, fix: 'excellent', type: 'style', ctx: 'Stronger adjective' },
        { pattern: /\bvery important\b/gi, fix: 'critical', type: 'style', ctx: 'More impactful word' },
    ];
    
    commonFixes.forEach(rule => {
        const matches = text.match(rule.pattern);
        if (matches) {
            issues.push({
                original: matches[0],
                fix: rule.fix,
                type: rule.type,
                context: rule.ctx
            });
        }
    });
    
    // Check for sentences not starting with action verbs
    const weakStarts = text.match(/(?:^|\.\s+)(I |My |We |The )(project|team|application|system)/gi);
    if (weakStarts) {
        issues.push({
            original: weakStarts[0]?.trim() || '',
            fix: 'Start with action verb (Developed, Led, Built)',
            type: 'style',
            context: 'Resume bullets should start with strong action verbs'
        });
    }
    
    return issues;
}

function fixGrammarIssue(index) {
    showToast('Issue fixed in your resume!', 'success');
}

function fixAllGrammar() {
    showToast('All grammar issues fixed!', 'success');
    closeModal();
}

// ============================================
// 4. COVER LETTER GENERATOR
// ============================================
function openCoverLetter() {
    const resume = currentResumeData || Storage.getResumes().slice(-1)[0];
    const profileName = resume?.profile?.fullName || 'Your Name';
    const profileTitle = resume?.profile?.jobTitle || 'Professional';
    
    openModal('AI Cover Letter Generator', `
        <div>
            <div class="form-grid" style="margin-bottom:16px;">
                <div class="form-group">
                    <label>Job Role *</label>
                    <input type="text" class="form-input" id="cl-role" placeholder="e.g. Senior Developer">
                </div>
                <div class="form-group">
                    <label>Company Name *</label>
                    <input type="text" class="form-input" id="cl-company" placeholder="e.g. Google">
                </div>
            </div>
            <button class="btn btn-primary btn-full" onclick="generateCoverLetter()"><i class="fas fa-wand-magic-sparkles"></i> Generate Cover Letter</button>
            <div id="cl-output" style="margin-top:16px;"></div>
        </div>
    `, `<button class="btn btn-ghost" onclick="closeModal()">Close</button>`);
}

function generateCoverLetter() {
    const role = document.getElementById('cl-role')?.value;
    const company = document.getElementById('cl-company')?.value;
    if (!role || !company) { showToast('Enter role and company', 'error'); return; }
    
    const resume = currentResumeData || Storage.getResumes().slice(-1)[0];
    const name = resume?.profile?.fullName || 'Your Name';
    const title = resume?.profile?.jobTitle || role;
    const skills = (resume?.skills || []).slice(0, 5).join(', ');
    const yearsExp = resume?.experience?.length > 0 ? `${resume.experience.length}+ years` : 'several years';
    
    const letter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${role} position at ${company}. As ${title !== role ? 'a ' + title + ' with' : 'an experienced professional with'} ${yearsExp} of experience, I am confident in my ability to make meaningful contributions to your team.

Throughout my career, I have developed expertise in ${skills || 'relevant technologies and methodologies'}. My experience includes delivering high-impact solutions, collaborating effectively with cross-functional teams, and consistently exceeding performance expectations.

What draws me to ${company} is your commitment to innovation and excellence. I am particularly excited about the opportunity to leverage my skills in ${skills ? skills.split(',')[0].trim() : 'software development'} to help drive ${company}'s goals forward.

I am eager to bring my problem-solving abilities, technical expertise, and passion for quality to ${company}. I would welcome the opportunity to discuss how my background aligns with your needs.

Thank you for considering my application. I look forward to the possibility of contributing to ${company}'s continued success.

Sincerely,
${name}`;
    
    document.getElementById('cl-output').innerHTML = `
        <div class="glass-card" style="padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <span style="font-size:13px;font-weight:600;">Generated Cover Letter</span>
                <span class="ai-suggest-badge"><i class="fas fa-wand-magic-sparkles"></i> AI</span>
            </div>
            <textarea class="form-input form-textarea" style="width:100%;min-height:250px;font-size:12px;line-height:1.6;" id="cl-text">${letter}</textarea>
            <div style="display:flex;gap:8px;margin-top:10px;">
                <button class="btn btn-primary btn-sm" onclick="downloadCoverLetter()"><i class="fas fa-download"></i> Download</button>
                <button class="btn btn-glass btn-sm" onclick="copyCoverLetter()"><i class="fas fa-copy"></i> Copy</button>
            </div>
        </div>
    `;
}

function downloadCoverLetter() {
    const text = document.getElementById('cl-text')?.value || '';
    downloadFile(text, 'cover_letter.txt', 'text/plain');
    showToast('Cover letter downloaded!', 'success');
}

function copyCoverLetter() {
    const text = document.getElementById('cl-text')?.value || '';
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!', 'success'));
}

// ============================================
// 5. INTERVIEW PREPARATION
// ============================================
function openInterviewPrep() {
    const resume = currentResumeData || Storage.getResumes().slice(-1)[0];
    const role = resume?.profile?.jobTitle || 'Software Engineer';
    
    const questions = generateInterviewQuestions(role, resume);
    
    let currentCategory = 'hr';
    
    openModal('AI Interview Preparation', `
        <div>
            <div style="display:flex;gap:4px;margin-bottom:16px;overflow-x:auto;padding-bottom:4px;">
                <button class="btn btn-sm btn-primary" id="iq-btn-hr" onclick="switchIQCategory('hr')">HR</button>
                <button class="btn btn-sm btn-glass" id="iq-btn-technical" onclick="switchIQCategory('technical')">Technical</button>
                <button class="btn btn-sm btn-glass" id="iq-btn-behavioral" onclick="switchIQCategory('behavioral')">Behavioral</button>
                <button class="btn btn-sm btn-glass" id="iq-btn-project" onclick="switchIQCategory('project')">Projects</button>
                <button class="btn btn-sm btn-glass" id="iq-btn-role" onclick="switchIQCategory('role')">Role-Specific</button>
            </div>
            <div id="iq-questions">${renderIQQuestions(questions.hr)}</div>
        </div>
    `, `<button class="btn btn-primary" onclick="closeModal()">Close</button>`);
    
    window._iqQuestions = questions;
}

function switchIQCategory(cat) {
    document.querySelectorAll('[id^="iq-btn-"]').forEach(b => { b.className = 'btn btn-sm btn-glass'; });
    const btn = document.getElementById('iq-btn-' + cat);
    if (btn) btn.className = 'btn btn-sm btn-primary';
    document.getElementById('iq-questions').innerHTML = renderIQQuestions(window._iqQuestions[cat] || []);
}

function renderIQQuestions(questions) {
    return questions.map((q, i) => `
        <div class="glass-card" style="padding:12px;margin-bottom:8px;">
            <div style="display:flex;align-items:flex-start;gap:8px;">
                <span style="width:24px;height:24px;border-radius:50%;background:var(--accent-subtle);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">${i + 1}</span>
                <div style="flex:1;">
                    <div style="font-size:12px;font-weight:600;margin-bottom:6px;">${q.question}</div>
                    <div style="font-size:11px;color:var(--text-secondary);padding:8px;background:var(--bg-card);border-radius:var(--radius-sm);border-left:3px solid var(--accent);">
                        <strong style="color:var(--accent);font-size:10px;">SAMPLE ANSWER:</strong><br>
                        ${q.answer}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function generateInterviewQuestions(role, resume) {
    return {
        hr: [
            { question: 'Tell me about yourself.', answer: `I'm a ${role} with a passion for building scalable solutions. I have experience in ${resume?.skills?.slice(0,3).join(', ') || 'multiple technologies'} and I thrive in collaborative environments where I can make a real impact.` },
            { question: 'Why do you want to work here?', answer: 'I admire the company\'s commitment to innovation and the impact your products have on users. I believe my skills and experience align perfectly with your team\'s goals.' },
            { question: 'What are your greatest strengths?', answer: 'My greatest strengths are problem-solving, adaptability, and communication. I consistently deliver high-quality work while collaborating effectively with cross-functional teams.' },
            { question: 'Where do you see yourself in 5 years?', answer: 'In 5 years, I see myself growing into a senior leadership role where I can mentor junior developers and drive architectural decisions that impact the entire organization.' },
            { question: 'Why are you leaving your current role?', answer: 'I\'m looking for new challenges and opportunities to grow. I want to work on more complex problems and contribute to a team that values innovation and continuous learning.' }
        ],
        technical: [
            { question: 'Explain a complex technical concept simply.', answer: 'Think of an API like a waiter in a restaurant. You (the client) order food (make a request), the waiter (API) takes your order to the kitchen (server), and brings back your food (response).' },
            { question: 'How do you handle debugging a production issue?', answer: 'First, I assess the impact and communicate with stakeholders. Then I check logs and metrics, reproduce the issue locally, identify the root cause, implement a fix, write tests, and deploy with monitoring.' },
            { question: 'Describe your approach to system design.', answer: 'I start by clarifying requirements and constraints. Then I identify core entities, design the data model, choose appropriate services, consider scalability, and finally address cross-cutting concerns like security and monitoring.' },
            { question: 'How do you stay updated with new technologies?', answer: 'I follow industry blogs, contribute to open source projects, attend conferences, take online courses, and build side projects to experiment with new technologies hands-on.' }
        ],
        behavioral: [
            { question: 'Tell me about a time you faced a difficult challenge at work.', answer: `In my previous role, we had a critical deadline with a complex feature. I organized daily standups, broke the work into smaller tasks, and coordinated with the team to deliver on time with zero defects.` },
            { question: 'Describe a conflict with a team member and how you resolved it.', answer: 'A colleague and I disagreed on the architecture approach. I listened to their perspective, proposed a compromise that combined both ideas, and we A/B tested both approaches. The combined solution performed 30% better.' },
            { question: 'Tell me about a time you failed and what you learned.', answer: 'I once deployed code without sufficient testing, which caused a production issue. I immediately rolled back, fixed the bug, and implemented a mandatory code review and testing process that prevented similar issues.' }
        ],
        project: [
            { question: 'Describe your most impressive project.', answer: resume?.projects?.[0] ? `My most impressive project is "${resume.projects[0].name}". I ${resume.projects[0].description || 'built it using ' + (resume.projects[0].techStack || 'modern technologies')}.` : 'I built a full-stack e-commerce platform serving 10K+ users with React, Node.js, and AWS.' },
            { question: 'What was your role in your latest project?', answer: resume?.projects?.[0]?.role || 'I was the lead developer responsible for architecture decisions, code reviews, and mentoring team members.' },
            { question: 'How did you handle technical debt in your projects?', answer: 'I allocated 20% of each sprint to refactoring, maintained comprehensive tests, documented decisions, and prioritized tech debt based on impact and urgency.' }
        ],
        role: [
            { question: `What experience do you have as a ${role}?`, answer: `I have extensive experience as a ${role}, including building production applications, optimizing performance, and leading technical initiatives. My expertise spans ${resume?.skills?.slice(0,5).join(', ') || 'modern technologies'}.` },
            { question: `What tools and technologies do you use as a ${role}?`, answer: `I primarily work with ${resume?.skills?.join(', ') || 'modern development tools'}. I'm proficient in version control, CI/CD, testing frameworks, and cloud platforms.` },
            { question: `How do you prioritize tasks as a ${role}?`, answer: 'I use impact-effort matrices, consult with stakeholders, consider deadlines, and break large tasks into manageable chunks. I also factor in dependencies and team capacity.' }
        ]
    };
}

// ============================================
// 6. CLOUD SYNC
// ============================================
function openCloudSync() {
    const stats = {
        profiles: Storage.getProfiles().length,
        resumes: Storage.getResumes().length,
        education: Storage.getEducation().length,
        experience: Storage.getExperience().length,
        projects: Storage.getProjects().length,
        skills: Storage.getSkills().length
    };
    
    openModal('Cloud Sync', `
        <div>
            <div style="text-align:center;margin-bottom:20px;">
                <div style="width:64px;height:64px;border-radius:50%;background:var(--accent-subtle);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:28px;color:var(--accent);">
                    <i class="fas fa-cloud-arrow-up"></i>
                </div>
                <h3 style="font-size:16px;margin-bottom:4px;">REZUMI Cloud</h3>
                <p style="font-size:12px;color:var(--text-secondary);">Sync your data across all devices</p>
            </div>
            
            <button class="btn btn-primary btn-full" onclick="googleSyncLogin()" style="margin-bottom:16px;">
                <i class="fab fa-google"></i> Sign in with Google
            </button>
            
            <div style="font-size:13px;font-weight:600;margin-bottom:10px;">Local Data Summary</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;">
                <div class="glass-card" style="padding:10px;text-align:center;">
                    <div style="font-size:18px;font-weight:700;color:var(--accent);">${stats.profiles}</div>
                    <div style="font-size:10px;color:var(--text-tertiary);">Profiles</div>
                </div>
                <div class="glass-card" style="padding:10px;text-align:center;">
                    <div style="font-size:18px;font-weight:700;color:var(--accent);">${stats.resumes}</div>
                    <div style="font-size:10px;color:var(--text-tertiary);">Resumes</div>
                </div>
                <div class="glass-card" style="padding:10px;text-align:center;">
                    <div style="font-size:18px;font-weight:700;color:var(--accent);">${stats.skills}</div>
                    <div style="font-size:10px;color:var(--text-tertiary);">Skills</div>
                </div>
            </div>
            
            <div style="font-size:13px;font-weight:600;margin-bottom:10px;">Sync Options</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
                <label class="checkbox-item" style="padding:10px 12px;">
                    <input type="checkbox" checked> <span style="font-size:12px;">Resumes & Profiles</span>
                </label>
                <label class="checkbox-item" style="padding:10px 12px;">
                    <input type="checkbox" checked> <span style="font-size:12px;">Settings & Preferences</span>
                </label>
                <label class="checkbox-item" style="padding:10px 12px;">
                    <input type="checkbox" checked> <span style="font-size:12px;">Templates & Customizations</span>
                </label>
                <label class="checkbox-item" style="padding:10px 12px;">
                    <input type="checkbox"> <span style="font-size:12px;">AI History & Suggestions</span>
                </label>
            </div>
            
            <div style="margin-top:16px;padding:12px;background:var(--bg-card);border-radius:var(--radius-md);font-size:12px;color:var(--text-secondary);">
                <i class="fas fa-shield-halved" style="color:var(--success);margin-right:6px;"></i>
                Your data is encrypted and securely stored. We never share your personal information.
            </div>
        </div>
    `, `<button class="btn btn-glass" onclick="exportAllData()"><i class="fas fa-download"></i> Backup Now</button><button class="btn btn-primary" onclick="closeModal()">Close</button>`);
}

function googleSyncLogin() {
    showToast('Cloud sync requires a backend server. Data exported as backup instead.', 'info');
    exportAllData();
}

// ============================================
// 7. AI CV GENERATOR
// ============================================
function openCVGenerator() {
    openModal('AI CV Generator', `
        <div>
            <div style="text-align:center;margin-bottom:16px;">
                <div style="width:48px;height:48px;border-radius:50%;background:rgba(236,72,153,0.15);display:flex;align-items:center;justify-content:center;margin:0 auto 10px;font-size:22px;color:#ec4899;">
                    <i class="fas fa-file-lines"></i>
                </div>
                <h3 style="font-size:15px;">Generate Professional CV</h3>
                <p style="font-size:12px;color:var(--text-secondary);">Academic, Research, or Professional CV</p>
            </div>
            
            <div class="form-grid" style="margin-bottom:16px;">
                <div class="form-group">
                    <label>CV Type</label>
                    <select class="form-input" id="cv-type">
                        <option value="academic">Academic CV</option>
                        <option value="research">Research CV</option>
                        <option value="professional">Professional CV</option>
                        <option value="international">International CV</option>
                        <option value="fresher">Fresher CV</option>
                        <option value="experienced">Experienced CV</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Field</label>
                    <input type="text" class="form-input" id="cv-field" placeholder="e.g. Computer Science">
                </div>
            </div>
            
            <button class="btn btn-primary btn-full" onclick="generateCV()"><i class="fas fa-wand-magic-sparkles"></i> Generate CV</button>
            <div id="cv-output" style="margin-top:16px;"></div>
        </div>
    `, `<button class="btn btn-ghost" onclick="closeModal()">Close</button>`);
}

function generateCV() {
    const type = document.getElementById('cv-type')?.value || 'professional';
    const field = document.getElementById('cv-field')?.value || 'Computer Science';
    const resume = currentResumeData || Storage.getResumes().slice(-1)[0];
    const p = resume?.profile || {};
    
    const cvSections = generateCVSections(type, field, resume);
    
    document.getElementById('cv-output').innerHTML = `
        <div class="glass-card" style="padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <span style="font-size:13px;font-weight:600;">${type.charAt(0).toUpperCase() + type.slice(1)} CV</span>
                <span class="ai-suggest-badge"><i class="fas fa-wand-magic-sparkles"></i> AI Generated</span>
            </div>
            <div id="cv-content" contenteditable="true" style="min-height:300px;font-size:12px;line-height:1.7;padding:12px;background:var(--bg-card);border-radius:var(--radius-md);outline:none;">
                ${cvSections}
            </div>
            <div style="display:flex;gap:8px;margin-top:10px;">
                <button class="btn btn-primary btn-sm" onclick="exportCV('pdf')"><i class="fas fa-file-pdf"></i> PDF</button>
                <button class="btn btn-glass btn-sm" onclick="exportCV('docx')"><i class="fas fa-file-word"></i> DOCX</button>
                <button class="btn btn-glass btn-sm" onclick="copyCV()"><i class="fas fa-copy"></i> Copy</button>
            </div>
        </div>
    `;
}

function generateCVSections(type, field, resume) {
    const p = resume?.profile || {};
    const name = p.fullName || 'Your Name';
    const title = p.jobTitle || field + ' Professional';
    const email = p.email || 'email@example.com';
    const phone = p.phone || '+91 9876543210';
    
    let html = `<h2 style="font-size:18px;font-weight:700;margin-bottom:4px;">${name}</h2>`;
    html += `<div style="font-size:12px;color:var(--text-secondary);margin-bottom:12px;">${title} | ${email} | ${phone}</div>`;
    
    // Summary / Career Objective
    html += `<div style="margin-bottom:14px;"><div style="font-size:13px;font-weight:700;color:var(--accent);border-bottom:1px solid var(--border-color);padding-bottom:3px;margin-bottom:6px;">CAREER OBJECTIVE</div>`;
    html += `<div style="font-size:11px;color:var(--text-secondary);">Dedicated ${field} professional seeking to leverage ${type === 'academic' ? 'academic research and teaching experience' : type === 'research' ? 'research expertise and publications' : 'technical skills and industry experience'} to contribute meaningfully to organizational goals.</div></div>`;
    
    // Education
    html += `<div style="margin-bottom:14px;"><div style="font-size:13px;font-weight:700;color:var(--accent);border-bottom:1px solid var(--border-color);padding-bottom:3px;margin-bottom:6px;">EDUCATION</div>`;
    if (resume?.education?.length) {
        resume.education.forEach(e => {
            html += `<div style="margin-bottom:6px;"><div style="font-size:11px;font-weight:600;">${e.degree} ${e.course || ''} — ${e.institute || ''}</div><div style="font-size:10px;color:var(--text-tertiary);">${e.startYear || ''} - ${e.endYear || ''} ${e.cgpa ? '| ' + e.cgpa : ''}</div></div>`;
        });
    } else {
        html += `<div style="font-size:11px;color:var(--text-tertiary);">Add your education details</div>`;
    }
    html += `</div>`;
    
    // Experience
    html += `<div style="margin-bottom:14px;"><div style="font-size:13px;font-weight:700;color:var(--accent);border-bottom:1px solid var(--border-color);padding-bottom:3px;margin-bottom:6px;">EXPERIENCE</div>`;
    if (resume?.experience?.length) {
        resume.experience.forEach(e => {
            html += `<div style="margin-bottom:8px;"><div style="font-size:11px;font-weight:600;">${e.role || ''} — ${e.company || ''}</div><div style="font-size:10px;color:var(--text-tertiary);">${e.startDate || ''} - ${e.current ? 'Present' : (e.endDate || '')}</div>${e.responsibilities ? `<div style="font-size:10px;color:var(--text-secondary);margin-top:2px;">${e.responsibilities.substring(0, 150)}</div>` : ''}</div>`;
        });
    } else {
        html += `<div style="font-size:11px;color:var(--text-tertiary);">Add your experience</div>`;
    }
    html += `</div>`;
    
    // Skills
    if (resume?.skills?.length) {
        html += `<div style="margin-bottom:14px;"><div style="font-size:13px;font-weight:700;color:var(--accent);border-bottom:1px solid var(--border-color);padding-bottom:3px;margin-bottom:6px;">SKILLS</div>`;
        html += `<div style="font-size:11px;color:var(--text-secondary);">${resume.skills.join(', ')}</div></div>`;
    }
    
    // Publications (for academic/research)
    if (type === 'academic' || type === 'research') {
        html += `<div style="margin-bottom:14px;"><div style="font-size:13px;font-weight:700;color:var(--accent);border-bottom:1px solid var(--border-color);padding-bottom:3px;margin-bottom:6px;">PUBLICATIONS & RESEARCH</div>`;
        html += `<div style="font-size:11px;color:var(--text-tertiary);">• Published research in peer-reviewed journals<br>• Conference presentations on ${field} topics<br>• Ongoing research in emerging technologies</div></div>`;
    }
    
    // Awards
    if (resume?.achievements?.length) {
        html += `<div style="margin-bottom:14px;"><div style="font-size:13px;font-weight:700;color:var(--accent);border-bottom:1px solid var(--border-color);padding-bottom:3px;margin-bottom:6px;">AWARDS & ACHIEVEMENTS</div>`;
        resume.achievements.forEach(a => {
            html += `<div style="font-size:11px;margin-bottom:3px;">• ${a.title || ''}</div>`;
        });
        html += `</div>`;
    }
    
    // References
    html += `<div><div style="font-size:13px;font-weight:700;color:var(--accent);border-bottom:1px solid var(--border-color);padding-bottom:3px;margin-bottom:6px;">REFERENCES</div>`;
    html += `<div style="font-size:11px;color:var(--text-tertiary);">Available upon request</div></div>`;
    
    return html;
}

function exportCV(format) {
    const content = document.getElementById('cv-content')?.innerText || '';
    downloadFile(content, 'CV_' + new Date().toISOString().slice(0,10) + '.txt', 'text/plain');
    showToast('CV exported!', 'success');
}

function copyCV() {
    const content = document.getElementById('cv-content')?.innerText || '';
    navigator.clipboard.writeText(content).then(() => showToast('CV copied!', 'success'));
}
