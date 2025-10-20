import { describe, expect, it, vi } from 'vitest';

import { EXPECT, mockFirstArgsMatch } from './helpers.ts';

describe('mockFirstArgsMatch', () => {
  it('returns true when first args of each call match expectations', () => {
    const m = vi.fn();
    m('a');
    m('b');
    expect(mockFirstArgsMatch(m, ['a', 'b'])).toBe(true);
  });

  it('returns false when any first arg mismatches', () => {
    const m = vi.fn();
    m('a');
    m('c');
    expect(mockFirstArgsMatch(m, ['a', 'b'])).toBe(false);
  });

  it('returns false when expected args are more than calls made', () => {
    const m = vi.fn();
    m('only');
    expect(mockFirstArgsMatch(m, ['only', 'missing'])).toBe(false);
  });

  it('handles deep-equality for objects and arrays', () => {
    const m = vi.fn();
    m({ x: 1, y: { z: [1, 2] } });
    m([1, 2, { a: 'x' }]);
    expect(
      mockFirstArgsMatch(m, [{ x: 1, y: { z: [1, 2] } }, [1, 2, { a: 'x' }]])
    ).toBe(true);
  });

  it('returns true for empty expected args array (vacuously true)', () => {
    const m = vi.fn();
    expect(mockFirstArgsMatch(m, [])).toBe(true);
  });
});
describe('EXPECT', () => {
  describe('toThrow', () => {
    it('should pass when function throws expected error', () => {
      const fn = () => {
        throw new TypeError('error');
      };
      EXPECT.toThrow(fn, TypeError);
    });

    it('should fail when function does not throw', () => {
      const fn = () => {};
      expect(() => EXPECT.toThrow(fn, TypeError)).toThrow();
    });
  });
  describe('notToThrow', () => {
    it('should pass when function does not throw', () => {
      const fn = () => {};
      EXPECT.notToThrow(fn);
    });
    it('should fail when function throws', () => {
      const fn = () => {
        throw new Error('error');
      };
      expect(() => EXPECT.notToThrow(fn)).toThrow();
    });
  });
  describe('every', () => {
    it('should return true if all functions return true', () => {
      const funcs = [() => true, () => 1 === 1, () => 'a'.length === 1];
      EXPECT.every(funcs, (f) => f() === true);
    });
  });
  describe('some', () => {
    it('should return true if at least one function returns true', () => {
      const funcs = [() => false, () => 1 === 1, () => 'a'.length === 2];
      EXPECT.some(funcs, (f) => f() === true);
    });
  });
});
