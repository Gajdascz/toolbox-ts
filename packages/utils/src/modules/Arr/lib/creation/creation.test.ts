import { describe, expect, it } from 'vitest';

import { from, range, ensure } from './creation.ts';

const numArr1 = [1, 2, 3, 4, 5];

describe('Array Creation', () => {
  describe('to', () => {
    it('converts array-like to array', () => {
      expect(ensure(numArr1)).toEqual(numArr1);
      expect(ensure('abc')).toEqual(['abc']);
      expect(ensure(new Set([1, 2, 3]))).toEqual([new Set([1, 2, 3])]);
    });
    it('wraps non-array-like in array', () => {
      expect(ensure(42)).toEqual([42]);
      expect(ensure(null)).toEqual([]);
      expect(ensure(undefined)).toEqual([]);
      expect(ensure({})).toEqual([{}]);
    });
    it('allows null if requested', () => {
      expect(ensure(null, true)).toEqual([null]);
    });
  });
  describe('range', () => {
    it('returns start when step is 0', () => {
      expect(range(5, 10, 0)).toEqual([5]);
      expect(range(10, 5, 0)).toEqual([10]);
    });
    it('creates range with positive step', () => {
      expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
      expect(range(1, 5, 2)).toEqual([1, 3, 5]);
    });
    it('creates decrementing range when start > end', () => {
      expect(range(5, 1)).toEqual([5, 4, 3, 2, 1]);
      expect(range(5, 1, 2)).toEqual([5, 3, 1]);
    });
    it('creates negative range when end is negative', () => {
      expect(range(-1, -5)).toEqual([-1, -2, -3, -4, -5]);
      expect(range(-1, -5, 2)).toEqual([-1, -3, -5]);
    });
  });
  describe('from', () => {
    it('creates array of specified length with fromial value', () => {
      expect(from(3, 0)).toEqual([0, 0, 0]);
      expect(from(4, 'a')).toEqual(['a', 'a', 'a', 'a']);
      expect(from(2, null)).toEqual([null, null]);
      expect(from(3, (i) => i * 2)).toEqual([0, 2, 4]);
    });
  });
});
