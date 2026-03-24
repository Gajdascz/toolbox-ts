// oxlint-disable no-unused-vars
import type { Tuple } from '@toolbox-ts/types/defs/tuple';

import {
  assertIsInArrayBounds,
  assertIsTuple,
  checkIsTuple,
  checkIsInArrayBounds,
  isTuple
} from '../../../core/guards/objs/array/index.js';
export const is = {
  /**@narrows {@link Tuple} */
  any: isTuple
} as const;
export const assert = {
  /** @asserts {@link Tuple} */
  any: assertIsTuple,
  /** @asserts `i >= 0 && i < tuple.length` */
  inBounds: assertIsInArrayBounds
} as const;
export const check = {
  /** @checks {@link Tuple} */
  any: checkIsTuple,
  /** @checks `i >= 0 && i < tuple.length` */
  inBounds: checkIsInArrayBounds
} as const;
