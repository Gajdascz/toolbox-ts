import type { Arr, Group } from '@toolbox-ts/types/defs/array';

/**
 * Groups elements of an array based on a key function.
 * - The key function is applied to each element to determine its group.
 * - Returns an object where each key is a group identifier and the value is an array of elements in that group.
 *
 *
 * @template K - Type of the key used for grouping (must be a valid object key type)
 *
 * @pure
 *
 * @example
 * ```ts
 * const grouped = group(
 *   ['apple', 'banana', 'apricot', 'blueberry'],
 *   (item) => item[0] // Group by first letter
 * );
 * // grouped is {
 * //   a: ['apple', 'apricot'],
 * //   b: ['banana', 'blueberry']
 * // }
 *
 * const grouped2 = group([1,2,3,4,5,6,7,8,9,10], (item) => (item % 2 === 0 ? 'even' : 'odd'));
 * // grouped2 is {
 * //   odd: [1, 3, 5, 7, 9],
 * //   even: [2, 4, 6, 8, 10]
 * // }
 * ```
 */
export const group = <T extends Arr = Arr, K extends string = string>(
  arr: T,
  keyFn: (item: T[number], index: number) => K
): Group<T, K> => {
  const result = {} as Record<K, T>;
  for (const [index, item] of arr.entries()) {
    const key = keyFn(item, index);
    (result[key] as unknown) ??= [];
    (result[key] as unknown[]).push(item);
  }
  return result as Group<T, K>;
};
