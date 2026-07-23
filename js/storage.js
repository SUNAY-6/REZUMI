/* ============================================
   REZUMI - Storage Module
   ============================================ */

const Storage = {
    KEYS: {
        PROFILES: 'rezumi_profiles',
        EDUCATION: 'rezumi_education',
        EXPERIENCE: 'rezumi_experience',
        SKILLS: 'rezumi_skills',
        PROJECTS: 'rezumi_projects',
        CERTIFICATIONS: 'rezumi_certifications',
        ACHIEVEMENTS: 'rezumi_achievements',
        INTERNSHIPS: 'rezumi_internships',
        LANGUAGES: 'rezumi_languages',
        HOBBIES: 'rezumi_hobbies',
        RESUMES: 'rezumi_resumes',
        SETTINGS: 'rezumi_settings',
        ANALYTICS: 'rezumi_analytics',
        CURRENT_RESUME: 'rezumi_current_resume',
    },

    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Storage get error:', e);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Storage remove error:', e);
        }
    },

    // Profiles
    getProfiles() {
        return this.get(this.KEYS.PROFILES) || [];
    },

    saveProfile(profile) {
        const profiles = this.getProfiles();
        if (profile.id) {
            const idx = profiles.findIndex(p => p.id === profile.id);
            if (idx >= 0) profiles[idx] = profile;
            else profiles.push(profile);
        } else {
            profile.id = this.generateId();
            profile.createdAt = Date.now();
            profiles.push(profile);
        }
        this.set(this.KEYS.PROFILES, profiles);
        return profile;
    },

    deleteProfile(id) {
        const profiles = this.getProfiles().filter(p => p.id !== id);
        this.set(this.KEYS.PROFILES, profiles);
    },

    // Education
    getEducation() {
        return this.get(this.KEYS.EDUCATION) || [];
    },

    saveEducation(edu) {
        const items = this.getEducation();
        if (edu.id) {
            const idx = items.findIndex(e => e.id === edu.id);
            if (idx >= 0) items[idx] = edu;
            else items.push(edu);
        } else {
            edu.id = this.generateId();
            items.push(edu);
        }
        this.set(this.KEYS.EDUCATION, items);
        return edu;
    },

    deleteEducation(id) {
        const items = this.getEducation().filter(e => e.id !== id);
        this.set(this.KEYS.EDUCATION, items);
    },

    // Experience
    getExperience() {
        return this.get(this.KEYS.EXPERIENCE) || [];
    },

    saveExperience(exp) {
        const items = this.getExperience();
        if (exp.id) {
            const idx = items.findIndex(e => e.id === exp.id);
            if (idx >= 0) items[idx] = exp;
            else items.push(exp);
        } else {
            exp.id = this.generateId();
            items.push(exp);
        }
        this.set(this.KEYS.EXPERIENCE, items);
        return exp;
    },

    deleteExperience(id) {
        const items = this.getExperience().filter(e => e.id !== id);
        this.set(this.KEYS.EXPERIENCE, items);
    },

    // Skills
    getSkills() {
        return this.get(this.KEYS.SKILLS) || [];
    },

    saveSkills(skills) {
        this.set(this.KEYS.SKILLS, skills);
    },

    // Projects
    getProjects() {
        return this.get(this.KEYS.PROJECTS) || [];
    },

    saveProject(project) {
        const items = this.getProjects();
        if (project.id) {
            const idx = items.findIndex(p => p.id === project.id);
            if (idx >= 0) items[idx] = project;
            else items.push(project);
        } else {
            project.id = this.generateId();
            items.push(project);
        }
        this.set(this.KEYS.PROJECTS, items);
        return project;
    },

    deleteProject(id) {
        const items = this.getProjects().filter(p => p.id !== id);
        this.set(this.KEYS.PROJECTS, items);
    },

    // Certifications
    getCertifications() {
        return this.get(this.KEYS.CERTIFICATIONS) || [];
    },

    saveCertification(cert) {
        const items = this.getCertifications();
        if (cert.id) {
            const idx = items.findIndex(c => c.id === cert.id);
            if (idx >= 0) items[idx] = cert;
            else items.push(cert);
        } else {
            cert.id = this.generateId();
            items.push(cert);
        }
        this.set(this.KEYS.CERTIFICATIONS, items);
        return cert;
    },

    deleteCertification(id) {
        const items = this.getCertifications().filter(c => c.id !== id);
        this.set(this.KEYS.CERTIFICATIONS, items);
    },

    // Achievements
    getAchievements() {
        return this.get(this.KEYS.ACHIEVEMENTS) || [];
    },

    saveAchievement(ach) {
        const items = this.getAchievements();
        if (ach.id) {
            const idx = items.findIndex(a => a.id === ach.id);
            if (idx >= 0) items[idx] = ach;
            else items.push(ach);
        } else {
            ach.id = this.generateId();
            items.push(ach);
        }
        this.set(this.KEYS.ACHIEVEMENTS, items);
        return ach;
    },

    // Resumes
    getResumes() {
        return this.get(this.KEYS.RESUMES) || [];
    },

    saveResume(resume) {
        const resumes = this.getResumes();
        if (resume.id) {
            const idx = resumes.findIndex(r => r.id === resume.id);
            if (idx >= 0) resumes[idx] = resume;
            else resumes.push(resume);
        } else {
            resume.id = this.generateId();
            resume.createdAt = Date.now();
            resumes.push(resume);
        }
        this.set(this.KEYS.RESUMES, resumes);
        return resume;
    },

    deleteResume(id) {
        const resumes = this.getResumes().filter(r => r.id !== id);
        this.set(this.KEYS.RESUMES, resumes);
    },

    // Settings
    getSettings() {
        return this.get(this.KEYS.SETTINGS) || {
            theme: 'dark',
            accentColor: 'blue',
            pinLock: false,
            biometric: false
        };
    },

    saveSettings(settings) {
        this.set(this.KEYS.SETTINGS, settings);
    },

    // Analytics
    getAnalytics() {
        return this.get(this.KEYS.ANALYTICS) || {
            resumesCreated: 0,
            downloads: 0,
            bestAtsScore: 0
        };
    },

    incrementAnalytics(key, value = 1) {
        const analytics = this.getAnalytics();
        analytics[key] = (analytics[key] || 0) + value;
        this.set(this.KEYS.ANALYTICS, analytics);
    },

    // Current Resume Builder State
    getCurrentResumeState() {
        return this.get(this.KEYS.CURRENT_RESUME) || {
            step: 1,
            profileId: null,
            educationIds: [],
            experienceIds: [],
            skills: [],
            projectIds: [],
            certificationIds: [],
            achievementIds: [],
            internshipIds: [],
            languages: [],
            hobbies: [],
            templateId: 'modern',
            customization: {
                accentColor: '#2563eb',
                fontSize: 12,
                spacing: 'normal',
                showIcons: true,
                showPhoto: false,
                columns: 'auto'
            }
        };
    },

    saveCurrentResumeState(state) {
        this.set(this.KEYS.CURRENT_RESUME, state);
    },

    // Utility
    generateId() {
        return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Export all data
    exportAllData() {
        const data = {};
        Object.values(this.KEYS).forEach(key => {
            data[key] = this.get(key);
        });
        return data;
    },

    // Import data
    importAllData(data) {
        Object.keys(data).forEach(key => {
            if (Object.values(this.KEYS).includes(key)) {
                this.set(key, data[key]);
            }
        });
    },

    // Clear all data
    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            this.remove(key);
        });
    }
};
