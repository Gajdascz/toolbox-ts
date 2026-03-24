// insert.test.ts
import { describe, expect, it } from 'vitest';

import { insert } from './insert.ts';

const numArr = [1, 2, 3, 4, 5];
const strArr = ['a', 'b', 'c'];
const emptyArr: number[] = [];

describe('Array Insert', () => {
  it('inserts at beginning', () => {
    expect(insert(numArr, [0], 0)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('inserts in middle', () => {
    expect(insert(numArr, [99, 100], 2)).toEqual([1, 2, 99, 100, 3, 4, 5]);
  });

  it('inserts at end', () => {
    expect(insert(numArr, 6, numArr.length)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('inserts beyond length appends to end', () => {
    expect(insert(numArr, 99, 10)).toEqual([1, 2, 3, 4, 5, 99]);
  });

  it('inserts into empty array', () => {
    expect(insert(emptyArr, 0, 0)).toEqual([0]);
  });

  it('handles negative index from end', () => {
    expect(insert(numArr, 99, -1)).toEqual([1, 2, 3, 4, 99, 5]);
  });

  it('inserts multiple values', () => {
    expect(insert(strArr, ['x', 'y'], 1)).toEqual(['a', 'x', 'y', 'b', 'c']);
  });

  it('does not mutate original array', () => {
    const original = [1, 2, 3];
    insert(original, 1, 99);
    expect(original).toEqual([1, 2, 3]);
  });
});
