import { describe, expect, it } from 'vitest';

import { clone } from './clone.ts';

const numArr = [1, 2, 3, 4, 5];
const strArr = ['a', 'b', 'c'];
const objArr = [{ id: 1 }, { id: 2 }];
const nestedArr = [
  [1, 2],
  [3, 4]
];
const emptyArr: number[] = [];

describe('Array Clone', () => {
  it('creates shallow copy of array', () => {
    const cloned = clone(numArr);
    expect(cloned).toEqual(numArr);
    expect(cloned).not.toBe(numArr);
  });

  it('works with empty array', () => {
    expect(clone(emptyArr)).toEqual([]);
  });

  it('works with strings', () => {
    const cloned = clone(strArr);
    expect(cloned).toEqual(strArr);
    expect(cloned).not.toBe(strArr);
  });

  it('creates shallow copy of objects', () => {
    const cloned = clone(objArr);
    expect(cloned).toEqual(objArr);
    expect(cloned).not.toBe(objArr);
    expect(cloned[0]).toBe(objArr[0]);
  });

  it('creates shallow copy of nested arrays', () => {
    const cloned = clone(nestedArr);
    expect(cloned).toEqual(nestedArr);
    expect(cloned).not.toBe(nestedArr);
    expect(cloned[0]).toBe(nestedArr[0]);
  });

  it('modifications to clone do not affect original', () => {
    const cloned = clone(numArr);
    cloned.push(6);
    expect(cloned).toHaveLength(6);
    expect(numArr).toHaveLength(5);
  });
  it('uses custom function for cloning', () => {
    const arr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
    const cloned = clone(arr, { depth: 1, handler: (item) => ({ ...item }) });
    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
    expect(cloned[0]).not.toBe(arr[0]);
  });
});
