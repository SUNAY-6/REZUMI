/* ============================================
   REZUMI - Utility Functions
   ============================================ */

// Toast notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Modal functions
function openModal(title, bodyHTML, footerHTML = '') {
    const overlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');
    
    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.innerHTML = bodyHTML;
    if (modalFooter) modalFooter.innerHTML = footerHTML;
    if (overlay) overlay.classList.add('active');
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('active');
}

// Settings page functions
function initSettingsPage() {
    ThemeManager.updateSettingsUI();
    
    // Update analytics
    const analytics = Storage.getAnalytics();
    const resumesEl = document.getElementById('analytics-resumes');
    const downloadsEl = document.getElementById('analytics-downloads');
    const atsEl = document.getElementById('analytics-ats');
    
    if (resumesEl) resumesEl.textContent = analytics.resumesCreated || 0;
    if (downloadsEl) downloadsEl.textContent = analytics.downloads || 0;
    if (atsEl) atsEl.textContent = analytics.bestAtsScore || '--';
}

function exportAllData() {
    const data = Storage.exportAllData();
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, 'rezumi-backup.json', 'application/json');
    showToast('Data exported successfully!', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                Storage.importAllData(data);
                showToast('Data imported successfully!', 'success');
                navigateTo('home');
            } catch (err) {
                showToast('Invalid backup file', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        if (confirm('This will delete ALL profiles, resumes, education, experience, skills, projects, and settings. Continue?')) {
            Storage.clearAll();
            showToast('All data cleared', 'info');
            navigateTo('home');
        }
    }
}

// Utility: Format date
function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Utility: Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility: Generate random color
function randomColor() {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Utility: Validate URL
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Utility: Validate email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + N = New resume
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            navigateTo('quick-resume');
        }
        // Ctrl/Cmd + S = Save (auto-save indicator)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            showToast('Auto-saved!', 'success');
        }
        // Ctrl/Cmd + E = Export
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            if (currentPage === 'preview') {
                exportResume('pdf');
            }
        }
    });
}
