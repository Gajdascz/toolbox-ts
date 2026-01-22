import { describe, expect, it } from 'vitest';

import { longer, longest, shorter, shortest } from './comparison.ts';

const numArr1 = [1, 2, 3, 4, 5];
const numArr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const longestArr = [...numArr1, ...numArr2];
const pair1 = [1, 2];
const pair2 = [3, 4];

describe('Comparison', () => {
  describe('longer(', () => {
    it('returns the longer of two arrays', () => {
      expect(longer([], numArr2)).toEqual(numArr2);
      expect(longer(numArr1, pair1)).toEqual(numArr1);
    });
    it('returns the first array if both arrays have equal length', () => {
      expect(longer(pair1, pair2)).toEqual(pair1);
    });
  });
  describe('longest', () => {
    it('returns the longest array', () => {
      expect(longest(numArr1, numArr2, longestArr)).toEqual(longestArr);
      expect(longest(pair1, [1], [])).toEqual(pair1);
      expect(longest()).toBeUndefined();
    });
    it('returns the first array if multiple arrays have the same longest length', () => {
      expect(longest(pair1, [3, 4], [5, 6])).toEqual(pair1);
    });
  });
  describe('shorter', () => {
    it('returns the shorter array', () => {
      expect(shorter(pair1, numArr1)).toEqual(pair1);
      expect(shorter(numArr1, pair1)).toEqual(pair1);
    });
    it('returns the first array if equal length', () => {
      expect(shorter(pair1, pair2)).toEqual(pair1);
    });
  });
  describe('shortest', () => {
    it('returns the shortest array', () => {
      expect(shortest(pair1, numArr1)).toEqual(pair1);
      expect(shortest(numArr1, pair1)).toEqual(pair1);
    });
    it('returns the first array if equal length', () => {
      expect(shortest(pair1, pair2)).toEqual(pair1);
    });
  });
});
