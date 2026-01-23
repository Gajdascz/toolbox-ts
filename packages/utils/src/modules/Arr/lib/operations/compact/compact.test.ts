import { describe, expect, it } from 'vitest';

import {
  compact,
  compactFalsy,
  compactNull,
  compactUndefined
} from './compact.ts';

describe('compact', () => {
  it('default (Nullish)', () => {
    expect(compact([1, null, 2, null, 3, undefined])).toEqual([1, 2, 3]);
    expect(compact([null, undefined])).toEqual([]);
    expect(compact([false, null, undefined, '', 0, Number.NaN])).toEqual([
      false,
      '',
      0,
      Number.NaN
    ]);
  });
  describe('Falsy', () => {
    it('removes falsy from mixed array', () => {
      expect(
        compactFalsy([0, 1, false, 2, '', 3, null, undefined, 4, Number.NaN])
      ).toEqual([1, 2, 3, 4]);
    });
    it('removes all falsy values from an array of only falsy values', () => {
      expect(compactFalsy([false, null, undefined, '', 0, Number.NaN])).toEqual(
        []
      );
    });
    it('retains empty objects and arrays', () => {
      const arr = [{}, [], false, null];
      expect(compactFalsy(arr)).toEqual([{}, []]);
    });
  });
  it('Null', () => {
    expect(compactNull([1, null, 2, null, 3, undefined])).toEqual([
      1,
      2,
      3,
      undefined
    ]);
    expect(compactNull([null, null])).toEqual([]);
  });
  it('Undefined', () => {
    expect(compactUndefined([1, undefined, 2, undefined, 3])).toEqual([
      1, 2, 3
    ]);
    expect(compactUndefined([undefined, undefined])).toEqual([]);
  });
});
