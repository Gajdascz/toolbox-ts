/* c8 ignore start */
import {
  assertIsArrayOf,
  assertIsInArrBounds,
  checkIsArrayOf,
  isArrayOf,
  isInArrBounds
} from '../../../core/guards/objs/array/index.js';

export const is = {
  value: Array.isArray,
  /** @narrows T[] */
  ofType: isArrayOf,
  /** @checks `n >= 0 && n < arr.length` */
  inBounds: isInArrBounds
} as const;
export const assert = {
  /** @asserts T[] */
  ofType: assertIsArrayOf,
  /** @asserts `n >= 0 && n < arr.length` */
  inBounds: assertIsInArrBounds
} as const;
export const check = {
  /** @checks T[] */
  ofType: checkIsArrayOf
} as const;
/* c8 ignore end */
