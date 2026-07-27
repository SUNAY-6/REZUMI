/* ============================================
   REZUMI - Resume Verification
   Validate all resume data for correctness
   ============================================ */

const ResumeVerification = {
    open() {
        const resume = currentResumeData || Storage.getResumes().slice(-1)[0];
        if (!resume) {
            showToast('No resume to verify', 'error');
            return;
        }
        const results = this.verify(resume);
        this.renderResults(resume, results);
    },

    verify(resume) {
        const errors = [];
        const warnings = [];
        const suggestions = [];
        const p = resume.profile || {};

        // Email validation
        if (p.email) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
                errors.push({ type: 'email', text: 'Invalid email format: ' + p.email });
            }
        } else {
            errors.push({ type: 'email', text: 'Email address is missing' });
        }

        // Phone validation
        if (p.phone) {
            if (!/^[\+]?[\d\s\-\(\)]{7,20}$/.test(p.phone)) {
                warnings.push({ type: 'phone', text: 'Phone format may be incorrect: ' + p.phone });
            }
        } else {
            warnings.push({ type: 'phone', text: 'Phone number is missing' });
        }

        // LinkedIn validation
        if (p.linkedin) {
            if (!p.linkedin.includes('linkedin.com') && !p.linkedin.includes('linkedin')) {
                warnings.push({ type: 'linkedin', text: 'LinkedIn URL may be incorrect' });
            }
        }

        // GitHub validation
        if (p.github) {
            if (!p.github.includes('github.com') && !p.github.includes('github')) {
                warnings.push({ type: 'github', text: 'GitHub URL may be incorrect' });
            }
        }

        // URL validation
        const urls = [p.linkedin, p.github, p.portfolio].filter(Boolean);
        urls.forEach(url => {
            try {
                new URL(url.startsWith('http') ? url : 'https://' + url);
            } catch {
                errors.push({ type: 'url', text: 'Broken URL: ' + url });
            }
        });

        // Employment timeline
        const exp = resume.experience || [];
        const edu = resume.education || [];

        exp.forEach((e, i) => {
            if (!e.role && !e.company) {
                errors.push({ type: 'experience', text: `Experience #${i + 1}: Role and company are empty` });
            }
            if (!e.startDate) {
                warnings.push({ type: 'experience', text: `Experience "${e.role || 'Unknown'}": Start date missing` });
            }
            if (e.startDate && e.endDate && !e.current) {
                const start = new Date(e.startDate);
                const end = new Date(e.endDate);
                if (end < start) {
                    errors.push({ type: 'timeline', text: `Experience "${e.role}": End date is before start date` });
                }
                const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
                if (months < 1) {
                    warnings.push({ type: 'timeline', text: `Experience "${e.role}": Duration is less than 1 month` });
                }
            }
        });

        // Education timeline
        edu.forEach((e, i) => {
            if (!e.degree && !e.institute) {
                errors.push({ type: 'education', text: `Education #${i + 1}: Degree and institute are empty` });
            }
            if (e.startYear && e.endYear && parseInt(e.endYear) < parseInt(e.startYear)) {
                errors.push({ type: 'timeline', text: `Education "${e.degree}": End year is before start year` });
            }
        });

        // Duplicate skills
        const skills = resume.skills || [];
        const lower = skills.map(s => s.toLowerCase());
        const dupes = skills.filter((s, i) => lower.indexOf(s.toLowerCase()) !== i);
        if (dupes.length > 0) {
            warnings.push({ type: 'skills', text: `Duplicate skills found: ${dupes.join(', ')}` });
        }

        // Missing sections
        const sections = {
            summary: !!p.summary,
            experience: exp.length > 0,
            education: edu.length > 0,
            skills: skills.length > 0,
            projects: (resume.projects || []).length > 0
        };
        const missing = Object.entries(sections).filter(([, v]) => !v).map(([k]) => k);
        if (missing.length > 0) {
            suggestions.push({ type: 'missing', text: `Missing sections: ${missing.join(', ')}` });
        }

        // Empty fields
        if (p.fullName && p.fullName.trim() === '') {
            errors.push({ type: 'empty', text: 'Full name is empty' });
        }
        if (p.summary && p.summary.trim().length < 20) {
            warnings.push({ type: 'summary', text: 'Professional summary is too short (aim for 2-4 sentences)' });
        }

        // Calculate score
        const maxChecks = 15;
        let passed = maxChecks - errors.length - Math.ceil(warnings.length / 2);
        const score = Math.max(0, Math.round((passed / maxChecks) * 100));
        const completion = Math.round(((maxChecks - errors.length) / maxChecks) * 100);

        return { errors, warnings, suggestions, score, completion, sections };
    },

    renderResults(resume, results) {
        const scoreColor = results.score >= 80 ? 'var(--success)' : results.score >= 60 ? 'var(--warning)' : 'var(--danger)';

        openModal('Resume Verification', `
            <div>
                <!-- Score Ring -->
                <div style="display:flex;align-items:center;gap:20px;margin-bottom:20px;">
                    <div style="position:relative;width:100px;height:100px;flex-shrink:0;">
                        <svg viewBox="0 0 120 120" style="width:100%;height:100%;transform:rotate(-90deg);">
                            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border-color)" stroke-width="8"/>
                            <circle cx="60" cy="60" r="50" fill="none" stroke="${scoreColor}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${Math.PI * 100}" stroke-dashoffset="${Math.PI * 100 * (1 - results.score / 100)}"/>
                        </svg>
                        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                            <span style="font-size:28px;font-weight:800;">${results.score}</span>
                            <span style="font-size:10px;color:var(--text-tertiary);">/ 100</span>
                        </div>
                    </div>
                    <div>
                        <div style="font-size:16px;font-weight:700;">Verification Score</div>
                        <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">Completion: ${results.completion}%</div>
                        <div style="display:flex;gap:10px;margin-top:8px;font-size:11px;">
                            <span style="color:var(--danger);"><i class="fas fa-times-circle"></i> ${results.errors.length} Errors</span>
                            <span style="color:var(--warning);"><i class="fas fa-exclamation-triangle"></i> ${results.warnings.length} Warnings</span>
                            <span style="color:var(--accent);"><i class="fas fa-lightbulb"></i> ${results.suggestions.length} Tips</span>
                        </div>
                    </div>
                </div>

                <!-- Section Status -->
                <div style="margin-bottom:16px;">
                    <div style="font-size:12px;font-weight:600;margin-bottom:8px;">Section Status</div>
                    <div style="display:flex;flex-wrap:wrap;gap:6px;">
                        ${Object.entries(results.sections).map(([name, present]) => `
                            <span style="padding:4px 10px;border-radius:var(--radius-full);font-size:11px;background:${present ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'};color:${present ? 'var(--success)' : 'var(--danger)'};">
                                <i class="fas ${present ? 'fa-check' : 'fa-times'}"></i> ${name}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <!-- Errors -->
                ${results.errors.length > 0 ? `
                    <div style="margin-bottom:12px;">
                        <div style="font-size:12px;font-weight:600;color:var(--danger);margin-bottom:6px;">❌ Errors</div>
                        ${results.errors.map(e => `<div style="padding:6px 10px;background:rgba(239,68,68,0.05);border-radius:var(--radius-sm);font-size:11px;margin-bottom:4px;border-left:3px solid var(--danger);">${e.text}</div>`).join('')}
                    </div>
                ` : ''}

                <!-- Warnings -->
                ${results.warnings.length > 0 ? `
                    <div style="margin-bottom:12px;">
                        <div style="font-size:12px;font-weight:600;color:var(--warning);margin-bottom:6px;">⚠️ Warnings</div>
                        ${results.warnings.map(w => `<div style="padding:6px 10px;background:rgba(245,158,11,0.05);border-radius:var(--radius-sm);font-size:11px;margin-bottom:4px;border-left:3px solid var(--warning);">${w.text}</div>`).join('')}
                    </div>
                ` : ''}

                <!-- Suggestions -->
                ${results.suggestions.length > 0 ? `
                    <div>
                        <div style="font-size:12px;font-weight:600;color:var(--accent);margin-bottom:6px;">💡 Suggestions</div>
                        ${results.suggestions.map(s => `<div style="padding:6px 10px;background:rgba(59,130,246,0.05);border-radius:var(--radius-sm);font-size:11px;margin-bottom:4px;border-left:3px solid var(--accent);">${s.text}</div>`).join('')}
                    </div>
                ` : ''}

                ${results.errors.length === 0 && results.warnings.length === 0 ? `
                    <div style="text-align:center;padding:16px;">
                        <i class="fas fa-check-circle" style="font-size:32px;color:var(--success);"></i>
                        <div style="font-weight:600;margin-top:8px;">Resume Looks Great!</div>
                        <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">No issues found. Your resume is ready to send.</div>
                    </div>
                ` : ''}
            </div>
        `, `<button class="btn btn-primary" onclick="closeModal()">Done</button>`);
    }
};

window.ResumeVerification = ResumeVerification;
