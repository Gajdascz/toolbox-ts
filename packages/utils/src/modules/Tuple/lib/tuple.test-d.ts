import type {
  Element,
  First,
  Last,
  LastIndex,
  Reverse,
  Tuple,
  Zip,
  ZipFill,
  ZipRemainderObj
} from '@toolbox-ts/types/defs/tuple';

import { describe, expectTypeOf, it } from 'vitest';

import {
  append,
  at,
  chunk,
  clone,
  compact,
  dedupe,
  entries,
  first,
  init,
  insert,
  last,
  lastIndex,
  longer,
  prepend,
  removeAll,
  removeAt,
  removeFirst,
  removeLast,
  reverse,
  shorter,
  splitAt,
  to,
  zip
} from './tuple.ts';
describe('tuple', () => {
  describe('accessors', () => {
    it('at should return element at index with literal type', () => {
      const t = [1, 'a', true] as const;
      const result = at(t, 0);
      expectTypeOf(result).toEqualTypeOf<Element<typeof t>>();
      expectTypeOf(result).toEqualTypeOf<'a' | 1 | true>();
    });
    it('at should handle different indices', () => {
      const t = [10, 20, 30, 40] as const;
      const result = at(t, 2);
      expectTypeOf(result).toEqualTypeOf<Element<typeof t>>();
      expectTypeOf(result).toEqualTypeOf<10 | 20 | 30 | 40>();
    });
    it('first should return first element with literal type', () => {
      const t = [1, 2, 3] as const;
      const result = first(t);
      expectTypeOf(result).toEqualTypeOf<First<typeof t>>();
      expectTypeOf(result).toEqualTypeOf<1>();
    });
    it('first should handle different first elements', () => {
      const t = ['hello', 'world'] as const;
      const result = first(t);
      expectTypeOf(result).toEqualTypeOf<'hello'>();
    });
    it('last should return last element with literal type', () => {
      const t = [1, 2, 3] as const;
      const result = last(t);
      expectTypeOf(result).toEqualTypeOf<Last<typeof t>>();
      expectTypeOf(result).toEqualTypeOf<3>();
    });
    it('last should handle different last elements', () => {
      const t = [true, false, true] as const;
      const result = last(t);
      expectTypeOf(result).toEqualTypeOf<true>();
    });
    it('lastIndex should return last index with literal type', () => {
      const t = [1, 2, 3] as const;
      const result = lastIndex(t);
      expectTypeOf(result).toEqualTypeOf<LastIndex<typeof t>>();
      expectTypeOf(result).toEqualTypeOf<2>();
    });
    it('lastIndex should handle single element', () => {
      const t = [42] as const;
      const result = lastIndex(t);
      expectTypeOf(result).toEqualTypeOf<0>();
    });
    it('lastIndex should handle larger tuples', () => {
      const t = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
      const result = lastIndex(t);
      expectTypeOf(result).toEqualTypeOf<9>();
    });
    it('entries should return entries with literal types', () => {
      const t = [1, 'two', 3] as const;
      const result = entries(t);
      expectTypeOf(result).toEqualTypeOf<
        readonly [[0, 1], [1, 'two'], [2, 3]]
      >();
    });
  });

  describe('comparison', () => {
    it('longer should return longer tuple type', () => {
      const a = [1, 2] as const;
      const b = [1, 2, 3] as const;
      const result = longer(a, b);
      expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2, 3]>>();
    });
    it('longer should handle equal length tuples', () => {
      const a = [1, 2, 3] as const;
      const b = ['a', 'b', 'c'] as const;
      const result = longer(a, b);
      expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2, 3]>>();
    });
    it('longer should handle first tuple longer', () => {
      const a = [1, 2, 3, 4] as const;
      const b = [1, 2] as const;
      const result = longer(a, b);
      expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2, 3, 4]>>();
    });
    it('shorter should return shorter tuple type', () => {
      const a = [1, 2, 3] as const;
      const b = [1, 2] as const;
      const result = shorter(a, b);
      expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2]>>();
    });
    it('shorter should handle equal length tuples', () => {
      const a = [1, 2] as const;
      const b = ['a', 'b'] as const;
      const result = shorter(a, b);
      expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2]>>();
    });
    it('shorter should handle second tuple shorter', () => {
      const a = [1, 2, 3, 4] as const;
      const b = [1] as const;
      const result = shorter(a, b);
      expectTypeOf(result).toEqualTypeOf<Tuple<[1]>>();
    });
  });

  describe('creation', () => {
    it('to should convert value to tuple', () => {
      const value = 42;
      const result = to(value);
      expectTypeOf(result).toEqualTypeOf<Tuple<[42]>>();
    });
    it('to should make an array readonly', () => {
      const value = [1, 2, 3];
      const result = to(value);
      expectTypeOf(result).toEqualTypeOf<Tuple<number[]>>();
    });
    it('to should return tuple as-is', () => {
      const value = [1, 2, 3] as const;
      const result = to(value);
      expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2, 3]>>();
    });
    it('init should create a tuple of given length with initial value', () => {
      const result = init(3, 0);
      expectTypeOf(result).toEqualTypeOf<Tuple<[0, 0, 0]>>();
      expectTypeOf(init(4, (i) => i + 2)).toEqualTypeOf<
        Tuple<[number, number, number, number]>
      >();
    });
  });
  describe('operations', () => {
    describe('insert', () => {
      it('insert should insert at index with literal type', () => {
        const t = [1, 2, 3] as const;
        const e = [99] as const;
        const result = insert(t, e, 1);
        expectTypeOf(result).toEqualTypeOf<Tuple<[1, 99, 2, 3]>>();
      });

      it('insert should handle inserting multiple elements', () => {
        const t = ['a', 'b'] as const;
        const e = ['x', 'y'] as const;
        const result = insert(t, e, 0);
        expectTypeOf(result).toEqualTypeOf<Tuple<['x', 'y', 'a', 'b']>>();
      });

      it('append should append elements with literal type', () => {
        const t = [1, 2] as const;
        const e = [3, 4] as const;
        const result = append(t, e);
        expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2, 3, 4]>>();
      });

      it('append should handle different types', () => {
        const t = [1, 2] as const;
        const e = ['a', 'b'] as const;
        const result = append(t, e);
        expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2, 'a', 'b']>>();
      });

      it('prepend should prepend elements with literal type', () => {
        const t = [1, 2] as const;
        const e = [3, 4] as const;
        const result = prepend(t, e);
        expectTypeOf(result).toEqualTypeOf<Tuple<[3, 4, 1, 2]>>();
      });

      it('prepend should handle different types', () => {
        const t = ['a', 'b'] as const;
        const e = [1, 2] as const;
        const result = prepend(t, e);
        expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2, 'a', 'b']>>();
      });
    });
    describe('chunk', () => {
      it('chunk should split into chunks with literal type', () => {
        const t = [1, 2, 3, 4, 5, 6] as const;
        const result = chunk(t, 2);
        expectTypeOf(result).toEqualTypeOf<Tuple<[[1, 2], [3, 4], [5, 6]]>>();
      });

      it('chunk should handle size 3', () => {
        const t = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
        const result = chunk(t, 3);
        expectTypeOf(result).toEqualTypeOf<
          Tuple<[[1, 2, 3], [4, 5, 6], [7, 8, 9]]>
        >();
      });

      it('chunk should handle uneven chunks', () => {
        const t = [1, 2, 3, 4, 5] as const;
        const result = chunk(t, 2);
        expectTypeOf(result).toEqualTypeOf<Tuple<[[1, 2], [3, 4], [5]]>>();
      });
    });
    describe('clone', () => {
      it('clone should preserve tuple type with shallow strategy', () => {
        const t = [1, 2, 3] as const;
        const result = clone(t, 'shallow');
        expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2, 3]>>();
      });

      it('clone should preserve tuple type with default strategy', () => {
        const t = ['a', 'b', 'c'] as const;
        const result = clone(t);
        expectTypeOf(result).toEqualTypeOf<Tuple<['a', 'b', 'c']>>();
      });

      it('clone should handle deep strategy', () => {
        const t = [{ a: 1 }, { b: 2 }] as const;
        const result = clone(t, 'deep');
        expectTypeOf(result).toEqualTypeOf<Tuple<[{ a: 1 }, { b: 2 }]>>();
      });
    });
    describe('splitAt', () => {
      it('splitAt should split at index with literal types', () => {
        const t = [1, 2, 3, 4] as const;
        const result = splitAt(t, 2);
        expectTypeOf(result).toEqualTypeOf<Tuple<[[1, 2], [3, 4]]>>();
      });

      it('splitAt should handle index 0', () => {
        const t = ['a', 'b', 'c'] as const;
        const result = splitAt(t, 0);
        expectTypeOf(result).toEqualTypeOf<Tuple<[[], ['a', 'b', 'c']]>>();
      });

      it('splitAt should handle splitting near end', () => {
        const t = [1, 2, 3, 4, 5] as const;
        const result = splitAt(t, 4);
        expectTypeOf(result).toEqualTypeOf<Tuple<[[1, 2, 3, 4], [5]]>>();
      });
    });
    describe('dedupe', () => {
      it('dedupe should remove duplicates with literal type', () => {
        const t = [1, 2, 2, 3, 3, 3] as const;
        const result = dedupe(t);
        expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2, 3]>>();
      });

      it('dedupe should handle no duplicates', () => {
        const t = [1, 2, 3, 4] as const;
        const result = dedupe(t);
        expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2, 3, 4]>>();
      });

      it('dedupe should handle all same values', () => {
        const t = [1, 1, 1, 1] as const;
        const result = dedupe(t);
        expectTypeOf(result).toEqualTypeOf<Tuple<[1]>>();
      });

      it('dedupe should handle mixed types', () => {
        const t = [1, 'a', 1, 'a', true, true] as const;
        const result = dedupe(t);
        expectTypeOf(result).toEqualTypeOf<Tuple<[1, 'a', true]>>();
      });
    });
    describe('compact', () => {
      it('compact with nullish mode should remove null and undefined', () => {
        const t = [1, null, 2, undefined, 3] as const;
        const result = compact(t, 'nullish');
        expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2, 3]>>();
      });

      it('compact with null mode should remove only null', () => {
        const t = [1, null, 2, null, 3] as const;
        const result = compact(t, 'null');
        expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2, 3]>>();
      });

      it('compact with undefined mode should remove only undefined', () => {
        const t = [1, undefined, 2, undefined, 3] as const;
        const result = compact(t, 'undefined');
        expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2, 3]>>();
      });

      it('compact with falsy mode should remove all falsy values', () => {
        const t = [1, 0, '', false, null, undefined, 2] as const;
        const result = compact(t, 'falsy');
        expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2]>>();
      });

      it('compact with default mode should remove nullish', () => {
        const t = [1, null, 2, undefined, 3] as const;
        const result = compact(t);
        expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2, 3]>>();
      });
    });

    describe('zip', () => {
      it('zip with default mode should create tuple pairs', () => {
        const a = [1, 2, 3] as const;
        const b = ['a', 'b', 'c'] as const;
        const result = zip(a, b);
        expectTypeOf(result).toEqualTypeOf<Zip<typeof a, typeof b>>();
      });

      it('zip with explicit default mode', () => {
        const a = [1, 2] as const;
        const b = [true, false] as const;
        const result = zip(a, b, 'default');
        expectTypeOf(result).toEqualTypeOf<Zip<typeof a, typeof b>>();
      });

      it('zip with fill mode should use fill value', () => {
        const a = [1, 2] as const;
        const b = ['a', 'b', 'c'] as const;
        const result = zip(a, b, 'fill', null);
        expectTypeOf(result).toEqualTypeOf<ZipFill<typeof a, typeof b, null>>();
      });

      it('zip with fill mode and custom fill value', () => {
        const a = [1, 2, 3] as const;
        const b = ['a', 'b'] as const;
        const result = zip(a, b, 'fill', 'x');
        expectTypeOf(result).toEqualTypeOf<ZipFill<typeof a, typeof b, 'x'>>();
      });

      it('zip with fill mode and number fill', () => {
        const a = [1, 2] as const;
        const b = ['a', 'b', 'c'] as const;
        const result = zip(a, b, 'fill', 0);
        expectTypeOf(result).toEqualTypeOf<ZipFill<typeof a, typeof b, 0>>();
      });

      it('zip with remainder mode should return zipped and remainder', () => {
        const a = [1, 2, 3] as const;
        const b = ['a', 'b'] as const;
        const result = zip(a, b, 'remainder');
        expectTypeOf(result).toEqualTypeOf<
          ZipRemainderObj<typeof a, typeof b>
        >();
      });

      it('zip with remainder mode and longer second tuple', () => {
        const a = [1, 2] as const;
        const b = ['a', 'b', 'c', 'd'] as const;
        const result = zip(a, b, 'remainder');
        expectTypeOf(result).toEqualTypeOf<
          ZipRemainderObj<typeof a, typeof b>
        >();
      });
    });

    describe('reverse', () => {
      it('reverse should reverse tuple with literal types', () => {
        const t = [1, 2, 3] as const;
        const result = reverse(t);
        expectTypeOf(result).toEqualTypeOf<Tuple<[3, 2, 1]>>();
      });

      it('reverse should handle two elements', () => {
        const t = ['a', 'b'] as const;
        const result = reverse(t);
        expectTypeOf(result).toEqualTypeOf<Tuple<['b', 'a']>>();
      });

      it('reverse should handle single element', () => {
        const t = [42] as const;
        const result = reverse(t);
        expectTypeOf(result).toEqualTypeOf<Tuple<[42]>>();
      });

      it('reverse should handle mixed types', () => {
        const t = [1, 'a', true, null] as const;
        const result = reverse(t);
        expectTypeOf(result).toEqualTypeOf<Tuple<[null, true, 'a', 1]>>();
      });
    });

    describe('remove', () => {
      it('removeAll should remove all occurrences with literal type', () => {
        const t = [1, 2, 3, 2, 4] as const;
        const result = removeAll(t, 2);
        expectTypeOf(result).toEqualTypeOf<Tuple<[1, 3, 4]>>();
      });

      it('removeAll should handle removing string', () => {
        const t = ['a', 'b', 'a', 'c'] as const;
        const result = removeAll(t, 'a');
        expectTypeOf(result).toEqualTypeOf<Tuple<['b', 'c']>>();
      });

      it('removeAll should handle no matches', () => {
        const t = [1, 2, 3] as const;
        const result = removeAll(t, 99);
        expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2, 3]>>();
      });

      it('removeAt should remove at index with literal type', () => {
        const t = [1, 2, 3, 4] as const;
        const result = removeAt(t, 2);
        expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2, 4]>>();
      });

      it('removeAt should handle index 0', () => {
        const t = ['a', 'b', 'c'] as const;
        const result = removeAt(t, 0);
        expectTypeOf(result).toEqualTypeOf<Tuple<['b', 'c']>>();
      });

      it('removeAt should handle last index', () => {
        const t = [1, 2, 3, 4, 5] as const;
        const result = removeAt(t, 4);
        expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2, 3, 4]>>();
      });

      it('removeFirst should remove first element with literal type', () => {
        const t = [1, 2, 3] as const;
        const result = removeFirst(t);
        expectTypeOf(result).toEqualTypeOf<Tuple<[2, 3]>>();
      });

      it('removeFirst should handle two elements', () => {
        const t = ['a', 'b'] as const;
        const result = removeFirst(t);
        expectTypeOf(result).toEqualTypeOf<Tuple<['b']>>();
      });

      it('removeFirst should handle many elements', () => {
        const t = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
        const result = removeFirst(t);
        expectTypeOf(result).toEqualTypeOf<
          Tuple<[2, 3, 4, 5, 6, 7, 8, 9, 10]>
        >();
      });

      it('removeLast should remove last element with literal type', () => {
        const t = [1, 2, 3] as const;
        const result = removeLast(t);
        expectTypeOf(result).toEqualTypeOf<Tuple<[1, 2]>>();
      });

      it('removeLast should handle two elements', () => {
        const t = ['a', 'b'] as const;
        const result = removeLast(t);
        expectTypeOf(result).toEqualTypeOf<Tuple<['a']>>();
      });

      it('removeLast should handle many elements', () => {
        const t = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
        const result = removeLast(t);
        expectTypeOf(result).toEqualTypeOf<
          Tuple<[1, 2, 3, 4, 5, 6, 7, 8, 9]>
        >();
      });
    });
  });

  describe('edge cases and complex scenarios', () => {
    it('should handle complex nested tuples', () => {
      const t = [
        [1, 2],
        [3, 4],
        [5, 6]
      ] as const;
      const result = first(t);
      expectTypeOf(result).toEqualTypeOf<readonly [1, 2]>();
    });
    it('should handle tuples with mixed complex types', () => {
      const t = [{ a: 1 }, ['x', 'y'], true, null] as const;
      const result = last(t);
      expectTypeOf(result).toEqualTypeOf<null>();
    });
    it('should chain operations maintaining types', () => {
      const t = [1, 2, 3, 4, 5] as const;
      const reversed = reverse(t);
      const f = first(reversed);
      expectTypeOf(f).toEqualTypeOf<5>();
    });
    it('should handle append and then reverse', () => {
      const t = [1, 2] as const;
      const e = [3, 4] as const;
      const appended = append(t, e);
      const reversed = reverse(appended);
      expectTypeOf(reversed).toEqualTypeOf<Reverse<Tuple<[1, 2, 3, 4]>>>();
    });
    it('should handle splitAt and then access parts', () => {
      const t = [1, 2, 3, 4, 5, 6] as const;
      const splitArr = splitAt(t, 3);
      expectTypeOf(splitArr).toEqualTypeOf<Tuple<[[1, 2, 3], [4, 5, 6]]>>();
    });
    it('should handle compact after zip', () => {
      const a = [1, 2, null] as const;
      const b = ['a', 'b', 'c'] as const;
      const zipped = zip(a, b);
      expectTypeOf(zipped).toEqualTypeOf<Zip<typeof a, typeof b>>();
    });
    it('should preserve literal types through multiple operations', () => {
      const t = [1, 2, 3] as const;
      const appended = append(t, [4, 5] as const);
      const reversed = reverse(appended);
      const f = first(reversed);
      expectTypeOf(f).toEqualTypeOf<5>();
    });
    it('should handle empty tuple types', () => {
      const t = [] as const;
      const result = clone(t);
      expectTypeOf(result).toEqualTypeOf<readonly []>();
    });
    it('should handle single element tuple operations', () => {
      const t = [42] as const;
      const appended = append(t, [100] as const);
      expectTypeOf(appended).toEqualTypeOf<Tuple<[42, 100]>>();
    });
    it('should handle large tuples', () => {
      const t = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] as const;
      const result = lastIndex(t);
      expectTypeOf(result).toEqualTypeOf<14>();
    });
  });
});
