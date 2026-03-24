import type { Arr, Element, ElementNotUndefined } from '@toolbox-ts/types/defs/array';

/**
 * Returns the element at the specified index of an array, `undefined` if out of bounds, or `fallbackIfUndefined` if undefined.
 *
 * @example
 * ```ts
 * at([1, 2, 3], 1) // 2
 * at([1, 2, 3], -1) // 3
 * at([1, 2, 3], 5) // undefined
 * at([1, 2, 3], 5, null) // null
 * ```
 */
export const at = <T extends Arr = Arr, F = undefined>(
  arr: T,
  index: number,
  fallbackIfUndefined?: F
): Exclude<Element<T>, undefined> | F => {
  const at = arr.at(index) as Element<T>;
  return (at === undefined ? fallbackIfUndefined : at) as Exclude<Element<T>, undefined> | F;
};
/**
 * Returns the element at the specified index of an array.
 *
 * @throws `Error` if the index is out of bounds.
 *
 * @example
 * ```ts
 * atOrThrow([1, 2, 3], 1) // 2
 * atOrThrow([1, 2, 3], -1) // 3
 * atOrThrow([1, 2, 3], 5) // throws Error
 * ```
 */
export const atOrThrow = <T extends Arr>(arr: T, index: number): ElementNotUndefined<T> => {
  const val = at(arr, index);
  if (val === undefined)
    throw new Error(`Array element at index ${index} is undefined: ${arr.join(', ')}`);
  return val as ElementNotUndefined<T>;
};
/**
 * Returns the last index of an array, -1 if empty.
 *
 * @example
 * ```ts
 * lastIndex([1, 2, 3]) // 2
 * lastIndex([]) // -1
 * ```
 */
export const lastIndex = <T extends Arr>(arr: T) => arr.length - 1;
/**
 * Returns the last element of an array, or undefined if empty.
 * @example
 * ```ts
 * last([1, 2, 3]) // 3
 * last([]) // undefined
 * ```
 */
export const last = <T extends Arr>(arr: T): Element<T> => at(arr, -1);
/**
 * Returns the last element of an array.
 *
 * @throws `Error` if the array is empty.
 * @example
 * ```ts
 * lastOrThrow([1, 2, 3]) // 3
 * lastOrThrow([]) // throws Error
 * ```
 */
export const lastOrThrow = <T extends Arr>(arr: T): ElementNotUndefined<T> => {
  const val = last(arr);
  if (val === undefined) throw new Error(`Last element is undefined: ${arr.join(', ')}`);
  return val as ElementNotUndefined<T>;
};
/**
 * Returns the first element of an array, or undefined if empty.
 *
 * @example
 * ```ts
 * first([1, 2, 3]) // 1
 * first([]) // undefined
 * ```
 */
export const first = <T extends Arr>(arr: T): Element<T> => at(arr, 0);
/**
 * Returns the first element of an array.
 *
 * @throws `Error` if the array is empty.
 *
 * @example
 * ```ts
 * firstOrThrow([1, 2, 3]) // 1
 * firstOrThrow([]) // throws Error
 * ```
 */
export const firstOrThrow = <T extends Arr = Arr>(arr: T): ElementNotUndefined<T> => {
  const val = first(arr);
  if (val === undefined) throw new Error(`First element is undefined: ${arr.join(', ')}`);
  return val as ElementNotUndefined<T>;
};
