import { describe, it, expect, expectTypeOf } from 'vitest';
import { dedupe, dedupeInPlace } from './dedupe.js';

describe('Array Dedupe', () => {
  describe('dedupe', () => {
    describe('without key function', () => {
      it('should remove duplicate primitives', () => {
        const arr = [1, 2, 2, 3, 1, 4, 3];
        const result = dedupe(arr);
        expect(result).toEqual([1, 2, 3, 4]);
        expectTypeOf(result).toEqualTypeOf<number[]>();
      });
      it('should preserve original order', () => {
        const arr = [3, 1, 2, 1, 3, 2];
        const result = dedupe(arr);
        expect(result).toEqual([3, 1, 2]);
        expectTypeOf(result).toEqualTypeOf<number[]>();
      });
      it('should handle empty arrays', () => {
        const arr: number[] = [];
        const result = dedupe(arr);
        expect(result).toEqual([]);
        expectTypeOf(result).toEqualTypeOf<number[]>();
      });
      it('should handle arrays with no duplicates', () => {
        const arr = [1, 2, 3, 4, 5];
        const result = dedupe(arr);
        expect(result).toEqual([1, 2, 3, 4, 5]);
        expectTypeOf(result).toEqualTypeOf<number[]>();
      });
      it('should handle arrays with all duplicates', () => {
        const arr = [1, 1, 1, 1];
        const result = dedupe(arr);
        expect(result).toEqual([1]);
        expectTypeOf(result).toEqualTypeOf<number[]>();
      });
      it('should remove duplicate strings', () => {
        const arr = ['a', 'b', 'a', 'c', 'b'];
        const result = dedupe(arr);
        expect(result).toEqual(['a', 'b', 'c']);
        expectTypeOf(result).toEqualTypeOf<string[]>();
      });
      it('should handle mixed types', () => {
        const arr = [1, '1', 2, '2', 1, '1'];
        const result = dedupe(arr);
        expect(result).toEqual([1, '1', 2, '2']);
        expectTypeOf(result).toEqualTypeOf<(string | number)[]>();
      });
      it('should only compare object references, not contents', () => {
        const obj1 = { a: 1 };
        const obj2 = { a: 1 };
        const arr = [obj1, obj2, obj1];
        const result = dedupe(arr);
        expect(result).toEqual([obj1, obj2]);
        expect(result.length).toBe(2);
        expectTypeOf(result).toEqualTypeOf<{ a: number }[]>();
      });
      it('should dedupe array references, not contents', () => {
        const arr1 = [1, 2];
        const arr2 = [1, 2];
        const arr = [arr1, arr2, arr1];
        const result = dedupe(arr);
        expect(result).toEqual([arr1, arr2]);
        expect(result.length).toBe(2);
        expectTypeOf(result).toEqualTypeOf<number[][]>();
      });
      it('should handle null and undefined', () => {
        const arr = [null, undefined, null, 1, undefined, 1];
        const result = dedupe(arr);
        expect(result).toEqual([null, undefined, 1]);
        expectTypeOf(result).toEqualTypeOf<(number | null | undefined)[]>();
      });
      it('should handle boolean values', () => {
        const arr = [true, false, true, false, true];
        const result = dedupe(arr);
        expect(result).toEqual([true, false]);
        expectTypeOf(result).toEqualTypeOf<boolean[]>();
      });
      it('should not mutate original array', () => {
        const arr = [1, 2, 2, 3, 1];
        const original = [...arr];
        dedupe(arr);
        expect(arr).toEqual(original);
      });
    });
    describe('with key function', () => {
      it('should dedupe by key function', () => {
        const arr = [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
          { id: 1, name: 'Alice Clone' }
        ];
        const result = dedupe(arr, (item) => item.id);
        expect(result).toEqual([
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' }
        ]);
        expectTypeOf(result).toEqualTypeOf<{ id: number; name: string }[]>();
      });

      it('should preserve first occurrence when duplicates found', () => {
        const arr = [
          { id: 1, value: 'first' },
          { id: 1, value: 'second' },
          { id: 2, value: 'third' }
        ];
        const result = dedupe(arr, (item) => item.id);
        expect(result[0].value).toBe('first');
        expect(result.length).toBe(2);
        expectTypeOf(result).toEqualTypeOf<{ id: number; value: string }[]>();
      });

      it('should handle complex key functions', () => {
        const arr = [
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Smith' },
          { first: 'John', last: 'Doe' }
        ];
        const result = dedupe(arr, (item) => `${item.first}-${item.last}`);
        expect(result).toEqual([
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Smith' }
        ]);
        expectTypeOf(result).toEqualTypeOf<{ first: string; last: string }[]>();
      });

      it('should handle nested property keys', () => {
        const arr = [
          { user: { id: 1 }, data: 'a' },
          { user: { id: 2 }, data: 'b' },
          { user: { id: 1 }, data: 'c' }
        ];
        const result = dedupe(arr, (item) => item.user.id);
        expect(result.length).toBe(2);
        expect(result[0].data).toBe('a');
        expectTypeOf(result).toEqualTypeOf<{ user: { id: number }; data: string }[]>();
      });

      it('should handle empty arrays', () => {
        const arr: { id: number }[] = [];
        const result = dedupe(arr, (item) => item.id);
        expect(result).toEqual([]);
        expectTypeOf(result).toEqualTypeOf<{ id: number }[]>();
      });

      it('should handle arrays with no duplicates by key', () => {
        const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const result = dedupe(arr, (item) => item.id);
        expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
        expectTypeOf(result).toEqualTypeOf<{ id: number }[]>();
      });

      it('should handle key function returning undefined', () => {
        const arr = [
          { id: 1, optional: 'a' },
          { id: 2, optional: undefined },
          { id: 3, optional: undefined }
        ];
        const result = dedupe(arr, (item) => item.optional);
        expect(result.length).toBe(2);
        expectTypeOf(result).branded.toEqualTypeOf<
          { id: number; optional: string | undefined }[]
        >();
      });

      it('should handle key function returning objects', () => {
        const arr = [
          { x: 1, y: 2 },
          { x: 1, y: 3 },
          { x: 2, y: 2 }
        ];
        const result = dedupe(arr, (item) => ({ x: item.x }));
        // Each object key is unique by reference
        expect(result.length).toBe(3);
        expectTypeOf(result).toEqualTypeOf<{ x: number; y: number }[]>();
      });

      it('should not mutate original array', () => {
        const arr = [{ id: 1 }, { id: 2 }, { id: 1 }];
        const original = [...arr];
        dedupe(arr, (item) => item.id);
        expect(arr).toEqual(original);
      });
    });
  });

  describe('dedupeInPlace', () => {
    describe('without key function', () => {
      it('should remove duplicate primitives in place', () => {
        const arr = [1, 2, 2, 3, 1, 4, 3];
        const result = dedupeInPlace(arr);
        expect(result).toEqual([1, 2, 3, 4]);
        expect(arr).toEqual([1, 2, 3, 4]);
        expect(result).toBe(arr);
        expectTypeOf(result).toEqualTypeOf<number[]>();
      });

      it('should preserve original order in place', () => {
        const arr = [3, 1, 2, 1, 3, 2];
        dedupeInPlace(arr);
        expect(arr).toEqual([3, 1, 2]);
      });

      it('should handle empty arrays in place', () => {
        const arr: number[] = [];
        dedupeInPlace(arr);
        expect(arr).toEqual([]);
      });

      it('should handle arrays with no duplicates in place', () => {
        const arr = [1, 2, 3, 4, 5];
        dedupeInPlace(arr);
        expect(arr).toEqual([1, 2, 3, 4, 5]);
      });

      it('should handle arrays with all duplicates in place', () => {
        const arr = [1, 1, 1, 1];
        dedupeInPlace(arr);
        expect(arr).toEqual([1]);
      });

      it('should remove duplicate strings in place', () => {
        const arr = ['a', 'b', 'a', 'c', 'b'];
        dedupeInPlace(arr);
        expect(arr).toEqual(['a', 'b', 'c']);
      });

      it('should handle mixed types in place', () => {
        const arr: (string | number)[] = [1, '1', 2, '2', 1, '1'];
        dedupeInPlace(arr);
        expect(arr).toEqual([1, '1', 2, '2']);
      });

      it('should only compare object references in place', () => {
        const obj1 = { a: 1 };
        const obj2 = { a: 1 };
        const arr = [obj1, obj2, obj1];
        dedupeInPlace(arr);
        expect(arr).toEqual([obj1, obj2]);
        expect(arr.length).toBe(2);
      });

      it('should handle null and undefined in place', () => {
        const arr: (number | null | undefined)[] = [null, undefined, null, 1, undefined, 1];
        dedupeInPlace(arr);
        expect(arr).toEqual([null, undefined, 1]);
      });

      it('should properly update array length', () => {
        const arr = [1, 1, 1, 2, 2, 3];
        const originalLength = arr.length;
        dedupeInPlace(arr);
        expect(arr.length).toBe(3);
        expect(arr.length).toBeLessThan(originalLength);
      });

      it('should return the same array reference', () => {
        const arr = [1, 2, 2, 3];
        const result = dedupeInPlace(arr);
        expect(result).toBe(arr);
      });
    });
    describe('with key function', () => {
      it('should dedupe by key function in place', () => {
        const arr = [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
          { id: 1, name: 'Alice Clone' }
        ];
        const result = dedupeInPlace(arr, (item) => item.id);
        expect(result).toEqual([
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' }
        ]);
        expect(arr).toEqual([
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' }
        ]);
        expect(result).toBe(arr);
        expectTypeOf(result).toEqualTypeOf<{ id: number; name: string }[]>();
      });

      it('should preserve first occurrence when duplicates found in place', () => {
        const arr = [
          { id: 1, value: 'first' },
          { id: 1, value: 'second' },
          { id: 2, value: 'third' }
        ];
        dedupeInPlace(arr, (item) => item.id);
        expect(arr[0].value).toBe('first');
        expect(arr.length).toBe(2);
      });

      it('should handle complex key functions in place', () => {
        const arr = [
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Smith' },
          { first: 'John', last: 'Doe' }
        ];
        dedupeInPlace(arr, (item) => `${item.first}-${item.last}`);
        expect(arr).toEqual([
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Smith' }
        ]);
      });

      it('should handle nested property keys in place', () => {
        const arr = [
          { user: { id: 1 }, data: 'a' },
          { user: { id: 2 }, data: 'b' },
          { user: { id: 1 }, data: 'c' }
        ];
        dedupeInPlace(arr, (item) => item.user.id);
        expect(arr.length).toBe(2);
        expect(arr[0].data).toBe('a');
      });

      it('should handle empty arrays in place', () => {
        const arr: { id: number }[] = [];
        dedupeInPlace(arr, (item) => item.id);
        expect(arr).toEqual([]);
      });

      it('should handle arrays with no duplicates by key in place', () => {
        const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
        dedupeInPlace(arr, (item) => item.id);
        expect(arr).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
      });

      it('should handle key function returning undefined in place', () => {
        const arr = [
          { id: 1, optional: 'a' },
          { id: 2, optional: undefined },
          { id: 3, optional: undefined }
        ];
        dedupeInPlace(arr, (item) => item.optional);
        expect(arr.length).toBe(2);
      });

      it('should handle numeric keys in place', () => {
        const arr = [{ value: 10 }, { value: 20 }, { value: 10 }];
        dedupeInPlace(arr, (item) => item.value);
        expect(arr).toEqual([{ value: 10 }, { value: 20 }]);
      });

      it('should properly update array length in place', () => {
        const arr = [{ id: 1 }, { id: 1 }, { id: 2 }, { id: 2 }, { id: 3 }];
        const originalLength = arr.length;
        dedupeInPlace(arr, (item) => item.id);
        expect(arr.length).toBe(3);
        expect(arr.length).toBeLessThan(originalLength);
      });

      it('should return the same array reference', () => {
        const arr = [{ id: 1 }, { id: 2 }, { id: 2 }];
        const result = dedupeInPlace(arr, (item) => item.id);
        expect(result).toBe(arr);
      });

      it('should handle large arrays efficiently', () => {
        const arr = Array.from({ length: 1000 }, (_, i) => ({ id: i % 100 }));
        dedupeInPlace(arr, (item) => item.id);
        expect(arr.length).toBe(100);
      });
    });
  });
});
