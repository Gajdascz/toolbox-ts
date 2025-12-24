import { describe, expect, it } from 'vitest';

import { dedupeArrays, merge, toArray, when } from './utils.js';

describe('utils', () => {
  describe('dedupeArrays', () => {
    it('should deduplicate values from multiple arrays', () => {
      const result = dedupeArrays([1, 2, 3], [2, 3, 4], [3, 4, 5]);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle empty arrays', () => {
      const result = dedupeArrays([], [], []);

      expect(result).toEqual([]);
    });

    it('should handle single array', () => {
      const result = dedupeArrays([1, 2, 2, 3]);

      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('toArray', () => {
    it('should return empty array for undefined', () => {
      expect(toArray(undefined)).toEqual([]);
    });

    it('should return empty array for null', () => {
      expect(toArray(null)).toEqual([]);
    });

    it('should return same array if already array', () => {
      expect(toArray([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should wrap non-array value in array', () => {
      expect(toArray('value')).toEqual(['value']);
    });
  });

  describe('when', () => {
    it('should return value when condition is truthy', () => {
      expect(when(true, 'value')).toBe('value');
    });

    it('should return undefined when condition is falsy', () => {
      expect(when(false, 'value')).toBeUndefined();
    });

    it('should handle truthy conditions', () => {
      expect(when('non-empty', 42)).toBe(42);
    });

    it('should handle falsy conditions', () => {
      expect(when(0, 'value')).toBeUndefined();
    });
  });
  describe('merge', () => {
    it('should deeply merge two objects', () => {
      const obj1 = { a: 1, b: { c: 2, d: [3, 4] } };
      const obj2 = { b: { c: 3, d: [4, 5], e: 6 }, f: 7 };
      const result = merge<typeof obj1 & typeof obj2>(obj1, obj2);
      expect(result).toEqual({ a: 1, b: { c: 3, d: [3, 4, 5], e: 6 }, f: 7 });
    });
    it('should not mutate original objects when mutate is false', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { b: { d: 3 } };
      const result = merge<typeof obj1 & typeof obj2>(obj1, obj2, false);
      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 } });
      expect(obj1).toEqual({ a: 1, b: { c: 2 } });
      expect(obj2).toEqual({ b: { d: 3 } });
    });
    it('should mutate original object when mutate is true', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { b: { d: 3 } };
      const result = merge<typeof obj1 & typeof obj2>(obj1, obj2, true);
      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 } });
      expect(obj1).toEqual({ a: 1, b: { c: 2, d: 3 } });
      expect(obj2).toEqual({ b: { d: 3 } });
    });
    it('should return original object if second object is undefined or null', () => {
      const obj1 = { a: 1, b: 2 };
      expect(merge<typeof obj1>(obj1, undefined)).toEqual(obj1);
      expect(merge<typeof obj1>(obj1, null)).toEqual(obj1);
    });
  });
});
