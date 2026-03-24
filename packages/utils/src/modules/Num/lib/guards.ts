// oxlint-disable no-unused-vars
import type {
  StringNumber,
  Digit,
  PositiveDigit,
  NegativeDigit
} from '@toolbox-ts/types/defs/number';

import {
  assertIsNumber,
  assertIsNumberDecimal,
  assertIsNumberFinite,
  isNumberInDigitRange,
  isNumberInNegativeDigitRange,
  isNumberInPositiveDigitRange,
  isNumberString,
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
  isNumber,
  checkIsNumberDecimal,
  checkIsNumberFinite,
  checkIsNumberInByteRange,
  checkIsNumberInDigitRange,
  checkIsNumberInEightBitRange,
  checkIsNumberInfinite,
  checkIsNumberInSixteenBitRange,
  checkIsNumberInteger,
  checkIsNumberInThirtyTwoBitRange,
  checkIsNumberInTwentyFourBitRange,
  checkIsNumberInUnitIntervalRange,
  checkIsNumberNaN,
  checkIsNumberNegative,
  checkIsNumberNegativeInteger,
  checkIsNumberNotNaN,
  checkIsNumberPositive,
  checkIsNumberPositiveInteger,
  checkIsNumberSafeInteger,
  checkIsNumberString
} from '../../../core/guards/primitives/number/index.js';

export const is = {
  /** @narrows `number` */
  any: isNumber,
  /** @narrows {@link StringNumber} */
  string: isNumberString,
  /** @narrows {@link Digit} */
  inDigitRange: isNumberInDigitRange,
  /** @narrows {@link NegativeDigit} */
  inNegativeDigitRange: isNumberInNegativeDigitRange,
  /** @narrows {@link PositiveDigit} */
  inPositiveDigitRange: isNumberInPositiveDigitRange
} as const;

export const assert = {
  /** @asserts `number` */
  any: assertIsNumber,
  /** @asserts `isNumber(n) && n !== NaN` */
  decimal: assertIsNumberDecimal,
  /** @asserts `isNumber(n) && Number.isDecimal(n)` */
  finite: assertIsNumberFinite,
  /** @asserts `isNumber(n) && Number.isFinite(n)` */
  inByteRange: assertIsNumberInByteRange,
  /**
   *  @asserts `n >= 0 && n <= 1024`
   *  @see {@link Digit}
   */
  inDigitRange: assertIsNumberInDigitRange,
  /** @asserts `n >= -9 && n <= 9` */
  inEightBitRange: assertIsNumberInEightBitRange,
  /** @asserts `n >= 0 && n <= 255` */
  infinite: assertIsNumberInfinite,
  /**
   * @asserts `n >= -9 && n <= -1`
   * @see {@link NegativeDigit}
   */
  inNegativeDigitRange: assertIsNumberInNegativeDigitRange,
  /**
   * @asserts `n >= 1 && n <= 9`
   * @see {@link PositiveDigit}
   */
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
  any: checkIsNumber,
  /**
   * @checks `n >= -9 && n <= -1`
   * @see {@link NegativeDigit}
   */
  inNegativeDigitRange: checkIsNumberInNegativeDigitRange,
  /**
   * @checks `n >= 1 && n <= 9`
   * @see {@link PositiveDigit}
   */
  inPositiveDigitRange: checkIsNumberInPositiveDigitRange,
  /** @checks {@link StringNumber} */
  string: checkIsNumberString,
  /** @checks `isNumber(n) && n !== NaN` */
  notNaN: checkIsNumberNotNaN,
  /** @checks `checkIsNumber(n) && Number.isDecimal(n)` */
  decimal: checkIsNumberDecimal,
  /** @checks `checkIsNumber(n) && Number.isFinite(n)` */
  finite: checkIsNumberFinite,
  /** @checks `n >= 0 && n <= 1024` */
  inByteRange: checkIsNumberInByteRange,
  /**
   *  @checks `n >= -9 && n <= 9`
   *  @see {@link Digit}
   */
  inDigitRange: checkIsNumberInDigitRange,
  /** @checks `n >= 0 && n <= 255` */
  inEightBitRange: checkIsNumberInEightBitRange,
  /** @checks `n >= 0 && n <= 65_535` */
  inSixteenBitRange: checkIsNumberInSixteenBitRange,
  /** @checks `n >= 0 && n <= 4_294_967_295` */
  inThirtyTwoBitRange: checkIsNumberInThirtyTwoBitRange,
  /** @checks `n >= 0 && n <= 16_777_215` */
  inTwentyFourBitRange: checkIsNumberInTwentyFourBitRange,
  /** @checks `n >= 0 && n <= 1` */
  inUnitIntervalRange: checkIsNumberInUnitIntervalRange,
  /** @checks `n === Infinity || n === -Infinity` */
  infinite: checkIsNumberInfinite,
  /** @checks `checkIsNumber(n) && Number.isInteger(n)` */
  integer: checkIsNumberInteger,
  /** @checks `checkIsNumber(n) && Number.isNaN(n)` */
  NaN: checkIsNumberNaN,
  /** @checks `checkIsNumber(n) && n < 0` */
  negative: checkIsNumberNegative,
  /** @checks `checkIsNumber(n) && Number.isInteger(n) && n < 0` */
  negativeInteger: checkIsNumberNegativeInteger,
  /** @checks `checkIsNumber(n) && n > 0` */
  positive: checkIsNumberPositive,
  /** @checks `checkIsNumber(n) && Number.isInteger(n) && n > 0` */
  positiveInteger: checkIsNumberPositiveInteger,
  /** @checks `checkIsNumber(n) && Number.isSafeInteger(n)` */
  safeInteger: checkIsNumberSafeInteger
} as const;
