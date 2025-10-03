// Main entry point for the calculator application
import { Calculator } from './modules/Calculator.js';
import { HistoryManager } from './modules/HistoryManager.js';
import { ThemeManager } from './modules/ThemeManager.js';
import { KeyboardHandler } from './modules/KeyboardHandler.js';
import { UIManager } from './modules/UIManager.js';
import { ResponsiveManager } from './modules/ResponsiveManager.js';

class App {
  constructor() {
    this.calculator = new Calculator();
    this.historyManager = new HistoryManager();
    this.themeManager = new ThemeManager();
    this.keyboardHandler = new KeyboardHandler();
    this.uiManager = new UIManager();
    this.responsiveManager = new ResponsiveManager();
    
    this.init();
  }

  init() {
    // Initialize all modules
    this.calculator.init();
    this.historyManager.init();
    this.themeManager.init();
    this.keyboardHandler.init();
    this.uiManager.init();
    this.responsiveManager.init();

    // Set up event listeners
    this.setupEventListeners();
    
    // Load saved data
    this.loadSavedData();
    
    // Set up responsive observers
    this.setupResponsiveObservers();
    
    console.log('Calculator app initialized successfully');
  }

  setupEventListeners() {
    // Calculator button clicks
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        if (action) {
          this.handleButtonClick(action);
        }
      });
    });

    // History panel toggle
    document.querySelector('.history-toggle').addEventListener('click', () => {
      this.uiManager.toggleHistoryPanel();
    });

    // Theme toggle
    document.querySelector('.theme-toggle').addEventListener('click', () => {
      this.themeManager.toggleTheme();
    });

    // History clear
    document.querySelector('.history-panel__clear').addEventListener('click', () => {
      this.historyManager.clearHistory();
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardInput(e);
    });

    // History item clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.history-item')) {
        const expression = e.target.closest('.history-item').dataset.expression;
        if (expression) {
          this.calculator.setExpression(expression);
        }
      }
    });
  }

  handleButtonClick(action) {
    try {
      const result = this.calculator.handleAction(action);
      
      if (result && result.expression && result.result !== undefined) {
        // Add to history if it's a calculation
        this.historyManager.addToHistory(result.expression, result.result);
        this.uiManager.updateHistoryDisplay(this.historyManager.getHistory());
      }
      
      // Update display
      this.uiManager.updateDisplay(this.calculator.getDisplayState());
      
    } catch (error) {
      console.error('Error handling button click:', error);
      this.uiManager.showError(error.message);
    }
  }

  handleKeyboardInput(event) {
    try {
      // Get the action from keyboard handler
      const action = this.keyboardHandler.getAction(event.key, event);
      
      if (action) {
        // Handle special actions that don't go through calculator
        if (action === 'history-toggle') {
          this.uiManager.toggleHistoryPanel();
          return;
        }
        
        if (action === 'theme-toggle') {
          this.themeManager.toggleTheme();
          return;
        }
        
        // Handle calculator actions
        const result = this.calculator.handleAction(action);
        
        if (result && result.expression && result.result !== undefined) {
          // Add to history if it's a calculation
          this.historyManager.addToHistory(result.expression, result.result);
          this.uiManager.updateHistoryDisplay(this.historyManager.getHistory());
        }
        
        // Update display
        this.uiManager.updateDisplay(this.calculator.getDisplayState());
        
        // Prevent default behavior for calculator keys
        event.preventDefault();
      }
      
    } catch (error) {
      console.error('Error handling keyboard input:', error);
      this.uiManager.showError(error.message);
    }
  }

  loadSavedData() {
    // Load theme preference
    this.themeManager.loadTheme();
    
    // Load history
    this.historyManager.loadHistory();
    this.uiManager.updateHistoryDisplay(this.historyManager.getHistory());
  }

  setupResponsiveObservers() {
    // Listen for responsive changes
    this.responsiveManager.addObserver((state) => {
      this.handleResponsiveChange(state);
    });
  }

  handleResponsiveChange(state) {
    // Update UI based on responsive state
    console.log('Responsive state changed:', state);
    
    // Hide history panel on mobile devices
    if (state.deviceType === 'mobile' && state.breakpoint === 'xs') {
      this.uiManager.hideHistoryPanel();
    }
    
    // Show history panel on larger devices
    if (state.deviceType === 'desktop' && (state.breakpoint === 'lg' || state.breakpoint === 'xl' || state.breakpoint === 'xxl')) {
      this.uiManager.showHistoryPanel();
    }
    
    // Update button sizes based on device type
    this.updateButtonSizes(state);
    
    // Update layout based on orientation
    this.updateLayoutForOrientation(state);
  }

  updateButtonSizes(state) {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
      // Remove existing size classes
      btn.classList.remove('btn--small', 'btn--medium', 'btn--large', 'btn--xlarge');
      
      // Add appropriate size class based on breakpoint
      const config = this.responsiveManager.layoutConfigs[state.breakpoint];
      if (config && config.calculator.buttonSize) {
        btn.classList.add(`btn--${config.calculator.buttonSize}`);
      }
    });
  }

  updateLayoutForOrientation(state) {
    const main = document.querySelector('.main');
    if (!main) return;
    
    // Adjust layout for landscape mobile
    if (state.isLandscape && state.deviceType === 'mobile') {
      main.style.flexDirection = 'row';
    } else if (state.isPortrait && state.deviceType === 'mobile') {
      main.style.flexDirection = 'column';
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
});

// Export for potential testing
export { App };
