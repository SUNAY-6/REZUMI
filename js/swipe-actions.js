/* ============================================
   REZUMI - Swipe Actions for Resume Lists
   Left swipe = Edit, Right swipe = Delete
   ============================================ */

const SwipeActions = {
    activeItem: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    isDragging: false,
    threshold: 60,

    init() {
        // Apply swipe to all swipeable items
        this.bindAll();
        
        // Close other items on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.swipe-item')) {
                this.resetAll();
            }
        });
    },

    bindAll() {
        document.querySelectorAll('.swipe-item').forEach(item => {
            if (item.dataset.swipeBound) return;
            item.dataset.swipeBound = 'true';
            this.bindItem(item);
        });
    },

    bindItem(item) {
        const content = item.querySelector('.swipe-item-content');
        if (!content) return;

        // Touch events
        content.addEventListener('touchstart', (e) => this.onStart(e, content), { passive: true });
        content.addEventListener('touchmove', (e) => this.onMove(e, content), { passive: false });
        content.addEventListener('touchend', (e) => this.onEnd(e, content));

        // Mouse events (desktop testing)
        content.addEventListener('mousedown', (e) => this.onStart(e, content));
        content.addEventListener('mousemove', (e) => this.onMove(e, content));
        content.addEventListener('mouseup', (e) => this.onEnd(e, content));
        content.addEventListener('mouseleave', (e) => this.onEnd(e, content));
    },

    onStart(e, content) {
        this.activeItem = content;
        this.startX = e.touches ? e.touches[0].clientX : e.clientX;
        this.startY = e.touches ? e.touches[0].clientY : e.clientY;
        this.currentX = 0;
        this.isDragging = false;
        content.classList.add('swiping');
        content.classList.remove('snap-back');
    },

    onMove(e, content) {
        if (!this.activeItem || this.activeItem !== content) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const deltaX = clientX - this.startX;
        const deltaY = clientY - this.startY;

        // Only horizontal swipe
        if (!this.isDragging && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
            this.isDragging = true;
            if (e.cancelable) e.preventDefault();
        }

        if (this.isDragging) {
            if (e.cancelable) e.preventDefault();
            
            // Clamp the translation
            const clampedX = Math.max(-100, Math.min(100, deltaX));
            content.style.transform = `translateX(${clampedX}px)`;
            this.currentX = clampedX;
        }
    },

    onEnd(e, content) {
        if (!this.activeItem || this.activeItem !== content) return;
        
        content.classList.remove('swiping');
        content.classList.add('snap-back');

        if (this.isDragging) {
            const id = content.closest('.swipe-item')?.dataset.resumeId;
            
            if (this.currentX < -this.threshold) {
                // Swipe left → Edit
                content.style.transform = 'translateX(0)';
                content.classList.add('snap-back');
                if (id) this.handleEdit(id);
            } else if (this.currentX > this.threshold) {
                // Swipe right → Delete (to trash)
                content.style.transform = 'translateX(0)';
                content.classList.add('snap-back');
                if (id) this.handleDelete(id, content.closest('.swipe-item'));
            } else {
                // Snap back
                content.style.transform = 'translateX(0)';
            }
        }

        this.activeItem = null;
        this.isDragging = false;
    },

    handleEdit(resumeId) {
        // Open resume in edit mode
        const resume = Storage.getResumes().find(r => r.id === resumeId);
        if (resume) {
            currentResumeData = resume;
            
            // Navigate to manual builder with the resume data loaded
            if (typeof manualData !== 'undefined') {
                manualData.profile = resume.profile || {};
                manualData.summary = resume.profile?.summary || '';
                manualData.experience = (resume.experience || []).map(e => ({...e}));
                manualData.education = (resume.education || []).map(e => ({...e}));
                manualData.skills = resume.skills || [];
                manualData.projects = (resume.projects || []).map(p => ({...p}));
                manualData.certifications = (resume.certifications || []).map(c => ({...c}));
                manualData.achievements = (resume.achievements || []).map(a => ({...a}));
                manualData.languages = (resume.languages || []).map(l => ({...l}));
                manualData.hobbies = resume.hobbies || '';
                manualData.template = resume.template || 'modern';
            }
            
            navigateTo('manual-builder');
            showToast('Resume loaded for editing', 'info');
        }
    },

    handleDelete(resumeId, itemElement) {
        // Show confirmation
        const overlay = document.createElement('div');
        overlay.className = 'swipe-confirm-overlay';
        overlay.innerHTML = `
            <div style="font-size:24px;"><i class="fas fa-trash-alt"></i></div>
            <div style="font-size:13px;font-weight:600;">Move to Recycle Bin?</div>
            <div style="font-size:11px;opacity:0.8;">You can restore this later</div>
            <div class="confirm-actions">
                <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white;" onclick="this.closest('.swipe-confirm-overlay').remove()">Cancel</button>
                <button class="btn btn-sm btn-primary" onclick="SwipeActions.confirmDelete('${resumeId}', this)">Delete</button>
            </div>
        `;
        
        itemElement.style.position = 'relative';
        itemElement.appendChild(overlay);
    },

    confirmDelete(resumeId, btn) {
        // Remove overlay
        btn.closest('.swipe-confirm-overlay')?.remove();
        
        // Move to trash
        Storage.moveToTrash(resumeId);
        
        // Remove from UI with animation
        const item = document.querySelector(`.swipe-item[data-resume-id="${resumeId}"]`);
        if (item) {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '0';
            item.style.transform = 'translateX(-100%)';
            item.style.maxHeight = '0';
            item.style.marginBottom = '0';
            item.style.padding = '0';
            setTimeout(() => item.remove(), 300);
        }
        
        showToast('Resume moved to Recycle Bin', 'success');
        
        // Update trash badge
        updateTrashBadge();
        
        // Refresh recent resumes list
        setTimeout(() => renderRecentResumes(), 350);
    },

    resetAll() {
        document.querySelectorAll('.swipe-item-content').forEach(c => {
            c.style.transform = 'translateX(0)';
            c.classList.add('snap-back');
        });
    }
};

// Recycle Bin functionality
const RecycleBin = {
    init() {
        updateTrashBadge();
    },

    render() {
        const content = document.getElementById('library-content');
        if (!content) return;
        
        const trash = Storage.getTrash();
        
        content.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <h3 style="font-size:16px;"><i class="fas fa-trash-alt" style="color:var(--danger);margin-right:8px;"></i>Recycle Bin (${trash.length})</h3>
                ${trash.length > 0 ? `
                    <button class="btn btn-danger btn-sm" onclick="RecycleBin.emptyAll()">
                        <i class="fas fa-trash"></i> Empty All
                    </button>
                ` : ''}
            </div>
            
            ${trash.length === 0 ? `
                <div class="library-empty-state">
                    <i class="fas fa-trash-alt"></i>
                    <h3>Recycle Bin is empty</h3>
                    <p>Deleted resumes will appear here. You can restore them anytime.</p>
                </div>
            ` : `
                <div class="library-list stagger-children">
                    ${trash.map(r => `
                        <div class="library-item">
                            <div class="library-item-icon" style="background:rgba(239,68,68,0.1);color:var(--danger);"><i class="fas fa-trash-restore"></i></div>
                            <div class="library-item-info">
                                <h4>${r.name || 'Untitled Resume'}</h4>
                                <p>Deleted ${timeAgo(r.deletedAt)} · Template: ${r.template || 'Modern'}</p>
                            </div>
                            <div class="library-item-actions">
                                <button onclick="RecycleBin.restore('${r.id}')" title="Restore"><i class="fas fa-undo"></i></button>
                                <button onclick="RecycleBin.permanentDelete('${r.id}')" title="Delete Forever"><i class="fas fa-times"></i></button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        `;
    },

    restore(id) {
        if (Storage.restoreFromTrash(id)) {
            showToast('Resume restored!', 'success');
            this.render();
            updateTrashBadge();
            if (typeof renderRecentResumes === 'function') renderRecentResumes();
        }
    },

    permanentDelete(id) {
        if (confirm('Permanently delete this resume? This cannot be undone.')) {
            Storage.permanentDelete(id);
            showToast('Permanently deleted', 'info');
            this.render();
            updateTrashBadge();
        }
    },

    emptyAll() {
        if (confirm('Empty the entire Recycle Bin? All deleted resumes will be permanently removed.')) {
            Storage.emptyTrash();
            showToast('Recycle Bin emptied', 'info');
            this.render();
            updateTrashBadge();
        }
    }
};

function updateTrashBadge() {
    const badge = document.getElementById('trash-badge');
    const count = Storage.getTrashCount();
    if (badge) {
        badge.textContent = count > 0 ? count : '';
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
}

function timeAgo(timestamp) {
    if (!timestamp) return 'recently';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    return Math.floor(seconds / 86400) + 'd ago';
}

// Initialize
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        SwipeActions.init();
        RecycleBin.init();
    });
}
