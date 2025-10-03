// Calculator module - handles all mathematical operations
export class Calculator {
  constructor() {
    this.expression = '';
    this.result = '';
    this.lastResult = null;
    this.memory = 0;
    this.isNewExpression = true;
    this.angleMode = 'rad'; // 'rad' or 'deg'
    
    // Mathematical constants
    this.constants = {
      pi: Math.PI,
      e: Math.E,
      phi: (1 + Math.sqrt(5)) / 2, // Golden ratio
    };
    
    // Supported functions
    this.functions = {
      sin: (x) => Math.sin(this.angleMode === 'deg' ? x * Math.PI / 180 : x),
      cos: (x) => Math.cos(this.angleMode === 'deg' ? x * Math.PI / 180 : x),
      tan: (x) => Math.tan(this.angleMode === 'deg' ? x * Math.PI / 180 : x),
      asin: (x) => {
        const result = Math.asin(x);
        return this.angleMode === 'deg' ? result * 180 / Math.PI : result;
      },
      acos: (x) => {
        const result = Math.acos(x);
        return this.angleMode === 'deg' ? result * 180 / Math.PI : result;
      },
      atan: (x) => {
        const result = Math.atan(x);
        return this.angleMode === 'deg' ? result * 180 / Math.PI : result;
      },
      log: Math.log,
      log10: Math.log10,
      log2: Math.log2,
      sqrt: Math.sqrt,
      cbrt: (x) => Math.pow(x, 1/3),
      pow: Math.pow,
      exp: Math.exp,
      abs: Math.abs,
      ceil: Math.ceil,
      floor: Math.floor,
      round: Math.round,
      factorial: this.factorial,
      reciprocal: (x) => 1 / x,
      square: (x) => x * x,
      cube: (x) => x * x * x,
      percent: (x) => x / 100,
    };
  }

  init() {
    this.updateDisplay();
  }

  // Safe factorial function with validation
  factorial(n) {
    // Convert to number if it's a string
    const num = typeof n === 'string' ? parseFloat(n) : n;
    
    if (!Number.isFinite(num)) {
      throw new Error('Factorial requires a finite number');
    }
    
    if (!Number.isInteger(num) || num < 0) {
      throw new Error('Factorial is only defined for non-negative integers');
    }
    
    if (num > 170) {
      throw new Error('Factorial too large (max 170)');
    }
    
    if (num === 0 || num === 1) return 1;
    
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
  }

  // Safe evaluation using a parser instead of eval
  evaluate(expression) {
    try {
      // Replace constants
      let processedExpression = expression
        .replace(/\bpi\b/g, this.constants.pi)
        .replace(/\be\b/g, this.constants.e)
        .replace(/\bphi\b/g, this.constants.phi)
        .replace(/\bans\b/g, this.lastResult || 0);

      // Replace function calls
      for (const [funcName, func] of Object.entries(this.functions)) {
        const regex = new RegExp(`\\b${funcName}\\s*\\(`, 'g');
        processedExpression = processedExpression.replace(regex, `this.functions.${funcName}(`);
      }

      // Replace operators
      processedExpression = processedExpression
        .replace(/\^/g, '**')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');

      // Validate expression for security
      if (!this.isValidExpression(processedExpression)) {
        throw new Error('Invalid expression');
      }

      // Use Function constructor for safer evaluation than eval
      const result = new Function('return ' + processedExpression)();
      
      if (!isFinite(result)) {
        if (isNaN(result)) {
          throw new Error('Result is not a number');
        } else if (result === Infinity || result === -Infinity) {
          throw new Error('Result is infinite');
        } else {
          throw new Error('Result is not a finite number');
        }
      }

      return result;
    } catch (error) {
      throw new Error(`Calculation error: ${error.message}`);
    }
  }

  // Validate expression to prevent code injection
  isValidExpression(expression) {
    // Allow only numbers, operators, parentheses, and function calls
    const validPattern = /^[0-9+\-*/().\s]*$/;
    const functionPattern = /this\.functions\.\w+\(/g;
    
    // Remove function calls for basic validation
    let cleanExpression = expression.replace(functionPattern, '');
    
    // Check for balanced parentheses
    if (!this.hasBalancedParentheses(expression)) {
      return false;
    }
    
    // Check for valid pattern
    if (!validPattern.test(cleanExpression)) {
      return false;
    }
    
    // Check for consecutive operators (basic validation)
    if (/([+\-*/]{2,})/.test(cleanExpression)) {
      return false;
    }
    
    return true;
  }

  hasBalancedParentheses(expression) {
    let count = 0;
    for (let char of expression) {
      if (char === '(') count++;
      if (char === ')') count--;
      if (count < 0) return false;
    }
    return count === 0;
  }

  handleAction(action) {
    switch (action) {
      case 'clear':
        this.clear();
        break;
      case 'ce':
        this.clearEntry();
        break;
      case 'backspace':
        this.backspace();
        break;
      case 'equals':
        return this.calculate();
      case 'ans':
        if (this.lastResult !== null) {
          this.appendNumber(this.lastResult.toString());
        }
        break;
      case 'memory-clear':
        this.memory = 0;
        break;
      case 'memory-recall':
        this.appendNumber(this.memory.toString());
        break;
      case 'memory-add':
        this.memory += this.lastResult || 0;
        break;
      case 'memory-subtract':
        this.memory -= this.lastResult || 0;
        break;
      case 'random':
        const random = Math.random();
        this.appendNumber(random.toString());
        break;
      case 'negate':
        this.negate();
        break;
      default:
        if (this.isNumber(action)) {
          this.appendNumber(action);
        } else if (this.isOperator(action)) {
          this.appendOperator(action);
        } else if (this.isFunction(action)) {
          this.appendFunction(action);
        } else if (this.isConstant(action)) {
          this.appendConstant(action);
        }
    }
    
    this.updateDisplay();
    return null;
  }

  isNumber(value) {
    return /^[0-9.]$/.test(value);
  }

  isOperator(value) {
    return /^[+\-*/()^%]$/.test(value);
  }

  isFunction(value) {
    return Object.keys(this.functions).includes(value);
  }

  isConstant(value) {
    return Object.keys(this.constants).includes(value);
  }

  appendNumber(number) {
    if (this.isNewExpression) {
      this.expression = number;
      this.result = ''; // Clear the result when starting new expression
      this.isNewExpression = false;
    } else {
      // Prevent multiple decimal points
      if (number === '.' && this.expression.includes('.')) {
        return;
      }
      // Prevent leading zeros (except for decimal numbers)
      if (number === '0' && this.expression === '0') {
        return;
      }
      this.expression += number;
    }
  }

  appendOperator(operator) {
    if (this.isNewExpression && this.lastResult !== null) {
      this.expression = this.lastResult.toString();
      this.result = ''; // Clear the result when starting new expression
      this.isNewExpression = false;
    }
    
    // Handle special operators
    const operatorMap = {
      '+': '+',
      '-': '−',
      '*': '×',
      '/': '÷',
      '^': '^',
      '%': '%',
      '(': '(',
      ')': ')'
    };
    
    this.expression += operatorMap[operator] || operator;
  }

  appendFunction(funcName) {
    if (this.isNewExpression) {
      this.expression = '';
      this.isNewExpression = false;
    }
    
    // Add multiplication if needed
    if (this.expression && !this.expression.endsWith('(') && !this.expression.endsWith('×') && !this.expression.endsWith('÷') && !this.expression.endsWith('+') && !this.expression.endsWith('−')) {
      this.expression += '×';
    }
    
    this.expression += `${funcName}(`;
  }

  appendConstant(constant) {
    if (this.isNewExpression) {
      this.expression = '';
      this.isNewExpression = false;
    }
    
    // Add multiplication if needed
    if (this.expression && !this.expression.endsWith('(') && !this.expression.endsWith('×') && !this.expression.endsWith('÷') && !this.expression.endsWith('+') && !this.expression.endsWith('−')) {
      this.expression += '×';
    }
    
    this.expression += constant;
  }

  calculate() {
    if (!this.expression) return null;
    
    try {
      const result = this.evaluate(this.expression);
      this.lastResult = result;
      this.result = result.toString();
      this.isNewExpression = true;
      
      
      return {
        expression: this.expression,
        result: result
      };
    } catch (error) {
      throw error;
    }
  }

  clear() {
    this.expression = '';
    this.result = '';
    this.lastResult = null;
    this.isNewExpression = true;
  }

  clearEntry() {
    if (this.isNewExpression) {
      this.clear();
    } else {
      this.expression = '';
    }
  }

  backspace() {
    if (this.expression.length > 0) {
      this.expression = this.expression.slice(0, -1);
    }
  }

  negate() {
    if (this.expression) {
      // If expression starts with a negative sign, remove it
      if (this.expression.startsWith('-')) {
        this.expression = this.expression.substring(1);
      } else {
        // Add negative sign to the beginning
        this.expression = `-${this.expression}`;
      }
    } else if (this.lastResult !== null) {
      this.expression = `-(${this.lastResult})`;
      this.isNewExpression = false;
    }
  }

  setExpression(expression) {
    this.expression = expression;
    this.isNewExpression = false;
    this.updateDisplay();
  }

  getDisplayState() {
    let result = '0';
    
    // If we have a calculated result, use it
    if (this.result && this.result !== '') {
      result = this.result;
    } else if (this.lastResult !== null) {
      result = this.lastResult.toString();
    }
    
    const state = {
      expression: this.expression || '0',
      result: result
    };
    return state;
  }

  updateDisplay() {
    // Only update result if we don't have a calculated result
    if (!this.lastResult) {
      this.result = this.expression || '0';
    }
  }

  setAngleMode(mode) {
    if (mode === 'rad' || mode === 'deg') {
      this.angleMode = mode;
    }
  }

  getAngleMode() {
    return this.angleMode;
  }
}
