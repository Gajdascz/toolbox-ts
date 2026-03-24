import type { Arr } from '@toolbox-ts/types/defs/array';
/**
 * Applies a transformation function to each element of an array,
 * filtering out any `undefined` results.
 *
 * Similar to [].map().filter() but only iterates once and expects undefined
 * to be used for filtering.
 *
 * @important Null values will not be filtered out. If you want to filter out nulls, use a transformation function that returns `undefined` for null inputs.
 *
 * @pure
 *
 * @example
 * ```ts
 * transform([1, 2, 3, 4], (n) => (n % 2 === 0 ? n * 2 : undefined))
 * // [4, 8]
 *
 * transform(['a', 'b', 'c'], (s) => s === 'b' ? undefined : s.toUpperCase())
 * // ['A', 'C']
 * ```
 */
export function transform<T extends Arr = Arr, U extends Arr = Arr>(
  arr: T,
  fn: (item: T[number]) => U[number] | undefined
): U {
  const result = [];
  for (const item of arr) {
    const mapped = fn(item);
    if (mapped !== undefined) result.push(mapped);
  }
  return result as U;
}

export function transformInPlace<T extends unknown[] = unknown[]>(
  arr: T,
  fn: (item: T[number]) => T[number] | undefined
): void {
  let writeIndex = 0;
  for (let readIndex = 0; readIndex < arr.length; readIndex++) {
    const mapped = fn(arr[readIndex]);
    if (mapped !== undefined) {
      arr[writeIndex] = mapped;
      writeIndex++;
    }
  }
  arr.length = writeIndex;
}
