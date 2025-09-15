import { describe, expect, it } from 'vitest';

import {
  chunk,
  clone,
  compactFalsy,
  compactNullish,
  dedupe,
  deep,
  firstOrThrow,
  group,
  half,
  init,
  isOfType,
  last,
  lastIndex,
  lastOrThrow,
  longer,
  longest,
  merge,
  partition,
  range,
  shorter,
  shortest,
  to,
  transform,
  zip,
  zipFill,
  zipRemainder
} from './Arr.js';

describe('Arr utils', () => {
  it('transform filters only undefined (keeps null and other values)', () => {
    const input = [1, null, 2, 3, 4];
    const out = transform(input, (v) =>
      typeof v === 'number' ? v * 2 : (null as any)
    );
    expect(out).toEqual([2, null, 4, 6, 8]);
  });
  it('to wraps single value, returns same array by reference, and empty for nullish', () => {
    const single = to(5);
    expect(single).toEqual([5]);

    const arr = [1, 2, 3];
    const same = to(arr);
    expect(same).toBe(arr); // same reference

    expect(to(null as any)).toEqual([]);
    expect(to(undefined as any)).toEqual([]);
  });
  it('compactNullish removes only null/undefined', () => {
    const input = [1, null, 2, undefined, 3];
    expect(compactNullish(input)).toEqual([1, 2, 3]);
  });
  it('compactFalsy removes falsy values (false, 0, "", nullish, NaN)', () => {
    const input: (false | null | number | string | undefined)[] = [
      0,
      1,
      false,
      2,
      '',
      3,
      null,
      undefined,
      Number.NaN
    ];
    expect(compactFalsy(input)).toEqual([1, 2, 3]);
  });
  it('longer/shorter return correct array (including equal length branch)', () => {
    expect(longer([1, 2], ['a'])).toEqual([1, 2]); // a longer
    expect(longer([1], ['a', 'b'])).toEqual(['a', 'b']); // b longer
    expect(longer([1], ['a'])).toEqual([1]); // equal length -> first

    expect(shorter([1, 2], ['a'])).toEqual(['a']); // b shorter
    expect(shorter([1], ['a', 'b'])).toEqual([1]); // a shorter
    expect(shorter([1], ['a'])).toEqual([1]); // equal length -> first
  });
  it('longest chooses the longest among many, shortest returns [] with current implementation', () => {
    expect(longest([1, 2], ['a'], [true, true, true])).toEqual([
      true,
      true,
      true
    ]);

    expect(shortest([1, 2], ['a'], [true, true, true])).toEqual(['a']);
    expect(shortest([], [1], [1, 2])).toEqual([]);
  });
  it('zip pairs up to the shorter length', () => {
    expect(zip([1, 2, 3], ['a', 'b'])).toEqual([
      [1, 'a'],
      [2, 'b']
    ]);
    expect(zip([1], ['x', 'y', 'z'])).toEqual([[1, 'x']]);
  });
  it('zipFill fills to the longer length with provided fill', () => {
    expect(zipFill([1, 2, 3], ['a', 'b'], null)).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, null]
    ]);
    expect(zipFill([1], ['a', 'b', 'c'], 0)).toEqual([
      [1, 'a'],
      [0, 'b'],
      [0, 'c']
    ]);
  });
  it('zipRemainder returns zipped pairs and the leftover of the longer array', () => {
    expect(zipRemainder([1, 2, 3], ['a', 'b'])).toEqual({
      zipped: [
        [1, 'a'],
        [2, 'b']
      ],
      remainder: [3]
    });
    expect(zipRemainder([1], ['a', 'b', 'c'])).toEqual({
      zipped: [[1, 'a']],
      remainder: ['b', 'c']
    });
    expect(zipRemainder([1, 2], ['a', 'b'])).toEqual({
      zipped: [
        [1, 'a'],
        [2, 'b']
      ],
      remainder: []
    });
  });
  it('lastIndex, last, lastOrThrow behave as specified', () => {
    expect(lastIndex([1, 2, 3])).toBe(2);
    expect(lastIndex([])).toBe(-1);

    expect(last([1, 2, 3])).toBe(3);
    expect(last([] as number[])).toBeUndefined();

    expect(lastOrThrow([1, 2, 3])).toBe(3);
    expect(() => lastOrThrow([] as number[])).toThrowError(
      'Array is empty, no last element'
    );
  });
  it('dedupe removes duplicates while preserving order', () => {
    const obj = { x: 1 };
    expect(dedupe([1, 1, 2, 'a', 'a', obj, obj])).toEqual([1, 2, 'a', obj]);
  });
  it('firstOrThrow returns first or throws when empty', () => {
    expect(firstOrThrow([10, 20])).toBe(10);
    expect(() => firstOrThrow([] as number[])).toThrowError(
      'Array is empty, no first element'
    );
  });
  it('group groups values by key function and appends to existing groups', () => {
    const items = ['apple', 'banana', 'apricot', 'blueberry'];
    const grouped = group(items, (s) => s[0] as 'a' | 'b');
    expect(grouped).toEqual({
      a: ['apple', 'apricot'],
      b: ['banana', 'blueberry']
    });
  });
  it('partition splits array by predicate', () => {
    const [evens, odds] = partition([1, 2, 3, 4, 5, 6], (n) => n % 2 === 0);
    expect(evens).toEqual([2, 4, 6]);
    expect(odds).toEqual([1, 3, 5]);
  });
  describe('chunk', () => {
    it('splits array into chunks of specified size', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(chunk(['a', 'b', 'c', 'd'], 3)).toEqual([['a', 'b', 'c'], ['d']]);
      expect(chunk([true, false, true], 1)).toEqual([[true], [false], [true]]);
    });

    it('throws error if size is less than or equal to 0', () => {
      expect(() => chunk([1, 2, 3], 0)).toThrowError(
        'Chunk size must be greater than 0'
      );
      expect(() => chunk([1, 2, 3], -1)).toThrowError(
        'Chunk size must be greater than 0'
      );
    });
  });
  describe('range', () => {
    it('creates an array of numbers from start to end (inclusive)', () => {
      expect(range(0, 3)).toEqual([0, 1, 2, 3]);
      expect(range(2, 5)).toEqual([2, 3, 4, 5]);
      expect(range(-2, 2)).toEqual([-2, -1, 0, 1, 2]);
    });
    it('returns a single-element array when start equals end', () => {
      expect(range(5, 5)).toEqual([5]);
    });

    it('creates a descending array when start > end', () => {
      expect(range(10, 5)).toEqual([10, 9, 8, 7, 6, 5]);
      expect(range(3, 1)).toEqual([3, 2, 1]);
    });
    it('throws error if arguments are not integers', () => {
      expect(() => range(1.5, 5)).toThrowError(
        'range function only accepts integers'
      );
      expect(() => range(2, '5' as any)).toThrowError(
        'range function only accepts integers'
      );
    });
    it('throws error if step is less than or equal to 0', () => {
      expect(() => range(1, 5, 0)).toThrowError('Step must be greater than 0');
      expect(() => range(1, 5, -2)).toThrowError('Step must be greater than 0');
    });
  });
  describe('merge', () => {
    it('returns clone(current) when next is empty', () => {
      let cloneCalls = 0;
      const cl = <T>(a: T[]) => {
        cloneCalls++;
        return [...a];
      };
      const current = [1, 2];
      const res = merge(current, [], { cloneStrategy: cl });
      expect(res).toEqual([1, 2]);
      expect(res).not.toBe(current);
      expect(cloneCalls).toBe(1);
    });

    it('behavior: overwrite with flat next and with list of next arrays', () => {
      let cloneCalls = 0;
      const cl = <T>(a: T[]) => {
        cloneCalls++;
        return [...a];
      };
      const r1 = merge([1], [9, 9], {
        behavior: 'overwrite',
        cloneStrategy: cl
      });
      expect(r1).toEqual([9, 9]);

      const r2 = merge([0], [[5], [6, 7]], {
        behavior: 'overwrite',
        cloneStrategy: cl
      });
      expect(r2).toEqual([6, 7]);

      expect(cloneCalls).toBeGreaterThanOrEqual(3);
    });

    it('behavior: append (flat and nested next)', () => {
      const cl = <T>(a: T[]) => [...a];
      const r1 = merge([1], [2, 3], { behavior: 'append', cloneStrategy: cl });
      expect(r1).toEqual([1, 2, 3]);

      const r2 = merge([1], [[2], [3, 4]], {
        behavior: 'append',
        cloneStrategy: cl
      });
      expect(r2).toEqual([1, 2, 3, 4]);
    });

    it('behavior: prepend (flat and nested next)', () => {
      const r1 = merge([3], [1, 2], {
        behavior: 'prepend',
        cloneStrategy: 'shallow'
      });
      expect(r1).toEqual([1, 2, 3]);

      const r2 = merge([3], [[1], [2]], {
        behavior: 'prepend',
        cloneStrategy: 'shallow'
      });
      expect(r2).toEqual([2, 1, 3]);
    });

    it('behavior: custom function receives clone and can early-transform', () => {
      let cloneCalls = 0;
      const cl = <T>(a: T[]) => {
        cloneCalls++;
        return [...a];
      };
      const behavior = <T>(curr: T[], next: T[]) => {
        const c = cl(next);
        return [...curr, ...c.toReversed()];
      };
      const res = merge([1, 2], [[3, 4], [5]], { behavior, cloneStrategy: cl });
      expect(res).toEqual([1, 2, 4, 3, 5]);
      expect(cloneCalls).toBeGreaterThanOrEqual(3);
    });

    it('compaction: nullish vs falsy, and dedupe: true', () => {
      const input = [1, null, 2, undefined, 0, '', 3, Number.NaN, 3] as any[];
      const rNullish = merge([], input, {
        behavior: 'overwrite',
        compact: 'nullish',
        dedupe: true
      });
      expect(rNullish).toEqual([1, 2, 0, '', 3, Number.NaN]);

      const rFalsy = merge([], input, {
        behavior: 'overwrite',
        compact: 'falsy',
        dedupe: true
      });
      expect(rFalsy).toEqual([1, 2, 3]);
    });

    it('dedupe with custom function', () => {
      const dedupeFn = (arr: number[]) => [...arr].toReversed();
      const res = merge([1, 2, 3], [4, 5], {
        behavior: 'append',
        dedupe: dedupeFn
      });
      expect(res).toEqual([5, 4, 3, 2, 1]);
    });
  });
  describe('init', () => {
    it('creates array of specified length filled with given value', () => {
      expect(init(5, null)).toEqual([null, null, null, null, null]);
      expect(init(3, 'x')).toEqual(['x', 'x', 'x']);
      expect(init(3, (i) => i * 2)).toEqual([0, 2, 4]);
      expect(init(0, 'x')).toEqual([]);
      expect(() => init(-1)).toThrowError();
      expect(() => init(2.5)).toThrowError();
      expect(() => init(Number.NaN)).toThrowError();
    });
  });
  describe('clone', () => {
    it('shallow clone works', () => {
      const arr = [{ x: 1 }, { y: 2 }];
      const c = clone(arr, 'shallow');
      expect(c).toEqual(arr);
      expect(c).not.toBe(arr);
      expect(c[0]).toBe(arr[0]);
    });
    it('deep clone works', () => {
      const arr = [{ x: 1, z: { a: 10 } }, { y: 2 }];
      const c = clone(arr, 'structured');
      expect(c).toEqual(arr);
      expect(c).not.toBe(arr);
      expect(c[0]).not.toBe(arr[0]);
      expect(c[0].z).not.toBe(arr[0].z);
    });
    it('custom clone function works', () => {
      let calls = 0;
      const customClone = <T>(a: T[]) => {
        calls++;
        return a.map((v) => (typeof v === 'object' ? { ...(v as any) } : v));
      };
      const arr = [{ x: 1, z: { a: 10 } }, { y: 2 }];
      const c = clone(arr, customClone);
      expect(c).toEqual(arr);
      expect(c).not.toBe(arr);
      expect(c[0]).not.toBe(arr[0]);
      expect(c[0].z).toBe(arr[0].z);
      expect(calls).toBe(1);
    });
  });

  describe('half', () => {
    it('splits array into two halves, rounding down by default', () => {
      expect(half([1, 2, 3, 4])).toEqual([
        [1, 2],
        [3, 4]
      ]);
      expect(half([1, 2, 3])).toEqual([[1], [2, 3]]);
      expect(half([])).toEqual([[], []]);
    });
    it('respects roundType parameter', () => {
      expect(half([1, 2, 3], 'ceil')).toEqual([[1, 2], [3]]);
      expect(half([1, 2, 3, 4], 'ceil')).toEqual([
        [1, 2],
        [3, 4]
      ]);
      expect(half([], 'ceil')).toEqual([[], []]);
    });
  });
  describe('isOfType', () => {
    it('returns false for empty array', () => {
      expect(isOfType<number>([])).toBe(false);
    });
    it('returns true when all elements match the type guard', () => {
      const isNumber = (v: unknown): v is number => typeof v === 'number';
      expect(isOfType<number>([1, 2, 3], isNumber)).toBe(true);
      expect(
        isOfType<string>(['a', 'b'], (v): v is string => typeof v === 'string')
      ).toBe(true);
    });
    it('returns false when any element does not match the type guard', () => {
      const isNumber = (v: unknown): v is number => typeof v === 'number';
      expect(isOfType<number>([1, '2', 3], isNumber)).toBe(false);
      expect(
        isOfType<string>(['a', null], (v): v is string => typeof v === 'string')
      ).toBe(false);
    });
    it('defaults to checking typeof first element if no type guard provided', () => {
      expect(isOfType<number>([1, 2, 3])).toBe(true);
      expect(isOfType<string>(['a', 'b', 'c'])).toBe(true);
      expect(isOfType<number>([1, '2', 3])).toBe(false);
      expect(isOfType<object>([{ x: 1 }, { y: 2 }])).toBe(true);
      expect(isOfType<object>([{ x: 1 }, null])).toBe(true);
    });
  });
  describe('deep', () => {
    it('compactNullish', () => {
      const arr = [1, null, [2, 3, null, [4, null]], undefined];
      expect(deep.compactNullish(arr)).toEqual([1, [2, 3, [4]]]);
    });
    it('compactFalsy', () => {
      const arr = [0, 1, false, [2, '', 3, [null, 4, Number.NaN]], undefined];
      expect(deep.compactFalsy(arr)).toEqual([1, [2, 3, [4]]]);
    });
  });
});
