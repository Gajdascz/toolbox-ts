import type {
  Append,
  Chunk,
  Dedupe,
  Element,
  Entries,
  First,
  From,
  Insert,
  Last,
  LastIndex,
  Longer,
  Of,
  Prepend,
  RemoveAll,
  RemoveAt,
  RemoveFirst,
  RemoveLast,
  Reverse,
  Shorter,
  SplitAt,
  Tuple,
  WithoutFalsy,
  WithoutNull,
  WithoutNullish,
  WithoutUndefined,
  Zip,
  ZipFill,
  ZipRemainderObj
} from '@toolbox-ts/types/defs/tuple';

import { Arr } from '../../Arr/index.js';

//#region> Accessors
export const at = <const T extends Tuple>(t: T, index: number) =>
  Arr.atOrThrow(t, index) as Element<T>;
export const first = <const T extends Tuple>(t: T) =>
  Arr.firstOrThrow(t) as First<T>;
export const last = <const T extends Tuple>(t: T) =>
  Arr.lastOrThrow(t) as Last<T>;
export const lastIndex = <const T extends Tuple>(t: T): LastIndex<T> =>
  Arr.lastIndex(t) as LastIndex<T>;
export const entries = <const T extends Tuple>(t: T): Entries<T> =>
  t.entries() as unknown as Entries<T>;
//#endregion

//#region> Comparison
export const longer = <const T extends Tuple, const U extends Tuple>(
  a: T,
  b: U
): Longer<T, U> => Arr.longer(a, b) as Longer<T, U>;
export const shorter = <const T extends Tuple, const U extends Tuple>(
  a: T,
  b: U
): Shorter<T, U> => Arr.shorter(a, b) as Shorter<T, U>;

//#endregion

//#region> Creation
export const to = <const T>(t: T): From<T> => Arr.to(t) as From<T>;
export const init = <const L extends number, const T = null>(
  length: L,
  initialValue: ((index: number) => T) | T = null as T
): Of<L, T> => Arr.from(length, initialValue) as Of<L, T>;
//#endregion

//#region> Operations

//#region> Insert
export const insert = <
  const T extends Tuple,
  const E extends Tuple,
  const I extends number
>(
  t: T,
  e: E,
  i: I
) => Arr.insert(t, e, i) as unknown as Insert<T, E, I>;

export const append = <const T extends Tuple, const E extends Tuple>(
  t: T,
  e: E
) => Arr.insert(t, e, Infinity) as unknown as Append<T, E>;
export const prepend = <const T extends Tuple, const E extends Tuple>(
  t: T,
  e: E
) => Arr.insert(t, e, 0) as unknown as Prepend<T, E>;

//#endregion
//#region> Chunk
export const chunk = <const T extends Tuple, const S extends number>(
  t: T,
  size: S
) => Arr.chunk(t, size) as Chunk<T, S>;
//#endregion
//#region> Clone
export const clone = <const T extends Tuple>(
  t: T,
  strategy: Arr.CloneStrategy<T> = 'shallow'
) => Arr.clone<T>(t, strategy);
//#endregion
//#region> SplitAt
export const splitAt = <const T extends Tuple, const I extends number>(
  t: T,
  index: I
): SplitAt<T, I> => Arr.splitAt(t, index) as unknown as SplitAt<T, I>;
//#endregion
//#region> Dedupe
export const dedupe = <const T extends Tuple>(t: T) =>
  Arr.dedupe(t) as Dedupe<T>;
//#endregion
//#region> Compact
export const compact = <const T extends Tuple>(t: T): WithoutNullish<T> =>
  Arr.compact(t) as unknown as WithoutNullish<T>;
export const compactFalsy = <const T extends Tuple>(t: T): WithoutFalsy<T> =>
  Arr.compactFalsy(t) as unknown as WithoutFalsy<T>;
export const compactNull = <const T extends Tuple>(t: T): WithoutNull<T> =>
  Arr.compactNull(t) as unknown as WithoutNull<T>;
export const compactUndefined = <const T extends Tuple>(
  t: T
): WithoutUndefined<T> =>
  Arr.compactUndefined(t) as unknown as WithoutUndefined<T>;
//#endregion
//#region> Zip
export function zip<
  const A extends Tuple = Tuple,
  const B extends Tuple = Tuple
>(a: A, b: B): Zip<A, B> {
  return Arr.zip(a, b) as Zip<A, B>;
}
export function zipFill<
  const A extends Tuple = Tuple,
  const B extends Tuple = Tuple,
  const F = null
>(a: A, b: B, fill?: F): ZipFill<A, B, F> {
  return Arr.zipFill(a, b, fill) as unknown as ZipFill<A, B, F>;
}
export function zipRemainder<
  const A extends Tuple = Tuple,
  const B extends Tuple = Tuple
>(a: A, b: B): ZipRemainderObj<A, B> {
  return Arr.zipRemainder(a, b) as unknown as ZipRemainderObj<A, B>;
}
//#endregion
//#region> Reverse
export const reverse = <const T extends Tuple>(t: T): Reverse<T> =>
  t.toReversed() as Reverse<T>;
//#endregion
//#region> Remove
export const removeAll = <const T extends Tuple, const V>(
  t: T,
  value: V
): RemoveAll<T, V> =>
  t.filter((item) => item !== value) as unknown as RemoveAll<T, V>;
export const removeAt = <const T extends Tuple, const I extends number>(
  t: T,
  index: I
): RemoveAt<T, I> =>
  t.filter((_, i) => i !== index) as unknown as RemoveAt<T, I>;
export const removeFirst = <const T extends Tuple>(t: T): RemoveFirst<T> =>
  t.slice(1) as unknown as RemoveFirst<T>;
export const removeLast = <const T extends Tuple>(t: T): RemoveLast<T> =>
  t.slice(0, -1) as unknown as RemoveLast<T>;
//#endregion

//#endregion
