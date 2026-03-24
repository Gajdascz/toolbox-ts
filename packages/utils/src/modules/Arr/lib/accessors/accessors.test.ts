import { describe, expect, expectTypeOf, it } from 'vitest';

import { at, atOrThrow, first, firstOrThrow, last, lastIndex, lastOrThrow } from './accessors.ts';

const testArray = [1, 2, 3, 4, 5];

describe('Array Accessors', () => {
  describe('at & atOrThrow', () => {
    it('in-bound positive index', () => {
      expect(at(testArray, 0)).toBe(1);
      expect(atOrThrow(testArray, 0)).toBe(1);
    });
    it('in-bound negative index', () => {
      expect(at(testArray, -1)).toBe(5);
      expect(atOrThrow(testArray, -1)).toBe(5);
    });
    it('out-of-bounds index', () => {
      expect(at(testArray, 10)).toBeUndefined();
      expect(() => atOrThrow(testArray, 10)).toThrow();
    });
    it('uses fallback if provided', () => {
      const result1 = at(testArray, 10, null);
      expect(result1).toBe(null);
      expectTypeOf(result1).toEqualTypeOf<number | null>();
      const result2 = at(testArray, 100, 'out-of-bounds' as const);
      expect(result2).toBe('out-of-bounds');
      expectTypeOf(result2).toEqualTypeOf<number | 'out-of-bounds'>();
      const result3 = at(testArray, 100);
      expect(result3).toBe(undefined);
      expectTypeOf(result3).toEqualTypeOf<number | undefined>();
    });
  });
  describe('last & lastOrThrow', () => {
    it('non-empty array', () => {
      expect(last(testArray)).toBe(5);
      expect(lastOrThrow(testArray)).toBe(5);
    });
    it('empty array', () => {
      expect(last([])).toBeUndefined();
      expect(() => lastOrThrow([])).toThrow();
    });
  });
  describe('first & firstOrThrow', () => {
    it('non-empty array', () => {
      expect(first(testArray)).toBe(1);
      expect(firstOrThrow(testArray)).toBe(1);
    });
    it('empty array', () => {
      expect(first([])).toBeUndefined();
      expect(() => firstOrThrow([])).toThrow();
    });
  });
  describe('lastIndex', () => {
    it('non-empty array', () => {
      expect(lastIndex(testArray)).toBe(4);
    });
    it('empty array', () => {
      expect(lastIndex([])).toBe(-1);
    });
  });
});
