/* c8 ignore start */

import type { StringNumber } from '@toolbox-ts/types/defs/number';

import {
  assertIsNumber,
  assertIsNumberDecimal,
  assertIsNumberFinite,
  assertIsNumberInByteRange,
  assertIsNumberInDigitRange,
  assertIsNumberInEightBitRange,
  assertIsNumberInfinite,
  assertIsNumberInNegativeDigitRange,
  assertIsNumberInPositiveDigitRange,
  assertIsNumberInSixteenBitRange,
  assertIsNumberInteger,
  assertIsNumberInThirtyTwoBitRange,
  assertIsNumberInTwentyFourBitRange,
  assertIsNumberInUnitIntervalRange,
  assertIsNumberNaN,
  assertIsNumberNeg,
  assertIsNumberNegInteger,
  assertIsNumberNotNaN,
  assertIsNumberPositive,
  assertIsNumberPositiveInteger,
  assertIsNumberSafeInteger,
  assertIsNumberString,
  checkIsNumber,
  checkIsNumberInNegativeDigitRange,
  checkIsNumberInPositiveDigitRange,
  checkIsNumberString,
  isNumber,
  isNumberDecimal,
  isNumberFinite,
  isNumberInByteRange,
  isNumberInDigitRange,
  isNumberInEightBitRange,
  isNumberInfinite,
  isNumberInNegativeDigitRange,
  isNumberInPositiveDigitRange,
  isNumberInSixteenBitRange,
  isNumberInteger,
  isNumberInThirtyTwoBitRange,
  isNumberInTwentyFourBitRange,
  isNumberInUnitIntervalRange,
  isNumberNaN,
  isNumberNegative,
  isNumberNegativeInteger,
  isNumberNotNaN,
  isNumberPositive,
  isNumberPositiveInteger,
  isNumberSafeInteger,
  isNumberString
} from '../../../core/guards/primitives/number/index.js';

export const is = {
  /**  @narrows `number` */
  value: isNumber,
  /** @checks `isNumber(n) && n !== NaN` */
  notNaN: isNumberNotNaN,
  /** @checks `isNumber(n) && Number.isDecimal(n)` */
  decimal: isNumberDecimal,
  /** @checks `isNumber(n) && Number.isFinite(n)` */
  finite: isNumberFinite,
  /** @checks `n >= 0 && n <= 1024` */
  inByteRange: isNumberInByteRange,
  /** @checks `n >= -9 && n <= 9` */
  inDigitRange: isNumberInDigitRange,
  /** @checks `n >= 0 && n <= 255` */
  inEightBitRange: isNumberInEightBitRange,
  /** @checks `n >= -9 && n <= -1` */
  inNegativeDigitRange: isNumberInNegativeDigitRange,
  /** @checks `n >= 1 && n <= 9` */
  inPositiveDigitRange: isNumberInPositiveDigitRange,
  /** @checks `n >= 0 && n <= 65_535` */
  inSixteenBitRange: isNumberInSixteenBitRange,
  /** @checks `n >= 0 && n <= 4_294_967_295` */
  inThirtyTwoBitRange: isNumberInThirtyTwoBitRange,
  /** @checks `n >= 0 && n <= 16_777_215` */
  inTwentyFourBitRange: isNumberInTwentyFourBitRange,
  /** @checks `n >= 0 && n <= 1` */
  inUnitIntervalRange: isNumberInUnitIntervalRange,
  /** @checks `n === Infinity || n === -Infinity` */
  infinite: isNumberInfinite,
  /** @checks `isNumber(n) && Number.isInteger(n)` */
  integer: isNumberInteger,
  /** @checks `isNumber(n) && Number.isNaN(n)` */
  NaN: isNumberNaN,
  /** @checks `isNumber(n) && n < 0` */
  negative: isNumberNegative,
  /** @checks `isNumber(n) && Number.isInteger(n) && n < 0` */
  negativeInteger: isNumberNegativeInteger,
  /** @checks `isNumber(n) && n > 0` */
  positive: isNumberPositive,
  /** @checks `isNumber(n) && Number.isInteger(n) && n > 0` */
  positiveInteger: isNumberPositiveInteger,
  /** @checks `isNumber(n) && Number.isSafeInteger(n)` */
  safeInteger: isNumberSafeInteger,
  /** @narrows {@link StringNumber} */
  string: isNumberString
} as const;

export const assert = {
  /** @asserts `number` */
  is: assertIsNumber,
  /** @asserts `isNumber(n) && n !== NaN` */
  decimal: assertIsNumberDecimal,
  /** @asserts `isNumber(n) && Number.isDecimal(n)` */
  finite: assertIsNumberFinite,
  /** @asserts `isNumber(n) && Number.isFinite(n)` */
  inByteRange: assertIsNumberInByteRange,
  /** @asserts `n >= 0 && n <= 1024` */
  inDigitRange: assertIsNumberInDigitRange,
  /** @asserts `n >= -9 && n <= 9` */
  inEightBitRange: assertIsNumberInEightBitRange,
  /** @asserts `n >= 0 && n <= 255` */
  infinite: assertIsNumberInfinite,
  /** @asserts `n >= -9 && n <= -1` */
  inNegativeDigitRange: assertIsNumberInNegativeDigitRange,
  /** @asserts `n >= 1 && n <= 9` */
  inPositiveDigitRange: assertIsNumberInPositiveDigitRange,
  /** @asserts `n >= 0 && n <= 65_535` */
  inSixteenBitRange: assertIsNumberInSixteenBitRange,
  /** @asserts `n >= 0 && n <= 4_294_967_295` */
  integer: assertIsNumberInteger,
  /** @asserts `n >= 0 && n <= 16_777_215` */
  inThirtyTwoBitRange: assertIsNumberInThirtyTwoBitRange,
  /** @asserts `n >= 0 && n <= 1` */
  inTwentyFourBitRange: assertIsNumberInTwentyFourBitRange,
  /** @asserts `n === Infinity || n === -Infinity` */
  inUnitIntervalRange: assertIsNumberInUnitIntervalRange,
  /** @asserts `isNumber(n) && Number.isInteger(n)` */
  NaN: assertIsNumberNaN,
  /** @asserts `isNumber(n) && Number.isNaN(n)` */
  negative: assertIsNumberNeg,
  /** @asserts `isNumber(n) && n < 0` */
  negativeInteger: assertIsNumberNegInteger,
  /** @asserts `isNumber(n) && Number.isInteger(n) && n < 0` */
  notNaN: assertIsNumberNotNaN,
  /** @asserts `isNumber(n) && n > 0` */
  positive: assertIsNumberPositive,
  /** @asserts `isNumber(n) && Number.isInteger(n) && n > 0` */
  positiveInteger: assertIsNumberPositiveInteger,
  /** @asserts `isNumber(n) && Number.isSafeInteger(n)` */
  safeInteger: assertIsNumberSafeInteger,
  /** @asserts {@link StringNumber} */
  string: assertIsNumberString
} as const;
export const check = {
  /** @checks `isNumber(n)` */
  is: checkIsNumber,
  /** @checks `n >= -9 && n <= -1` */
  inNegativeDigitRange: checkIsNumberInNegativeDigitRange,
  /** @checks `n >= 1 && n <= 9` */
  inPositiveDigitRange: checkIsNumberInPositiveDigitRange,
  /** @checks {@link StringNumber} */
  string: checkIsNumberString
} as const;
/* c8 ignore end */
