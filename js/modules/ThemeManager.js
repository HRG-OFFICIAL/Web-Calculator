// ThemeManager module - handles theme switching and persistence
export class ThemeManager {
  constructor() {
    this.currentTheme = 'dark';
    this.themes = {
      light: {
        name: 'Light',
        icon: '◑',
        description: 'Light theme with bright colors'
      },
      dark: {
        name: 'Dark',
        icon: '◐',
        description: 'Dark theme with dark colors'
      }
    };
    this.storageKey = 'calculator-theme';
  }

  init() {
    this.loadTheme();
    this.updateThemeIcon();
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  getAvailableThemes() {
    return Object.keys(this.themes);
  }

  getThemeInfo(theme) {
    return this.themes[theme] || null;
  }

  setTheme(theme) {
    if (!this.themes[theme]) {
      console.warn(`Theme '${theme}' not found`);
      return false;
    }

    this.currentTheme = theme;
    this.applyTheme();
    this.saveTheme();
    this.updateThemeIcon();
    return true;
  }

  toggleTheme() {
    const themeOrder = ['light', 'dark'];
    const currentIndex = themeOrder.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    this.setTheme(themeOrder[nextIndex]);
  }

  applyTheme() {
    const app = document.querySelector('.app');
    
    if (!app) return;

    // Remove existing theme classes
    app.classList.remove('theme-light', 'theme-dark');
    
    // Apply new theme
    app.classList.add(`theme-${this.currentTheme}`);
    app.setAttribute('data-theme', this.currentTheme);
  }


  updateThemeIcon() {
    const themeToggle = document.querySelector('.theme-toggle__icon');
    if (themeToggle) {
      // Show the icon for the NEXT theme (opposite of current)
      const themeOrder = ['light', 'dark'];
      const currentIndex = themeOrder.indexOf(this.currentTheme);
      const nextIndex = (currentIndex + 1) % themeOrder.length;
      const nextTheme = themeOrder[nextIndex];
      const nextThemeInfo = this.themes[nextTheme];
      themeToggle.textContent = nextThemeInfo ? nextThemeInfo.icon : '🌙';
      
      // Update aria-label for accessibility
      themeToggle.setAttribute('aria-label', `Switch to ${nextThemeInfo ? nextThemeInfo.name : 'next'} theme`);
    }
  }


  saveTheme() {
    try {
      localStorage.setItem(this.storageKey, this.currentTheme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }

  loadTheme() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved && this.themes[saved]) {
        this.currentTheme = saved;
      } else {
        // Default to dark theme
        this.currentTheme = 'dark';
      }
    } catch (error) {
      console.error('Error loading theme from localStorage:', error);
      this.currentTheme = 'dark'; // Fallback
    }
    
    this.applyTheme();
  }

  // Create a custom theme (for future extensibility)
  createCustomTheme(name, colors) {
    const themeId = name.toLowerCase().replace(/\s+/g, '-');
    this.themes[themeId] = {
      name: name,
      icon: '🎨',
      description: 'Custom theme',
      colors: colors
    };
    return themeId;
  }

  // Apply custom CSS variables for a theme
  applyCustomTheme(themeId, colors) {
    if (!this.themes[themeId]) return false;

    const root = document.documentElement;
    Object.entries(colors).forEach(([property, value]) => {
      root.style.setProperty(`--${property}`, value);
    });

    return true;
  }

  // Reset to default theme
  resetToDefault() {
    this.setTheme('dark');
  }

  // Get the next theme in the cycle
  getNextTheme() {
    const themeOrder = ['light', 'dark'];
    const currentIndex = themeOrder.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    return themeOrder[nextIndex];
  }

  // Get the icon for the next theme
  getNextThemeIcon() {
    const nextTheme = this.getNextTheme();
    const nextThemeInfo = this.themes[nextTheme];
    return nextThemeInfo ? nextThemeInfo.icon : '🌙';
  }

  // Get theme statistics (for analytics)
  getThemeStats() {
    const stats = {
      currentTheme: this.currentTheme,
      nextTheme: this.getNextTheme(),
      nextThemeIcon: this.getNextThemeIcon(),
      availableThemes: Object.keys(this.themes).length,
      systemPreference: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      lastChanged: localStorage.getItem(`${this.storageKey}-last-changed`) || null
    };
    return stats;
  }

  // Set theme with animation
  setThemeWithAnimation(theme) {
    const app = document.querySelector('.app');
    if (!app) return false;

    // Add transition class
    app.classList.add('theme-transitioning');
    
    // Set theme
    const success = this.setTheme(theme);
    
    // Remove transition class after animation
    setTimeout(() => {
      app.classList.remove('theme-transitioning');
    }, 300);

    return success;
  }
}
