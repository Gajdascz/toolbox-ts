import { describe, expectTypeOf, it } from 'vitest';

import type { Falsy } from '../../general.js';
import type {
  Append,
  Arr,
  Chunk,
  Element,
  ElementNotUndefined,
  Entries,
  From,
  Group,
  Immutable,
  Insert,
  Merged,
  Mutable,
  Prepend,
  Split,
  With,
  WithFalsy,
  WithNull,
  WithNullish,
  WithoutFalsy,
  WithoutNull,
  WithoutNullish,
  WithoutUndefined,
  WithUndefined,
  Zip,
  ZipFill,
  ZipRemainder,
  ZipRemainderObj
} from './array.js';

describe('Arr Types', () => {
  type NumArr = Arr<number>;
  type StrArr = Arr<string>;
  type MixedArr = Arr<number | string>;

  describe('Arr', () => {
    it('represents readonly or mutable array', () => {
      type DefaultArr = Arr;
      expectTypeOf<DefaultArr>().toEqualTypeOf<Immutable | Mutable>();

      expectTypeOf<NumArr>().toEqualTypeOf<Immutable<number> | Mutable<number>>();
      expectTypeOf<StrArr>().toEqualTypeOf<Immutable<string> | Mutable<string>>();
      expectTypeOf<MixedArr>().toEqualTypeOf<
        Immutable<number | string> | Mutable<number | string>
      >();

      // Test that both readonly and mutable arrays match
      type TestReadonly = readonly number[] extends NumArr ? true : false;
      expectTypeOf<TestReadonly>().toEqualTypeOf<true>();

      type TestMutable = number[] extends NumArr ? true : false;
      expectTypeOf<TestMutable>().toEqualTypeOf<true>();
    });
  });

  describe('Mutable', () => {
    it('creates mutable array type', () => {
      type MutableNum = Mutable<number>;
      expectTypeOf<MutableNum>().toEqualTypeOf<number[]>();

      type MutableStr = Mutable<string>;
      expectTypeOf<MutableStr>().toEqualTypeOf<string[]>();

      type MutableDefault = Mutable;
      expectTypeOf<MutableDefault>().toEqualTypeOf<unknown[]>();
    });
  });

  describe('Immutable', () => {
    it('creates immutable array type', () => {
      type ImmutableNum = Immutable<number>;
      expectTypeOf<ImmutableNum>().toEqualTypeOf<readonly number[]>();

      type ImmutableStr = Immutable<string>;
      expectTypeOf<ImmutableStr>().toEqualTypeOf<readonly string[]>();

      type ImmutableDefault = Immutable;
      expectTypeOf<ImmutableDefault>().toEqualTypeOf<readonly unknown[]>();
    });
  });

  describe('Element', () => {
    it('extracts element type including undefined', () => {
      type NumElement = Element<NumArr>;
      expectTypeOf<NumElement>().toEqualTypeOf<number | undefined>();

      type StrElement = Element<StrArr>;
      expectTypeOf<StrElement>().toEqualTypeOf<string | undefined>();

      type MixedElement = Element<MixedArr>;
      expectTypeOf<MixedElement>().toEqualTypeOf<number | string | undefined>();

      type EmptyElement = Element<readonly []>;
      expectTypeOf<EmptyElement>().toEqualTypeOf<undefined>();
    });
  });

  describe('ElementNotUndefined', () => {
    it('extracts element type excluding undefined', () => {
      type NumElementNoUndef = ElementNotUndefined<NumArr>;
      expectTypeOf<NumElementNoUndef>().toEqualTypeOf<number>();

      type StrElementNoUndef = ElementNotUndefined<StrArr>;
      expectTypeOf<StrElementNoUndef>().toEqualTypeOf<string>();

      type MixedElementNoUndef = ElementNotUndefined<MixedArr>;
      expectTypeOf<MixedElementNoUndef>().toEqualTypeOf<number | string>();

      type WithUndefElement = ElementNotUndefined<readonly (number | undefined)[]>;
      expectTypeOf<WithUndefElement>().toEqualTypeOf<number>();
    });
  });

  describe('From', () => {
    it('creates array type from value', () => {
      type FromNumber = From<number>;
      expectTypeOf<FromNumber>().toEqualTypeOf<number[]>();

      type FromString = From<string>;
      expectTypeOf<FromString>().toEqualTypeOf<string[]>();

      type FromUndefined = From<undefined>;
      expectTypeOf<FromUndefined>().toEqualTypeOf<[]>();

      type FromArray = From<[1, 2, 3]>;
      expectTypeOf<FromArray>().toEqualTypeOf<(1 | 2 | 3)[]>();

      type FromReadonlyArray = From<readonly [number, number, number]>;
      expectTypeOf<FromReadonlyArray>().toEqualTypeOf<readonly number[]>();

      type FromArrayWithUndef = From<[number, undefined, string]>;
      expectTypeOf<FromArrayWithUndef>().toEqualTypeOf<(number | string)[]>();

      type FromReadonlyArrayWithUndef = From<readonly [number, undefined, string]>;
      expectTypeOf<FromReadonlyArrayWithUndef>().toEqualTypeOf<readonly (number | string)[]>();
    });
  });
  it('prepends elements from one array to another', () => {
    type Prepended1 = Prepend<readonly [3, 4], readonly [1, 2]>;
    expectTypeOf<Prepended1>().toEqualTypeOf<[1, 2, 3, 4]>();
    type PrependedStr = Prepend<readonly ['c'], readonly ['a', 'b']>;
    expectTypeOf<PrependedStr>().toEqualTypeOf<['a', 'b', 'c']>();
  });
  describe('Append', () => {
    it('appends elements from one array to another', () => {
      type Appended1 = Append<readonly [1, 2], readonly [3, 4]>;
      expectTypeOf<Appended1>().toEqualTypeOf<[1, 2, 3, 4]>();
      type AppendedStr = Append<readonly ['a'], readonly ['b', 'c']>;
      expectTypeOf<AppendedStr>().toEqualTypeOf<['a', 'b', 'c']>();
    });
  });

  describe('Chunk', () => {
    it('creates array of array chunks', () => {
      type ChunkedNum = Chunk<NumArr>;
      expectTypeOf<ChunkedNum>().toEqualTypeOf<number[][]>();

      type ChunkedStr = Chunk<StrArr>;
      expectTypeOf<ChunkedStr>().toEqualTypeOf<string[][]>();

      type ChunkedMixed = Chunk<MixedArr>;
      expectTypeOf<ChunkedMixed>().toEqualTypeOf<(number | string)[][]>();
    });
  });

  describe('Insert', () => {
    it('inserts elements from one array into another', () => {
      type Inserted1 = Insert<readonly [1, 2], readonly [3, 4]>;
      expectTypeOf<Inserted1>().toEqualTypeOf<(1 | 2 | 3 | 4)[]>();

      type InsertedStr = Insert<readonly ['a'], readonly ['b', 'c']>;
      expectTypeOf<InsertedStr>().toEqualTypeOf<('a' | 'b' | 'c')[]>();

      type InsertedMixed = Insert<readonly [1, 2], readonly ['a', 'b']>;
      expectTypeOf<InsertedMixed>().toEqualTypeOf<('a' | 'b' | 1 | 2)[]>();
    });
  });

  describe('Merged', () => {
    it('merged array with array or array of arrays', () => {
      type Merged1 = Merged<readonly [1, 2], readonly [3, 4]>;
      expectTypeOf<Merged1>().toEqualTypeOf<(1 | 2 | 3 | 4)[]>();

      type MergedNested = Merged<readonly [1, 2], readonly [readonly [3, 4]]>;
      expectTypeOf<MergedNested>().toEqualTypeOf<(1 | 2 | 3 | 4)[]>();

      type MergedMultiNested = Merged<readonly [1], readonly [readonly [2, 3], readonly [4, 5]]>;
      expectTypeOf<MergedMultiNested>().toEqualTypeOf<(1 | 2 | 3 | 4 | 5)[]>();

      type MergedMixed = Merged<readonly [string], readonly [number, boolean]>;
      expectTypeOf<MergedMixed>().toEqualTypeOf<(boolean | number | string)[]>();
    });
  });

  describe('Zip', () => {
    it('zips two arrays together', () => {
      type Zipped1 = Zip<[1, 2, 3], ['a', 'b', 'c']>;
      expectTypeOf<Zipped1>().toEqualTypeOf<
        [1 | 2 | 3, 'a' | 'b' | 'c'][] | readonly [1 | 2 | 3, 'a' | 'b' | 'c'][]
      >();

      type ZippedNum = Zip<NumArr, StrArr>;
      expectTypeOf<ZippedNum>().toEqualTypeOf<[number, string][] | readonly [number, string][]>();

      type ZippedSame = Zip<NumArr, NumArr>;
      expectTypeOf<ZippedSame>().toEqualTypeOf<[number, number][] | readonly [number, number][]>();

      type ZippedEmpty = Zip<readonly [], StrArr>;
      expectTypeOf<ZippedEmpty>().toEqualTypeOf<[never, string][] | readonly [never, string][]>();
    });
  });

  describe('ZipFill', () => {
    it('zips arrays with filler for missing values', () => {
      type ZipFilled1 = ZipFill<readonly [1, 2], readonly ['a'], null>;
      expectTypeOf<ZipFilled1>().toEqualTypeOf<
        [1 | 2 | null, 'a' | null][] | readonly [1 | 2 | null, 'a' | null][]
      >();

      type ZipFilledNum = ZipFill<NumArr, StrArr, 0>;
      expectTypeOf<ZipFilledNum>().toEqualTypeOf<
        [number, 0 | string][] | readonly [number, 0 | string][]
      >();

      type ZipFilledBool = ZipFill<NumArr, StrArr, false>;
      expectTypeOf<ZipFilledBool>().toEqualTypeOf<
        [false | number, false | string][] | readonly [false | number, false | string][]
      >();

      type ZipFilledUndefined = ZipFill<readonly [1], readonly [2], undefined>;
      expectTypeOf<ZipFilledUndefined>().toEqualTypeOf<
        [1 | undefined, 2 | undefined][] | readonly [1 | undefined, 2 | undefined][]
      >();
    });
  });

  describe('ZipRemainder', () => {
    it('returns zipped pairs and remainder', () => {
      type ZipRem1 = ZipRemainder<readonly [1, 2, 3], readonly ['a', 'b']>;
      expectTypeOf<ZipRem1>().toEqualTypeOf<
        [[1 | 2 | 3, 'a' | 'b'][] | readonly [1 | 2 | 3, 'a' | 'b'][], ['a' | 'b' | 1 | 2 | 3][]]
      >();

      type ZipRemNum = ZipRemainder<NumArr, StrArr>;
      expectTypeOf<ZipRemNum>().toEqualTypeOf<
        [[number, string][] | readonly [number, string][], [number | string][]]
      >();

      type ZipRemEmpty = ZipRemainder<readonly [], StrArr>;
      expectTypeOf<ZipRemEmpty>().toEqualTypeOf<
        [[never, string][] | readonly [never, string][], [string][]]
      >();
    });
  });

  describe('ZipRemainderObj', () => {
    it('provides object interface for zip remainder', () => {
      type Result = ZipRemainderObj<readonly [1, 2, 3], readonly ['a', 'b']>;

      type ResultZipped = Result['zipped'];
      expectTypeOf<ResultZipped>().toEqualTypeOf<
        [1 | 2 | 3, 'a' | 'b'][] | readonly [1 | 2 | 3, 'a' | 'b'][]
      >();

      type ResultRemainder = Result['remainder'];
      expectTypeOf<ResultRemainder>().toEqualTypeOf<('a' | 'b' | 1 | 2 | 3)[]>();

      type NumStrResult = ZipRemainderObj<NumArr, StrArr>;
      type NumStrZipped = NumStrResult['zipped'];
      expectTypeOf<NumStrZipped>().toEqualTypeOf<
        [number, string][] | readonly [number, string][]
      >();

      type NumStrRemainder = NumStrResult['remainder'];
      expectTypeOf<NumStrRemainder>().toEqualTypeOf<(number | string)[]>();
    });
  });

  describe('Group', () => {
    it('creates Group record type', () => {
      type Group1 = Group<NumArr, 'even' | 'odd'>;
      expectTypeOf<Group1>().toEqualTypeOf<{ even: number[]; odd: number[] }>();

      type GroupStr = Group<StrArr, 'long' | 'short'>;
      expectTypeOf<GroupStr>().toEqualTypeOf<{ long: string[]; short: string[] }>();

      type GroupMixed = Group<MixedArr, 'type1' | 'type2'>;
      expectTypeOf<GroupMixed>().toEqualTypeOf<{
        type1: (number | string)[];
        type2: (number | string)[];
      }>();

      type GroupNumeric = Group<NumArr, 1 | 2 | 3>;
      expectTypeOf<GroupNumeric>().toEqualTypeOf<{ 1: number[]; 2: number[]; 3: number[] }>();
    });
  });

  describe('Split', () => {
    it('defines split result type', () => {
      type SplitNum = Split<NumArr>;
      expectTypeOf<SplitNum>().branded.toEqualTypeOf<[number[], number[]]>();

      type SplitStr = Split<StrArr>;
      expectTypeOf<SplitStr>().branded.toEqualTypeOf<[string[], string[]]>();

      type SplitMixed = Split<MixedArr>;
      expectTypeOf<SplitMixed>().branded.toEqualTypeOf<
        [(number | string)[], (number | string)[]]
      >();
    });
  });

  describe('With', () => {
    it('adds element type to array', () => {
      type WithString = With<NumArr, string>;
      expectTypeOf<WithString>().toEqualTypeOf<(number | string)[]>();

      expectTypeOf<With<StrArr, null>>().toEqualTypeOf<(null | string)[]>();

      type WithBoolean = With<MixedArr, boolean>;
      expectTypeOf<WithBoolean>().toEqualTypeOf<(boolean | number | string)[]>();
    });
  });

  describe('WithFalsy', () => {
    it('adds falsy values to array type', () => {
      type Result = WithFalsy<NumArr>;
      expectTypeOf<Result>().toEqualTypeOf<(Falsy | number)[]>();

      type ResultMixed = WithFalsy<NumArr | StrArr>;
      expectTypeOf<ResultMixed>().toEqualTypeOf<(Falsy | number | string)[]>();
    });
    type ReadonlyResult = WithFalsy<readonly [1, 2, 3]>;
    expectTypeOf<ReadonlyResult>().toEqualTypeOf<(1 | 2 | 3 | Falsy)[]>();
  });

  describe('WithNull', () => {
    it('adds null to array type', () => {
      type Result = WithNull<NumArr>;
      expectTypeOf<Result>().toEqualTypeOf<(null | number)[]>();
    });
  });

  describe('WithNullish', () => {
    it('adds nullish values to array type', () => {
      type Result = WithNullish<NumArr>;
      expectTypeOf<Result>().toEqualTypeOf<(null | number | undefined)[]>();
    });
  });

  describe('WithUndefined', () => {
    it('adds undefined to array type', () => {
      type Result = WithUndefined<NumArr>;
      expectTypeOf<Result>().toEqualTypeOf<(number | undefined)[]>();
    });
  });

  describe('WithoutFalsy', () => {
    it('removes falsy values from array type', () => {
      const x = [1, '', 0, false, 2] as const;
      const y = [1, '', 0, false, null, 2, undefined];
      type ResultX = WithoutFalsy<typeof x>;
      type ResultY = WithoutFalsy<typeof y>;
      expectTypeOf<ResultX>().toEqualTypeOf<(1 | 2)[]>();
      expectTypeOf<ResultY>().toEqualTypeOf<(number | string | true)[]>();

      type ResultStr = WithoutFalsy<Arr<'' | 0 | false | null | string | undefined>>;
      expectTypeOf<ResultStr>().toEqualTypeOf<string[]>();

      type ResultClean = WithoutFalsy<(Falsy | number)[]>;
      expectTypeOf<ResultClean>().toEqualTypeOf<number[]>();
    });
  });

  describe('WithoutNull', () => {
    it('removes null from array type', () => {
      type Result = WithoutNull<Arr<null | number>>;
      expectTypeOf<Result>().toEqualTypeOf<number[]>();

      type ResultStr = WithoutNull<Arr<null | string>>;
      expectTypeOf<ResultStr>().toEqualTypeOf<string[]>();

      type ResultClean = WithoutNull<NumArr>;
      expectTypeOf<ResultClean>().toEqualTypeOf<number[]>();
    });
  });

  describe('WithoutNullish', () => {
    it('removes nullish values from array type', () => {
      type Result = WithoutNullish<Arr<null | number | undefined>>;
      expectTypeOf<Result>().toEqualTypeOf<number[]>();

      type ResultStr = WithoutNullish<Arr<null | string | undefined>>;
      expectTypeOf<ResultStr>().toEqualTypeOf<string[]>();

      type ResultClean = WithoutNullish<NumArr>;
      expectTypeOf<ResultClean>().toEqualTypeOf<number[]>();
    });
  });

  describe('WithoutUndefined', () => {
    it('removes undefined from array type', () => {
      type Result = WithoutUndefined<Arr<number | undefined>>;
      expectTypeOf<Result>().toEqualTypeOf<number[]>();

      type ResultStr = WithoutUndefined<Arr<string | undefined>>;
      expectTypeOf<ResultStr>().toEqualTypeOf<string[]>();

      type ResultMixed = WithoutUndefined<Arr<number | string | undefined>>;
      expectTypeOf<ResultMixed>().toEqualTypeOf<(number | string)[]>();
    });
  });

  it('Entries', () => {
    type NumEntries = Entries<[1, 2, 3]>;
    expectTypeOf<NumEntries>().toEqualTypeOf<[number, 1 | 2 | 3][]>();

    type StrEntries = Entries<[string, string, string]>;
    expectTypeOf<StrEntries>().toEqualTypeOf<[number, string][]>();

    type MixedEntries = Entries<MixedArr>;
    expectTypeOf<MixedEntries>().toEqualTypeOf<[number, number | string][]>();
  });
});
