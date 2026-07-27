/* ============================================
   REZUMI - Theme Manager
   ============================================ */

const ThemeManager = {
    current: 'dark',
    accent: 'blue',

    init() {
        const settings = Storage.getSettings();
        this.current = settings.theme || 'dark';
        this.accent = settings.accentColor || 'blue';
        this.apply();
    },

    apply() {
        document.documentElement.setAttribute('data-theme', this.current);
        document.documentElement.setAttribute('data-accent', this.accent);
        
        // Update theme toggle icon
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            const icon = toggle.querySelector('i');
            if (icon) {
                switch(this.current) {
                    case 'dark': icon.className = 'fas fa-moon'; break;
                    case 'light': icon.className = 'fas fa-sun'; break;
                    case 'amoled': icon.className = 'fas fa-circle'; break;
                }
            }
        }
        
        // Update settings page if visible
        this.updateSettingsUI();
    },

    setTheme(theme) {
        this.current = theme;
        this.apply();
        this.save();
    },

    setAccentColor(color) {
        this.accent = color;
        this.apply();
        this.save();
    },

    toggle() {
        const themes = ['dark', 'light', 'amoled'];
        const idx = themes.indexOf(this.current);
        this.current = themes[(idx + 1) % themes.length];
        this.apply();
        this.save();
    },

    save() {
        const settings = Storage.getSettings();
        settings.theme = this.current;
        settings.accentColor = this.accent;
        Storage.saveSettings(settings);
    },

    updateSettingsUI() {
        // Theme buttons
        document.querySelectorAll('.theme-opt').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === this.current);
        });
        
        // Color buttons
        document.querySelectorAll('.color-opt').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.color === this.accent);
        });
    }
};

function setTheme(theme) {
    ThemeManager.setTheme(theme);
}

function setAccentColor(color) {
    ThemeManager.setAccentColor(color);
}
