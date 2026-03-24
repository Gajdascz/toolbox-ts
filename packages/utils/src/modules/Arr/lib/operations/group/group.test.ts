import { describe, expect, it } from 'vitest';

import { group } from './group.ts';

const numArr = [1, 2, 3, 4, 5, 6];
const strArr = ['one', 'two', 'three', 'four'];
const objArr = [
  { type: 'a', val: 1 },
  { type: 'b', val: 2 },
  { type: 'a', val: 3 }
];
const emptyArr: number[] = [];

describe('Array Group', () => {
  it('groups by function result', () => {
    const result = group(numArr, (n) => (n % 2 === 0 ? 'even' : 'odd'));
    expect(result).toEqual({ odd: [1, 3, 5], even: [2, 4, 6] });
  });

  it('groups by string length', () => {
    const result = group(strArr, (s) => s.length.toString());
    expect(result).toEqual({ '3': ['one', 'two'], '4': ['four'], '5': ['three'] });
  });

  it('groups by object property', () => {
    const result = group(objArr, (obj) => obj.type);
    expect(result).toEqual({ a: [objArr[0], objArr[2]], b: [objArr[1]] });
  });

  it('returns empty object for empty array', () => {
    expect(group(emptyArr, (n) => n.toString())).toEqual({});
  });

  it('handles single group', () => {
    const result = group(numArr, () => 'all');
    expect(result).toEqual({ all: numArr });
  });
});
