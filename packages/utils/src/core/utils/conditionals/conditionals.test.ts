import { describe, expect, it, vi } from 'vitest';

import { when, whenAll, wrapAllWhen, wrapWhen } from './conditionals.ts';

describe('conditional helpers', () => {
  describe('when', () => {
    it('returns value when condition is truthy', () => {
      expect(when(true, { a: 1 })).toEqual({ a: 1 });
      expect(when('key' as const, (c) => ({ [c]: 1 }))).toEqual({ key: 1 });
    });

    it('returns fallback when condition is falsy', () => {
      expect(when(false, { a: 1 }, { b: 2 })).toEqual({ b: 2 });
      expect(when(0, 'value', 'fallback')).toBe('fallback');
      expect(when('', 'value')).toBeUndefined();
    });

    it('calls value function with condition when condition is truthy', () => {
      expect(when(true, () => ({ a: 'passed' }))).toEqual({ a: 'passed' });
      expect(when('true' as const, (c) => ({ a: c }))).toEqual({ a: 'true' });
    });

    it('does not call value function when condition is falsy', () => {
      const fn = vi.fn();
      expect(when(false, fn, { b: 2 })).toEqual({ b: 2 });
      expect(fn).not.toHaveBeenCalled();
    });
  });
  describe('whenAll', () => {
    it('returns value when all conditions are truthy', () => {
      expect(whenAll([true, 1, 'non-empty'], { a: 1 })).toEqual({ a: 1 });
      expect(whenAll([true, 1, 'non-empty'], (c) => ({ a: c }))).toEqual({
        a: [true, 1, 'non-empty']
      });
    });
    it('returns fallback when any condition is falsy', () => {
      expect(whenAll([true, 0, 'non-empty'], { a: 1 }, { b: 2 })).toEqual({ b: 2 });
      expect(whenAll([true, '', 'non-empty'], { a: 1 }, { b: 2 })).toEqual({ b: 2 });
      expect(whenAll([true, null, 'non-empty'], { a: 1 }, { b: 2 })).toEqual({ b: 2 });
    });
  });
  describe('wrapWhen', () => {
    it('wraps a truthy value under the provided key', () => {
      expect(wrapWhen('test', true)).toEqual({ test: true });
      expect(wrapWhen('n', 123)).toEqual({ n: 123 });
    });

    it('returns the provided `r` value when key is missing or value is null/false', () => {
      // key not a string
      expect(wrapWhen(false, true)).toBeUndefined();
      // value null/false => default r (undefined)
      expect(wrapWhen('x', null as any)).toBeUndefined();
      expect(wrapWhen('x', false)).toBeUndefined();

      // custom r
      expect(wrapWhen('x', null)).toBeUndefined();
    });

    it('applies transform function and passes the key to it', () => {
      const res = wrapWhen('k', 'v', { transform: (v: string, k: string) => `${k}:${v}` });
      expect(res).toEqual({ k: 'k:v' });
    });
  });
  describe('wrapAllWhen', () => {
    it('wraps multiple truthy values under their respective keys', () => {
      expect(
        wrapAllWhen([
          ['a', 1],
          ['b', null],
          ['c', false],
          ['d', 4]
        ])
      ).toEqual({ a: 1, d: 4 });
    });
    it('applies transform function to all values', () => {
      expect(
        wrapAllWhen(
          [
            ['a', 1],
            ['b', null],
            ['c', false],
            ['d', 4]
          ],
          { transform: (v: number, k: string) => `${k}:${v}` }
        )
      ).toEqual({ a: 'a:1', d: 'd:4' });
    });
    it('excludes falsy values when excludeFalsy is true', () => {
      expect(
        wrapAllWhen<string, number | string>(
          [
            ['a', 1],
            ['b', 0],
            ['c', ''],
            ['d', 4]
          ],
          { excludeFalsy: true }
        )
      ).toEqual({ a: 1, d: 4 });
    });
  });
});
