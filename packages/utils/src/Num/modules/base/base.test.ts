import { describe, expect, it } from 'vitest';

import {
  average,
  clamp,
  difference,
  is,
  max,
  min,
  normalize,
  product,
  range,
  reduce,
  round,
  sum
} from './base.ts';

describe('normalize', () => {
  it('returns number as is', () => {
    expect(normalize(42)).toBe(42);
  });
  it('converts string to number', () => {
    expect(normalize('3.14')).toBe(3.14);
  });
  it('returns 0 for NaN, undefined, null, object', () => {
    expect(normalize(Number.NaN)).toBe(0);
    expect(normalize(undefined)).toBe(0);
    expect(normalize(null)).toBe(0);
    expect(normalize({})).toBe(0);
  });
  it('returns 0 for Infinity', () => {
    expect(normalize(Infinity)).toBe(0);
    expect(normalize(-Infinity)).toBe(0);
  });
});

describe('round', () => {
  it('rounds to default 2 decimals', () => {
    expect(round(1.2345)).toBe(1.23);
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
  it('safeInteger', () => {
    expect(is.safeInteger(5)).toBe(true);
    expect(is.safeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
  });
  it('positive', () => {
    expect(is.positive(5)).toBe(true);
    expect(is.positive(-5)).toBe(false);
    expect(is.positive(0)).toBe(true);
    expect(is.positive(5, true)).toBe(true);
    expect(is.positive(Number.MAX_SAFE_INTEGER + 1, true)).toBe(false);
  });
  it('negative', () => {
    expect(is.negative(-5)).toBe(true);
    expect(is.negative(5)).toBe(false);
    expect(is.negative(0)).toBe(false);
    expect(is.negative(Number.MAX_SAFE_INTEGER + 1, true)).toBe(true);
  });
  it('decimal', () => {
    expect(is.decimal(5.1)).toBe(true);
    expect(is.decimal(5)).toBe(false);
    expect(is.decimal('5.1')).toBe(false);
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
    expect(is.positiveInt(5, true)).toBe(true);
    expect(is.positiveInt(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
    expect(is.positiveInt(Number.MAX_SAFE_INTEGER + 1, false)).toBe(true);
  });
  it('negativeInt', () => {
    expect(is.negativeInt(-5)).toBe(true);
    expect(is.negativeInt(5)).toBe(false);
    expect(is.negativeInt(0)).toBe(true);
    expect(is.negativeInt(-5, true)).toBe(true);
    expect(is.negativeInt(Number.MAX_SAFE_INTEGER + 1, true)).toBe(false);
    expect(is.negativeInt(-5, false)).toBe(true);
    expect(is.negativeInt(5, false)).toBe(false);
    expect(is.negative(-Number.MAX_SAFE_INTEGER - 1, false)).toBe(true);
  });
  it('zero', () => {
    expect(is.zero(0)).toBe(true);
    expect(is.zero(5)).toBe(false);
    expect(is.zero(-5)).toBe(false);
  });
});

describe('reduce', () => {
  it('reduces with sum', () => {
    expect(
      reduce({
        numbers: [1, 2, 3],
        fn: (a: number, b: number) => a + b,
        start: 0
      })
    ).toBe(6);
  });
  it('reduces with product', () => {
    expect(reduce({ numbers: [2, 3], fn: (a, b) => a * b, start: 1 })).toBe(6);
  });
  it('reduces with roundTo', () => {
    expect(
      reduce({
        numbers: [1.234, 2.345],
        fn: (a: number, b: number) => a + b,
        start: 0,
        roundTo: 2
      })
    ).toBe(3.58);
  });
  it('handles empty numbers', () => {
    expect(
      reduce({ numbers: [], fn: (a: number, b: number) => a + b, start: 5 })
    ).toBe(5);
  });
  it('handles non-number values', () => {
    expect(
      reduce({
        numbers: [1, '2', null, undefined],
        fn: (a: number, b: number) => a + b,
        start: 0
      })
    ).toBe(3);
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

describe('min', () => {
  it('returns min value', () => {
    expect(min([1, 2, 3])).toBe(1);
    expect(min(['5', 2, 3])).toBe(2);
    expect(min([Infinity, 2, 3])).toBe(2);
  });
});

describe('max', () => {
  it('returns max value', () => {
    expect(max([1, 2, 3])).toBe(3);
    expect(max(['5', 2, 3])).toBe(5);
    expect(max([-Infinity, 2, 3])).toBe(3);
  });
});

describe('range', () => {
  it('returns range', () => {
    expect(range([1, 2, 3])).toBe(2);
    expect(range([5, 5, 5])).toBe(0);
  });
});

describe('difference', () => {
  it('returns difference for 2+ numbers', () => {
    expect(difference([10, 2, 3])).toBe(5);
  });
  it('returns 0 for less than 2 numbers', () => {
    expect(difference([5])).toBe(0);
    expect(difference([])).toBe(0);
  });
});

describe('clamp', () => {
  it('clamps within min and max', () => {
    expect(clamp(50)).toBe(50);
    expect(clamp(-10)).toBe(0);
    expect(clamp(110)).toBe(100);
  });
  it('clamps with custom options', () => {
    expect(clamp(5, { min: 3, max: 7, decimal: 1 })).toBe(5);
    expect(clamp(2, { min: 3, max: 7 })).toBe(3);
    expect(clamp(8, { min: 3, max: 7 })).toBe(7);
  });
});
