import { describe, expect, it } from 'vitest';

import { transform, transformInPlace } from './transform.ts';

describe('Array Transform', () => {
  describe('basic transformation', () => {
    it('should transform and filter even numbers', () => {
      const result = transform([1, 2, 3, 4], (n) => (n % 2 === 0 ? n * 2 : undefined));
      expect(result).toEqual([4, 8]);
    });

    it('should transform strings to uppercase and filter', () => {
      const result = transform(['a', 'b', 'c'], (s) => (s === 'b' ? undefined : s.toUpperCase()));
      expect(result).toEqual(['A', 'C']);
    });

    it('should transform all elements', () => {
      const result = transform([1, 2, 3], (n) => n * 2);
      expect(result).toEqual([2, 4, 6]);
    });

    it('should filter all elements', () => {
      const result = transform([1, 2, 3], () => undefined);
      expect(result).toEqual([]);
    });
  });

  describe('type transformations', () => {
    it('should transform numbers to strings', () => {
      const result = transform([1, 2, 3], String);
      expect(result).toEqual(['1', '2', '3']);
    });

    it('should transform strings to numbers', () => {
      const result = transform(['1', '2', 'x', '3'], (s) => {
        const num = Number(s);
        return Number.isNaN(num) ? undefined : num;
      });
      expect(result).toEqual([1, 2, 3]);
    });

    it('should transform objects to specific properties', () => {
      const objects = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
      ];
      const result = transform(objects, (obj) => obj.name);
      expect(result).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('should transform and extract nested properties', () => {
      const items = [
        { user: { id: 1, active: true } },
        { user: { id: 2, active: false } },
        { user: { id: 3, active: true } }
      ];
      const result = transform(items, (item) => (item.user.active ? item.user.id : undefined));
      expect(result).toEqual([1, 3]);
    });
  });

  describe('filtering behavior', () => {
    it('should keep null values', () => {
      const result = transform([1, 2, 3], (n) => (n === 2 ? null : n));
      expect(result).toEqual([1, null, 3]);
    });

    it('should keep zero values', () => {
      const result = transform([1, 2, 3], (n) => (n === 2 ? 0 : n));
      expect(result).toEqual([1, 0, 3]);
    });

    it('should keep false values', () => {
      const result = transform([1, 2, 3], (n) => (n === 2 ? false : true));
      expect(result).toEqual([true, false, true]);
    });

    it('should keep empty string values', () => {
      const result = transform(['a', 'b', 'c'], (s) => (s === 'b' ? '' : s));
      expect(result).toEqual(['a', '', 'c']);
    });

    it('should filter only undefined', () => {
      const result = transform([1, undefined, 2, null, 3, 0], (n) => n);
      expect(result).toEqual([1, 2, null, 3, 0]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const result = transform([], (n) => n * 2);
      expect(result).toEqual([]);
    });

    it('should handle single element', () => {
      const result = transform([42], (n) => n * 2);
      expect(result).toEqual([84]);
    });

    it('should handle single element filtered', () => {
      const result = transform([42], () => undefined);
      expect(result).toEqual([]);
    });

    it('should handle array with all undefined results', () => {
      const result = transform([1, 2, 3, 4, 5], (n) => (n > 10 ? n : undefined));
      expect(result).toEqual([]);
    });

    it('should handle array with no undefined results', () => {
      const result = transform([1, 2, 3, 4, 5], (n) => n * 2);
      expect(result).toEqual([2, 4, 6, 8, 10]);
    });
  });

  describe('complex transformations', () => {
    it('should parse JSON strings and filter invalid ones', () => {
      const jsons = ['{"a":1}', 'invalid', '{"b":2}', '{"c":3}'];
      const result = transform(jsons, (str) => {
        try {
          return JSON.parse(str);
        } catch {
          return undefined;
        }
      });
      expect(result).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }]);
    });

    it('should transform with conditional logic', () => {
      const result = transform([1, 2, 3, 4, 5, 6], (n) => {
        if (n < 3) return n;
        if (n > 4) return n * 2;
        return undefined;
      });
      expect(result).toEqual([1, 2, 10, 12]);
    });

    it('should chain transformations', () => {
      const result = transform(['1', '2', 'x', '3', '4'], (s) => {
        const num = Number(s);
        if (Number.isNaN(num)) return undefined;
        return num % 2 === 0 ? num * 2 : undefined;
      });
      expect(result).toEqual([4, 8]);
    });

    it('should flatten and filter nested arrays', () => {
      const nested = [
        [1, 2],
        [3, 4],
        [5, 6]
      ];
      const result = transform(nested, (arr) => {
        const sum = arr.reduce((a, b) => a + b, 0);
        return sum > 5 ? sum : undefined;
      });
      expect(result).toEqual([7, 11]);
    });
  });

  describe('performance and iteration', () => {
    it('should iterate exactly once', () => {
      let iterations = 0;
      transform([1, 2, 3, 4, 5], (n) => {
        iterations++;
        return n * 2;
      });
      expect(iterations).toBe(5);
    });

    it('should handle large arrays', () => {
      const large = Array.from({ length: 10_000 }, (_, i) => i);
      const result = transform(large, (n) => (n % 2 === 0 ? n : undefined));
      expect(result.length).toBe(5000);
      expect(result[0]).toBe(0);
      expect(result.at(-1)).toBe(9998);
    });
  });

  describe('preserves original array', () => {
    it('should not modify original array', () => {
      const original = [1, 2, 3, 4, 5];
      const copy = [...original];
      transform(original, (n) => n * 2);
      expect(original).toEqual(copy);
    });
  });
  describe('InPlace', () => {
    it('should modify original array when inPlace is true', () => {
      const original = [1, 2, 3, 4, 5];
      transformInPlace(original, (n) => (n % 2 === 0 ? n * 2 : undefined));
      expect(original).toEqual([4, 8]);
    });
  });
});
