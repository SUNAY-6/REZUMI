/* ============================================
   REZUMI - Smart Hyperlink System
   Auto-detect and validate URLs, make clickable
   ============================================ */

const HyperlinkSystem = {
    patterns: {
        linkedin: { regex: /linkedin\.com\/in\/[\w-]+/i, icon: 'fab fa-linkedin', label: 'LinkedIn' },
        github: { regex: /github\.com\/[\w-]+/i, icon: 'fab fa-github', label: 'GitHub' },
        portfolio: { regex: /portfolio|personal\.site|\.dev|\.me/i, icon: 'fas fa-globe', label: 'Portfolio' },
        leetcode: { regex: /leetcode\.com/i, icon: 'fas fa-code', label: 'LeetCode' },
        twitter: { regex: /twitter\.com|x\.com/i, icon: 'fab fa-twitter', label: 'Twitter' },
        email: { regex: /^[\w.-]+@[\w.-]+\.\w+$/, icon: 'fas fa-envelope', label: 'Email' },
        phone: { regex: /^\+?[\d\s\-()]{7,20}$/, icon: 'fas fa-phone', label: 'Phone' },
        website: { regex: /^https?:\/\/.+/i, icon: 'fas fa-link', label: 'Website' }
    },

    // Detect link type from URL
    detect(url) {
        if (!url) return null;
        for (const [type, pattern] of Object.entries(this.patterns)) {
            if (pattern.regex.test(url)) {
                return { type, icon: pattern.icon, label: pattern.label, url: this.normalize(url, type) };
            }
        }
        return { type: 'website', icon: 'fas fa-link', label: 'Website', url };
    },

    // Normalize URL
    normalize(url, type) {
        if (type === 'email') return 'mailto:' + url;
        if (type === 'phone') return 'tel:' + url.replace(/[^\d+]/g, '');
        if (!url.startsWith('http') && type !== 'email' && type !== 'phone') return 'https://' + url;
        return url;
    },

    // Validate URL
    validate(url) {
        if (!url) return { valid: false, error: 'Empty URL' };
        
        const detected = this.detect(url);
        
        if (detected.type === 'email') {
            const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
            return { valid: emailRegex.test(url), error: emailRegex.test(url) ? null : 'Invalid email format' };
        }
        
        if (detected.type === 'phone') {
            const digits = url.replace(/[^\d]/g, '');
            return { valid: digits.length >= 7 && digits.length <= 15, error: digits.length >= 7 ? null : 'Phone number too short' };
        }
        
        try {
            const normalized = this.normalize(url, detected.type);
            new URL(normalized);
            return { valid: true, error: null };
        } catch {
            return { valid: false, error: 'Invalid URL format' };
        }
    },

    // Generate clickable HTML for a link
    renderLink(url, label) {
        const detected = this.detect(url);
        if (!detected) return `<span>${url}</span>`;
        
        const href = this.normalize(url, detected.type);
        return `<a href="${href}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:4px;color:var(--accent);text-decoration:none;" title="${detected.label}: ${url}"><i class="${detected.icon}"></i><span>${label || detected.label}</span></a>`;
    },

    // Generate link icon badge
    renderIcon(url) {
        const detected = this.detect(url);
        if (!detected) return '';
        return `<span class="link-icon-badge" title="${detected.label}"><i class="${detected.icon}"></i></span>`;
    },

    // Validate all links in a resume
    validateResume(resume) {
        const p = resume.profile || {};
        const issues = [];
        
        const links = {
            'Email': p.email,
            'LinkedIn': p.linkedin,
            'GitHub': p.github,
            'Portfolio': p.portfolio
        };
        
        Object.entries(links).forEach(([label, url]) => {
            if (url) {
                const result = this.validate(url);
                if (!result.valid) {
                    issues.push({ label, url, error: result.error });
                }
            }
        });
        
        return issues;
    },

    // Enrich resume data with detected link info
    enrichLinks(resume) {
        if (!resume?.profile) return resume;
        const p = resume.profile;
        
        p._links = {};
        ['email', 'phone', 'linkedin', 'github', 'portfolio', 'leetcode'].forEach(field => {
            if (p[field]) {
                p._links[field] = this.detect(p[field]);
            }
        });
        
        return resume;
    }
};

window.HyperlinkSystem = HyperlinkSystem;
