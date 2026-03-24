import { describe, expect, it } from 'vitest';

import { chunk } from './chunk.ts';

const numArr = [1, 2, 3, 4, 5, 6, 7];
const strArr = ['a', 'b', 'c', 'd', 'e'];
const objArr = [{ id: 1 }, { id: 2 }, { id: 3 }];
const emptyArr: number[] = [];
const singleArr = [42];
const mixedArr = [1, 'a', null, undefined, true];

describe('Array Chunk', () => {
  it('returns empty array for empty input', () => {
    expect(chunk(emptyArr, 2)).toEqual([]);
  });

  it('returns single chunk when size >= array length', () => {
    expect(chunk(numArr.slice(0, 3), 3)).toEqual([[1, 2, 3]]);
    expect(chunk(numArr.slice(0, 3), 5)).toEqual([[1, 2, 3]]);
  });

  it('splits array evenly when divisible by size', () => {
    expect(chunk(numArr.slice(0, 6), 2)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6]
    ]);
    expect(chunk(numArr.slice(0, 6), 3)).toEqual([
      [1, 2, 3],
      [4, 5, 6]
    ]);
  });

  it('handles uneven division with smaller last chunk', () => {
    expect(chunk(numArr.slice(0, 5), 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk(strArr.slice(0, 4), 3)).toEqual([['a', 'b', 'c'], ['d']]);
    expect(chunk(numArr, 3)).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });

  it('creates individual chunks when size is 1', () => {
    expect(chunk(numArr.slice(0, 3), 1)).toEqual([[1], [2], [3]]);
  });

  it('works with strings', () => {
    expect(chunk(strArr, 2)).toEqual([['a', 'b'], ['c', 'd'], ['e']]);
  });

  it('works with objects', () => {
    expect(chunk(objArr, 2)).toEqual([[objArr[0], objArr[1]], [objArr[2]]]);
  });

  it('works with mixed types', () => {
    expect(chunk(mixedArr, 2)).toEqual([[1, 'a'], [null, undefined], [true]]);
  });

  it('handles single element array', () => {
    expect(chunk(singleArr, 1)).toEqual([[42]]);
    expect(chunk(singleArr, 2)).toEqual([[42]]);
  });

  it.each([
    ['zero', [0]],
    ['negative', [-1, -5]],
    ['non-integer', [2.5, 1.1, -4]],
    ['NaN', [Number.NaN, -Number.NaN]]
  ])('Throws TypeError for %s size.', (_, cases) => {
    for (const size of cases) expect(() => chunk(numArr, size)).toThrow(TypeError);
  });
});
