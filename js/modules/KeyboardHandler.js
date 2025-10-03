// KeyboardHandler module - handles keyboard input and shortcuts
export class KeyboardHandler {
  constructor() {
    this.keyMappings = {
      // Numbers
      '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
      '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
      
      // Operators
      '+': '+', '-': '-', '*': '*', '/': '/',
      'Enter': 'equals', '=': 'equals',
      'Escape': 'clear', 'Delete': 'clear',
      'Backspace': 'backspace',
      
      // Special characters
      '.': '.', '(': '(', ')': ')',
      '^': '^', '%': '%',
      
      // Functions (case insensitive)
      's': 'sin', 'c': 'cos', 't': 'tan',
      'l': 'log', 'q': 'sqrt', 'e': 'exp',
      'b': 'abs', 'n': 'negate', 'r': 'cbrt',
      'S': 'sin', 'C': 'cos', 'T': 'tan',
      'L': 'log', 'Q': 'sqrt', 'E': 'exp',
      'B': 'abs', 'N': 'negate', 'R': 'cbrt',
      
      // Constants
      'p': 'pi', 'P': 'pi', 'E': 'e',
      
      // Memory functions
      'm': 'memory-recall', 'M': 'memory-add',
      
      // History
      'h': 'history-toggle', 'H': 'history-toggle',
      
      // Theme
      'T': 'theme-toggle',
      
      // Other
      'a': 'ans', 'A': 'ans',
      'w': 'random', 'W': 'random',
      'f': 'factorial', 'F': 'factorial',
      
      // Additional common keys
      'Space': 'equals',
      'Tab': 'ans'
    };

    this.modifierKeys = {
      'Shift': false,
      'Ctrl': false,
      'Alt': false,
      'Meta': false
    };

    this.shortcuts = {
      'Ctrl+KeyC': 'clear',
      'Ctrl+KeyA': 'clear',
      'Ctrl+KeyH': 'history-toggle',
      'Ctrl+KeyT': 'theme-toggle',
      'Ctrl+KeyM': 'memory-clear',
      'Ctrl+KeyR': 'memory-recall',
      'Ctrl+KeyS': 'memory-add',
      'Ctrl+KeyD': 'memory-subtract',
      'Ctrl+KeyE': 'export-history',
      'Ctrl+KeyI': 'import-history',
      'Ctrl+KeyP': 'print',
      'F1': 'help',
      'F2': 'history-toggle',
      'F3': 'theme-toggle',
      'F9': 'memory-clear',
      'F10': 'memory-recall',
      'F11': 'fullscreen',
      'F12': 'dev-tools'
    };

    this.isEnabled = true;
    this.lastKeyTime = 0;
    this.keySequence = [];
    this.sequenceTimeout = null;
  }

  init() {
    this.setupEventListeners();
    this.loadSettings();
  }

  setupEventListeners() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    
    // Prevent default behavior for certain keys
    document.addEventListener('keydown', (e) => {
      if (this.shouldPreventDefault(e)) {
        e.preventDefault();
      }
    });
  }

  handleKeyDown(event, calculator) {
    if (!this.isEnabled) return;

    const key = event.key;
    const code = event.code;
    const ctrlKey = event.ctrlKey;
    const altKey = event.altKey;
    const shiftKey = event.shiftKey;
    const metaKey = event.metaKey;

    // Update modifier keys state
    this.modifierKeys = {
      'Shift': shiftKey,
      'Ctrl': ctrlKey,
      'Alt': altKey,
      'Meta': metaKey
    };

    // Handle shortcuts first
    const shortcut = this.getShortcut(event);
    if (shortcut) {
      this.handleShortcut(shortcut, event);
      return;
    }

    // Handle regular key mappings
    const action = this.getAction(key, event);
    if (action && calculator) {
      calculator.handleAction(action);
    }

    // Track key sequence for advanced shortcuts
    this.trackKeySequence(key);
  }

  handleKeyUp(event) {
    // Update modifier keys state
    this.modifierKeys = {
      'Shift': event.shiftKey,
      'Ctrl': event.ctrlKey,
      'Alt': event.altKey,
      'Meta': event.metaKey
    };
  }

  getAction(key, event) {
    // Handle case-sensitive mappings
    if (this.keyMappings[key]) {
      return this.keyMappings[key];
    }

    // Handle case-insensitive mappings
    const lowerKey = key.toLowerCase();
    if (this.keyMappings[lowerKey]) {
      return this.keyMappings[lowerKey];
    }

    // Handle special cases
    if (key === 'Enter' || key === '=') {
      return 'equals';
    }
    if (key === 'Escape' || key === 'Delete') {
      return 'clear';
    }
    if (key === 'Backspace') {
      return 'backspace';
    }

    return null;
  }

  getShortcut(event) {
    const ctrlKey = event.ctrlKey;
    const altKey = event.altKey;
    const shiftKey = event.shiftKey;
    const metaKey = event.metaKey;
    const code = event.code;

    // Build shortcut string
    let shortcut = '';
    if (ctrlKey) shortcut += 'Ctrl+';
    if (altKey) shortcut += 'Alt+';
    if (shiftKey) shortcut += 'Shift+';
    if (metaKey) shortcut += 'Meta+';
    shortcut += code;

    return this.shortcuts[shortcut] || null;
  }

  handleShortcut(shortcut, event) {
    switch (shortcut) {
      case 'clear':
        this.triggerAction('clear');
        break;
      case 'history-toggle':
        this.triggerAction('history-toggle');
        break;
      case 'theme-toggle':
        this.triggerAction('theme-toggle');
        break;
      case 'memory-clear':
        this.triggerAction('memory-clear');
        break;
      case 'memory-recall':
        this.triggerAction('memory-recall');
        break;
      case 'memory-add':
        this.triggerAction('memory-add');
        break;
      case 'memory-subtract':
        this.triggerAction('memory-subtract');
        break;
      case 'export-history':
        this.triggerAction('export-history');
        break;
      case 'import-history':
        this.triggerAction('import-history');
        break;
      case 'print':
        window.print();
        break;
      case 'help':
        this.showHelp();
        break;
      case 'fullscreen':
        this.toggleFullscreen();
        break;
      case 'dev-tools':
        // Let browser handle F12
        break;
    }
  }

  triggerAction(action) {
    // Dispatch custom event for other modules to listen
    const event = new CustomEvent('keyboard-action', {
      detail: { action }
    });
    document.dispatchEvent(event);
  }

  shouldPreventDefault(event) {
    const key = event.key;
    const code = event.code;
    
    // Prevent default for calculator keys
    const calculatorKeys = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      '+', '-', '*', '/', '=', 'Enter', 'Escape', 'Delete',
      'Backspace', '.', '(', ')', '^', '%'
    ];
    
    if (calculatorKeys.includes(key)) {
      return true;
    }
    
    // Prevent default for shortcuts
    if (this.getShortcut(event)) {
      return true;
    }
    
    return false;
  }

  trackKeySequence(key) {
    const now = Date.now();
    this.keySequence.push({ key, time: now });
    
    // Clear old keys (older than 2 seconds)
    this.keySequence = this.keySequence.filter(item => now - item.time < 2000);
    
    // Clear sequence after timeout
    if (this.sequenceTimeout) {
      clearTimeout(this.sequenceTimeout);
    }
    
    this.sequenceTimeout = setTimeout(() => {
      this.keySequence = [];
    }, 2000);
  }

  showHelp() {
    const helpText = `
Calculator Keyboard Shortcuts:

Numbers: 0-9
Operators: +, -, *, /, ^, %
Functions: s (sin), c (cos), t (tan), l (log), q (sqrt), e (exp)
Constants: p (pi), E (e)
Memory: m (recall), M (add)
Other: a (ans), r (random), f (factorial)

Shortcuts:
Ctrl+C / Ctrl+A: Clear
Ctrl+H: Toggle History
Ctrl+T: Toggle Theme
Ctrl+M: Memory Clear
Ctrl+R: Memory Recall
Ctrl+S: Memory Add
Ctrl+D: Memory Subtract
F1: Help
F2: Toggle History
F3: Toggle Theme
F9: Memory Clear
F10: Memory Recall
F11: Fullscreen

Navigation:
Enter / =: Calculate
Escape / Delete: Clear
Backspace: Backspace
    `;
    
    alert(helpText);
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  isKeyboardEnabled() {
    return this.isEnabled;
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem('keyboard-settings');
      if (saved) {
        const settings = JSON.parse(saved);
        this.isEnabled = settings.enabled !== false;
      }
    } catch (error) {
      console.error('Error loading keyboard settings:', error);
    }
  }

  saveSettings() {
    try {
      const settings = {
        enabled: this.isEnabled,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('keyboard-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving keyboard settings:', error);
    }
  }

  // Get keyboard statistics
  getKeyboardStats() {
    return {
      isEnabled: this.isEnabled,
      totalMappings: Object.keys(this.keyMappings).length,
      totalShortcuts: Object.keys(this.shortcuts).length,
      lastKeyTime: this.lastKeyTime,
      currentSequence: this.keySequence.map(item => item.key).join('')
    };
  }
}
