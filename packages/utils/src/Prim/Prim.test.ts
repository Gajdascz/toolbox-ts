import { describe, expect, it } from 'vitest';

import {
  coerce,
  is,
  isNot,
  merge,
  type MergeOpts,
  resolveType
} from './Prim.ts';

describe('Prim', () => {
  describe('guards', () => {
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
  });

  describe('merge', () => {
    it('behavior: first', () => {
      expect(merge(10, [20, 30], { behavior: 'first' })).toBe(10);
    });
    it('behavior: last', () => {
      expect(merge(10, [20, 30], { behavior: 'last' })).toBe(30);
    });
    describe('behavior: function', () => {
      it('stops when the function returns true', () => {
        expect(
          merge<number>(10, [20, 30, 40, 50], {
            behavior: (a, b) => {
              const res = a + b;
              if (res > 60) return true;
              return res;
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
      it('coerces input to array', () => {
        expect(merge<string>('a', 'b', { behavior: (a, b) => a + b })).toBe(
          'ab'
        );
      });
      it('returns a when b is empty', () => {
        expect(merge<string>('a', [], { behavior: (a, b) => a + b })).toBe('a');
      });
    });
    describe('exclude', () => {
      it.each([
        [{ exclude: 'nullish' }, 'a', [null, 'a', undefined, 'b', 'c', ''], ''],
        [
          { exclude: 'falsy' },
          0,
          ['a', false, 'b', '', 'c', '', undefined],
          'c'
        ],
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
  describe('coerce', () => {
    it('string', () => {
      expect(coerce.string('string')).toBe('string');
      expect(coerce.string(123)).toBe('123');
      expect(coerce.string(true)).toBe('true');
      expect(coerce.string(false)).toBe('false');
      expect(coerce.string(null)).toBe('null');
      expect(coerce.string(undefined)).toBe('');
      expect(coerce.string({ a: 1 })).toBe('{"a":1}');
      expect(coerce.string([1, 2, 3])).toBe('[1,2,3]');
      expect(coerce.string(Symbol('sym'))).toBe('Symbol(sym)');
      expect(coerce.string(() => 5)).toBe('() => 5');
    });
    describe('number', () => {
      it('handles normal number input', () => {
        expect(coerce.number(123)).toBe(123);
        expect(coerce.number(123.45)).toBe(123.45);
        expect(coerce.number(-123.45)).toBe(-123.45);
        expect(coerce.number(0)).toBe(0);
        expect(coerce.number(-0)).toBe(-0);
      });
      it('handles NaN', () => {
        expect(coerce.number(Number.NaN)).toBe(0);
        expect(coerce.number(Number.NaN, { fallback: 5 })).toBe(5);
        expect(coerce.number(Number.NaN, { fallbackOnNaN: false })).toBe(
          Number.NaN
        );
      });
      it('handles Infinity', () => {
        expect(coerce.number(Infinity)).toBe(0);
        expect(coerce.number(-Infinity)).toBe(0);
        expect(coerce.number(Infinity, { allowInfinity: true })).toBe(Infinity);
        expect(coerce.number(-Infinity, { allowInfinity: true })).toBe(
          -Infinity
        );
        expect(coerce.number(Infinity, { allowInfinity: 'positive' })).toBe(
          Infinity
        );
        expect(coerce.number(-Infinity, { allowInfinity: 'negative' })).toBe(
          -Infinity
        );
      });
      it('handles string input', () => {
        expect(coerce.number('123')).toBe(123);
        expect(coerce.number('123.45')).toBe(123.45);
        expect(coerce.number('-123.45')).toBe(-123.45);
        expect(coerce.number('0')).toBe(0);
        expect(coerce.number('-0')).toBe(-0);
        expect(coerce.number('  123  ')).toBe(123);
        expect(coerce.number('abc')).toBe(0);
        expect(
          coerce.number('abc', { stringCoercion: 'NumberCstr', fallback: 5 })
        ).toBe(5);
        expect(
          coerce.number('abc', { fallbackOnNaN: false, fallback: 5 })
        ).toBe(Number.NaN);
        expect(coerce.number('', { fallbackOnNaN: false })).toBe(Number.NaN);
      });
      it('handles boolean input', () => {
        expect(coerce.number(true)).toBe(1);
        expect(coerce.number(false)).toBe(0);
        expect(
          coerce.number(true, { fallbackOnBoolean: 'true', fallback: 5 })
        ).toBe(5);
        expect(
          coerce.number(false, { fallbackOnBoolean: 'false', fallback: 5 })
        ).toBe(5);
        expect(
          coerce.number(true, { fallbackOnBoolean: true, fallback: 5 })
        ).toBe(5);
        expect(
          coerce.number(false, { fallbackOnBoolean: false, fallback: 5 })
        ).toBe(0);
      });
      it('handles null/undefined', () => {
        expect(coerce.number(null)).toBe(0);
        expect(coerce.number(null, { fallback: 5 })).toBe(5);
        expect(
          coerce.number(null, { fallbackOnNull: false, fallback: 5 })
        ).toBe(0);

        expect(coerce.number(undefined)).toBe(0);
        expect(coerce.number(undefined, { fallback: 5 })).toBe(5);
        expect(coerce.number(undefined, { fallbackOnNaN: false })).toBe(
          Number.NaN
        );
      });
    });
  });
  describe('resolveType', () => {
    it('infers literal types', () => {
      const str = 'string' as const;
      const num = 123 as const;
      const bool = true as const;
      expect(resolveType(str)).toBe('string');
      expect(resolveType(num)).toBe('number');
      expect(resolveType(bool)).toBe('boolean');
      expect(resolveType('string')).toBe('string');
      expect(resolveType(123)).toBe('number');
      expect(resolveType(true)).toBe('boolean');
      expect(resolveType(null)).toBe('null');
      expect(resolveType(undefined)).toBe('undefined');
      expect(resolveType([])).toBe('array');
      expect(resolveType({})).toBe('object');
      expect(resolveType(Symbol())).toBe('symbol');
      expect(resolveType(BigInt(10))).toBe('bigint');
      expect(resolveType(() => {})).toBe('function');
    });
  });
});
