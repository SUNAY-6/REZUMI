/* ============================================
   REZUMI - Splash Screen
   ============================================ */

const SplashScreen = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,

    init() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        
        if (this.canvas) {
            this.resizeCanvas();
            this.createParticles();
            this.animateParticles();
            window.addEventListener('resize', () => this.resizeCanvas());
        }

        // Add glow class after delay
        setTimeout(() => {
            const logoMark = document.querySelector('.logo-mark');
            if (logoMark) logoMark.classList.add('glow');
        }, 1500);

        // Fade out splash screen
        setTimeout(() => {
            this.fadeOut();
        }, 2800);
    },

    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    createParticles() {
        const count = 50;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.1,
                color: Math.random() > 0.5 ? '59, 130, 246' : '139, 92, 246'
            });
        }
    },

    animateParticles() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Wrap around
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
            this.ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - dist / 120)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }

        this.animationId = requestAnimationFrame(() => this.animateParticles());
    },

    fadeOut() {
        const splash = document.getElementById('splash-screen');
        const app = document.getElementById('app');
        
        if (splash) {
            splash.classList.add('fade-out');
            
            setTimeout(() => {
                splash.style.display = 'none';
                if (app) app.classList.remove('hidden');
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                }
                
                // Initialize app after splash
                App.init();
            }, 600);
        }
    }
};

// Start splash on load
window.addEventListener('DOMContentLoaded', () => {
    SplashScreen.init();
});
