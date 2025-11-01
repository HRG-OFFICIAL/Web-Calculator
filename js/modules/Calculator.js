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
      phi: (1 + Math.sqrt(5)) / 2 // Golden ratio
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
      percent: (x) => x / 100
    };
  }

  init() {
    this.updateDisplay();
  }

  // Factorial function with proper validation
  factorial(n) {
    const num = Number(n);
    
    if (!Number.isFinite(num) || !Number.isInteger(num) || num < 0) {
      throw new Error('Factorial is only defined for non-negative integers');
    }
    
    if (num > 170) {
      throw new Error('Factorial too large (max 170)');
    }
    
    if (num <= 1) return 1;
    
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
  }

  // Safe evaluation using math expression parser
  evaluate(expression) {
    try {
      // Replace constants first
      let processedExpression = expression
        .replace(/\bpi\b/g, this.constants.pi)
        .replace(/\be\b/g, this.constants.e)
        .replace(/\bphi\b/g, this.constants.phi)
        .replace(/\bans\b/g, this.lastResult || 0);

      // Replace operators with JavaScript equivalents
      processedExpression = processedExpression
        .replace(/\^/g, '**')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');

      // Process function calls safely
      processedExpression = this.processFunctionCalls(processedExpression);

      // Validate expression for security and correctness
      if (!this.isValidExpression(processedExpression)) {
        throw new Error('Invalid expression');
      }

      // Use safer math evaluation
      const result = this.safeEvaluate(processedExpression);
      
      if (!isFinite(result)) {
        if (isNaN(result)) {
          throw new Error('Result is not a number');
        } else if (result === Infinity || result === -Infinity) {
          throw new Error('Result is infinite');
        }
      }

      return result;
    } catch (error) {
      throw new Error(`Calculation error: ${error.message}`);
    }
  }

  // Process function calls with proper validation
  processFunctionCalls(expression) {
    let processed = expression;
    
    // Handle factorial function specially
    processed = processed.replace(/\bfactorial\s*\(([^)]+)\)/g, (_, args) => {
      if (!this.isValidFunctionArgs(args)) {
        throw new Error('Invalid arguments for factorial');
      }
      const num = parseFloat(args);
      return this.factorial(num).toString();
    });
    
    // Handle other special functions
    processed = processed.replace(/\breciprocal\s*\(([^)]+)\)/g, (_, args) => {
      return `(1/(${args}))`;
    });
    
    processed = processed.replace(/\bsquare\s*\(([^)]+)\)/g, (_, args) => {
      return `Math.pow(${args}, 2)`;
    });
    
    processed = processed.replace(/\bcube\s*\(([^)]+)\)/g, (_, args) => {
      return `Math.pow(${args}, 3)`;
    });
    
    processed = processed.replace(/\bpercent\s*\(([^)]+)\)/g, (_, args) => {
      return `((${args})/100)`;
    });
    
    // Handle trigonometric functions with angle mode conversion
    if (this.angleMode === 'deg') {
      processed = processed.replace(/\bsin\s*\(([^)]+)\)/g, (_, args) => {
        return `Math.sin((${args}) * Math.PI / 180)`;
      });
      processed = processed.replace(/\bcos\s*\(([^)]+)\)/g, (_, args) => {
        return `Math.cos((${args}) * Math.PI / 180)`;
      });
      processed = processed.replace(/\btan\s*\(([^)]+)\)/g, (_, args) => {
        return `Math.tan((${args}) * Math.PI / 180)`;
      });
    } else {
      processed = processed.replace(/\bsin\s*\(([^)]+)\)/g, (_, args) => {
        return `Math.sin(${args})`;
      });
      processed = processed.replace(/\bcos\s*\(([^)]+)\)/g, (_, args) => {
        return `Math.cos(${args})`;
      });
      processed = processed.replace(/\btan\s*\(([^)]+)\)/g, (_, args) => {
        return `Math.tan(${args})`;
      });
    }
    
    // Handle other Math functions
    for (const [funcName] of Object.entries(this.functions)) {
      if (['factorial', 'reciprocal', 'square', 'cube', 'percent', 'sin', 'cos', 'tan'].includes(funcName)) {
        continue; // Already handled above
      }
      
      const regex = new RegExp(`\\b${funcName}\\s*\\(([^)]+)\\)`, 'g');
      processed = processed.replace(regex, (_, args) => {
        if (!this.isValidFunctionArgs(args)) {
          throw new Error(`Invalid arguments for ${funcName}`);
        }
        return `Math.${this.getMathEquivalent(funcName)}(${args})`;
      });
    }
    
    return processed;
  }

  // Get Math object equivalent for custom functions
  getMathEquivalent(funcName) {
    const mathMapping = {
      'sin': 'sin', 'cos': 'cos', 'tan': 'tan',
      'asin': 'asin', 'acos': 'acos', 'atan': 'atan',
      'log': 'log', 'log10': 'log10', 'log2': 'log2',
      'sqrt': 'sqrt', 'cbrt': 'cbrt', 'exp': 'exp',
      'abs': 'abs', 'ceil': 'ceil', 'floor': 'floor', 'round': 'round',
      'pow': 'pow'
    };
    return mathMapping[funcName] || funcName;
  }

  // Validate function arguments
  isValidFunctionArgs(args) {
    if (!args || typeof args !== 'string') {
      return false;
    }
    // Basic validation for function arguments - allow numbers, operators, parentheses, decimals, spaces, and commas
    return /^[0-9+\-*/().\s,]*$/.test(args.trim());
  }

  // Safer evaluation method
  safeEvaluate(expression) {
    // Only allow basic math operations and Math object methods
    const allowedPattern = /^[0-9+\-*/().\s,Math.sincostalogqrtbcexpfloorundefinedPI*]*$/;
    if (!allowedPattern.test(expression)) {
      throw new Error('Expression contains invalid characters');
    }
    
    // Use Function constructor with restricted scope
    return new Function('Math', `"use strict"; return ${expression}`)(Math);
  }

  // Validate expression to prevent code injection and ensure correctness
  isValidExpression(expression) {
    // Allow numbers, operators, parentheses, Math functions, and constants
    const validPattern = /^[0-9+\-*/().\s,Math.sincostalogqrtbcexpfloorundefinedPI*]*$/;
    
    // Check for balanced parentheses
    if (!this.hasBalancedParentheses(expression)) {
      return false;
    }
    
    // Check for valid pattern
    if (!validPattern.test(expression)) {
      return false;
    }
    
    // Check for consecutive operators (but allow ** for power)
    if (/([+\-*/]{3,})/.test(expression)) {
      return false;
    }
    
    // Check for invalid sequences (but allow ** for power)
    if (/[+\-*/]{1}[+*/]/.test(expression) && !/\*\*/.test(expression)) {
      return false;
    }
    
    return true;
  }

  hasBalancedParentheses(expression) {
    let count = 0;
    for (const char of expression) {
      if (char === '(') count++;
      if (char === ')') count--;
      if (count < 0) return false;
    }
    return count === 0;
  }

  /**
   * Handle calculator actions (button clicks, keyboard input)
   * @param {string} action - The action to perform
   * @returns {Object|null} - Calculation result or null for non-calculation actions
   */
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
    if (typeof number !== 'string') {
      number = String(number);
    }
    
    if (this.isNewExpression) {
      this.expression = number;
      this.result = ''; // Clear the result when starting new expression
      this.isNewExpression = false;
    } else {
      // Prevent multiple decimal points in the current number
      const lastNumberMatch = this.expression.match(/[0-9.]+$/);
      const currentNumber = lastNumberMatch ? lastNumberMatch[0] : '';
      if (number === '.' && currentNumber.includes('.')) {
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
    this.updateDisplay();
  }

  clearEntry() {
    if (this.isNewExpression) {
      this.clear();
    } else {
      this.expression = '';
      this.updateDisplay();
    }
  }

  backspace() {
    if (this.expression.length > 0) {
      this.expression = this.expression.slice(0, -1);
      this.updateDisplay();
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
    if (typeof expression !== 'string') {
      expression = String(expression);
    }
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
