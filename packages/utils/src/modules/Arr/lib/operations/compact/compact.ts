import type {
  Arr,
  WithoutFalsy,
  WithoutNull,
  WithoutNullish,
  WithoutUndefined
} from '@toolbox-ts/types/defs/array';

import {
  isNotNull,
  isNotNullish,
  isNotUndefined,
  isTruthy
} from '../../../../../core/index.js';

/**
 * Removes all `null` and `undefined` values from the array.
 *
 * @param a - The array to compact.
 *
 * @example
 * ```ts
 * const arr = [1, null, 2, undefined, 3];
 * const compacted = compact(arr); // [1, 2, 3]
 * ```
 */
export const compact = <T extends Arr = Arr>(a: T): WithoutNullish<T> =>
  a.filter(isNotNullish) as WithoutNullish<T>;
/**
 * Removes all falsy values from the array.
 *
 * @param a - The array to compact.
 *
 * @example
 * ```ts
 * const arr = [0, 1, false, 2, '', 3];
 * const compacted = compactFalsy(arr); // [1, 2, 3]
 * ```
 */
export const compactFalsy = <T extends Arr = Arr>(a: T): WithoutFalsy<T> =>
  a.filter(isTruthy) as WithoutFalsy<T>;
/**
 * Removes all `null` values from the array.
 *
 * @param a - The array to compact.
 *
 * @example
 * ```ts
 * const arr = [1, null, 2, null, 3];
 * const compacted = compactNull(arr); // [1, 2, 3]
 * ```
 */
export const compactNull = <T extends Arr = Arr>(a: T): WithoutNull<T> =>
  a.filter(isNotNull) as WithoutNull<T>;
/**
 * Removes all `undefined` values from the array.
 *
 * @param a - The array to compact.
 *
 * @example
 * ```ts
 * const arr = [1, undefined, 2, undefined, 3];
 * const compacted = compactUndefined(arr); // [1, 2, 3]
 * ```
 */
export const compactUndefined = <T extends Arr = Arr>(
  a: T
): WithoutUndefined<T> => a.filter(isNotUndefined) as WithoutUndefined<T>;
