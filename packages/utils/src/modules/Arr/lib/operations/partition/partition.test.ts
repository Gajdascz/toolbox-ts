import { describe, expect, it } from 'vitest';

import { partition } from './partition.ts';

describe('Array Partition', () => {
  describe('basic partitioning', () => {
    it('should partition numbers by even/odd', () => {
      const [evens, odds] = partition([1, 2, 3, 4, 5], (n) => n % 2 === 0);
      expect(evens).toEqual([2, 4]);
      expect(odds).toEqual([1, 3, 5]);
    });

    it('should partition strings by length', () => {
      const [long, short] = partition(['a', 'hello', 'hi', 'world', 'x'], (s) => s.length > 2);
      expect(long).toEqual(['hello', 'world']);
      expect(short).toEqual(['a', 'hi', 'x']);
    });

    it('should partition objects by property', () => {
      const items = [
        { id: 1, active: true },
        { id: 2, active: false },
        { id: 3, active: true },
        { id: 4, active: false }
      ];
      const [active, inactive] = partition(items, (item) => item.active);
      expect(active).toEqual([
        { id: 1, active: true },
        { id: 3, active: true }
      ]);
      expect(inactive).toEqual([
        { id: 2, active: false },
        { id: 4, active: false }
      ]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const [truthy, falsy] = partition([], (n) => n > 0);
      expect(truthy).toEqual([]);
      expect(falsy).toEqual([]);
    });

    it('should handle all elements matching predicate', () => {
      const [truthy, falsy] = partition([2, 4, 6, 8], (n) => n % 2 === 0);
      expect(truthy).toEqual([2, 4, 6, 8]);
      expect(falsy).toEqual([]);
    });

    it('should handle no elements matching predicate', () => {
      const [truthy, falsy] = partition([1, 3, 5, 7], (n) => n % 2 === 0);
      expect(truthy).toEqual([]);
      expect(falsy).toEqual([1, 3, 5, 7]);
    });

    it('should handle single element matching', () => {
      const [truthy, falsy] = partition([42], (n) => n > 0);
      expect(truthy).toEqual([42]);
      expect(falsy).toEqual([]);
    });

    it('should handle single element not matching', () => {
      const [truthy, falsy] = partition([-42], (n) => n > 0);
      expect(truthy).toEqual([]);
      expect(falsy).toEqual([-42]);
    });
  });

  describe('type handling', () => {
    it('should handle mixed types', () => {
      const items: (number | string)[] = [1, 'a', 2, 'b', 3];
      const [numbers, strings] = partition(items, (item) => typeof item === 'number');
      expect(numbers).toEqual([1, 2, 3]);
      expect(strings).toEqual(['a', 'b']);
    });

    it('should handle boolean values', () => {
      const [truthy, falsy] = partition([true, false, true, false], (b) => b);
      expect(truthy).toEqual([true, true]);
      expect(falsy).toEqual([false, false]);
    });

    it('should handle null and undefined', () => {
      const items = [1, null, 2, undefined, 3];
      const [defined, notDefined] = partition(items, (item) => item != null);
      expect(defined).toEqual([1, 2, 3]);
      expect(notDefined).toEqual([null, undefined]);
    });
  });

  describe('complex predicates', () => {
    it('should handle predicate with index access', () => {
      const arr = [10, 20, 30, 40, 50];
      const [greater, lesser] = partition(arr, (n) => n > 25);
      expect(greater).toEqual([30, 40, 50]);
      expect(lesser).toEqual([10, 20]);
    });

    it('should handle predicate with multiple conditions', () => {
      const [matches, notMatches] = partition(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        (n) => n > 3 && n < 8
      );
      expect(matches).toEqual([4, 5, 6, 7]);
      expect(notMatches).toEqual([1, 2, 3, 8, 9, 10]);
    });

    it('should handle predicate with string methods', () => {
      const words = ['apple', 'BANANA', 'Cherry', 'DATE'];
      const [uppercase, notUppercase] = partition(words, (w) => w === w.toUpperCase());
      expect(uppercase).toEqual(['BANANA', 'DATE']);
      expect(notUppercase).toEqual(['apple', 'Cherry']);
    });
  });

  describe('preserves original array', () => {
    it('should not modify original array', () => {
      const original = [1, 2, 3, 4, 5];
      const copy = [...original];
      partition(original, (n) => n % 2 === 0);
      expect(original).toEqual(copy);
    });
  });
});
