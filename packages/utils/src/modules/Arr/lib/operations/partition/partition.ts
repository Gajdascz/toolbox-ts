import type { Arr } from '@toolbox-ts/types/defs/array';
/**
 * Partitions an array into two arrays based on a predicate function.
 * - The first array contains elements that satisfy the predicate.
 * - The second array contains elements that do not satisfy the predicate.
 *
 * @pure
 *
 * @example
 * ```ts
 * const [evens, odds] = partition([1, 2, 3, 4, 5], (n) => n % 2 === 0);
 * // evens is [2, 4]
 * // odds is [1, 3, 5]
 * ```
 */
export const partition = <T extends Arr = Arr>(
  arr: T,
  predicate: (item: T[number]) => boolean
): [T, T] => {
  const truthy: unknown[] = [];
  const falsy: unknown[] = [];
  for (const item of arr) (predicate(item) ? truthy : falsy).push(item);
  return [truthy, falsy] as [T, T];
};
