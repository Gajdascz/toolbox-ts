import type { Arr } from '@toolbox-ts/types/defs/array';

export type DedupeComparator<A extends Arr> = (
  a: A[number],
  b: A[number]
) => boolean;
/**
 * Returns a new array with duplicate values removed, preserving the original order.
 *
 * @important Uses `Set` for deduplication, which checks for strict equality (`===`). This means that for objects and arrays, only references are compared, not their contents.
 *
 * @pure
 *
 * @example
 * ```ts
 * const uniqueArr = dedupe([1, 2, 2, 3, 1]);
 * // uniqueArr is [1, 2, 3]
 *
 * const arr2 = [{a:1}, {b:2}, {a:1}];
 * const uniqueArr2 = dedupe(arr2);
 * // uniqueArr2 is [{a:1}, {b:2}, {a:1}] because the two {a:1} are different references
 * ```
 */
export const dedupe = <A extends Arr = Arr>(
  arr: A,
  comparator?: DedupeComparator<A>
): A =>
  (!comparator ?
    [...new Set(arr)]
  : arr.filter(
      (item, index) =>
        arr.findIndex((other) => comparator(item, other)) === index
    )) as A;
