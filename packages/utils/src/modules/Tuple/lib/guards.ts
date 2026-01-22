/* c8 ignore start */
import type { Tuple } from '@toolbox-ts/types/defs/tuple';

import {
  assertIsInArrBounds,
  assertIsTuple,
  checkIsTuple,
  isInArrBounds,
  isTuple
} from '../../../core/guards/objs/array/index.js';
export const is = {
  /**@narrows {@link Tuple} */
  value: isTuple,
  /** @checks `i >= 0 && i < tuple.length` */
  inBounds: isInArrBounds
} as const;
export const assert = {
  /** @asserts {@link Tuple} */
  value: assertIsTuple,
  /** @asserts `i >= 0 && i < tuple.length` */
  inBounds: assertIsInArrBounds
} as const;
export const check = {
  /** @checks {@link Tuple} */
  value: checkIsTuple
} as const;
/* c8 ignore end */
