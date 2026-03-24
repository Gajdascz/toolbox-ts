import { describe, expect, it } from 'vitest';

import { split, splitAt } from './split.ts';

describe('Array Split', () => {
  describe('default behavior (floor)', () => {
    it('should split even-length array into two equal halves', () => {
      const [first, second] = split([1, 2, 3, 4]);
      expect(first).toEqual([1, 2]);
      expect(second).toEqual([3, 4]);
    });

    it('should split odd-length array with smaller first half', () => {
      const [first, second] = split([1, 2, 3, 4, 5]);
      expect(first).toEqual([1, 2]);
      expect(second).toEqual([3, 4, 5]);
    });

    it('should handle array with two elements', () => {
      const [first, second] = split([1, 2]);
      expect(first).toEqual([1]);
      expect(second).toEqual([2]);
    });

    it('should handle array with single element', () => {
      const [first, second] = split([42]);
      expect(first).toEqual([]);
      expect(second).toEqual([42]);
    });

    it('should handle empty array', () => {
      const [first, second] = split([]);
      expect(first).toEqual([]);
      expect(second).toEqual([]);
    });
  });

  describe('floor rounding', () => {
    it('should split with explicit floor rounding', () => {
      const [first, second] = split([1, 2, 3, 4, 5], 'floor');
      expect(first).toEqual([1, 2]);
      expect(second).toEqual([3, 4, 5]);
    });

    it('should split even-length array with floor', () => {
      const [first, second] = split([1, 2, 3, 4, 5, 6], 'floor');
      expect(first).toEqual([1, 2, 3]);
      expect(second).toEqual([4, 5, 6]);
    });

    it('should handle array with 7 elements', () => {
      const [first, second] = split([1, 2, 3, 4, 5, 6, 7], 'floor');
      expect(first).toEqual([1, 2, 3]);
      expect(second).toEqual([4, 5, 6, 7]);
    });
  });

  describe('ceil rounding', () => {
    it('should split with ceil rounding', () => {
      const [first, second] = split([1, 2, 3, 4, 5], 'ceil');
      expect(first).toEqual([1, 2, 3]);
      expect(second).toEqual([4, 5]);
    });

    it('should split even-length array with ceil', () => {
      const [first, second] = split([1, 2, 3, 4, 5, 6], 'ceil');
      expect(first).toEqual([1, 2, 3]);
      expect(second).toEqual([4, 5, 6]);
    });

    it('should handle array with 7 elements using ceil', () => {
      const [first, second] = split([1, 2, 3, 4, 5, 6, 7], 'ceil');
      expect(first).toEqual([1, 2, 3, 4]);
      expect(second).toEqual([5, 6, 7]);
    });

    it('should handle single element with ceil', () => {
      const [first, second] = split([42], 'ceil');
      expect(first).toEqual([42]);
      expect(second).toEqual([]);
    });

    it('should handle two elements with ceil', () => {
      const [first, second] = split([1, 2], 'ceil');
      expect(first).toEqual([1]);
      expect(second).toEqual([2]);
    });

    it('should handle three elements with ceil', () => {
      const [first, second] = split([1, 2, 3], 'ceil');
      expect(first).toEqual([1, 2]);
      expect(second).toEqual([3]);
    });
  });

  describe('type handling', () => {
    it('should split string array', () => {
      const [first, second] = split(['a', 'b', 'c', 'd']);
      expect(first).toEqual(['a', 'b']);
      expect(second).toEqual(['c', 'd']);
    });

    it('should split object array', () => {
      const items = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const [first, second] = split(items);
      expect(first).toEqual([{ id: 1 }, { id: 2 }]);
      expect(second).toEqual([{ id: 3 }, { id: 4 }]);
    });

    it('should split mixed type array', () => {
      const mixed: (number | string)[] = [1, 'a', 2, 'b'];
      const [first, second] = split(mixed);
      expect(first).toEqual([1, 'a']);
      expect(second).toEqual([2, 'b']);
    });

    it('should split boolean array', () => {
      const [first, second] = split([true, false, true, false, true]);
      expect(first).toEqual([true, false]);
      expect(second).toEqual([true, false, true]);
    });
  });

  describe('edge cases with different round types', () => {
    it('should handle large arrays with floor', () => {
      const arr = Array.from({ length: 100 }, (_, i) => i);
      const [first, second] = split(arr, 'floor');
      expect(first.length).toBe(50);
      expect(second.length).toBe(50);
      expect(first[0]).toBe(0);
      expect(first[49]).toBe(49);
      expect(second[0]).toBe(50);
      expect(second[49]).toBe(99);
    });

    it('should handle large arrays with ceil', () => {
      const arr = Array.from({ length: 101 }, (_, i) => i);
      const [first, second] = split(arr, 'ceil');
      expect(first.length).toBe(51);
      expect(second.length).toBe(50);
      expect(first[0]).toBe(0);
      expect(first[50]).toBe(50);
      expect(second[0]).toBe(51);
      expect(second[49]).toBe(100);
    });
  });

  describe('preserves original array', () => {
    it('should not modify original array', () => {
      const original = [1, 2, 3, 4, 5];
      const copy = [...original];
      split(original);
      expect(original).toEqual(copy);
    });

    it('should not modify original array with ceil', () => {
      const original = [1, 2, 3, 4, 5];
      const copy = [...original];
      split(original, 'ceil');
      expect(original).toEqual(copy);
    });
  });
});
it('splitAt should split array at given index', () => {
  const arr = [1, 2, 3, 4, 5];
  const [first, second] = splitAt(arr, 2);
  expect(first).toEqual([1, 2]);
  expect(second).toEqual([3, 4, 5]);
  expect(arr).toEqual([1, 2, 3, 4, 5]);
});
