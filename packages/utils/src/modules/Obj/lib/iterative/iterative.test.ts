import type { Key } from '@toolbox-ts/types/defs/object';

import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  every,
  filter,
  type FilterInPredicate,
  type FilterOutPredicate,
  type FilterPredicate,
  type FilterSimplePredicate,
  find,
  forEach,
  map,
  omit,
  pick,
  reduce,
  some
} from './iterative.ts';

describe('iterative', () => {
  describe('forEach', () => {
    it('should execute callback for each key-value pair', () => {
      const obj = { 0: 0, a: 1, b: 2, c: 3 };
      const results: [
        Key.Enumerable<typeof obj>,
        (typeof obj)[keyof typeof obj]
      ][] = [];

      forEach(obj, (value, key) => {
        results.push([key, value]);
      });

      expect(results).toEqual([
        ['0', 0],
        ['a', 1],
        ['b', 2],
        ['c', 3]
      ]);
    });
    it('should handle empty objects', () => {
      const obj = {};
      let callCount = 0;

      forEach(obj, () => {
        callCount++;
      });

      expect(callCount).toBe(0);
    });

    it('should type callback parameters correctly', () => {
      const obj = { a: 1, b: 2 } as const;

      forEach(obj, (value, key) => {
        expectTypeOf(value).toEqualTypeOf<1 | 2>();
        expectTypeOf(key).toEqualTypeOf<'a' | 'b'>();
      });
    });
  });

  describe('reduce', () => {
    it('should reduce object to sum of values', () => {
      const obj = { a: 1, b: 2, c: 3 } as const;
      const result = reduce(
        obj,
        (acc, value) => {
          expectTypeOf(acc).toEqualTypeOf<number>();
          expectTypeOf(value).toEqualTypeOf<1 | 2 | 3>();
          return acc + value;
        },
        0
      );

      expect(result).toBe(6);
      expectTypeOf(result).toEqualTypeOf<number>();
    });

    it('should reduce object to array of entries', () => {
      const obj = { a: 1, b: 2 };
      const result = reduce<
        typeof obj,
        `${keyof typeof obj}:${(typeof obj)[keyof typeof obj]}`[]
      >(obj, (acc, value, key) => [...acc, `${key}:${value}`], []);

      expect(result).toEqual(['a:1', 'b:2']);
      expectTypeOf(result).toEqualTypeOf<(`a:${number}` | `b:${number}`)[]>();
    });

    it('should handle empty objects with initial value', () => {
      const obj: Record<string, number> = {};
      const result = reduce(obj, (acc, value) => acc + value, 100);
      expect(result).toBe(100);
      expectTypeOf(result).toEqualTypeOf<number>();
    });

    it('should handle numeric keys', () => {
      const obj = { 0: 10, 1: 20, name: 5 };
      const result = reduce(obj, (acc, value) => acc + value, 0);
      expect(result).toBe(35);
    });
    it('should type callback parameters correctly', () => {
      const obj = { a: 1, b: 2 } as const;

      reduce(
        obj,
        (acc, value, key) => {
          expectTypeOf(acc).toEqualTypeOf<number>();
          expectTypeOf(value).toEqualTypeOf<1 | 2>();
          expectTypeOf(key).toEqualTypeOf<'a' | 'b'>();
          return acc + value;
        },
        0
      );
    });
  });

  describe('map', () => {
    it('should map values to new values', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = map(obj, (value) => value * 2);

      expect(result).toEqual({ a: 2, b: 4, c: 6 });
      expectTypeOf(result).toEqualTypeOf<{ a: number; b: number; c: number }>();
    });

    it('should map values to different types', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = map(obj, (value, key) => `${key}:${value}`);

      expect(result).toEqual({ a: 'a:1', b: 'b:2', c: 'c:3' });
    });

    it('should handle numeric keys', () => {
      const obj = { 0: 'a', 1: 'b' };
      const result = map(obj, (value) => value.toUpperCase());
      expect(result).toEqual({ '0': 'A', '1': 'B' });
      expectTypeOf(result).toEqualTypeOf<{ '0': string; '1': string }>();
    });

    it('should handle empty objects', () => {
      const obj = {};
      const result = map(obj, (value) => value);

      expect(result).toEqual({});
    });

    it('should type result correctly', () => {
      const obj = { a: 1, b: 2 };
      const result = map(obj, String);

      expectTypeOf(result).toEqualTypeOf<{ a: string; b: string }>();
    });

    it('should type callback parameters correctly', () => {
      const obj = { a: 1, b: 2 } as const;

      map(obj, (value, key) => {
        expectTypeOf(value).toEqualTypeOf<1 | 2>();
        expectTypeOf(key).toEqualTypeOf<'a' | 'b'>();
        return value;
      });
    });
  });

  describe('filter', () => {
    describe('with type guard predicate (FilterInPredicate)', () => {
      it('should filter values by type', () => {
        const obj = { a: 1, b: 'two', c: 3, d: 'four' };
        const isNumber = (v: unknown): v is number => typeof v === 'number';

        const result = filter(obj, isNumber);

        expect(result).toEqual({ a: 1, c: 3 });
      });

      it('should type result correctly with type guard', () => {
        const obj = { a: 1, b: 'two', c: 3 };
        const isNumber = (v: unknown): v is number => typeof v === 'number';

        const result = filter(obj, isNumber);

        expectTypeOf(result).toEqualTypeOf<{ a: number; c: number }>();
      });

      it('should handle FilterInPredicate type', () => {
        const isString: FilterInPredicate<string> = (v: unknown): v is string =>
          typeof v === 'string';

        expectTypeOf(isString).toEqualTypeOf<
          (value: unknown) => value is string
        >();
      });
    });

    describe('with exclusion type guard (FilterOutPredicate)', () => {
      it('should filter out values by type', () => {
        const obj = { a: 1, b: 'two', c: 3, d: 'four' };
        const isNotNumber = (
          v: unknown
        ): v is Exclude<number | string, number> => typeof v === 'string';

        const result = filter(obj, isNotNumber);

        expect(result).toEqual({ b: 'two', d: 'four' });
      });

      it('should type FilterOutPredicate correctly', () => {
        interface Obj {
          a: number;
          b: string;
        }
        const pred: FilterOutPredicate<Obj, number> = (
          v: unknown
        ): v is Exclude<number | string, number> => typeof v === 'string';

        expectTypeOf(pred).toEqualTypeOf<
          (value: unknown) => value is Exclude<number | string, number>
        >();
      });
    });

    describe('with simple boolean predicate (FilterSimplePredicate)', () => {
      it('should filter with simple predicate', () => {
        const obj = { a: 1, b: 2, c: 3, d: 4 };
        const result = filter(obj, (v) => (v as number) > 2);

        expect(result).toEqual({ c: 3, d: 4 });
      });

      it('should handle complex boolean logic', () => {
        const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };
        const result = filter(
          obj,
          (v) => (v as number) % 2 === 0 || (v as number) > 4
        );

        expect(result).toEqual({ b: 2, d: 4, e: 5 });
      });

      it('should type FilterSimplePredicate correctly', () => {
        const pred: FilterSimplePredicate = (v: unknown) =>
          typeof v === 'number' && v > 0;

        expectTypeOf(pred).toEqualTypeOf<(value: unknown) => boolean>();
      });

      it('should type result as partial when using simple predicate', () => {
        const obj = { a: 1, b: 2, c: 3 };
        const result = filter(obj, (v) => (v as number) > 1);

        expectTypeOf(result).toEqualTypeOf<{
          a?: number;
          b?: number;
          c?: number;
        }>();
      });
    });

    it('should handle empty objects', () => {
      const obj = {};
      const result = filter(obj, () => true);

      expect(result).toEqual({});
    });

    it('should handle numeric keys', () => {
      const obj = { 0: 'a', 1: 'b', 2: 'c' };
      const result = filter(obj, (v) => typeof v === 'string' && v !== 'b');

      expect(result).toEqual({ 0: 'a', 2: 'c' });
    });

    it('should type FilterPredicate union correctly', () => {
      interface Obj {
        a: number;
        b: string;
      }
      type Pred = FilterPredicate<Obj, number>;

      expectTypeOf<Pred>().toEqualTypeOf<
        | FilterInPredicate<number>
        | FilterOutPredicate<Obj, number>
        | FilterSimplePredicate
      >();
    });
  });

  describe('omit', () => {
    it('should omit specified keys', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = omit(obj, ['b', 'd']);

      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should handle readonly key arrays', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const keysToOmit = ['a', 'c'] as const;
      const result = omit(obj, keysToOmit);

      expect(result).toEqual({ b: 2 });
    });

    it('should handle numeric keys', () => {
      const obj = { 0: 'a', 1: 'b', name: 'test' };
      const result = omit(obj, [0, 'name']);

      expect(result).toEqual({ 1: 'b' });
    });

    it('should handle empty omit array', () => {
      const obj = { a: 1, b: 2 };
      const result = omit(obj, []);
      expect(result).toEqual(obj);
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should handle omitting all keys', () => {
      const obj = { a: 1, b: 2 };
      const result = omit(obj, ['a', 'b']);
      expect(result).toEqual({});
    });

    it('should type result correctly', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omit(obj, ['b']);
      expect(result).toEqual({ a: 1, c: 3 });
      expectTypeOf(result).toEqualTypeOf<{ a: number; c: number }>();
    });

    it('should handle numeric key coercion in types', () => {
      const obj = { 0: 'a', 1: 'b' };
      const result = omit(obj, [0]);
      expect(result).toEqual({ 1: 'b' });
      expectTypeOf(result).toEqualTypeOf<{ 1: string }>();
    });
  });

  describe('pick', () => {
    it('should pick specified keys', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = pick(obj, ['a', 'c']);

      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should handle readonly key arrays', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const keysToPick = ['b', 'c'] as const;
      const result = pick(obj, keysToPick);

      expect(result).toEqual({ b: 2, c: 3 });
    });

    it('should handle numeric keys', () => {
      const obj = { 0: 'a', 1: 'b', name: 'test' };
      const result = pick(obj, [0, 'name']);

      expect(result).toEqual({ 0: 'a', name: 'test' });
    });

    it('should handle empty pick array', () => {
      const obj = { a: 1, b: 2 };
      const result = pick(obj, []);

      expect(result).toEqual({});
    });

    it('should handle empty objects', () => {
      const obj = {};
      const result = pick(obj, []);

      expect(result).toEqual({});
    });

    it('should type result correctly', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = pick(obj, ['a', 'c']);

      expectTypeOf(result).toEqualTypeOf<{ a: number; c: number }>();
    });

    it('should throw on non-plain objects', () => {
      const arr = [1, 2, 3];
      expect(() =>
        pick(
          arr as unknown,
          // @ts-expect-error Non-plain object
          [0]
        )
      ).toThrow();
    });
  });

  describe('some', () => {
    it('should return true when at least one property satisfies predicate', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = some(obj, (v) => v > 2);

      expect(result).toBe(true);
    });

    it('should return false when no properties satisfy predicate', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = some(obj, (v) => v > 5);

      expect(result).toBe(false);
    });

    it('should handle empty objects', () => {
      const obj = {};
      const result = some(obj, () => true);

      expect(result).toBe(false);
    });

    it('should pass key to predicate', () => {
      const obj = { a: 1, b: 2 };
      const result = some(obj, (v, k) => k === 'b');

      expect(result).toBe(true);
    });

    it('should handle numeric keys', () => {
      const obj = { 0: 'a', 1: 'b' };
      // Use loose equality because numeric keys are strings at runtime
      const result = some(obj, (v, k) => k === '1');

      expect(result).toBe(true);
    });

    it('should type predicate parameters correctly', () => {
      const obj = { a: 1, b: 2 } as const;

      some(obj, (value, key) => {
        expectTypeOf(value).toEqualTypeOf<1 | 2>();
        expectTypeOf(key).toEqualTypeOf<'a' | 'b'>();
        return value > 0;
      });
    });
  });

  describe('every', () => {
    it('should return true when all properties satisfy predicate', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = every(obj, (v) => v > 0);

      expect(result).toBe(true);
    });

    it('should return false when some properties do not satisfy predicate', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = every(obj, (v) => v > 2);

      expect(result).toBe(false);
    });

    it('should handle empty objects', () => {
      const obj = {};
      const result = every(obj, () => false);

      expect(result).toBe(true);
    });

    it('should pass key to predicate', () => {
      const obj = { a: 1, b: 2 };
      const result = every(obj, (v, k) => k === 'a' || k === 'b');

      expect(result).toBe(true);
    });

    it('should handle numeric keys', () => {
      const obj = { 0: 10, 1: 20 };
      const result = every(obj, (v) => typeof v === 'number' && v >= 10);

      expect(result).toBe(true);
    });

    it('should type predicate parameters correctly', () => {
      const obj = { a: 1, b: 2 } as const;

      every(obj, (value, key) => {
        expectTypeOf(value).toEqualTypeOf<1 | 2>();
        expectTypeOf(key).toEqualTypeOf<'a' | 'b'>();
        return value > 0;
      });
    });
  });

  describe('find', () => {
    it('should return first key-value pair that satisfies predicate', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = find(obj, (v) => v > 1);

      expect(result).toEqual(['b', 2]);
    });

    it('should return undefined when no match found', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = find(obj, (v) => v > 10);

      expect(result).toBeUndefined();
    });

    it('should handle empty objects', () => {
      const obj = {};
      const result = find(obj, () => true);

      expect(result).toBeUndefined();
    });

    it('should use key in predicate', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = find(obj, (v, k) => k === 'c');

      expect(result).toEqual(['c', 3]);
    });

    it('should handle numeric keys', () => {
      const obj = { 0: 'first', 1: 'second', 2: 'third' };
      const result = find(obj, (v, k) => k === '1');

      expect(result).toEqual(['1', 'second']);
    });

    it('should type return value correctly', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = find(obj, (v) => v > 1);

      expectTypeOf(result).toEqualTypeOf<
        [key: 'a' | 'b' | 'c', value: number] | undefined
      >();
    });

    it('should type return value with numeric keys', () => {
      const obj = { 0: 'a', 1: 'b' } as const;
      const result = find(obj, () => true);

      expectTypeOf(result).toEqualTypeOf<
        [key: '0' | '1', value: 'a' | 'b'] | undefined
      >();
    });

    it('should type predicate parameters correctly', () => {
      const obj = { a: 1, b: 2 } as const;

      find(obj, (value, key) => {
        expectTypeOf(value).toEqualTypeOf<1 | 2>();
        expectTypeOf(key).toEqualTypeOf<'a' | 'b'>();
        return value > 0;
      });
    });
  });

  describe('Key.Enumerable type coverage', () => {
    it('should preserve string literal keys', () => {
      interface Obj {
        a: 1;
        b: 2;
      }
      type Keys = Key.Enumerable<Obj>;

      expectTypeOf<Keys>().toEqualTypeOf<'a' | 'b'>();
    });

    it('should convert numeric keys to string literals', () => {
      interface Obj {
        0: 'a';
        1: 'b';
      }
      type Keys = Key.Enumerable<Obj>;

      expectTypeOf<Keys>().toEqualTypeOf<'0' | '1'>();
    });

    it('should exclude symbol keys', () => {
      const sym = Symbol('test');
      interface Obj {
        a: 1;
        [sym]: 'symbol';
      }
      type Keys = Key.Enumerable<Obj>;

      expectTypeOf<Keys>().toEqualTypeOf<'a'>();
    });

    it('should handle mixed key types', () => {
      interface Obj {
        0: 2;
        a: 1;
        b: 3;
      }
      type Keys = Key.Enumerable<Obj>;

      expectTypeOf<Keys>().toEqualTypeOf<'0' | 'a' | 'b'>();
    });
  });

  describe('Key.CoerceNumber type coverage', () => {
    it('should preserve string keys', () => {
      type Result = Key.CoerceNumber<'a'>;

      expectTypeOf<Result>().toEqualTypeOf<'a'>();
    });

    it('should convert numeric keys to string literals', () => {
      type Result = Key.CoerceNumber<0>;

      expectTypeOf<Result>().toEqualTypeOf<'0'>();
    });

    it('should preserve union of string keys', () => {
      type Result = Key.CoerceNumber<'a' | 'b'>;

      expectTypeOf<Result>().toEqualTypeOf<'a' | 'b'>();
    });

    it('should convert union with numeric keys', () => {
      type Result = Key.CoerceNumber<'a' | 'b' | 0 | 1>;

      expectTypeOf<Result>().toEqualTypeOf<'0' | '1' | 'a' | 'b'>();
    });
  });
});
