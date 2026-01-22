import { describe, expect, it } from 'vitest';

import { compact } from './compact.ts';

describe('compact', () => {
  it('removes falsy values', () => {
    expect(
      compact([0, 1, false, 2, '', 3, null, undefined, 4, Number.NaN], 'falsy')
    ).toEqual([1, 2, 3, 4]);
    expect(
      compact([false, null, undefined, '', 0, Number.NaN], 'falsy')
    ).toEqual([]);
    const arr = [{}, [], false, null];
    expect(compact(arr, 'falsy')).toEqual([{}, []]);
  });
  it('removes null values', () => {
    expect(compact([1, null, 2, null, 3, undefined], 'null')).toEqual([
      1,
      2,
      3,
      undefined
    ]);
    expect(compact([null, null], 'nullish')).toEqual([]);
  });
  it('removes nullish values', () => {
    expect(compact([1, null, 2, null, 3, undefined], 'nullish')).toEqual([
      1, 2, 3
    ]);
    expect(compact([null, undefined], 'nullish')).toEqual([]);
  });
  it('removes undefined values', () => {
    expect(compact([1, undefined, 2, undefined, 3], 'undefined')).toEqual([
      1, 2, 3
    ]);
    expect(compact([undefined, undefined], 'undefined')).toEqual([]);
  });
});
