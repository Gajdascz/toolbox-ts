import type {
  Digit,
  NegativeDigit,
  PositiveDigit,
  StringNumber
} from '@toolbox-ts/types/defs/number';

import { NUMS } from '../../../constants/index.js';
import {
  createNumRangeError,
  createTypeError
} from '../../../utils/errors/index.js';
import { isNumber } from '../../base/index.js';
import { createGuard, createIsGuards, createNames } from '../../factories.js';
export { assertIsNumber, checkIsNumber, isNumber } from '../../base/index.js';
const TYPES = {
  NAN: 'NumberNaN',
  NOT_NAN: 'NumberNotNaN',
  INT: 'NumberInteger',
  FINITE: 'NumberFinite',
  INFINITE: 'NumberInfinite',
  POSITIVE: 'NumberPositive',
  NEGATIVE: 'NumberNegative',
  SAFE_INTEGER: 'NumberSafeInteger',
  POSITIVE_INTEGER: 'NumberPositiveInteger',
  NEGATIVE_INTEGER: 'NumberNegativeInteger',
  DECIMAL: 'NumberDecimal',
  STR_NUM: 'NumberString',

  IN_DIGIT: 'NumberInDigitRange',
  IN_POS_DIGIT: 'NumberInPositiveDigitRange',
  IN_NEG_DIGIT: 'NumberInNegativeDigitRange',
  IN_EIGHT_BIT: 'NumberInEightBitRange',
  IN_SIXTEEN_BIT: 'NumberInSixteenBitRange',
  IN_TWENTY_FOUR_BIT: 'NumberInTwentyFourBitRange',
  IN_THIRTY_TWO_BIT: 'NumberInThirtyTwoBitRange',
  IN_BYTES: 'NumberInByteRange',
  IN_UNIT_INTERVAL: 'NumberInUnitIntervalRange'
} as const;
//#region> NaN
const nan = createNames(TYPES.NAN);
export const isNumberNaN = createGuard(
  nan.isName,
  nan.typeName,
  (v) => isNumber(v) && Number.isNaN(v)
);
const notNan = createNames(TYPES.NOT_NAN);
export const isNumberNotNaN = createGuard(
  notNan.isName,
  notNan.typeName,
  (v) => isNumber(v) && !Number.isNaN(v)
);
export function assertIsNumberNaN(v: unknown) {
  if (!isNumberNaN(v)) throw createTypeError(isNumberNaN.typeName, v);
}
export function assertIsNumberNotNaN(v: unknown) {
  if (!isNumber(v) || Number.isNaN(v))
    throw createTypeError(isNumberNotNaN.typeName, v);
}
//#endregion
//#region> Integer
const int = createNames(TYPES.INT);
export const isNumberInteger = createGuard(
  int.isName,
  int.typeName,
  (v) => isNumber(v) && Number.isInteger(v)
);
export function assertIsNumberInteger(v: unknown) {
  if (!isNumberInteger(v)) throw createTypeError(isNumberInteger.typeName, v);
}
//#endregion
//#region> Finite
const finite = createNames(TYPES.FINITE);
export const isNumberFinite = createGuard(
  finite.isName,
  finite.typeName,
  (v: unknown) => isNumber(v) && Number.isFinite(v)
);
export function assertIsNumberFinite(v: unknown) {
  if (!isNumberFinite(v)) throw createTypeError(isNumberFinite.typeName, v);
}
//#endregion
//#region> Infinite
const infinite = createNames(TYPES.INFINITE);
export const isNumberInfinite = createGuard(
  infinite.isName,
  infinite.typeName,
  (v) => isNumber(v) && !Number.isFinite(v)
);
export function assertIsNumberInfinite(v: unknown) {
  if (!isNumberInfinite(v)) throw createTypeError(isNumberInfinite.typeName, v);
}
//#endregion
//#region> Pos
const positive = createNames(TYPES.POSITIVE);
export const isNumberPositive = createGuard(
  positive.isName,
  positive.typeName,
  (v) => isNumber(v) && v > 0
);
export function assertIsNumberPositive(v: unknown) {
  if (!isNumberPositive(v)) throw createTypeError(isNumberPositive.typeName, v);
}
//#endregion
//#region> Neg
const negative = createNames(TYPES.NEGATIVE);
export const isNumberNegative = createGuard(
  negative.isName,
  negative.typeName,
  (v) => isNumber(v) && v < 0
);
export function assertIsNumberNeg(v: unknown) {
  if (!isNumberNegative(v)) throw createTypeError(isNumberNegative.typeName, v);
}
//#endregion
//#region> SafeInteger
const safeInt = createNames(TYPES.SAFE_INTEGER);
export const isNumberSafeInteger = createGuard(
  safeInt.isName,
  safeInt.typeName,
  (v) => isNumber(v) && Number.isSafeInteger(v)
);
export function assertIsNumberSafeInteger(v: unknown) {
  if (!isNumberSafeInteger(v))
    throw createTypeError(isNumberSafeInteger.typeName, v);
}
//#endregion
//#region> PosInteger
const positiveInt = createNames(TYPES.POSITIVE_INTEGER);
export const isNumberPositiveInteger = createGuard(
  positiveInt.isName,
  positiveInt.typeName,
  (v) => isNumberInteger(v) && v > 0
);
export function assertIsNumberPositiveInteger(v: unknown) {
  if (!isNumberPositiveInteger(v))
    throw createTypeError(isNumberPositiveInteger.typeName, v);
}
//#endregion
//#region> NegInteger
const negativeInt = createNames(TYPES.NEGATIVE_INTEGER);
export const isNumberNegativeInteger = createGuard(
  negativeInt.isName,
  negativeInt.typeName,
  (v) => isNumberInteger(v) && v < 0
);
export function assertIsNumberNegInteger(v: unknown) {
  if (!isNumberNegativeInteger(v))
    throw createTypeError(isNumberNegativeInteger.typeName, v);
}
//#endregion
//#region> Decimal
const decimal = createNames(TYPES.DECIMAL);
export const isNumberDecimal = createGuard(
  decimal.isName,
  decimal.typeName,
  (v) => isNumber(v) && !Number.isInteger(v)
);
export function assertIsNumberDecimal(v: unknown) {
  if (!isNumberDecimal(v)) throw createTypeError(isNumberDecimal.typeName, v);
}
//#endregion
//#region> String Number
export const { checkIsNumberString, isNumberString } = createIsGuards(
  TYPES.STR_NUM,
  (v): v is StringNumber =>
    typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))
);
export function assertIsNumberString(v: unknown) {
  if (!isNumberString(v)) throw createTypeError(isNumberString.typeName, v);
}
//#endregion

//#region> Ranges
const {
  eightBit,
  sixteenBit,
  thirtyTwoBit,
  twentyFourBit,
  byte,
  digit,
  unit,
  negativeDigit,
  positiveDigit
} = NUMS.INTERVALS;

//#region> Digits
const [digitMin, digitMax] = digit;
export const { checkIsNumberInDigitRange, isNumberInDigitRange } =
  createIsGuards(
    TYPES.IN_DIGIT,
    (v): v is Digit => isNumber(v) && v >= digitMin && v <= digitMax
  );
export function assertIsNumberInDigitRange(v: unknown) {
  if (!isNumberInDigitRange(v))
    throw createNumRangeError(isNumberInDigitRange.typeName, v, {
      max: digitMax,
      min: digitMin,
      inclusive: true
    });
}
const [positiveDigitMin, positiveDigitMax] = positiveDigit;
export const {
  checkIsNumberInPositiveDigitRange,
  isNumberInPositiveDigitRange
} = createIsGuards(
  TYPES.IN_POS_DIGIT,
  (v): v is PositiveDigit =>
    isNumber(v) && v >= positiveDigitMin && v <= positiveDigitMax
);
export function assertIsNumberInPositiveDigitRange(v: unknown) {
  if (!isNumberInPositiveDigitRange(v))
    throw createNumRangeError(isNumberInPositiveDigitRange.typeName, v, {
      max: digitMax,
      min: 1,
      inclusive: true
    });
}
const [negativeDigitMin, negativeDigitMax] = negativeDigit;
export const {
  checkIsNumberInNegativeDigitRange,
  isNumberInNegativeDigitRange
} = createIsGuards(
  TYPES.IN_NEG_DIGIT,
  (v): v is NegativeDigit =>
    isNumber(v) && v >= negativeDigitMin && v <= negativeDigitMax
);
export function assertIsNumberInNegativeDigitRange(v: unknown) {
  if (!isNumberInNegativeDigitRange(v))
    throw createNumRangeError(isNumberInNegativeDigitRange.typeName, v, {
      max: -1,
      min: digitMin,
      inclusive: true
    });
}
//#endregion

//#region> Bits

//#region> Eight
const [eightBitMin, eightBitMax] = eightBit;
const eightBitRange = createNames(TYPES.IN_EIGHT_BIT);
export const isNumberInEightBitRange = createGuard(
  eightBitRange.isName,
  eightBitRange.typeName,
  (v) => isNumber(v) && v >= eightBitMin && v <= eightBitMax
);
export function assertIsNumberInEightBitRange(v: unknown) {
  if (!isNumberInEightBitRange(v))
    throw createNumRangeError(isNumberInEightBitRange.typeName, v, {
      inclusive: true,
      max: eightBitMax,
      min: eightBitMin
    });
}
//#endregion
//#region> Sixteen
const [sixteenBitMin, sixteenBitMax] = sixteenBit;
const sixteenBitRange = createNames(TYPES.IN_SIXTEEN_BIT);
export const isNumberInSixteenBitRange = createGuard(
  sixteenBitRange.isName,
  sixteenBitRange.typeName,
  (v) => isNumber(v) && v >= sixteenBitMin && v <= sixteenBitMax
);

export function assertIsNumberInSixteenBitRange(v: unknown) {
  if (!isNumberInSixteenBitRange(v))
    throw createNumRangeError(isNumberInSixteenBitRange.typeName, v, {
      max: sixteenBitMax,
      min: sixteenBitMin,
      inclusive: true
    });
}
//#endregion
//#region> TwentyFour
const [twentyFourBitMin, twentyFourBitMax] = twentyFourBit;
const twentyFourBitRange = createNames(TYPES.IN_TWENTY_FOUR_BIT);
export const isNumberInTwentyFourBitRange = createGuard(
  twentyFourBitRange.isName,
  twentyFourBitRange.typeName,
  (v) => isNumber(v) && v >= twentyFourBitMin && v <= twentyFourBitMax
);
export function assertIsNumberInTwentyFourBitRange(v: unknown) {
  if (!isNumberInTwentyFourBitRange(v))
    throw createNumRangeError(isNumberInTwentyFourBitRange.typeName, v, {
      inclusive: true,
      max: twentyFourBitMax,
      min: twentyFourBitMin
    });
}
//#endregion
//#region> ThirtyTwo
const [thirtyTwoBitMin, thirtyTwoBitMax] = thirtyTwoBit;
const thirtyTwoBitRange = createNames(TYPES.IN_THIRTY_TWO_BIT);
export const isNumberInThirtyTwoBitRange = createGuard(
  thirtyTwoBitRange.isName,
  thirtyTwoBitRange.typeName,
  (v) => isNumber(v) && v >= thirtyTwoBitMin && v <= thirtyTwoBitMax
);
export function assertIsNumberInThirtyTwoBitRange(v: unknown) {
  if (!isNumberInThirtyTwoBitRange(v))
    throw createNumRangeError(isNumberInThirtyTwoBitRange.typeName, v, {
      inclusive: true,
      max: thirtyTwoBitMax,
      min: thirtyTwoBitMin
    });
}
//#endregion
//#endregion

//#region> Byte
const [byteMin, byteMax] = byte;
const byteRange = createNames(TYPES.IN_BYTES);
export const isNumberInByteRange = createGuard(
  byteRange.isName,
  byteRange.typeName,
  (v) => isNumber(v) && v >= byteMin && v <= byteMax
);
export function assertIsNumberInByteRange(v: unknown) {
  if (!isNumberInByteRange(v))
    throw createNumRangeError(isNumberInByteRange.typeName, v, {
      inclusive: true,
      max: byteMax,
      min: byteMin
    });
}
//#endregion
//#region> Unit Interval
const [unitMin, unitMax] = unit;
const unitIntervalRange = createNames(TYPES.IN_UNIT_INTERVAL);
export const isNumberInUnitIntervalRange = createGuard(
  unitIntervalRange.isName,
  unitIntervalRange.typeName,
  (v) => isNumber(v) && v >= unitMin && v <= unitMax
);
export function assertIsNumberInUnitIntervalRange(v: unknown) {
  if (!isNumberInUnitIntervalRange(v))
    throw createNumRangeError(isNumberInUnitIntervalRange.typeName, v, {
      inclusive: true,
      max: unitMax,
      min: unitMin
    });
}
//#endregion

//#endregion
