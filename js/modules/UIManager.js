// UIManager module - handles UI updates and interactions
export class UIManager {
  constructor() {
    this.display = null;
    this.expressionElement = null;
    this.resultElement = null;
    this.historyPanel = null;
    this.historyList = null;
    this.isHistoryVisible = false;
    
    // Animation settings
    this.animationDuration = 300;
    this.errorDisplayDuration = 2000;
  }

  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.updateThemeIcon();
  }

  cacheElements() {
    this.display = document.querySelector('.calculator__display');
    this.expressionElement = document.querySelector('.calculator__expression');
    this.resultElement = document.querySelector('.calculator__result');
    this.historyPanel = document.getElementById('history-panel');
    this.historyList = document.querySelector('.history-panel__list');
  }

  setupEventListeners() {
    // Listen for keyboard actions
    document.addEventListener('keyboard-action', (e) => {
      this.handleKeyboardAction(e.detail.action);
    });

    // Listen for window resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  updateDisplay(displayState) {
    if (!this.expressionElement || !this.resultElement || !displayState) return;

    const { expression = '0', result = '0' } = displayState;
    
    // Update expression with animation
    this.animateTextUpdate(this.expressionElement, String(expression));
    
    // Update result with animation
    this.animateTextUpdate(this.resultElement, String(result));
  }

  animateTextUpdate(element, newText) {
    if (!element) return;

    // Add transition class
    element.classList.add('text-updating');
    
    // Update text
    element.textContent = newText;
    
    // Remove transition class after animation
    setTimeout(() => {
      element.classList.remove('text-updating');
    }, this.animationDuration);
  }

  showError(message) {
    if (!this.resultElement) return;

    // Show error with animation
    this.resultElement.textContent = 'Error';
    this.resultElement.classList.add('error');
    
    // Show error message in expression area
    if (this.expressionElement) {
      this.expressionElement.textContent = message;
      this.expressionElement.classList.add('error');
    }

    // Auto-hide error after duration
    setTimeout(() => {
      this.clearError();
    }, this.errorDisplayDuration);
  }

  clearError() {
    if (this.resultElement) {
      this.resultElement.classList.remove('error');
    }
    if (this.expressionElement) {
      this.expressionElement.classList.remove('error');
    }
  }

  showSuccess() {
    if (!this.resultElement) return;

    this.resultElement.classList.add('success');
    setTimeout(() => {
      this.resultElement.classList.remove('success');
    }, 1000);
  }

  updateHistoryDisplay(history) {
    if (!this.historyList) return;

    // Clear existing history
    this.historyList.innerHTML = '';

    if (history.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'history-empty';
      emptyMessage.textContent = 'No calculations yet';
      this.historyList.appendChild(emptyMessage);
      return;
    }

    // Add history items
    history.forEach(item => {
      const historyItem = this.createHistoryItem(item);
      this.historyList.appendChild(historyItem);
    });

    // Scroll to top
    this.historyList.scrollTop = 0;
  }

  createHistoryItem(item) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.dataset.expression = item.expression;
    historyItem.dataset.result = item.result;
    historyItem.setAttribute('role', 'listitem');
    historyItem.setAttribute('tabindex', '0');
    historyItem.setAttribute('aria-label', `Calculation: ${item.expression} equals ${item.result}`);

    const expressionDiv = document.createElement('div');
    expressionDiv.className = 'history-item__expression';
    expressionDiv.textContent = item.expression;

    const resultDiv = document.createElement('div');
    resultDiv.className = 'history-item__result';
    resultDiv.textContent = this.formatNumber(item.result);

    historyItem.appendChild(expressionDiv);
    historyItem.appendChild(resultDiv);

    // Add click handler
    historyItem.addEventListener('click', () => {
      this.selectHistoryItem(historyItem);
    });

    // Add keyboard support
    historyItem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.selectHistoryItem(historyItem);
      }
    });

    return historyItem;
  }

  selectHistoryItem(historyItem) {
    // Remove previous selection
    document.querySelectorAll('.history-item').forEach(item => {
      item.classList.remove('selected');
    });

    // Add selection to current item
    historyItem.classList.add('selected');

    // Dispatch event for other modules to handle
    const event = new CustomEvent('history-item-selected', {
      detail: {
        expression: historyItem.dataset.expression,
        result: historyItem.dataset.result
      }
    });
    document.dispatchEvent(event);
  }

  toggleHistoryPanel() {
    if (!this.historyPanel) return;

    this.isHistoryVisible = !this.isHistoryVisible;
    
    if (this.isHistoryVisible) {
      this.showHistoryPanel();
    } else {
      this.hideHistoryPanel();
    }

    // Update button state
    this.updateHistoryToggleButton();
  }

  showHistoryPanel() {
    if (!this.historyPanel) return;

    this.historyPanel.classList.remove('hidden');
    this.historyPanel.setAttribute('aria-hidden', 'false');
    
    // Focus first history item if available
    const firstItem = this.historyPanel.querySelector('.history-item');
    if (firstItem) {
      firstItem.focus();
    }
  }

  hideHistoryPanel() {
    if (!this.historyPanel) return;

    this.historyPanel.classList.add('hidden');
    this.historyPanel.setAttribute('aria-hidden', 'true');
  }

  updateHistoryToggleButton() {
    const toggleButton = document.querySelector('.history-toggle');
    const iconElement = document.querySelector('.history-toggle__icon');
    if (toggleButton) {
      toggleButton.setAttribute('aria-pressed', this.isHistoryVisible.toString());
      toggleButton.classList.toggle('active', this.isHistoryVisible);
      
      // Update icon based on visibility state
      if (iconElement) {
        iconElement.textContent = this.isHistoryVisible ? '⟲' : '⟲';
      }
    }
  }

  updateThemeIcon() {
    const themeToggle = document.querySelector('.theme-toggle__icon');
    if (themeToggle) {
      // This will be updated by ThemeManager
      // Just ensure the element exists
    }
  }

  handleKeyboardAction(action) {
    switch (action) {
    case 'history-toggle':
      this.toggleHistoryPanel();
      break;
    case 'theme-toggle':
      // This will be handled by ThemeManager
      break;
    case 'clear':
      this.clearError();
      break;
    }
  }

  handleResize() {
    // Adjust layout on resize
    if (window.innerWidth < 768) {
      this.hideHistoryPanel();
    }
  }

  formatNumber(number) {
    if (number === null || number === undefined) {
      return '0';
    }
    
    if (typeof number !== 'number') {
      const parsed = parseFloat(number);
      if (isNaN(parsed)) {
        return String(number);
      }
      number = parsed;
    }

    // Handle very large or very small numbers
    if (Math.abs(number) > 1e15 || (Math.abs(number) < 1e-10 && number !== 0)) {
      return number.toExponential(6);
    }

    // Handle decimal numbers
    if (number % 1 !== 0) {
      // Limit decimal places to prevent display overflow
      const rounded = Math.round(number * 1e10) / 1e10;
      return rounded.toString();
    }

    return number.toString();
  }



  // Show notification
  showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');

    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 16px',
      borderRadius: '4px',
      color: 'white',
      fontWeight: '500',
      zIndex: '1000',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out'
    });

    // Set background color based on type
    const colors = {
      info: '#007bff',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove after duration
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
  }

  // Get UI statistics
  getUIStats() {
    return {
      isHistoryVisible: this.isHistoryVisible,
      historyItemCount: this.historyList ? this.historyList.children.length : 0,
      displayText: this.resultElement ? this.resultElement.textContent : '',
      expressionText: this.expressionElement ? this.expressionElement.textContent : ''
    };
  }
}
