import type { Falsy, Nullish } from '../../general.js';
import type {
  GreaterThan,
  LessThan,
  Range as NumRange
} from '../../number/definitions/number.js';
import type { NestedReadonly } from '../../object/definitions/object.js';

/**
 * Splits a tuple type into chunks of length `Size`.
 * The final chunk may be shorter if the tuple length is not divisible by `Size`.
 *
 * @example
 * ```ts
 * type A = Chunk<[1,2,3,4,5], 2>; // [[1,2], [3,4], [5]]
 * type B = Chunk<['a','b','c','d'], 3>; // [['a','b','c'], ['d']]
 * type C = Chunk<[], 2>; // []
 * ```
 */
export type Chunk<
  T extends Tuple,
  Size extends number,
  A extends Tuple = readonly [],
  R extends Tuple = readonly []
> =
  T extends readonly [infer F, ...infer Rest] ?
    A['length'] extends Size ?
      Chunk<T, Size, readonly [], readonly [...R, A]>
    : Chunk<Rest, Size, readonly [...A, F], R>
  : A extends readonly [] ? R
  : readonly [...R, A];
export type Dedupe<T extends Tuple, R extends Tuple = readonly []> =
  T extends readonly [infer F, ...infer Rest] ?
    Includes<R, F> extends true ?
      Dedupe<Rest, R>
    : Dedupe<Rest, readonly [...R, F]>
  : R extends readonly [] ? T
  : R;
export type Element<T extends Tuple> = Exclude<T[number], undefined>;

export type ElementAt<T extends Tuple, I extends number> =
  T[I] extends undefined ? never : T[I];

/**
 * Gets the first element of an array.
 *
 * @example
 * ```ts
 * type A = ArrFirst<[1, 2, 3]> // 1
 * type B = ArrFirst<[]> // never
 * ```
 */
export type First<T extends Tuple> = T[0] extends undefined ? never : T[0];
export type Includes<T extends Tuple, V> =
  T extends readonly [infer F, ...infer R] ?
    [F] extends readonly [V] ?
      true
    : Includes<R, V>
  : false;

/**
 * Gets the last element of an array.
 *
 * @example
 * ```ts
 * type A = ArrLast<[1, 2, 3]> // 3
 * type B = ArrLast<[]> // never
 * ```
 */
export type Last<T extends Tuple> =
  T extends readonly [...infer _, infer L] ? L : never;
export type LastIndex<T extends Tuple> =
  T extends readonly [...infer H, infer _] ? [...H]['length'] : never;
export type Of<
  L extends number,
  T,
  R extends readonly T[] = readonly []
> = NestedReadonly<R['length'] extends L ? R : Of<L, T, [...R, T]>>;

/**
 * Creates a tuple type with two elements.
 *
 * @example
 * ```ts
 * type A = Pair<'a', 'b'> // ['a', 'b']
 * ```
 */
export type Pair<A, B> = readonly [A, B];

export type Tuple<T extends readonly unknown[] = unknown[]> = NestedReadonly<
  [...T]
>;

//#region> With
export type With<T extends Tuple, E> = Tuple<(E | T[number])[]>;
export type WithFalsy<T extends Tuple = Tuple> = With<T, Falsy>;
export type WithNull<T extends Tuple = Tuple> = With<T, null>;
export type WithNullish<T extends Tuple = Tuple> = With<T, Nullish>;
export type WithUndefined<T extends Tuple = Tuple> = With<T, undefined>;
//#endregion
//#region> Without
export type WithoutFalsy<T extends Tuple = Tuple> =
  T extends readonly [infer F, ...infer R] ?
    F extends Falsy ?
      WithoutFalsy<readonly [...R]>
    : readonly [F, ...WithoutFalsy<readonly [...R]>]
  : readonly [];
export type WithoutNull<T extends Tuple = Tuple> =
  T extends readonly [infer F, ...infer R] ?
    F extends null ?
      WithoutNull<readonly [...R]>
    : readonly [F, ...WithoutNull<readonly [...R]>]
  : readonly [];
export type WithoutNullish<T extends Tuple = Tuple> =
  T extends readonly [infer F, ...infer R] ?
    F extends Nullish ?
      WithoutNullish<readonly [...R]>
    : readonly [F, ...WithoutNullish<readonly [...R]>]
  : readonly [];
export type WithoutUndefined<T extends Tuple = Tuple> =
  T extends readonly [infer F, ...infer R] ?
    F extends undefined ?
      WithoutUndefined<readonly [...R]>
    : readonly [F, ...WithoutUndefined<readonly [...R]>]
  : readonly [];
//#endregion

export type Append<T extends Tuple, E extends Tuple> = readonly [...T, ...E];
export type Insert<
  T extends Tuple,
  E extends Tuple,
  I extends number,
  Head extends Tuple = readonly []
> =
  Head['length'] extends I ? readonly [...Head, ...E, ...T]
  : T extends readonly [infer F, ...infer Rest] ?
    Insert<Rest, E, I, readonly [...Head, F]>
  : readonly [...Head, ...E];

export type Longer<T extends Tuple, U extends Tuple> =
  T['length'] extends U['length'] ? T | U
  : GreaterThan<T['length'], U['length']> extends true ? T
  : U;
export type Prepend<T extends Tuple, E extends Tuple> = readonly [...E, ...T];

export type Range<N extends number, R extends Tuple = []> = Readonly<
  NumRange<N, R>
>;
export type Reverse<T extends Tuple, R extends Tuple = []> = NestedReadonly<
  T extends readonly [infer F, ...infer Rest] ?
    Reverse<Rest, readonly [F, ...R]>
  : R
>;
export type Shorter<T extends Tuple, U extends Tuple> =
  T['length'] extends U['length'] ? T | U
  : LessThan<T['length'], U['length']> extends true ? T
  : U;

export type SplitAt<
  T extends Tuple,
  I extends number,
  Head extends Tuple = readonly []
> = NestedReadonly<
  Head['length'] extends I ? readonly [Head, T]
  : T extends readonly [infer F, ...infer Rest] ?
    SplitAt<Rest, I, readonly [...Head, F]>
  : readonly [Head, T]
>;
/**
 * Zips two arrays together.
 *
 * @example
 * ```ts
 * type A = Zip<[1, 2, 3], ['a', 'b', 'c']> // [[1, 'a'], [2, 'b'], [3, 'c']]
 * type B = Zip<[1, 2], ['a', 'b', 'c']> // [[1, 'a'], [2, 'b']]
 * type C = Zip<[], ['a', 'b', 'c']> // []
 * type D = Zip<[1, 2, 3], []> // []
 * type E = Zip<[], []> // []
 * ```
 */
export type Zip<A extends Tuple, B extends Tuple> =
  A extends readonly [infer AF, ...infer AR] ?
    B extends readonly [infer BF, ...infer BR] ?
      readonly [readonly [AF, BF], ...Zip<AR, BR>]
    : readonly []
  : readonly [];

/**
 * Zips two arrays together, filling in missing values with a specified filler.
 *
 * @template A - The first array type.
 * @template B - The second array type.
 * @template F - The filler type to use for missing values.
 * @example
 * ```ts
 * type A = ZipFill<[1, 2], ['a', 'b', 'c'], null> // [[1, 'a'], [2, 'b'], [null, 'c']]
 * type B = ZipFill<[1, 2, 3], ['a'], 0> // [[1, 'a'], [2, 0], [3, 0]]
 * type C = ZipFill<[], ['a', 'b'], false> // [[false, 'a'], [false, 'b']]
 * type D = ZipFill<[], [], undefined> // []
 * ```
 */
export type ZipFill<A extends Tuple, B extends Tuple, F> =
  A extends readonly [infer AF, ...infer AR] ?
    B extends readonly [infer BF, ...infer BR] ?
      readonly [readonly [AF, BF], ...ZipFill<AR, BR, F>]
    : readonly [readonly [AF, F], ...ZipFill<AR, [], F>]
  : B extends readonly [infer BF, ...infer BR] ?
    readonly [readonly [F, BF], ...ZipFill<readonly [], BR, F>]
  : readonly [];
/**
 * Zips two tuples together, returning the zipped pairs and any remainder from the longer array.
 *  - Zipped pairs are returned at index 0 of the tuple.
 *  - The remainder of the longer array is returned at index 1 of the tuple.
 *
 * @template A - The first array type.
 * @template B - The second array type.
 * @example
 * ```ts
 * type A = ZipRemainder<[1, 2, 3], ['a', 'b']> // [ [[1, 'a'], [2, 'b']], [3] ]
 * type B = ZipRemainder<[1], ['a', 'b', 'c']> // [ [[1, 'a']], ['b', 'c'] ]
 * type C = ZipRemainder<[1, 2], ['a', 'b']> // [ [[1, 'a'], [2, 'b']], [] ]
 * type D = ZipRemainder<[], ['a', 'b']> // [ [], ['a', 'b'] ] }
 * type E = ZipRemainder<[1, 2], []> // [ [], [1, 2] ]
 * type F = ZipRemainder<[], []> // [ [], [] ]
 * ```
 */
export type ZipRemainder<
  A extends Tuple,
  B extends Tuple,
  Z extends Tuple = readonly []
> =
  A extends readonly [infer AF, ...infer AR] ?
    B extends readonly [infer BF, ...infer BR] ?
      ZipRemainder<AR, BR, readonly [...Z, readonly [AF, BF]]>
    : readonly [Z, readonly [AF, ...AR]]
  : B extends readonly [infer BF, ...infer BR] ?
    readonly [Z, readonly [BF, ...BR]]
  : readonly [Z, readonly []];

export interface ZipRemainderObj<A extends Tuple, B extends Tuple> {
  readonly remainder: ZipRemainder<A, B>[1];
  readonly zipped: ZipRemainder<A, B>[0];
}
