import type { Arr } from '@toolbox-ts/types/defs/array';
/**
 * Returns the a reference to the longer array.
 *
 * @example
 * ```ts
 * longer([1, 2, 3], ['a', 'b']) // [1, 2, 3]
 * longer([1], ['a', 'b', 'c']) // ['a', 'b', 'c']
 * longer([], []) // []
 * ```
 */
export const longer = <A extends Arr = Arr, B extends Arr = Arr>(a: A, b: B) =>
  a.length >= b.length ? a : b;
/**
 * Returns a reference to the shorter array.
 *
 * @example
 * ```ts
 * shorter([1, 2, 3], ['a', 'b']) // ['a', 'b']
 * shorter([1], ['a', 'b', 'c']) // [1]
 * shorter([], []) // []
 * ```
 */
export const shorter = <A extends Arr = Arr, B extends Arr = Arr>(
  a: A,
  b: B
) => (a.length <= b.length ? a : b);
/**
 * Returns a reference to the longest array among the provided arrays.
 * @example
 * ```ts
 * longest([1, 2], ['a', 'b', 'c'], [true])
 * // ['a', 'b', 'c']
 * ```
 */
export const longest = <A extends Arr[] = Arr[]>(
  ...[f, ...rest]: A
): A[number] => rest.reduce(longer, f);
/**
 * Returns a reference to the shortest array among the provided arrays.
 *
 * @example
 * ```ts
 * shortest([1, 2], ['a', 'b', 'c'], [true])
 * // [true]
 * ```
 */
export const shortest = <A extends Arr[] = Arr[]>(...[f, ...r]: A) =>
  r.reduce(shorter, f);
//#endregion
