import { describe, expectTypeOf, it } from 'vitest';

import type { Falsy } from '../../general.js';
import type {
  Append,
  Chunk,
  Dedupe,
  Element,
  ElementAt,
  First,
  Includes,
  Insert,
  Last,
  LastIndex,
  Longer,
  Of,
  Pair,
  Prepend,
  Range,
  Reverse,
  Shorter,
  SplitAt,
  Tuple,
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
} from './tuple.js';

describe('Tuple Types', () => {
  type OneToThree = Tuple<[1, 2, 3]>;
  type AToG = Tuple<['a', 'b', 'c', 'd', 'e', 'f', 'g']>;
  type TupleOfTuples = Tuple<[[1, 2], [3, 4], [5, 6]]>;
  type Empty = Tuple<[]>;
  type Of3String = Of<3, string>;
  type Of5X = Of<5, 'x'>;
  type Range1To5 = Range<5>;

  describe('Tuple', () => {
    it('wraps tuple in readonly', () => {
      expectTypeOf<OneToThree>().toEqualTypeOf<readonly [1, 2, 3]>();
      expectTypeOf<Empty>().toEqualTypeOf<readonly []>();
      expectTypeOf<Tuple>().toEqualTypeOf<readonly unknown[]>();
      expectTypeOf<TupleOfTuples>().toEqualTypeOf<
        readonly [readonly [1, 2], readonly [3, 4], readonly [5, 6]]
      >();
    });
  });

  describe('Of', () => {
    it('creates tuple of length L with element type T', () => {
      expectTypeOf<Of3String>().toEqualTypeOf<
        Tuple<[string, string, string]>
      >();
      expectTypeOf<Of5X>().toEqualTypeOf<Tuple<['x', 'x', 'x', 'x', 'x']>>();
      type Of0Num = Of<0, number>;
      expectTypeOf<Of0Num>().toEqualTypeOf<Tuple<[]>>();
      type Of1Bool = Of<1, boolean>;
      expectTypeOf<Of1Bool>().toEqualTypeOf<Tuple<[boolean]>>();
      type OfTuples = Of<2, readonly [number, string]>;
      expectTypeOf<OfTuples>().toEqualTypeOf<
        Tuple<[[number, string], [number, string]]>
      >();
    });
  });

  describe('Chunk', () => {
    it('splits tuple into chunks of specified size', () => {
      type Chunked1To5Size2 = Chunk<Range1To5, 2>;
      expectTypeOf<Chunked1To5Size2>().toEqualTypeOf<
        Tuple<[[0, 1], [2, 3], [4]]>
      >();
      type ChunkedAtoGSize3 = Chunk<AToG, 3>;
      expectTypeOf<ChunkedAtoGSize3>().toEqualTypeOf<
        Tuple<[['a', 'b', 'c'], ['d', 'e', 'f'], ['g']]>
      >();
      type ChunkedEmptySize2 = Chunk<Empty, 2>;
      expectTypeOf<ChunkedEmptySize2>().toEqualTypeOf<Tuple<[]>>();
      type Chunked1To2Size1 = Chunk<[1, 2], 1>;
      expectTypeOf<Chunked1To2Size1>().toEqualTypeOf<Tuple<[[1], [2]]>>();
      type Chunked1To3Size5 = Chunk<OneToThree, 5>;
      expectTypeOf<Chunked1To3Size5>().toEqualTypeOf<Tuple<[[1, 2, 3]]>>();
    });
  });

  describe('Dedupe', () => {
    it('removes duplicate elements from tuple', () => {
      type DedupedTestOne = Dedupe<readonly [1, 2, 1, 3, 2]>;
      expectTypeOf<DedupedTestOne>().toEqualTypeOf<Tuple<[1, 2, 3]>>();

      type DedupedTestTwo = Dedupe<readonly ['a', 'b', 'a', 'c', 'b']>;
      expectTypeOf<DedupedTestTwo>().toEqualTypeOf<Tuple<['a', 'b', 'c']>>();

      type DedupedOneToThree = Dedupe<OneToThree>;
      expectTypeOf<DedupedOneToThree>().toEqualTypeOf<Tuple<[1, 2, 3]>>();

      type DedupedEmpty = Dedupe<Empty>;
      expectTypeOf<DedupedEmpty>().toEqualTypeOf<Tuple<[]>>();

      type DedupedAllSame = Dedupe<readonly [1, 1, 1]>;
      expectTypeOf<DedupedAllSame>().toEqualTypeOf<Tuple<[1]>>();
    });
  });

  describe('Element', () => {
    it('extracts element type from tuple', () => {
      type OneToThreeElement = Element<OneToThree>;
      expectTypeOf<OneToThreeElement>().toEqualTypeOf<1 | 2 | 3>();

      type AToGElement = Element<AToG>;
      expectTypeOf<AToGElement>().toEqualTypeOf<
        'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'
      >();

      type StrOrNumElement = Element<readonly [string, number]>;
      expectTypeOf<StrOrNumElement>().toEqualTypeOf<number | string>();
    });
  });

  describe('ElementAt', () => {
    it('gets element at specific index', () => {
      type ElementAt0 = ElementAt<OneToThree, 0>;
      expectTypeOf<ElementAt0>().toEqualTypeOf<1>();

      type ElementAt1 = ElementAt<OneToThree, 1>;
      expectTypeOf<ElementAt1>().toEqualTypeOf<2>();

      type ElementAt2 = ElementAt<OneToThree, 2>;
      expectTypeOf<ElementAt2>().toEqualTypeOf<3>();

      type ElementAtOutOfBounds = ElementAt<OneToThree, 5>;
      expectTypeOf<ElementAtOutOfBounds>().toEqualTypeOf<never>();
    });
  });

  describe('LastIndex', () => {
    it('gets last valid index of tuple', () => {
      type LastIndex1To3 = LastIndex<OneToThree>;
      expectTypeOf<LastIndex1To3>().toEqualTypeOf<2>();

      type LastIndexOnlyA = LastIndex<Tuple<['a']>>;
      expectTypeOf<LastIndexOnlyA>().toEqualTypeOf<0>();

      type LastIndexEmpty = LastIndex<[]>;
      expectTypeOf<LastIndexEmpty>().toEqualTypeOf<never>();
    });
  });

  describe('First', () => {
    it('gets first element', () => {
      type FirstOf1To3 = First<OneToThree>;
      expectTypeOf<FirstOf1To3>().toEqualTypeOf<1>();

      type FirstOfA = First<readonly ['a']>;
      expectTypeOf<FirstOfA>().toEqualTypeOf<'a'>();

      type FirstOfEmpty = First<Empty>;
      expectTypeOf<FirstOfEmpty>().toEqualTypeOf<never>();

      type FirstOfStrNum = First<readonly [string, number]>;
      expectTypeOf<FirstOfStrNum>().toEqualTypeOf<string>();
    });
  });

  describe('Last', () => {
    it('gets last element', () => {
      type LastOf1To3 = Last<OneToThree>;
      expectTypeOf<LastOf1To3>().toEqualTypeOf<3>();

      type LastOfA = Last<readonly ['a']>;
      expectTypeOf<LastOfA>().toEqualTypeOf<'a'>();

      type LastOfEmpty = Last<Empty>;
      expectTypeOf<LastOfEmpty>().toEqualTypeOf<never>();

      type LastOfStrNum = Last<readonly [string, number]>;
      expectTypeOf<LastOfStrNum>().toEqualTypeOf<number>();
    });
  });

  describe('Includes', () => {
    it('checks if tuple includes value', () => {
      type Includes2 = Includes<OneToThree, 2>;
      expectTypeOf<Includes2>().toEqualTypeOf<true>();

      type Includes4 = Includes<OneToThree, 4>;
      expectTypeOf<Includes4>().toEqualTypeOf<false>();

      type IncludesA = Includes<readonly ['a', 'b'], 'a'>;
      expectTypeOf<IncludesA>().toEqualTypeOf<true>();

      type IncludesEmpty = Includes<Empty, 1>;
      expectTypeOf<IncludesEmpty>().toEqualTypeOf<false>();
    });
  });

  describe('Pair', () => {
    it('creates two-element tuple', () => {
      type PairAB = Pair<'a', 'b'>;
      expectTypeOf<PairAB>().toEqualTypeOf<Tuple<['a', 'b']>>();

      type PairNumStr = Pair<number, string>;
      expectTypeOf<PairNumStr>().toEqualTypeOf<Tuple<[number, string]>>();

      type Pair1And2 = Pair<1, 2>;
      expectTypeOf<Pair1And2>().toEqualTypeOf<Tuple<[1, 2]>>();
    });
  });

  describe('With', () => {
    it('adds element type to tuple', () => {
      type WithString = With<readonly [1, 2], string>;
      expectTypeOf<WithString>().toEqualTypeOf<Tuple<(1 | 2 | string)[]>>();
    });
  });

  describe('WithFalsy', () => {
    it('adds falsy values to tuple type', () => {
      type Result = WithFalsy<readonly [1, 2]>;
      expectTypeOf<Result>().toEqualTypeOf<Tuple<(1 | 2 | Falsy)[]>>();
    });
  });

  describe('WithNull', () => {
    it('adds null to tuple type', () => {
      type Result = WithNull<readonly [1, 2]>;
      expectTypeOf<Result>().toEqualTypeOf<Tuple<(1 | 2 | null)[]>>();
    });
  });

  describe('WithNullish', () => {
    it('adds nullish values to tuple type', () => {
      type Result = WithNullish<readonly [1, 2]>;
      expectTypeOf<Result>().toEqualTypeOf<
        Tuple<(1 | 2 | null | undefined)[]>
      >();
    });
  });

  describe('WithUndefined', () => {
    it('adds undefined to tuple type', () => {
      type Result = WithUndefined<readonly [1, 2]>;
      expectTypeOf<Result>().toEqualTypeOf<Tuple<(1 | 2 | undefined)[]>>();
    });
  });

  describe('WithoutFalsy', () => {
    it('removes falsy values from tuple', () => {
      type WithoutFalsyMixed = WithoutFalsy<
        readonly [1, false, 2, null, 3, undefined, 0, '']
      >;
      expectTypeOf<WithoutFalsyMixed>().toEqualTypeOf<Tuple<[1, 2, 3]>>();

      type WithoutFalsyClean = WithoutFalsy<OneToThree>;
      expectTypeOf<WithoutFalsyClean>().toEqualTypeOf<Tuple<[1, 2, 3]>>();

      type WithoutFalsyAllFalsy = WithoutFalsy<
        readonly [false, null, undefined]
      >;
      expectTypeOf<WithoutFalsyAllFalsy>().toEqualTypeOf<Tuple<[]>>();
    });
  });

  describe('WithoutNull', () => {
    it('removes null from tuple', () => {
      type WithoutNullMixed = WithoutNull<readonly [1, null, 2, null, 3]>;
      expectTypeOf<WithoutNullMixed>().toEqualTypeOf<Tuple<[1, 2, 3]>>();

      type WithoutNullClean = WithoutNull<OneToThree>;
      expectTypeOf<WithoutNullClean>().toEqualTypeOf<Tuple<[1, 2, 3]>>();

      type WithoutNullAllNull = WithoutNull<readonly [null, null]>;
      expectTypeOf<WithoutNullAllNull>().toEqualTypeOf<Tuple<[]>>();
    });
  });

  describe('WithoutNullish', () => {
    it('removes nullish values from tuple', () => {
      type WithoutNullishMixed = WithoutNullish<
        readonly [1, null, 2, undefined, 3]
      >;
      expectTypeOf<WithoutNullishMixed>().toEqualTypeOf<Tuple<[1, 2, 3]>>();

      type WithoutNullishClean = WithoutNullish<OneToThree>;
      expectTypeOf<WithoutNullishClean>().toEqualTypeOf<Tuple<[1, 2, 3]>>();

      type WithoutNullishAllNullish = WithoutNullish<
        readonly [null, undefined]
      >;
      expectTypeOf<WithoutNullishAllNullish>().toEqualTypeOf<Tuple<[]>>();
    });
  });

  describe('WithoutUndefined', () => {
    it('removes undefined from tuple', () => {
      type WithoutUndefinedMixed = WithoutUndefined<
        readonly [1, undefined, 2, undefined, 3]
      >;
      expectTypeOf<WithoutUndefinedMixed>().toEqualTypeOf<Tuple<[1, 2, 3]>>();

      type WithoutUndefinedClean = WithoutUndefined<OneToThree>;
      expectTypeOf<WithoutUndefinedClean>().toEqualTypeOf<Tuple<[1, 2, 3]>>();

      type WithoutUndefinedAllUndefined = WithoutUndefined<
        readonly [undefined, undefined]
      >;
      expectTypeOf<WithoutUndefinedAllUndefined>().toEqualTypeOf<Tuple<[]>>();
    });
  });

  describe('Append', () => {
    it('appends tuple to end', () => {
      type Appended1 = Append<readonly [1, 2], readonly [3, 4]>;
      expectTypeOf<Appended1>().toEqualTypeOf<Tuple<[1, 2, 3, 4]>>();

      type Appended2 = Append<Empty, readonly [1, 2]>;
      expectTypeOf<Appended2>().toEqualTypeOf<Tuple<[1, 2]>>();

      type Appended3 = Append<readonly [1, 2], Empty>;
      expectTypeOf<Appended3>().toEqualTypeOf<Tuple<[1, 2]>>();
    });
  });

  describe('Insert', () => {
    it('inserts tuple at specified index', () => {
      type Inserted1 = Insert<readonly [1, 2, 5], readonly [3, 4], 2>;
      expectTypeOf<Inserted1>().toEqualTypeOf<Tuple<[1, 2, 3, 4, 5]>>();

      type Inserted2 = Insert<OneToThree, readonly ['x'], 0>;
      expectTypeOf<Inserted2>().toEqualTypeOf<Tuple<['x', 1, 2, 3]>>();

      type Inserted3 = Insert<readonly [1, 2], readonly ['y'], 2>;
      expectTypeOf<Inserted3>().toEqualTypeOf<Tuple<[1, 2, 'y']>>();
    });
  });

  describe('Prepend', () => {
    it('prepends tuple to beginning', () => {
      type Prepended1 = Prepend<readonly [3, 4], readonly [1, 2]>;
      expectTypeOf<Prepended1>().toEqualTypeOf<Tuple<[1, 2, 3, 4]>>();

      type Prepended2 = Prepend<readonly [1, 2], Empty>;
      expectTypeOf<Prepended2>().toEqualTypeOf<Tuple<[1, 2]>>();

      type Prepended3 = Prepend<Empty, readonly [1, 2]>;
      expectTypeOf<Prepended3>().toEqualTypeOf<Tuple<[1, 2]>>();
    });
  });

  describe('Range', () => {
    it('creates range tuple up to N', () => {
      type Range3 = Range<3>;
      expectTypeOf<Range3>().toEqualTypeOf<Tuple<[0, 1, 2]>>();

      type Range0 = Range<0>;
      expectTypeOf<Range0>().toEqualTypeOf<Tuple<[]>>();

      type Range1 = Range<1>;
      expectTypeOf<Range1>().toEqualTypeOf<Tuple<[0]>>();
    });
  });

  describe('Longer', () => {
    it('returns longer tuple', () => {
      type Longer1 = Longer<OneToThree, readonly [4, 5]>;
      expectTypeOf<Longer1>().toEqualTypeOf<Tuple<[1, 2, 3]>>();

      type Longer2 = Longer<readonly [1], readonly [2, 3, 4]>;
      expectTypeOf<Longer2>().toEqualTypeOf<Tuple<[2, 3, 4]>>();

      type LongerEqual = Longer<readonly [1, 2], readonly [3, 4]>;
      expectTypeOf<LongerEqual>().toEqualTypeOf<
        Tuple<[1, 2]> | Tuple<[3, 4]>
      >();
    });
  });

  describe('Shorter', () => {
    it('returns shorter tuple', () => {
      type Shorter1 = Shorter<OneToThree, readonly [4, 5]>;
      expectTypeOf<Shorter1>().toEqualTypeOf<Tuple<[4, 5]>>();

      type Shorter2 = Shorter<readonly [1], readonly [2, 3, 4]>;
      expectTypeOf<Shorter2>().toEqualTypeOf<Tuple<[1]>>();

      type ShorterEqual = Shorter<readonly [1, 2], readonly [3, 4]>;
      expectTypeOf<ShorterEqual>().toEqualTypeOf<
        Tuple<[1, 2]> | Tuple<[3, 4]>
      >();
    });
  });

  describe('Zip', () => {
    it('zips two tuples together', () => {
      type Zipped1 = Zip<OneToThree, readonly ['a', 'b', 'c']>;
      expectTypeOf<Zipped1>().toEqualTypeOf<
        Tuple<[[1, 'a'], [2, 'b'], [3, 'c']]>
      >();

      type Zipped2 = Zip<readonly [1, 2], readonly ['a', 'b', 'c']>;
      expectTypeOf<Zipped2>().toEqualTypeOf<Tuple<[[1, 'a'], [2, 'b']]>>();

      type ZippedEmpty1 = Zip<Empty, readonly ['a', 'b']>;
      expectTypeOf<ZippedEmpty1>().toEqualTypeOf<Tuple<[]>>();

      type ZippedEmpty2 = Zip<readonly [1, 2], Empty>;
      expectTypeOf<ZippedEmpty2>().toEqualTypeOf<Tuple<[]>>();
    });
  });

  describe('ZipFill', () => {
    it('zips tuples with filler for missing values', () => {
      type ZipFilled1 = ZipFill<
        readonly [1, 2],
        readonly ['a', 'b', 'c'],
        null
      >;
      expectTypeOf<ZipFilled1>().toEqualTypeOf<
        Tuple<[[1, 'a'], [2, 'b'], [null, 'c']]>
      >();

      type ZipFilled2 = ZipFill<OneToThree, readonly ['a'], 0>;
      expectTypeOf<ZipFilled2>().toEqualTypeOf<
        Tuple<[[1, 'a'], [2, 0], [3, 0]]>
      >();

      type ZipFilled3 = ZipFill<Empty, readonly ['a', 'b'], false>;
      expectTypeOf<ZipFilled3>().toEqualTypeOf<
        Tuple<[[false, 'a'], [false, 'b']]>
      >();

      type ZipFilledEmpty = ZipFill<Empty, Empty, undefined>;
      expectTypeOf<ZipFilledEmpty>().toEqualTypeOf<Empty>();
    });
  });

  describe('ZipRemainder', () => {
    it('zips tuples and returns remainder', () => {
      type ZipRem1 = ZipRemainder<OneToThree, readonly ['a', 'b']>;
      expectTypeOf<ZipRem1>().toEqualTypeOf<
        Tuple<[[[1, 'a'], [2, 'b']], [3]]>
      >();

      type ZipRem2 = ZipRemainder<readonly [1], readonly ['a', 'b', 'c']>;
      expectTypeOf<ZipRem2>().toEqualTypeOf<Tuple<[[[1, 'a']], ['b', 'c']]>>();

      type ZipRemEqual = ZipRemainder<readonly [1, 2], readonly ['a', 'b']>;
      expectTypeOf<ZipRemEqual>().toEqualTypeOf<
        Tuple<[[[1, 'a'], [2, 'b']], Empty]>
      >();

      type ZipRemEmpty = ZipRemainder<Empty, readonly ['a', 'b']>;
      expectTypeOf<ZipRemEmpty>().toEqualTypeOf<
        Tuple<[Empty, readonly ['a', 'b']]>
      >();
    });
  });

  describe('ZipRemainderObj', () => {
    it('provides object interface for zip remainder', () => {
      type Result = ZipRemainderObj<OneToThree, readonly ['a', 'b']>;

      type ResultZipped = Result['zipped'];
      expectTypeOf<ResultZipped>().toEqualTypeOf<Tuple<[[1, 'a'], [2, 'b']]>>();

      type ResultRemainder = Result['remainder'];
      expectTypeOf<ResultRemainder>().toEqualTypeOf<Tuple<[3]>>();
    });
  });

  describe('SplitAt', () => {
    it('splits tuple at specified index', () => {
      type SplitAt2 = SplitAt<readonly [1, 2, 3, 4, 5], 2>;
      expectTypeOf<SplitAt2>().toEqualTypeOf<Tuple<[[1, 2], [3, 4, 5]]>>();

      type SplitAt0 = SplitAt<OneToThree, 0>;
      expectTypeOf<SplitAt0>().toEqualTypeOf<Tuple<[Empty, OneToThree]>>();

      type SplitAt3 = SplitAt<OneToThree, 3>;
      expectTypeOf<SplitAt3>().toEqualTypeOf<Tuple<[OneToThree, Empty]>>();

      type SplitAtEmpty = SplitAt<Empty, 0>;
      expectTypeOf<SplitAtEmpty>().toEqualTypeOf<Tuple<[Empty, Empty]>>();
    });
  });

  describe('Reverse', () => {
    it('reverses tuple', () => {
      type Reversed1 = Reverse<OneToThree>;
      expectTypeOf<Reversed1>().toEqualTypeOf<Tuple<[3, 2, 1]>>();

      type Reversed2 = Reverse<readonly ['a', 'b']>;
      expectTypeOf<Reversed2>().toEqualTypeOf<Tuple<['b', 'a']>>();

      type ReversedSingle = Reverse<readonly [1]>;
      expectTypeOf<ReversedSingle>().toEqualTypeOf<Tuple<[1]>>();

      type ReversedEmpty = Reverse<Empty>;
      expectTypeOf<ReversedEmpty>().toEqualTypeOf<Tuple<[]>>();
    });
  });
});
