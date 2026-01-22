import type { From } from '@toolbox-ts/types/defs/array';

import {
  assertIsNumberPositiveInteger,
  assertIsNumberSafeInteger
} from '../../../../core/index.js';
/**
 * Ensures the input is returned as an array.
 * - If the input is already an array, it is returned as-is.
 * - If the input is a single value, it is wrapped in an array.
 * - If the input is `undefined`, an empty array is returned.
 * - If the input is `null`, an empty array is returned unless `allowNull` is set to `true`.
 *
 * @important This function does not perform any coercion beyond wrapping in an array. For example, a string will be returned as a single-element array containing that string, not as an array of its characters.
 *
 *
 * @template V - Type of the input value
 *
 * @example
 * ```ts
 * to(5) // [5]
 * to([1, 2, 3]) // [1, 2, 3]
 * to(null) // []
 * to(undefined) // []
 * to(new Map()) // [Map{}]
 * to(null, true) // [null]
 * ```
 */
export const to = <V = unknown>(v: V, allowNull = false): From<V> =>
  (v === undefined || (!allowNull && v === null) ? []
  : Array.isArray(v) ? v
  : [v]) as From<V>;

/**
 * Creates and returns an array of specified length, filled with the provided initial value.
 *
 * @template T - Type of the initial value
 *
 * @default null
 *
 * @throws `TypeError` if length is not a positive integer.
 *
 * @example
 * ```ts
 * from(3, 'a') // ['a', 'a', 'a']
 * from(5, 0) // [0, 0, 0, 0, 0]
 * from(0, true) // []
 * ```
 */
export const from = <T = null>(
  length: number,
  initialValue: ((index: number) => T) | T = null as T
): T[] => {
  assertIsNumberPositiveInteger(length);
  return typeof initialValue === 'function' ?
      Array.from<number, T>({ length }, (_, i) =>
        (initialValue as (index: number) => T)(i)
      )
    : Array.from<number, T>({ length }, () => initialValue);
};
/**
 * Generates an array of numbers within a specified range.
 * - The range includes both the start and end values.
 * - Supports both ascending and descending ranges based on the start and end values.
 * - The step parameter defines the increment (or decrement) between consecutive numbers in the range.
 *
 * @throws `TypeError` if start and end, are not safe integers or if step is not a positive integer.
 *
 * @example
 * ```ts
 * range(1, 5) // [1, 2, 3, 4, 5]
 * range(5, 1) // [5, 4, 3, 2, 1]
 * range(1, 10, 2) // [1, 3, 5, 7, 9]
 * range(10, 1, 3) // [10, 7, 4, 1]
 * range(3, 3) // [3]
 * range(3, 3, 5) // [3]
 * range(3, 3, 0) // [3]
 * range(5,-10, 5) // [5, 0, -5, -10]
 *
 * ```
 *
 * @param start - The starting number of the range.
 * @param end - The ending number of the range.
 */
export function range(start: number, end: number, step = 1): number[] {
  if (step === 0) return [start];
  assertIsNumberSafeInteger(start);
  assertIsNumberSafeInteger(end);
  assertIsNumberPositiveInteger(step);

  const result: number[] = [];
  if (end >= start) for (let i = start; i <= end; i += step) result.push(i);
  else for (let i = start; i >= end; i -= step) result.push(i);
  return result;
}

/**
 * Returns a new array from a set of elements.
 *
 * @param items - A set of elements to include in the new array object.
 *
 * @example
 * ```ts
 * of(1, 2, 3) // [1, 2, 3]
 * of('a', 'b', 'c') // ['a', 'b', 'c']
 * of(true, false) // [true, false]
 * ```
 */
export const of = Array.of;
