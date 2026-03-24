import { describe, expect, it } from 'vitest';

import { coalesceFirst, coalesceLast } from './coalesce.ts';

describe('Array Coalesce', () => {
  describe('first', () => {
    it('should return the first non-undefined value from the arrays', () => {
      expect(coalesceFirst([undefined, 2, 3], [4, 5, 6])).toEqual([
        undefined,

        2,

        3
      ]);
    });
    it('skips nullish arrays', () => {
      expect(coalesceFirst(undefined, [4, 5, 6])).toEqual([4, 5, 6]);
      expect(coalesceFirst(undefined, null, undefined, [undefined, 2, 3])).toEqual([
        undefined,
        2,
        3
      ]);
    });
    it('returns empty array if all inputs are undefined or null', () => {
      expect(coalesceFirst(undefined, null, undefined)).toEqual([]);
    });
  });
  describe('last', () => {
    it('should return the last non-undefined value from the arrays', () => {
      expect(coalesceLast([undefined, 2, 3], [4, 5, 6])).toEqual([4, 5, 6]);
    });
    it('skips nullish arrays', () => {
      expect(coalesceLast([undefined, 2, 3], undefined, [4, 5, 6])).toEqual([4, 5, 6]);
      expect(coalesceLast([undefined, 2, 3], undefined, null, undefined)).toEqual([
        undefined,
        2,
        3
      ]);
    });
    it('returns empty array if all inputs are undefined or null', () => {
      expect(coalesceLast(undefined, null, undefined)).toEqual([]);
    });
  });
});
