/* ============================================
   REZUMI - Main App Initialization
   ============================================ */

const App = {
    init() {
        // Initialize theme
        ThemeManager.init();
        
        // Initialize search
        initSearch();
        
        // Initialize keyboard shortcuts
        initKeyboardShortcuts();
        
        // Setup theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => ThemeManager.toggle());
        }
        
        // Initialize home page
        initHomePage();
        
        // Seed sample data if first visit
        if (!Storage.get('rezumi_initialized')) {
            this.seedSampleData();
            Storage.set('rezumi_initialized', true);
        }
        
        console.log('%c REZUMI ', 'background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-size: 16px; font-weight: bold; padding: 8px 16px; border-radius: 8px;');
        console.log('%c AI-Powered Resume Builder ', 'color: #8b5cf6; font-size: 12px;');
    },

    seedSampleData() {
        // Seed a sample profile
        Storage.saveProfile({
            fullName: 'Arjun Sharma',
            email: 'arjun.sharma@email.com',
            phone: '+91 9876543210',
            address: 'Bengaluru, Karnataka, India',
            jobTitle: 'Full Stack Developer',
            linkedin: 'https://linkedin.com/in/arjunsharma',
            github: 'https://github.com/arjunsharma',
            portfolio: 'https://arjunsharma.dev',
            summary: 'Passionate Full Stack Developer with 3+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud technologies. Strong problem-solving skills with a focus on delivering clean, efficient code and exceptional user experiences.'
        });

        // Seed sample education
        Storage.saveEducation({
            degree: 'B.Tech',
            course: 'Computer Science & Engineering',
            institute: 'RV College of Engineering',
            university: 'VTU',
            cgpa: '8.7',
            startYear: '2018',
            endYear: '2022',
            location: 'Bengaluru'
        });

        Storage.saveEducation({
            degree: '12th',
            course: 'Science (PCM)',
            institute: 'Delhi Public School',
            cgpa: '92%',
            startYear: '2016',
            endYear: '2018',
            location: 'Delhi'
        });

        // Seed sample experience
        Storage.saveExperience({
            company: 'Flipkart',
            role: 'Senior Software Engineer',
            type: 'Full-time',
            startDate: '2023-01',
            endDate: '',
            current: true,
            location: 'Bengaluru',
            responsibilities: '• Led development of customer-facing features serving 10M+ users\n• Improved page load performance by 40% through code splitting and lazy loading\n• Mentored 3 junior developers and conducted code reviews\n• Implemented CI/CD pipelines reducing deployment time by 60%',
            techUsed: 'React, Node.js, MongoDB, AWS, Docker'
        });

        Storage.saveExperience({
            company: 'Infosys',
            role: 'Software Engineer',
            type: 'Full-time',
            startDate: '2022-06',
            endDate: '2022-12',
            current: false,
            location: 'Bengaluru',
            responsibilities: '• Developed RESTful APIs for internal microservices\n• Collaborated with cross-functional teams using Agile methodology\n• Wrote unit tests achieving 85% code coverage',
            techUsed: 'Java, Spring Boot, MySQL, JUnit'
        });

        // Seed sample skills
        Storage.saveSkills([
            'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
            'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git',
            'Next.js', 'Redis', 'GraphQL', 'CI/CD', 'Agile'
        ]);

        // Seed sample projects
        Storage.saveProject({
            name: 'E-Commerce Platform',
            description: 'Built a full-featured e-commerce platform with real-time inventory management, payment integration, and admin dashboard.',
            techStack: 'React, Node.js, MongoDB, Stripe, AWS S3',
            role: 'Lead Developer',
            github: 'https://github.com/arjunsharma/ecommerce'
        });

        Storage.saveProject({
            name: 'Task Management App',
            description: 'Real-time collaborative task management application with drag-and-drop, notifications, and team workspaces.',
            techStack: 'Next.js, TypeScript, Prisma, PostgreSQL, Socket.io',
            role: 'Full Stack Developer',
            github: 'https://github.com/arjunsharma/taskflow',
            demo: 'https://taskflow.app'
        });

        Storage.saveProject({
            name: 'AI Content Generator',
            description: 'AI-powered tool that generates marketing copy, blog posts, and social media content using GPT APIs.',
            techStack: 'Python, FastAPI, OpenAI API, React, Tailwind CSS',
            role: 'Backend Developer'
        });

        // Seed certifications
        Storage.saveCertification({
            name: 'AWS Solutions Architect Associate',
            org: 'Amazon Web Services',
            date: '2023-06',
            url: 'https://aws.amazon.com/certification'
        });

        Storage.saveCertification({
            name: 'Meta Frontend Developer',
            org: 'Meta (Coursera)',
            date: '2022-12'
        });

        // Seed achievements
        Storage.saveAchievement({
            title: 'Smart India Hackathon Winner',
            type: 'Hackathon',
            description: 'Won national-level hackathon with AI-powered healthcare solution'
        });

        Storage.saveAchievement({
            title: 'Google Summer of Code',
            type: 'Award',
            description: 'Selected as GSoC contributor for open-source project'
        });

        // Mark as initialized
        Storage.set('rezumi_initialized', true);
    }
};
