import {
  assertIsArrayOf,
  assertIsArrayAny,
  checkIsArrayAny,
  isArrayAny,
  checkIsArrayOf,
  isArrayOf,
  checkIsInArrayBounds,
  isArrayEmpty,
  isNotArrayEmpty,
  assertIsNotArrayEmpty,
  assertIsArrayEmpty,
  assertIsInArrayBounds,
  checkIsArrayEmpty,
  checkIsNotArrayEmpty
} from '../../../core/guards/objs/array/index.js';

export const is = {
  /** @narrows any[] */
  any: isArrayAny,
  /** @narrows T[] */
  ofType: isArrayOf,
  /** @narrows `[]` */
  empty: isArrayEmpty,
  /** @narrows `[T, ...(T | undefined)[]] && v.length > 0` */
  notEmpty: isNotArrayEmpty
} as const;
export const assert = {
  /** @asserts any[] */
  any: assertIsArrayAny,
  /** @asserts T[] */
  ofType: assertIsArrayOf,
  /** @asserts `n >= 0 && n < arr.length` */
  inBounds: assertIsInArrayBounds,
  /** @asserts `[]` */
  empty: assertIsArrayEmpty,
  /** @asserts `[T, ...(T | undefined)[]] && v.length > 0` */
  notEmpty: assertIsNotArrayEmpty
} as const;
export const check = {
  /** @checks any[] */
  any: checkIsArrayAny,
  /** @checks T[] */
  ofType: checkIsArrayOf,
  /** @checks `[]` */
  empty: checkIsArrayEmpty,
  /** @checks `[T, ...(T | undefined)[]] && v.length > 0` */
  notEmpty: checkIsNotArrayEmpty,
  /** @checks `n >= 0 && n < arr.length` */
  inBounds: checkIsInArrayBounds
} as const;
