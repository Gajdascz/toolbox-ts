import type { Falsy, Nullish } from '../../general.js';
import type { GreaterThan, Increment, LessThan } from '../../number/definitions/number.js';
import type { DeepReadonly } from '../../object/definitions/modifier/modifier.js';

//#region> Base Tuple Type
export type Tuple<T extends readonly unknown[] = unknown[]> = DeepReadonly<[...T]>;
//#endregion

//#region> Access

//#region> Element
export type Element<T extends Tuple> = Exclude<T[number], undefined>;
export type ElementAt<T extends Tuple, I extends number> = T[I] extends undefined ? never : T[I];
//#endregion
export type Entries<T extends readonly unknown[]> = T extends readonly [infer F, ...infer R]
  ? readonly [[0, F], ...ShiftEntries<Entries<R>>]
  : readonly [];

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

/**
 * Gets the last element of an array.
 *
 * @example
 * ```ts
 * type A = ArrLast<[1, 2, 3]> // 3
 * type B = ArrLast<[]> // never
 * ```
 */
export type Last<T extends Tuple> = T extends readonly [...infer _, infer L] ? L : never;
export type LastIndex<T extends Tuple> = T extends readonly [...infer H, infer _]
  ? [...H]['length']
  : never;

export type ShiftEntries<T extends readonly unknown[]> = T extends readonly [
  [infer I extends number, infer V],
  ...infer R
]
  ? readonly [[Increment<I>, V], ...ShiftEntries<R>]
  : readonly [];
//#endregion

//#region> Creation
export type From<L> = L extends readonly unknown[] | unknown[] ? Tuple<L> : readonly [L];
export type Of<L extends number, T, R extends readonly T[] = readonly []> = R['length'] extends L
  ? DeepReadonly<R>
  : Of<L, T, [...R, T]>;

/**
 * Creates a tuple type with two elements.
 *
 * @example
 * ```ts
 * type A = Pair<'a', 'b'> // ['a', 'b']
 * ```
 */
export type Pair<A, B> = Tuple<[A, B]>;

//#endregion

//#region> With
export type With<T extends Tuple, E> = Tuple<(E | T[number])[]>;
export type WithFalsy<T extends Tuple = Tuple> = With<T, Falsy>;
export type WithNull<T extends Tuple = Tuple> = With<T, null>;
export type WithNullish<T extends Tuple = Tuple> = With<T, Nullish>;
export type WithUndefined<T extends Tuple = Tuple> = With<T, undefined>;
//#endregion
//#region> Without
export type WithoutFalsy<T extends readonly unknown[]> = T extends readonly [infer F, ...infer R]
  ? F extends Falsy
    ? WithoutFalsy<R>
    : readonly [F, ...WithoutFalsy<R>]
  : readonly [];
export type WithoutNull<T extends readonly unknown[]> = T extends readonly [infer F, ...infer R]
  ? F extends null
    ? WithoutNull<R>
    : readonly [F, ...WithoutNull<R>]
  : readonly [];
export type WithoutNullish<T extends readonly unknown[]> = T extends readonly [infer F, ...infer R]
  ? F extends Nullish
    ? WithoutNullish<R>
    : readonly [F, ...WithoutNullish<R>]
  : readonly [];
export type WithoutUndefined<T extends readonly unknown[]> = T extends readonly [
  infer F,
  ...infer R
]
  ? F extends undefined
    ? WithoutUndefined<R>
    : readonly [F, ...WithoutUndefined<R>]
  : readonly [];
//#endregion

//#region> Chunk
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
  A extends Tuple = Tuple<[]>,
  R extends Tuple = Tuple<[]>
> =
  T extends Tuple<[infer F, ...infer Rest]>
    ? A['length'] extends Size
      ? Chunk<T, Size, Tuple<[]>, Tuple<[...R, A]>>
      : Chunk<Rest, Size, Tuple<[...A, F]>, R>
    : A extends Tuple<[]>
      ? R
      : Tuple<[...R, A]>;
export type Dedupe<T extends Tuple, R extends Tuple = Tuple<[]>> =
  T extends Tuple<[infer F, ...infer Rest]>
    ? Includes<R, F> extends true
      ? Dedupe<Rest, R>
      : Dedupe<Rest, Tuple<[...R, F]>>
    : R extends Tuple<[]>
      ? T
      : Tuple<R>;
//#endregion

//#region> Insert
export type Append<T extends Tuple, E extends Tuple> = readonly [...T, ...E];
export type Insert<
  T extends Tuple,
  E extends Tuple,
  I extends number,
  Head extends Tuple = readonly []
> = Head['length'] extends I
  ? readonly [...Head, ...E, ...T]
  : T extends readonly [infer F, ...infer Rest]
    ? Insert<Rest, E, I, readonly [...Head, F]>
    : readonly [...Head, ...E];
export type Prepend<T extends Tuple, E extends Tuple> = readonly [...E, ...T];

/**
 * Computes the intersection of all tuple element types.
 *
 * @example
 * ```ts
 * type A = Intersect<['a' | 'b', 'b' | 'c', 'b'>> // 'b'
 * type B = Intersect<[1 | 2, 2 | 3, 2 | 4]> // 2
 * type C = Intersect<['x', 'y', 'z']> // never
 * type D = Intersect<[]> // unknown
 * ```
 */
export type IntersectElementUnions<T extends readonly unknown[]> = T extends readonly [
  infer H,
  ...infer R
]
  ? H & IntersectElementUnions<R>
  : unknown;
//#endregion

//#region> Conditional & Comparison
export type Includes<T extends Tuple, V> = T extends readonly [infer F, ...infer R]
  ? [F] extends readonly [V]
    ? true
    : Includes<R, V>
  : false;

export type Longer<T extends Tuple, U extends Tuple> = T['length'] extends U['length']
  ? T
  : GreaterThan<T['length'], U['length']> extends true
    ? T
    : U;
export type Shorter<T extends Tuple, U extends Tuple> = T['length'] extends U['length']
  ? T
  : LessThan<T['length'], U['length']> extends true
    ? T
    : U;
//#endregion

//#region> Reverse
export type Reverse<T extends Tuple, R extends Tuple = []> = DeepReadonly<
  T extends readonly [infer F, ...infer Rest] ? Reverse<Rest, readonly [F, ...R]> : R
>;
//#endregion

//#region> SplitAt
export type SplitAt<
  T extends Tuple,
  I extends number,
  Head extends Tuple = readonly []
> = DeepReadonly<
  Head['length'] extends I
    ? readonly [Head, T]
    : T extends readonly [infer F, ...infer Rest]
      ? SplitAt<Rest, I, readonly [...Head, F]>
      : readonly [Head, T]
>;
//#endregion

//#region> Zip
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
export type Zip<A extends Tuple, B extends Tuple> = A extends readonly [infer AF, ...infer AR]
  ? B extends readonly [infer BF, ...infer BR]
    ? readonly [readonly [AF, BF], ...Zip<AR, BR>]
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
export type ZipFill<A extends Tuple, B extends Tuple, F> = A extends readonly [
  infer AF,
  ...infer AR
]
  ? B extends readonly [infer BF, ...infer BR]
    ? readonly [readonly [AF, BF], ...ZipFill<AR, BR, F>]
    : readonly [readonly [AF, F], ...ZipFill<AR, [], F>]
  : B extends readonly [infer BF, ...infer BR]
    ? readonly [readonly [F, BF], ...ZipFill<readonly [], BR, F>]
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
> = A extends readonly [infer AF, ...infer AR]
  ? B extends readonly [infer BF, ...infer BR]
    ? ZipRemainder<AR, BR, readonly [...Z, readonly [AF, BF]]>
    : readonly [Z, readonly [AF, ...AR]]
  : B extends readonly [infer BF, ...infer BR]
    ? readonly [Z, readonly [BF, ...BR]]
    : readonly [Z, readonly []];

export interface ZipRemainderObj<A extends Tuple, B extends Tuple> {
  readonly remainder: ZipRemainder<A, B>[1];
  readonly zipped: ZipRemainder<A, B>[0];
}
//#endregion

//#region> Remove
export type RemoveAll<T extends Tuple, E> = T extends readonly [infer F, ...infer R]
  ? F extends E
    ? RemoveAll<R, E>
    : readonly [F, ...RemoveAll<R, E>]
  : readonly [];
export type RemoveAt<
  T extends readonly unknown[],
  I extends number,
  Count extends readonly unknown[] = [],
  Head extends readonly unknown[] = []
> = Count['length'] extends I
  ? T extends Tuple<[infer _Drop, ...infer R]>
    ? Tuple<[...Head, ...R]>
    : Head
  : T extends Tuple<[infer F, ...infer R]>
    ? RemoveAt<R, I, Tuple<[...Count, unknown]>, Tuple<[...Head, F]>>
    : Head;
export type RemoveFirst<T extends Tuple> = T extends readonly [infer _, ...infer R]
  ? Tuple<R>
  : Tuple<[]>;

export type RemoveLast<T extends Tuple> = T extends readonly [...infer R, infer _]
  ? Tuple<R>
  : Tuple<[]>;
//#endregion
