// HistoryManager module - handles calculation history
export class HistoryManager {
  constructor() {
    this.history = [];
    this.maxHistoryItems = 50; // Limit history size
    this.storageKey = 'calculator-history';
  }

  init() {
    this.loadHistory();
  }

  addToHistory(expression, result) {
    // Check if this exact calculation already exists in history
    const isDuplicate = this.history.some(item => 
      item.expression === expression && item.result === result
    );

    // Don't add if it's a duplicate
    if (isDuplicate) {
      return;
    }

    const historyItem = {
      id: Date.now() + Math.random(), // Unique ID
      expression: expression,
      result: result,
      timestamp: new Date().toISOString()
    };

    // Add to beginning of array (most recent first)
    this.history.unshift(historyItem);

    // Limit history size
    if (this.history.length > this.maxHistoryItems) {
      this.history = this.history.slice(0, this.maxHistoryItems);
    }

    // Save to localStorage
    this.saveHistory();
  }

  getHistory() {
    return [...this.history]; // Return copy to prevent external modification
  }

  clearHistory() {
    this.history = [];
    this.saveHistory();
  }

  removeHistoryItem(id) {
    this.history = this.history.filter(item => item.id !== id);
    this.saveHistory();
  }

  getHistoryItem(id) {
    return this.history.find(item => item.id === id);
  }

  searchHistory(query) {
    const lowercaseQuery = query.toLowerCase();
    return this.history.filter(item => 
      item.expression.toLowerCase().includes(lowercaseQuery) ||
      item.result.toString().toLowerCase().includes(lowercaseQuery)
    );
  }

  exportHistory() {
    return {
      history: this.history,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  }

  importHistory(data) {
    try {
      if (data && Array.isArray(data.history)) {
        this.history = data.history.slice(0, this.maxHistoryItems);
        this.saveHistory();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing history:', error);
      return false;
    }
  }

  saveHistory() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.history));
    } catch (error) {
      console.error('Error saving history to localStorage:', error);
    }
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          this.history = parsed;
        }
      }
    } catch (error) {
      console.error('Error loading history from localStorage:', error);
      this.history = [];
    }
  }

  // Get statistics about history
  getStatistics() {
    const total = this.history.length;
    const today = new Date().toDateString();
    const todayCount = this.history.filter(item => 
      new Date(item.timestamp).toDateString() === today
    ).length;

    const operations = this.history.reduce((acc, item) => {
      const expr = item.expression;
      if (expr.includes('+')) acc.addition++;
      if (expr.includes('−') || expr.includes('-')) acc.subtraction++;
      if (expr.includes('×') || expr.includes('*')) acc.multiplication++;
      if (expr.includes('÷') || expr.includes('/')) acc.division++;
      if (expr.includes('^') || expr.includes('**')) acc.power++;
      if (expr.includes('√') || expr.includes('sqrt')) acc.sqrt++;
      if (expr.includes('sin') || expr.includes('cos') || expr.includes('tan')) acc.trigonometry++;
      return acc;
    }, {
      addition: 0,
      subtraction: 0,
      multiplication: 0,
      division: 0,
      power: 0,
      sqrt: 0,
      trigonometry: 0
    });

    return {
      total,
      todayCount,
      operations,
      averageResult: this.history.length > 0 ? 
        this.history.reduce((sum, item) => sum + Math.abs(Number(item.result)), 0) / this.history.length : 0
    };
  }
}
