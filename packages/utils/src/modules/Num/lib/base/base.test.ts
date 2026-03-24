import { describe, expect, it } from 'vitest';

import { average, clamp, product, range, reduce, round, sum } from './base.ts';
describe('Num Base', () => {
  describe('round', () => {
    it('rounds to default 0 decimals', () => {
      expect(round(1.2345)).toBe(1);
    });
    it('rounds to given decimal position', () => {
      expect(round(1.2345, 3)).toBe(1.235);
      expect(round(1.2345, 0)).toBe(1);
    });
    it('handles negative and NaN decimalPosition', () => {
      expect(round(1.2345, -2)).toBe(1);
      expect(round(1.2345, Number.NaN)).toBe(1);
    });
  });

  describe('reduce', () => {
    it('reduces with sum', () => {
      expect(reduce([1, 2, 3], (a: number, b: number) => a + b, { start: 0 })).toBe(6);
    });
    it('reduces with product', () => {
      expect(reduce([2, 3], (a, b) => a * b, { start: 1 })).toBe(6);
    });
    it('reduces with roundTo', () => {
      expect(
        reduce([1.234, 2.345], (a: number, b: number) => a + b, { start: 0, roundTo: 2 })
      ).toBe(3.58);
    });
    it('handles empty numbers', () => {
      expect(reduce([], (a: number, b: number) => a + b, { start: 5 })).toBe(5);
    });
  });

  describe('sum', () => {
    it('sums numbers', () => {
      expect(sum([1, 2, 3])).toBe(6);
    });
    it('sums with roundTo', () => {
      expect(sum([1.234, 2.345], 2)).toBe(3.58);
    });
    it('handles empty array', () => {
      expect(sum([])).toBe(0);
    });
  });

  describe('product', () => {
    it('multiplies numbers', () => {
      expect(product([2, 3, 4])).toBe(24);
    });
    it('multiplies with roundTo', () => {
      expect(product([1.2, 3.4], 2)).toBe(4.08);
    });
    it('handles empty array', () => {
      expect(product([])).toBe(1);
    });
  });

  describe('average', () => {
    it('averages numbers', () => {
      expect(average([2, 4, 6])).toBe(4);
    });
    it('averages with roundTo', () => {
      expect(average([1.2, 3.4], 2)).toBeCloseTo(2.3, 2);
    });
    it('handles empty array', () => {
      expect(average([])).toBe(0);
    });
  });

  describe('range', () => {
    it('returns range', () => {
      expect(range([1, 2, 3])).toBe(2);
      expect(range([5, 5, 5])).toBe(0);
    });
  });

  describe('clamp', () => {
    it('clamps within min and max', () => {
      expect(clamp(5, { min: 3, max: 7, decimal: 1 })).toBe(5);
      expect(clamp(2, { min: 3, max: 7 })).toBe(3);
      expect(clamp(8, { min: 3, max: 7 })).toBe(7);
    });
  });
});
