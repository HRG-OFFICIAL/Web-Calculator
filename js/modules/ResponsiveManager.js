// ResponsiveManager module - handles dynamic breakpoints and responsive behavior
export class ResponsiveManager {
  constructor() {
    this.breakpoints = {
      xs: { min: 0, max: 575, name: 'Extra Small' },
      sm: { min: 576, max: 767, name: 'Small' },
      md: { min: 768, max: 991, name: 'Medium' },
      lg: { min: 992, max: 1199, name: 'Large' },
      xl: { min: 1200, max: 1399, name: 'Extra Large' },
      xxl: { min: 1400, max: Infinity, name: 'Extra Extra Large' }
    };
    
    this.currentBreakpoint = null;
    this.isLandscape = false;
    this.isPortrait = false;
    this.deviceType = 'desktop';
    
    // Bind methods to preserve context for event listeners
    this.handleResize = this.handleResize.bind(this);
    this.handleOrientationChange = this.handleOrientationChange.bind(this);
    this.handleViewportChange = this.handleViewportChange.bind(this);
    
    // Layout configurations for each breakpoint
    this.layoutConfigs = {
      xs: {
        calculator: {
          gridColumns: 4,
          buttonSize: 'small',
          fontSize: '0.55rem',
          padding: '0.25rem',
          gap: '0.125rem'
        },
        history: {
          visible: false,
          height: '80px',
          position: 'top'
        },
        main: {
          direction: 'column',
          padding: '0.25rem',
          gap: '0.25rem'
        }
      },
      sm: {
        calculator: {
          gridColumns: 4,
          buttonSize: 'small',
          fontSize: '0.65rem',
          padding: '0.5rem',
          gap: '0.25rem'
        },
        history: {
          visible: false,
          height: '100px',
          position: 'top'
        },
        main: {
          direction: 'column',
          padding: '0.5rem',
          gap: '0.5rem'
        }
      },
      md: {
        calculator: {
          gridColumns: 5,
          buttonSize: 'small',
          fontSize: '0.75rem',
          padding: '0.75rem',
          gap: '0.375rem'
        },
        history: {
          visible: true,
          height: '100%',
          position: 'left'
        },
        main: {
          direction: 'row',
          padding: '0.75rem',
          gap: '0.75rem'
        }
      },
      lg: {
        calculator: {
          gridColumns: 5,
          buttonSize: 'small',
          fontSize: '0.85rem',
          padding: '1rem',
          gap: '0.25rem'
        },
        history: {
          visible: true,
          height: '100%',
          position: 'left'
        },
        main: {
          direction: 'row',
          padding: '1rem',
          gap: '1rem'
        }
      },
      xl: {
        calculator: {
          gridColumns: 5,
          buttonSize: 'medium',
          fontSize: '0.95rem',
          padding: '1.25rem',
          gap: '0.375rem'
        },
        history: {
          visible: true,
          height: '100%',
          position: 'left'
        },
        main: {
          direction: 'row',
          padding: '1.25rem',
          gap: '1.25rem'
        }
      },
      xxl: {
        calculator: {
          gridColumns: 5,
          buttonSize: 'large',
          fontSize: '1.05rem',
          padding: '1.5rem',
          gap: '0.5rem'
        },
        history: {
          visible: true,
          height: '100%',
          position: 'left'
        },
        main: {
          direction: 'row',
          padding: '1.5rem',
          gap: '1.5rem'
        }
      }
    };
    
    this.observers = [];
    this.resizeTimeout = null;
  }

  init() {
    this.detectCurrentBreakpoint();
    this.detectOrientation();
    this.detectDeviceType();
    this.setupEventListeners();
    this.applyCurrentLayout();
    this.setupResizeObserver();
  }

  detectCurrentBreakpoint() {
    const width = window.innerWidth;
    
    for (const [key, breakpoint] of Object.entries(this.breakpoints)) {
      if (width >= breakpoint.min && width <= breakpoint.max) {
        this.currentBreakpoint = key;
        break;
      }
    }
    
    return this.currentBreakpoint;
  }

  detectOrientation() {
    this.isLandscape = window.innerWidth > window.innerHeight;
    this.isPortrait = !this.isLandscape;
    
    // Adjust breakpoints for landscape mobile devices
    if (this.isLandscape && window.innerHeight < 500) {
      this.adjustForLandscapeMobile();
    }
  }

  detectDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    const width = window.innerWidth;
    
    if (/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      this.deviceType = 'mobile';
    } else if (/tablet|ipad/i.test(userAgent) || (width >= 768 && width <= 1024)) {
      this.deviceType = 'tablet';
    } else {
      this.deviceType = 'desktop';
    }
  }

  adjustForLandscapeMobile() {
    // Override layout for landscape mobile
    this.layoutConfigs.xs.calculator.gridColumns = 5;
    this.layoutConfigs.xs.history.visible = false;
    this.layoutConfigs.xs.main.direction = 'row';
  }

  setupEventListeners() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleOrientationChange);
    
    // Listen for viewport changes
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', this.handleViewportChange);
    }
  }

  setupResizeObserver() {
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          this.handleElementResize(entry);
        }
      });
      
      // Observe the main container
      const mainElement = document.querySelector('.main');
      if (mainElement) {
        resizeObserver.observe(mainElement);
      }
    }
  }

  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.detectCurrentBreakpoint();
      this.detectOrientation();
      this.detectDeviceType();
      this.applyCurrentLayout();
      this.notifyObservers();
    }, 100);
  }

  handleOrientationChange() {
    setTimeout(() => {
      this.detectOrientation();
      this.detectDeviceType();
      this.applyCurrentLayout();
      this.notifyObservers();
    }, 100);
  }

  handleViewportChange() {
    this.handleResize();
  }

  handleElementResize(entry) {
    const { width } = entry.contentRect;
    this.updateElementDimensions(width);
  }

  updateElementDimensions(width) {
    // Update CSS custom properties based on actual element dimensions
    const root = document.documentElement;
    root.style.setProperty('--actual-width', `${width}px`);
    root.style.setProperty('--actual-height', `${window.innerHeight}px`);
  }

  applyCurrentLayout() {
    if (!this.currentBreakpoint) return;
    
    const config = this.layoutConfigs[this.currentBreakpoint];
    if (!config) return;
    
    this.applyCalculatorLayout(config.calculator);
    this.applyHistoryLayout(config.history);
    this.applyMainLayout(config.main);
    this.applyResponsiveClasses();
  }

  applyCalculatorLayout(calcConfig) {
    const calculator = document.querySelector('.calculator');
    const buttons = document.querySelector('.calculator__buttons');
    
    if (!calculator || !buttons) return;
    
    // Apply grid configuration
    buttons.style.gridTemplateColumns = `repeat(${calcConfig.gridColumns}, 1fr)`;
    buttons.style.gridTemplateRows = `repeat(9, minmax(35px, 1fr))`;
    buttons.style.padding = calcConfig.padding;
    buttons.style.gap = calcConfig.gap;
    
    // Apply button sizing
    const buttonSizeClass = `btn--${calcConfig.buttonSize}`;
    document.querySelectorAll('.btn').forEach(btn => {
      btn.classList.remove('btn--small', 'btn--medium', 'btn--large', 'btn--xlarge');
      btn.classList.add(buttonSizeClass);
    });
    
    // Apply font size
    calculator.style.fontSize = calcConfig.fontSize;
  }

  applyHistoryLayout(historyConfig) {
    const historyPanel = document.querySelector('.history-panel');
    if (!historyPanel) return;
    
    if (historyConfig.visible) {
      historyPanel.classList.remove('hidden');
      historyPanel.style.height = historyConfig.height;
    } else {
      historyPanel.classList.add('hidden');
    }
  }

  applyMainLayout(mainConfig) {
    const main = document.querySelector('.main');
    if (!main) return;
    
    main.style.flexDirection = mainConfig.direction;
    main.style.padding = mainConfig.padding;
    main.style.gap = mainConfig.gap;
  }

  applyResponsiveClasses() {
    const body = document.body;
    
    // Remove existing responsive classes
    body.classList.remove('breakpoint-xs', 'breakpoint-sm', 'breakpoint-md', 'breakpoint-lg', 'breakpoint-xl', 'breakpoint-xxl');
    body.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
    body.classList.remove('orientation-landscape', 'orientation-portrait');
    
    // Add current responsive classes
    body.classList.add(`breakpoint-${this.currentBreakpoint}`);
    body.classList.add(`device-${this.deviceType}`);
    body.classList.add(`orientation-${this.isLandscape ? 'landscape' : 'portrait'}`);
  }

  // Observer pattern for other modules to listen to responsive changes
  addObserver(callback) {
    this.observers.push(callback);
  }

  removeObserver(callback) {
    this.observers = this.observers.filter(obs => obs !== callback);
  }

  notifyObservers() {
    this.observers.forEach(callback => {
      try {
        callback({
          breakpoint: this.currentBreakpoint,
          deviceType: this.deviceType,
          isLandscape: this.isLandscape,
          isPortrait: this.isPortrait,
          width: window.innerWidth,
          height: window.innerHeight
        });
      } catch (error) {
        console.error('Error in responsive observer:', error);
      }
    });
  }

  // Get current responsive state
  getCurrentState() {
    return {
      breakpoint: this.currentBreakpoint,
      deviceType: this.deviceType,
      isLandscape: this.isLandscape,
      isPortrait: this.isPortrait,
      width: window.innerWidth,
      height: window.innerHeight,
      config: this.layoutConfigs[this.currentBreakpoint]
    };
  }

  // Check if current breakpoint matches criteria
  isBreakpoint(breakpoint) {
    return this.currentBreakpoint === breakpoint;
  }

  isBreakpointUp(breakpoint) {
    const currentIndex = Object.keys(this.breakpoints).indexOf(this.currentBreakpoint);
    const targetIndex = Object.keys(this.breakpoints).indexOf(breakpoint);
    return currentIndex >= targetIndex;
  }

  isBreakpointDown(breakpoint) {
    const currentIndex = Object.keys(this.breakpoints).indexOf(this.currentBreakpoint);
    const targetIndex = Object.keys(this.breakpoints).indexOf(breakpoint);
    return currentIndex <= targetIndex;
  }

  // Get breakpoint info
  getBreakpointInfo(breakpoint) {
    return this.breakpoints[breakpoint] || null;
  }

  // Update breakpoint configuration
  updateBreakpoint(breakpoint, config) {
    if (this.layoutConfigs[breakpoint]) {
      Object.assign(this.layoutConfigs[breakpoint], config);
      if (this.currentBreakpoint === breakpoint) {
        this.applyCurrentLayout();
      }
    }
  }

  // Add custom breakpoint
  addBreakpoint(name, min, max, config) {
    this.breakpoints[name] = { min, max, name: name.charAt(0).toUpperCase() + name.slice(1) };
    this.layoutConfigs[name] = config;
  }

  // Destroy and cleanup - prevent memory leaks
  destroy() {
    // Remove event listeners using the bound references
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleOrientationChange);
    
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', this.handleViewportChange);
    }
    
    // Clean up ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    
    clearTimeout(this.resizeTimeout);
    this.observers = [];
    this.currentBreakpoint = null;
  }
}
