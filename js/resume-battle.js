/* ============================================
   REZUMI - Resume Battle
   Compare two resumes side-by-side with AI analysis
   ============================================ */

const ResumeBattle = {
    resumeA: null,
    resumeB: null,

    open() {
        const resumes = Storage.getResumes();
        if (resumes.length < 2) {
            showToast('Need at least 2 saved resumes to compare', 'error');
            return;
        }
        this.resumeA = null;
        this.resumeB = null;
        this.renderSelect();
    },

    renderSelect() {
        const resumes = Storage.getResumes();
        openModal('Resume Battle — Select Resumes', `
            <div>
                <p style="font-size:12px;color:var(--text-secondary);margin-bottom:16px;">
                    Select two resumes to compare. AI will analyze and score both.
                </p>
                <div class="form-grid" style="margin-bottom:16px;">
                    <div class="form-group">
                        <label><i class="fas fa-file-alt" style="color:var(--accent);"></i> Resume A</label>
                        <select class="form-input" id="battle-resume-a" onchange="ResumeBattle.selectA(this.value)">
                            <option value="">Choose resume...</option>
                            ${resumes.map(r => `<option value="${r.id}">${r.name || 'Untitled'}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-file-alt" style="color:var(--danger);"></i> Resume B</label>
                        <select class="form-input" id="battle-resume-b" onchange="ResumeBattle.selectB(this.value)">
                            <option value="">Choose resume...</option>
                            ${resumes.map(r => `<option value="${r.id}">${r.name || 'Untitled'}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <button class="btn btn-primary btn-full" onclick="ResumeBattle.startBattle()">
                    <i class="fas fa-swords"></i> Start Battle
                </button>
            </div>
        `, `<button class="btn btn-ghost" onclick="closeModal()">Cancel</button>`);
    },

    selectA(id) { this.resumeA = Storage.getResumes().find(r => r.id === id); },
    selectB(id) { this.resumeB = Storage.getResumes().find(r => r.id === id); },

    startBattle() {
        if (!this.resumeA || !this.resumeB) {
            showToast('Select both resumes', 'error');
            return;
        }
        if (this.resumeA.id === this.resumeB.id) {
            showToast('Select two different resumes', 'error');
            return;
        }
        closeModal();
        navigateTo('resume-battle');
        this.renderBattle();
    },

    analyzeResume(resume) {
        const p = resume.profile || {};
        const skills = resume.skills || [];
        const exp = resume.experience || [];
        const edu = resume.education || [];
        const proj = resume.projects || [];
        const certs = resume.certifications || [];
        const ach = resume.achievements || [];

        // Score calculations
        let atsScore = 0;
        if (p.fullName) atsScore += 8;
        if (p.email) atsScore += 7;
        if (p.phone) atsScore += 5;
        if (p.summary && p.summary.length > 50) atsScore += 10;
        if (skills.length >= 5) atsScore += 12;
        if (skills.length >= 8) atsScore += 5;
        if (exp.length > 0) atsScore += 12;
        if (edu.length > 0) atsScore += 8;
        if (proj.length > 0) atsScore += 8;
        if (certs.length > 0) atsScore += 5;
        if (ach.length > 0) atsScore += 5;
        if (p.linkedin) atsScore += 3;
        if (p.github) atsScore += 3;
        if (p.portfolio) atsScore += 3;
        if (resume.languages?.length > 0) atsScore += 3;
        atsScore = Math.min(atsScore, 100);

        // Content depth
        let contentScore = 0;
        exp.forEach(e => { if (e.responsibilities) contentScore += Math.min(e.responsibilities.split('\n').length, 5); });
        proj.forEach(p => { if (p.description) contentScore += 2; });
        contentScore = Math.min(contentScore, 30);

        // Keyword analysis
        const allText = JSON.stringify(resume).toLowerCase();
        const keywords = ['javascript','python','react','node','aws','docker','sql','mongodb','git','agile','typescript','java','css','html','api','leadership','teamwork','communication','problem-solving','management','design','testing','devops','cloud','security'];
        const foundKeywords = keywords.filter(k => allText.includes(k));

        // Readability
        const summaryLen = (p.summary || '').split(' ').length;
        const readability = summaryLen > 20 && summaryLen < 60 ? 90 : summaryLen > 0 ? 70 : 40;

        // Formatting
        const formatting = atsScore > 70 ? 95 : atsScore > 50 ? 80 : 60;

        return {
            atsScore,
            contentScore,
            keywords: foundKeywords,
            readability,
            formatting,
            skillsCount: skills.length,
            expCount: exp.length,
            eduCount: edu.length,
            projCount: proj.length,
            certsCount: certs.length,
            achCount: ach.length,
            hasSummary: !!p.summary,
            hasPhoto: !!p.photo,
            totalSections: [p.summary, exp.length, edu.length, skills.length, proj.length, certs.length, ach.length].filter(Boolean).length
        };
    },

    renderBattle() {
        const a = this.analyzeResume(this.resumeA);
        const b = this.analyzeResume(this.resumeB);
        const winner = a.atsScore + a.contentScore > b.atsScore + b.contentScore ? 'A' : 'B';

        const page = document.getElementById('page-resume-battle');
        if (!page) return;

        page.innerHTML = `
        <div class="page-container">
            <div style="text-align:center;margin-bottom:24px;">
                <h1 style="font-size:28px;font-weight:800;"><i class="fas fa-swords" style="color:var(--accent);"></i> Resume Battle</h1>
                <p style="color:var(--text-secondary);font-size:14px;">AI-Powered Resume Comparison</p>
            </div>

            <!-- Winner Banner -->
            <div class="glass-card" style="padding:20px;margin-bottom:24px;text-align:center;border:2px solid ${winner === 'A' ? 'var(--accent)' : 'var(--danger)'};">
                <div style="font-size:14px;color:var(--text-secondary);margin-bottom:6px;">🏆 Winner</div>
                <div style="font-size:22px;font-weight:800;color:${winner === 'A' ? 'var(--accent)' : 'var(--danger)'};">
                    ${winner === 'A' ? this.resumeA.name : this.resumeB.name}
                </div>
                <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">
                    Combined Score: ${winner === 'A' ? (a.atsScore + a.contentScore) : (b.atsScore + b.contentScore)} vs ${winner === 'A' ? (b.atsScore + b.contentScore) : (a.atsScore + a.contentScore)}
                </div>
            </div>

            <!-- Side-by-Side Comparison -->
            <div class="battle-grid">
                ${this.renderResumeCard(this.resumeA, a, 'A')}
                ${this.renderResumeCard(this.resumeB, b, 'B')}
            </div>

            <!-- AI Analysis -->
            <div class="glass-card" style="padding:20px;margin-top:20px;">
                <h3 style="font-size:15px;font-weight:700;margin-bottom:12px;"><i class="fas fa-robot" style="color:var(--accent);"></i> AI Analysis</h3>
                ${this.renderAIAnalysis(this.resumeA, this.resumeB, a, b, winner)}
            </div>

            <!-- Category Comparison Chart -->
            <div class="glass-card" style="padding:20px;margin-top:16px;">
                <h3 style="font-size:15px;font-weight:700;margin-bottom:16px;"><i class="fas fa-chart-bar" style="color:var(--accent);"></i> Category Breakdown</h3>
                ${this.renderCategoryChart(a, b)}
            </div>

            <!-- Actions -->
            <div style="display:flex;gap:10px;justify-content:center;margin-top:20px;">
                <button class="btn btn-glass" onclick="ResumeBattle.open()"><i class="fas fa-redo"></i> New Battle</button>
                <button class="btn btn-glass" onclick="ResumeBattle.exportComparison()"><i class="fas fa-file-pdf"></i> Export PDF</button>
                <button class="btn btn-glass" onclick="navigateTo('home')"><i class="fas fa-home"></i> Home</button>
            </div>
        </div>`;
    },

    renderResumeCard(resume, analysis, label) {
        const color = label === 'A' ? 'var(--accent)' : 'var(--danger)';
        return `
        <div class="glass-card battle-card" style="padding:20px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
                <div style="width:36px;height:36px;border-radius:50%;background:${color};color:white;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;">${label}</div>
                <div>
                    <div style="font-weight:700;font-size:14px;">${resume.name || 'Untitled'}</div>
                    <div style="font-size:11px;color:var(--text-tertiary);">${resume.profile?.jobTitle || 'No title'}</div>
                </div>
            </div>
            
            <div style="text-align:center;margin-bottom:16px;">
                <div style="font-size:36px;font-weight:800;color:${color};">${analysis.atsScore}</div>
                <div style="font-size:11px;color:var(--text-tertiary);">ATS Score / 100</div>
            </div>

            <div class="battle-stats">
                ${this.statRow('Skills', analysis.skillsCount, color)}
                ${this.statRow('Experience', analysis.expCount, color)}
                ${this.statRow('Education', analysis.eduCount, color)}
                ${this.statRow('Projects', analysis.projCount, color)}
                ${this.statRow('Certifications', analysis.certsCount, color)}
                ${this.statRow('Achievements', analysis.achCount, color)}
                ${this.statRow('Keywords Found', analysis.keywords.length, color)}
                ${this.statRow('Readability', analysis.readability + '%', color)}
                ${this.statRow('Formatting', analysis.formatting + '%', color)}
                ${this.statRow('Has Summary', analysis.hasSummary ? '✓' : '✗', color)}
            </div>
        </div>`;
    },

    statRow(label, value, color) {
        return `<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px;border-bottom:1px solid var(--border-color);">
            <span style="color:var(--text-secondary);">${label}</span>
            <span style="font-weight:600;color:${color};">${value}</span>
        </div>`;
    },

    renderAIAnalysis(rA, rB, a, b, winner) {
        const w = winner === 'A' ? rA : rB;
        const l = winner === 'A' ? rB : rA;
        const wa = winner === 'A' ? a : b;
        const la = winner === 'A' ? b : a;

        const strengths = [];
        const weaknesses = [];
        const suggestions = [];
        const missingKW = [];

        // Analyze winner
        if (wa.skillsCount >= 8) strengths.push('Strong skill set with ' + wa.skillsCount + ' skills listed');
        if (wa.expCount >= 2) strengths.push('Multiple experience entries showing career progression');
        if (wa.hasSummary) strengths.push('Professional summary provides context');
        if (wa.keywords.length >= 5) strengths.push('Good keyword density for ATS matching');
        if (wa.projCount > 0) strengths.push(wa.projCount + ' project(s) demonstrate practical skills');

        // Analyze loser
        if (la.skillsCount < 5) weaknesses.push('Only ' + la.skillsCount + ' skills — aim for 8+');
        if (!la.hasSummary) weaknesses.push('Missing professional summary');
        if (la.expCount === 0) weaknesses.push('No work experience listed');
        if (la.keywords.length < 5) weaknesses.push('Low keyword density — add industry terms');

        // Missing keywords
        const allKW = new Set([...a.keywords, ...b.keywords]);
        const commonKW = ['agile', 'git', 'docker', 'aws', 'testing', 'leadership', 'communication', 'sql'];
        commonKW.forEach(k => { if (!allKW.has(k)) missingKW.push(k); });

        // Suggestions
        suggestions.push('Quantify achievements with numbers (e.g., "improved performance by 40%")');
        suggestions.push('Use strong action verbs: "Spearheaded", "Engineered", "Orchestrated"');
        suggestions.push('Tailor keywords to specific job descriptions for maximum ATS match');
        if (missingKW.length > 0) suggestions.push('Consider adding: ' + missingKW.slice(0, 4).join(', '));

        return `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div>
                    <div style="font-size:12px;font-weight:600;color:var(--success);margin-bottom:8px;">✓ Strengths of ${w.name}</div>
                    ${strengths.map(s => `<div style="font-size:11px;color:var(--text-secondary);padding:3px 0;">• ${s}</div>`).join('')}
                </div>
                <div>
                    <div style="font-size:12px;font-weight:600;color:var(--warning);margin-bottom:8px;">⚠ Weaknesses of ${l.name}</div>
                    ${weaknesses.map(s => `<div style="font-size:11px;color:var(--text-secondary);padding:3px 0;">• ${s}</div>`).join('')}
                </div>
            </div>
            <div style="margin-top:14px;">
                <div style="font-size:12px;font-weight:600;color:var(--accent);margin-bottom:8px;">💡 AI Suggestions</div>
                ${suggestions.map(s => `<div style="font-size:11px;color:var(--text-secondary);padding:3px 0;">• ${s}</div>`).join('')}
            </div>
            ${missingKW.length > 0 ? `
            <div style="margin-top:14px;">
                <div style="font-size:12px;font-weight:600;color:var(--danger);margin-bottom:8px;">🔑 Missing Keywords</div>
                <div style="display:flex;flex-wrap:wrap;gap:4px;">${missingKW.map(k => `<span class="tag" style="border-color:var(--danger);color:var(--danger);">${k}</span>`).join('')}</div>
            </div>` : ''}
        `;
    },

    renderCategoryChart(a, b) {
        const categories = [
            { name: 'ATS Score', a: a.atsScore, b: b.atsScore },
            { name: 'Skills', a: a.skillsCount * 10, b: b.skillsCount * 10 },
            { name: 'Experience', a: a.expCount * 20, b: b.expCount * 20 },
            { name: 'Projects', a: a.projCount * 20, b: b.projCount * 20 },
            { name: 'Readability', a: a.readability, b: b.readability },
            { name: 'Formatting', a: a.formatting, b: b.formatting }
        ];

        return categories.map(cat => `
            <div style="margin-bottom:10px;">
                <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px;">
                    <span style="color:var(--text-secondary);">${cat.name}</span>
                    <span><span style="color:var(--accent);font-weight:600;">${Math.min(cat.a, 100)}</span> vs <span style="color:var(--danger);font-weight:600;">${Math.min(cat.b, 100)}</span></span>
                </div>
                <div style="display:flex;gap:3px;height:6px;">
                    <div style="flex:${Math.min(cat.a, 100)};background:var(--accent);border-radius:3px;transition:0.5s;"></div>
                    <div style="flex:${Math.min(cat.b, 100)};background:var(--danger);border-radius:3px;transition:0.5s;"></div>
                </div>
            </div>
        `).join('');
    },

    exportComparison() {
        if (!this.resumeA || !this.resumeB) return;
        const a = this.analyzeResume(this.resumeA);
        const b = this.analyzeResume(this.resumeB);
        const winner = a.atsScore + a.contentScore > b.atsScore + b.contentScore ? this.resumeA : this.resumeB;

        let text = `REZUMI RESUME BATTLE — COMPARISON REPORT\n${'='.repeat(50)}\n\n`;
        text += `WINNER: ${winner.name}\n\n`;
        text += `RESUME A: ${this.resumeA.name}\n`;
        text += `  ATS Score: ${a.atsScore}/100\n`;
        text += `  Skills: ${a.skillsCount} | Experience: ${a.expCount} | Education: ${a.eduCount}\n`;
        text += `  Projects: ${a.projCount} | Keywords: ${a.keywords.length}\n\n`;
        text += `RESUME B: ${this.resumeB.name}\n`;
        text += `  ATS Score: ${b.atsScore}/100\n`;
        text += `  Skills: ${b.skillsCount} | Experience: ${b.expCount} | Education: ${b.eduCount}\n`;
        text += `  Projects: ${b.projCount} | Keywords: ${b.keywords.length}\n`;

        downloadFile(text, 'resume_battle_' + Date.now() + '.txt', 'text/plain');
        showToast('Comparison exported!', 'success');
    }
};

window.ResumeBattle = ResumeBattle;
