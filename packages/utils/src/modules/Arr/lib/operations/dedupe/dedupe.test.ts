import { describe, expect, it } from 'vitest';

import { dedupe } from './dedupe.ts';

const withDupes = [1, 2, 2, 3, 3, 3, 4];
const strDupes = ['a', 'b', 'a', 'c', 'b'];
const noDupes = [1, 2, 3, 4, 5];
const allSame = [1, 1, 1, 1];
const emptyArr: number[] = [];
const objArr = [{ id: 1 }, { id: 2 }, { id: 1 }];

describe('dedupe', () => {
  it('removes duplicate primitives', () => {
    expect(dedupe(withDupes)).toEqual([1, 2, 3, 4]);
  });

  it('removes duplicate strings', () => {
    expect(dedupe(strDupes)).toEqual(['a', 'b', 'c']);
  });

  it('returns same array when no duplicates', () => {
    expect(dedupe(noDupes)).toEqual(noDupes);
  });

  it('returns single element when all same', () => {
    expect(dedupe(allSame)).toEqual([1]);
  });

  it('works with empty array', () => {
    expect(dedupe(emptyArr)).toEqual([]);
  });

  it('preserves first occurrence order', () => {
    expect(dedupe([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
  });
});
