import { describe, expect, it } from 'vitest';

import { zip, zipFill, zipRemainder, zipWith } from './zip.ts';

describe('Array Zip', () => {
  describe('default', () => {
    it('should zip two arrays of equal length', () => {
      const result = zip([1, 2, 3], ['a', 'b', 'c']);
      expect(result).toEqual([
        [1, 'a'],
        [2, 'b'],
        [3, 'c']
      ]);
    });
    it('should zip with explicit default mode', () => {
      const result = zip([1, 2, 3], ['a', 'b', 'c']);
      expect(result).toEqual([
        [1, 'a'],
        [2, 'b'],
        [3, 'c']
      ]);
    });
    it('should stop at shorter array length', () => {
      const result = zip([1, 2], ['a', 'b', 'c']);
      expect(result).toEqual([
        [1, 'a'],
        [2, 'b']
      ]);
    });
    it('should stop at shorter array when first is longer', () => {
      const result = zip([1, 2, 3, 4], ['a', 'b']);
      expect(result).toEqual([
        [1, 'a'],
        [2, 'b']
      ]);
    });
    it('should handle empty first array', () => {
      const result = zip([], ['a', 'b', 'c']);
      expect(result).toEqual([]);
    });
    it('should handle empty second array', () => {
      const result = zip([1, 2, 3], []);
      expect(result).toEqual([]);
    });
    it('should handle both arrays empty', () => {
      const result = zip([], []);
      expect(result).toEqual([]);
    });
    it('should handle single element arrays', () => {
      const result = zip([1], ['a']);
      expect(result).toEqual([[1, 'a']]);
    });
  });
  describe('fill', () => {
    it('should fill with custom fill value', () => {
      const result = zipFill([1, 2], ['a', 'b', 'c'], 0);
      expect(result).toEqual([
        [1, 'a'],
        [2, 'b'],
        [0, 'c']
      ]);
    });

    it('should fill first array when second is longer', () => {
      const result = zipFill([1, 2], ['a', 'b', 'c', 'd'], -1);
      expect(result).toEqual([
        [1, 'a'],
        [2, 'b'],
        [-1, 'c'],
        [-1, 'd']
      ]);
    });

    it('should fill second array when first is longer', () => {
      const result = zipFill([1, 2, 3, 4], ['a', 'b'], 'x');
      expect(result).toEqual([
        [1, 'a'],
        [2, 'b'],
        [3, 'x'],
        [4, 'x']
      ]);
    });

    it('should handle empty first array with fill', () => {
      const result = zipFill([], ['a', 'b', 'c'], 0);
      expect(result).toEqual([
        [0, 'a'],
        [0, 'b'],
        [0, 'c']
      ]);
    });

    it('should handle empty second array with fill', () => {
      const result = zipFill([1, 2, 3], [], 'x');
      expect(result).toEqual([
        [1, 'x'],
        [2, 'x'],
        [3, 'x']
      ]);
    });

    it('should handle both empty arrays with fill', () => {
      const result = zipFill([], [], null);
      expect(result).toEqual([]);
    });

    it('should fill with object', () => {
      const fillObj = { empty: true };
      const result = zipFill([1, 2], ['a', 'b', 'c'], fillObj);
      expect(result).toEqual([
        [1, 'a'],
        [2, 'b'],
        [fillObj, 'c']
      ]);
    });
  });
  describe('remainder', () => {
    it('should return zipped and remainder when second is longer', () => {
      const result = zipRemainder([1, 2], ['a', 'b', 'c']);
      expect(result).toEqual({
        zipped: [
          [1, 'a'],
          [2, 'b']
        ],
        remainder: ['c']
      });
    });

    it('should return zipped and remainder when first is longer', () => {
      const result = zipRemainder([1, 2, 3, 4], ['a', 'b']);
      expect(result).toEqual({
        zipped: [
          [1, 'a'],
          [2, 'b']
        ],
        remainder: [3, 4]
      });
    });

    it('should return empty remainder for equal length arrays', () => {
      const result = zipRemainder([1, 2, 3], ['a', 'b', 'c']);
      expect(result).toEqual({
        zipped: [
          [1, 'a'],
          [2, 'b'],
          [3, 'c']
        ],
        remainder: []
      });
    });

    it('should handle empty first array', () => {
      const result = zipRemainder([], ['a', 'b', 'c']);
      expect(result).toEqual({ zipped: [], remainder: ['a', 'b', 'c'] });
    });

    it('should handle empty second array', () => {
      const result = zipRemainder([1, 2, 3], []);
      expect(result).toEqual({ zipped: [], remainder: [1, 2, 3] });
    });

    it('should handle both empty arrays', () => {
      const result = zipRemainder([], []);
      expect(result).toEqual({ zipped: [], remainder: [] });
    });

    it('should handle large remainder', () => {
      const result = zipRemainder([1], ['a', 'b', 'c', 'd', 'e']);
      expect(result).toEqual({ zipped: [[1, 'a']], remainder: ['b', 'c', 'd', 'e'] });
    });
  });
  describe('with', () => {
    it('should apply function to each pair of elements', () => {
      const result = zipWith([1, 2, 3], ['a', 'b', 'c'], (num, str) => `${num}${str}`);
      expect(result).toEqual(['1a', '2b', '3c']);
    });
    it('should handle arrays of different lengths', () => {
      const result = zipWith([1, 2], ['a', 'b', 'c'], (num, str) => `${num}${str}`);
      expect(result).toEqual(['1a', '2b']);
    });
    it('should handle empty arrays', () => {
      const result = zipWith<string[], string[]>([], [], (a, b) => a + b);
      expect(result).toEqual([]);
    });
  });

  describe('type handling', () => {
    it('should zip different primitive types', () => {
      const result = zip([1, 2, 3], [true, false, true]);
      expect(result).toEqual([
        [1, true],
        [2, false],
        [3, true]
      ]);
    });

    it('should zip objects and strings', () => {
      const objects = [{ id: 1 }, { id: 2 }];
      const result = zip(objects, ['a', 'b']);
      expect(result).toEqual([
        [{ id: 1 }, 'a'],
        [{ id: 2 }, 'b']
      ]);
    });

    it('should zip arrays with null and undefined', () => {
      const result = zip([1, null, 3], ['a', undefined, 'c']);
      expect(result).toEqual([
        [1, 'a'],
        [null, undefined],
        [3, 'c']
      ]);
    });

    it('should zip mixed types', () => {
      const mixed1: (number | string)[] = [1, 'a', 2];
      const mixed2: (boolean | null)[] = [true, null, false];
      const result = zip(mixed1, mixed2);
      expect(result).toEqual([
        [1, true],
        ['a', null],
        [2, false]
      ]);
    });
  });

  describe('edge cases and performance', () => {
    it('should handle large arrays in default mode', () => {
      const arr1 = Array.from({ length: 1000 }, (_, i) => i);
      const arr2 = Array.from({ length: 1000 }, (_, i) => String(i));
      const result = zip(arr1, arr2);
      expect(result.length).toBe(1000);
      expect(result[0]).toEqual([0, '0']);
      expect(result[999]).toEqual([999, '999']);
    });

    it('should handle large arrays in fill mode', () => {
      const arr1 = Array.from({ length: 100 }, (_, i) => i);
      const arr2 = Array.from({ length: 150 }, (_, i) => String(i));
      const result = zipFill(arr1, arr2, -1);
      expect(result.length).toBe(150);
      expect(result[99]).toEqual([99, '99']);
      expect(result[100]).toEqual([-1, '100']);
    });

    it('should handle large arrays in remainder mode', () => {
      const arr1 = Array.from({ length: 100 }, (_, i) => i);
      const arr2 = Array.from({ length: 150 }, (_, i) => String(i));
      const result = zipRemainder(arr1, arr2);
      expect(result.zipped.length).toBe(100);
      expect(result.remainder.length).toBe(50);
      expect(result.remainder[0]).toBe('100');
    });

    it('should handle arrays with single element difference', () => {
      const result = zipRemainder([1, 2, 3], ['a', 'b', 'c', 'd']);
      expect(result).toEqual({
        zipped: [
          [1, 'a'],
          [2, 'b'],
          [3, 'c']
        ],
        remainder: ['d']
      });
    });
  });

  describe('preserves original arrays', () => {
    it('should not modify original arrays', () => {
      const arr1 = [1, 2, 3];
      const arr2 = ['a', 'b', 'c'];
      const copy1 = [...arr1];
      const copy2 = [...arr2];
      zip(arr1, arr2);
      expect(arr1).toEqual(copy1);
      expect(arr2).toEqual(copy2);
    });

    it('should not modify original arrays in fill mode', () => {
      const arr1 = [1, 2];
      const arr2 = ['a', 'b', 'c'];
      const copy1 = [...arr1];
      const copy2 = [...arr2];
      zipFill(arr1, arr2, null);
      expect(arr1).toEqual(copy1);
      expect(arr2).toEqual(copy2);
    });

    it('should not modify original arrays in remainder mode', () => {
      const arr1 = [1, 2, 3, 4];
      const arr2 = ['a', 'b'];
      const copy1 = [...arr1];
      const copy2 = [...arr2];
      zipRemainder(arr1, arr2);
      expect(arr1).toEqual(copy1);
      expect(arr2).toEqual(copy2);
    });
  });
});
