/* ============================================
   REZUMI - Navigation
   ============================================ */

let currentPage = 'home';

function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.classList.add('page-transition-enter');
        setTimeout(() => targetPage.classList.remove('page-transition-enter'), 400);
    }
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === page);
    });
    
    currentPage = page;
    
    // Page-specific init
    switch(page) {
        case 'home':
            initHomePage();
            break;
        case 'quick-resume':
            initBuilderPage();
            break;
        case 'manual-builder':
            initManualBuilder();
            break;
        case 'ai-builder':
            initAIBuilder();
            break;
        case 'templates':
            initTemplatesPage();
            break;
        case 'library':
            initLibraryPage();
            break;
        case 'preview':
            initPreviewPage();
            break;
        case 'settings':
            initSettingsPage();
            break;
        case 'recycle-bin':
            if (typeof RecycleBin !== 'undefined') {
                const rbContent = document.getElementById('recycle-bin-content');
                if (rbContent) RecycleBin.render();
            }
            break;
        case 'resume-battle':
            // Page is static; user clicks Start Battle to begin
            break;
        case 'portfolio-builder':
            // Page is static; user clicks Generate to begin
            break;
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Search functionality
function initSearch() {
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('global-search');
    
    if (searchToggle) {
        searchToggle.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput?.focus(), 100);
        });
    }
    
    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchOverlay?.classList.remove('active');
            closeModal();
        }
        // Open search with Ctrl+K or Cmd+K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchOverlay?.classList.add('active');
            setTimeout(() => searchInput?.focus(), 100);
        }
    });
    
    // Close on overlay click
    if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
            }
        });
    }
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });
    }
}

function performSearch(query) {
    const results = document.getElementById('search-results');
    if (!results) return;
    
    if (!query.trim()) {
        results.innerHTML = '';
        return;
    }
    
    const q = query.toLowerCase();
    const allResults = [];
    
    // Search profiles
    Storage.getProfiles().forEach(p => {
        if ((p.fullName || '').toLowerCase().includes(q) || (p.email || '').toLowerCase().includes(q)) {
            allResults.push({ type: 'profile', icon: 'fa-id-card', title: p.fullName, subtitle: p.email, action: () => navigateTo('library') });
        }
    });
    
    // Search projects
    Storage.getProjects().forEach(p => {
        if ((p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)) {
            allResults.push({ type: 'project', icon: 'fa-diagram-project', title: p.name, subtitle: p.techStack, action: () => navigateTo('library') });
        }
    });
    
    // Search experience
    Storage.getExperience().forEach(e => {
        if ((e.company || '').toLowerCase().includes(q) || (e.role || '').toLowerCase().includes(q)) {
            allResults.push({ type: 'experience', icon: 'fa-briefcase', title: e.role, subtitle: e.company, action: () => navigateTo('library') });
        }
    });
    
    // Navigation items
    const navItems = [
        { title: 'Home', icon: 'fa-home', action: () => navigateTo('home') },
        { title: 'Quick Resume', icon: 'fa-bolt', action: () => navigateTo('quick-resume') },
        { title: 'AI Builder', icon: 'fa-wand-magic-sparkles', action: () => navigateTo('ai-builder') },
        { title: 'Templates', icon: 'fa-palette', action: () => navigateTo('templates') },
        { title: 'Library', icon: 'fa-book', action: () => navigateTo('library') },
        { title: 'Settings', icon: 'fa-gear', action: () => navigateTo('settings') },
    ];
    
    navItems.forEach(item => {
        if (item.title.toLowerCase().includes(q)) {
            allResults.push({ ...item, type: 'nav' });
        }
    });
    
    // Render results
    if (allResults.length === 0) {
        results.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-tertiary);font-size:13px;">No results found</div>';
        return;
    }
    
    results.innerHTML = allResults.map(r => `
        <div class="search-result-item" onclick="handleSearchResult('${r.type}', '${r.title}')" style="display:flex;align-items:center;gap:12px;padding:12px 16px;cursor:pointer;border-radius:8px;transition:0.15s;">
            <i class="fas ${r.icon}" style="color:var(--accent);width:20px;text-align:center;"></i>
            <div>
                <div style="font-size:13px;font-weight:500;">${r.title}</div>
                ${r.subtitle ? `<div style="font-size:11px;color:var(--text-tertiary);">${r.subtitle}</div>` : ''}
            </div>
        </div>
    `).join('');
}

function handleSearchResult(type, title) {
    document.getElementById('search-overlay')?.classList.remove('active');
    
    switch(type) {
        case 'nav':
            const pageMap = { 'Home': 'home', 'Quick Resume': 'quick-resume', 'AI Builder': 'ai-builder', 'Templates': 'templates', 'Library': 'library', 'Settings': 'settings' };
            navigateTo(pageMap[title] || 'home');
            break;
        default:
            navigateTo('library');
    }
}

// Home page initialization
function initHomePage() {
    animateCounters();
    renderRecentResumes();
    updateResumeScore();
}

function animateCounters() {
    document.querySelectorAll('.stat-number[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const duration = 1500;
        const start = Date.now();
        
        function update() {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);
            
            el.textContent = current >= 1000 ? `${(current/1000).toFixed(0)}K+` : current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        update();
    });
}

function renderRecentResumes() {
    const list = document.getElementById('recent-resumes-list');
    if (!list) return;
    
    const resumes = Storage.getResumes().slice(-5).reverse();
    
    if (resumes.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fas fa-file-lines"></i></div>
                <h4>No resumes yet</h4>
                <p>Create your first resume to get started</p>
                <button class="btn btn-primary" onclick="navigateTo('quick-resume')">
                    <i class="fas fa-plus"></i> Create Resume
                </button>
            </div>
        `;
        return;
    }
    
    list.innerHTML = resumes.map(r => `
        <div class="library-item" style="margin-bottom:8px;cursor:pointer;" onclick="openResume('${r.id}')">
            <div class="library-item-icon"><i class="fas fa-file-alt"></i></div>
            <div class="library-item-info">
                <h4>${r.name || 'Untitled Resume'}</h4>
                <p>${new Date(r.createdAt).toLocaleDateString()} · ${r.template || 'Modern'}</p>
            </div>
            <div class="library-item-actions">
                <button onclick="event.stopPropagation();openResume('${r.id}')" title="View"><i class="fas fa-eye"></i></button>
                <button onclick="event.stopPropagation();Storage.moveToTrash('${r.id}');showToast('Moved to Recycle Bin','success');renderRecentResumes();updateTrashBadge();" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
    
    // Update score ring
    updateResumeScore();
}

function updateResumeScore() {
    const state = Storage.getCurrentResumeState();
    let score = 0;
    
    if (state.profileId) score += 20;
    if (state.educationIds && state.educationIds.length > 0) score += 20;
    if (state.experienceIds && state.experienceIds.length > 0) score += 15;
    if (state.skills && state.skills.length > 0) score += 15;
    if (state.projectIds && state.projectIds.length > 0) score += 15;
    if (state.certificationIds && state.certificationIds.length > 0) score += 10;
    if (state.templateId) score += 5;
    
    // Update ring
    const ring = document.querySelector('.score-ring-fill');
    if (ring) {
        const circumference = 2 * Math.PI * 85;
        const offset = circumference - (score / 100) * circumference;
        setTimeout(() => {
            ring.style.strokeDashoffset = offset;
        }, 500);
    }
    
    // Update number
    const scoreNum = document.querySelector('.score-number');
    if (scoreNum) {
        let current = 0;
        const interval = setInterval(() => {
            current += 2;
            if (current >= score) {
                current = score;
                clearInterval(interval);
            }
            scoreNum.textContent = current;
        }, 30);
    }
    
    // Update tips
    const tips = document.querySelector('.score-tips');
    if (tips) {
        tips.innerHTML = `
            <div class="tip-item">
                <i class="fas ${state.profileId ? 'fa-check-circle completed' : 'fa-circle incomplete'}"></i>
                <span>Personal details added</span>
            </div>
            <div class="tip-item">
                <i class="fas ${state.experienceIds?.length > 0 ? 'fa-check-circle completed' : 'fa-circle incomplete'}"></i>
                <span>Add work experience</span>
            </div>
            <div class="tip-item">
                <i class="fas ${state.skills?.length > 5 ? 'fa-check-circle completed' : 'fa-circle incomplete'}"></i>
                <span>Optimize for ATS (add 5+ skills)</span>
            </div>
        `;
    }
}

// ============================================
// MOBILE NAVIGATION
// ============================================
function initMobileNav() {
    const toggle = document.getElementById('mobile-nav-toggle');
    const panel = document.getElementById('mobile-nav-panel');
    
    if (!toggle || !panel) return;
    
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('active');
        
        // Update toggle icon
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.className = panel.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        }
    });
    
    // Close panel on outside click
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !toggle.contains(e.target)) {
            panel.classList.remove('active');
            const icon = toggle.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
    });
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('active')) {
            panel.classList.remove('active');
            const icon = toggle.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
    });
}

function mobileNavigate(page) {
    navigateTo(page);
    
    // Close mobile nav panel
    const panel = document.getElementById('mobile-nav-panel');
    const toggle = document.getElementById('mobile-nav-toggle');
    if (panel) panel.classList.remove('active');
    if (toggle) {
        const icon = toggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
    }
    
    // Update mobile nav active state
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === page);
    });
}

// Initialize mobile nav when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
}
