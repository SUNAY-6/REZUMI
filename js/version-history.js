/* ============================================
   REZUMI - Version History & Data Safety
   Undo, Redo, Version tracking, Backup
   ============================================ */

const VersionHistory = {
    maxVersions: 20,
    undoStack: [],
    redoStack: [],

    // Save a version snapshot
    saveVersion(resume) {
        if (!resume || !resume.id) return;
        
        const key = 'rezumi_versions_' + resume.id;
        const versions = Storage.get(key) || [];
        
        const snapshot = {
            data: JSON.parse(JSON.stringify(resume)),
            timestamp: Date.now(),
            label: 'Auto-save'
        };
        
        versions.unshift(snapshot);
        
        // Trim to max versions
        if (versions.length > this.maxVersions) {
            versions.splice(this.maxVersions);
        }
        
        Storage.set(key, versions);
    },

    // Get versions for a resume
    getVersions(resumeId) {
        return Storage.get('rezumi_versions_' + resumeId) || [];
    },

    // Restore a specific version
    restoreVersion(resumeId, versionIndex) {
        const versions = this.getVersions(resumeId);
        if (!versions[versionIndex]) return false;
        
        const snapshot = versions[versionIndex];
        const resume = JSON.parse(JSON.stringify(snapshot.data));
        resume.id = resumeId; // Keep same ID
        Storage.saveResume(resume);
        
        // Update current data
        currentResumeData = resume;
        
        // Save as new version
        this.saveVersion(resume);
        
        return true;
    },

    // Undo support
    pushState(state) {
        this.undoStack.push(JSON.parse(JSON.stringify(state)));
        this.redoStack = []; // Clear redo on new action
        if (this.undoStack.length > 30) this.undoStack.shift();
    },

    undo() {
        if (this.undoStack.length === 0) {
            showToast('Nothing to undo', 'info');
            return null;
        }
        const state = this.undoStack.pop();
        if (currentResumeData) {
            this.redoStack.push(JSON.parse(JSON.stringify(currentResumeData)));
        }
        return state;
    },

    redo() {
        if (this.redoStack.length === 0) {
            showToast('Nothing to redo', 'info');
            return null;
        }
        const state = this.redoStack.pop();
        if (currentResumeData) {
            this.undoStack.push(JSON.parse(JSON.stringify(currentResumeData)));
        }
        return state;
    },

    // Open version history viewer
    open() {
        const resume = currentResumeData || Storage.getResumes().slice(-1)[0];
        if (!resume) {
            showToast('No resume to show history for', 'error');
            return;
        }

        const versions = this.getVersions(resume.id);

        openModal('Version History', `
            <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <div>
                        <div style="font-size:14px;font-weight:600;">${resume.name || 'Resume'}</div>
                        <div style="font-size:11px;color:var(--text-tertiary);">${versions.length} version(s) saved</div>
                    </div>
                    <div style="display:flex;gap:6px;">
                        <button class="btn btn-glass btn-sm" onclick="VersionHistory.undoAction()" title="Undo (Ctrl+Z)">
                            <i class="fas fa-undo"></i> Undo
                        </button>
                        <button class="btn btn-glass btn-sm" onclick="VersionHistory.redoAction()" title="Redo (Ctrl+Y)">
                            <i class="fas fa-redo"></i> Redo
                        </button>
                    </div>
                </div>

                ${versions.length === 0 ? `
                    <div style="text-align:center;padding:30px;">
                        <i class="fas fa-clock-rotate-left" style="font-size:32px;color:var(--text-muted);margin-bottom:10px;"></i>
                        <div style="font-size:13px;font-weight:600;">No Versions Yet</div>
                        <div style="font-size:11px;color:var(--text-secondary);margin-top:4px;">Versions are saved automatically when you make changes.</div>
                    </div>
                ` : `
                    <div style="max-height:350px;overflow-y:auto;">
                        ${versions.map((v, i) => `
                            <div style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:var(--bg-card);border-radius:var(--radius-sm);margin-bottom:6px;border:1px solid var(--border-color);">
                                <div style="width:32px;height:32px;border-radius:50%;background:${i === 0 ? 'var(--accent-subtle)' : 'var(--bg-card)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    <i class="fas ${i === 0 ? 'fa-star' : 'fa-clock'}" style="font-size:12px;color:${i === 0 ? 'var(--accent)' : 'var(--text-muted)'};"></i>
                                </div>
                                <div style="flex:1;">
                                    <div style="font-size:12px;font-weight:600;">${i === 0 ? 'Current Version' : 'Version ' + (versions.length - i)}</div>
                                    <div style="font-size:10px;color:var(--text-tertiary);">${this.formatTime(v.timestamp)} · ${v.label || 'Auto-save'}</div>
                                </div>
                                ${i > 0 ? `
                                    <button class="btn btn-glass btn-sm" onclick="VersionHistory.restore('${resume.id}', ${i})" style="font-size:10px;">
                                        <i class="fas fa-rotate-left"></i> Restore
                                    </button>
                                ` : '<span style="font-size:10px;color:var(--success);font-weight:600;">Active</span>'}
                            </div>
                        `).join('')}
                    </div>
                `}

                <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border-color);">
                    <div style="font-size:12px;font-weight:600;margin-bottom:8px;">Backup & Restore</div>
                    <div style="display:flex;gap:8px;">
                        <button class="btn btn-glass btn-sm" onclick="VersionHistory.backupAll()"><i class="fas fa-download"></i> Backup All</button>
                        <button class="btn btn-glass btn-sm" onclick="VersionHistory.importBackup()"><i class="fas fa-upload"></i> Restore Backup</button>
                    </div>
                </div>
            </div>
        `, `<button class="btn btn-primary" onclick="closeModal()">Close</button>`);
    },

    restore(resumeId, versionIndex) {
        if (this.restoreVersion(resumeId, versionIndex)) {
            if (typeof renderResumePreview === 'function') renderResumePreview();
            showToast('Version restored!', 'success');
            this.open(); // Refresh modal
        }
    },

    undoAction() {
        const state = this.undo();
        if (state) {
            currentResumeData = state;
            if (typeof renderResumePreview === 'function') renderResumePreview();
            showToast('Undone!', 'success');
        }
    },

    redoAction() {
        const state = this.redo();
        if (state) {
            currentResumeData = state;
            if (typeof renderResumePreview === 'function') renderResumePreview();
            showToast('Redone!', 'success');
        }
    },

    backupAll() {
        const backup = {
            version: '2.0',
            timestamp: Date.now(),
            app: 'REZUMI',
            profiles: Storage.getProfiles(),
            education: Storage.getEducation(),
            experience: Storage.getExperience(),
            skills: Storage.getSkills(),
            projects: Storage.getProjects(),
            certifications: Storage.getCertifications(),
            achievements: Storage.getAchievements(),
            resumes: Storage.getResumes(),
            settings: Storage.getSettings()
        };

        downloadFile(JSON.stringify(backup, null, 2), 'rezumi_backup_' + new Date().toISOString().slice(0, 10) + '.json', 'application/json');
        showToast('Backup downloaded!', 'success');
    },

    importBackup() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    
                    if (data.profiles) data.profiles.forEach(p => Storage.saveProfile(p));
                    if (data.education) data.education.forEach(e => Storage.saveEducation(e));
                    if (data.experience) data.experience.forEach(e => Storage.saveExperience(e));
                    if (data.skills) Storage.saveSkills(data.skills);
                    if (data.projects) data.projects.forEach(p => Storage.saveProject(p));
                    if (data.certifications) data.certifications.forEach(c => Storage.saveCertification(c));
                    if (data.achievements) data.achievements.forEach(a => Storage.saveAchievement(a));
                    if (data.resumes) data.resumes.forEach(r => Storage.saveResume(r));
                    
                    showToast('Backup restored successfully!', 'success');
                    closeModal();
                } catch (err) {
                    showToast('Invalid backup file', 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'just now';
        if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
        if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
};

window.VersionHistory = VersionHistory;
