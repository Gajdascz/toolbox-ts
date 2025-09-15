import { describe, expect, it } from 'vitest';

import { is, isNot, merge, type MergeOpts, normalize } from './Prim.ts';

it.each([
  ['string', { is: 'string', not: 123 }],
  ['number', { is: 123, not: 'string' }],
  ['boolean', { is: true, not: 'string' }],
  ['bigint', { is: BigInt(10), not: 10 }],
  ['symbol', { is: Symbol(), not: 'symbol' }],
  ['undefined', { is: undefined, not: null }],
  ['null', { is: null, not: undefined }],
  ['falsy', { is: 0, not: 1 }],
  ['truthy', { is: 1, not: 0 }],
  ['nullish', { is: null, not: 0 }],
  ['type', { is: 'number', not: 'array' }]
] as [keyof typeof is, { is: unknown; not: unknown }][])(
  '%s',
  (type, { is: val, not }) => {
    expect(is[type](val)).toBe(true);
    expect(is[type](not)).toBe(false);
    expect(isNot[type](val)).toBe(false);
    expect(isNot[type](not)).toBe(true);
  }
);
describe('merge', () => {
  it('behavior: first', () => {
    expect(merge(10, [20, 30], { behavior: 'first' })).toBe(10);
  });
  it('behavior: last', () => {
    expect(merge(10, [20, 30], { behavior: 'last' })).toBe(30);
  });
  it('throws if a is not a primitive', () => {
    // @ts-expect-error: testing runtime behavior
    expect(() => merge({}, [20, 30], { behavior: 'first' })).toThrow(TypeError);
    expect(() => merge(null, [20, 30], { behavior: 'first' })).toThrow(
      TypeError
    );
    expect(() => merge(undefined, [20, 30], { behavior: 'first' })).toThrow(
      TypeError
    );
    // @ts-expect-error: testing runtime behavior
    expect(() => merge([], [20, 30], { behavior: 'first' })).toThrow(TypeError);
  });
  describe('behavior: function', () => {
    it('stops when the function returns true', () => {
      expect(
        merge<number>(10, [20, 30, 40, 50], {
          behavior: (a, b) => {
            const res = a + b;
            return res > 60 ? true : res;
          }
        })
      ).toBe(60);
    });
    it('accumulates when the function never returns true', () => {
      expect(
        merge<string>('a', ['b', 'c', 'd'], { behavior: (a, b) => a + b })
      ).toBe('abcd');
    });
  });
  describe('special cases', () => {
    it('normalizes input to array', () => {
      expect(merge<string>('a', 'b', { behavior: (a, b) => a + b })).toBe('ab');
    });
    it('returns a when b is empty', () => {
      expect(merge<string>('a', [], { behavior: (a, b) => a + b })).toBe('a');
    });
  });
  describe('exclude', () => {
    it.each([
      [{ exclude: 'nullish' }, 'a', [null, 'a', undefined, 'b', 'c', ''], ''],
      [{ exclude: 'falsy' }, 0, ['a', false, 'b', '', 'c', '', undefined], 'c'],
      [{ exclude: 'null' }, 'a', [null, 'b', 'c', undefined], undefined],
      [{ exclude: 'undefined' }, 'a', [undefined, 'b', 'c', null], null],
      [{ exclude: 'none' }, 'a', [null, 'b', 'c', undefined], undefined]
    ] as [MergeOpts<any>, any, any[], any][])(
      'excludes %s values from merging',
      (opts, base, values, expected) => {
        expect(merge<null | string | undefined>(base, values, opts)).toBe(
          expected
        );
      }
    );
    it('excludes nullish values', () => {
      expect(
        merge<null | string | undefined>('a', [null, 'b', undefined, 'c'], {
          exclude: 'nullish'
        })
      ).toBe('c');
    });
    it('excludes falsy values', () => {
      expect(
        merge<boolean | number | string | undefined>(
          'a',
          [0, 'b', false, 'c', undefined, ''],
          { exclude: 'falsy' }
        )
      ).toBe('c');
    });
  });
});
describe('normalize', () => {
  it('string', () => {
    expect(normalize.string('string')).toBe('string');
    expect(normalize.string(123)).toBe('123');
    expect(normalize.string(true)).toBe('true');
    expect(normalize.string(false)).toBe('false');
    expect(normalize.string(null)).toBe('null');
    expect(normalize.string(undefined)).toBe('');
    expect(normalize.string({ a: 1 })).toBe('{"a":1}');
    expect(normalize.string([1, 2, 3])).toBe('[1,2,3]');
    expect(normalize.string(Symbol('sym'))).toBe('Symbol(sym)');
    expect(normalize.string(() => 5)).toBe('() => 5');
  });
  describe('number', () => {
    it('handles normal number input', () => {
      expect(normalize.number(123)).toBe(123);
      expect(normalize.number(123.45)).toBe(123.45);
      expect(normalize.number(-123.45)).toBe(-123.45);
      expect(normalize.number(0)).toBe(0);
      expect(normalize.number(-0)).toBe(-0);
    });
    it('handles NaN', () => {
      expect(normalize.number(Number.NaN)).toBe(0);
      expect(normalize.number(Number.NaN, { fallback: 5 })).toBe(5);
      expect(normalize.number(Number.NaN, { fallbackOnNaN: false })).toBe(
        Number.NaN
      );
    });
    it('handles Infinity', () => {
      expect(normalize.number(Infinity)).toBe(0);
      expect(normalize.number(-Infinity)).toBe(0);
      expect(normalize.number(Infinity, { allowInfinity: true })).toBe(
        Infinity
      );
      expect(normalize.number(-Infinity, { allowInfinity: true })).toBe(
        -Infinity
      );
      expect(normalize.number(Infinity, { allowInfinity: 'positive' })).toBe(
        Infinity
      );
      expect(normalize.number(-Infinity, { allowInfinity: 'negative' })).toBe(
        -Infinity
      );
    });
    it('handles string input', () => {
      expect(normalize.number('123')).toBe(123);
      expect(normalize.number('123.45')).toBe(123.45);
      expect(normalize.number('-123.45')).toBe(-123.45);
      expect(normalize.number('0')).toBe(0);
      expect(normalize.number('-0')).toBe(-0);
      expect(normalize.number('  123  ')).toBe(123);
      expect(normalize.number('abc')).toBe(0);
      expect(
        normalize.number('abc', { stringCoercion: 'NumberCstr', fallback: 5 })
      ).toBe(5);
      expect(
        normalize.number('abc', { fallbackOnNaN: false, fallback: 5 })
      ).toBe(Number.NaN);
      expect(normalize.number('', { fallbackOnNaN: false })).toBe(Number.NaN);
    });
    it('handles boolean input', () => {
      expect(normalize.number(true)).toBe(1);
      expect(normalize.number(false)).toBe(0);
      expect(
        normalize.number(true, { fallbackOnBoolean: 'true', fallback: 5 })
      ).toBe(5);
      expect(
        normalize.number(false, { fallbackOnBoolean: 'false', fallback: 5 })
      ).toBe(5);
      expect(
        normalize.number(true, { fallbackOnBoolean: true, fallback: 5 })
      ).toBe(5);
      expect(
        normalize.number(false, { fallbackOnBoolean: false, fallback: 5 })
      ).toBe(0);
    });
    it('handles null/undefined', () => {
      expect(normalize.number(null)).toBe(0);
      expect(normalize.number(null, { fallback: 5 })).toBe(5);
      expect(
        normalize.number(null, { fallbackOnNull: false, fallback: 5 })
      ).toBe(0);

      expect(normalize.number(undefined)).toBe(0);
      expect(normalize.number(undefined, { fallback: 5 })).toBe(5);
      expect(normalize.number(undefined, { fallbackOnNaN: false })).toBe(
        Number.NaN
      );
    });
  });
});
