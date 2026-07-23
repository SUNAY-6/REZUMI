/* ============================================
   REZUMI - Interactive Website Tour Guide
   ============================================ */

const TourGuide = {
    currentStep: 0,
    isActive: false,
    overlay: null,
    tooltip: null,
    backdrop: null,

    steps: [
        {
            id: 'splash',
            title: '🚀 Welcome to REZUMI',
            description: 'When you first open REZUMI, you\'ll see a premium animated splash screen with our logo and tagline "AI Powered Resume Builder". This automatically transitions to the main app in about 3 seconds.',
            highlight: null,
            page: 'home',
            position: 'center'
        },
        {
            id: 'home',
            title: '🏠 Home Dashboard',
            description: 'This is your command center. Here you can see quick action cards, your resume score, recent resumes, and access all premium features. The hero section shows key stats and quick-start buttons.',
            highlight: '.hero-content',
            page: 'home',
            position: 'bottom'
        },
        {
            id: 'nav',
            title: '🧭 Navigation Bar',
            description: 'Use the top navigation to move between pages: Home, Quick Resume, Manual Builder, AI Builder, Templates, and Library. The search button (🔍) lets you search across all your data.',
            highlight: '.nav-center',
            page: 'home',
            position: 'bottom'
        },
        {
            id: 'quick-resume',
            title: '⚡ Quick Resume Builder',
            description: 'Our flagship feature! Create a complete resume in under 2 minutes. It walks you through 9 steps: Profile → Education → Experience → Skills → Projects → Certifications → Extra → Template → Review. All data is saved and reusable across multiple resumes.',
            highlight: '.action-card:nth-child(1)',
            page: 'home',
            position: 'right'
        },
        {
            id: 'manual-builder',
            title: '✍️ Manual Resume Builder',
            description: 'Prefer full control? The Manual Builder lets you create a resume from scratch with a split-screen editor. Edit every section on the left while seeing a live preview on the right. Switch between 30+ templates anytime.',
            highlight: '.action-card:nth-child(2)',
            page: 'home',
            position: 'right'
        },
        {
            id: 'ai-builder',
            title: '🤖 AI Resume Builder',
            description: 'Let AI do the heavy lifting! Enter your target job role, company, and experience level. The AI will analyze the job description, suggest optimized skills, rewrite your summary, and generate an ATS-friendly resume automatically.',
            highlight: '.ai-icon',
            page: 'home',
            position: 'right'
        },
        {
            id: 'templates',
            title: '🎨 30+ Premium Templates',
            description: 'Browse our collection of 30 professionally designed resume templates. Each shows a realistic preview with sample data so you know exactly how your resume will look. Categories include Modern, Minimal, Corporate, Creative, Developer, and ATS-Optimized.',
            highlight: '.action-card:nth-child(4)',
            page: 'home',
            position: 'right'
        },
        {
            id: 'custom-template',
            title: '📄 Custom Template Upload',
            description: 'Have your own template? In the Templates page, scroll to the bottom and click "Use Custom Template". Upload a DOCX file with placeholders like {{Name}}, {{Skills}}, {{Experience}} and REZUMI will auto-fill them with your data — like a mail merge!',
            highlight: '.action-card:nth-child(4)',
            page: 'home',
            position: 'right'
        },
        {
            id: 'library',
            title: '📚 Data Library',
            description: 'Your reusable data hub. Store personal profiles, education records, work experience, skills, projects, and certifications here. This data is automatically available in Quick Resume, Manual Builder, and AI Builder — no re-typing needed!',
            highlight: '.action-card:nth-child(5)',
            page: 'home',
            position: 'right'
        },
        {
            id: 'final-edit',
            title: '✏️ Final Edit Screen',
            description: 'Before exporting, click "Final Edit" on the preview page. This opens a powerful editor where you can modify any field, add custom sections, remove items, and even change the template — all without losing your data!',
            highlight: '.toolbar-right',
            page: 'preview',
            position: 'bottom'
        },
        {
            id: 'template-switch',
            title: '🔄 Template Switching',
            description: 'In the Final Editor, go to the "Template" tab to switch templates instantly. Your entire resume content is preserved — only the visual design changes. Try different layouts until you find the perfect one.',
            highlight: null,
            page: 'preview',
            position: 'center'
        },
        {
            id: 'ai-review',
            title: '🧠 AI Resume Review',
            description: 'Click the "AI Resume Review" feature card on the home page. Get an instant 0-100 rating with AI-powered suggestions for structure improvements, missing sections, weak bullet points, and professional wording enhancements.',
            highlight: '.feature-card:nth-child(1)',
            page: 'home',
            position: 'bottom'
        },
        {
            id: 'ats-score',
            title: '📊 ATS Score Analyzer',
            description: 'Ensure your resume passes Applicant Tracking Systems. Get a detailed ATS compatibility score (0-100) with formatting analysis, keyword detection, and specific suggestions to improve your match rate.',
            highlight: '.feature-card:nth-child(2)',
            page: 'home',
            position: 'bottom'
        },
        {
            id: 'grammar',
            title: '📝 Grammar Checker',
            description: 'Catch spelling mistakes, grammar issues, and weak phrasing before sending your resume. One-click fixes for common errors, plus suggestions for stronger action verbs and more professional language.',
            highlight: '.feature-card:nth-child(3)',
            page: 'home',
            position: 'bottom'
        },
        {
            id: 'cover-letter',
            title: '✉️ Cover Letter Generator',
            description: 'Generate a tailored cover letter in seconds. Enter the job role and company name, and AI creates a professional cover letter based on your resume data. Edit it freely and download as text.',
            highlight: '.feature-card:nth-child(4)',
            page: 'home',
            position: 'bottom'
        },
        {
            id: 'interview',
            title: '💬 Interview Preparation',
            description: 'Get ready for your interview! AI generates relevant questions across 5 categories: HR, Technical, Behavioral, Project-based, and Role-specific. Each question includes a sample answer to help you prepare.',
            highlight: '.feature-card:nth-child(5)',
            page: 'home',
            position: 'bottom'
        },
        {
            id: 'cv-generator',
            title: '📋 AI CV Generator',
            description: 'Need a Curriculum Vitae instead of a resume? Generate professional CVs in 6 styles: Academic, Research, Professional, International, Fresher, and Experienced. Includes sections for publications, research, and references.',
            highlight: '.feature-card:nth-child(7)',
            page: 'home',
            position: 'bottom'
        },
        {
            id: 'cloud-sync',
            title: '☁️ Cloud Sync',
            description: 'Keep your data safe and accessible across devices. Sign in with Google to sync your resumes, profiles, settings, and AI history. Includes backup export and data restore capabilities.',
            highlight: '.feature-card:nth-child(6)',
            page: 'home',
            position: 'bottom'
        },
        {
            id: 'export',
            title: '📥 Export Options',
            description: 'When your resume is ready, export it in multiple formats: PDF (pixel-perfect with all styling preserved), DOCX, or plain text. You can also print directly or share via link.',
            highlight: '.toolbar-right',
            page: 'preview',
            position: 'bottom'
        },
        {
            id: 'themes',
            title: '🌙 Theme System',
            description: 'REZUMI supports 3 themes: Dark (default), Light, and AMOLED. Toggle between them using the moon/sun icon in the top-right. Choose from 6 accent colors in Settings. All themes maintain proper contrast.',
            highlight: '#theme-toggle',
            page: 'home',
            position: 'bottom'
        },
        {
            id: 'settings',
            title: '⚙️ Settings',
            description: 'Customize your experience in Settings: switch themes, change accent colors, export/import all your data, view analytics (resumes created, downloads, ATS scores), and manage your account.',
            highlight: '.nav-avatar',
            page: 'home',
            position: 'bottom'
        },
        {
            id: 'footer',
            title: '🔗 Footer Links',
            description: 'Scroll to the bottom of the home page to find our footer with quick links to all features, support resources, privacy policy, terms of service, and social media links. Built with ❤️ for job seekers.',
            highlight: '.site-footer',
            page: 'home',
            position: 'top'
        },
        {
            id: 'complete',
            title: '🎉 Tour Complete!',
            description: 'You\'re all set! REZUMI has everything you need to create professional, ATS-optimized resumes in minutes. Start by clicking "Quick Resume" or "AI Builder" on the home page. Good luck with your job search! 🚀',
            highlight: '.hero-actions',
            page: 'home',
            position: 'bottom'
        }
    ],

    init() {
        // Only show tour on first visit
        if (localStorage.getItem('rezumi_tour_completed')) return;
        
        // Auto-start tour after splash
        setTimeout(() => {
            if (!localStorage.getItem('rezumi_tour_completed')) {
                this.start();
            }
        }, 3500);
    },

    start() {
        this.isActive = true;
        this.currentStep = 0;
        this.createOverlay();
        this.showStep();
    },

    createOverlay() {
        // Create backdrop
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'tour-backdrop';
        this.backdrop.innerHTML = '<div class="tour-backdrop-inner"></div>';
        document.body.appendChild(this.backdrop);

        // Create tooltip
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tour-tooltip';
        document.body.appendChild(this.tooltip);

        // Create progress bar
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'tour-progress';
        document.body.appendChild(this.progressBar);

        this.updateProgress();
    },

    showStep() {
        const step = this.steps[this.currentStep];
        if (!step) { this.end(); return; }

        // Navigate to correct page if needed
        if (step.page && typeof navigateTo === 'function') {
            // Only navigate if we're not already on that page
            const currentPage = document.querySelector('.page.active');
            const targetPage = document.getElementById('page-' + step.page);
            if (currentPage !== targetPage) {
                navigateTo(step.page);
            }
        }

        // Wait for page transition
        setTimeout(() => {
            this.renderTooltip(step);
            this.highlightElement(step.highlight);
            this.updateProgress();
        }, step.page ? 300 : 50);
    },

    renderTooltip(step) {
        const total = this.steps.length;
        const current = this.currentStep + 1;

        this.tooltip.innerHTML = `
            <div class="tour-tooltip-header">
                <span class="tour-step-count">${current} of ${total}</span>
                <button class="tour-close" onclick="TourGuide.end()" title="End Tour">✕</button>
            </div>
            <div class="tour-tooltip-body">
                <h3>${step.title}</h3>
                <p>${step.description}</p>
            </div>
            <div class="tour-tooltip-footer">
                <button class="tour-btn tour-btn-skip" onclick="TourGuide.end()">Skip Tour</button>
                <div class="tour-nav-btns">
                    ${this.currentStep > 0 ? '<button class="tour-btn tour-btn-back" onclick="TourGuide.prev()">← Back</button>' : ''}
                    ${this.currentStep < total - 1 
                        ? '<button class="tour-btn tour-btn-next" onclick="TourGuide.next()">Next →</button>'
                        : '<button class="tour-btn tour-btn-done" onclick="TourGuide.end()">Get Started! 🚀</button>'}
                </div>
            </div>
        `;

        // Position tooltip
        this.positionTooltip(step);
    },

    positionTooltip(step) {
        const tooltip = this.tooltip;
        tooltip.style.display = 'block';
        tooltip.style.opacity = '0';

        requestAnimationFrame(() => {
            const rect = tooltip.getBoundingClientRect();
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const position = step.position || 'bottom';

            // Reset
            tooltip.style.top = '';
            tooltip.style.bottom = '';
            tooltip.style.left = '';
            tooltip.style.right = '';

            switch(position) {
                case 'center':
                    tooltip.style.top = '50%';
                    tooltip.style.left = '50%';
                    tooltip.style.transform = 'translate(-50%, -50%)';
                    break;
                case 'bottom':
                    tooltip.style.bottom = '32px';
                    tooltip.style.left = '50%';
                    tooltip.style.transform = 'translateX(-50%)';
                    break;
                case 'top':
                    tooltip.style.top = '80px';
                    tooltip.style.left = '50%';
                    tooltip.style.transform = 'translateX(-50%)';
                    break;
                case 'right':
                    tooltip.style.top = '50%';
                    tooltip.style.right = '32px';
                    tooltip.style.transform = 'translateY(-50%)';
                    break;
            }

            tooltip.style.opacity = '1';
        });
    },

    highlightElement(selector) {
        // Remove previous highlights
        document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
        });

        if (selector) {
            const el = document.querySelector(selector);
            if (el) {
                el.classList.add('tour-highlight');
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    },

    updateProgress() {
        const total = this.steps.length;
        const progress = ((this.currentStep + 1) / total) * 100;
        if (this.progressBar) {
            this.progressBar.innerHTML = `<div class="tour-progress-bar" style="width:${progress}%"></div>`;
        }
    },

    next() {
        this.currentStep++;
        this.showStep();
    },

    prev() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep();
        }
    },

    end() {
        this.isActive = false;
        localStorage.setItem('rezumi_tour_completed', 'true');
        
        // Remove tour elements
        if (this.backdrop) this.backdrop.remove();
        if (this.tooltip) this.tooltip.remove();
        if (this.progressBar) this.progressBar.remove();
        
        // Remove highlights
        document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
        });
    },

    restart() {
        localStorage.removeItem('rezumi_tour_completed');
        this.start();
    }
};

// Auto-initialize
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        TourGuide.init();
    });
}

// Expose restart globally
window.restartTour = function() { TourGuide.restart(); };
