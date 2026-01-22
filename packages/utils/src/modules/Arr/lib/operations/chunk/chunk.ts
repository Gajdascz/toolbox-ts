import type { Arr, Chunk } from '@toolbox-ts/types/defs/array';

import { assertIsNumberPositiveInteger } from '../../../../../core/index.js';
/**
 * Splits an array into chunks of a specified size.
 * - The last chunk may be smaller if there are not enough elements.
 *
 * @throws `TypeError` if size is not a positive integer.
 *
 * @pure
 *
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5], 2)
 * // [[1, 2], [3, 4], [5]]
 *
 * chunk(['a', 'b', 'c', 'd'], 3)
 * // [['a', 'b', 'c'], ['d']]
 * ```
 */
export function chunk<T extends Arr = Arr>(arr: T, size: number): Chunk<T> {
  assertIsNumberPositiveInteger(size);
  if (arr.length === 0) return [] as Chunk<T>;
  if (size >= arr.length) return [arr] as Chunk<T>;
  const result = [];
  for (let i = 0; i < arr.length; i += size)
    result.push(arr.slice(i, i + size) as T);
  return result as Chunk<T>;
}
