import { describe, expect, it } from 'vitest';

import {
  average,
  clamp,
  is,
  product,
  range,
  reduce,
  round,
  sum
} from './base.ts';

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

describe('is', () => {
  it('finite', () => {
    expect(is.finite(5)).toBe(true);
    expect(is.finite('5')).toBe(false);
    expect(is.finite(Infinity)).toBe(false);
  });
  it('infinity', () => {
    expect(is.infinity(Infinity)).toBe(true);
    expect(is.infinity(-Infinity)).toBe(true);
    expect(is.infinity(5)).toBe(false);
  });
  it('odd', () => {
    expect(is.odd(3)).toBe(true);
    expect(is.odd(4)).toBe(false);
    expect(is.odd('3')).toBe(false);
  });
  it('even', () => {
    expect(is.even(4)).toBe(true);
    expect(is.even(3)).toBe(false);
    expect(is.even('4')).toBe(false);
  });
  it('integer', () => {
    expect(is.integer(5)).toBe(true);
    expect(is.integer(5.1)).toBe(false);
    expect(is.integer('5')).toBe(false);
  });
  it('positive', () => {
    expect(is.positive(5)).toBe(true);
    expect(is.positive(-5)).toBe(false);
    expect(is.positive(0)).toBe(true);
    expect(is.positive(5)).toBe(true);
    expect(is.positive(Number.MAX_SAFE_INTEGER + 1)).toBe(true);
  });
  it('negative', () => {
    expect(is.negative(-5)).toBe(true);
    expect(is.negative(5)).toBe(false);
    expect(is.negative(0)).toBe(true);
    expect(is.negative(-Number.MAX_SAFE_INTEGER - 1)).toBe(true);
  });
  it('decimal', () => {
    expect(is.decimal(5.1)).toBe(true);
    expect(is.decimal(5)).toBe(false);
    expect(is.decimal('5.1')).toBe(true);
  });
  it('inRange', () => {
    expect(is.inRange(5, 1, 10)).toBe(true);
    expect(is.inRange(0, 1, 10)).toBe(false);
    expect(is.inRange(11, 1, 10)).toBe(false);
    expect(is.inRange(Number.NaN, 1, 10)).toBe(false);
    expect(is.inRange(5, Number.NaN, 10)).toBe(false);
    expect(is.inRange(5, 1, Number.NaN)).toBe(false);
  });
  it('positiveInt', () => {
    expect(is.positiveInt(5)).toBe(true);
    expect(is.positiveInt(-5)).toBe(false);
    expect(is.positiveInt(0)).toBe(true);
    expect(is.positiveInt(Number.MAX_SAFE_INTEGER + 1, true)).toBe(false);
    expect(is.positiveInt(Number.MAX_SAFE_INTEGER + 1, false)).toBe(true);
  });
  it('negativeInt', () => {
    expect(is.negativeInt(-5)).toBe(true);
    expect(is.negativeInt(5)).toBe(false);
    expect(is.negativeInt(0)).toBe(true);
    expect(is.negativeInt(-5, true)).toBe(true);
    expect(is.negativeInt(-Number.MAX_SAFE_INTEGER - 1, false)).toBe(true);
    expect(is.negativeInt(-Number.MAX_SAFE_INTEGER - 1, true)).toBe(false);
  });
  it('theNumber', () => {
    expect(is.theNumber(5, 5)).toBe(true);
    expect(is.theNumber(5, 6)).toBe(false);
    expect(is.theNumber('5', 5)).toBe(false);
    expect(is.theNumber(BigInt(5), BigInt(5))).toBe(true);
    expect(is.theNumber(BigInt(5), BigInt(6))).toBe(false);
    expect(is.theNumber(5, BigInt(5))).toBe(false);
  });
  it('stringNumber', () => {
    expect(is.stringNumber('5')).toBe(true);
    expect(is.stringNumber('5.1')).toBe(true);
    expect(is.stringNumber('-5.1')).toBe(true);
    expect(is.stringNumber('foo')).toBe(false);
    expect(is.stringNumber(5)).toBe(false);
    expect(is.stringNumber(null)).toBe(false);
  });
});

describe('reduce', () => {
  it('reduces with sum', () => {
    expect(
      reduce([1, 2, 3], (a: number, b: number) => a + b, { start: 0 })
    ).toBe(6);
  });
  it('reduces with product', () => {
    expect(reduce([2, 3], (a, b) => a * b, { start: 1 })).toBe(6);
  });
  it('reduces with roundTo', () => {
    expect(
      reduce([1.234, 2.345], (a: number, b: number) => a + b, {
        start: 0,
        roundTo: 2
      })
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
