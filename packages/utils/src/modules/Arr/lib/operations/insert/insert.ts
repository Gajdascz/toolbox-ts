import type { Arr } from '@toolbox-ts/types/defs/array';

/**
 * Inserts an element or elements into an array at the specified index.
 *
 * @param t - The target array to insert elements into.
 * @param e - The element or elements to insert into the array.
 * @param i - The index at which to insert the elements.
 * @returns A new array with the elements inserted at the specified index.
 *
 * @example
 * ```ts
 * const arr = [1, 2, 3];
 * const newArr = insert(arr, 4, 1);
 * console.log(newArr); // [1, 4, 2, 3]
 * ```
 *
 */
export function insert<T extends Arr = Arr, E = unknown>(
  t: T,
  e: E,
  i: number
) {
  const elements = Array.isArray(e) ? e : [e];
  const length = t.length;
  if (i === 0) return [...elements, ...t];
  if (i >= length) return [...t, ...elements];
  const index = Math.round(i < 0 ? length + i : i);
  const pos = Math.max(0, Math.min(index, length));
  return [...t.slice(0, pos), ...elements, ...t.slice(pos)];
}
