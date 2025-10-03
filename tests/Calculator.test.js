// Tests for Calculator module
import { Calculator } from '../js/modules/Calculator.js';

describe('Calculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
    calculator.init();
  });

  describe('Basic Operations', () => {
    test('should add two numbers', () => {
      calculator.setExpression('2+3');
      const result = calculator.calculate();
      expect(result.result).toBe(5);
    });

    test('should subtract two numbers', () => {
      calculator.setExpression('10-3');
      const result = calculator.calculate();
      expect(result.result).toBe(7);
    });

    test('should multiply two numbers', () => {
      calculator.setExpression('4*5');
      const result = calculator.calculate();
      expect(result.result).toBe(20);
    });

    test('should divide two numbers', () => {
      calculator.setExpression('15/3');
      const result = calculator.calculate();
      expect(result.result).toBe(5);
    });

    test('should handle decimal numbers', () => {
      calculator.setExpression('2.5+1.5');
      const result = calculator.calculate();
      expect(result.result).toBe(4);
    });
  });

  describe('Advanced Operations', () => {
    test('should calculate power', () => {
      calculator.setExpression('2^3');
      const result = calculator.calculate();
      expect(result.result).toBe(8);
    });

    test('should calculate square root', () => {
      calculator.setExpression('sqrt(16)');
      const result = calculator.calculate();
      expect(result.result).toBe(4);
    });

    test('should calculate factorial', () => {
      calculator.setExpression('factorial(5)');
      const result = calculator.calculate();
      expect(result.result).toBe(120);
    });

    test('should calculate sine', () => {
      calculator.setExpression('sin(0)');
      const result = calculator.calculate();
      expect(result.result).toBe(0);
    });

    test('should calculate cosine', () => {
      calculator.setExpression('cos(0)');
      const result = calculator.calculate();
      expect(result.result).toBe(1);
    });

    test('should calculate natural logarithm', () => {
      calculator.setExpression('log(e)');
      const result = calculator.calculate();
      expect(result.result).toBeCloseTo(1);
    });
  });

  describe('Constants', () => {
    test('should use pi constant', () => {
      calculator.setExpression('pi');
      const result = calculator.calculate();
      expect(result.result).toBeCloseTo(Math.PI);
    });

    test('should use e constant', () => {
      calculator.setExpression('e');
      const result = calculator.calculate();
      expect(result.result).toBeCloseTo(Math.E);
    });
  });

  describe('Error Handling', () => {
    test('should handle division by zero', () => {
      calculator.setExpression('1/0');
      expect(() => calculator.calculate()).toThrow();
    });

    test('should handle invalid expressions', () => {
      calculator.setExpression('2++3');
      expect(() => calculator.calculate()).toThrow();
    });

    test('should handle factorial of negative number', () => {
      calculator.setExpression('factorial(-1)');
      expect(() => calculator.calculate()).toThrow();
    });

    test('should handle factorial of non-integer', () => {
      calculator.setExpression('factorial(2.5)');
      expect(() => calculator.calculate()).toThrow();
    });
  });

  describe('Memory Functions', () => {
    test('should store and recall memory', () => {
      calculator.lastResult = 42;
      calculator.handleAction('memory-add');
      expect(calculator.memory).toBe(42);
      
      calculator.handleAction('memory-recall');
      expect(calculator.expression).toBe('42');
    });

    test('should clear memory', () => {
      calculator.memory = 100;
      calculator.handleAction('memory-clear');
      expect(calculator.memory).toBe(0);
    });
  });

  describe('Angle Modes', () => {
    test('should calculate sine in degrees', () => {
      calculator.setAngleMode('deg');
      calculator.setExpression('sin(90)');
      const result = calculator.calculate();
      expect(result.result).toBeCloseTo(1);
    });

    test('should calculate sine in radians', () => {
      calculator.setAngleMode('rad');
      calculator.setExpression('sin(pi/2)');
      const result = calculator.calculate();
      expect(result.result).toBeCloseTo(1);
    });
  });

  describe('Input Validation', () => {
    test('should validate expressions', () => {
      expect(calculator.isValidExpression('2+3')).toBe(true);
      expect(calculator.isValidExpression('2++3')).toBe(false);
      expect(calculator.isValidExpression('2+3)')).toBe(false);
    });

    test('should check balanced parentheses', () => {
      expect(calculator.hasBalancedParentheses('(2+3)')).toBe(true);
      expect(calculator.hasBalancedParentheses('(2+3')).toBe(false);
      expect(calculator.hasBalancedParentheses('2+3)')).toBe(false);
    });
  });

  describe('Display State', () => {
    test('should return correct display state', () => {
      calculator.setExpression('2+3');
      const state = calculator.getDisplayState();
      expect(state.expression).toBe('2+3');
      expect(state.result).toBe('2+3');
    });

    test('should handle empty expression', () => {
      const state = calculator.getDisplayState();
      expect(state.expression).toBe('0');
      expect(state.result).toBe('0');
    });
  });
});
