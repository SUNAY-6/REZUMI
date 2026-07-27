/* ============================================
   REZUMI - Desktop Hover Action Icons
   Elegant action buttons on hover for lists
   ============================================ */

const ActionIcons = {
    init() {
        this.bindAll();
    },

    bindAll() {
        document.querySelectorAll('.library-item, .profile-card, .template-card, .checkbox-item').forEach(item => {
            if (item.dataset.actionBound) return;
            item.dataset.actionBound = 'true';
            
            item.addEventListener('mouseenter', () => this.showActions(item));
            item.addEventListener('mouseleave', () => this.hideActions(item));
        });
    },

    showActions(item) {
        // Only on desktop (hover-capable)
        if (window.matchMedia('(hover: none)').matches) return;
        
        // Skip items that already have inline action buttons (like library items)
        if (item.querySelector('.library-item-actions')) return;
        
        // Remove existing actions
        item.querySelectorAll('.hover-actions').forEach(a => a.remove());
        
        const actions = this.getActions(item);
        if (actions.length === 0) return;
        
        const container = document.createElement('div');
        container.className = 'hover-actions';
        container.innerHTML = actions.map(a => `
            <button class="hover-action-btn" onclick="event.stopPropagation(); ${a.action}" title="${a.label}">
                <i class="${a.icon}"></i>
            </button>
        `).join('');
        
        item.style.position = 'relative';
        item.appendChild(container);
    },

    hideActions(item) {
        item.querySelectorAll('.hover-actions').forEach(a => {
            a.style.opacity = '0';
            setTimeout(() => a.remove(), 150);
        });
    },

    getActions(item) {
        const actions = [];
        const resumeId = item.dataset?.resumeId;
        const profileId = item.querySelector?.('[onclick*="selectProfile"]') ? item.onclick?.toString() : null;
        
        // Context-aware actions
        if (item.closest('#recent-resumes-list') || item.closest('[id*="resume"]')) {
            actions.push({ icon: 'fas fa-eye', label: 'Preview', action: `openResume('${resumeId || ''}')` });
            actions.push({ icon: 'fas fa-pen', label: 'Edit', action: `openResume('${resumeId || ''}')` });
            actions.push({ icon: 'fas fa-copy', label: 'Duplicate', action: `ActionIcons.duplicateResume('${resumeId || ''}')` });
            actions.push({ icon: 'fas fa-heart', label: 'Favorite', action: `ActionIcons.toggleFavorite('${resumeId || ''}')` });
            actions.push({ icon: 'fas fa-share-nodes', label: 'Share', action: `ActionIcons.shareResume('${resumeId || ''}')` });
            actions.push({ icon: 'fas fa-trash', label: 'Delete', action: `ActionIcons.deleteResume('${resumeId || ''}')` });
        } else if (item.classList.contains('profile-card')) {
            actions.push({ icon: 'fas fa-pen', label: 'Edit', action: 'showToast("Edit profile", "info")' });
            actions.push({ icon: 'fas fa-copy', label: 'Duplicate', action: 'showToast("Profile duplicated", "success")' });
            actions.push({ icon: 'fas fa-heart', label: 'Favorite', action: 'showToast("Added to favorites", "success")' });
            actions.push({ icon: 'fas fa-trash', label: 'Delete', action: 'showToast("Profile deleted", "info")' });
        } else if (item.classList.contains('template-card')) {
            actions.push({ icon: 'fas fa-eye', label: 'Preview', action: item.getAttribute('onclick')?.replace('previewTemplate', 'previewTemplate') || '' });
            actions.push({ icon: 'fas fa-heart', label: 'Favorite', action: 'showToast("Template favorited", "success")' });
        }
        
        return actions;
    },

    duplicateResume(id) {
        const resume = Storage.getResumes().find(r => r.id === id);
        if (!resume) return;
        
        const dup = JSON.parse(JSON.stringify(resume));
        dup.id = Storage.generateId();
        dup.name = (dup.name || 'Resume') + ' (Copy)';
        dup.createdAt = Date.now();
        Storage.saveResume(dup);
        
        showToast('Resume duplicated!', 'success');
        if (typeof renderRecentResumes === 'function') renderRecentResumes();
    },

    toggleFavorite(id) {
        const resume = Storage.getResumes().find(r => r.id === id);
        if (!resume) return;
        
        resume.favorited = !resume.favorited;
        Storage.saveResume(resume);
        
        showToast(resume.favorited ? 'Added to favorites ❤️' : 'Removed from favorites', 'success');
    },

    shareResume(id) {
        const resume = Storage.getResumes().find(r => r.id === id);
        if (!resume) return;
        
        if (navigator.share) {
            navigator.share({ title: resume.name || 'My Resume', text: 'Built with REZUMI' });
        } else {
            const data = JSON.stringify(resume);
            navigator.clipboard.writeText(data).then(() => showToast('Resume data copied!', 'success'));
        }
    },

    deleteResume(id) {
        if (typeof SwipeActions !== 'undefined' && SwipeActions.handleDelete) {
            const item = document.querySelector(`.swipe-item[data-resume-id="${id}"]`);
            SwipeActions.handleDelete(id, item || document.createElement('div'));
        } else if (confirm('Move this resume to Recycle Bin?')) {
            Storage.moveToTrash(id);
            showToast('Moved to Recycle Bin', 'success');
            if (typeof renderRecentResumes === 'function') renderRecentResumes();
        }
    }
};

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Delay init slightly for dynamic content
        setTimeout(() => ActionIcons.init(), 1000);
    });
}

window.ActionIcons = ActionIcons;
