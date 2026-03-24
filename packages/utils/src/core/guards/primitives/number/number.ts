import type {
  Digit,
  NegativeDigit,
  PositiveDigit,
  StringNumber
} from '@toolbox-ts/types/defs/number';

import { NUMS } from '../../../constants/index.js';
import { createNumRangeError, createTypeError } from '../../../utils/errors/index.js';
import { createCheckGuard, createIsGuards, createTypeNames } from '../../factories.js';
import { isNumber } from '../../base/index.js';
export { assertIsNumber, checkIsNumber, isNumber } from '../../base/index.js';

const {
  Decimal,
  Finite,
  InByteRange,
  InDigitRange,
  InEightBitRange,
  InNegativeDigitRange,
  InPositiveDigitRange,
  InSixteenBitRange,
  InThirtyTwoBitRange,
  InTwentyFourBitRange,
  InUnitIntervalRange,
  Infinite: Inf,
  Integer,
  NaN: _NaN,
  Negative,
  NegativeInteger,
  NotNaN,
  Positive,
  PositiveInteger,
  SafeInteger,
  String: StrNum
} = createTypeNames('Number', [
  'NaN',
  'NotNaN',
  'Integer',
  'Finite',
  'Infinite',
  'Positive',
  'Negative',
  'SafeInteger',
  'PositiveInteger',
  'NegativeInteger',
  'Decimal',
  'String',

  'InDigitRange',
  'InPositiveDigitRange',
  'InNegativeDigitRange',
  'InEightBitRange',
  'InSixteenBitRange',
  'InTwentyFourBitRange',
  'InThirtyTwoBitRange',
  'InByteRange',
  'InUnitIntervalRange'
]);
//#region> NaN
export const checkIsNumberNaN = createCheckGuard(_NaN, (v) => isNumber(v) && Number.isNaN(v));
export const checkIsNumberNotNaN = createCheckGuard(NotNaN, (v) => isNumber(v) && !Number.isNaN(v));
export function assertIsNumberNaN(v: unknown) {
  if (!checkIsNumberNaN(v)) throw createTypeError(checkIsNumberNaN.typeName, v);
}
export function assertIsNumberNotNaN(v: unknown) {
  if (!isNumber(v) || Number.isNaN(v)) throw createTypeError(checkIsNumberNotNaN.typeName, v);
}
//#endregion
//#region> Integer
export const checkIsNumberInteger = createCheckGuard(
  Integer,
  (v) => isNumber(v) && Number.isInteger(v)
);
export function assertIsNumberInteger(v: unknown) {
  if (!checkIsNumberInteger(v)) throw createTypeError(checkIsNumberInteger.typeName, v);
}
//#endregion
//#region> Finite
export const checkIsNumberFinite = createCheckGuard(
  Finite,
  (v: unknown) => isNumber(v) && Number.isFinite(v)
);
export function assertIsNumberFinite(v: unknown) {
  if (!checkIsNumberFinite(v)) throw createTypeError(checkIsNumberFinite.typeName, v);
}
//#endregion
//#region> Infinite
export const checkIsNumberInfinite = createCheckGuard(
  Inf,
  (v) => isNumber(v) && !Number.isFinite(v)
);
export function assertIsNumberInfinite(v: unknown) {
  if (!checkIsNumberInfinite(v)) throw createTypeError(checkIsNumberInfinite.typeName, v);
}
//#endregion
//#region> Positive
export const checkIsNumberPositive = createCheckGuard(Positive, (v) => isNumber(v) && v > 0);
export function assertIsNumberPositive(v: unknown) {
  if (!checkIsNumberPositive(v)) throw createTypeError(checkIsNumberPositive.typeName, v);
}
//#endregion
//#region> Neg
export const checkIsNumberNegative = createCheckGuard(Negative, (v) => isNumber(v) && v < 0);
export function assertIsNumberNeg(v: unknown) {
  if (!checkIsNumberNegative(v)) throw createTypeError(checkIsNumberNegative.typeName, v);
}
//#endregion
//#region> SafeInteger
export const checkIsNumberSafeInteger = createCheckGuard(
  SafeInteger,
  (v) => isNumber(v) && Number.isSafeInteger(v)
);
export function assertIsNumberSafeInteger(v: unknown) {
  if (!checkIsNumberSafeInteger(v)) throw createTypeError(checkIsNumberSafeInteger.typeName, v);
}
//#endregion
//#region> PositiveInteger
export const checkIsNumberPositiveInteger = createCheckGuard(
  PositiveInteger,
  (v) => checkIsNumberInteger(v) && (v as number) > 0
);
export function assertIsNumberPositiveInteger(v: unknown) {
  if (!checkIsNumberPositiveInteger(v))
    throw createTypeError(checkIsNumberPositiveInteger.typeName, v);
}
//#endregion
//#region> NegativeInteger
export const checkIsNumberNegativeInteger = createCheckGuard(
  NegativeInteger,
  (v) => checkIsNumberInteger(v) && (v as number) < 0
);
export function assertIsNumberNegInteger(v: unknown) {
  if (!checkIsNumberNegativeInteger(v))
    throw createTypeError(checkIsNumberNegativeInteger.typeName, v);
}
//#endregion
//#region> Decimal
export const checkIsNumberDecimal = createCheckGuard(
  Decimal,
  (v) => isNumber(v) && !Number.isInteger(v)
);
export function assertIsNumberDecimal(v: unknown) {
  if (!checkIsNumberDecimal(v)) throw createTypeError(checkIsNumberDecimal.typeName, v);
}
//#endregion
//#region> String Number
const _strNum = createIsGuards(
  StrNum,
  (v): v is StringNumber => typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))
);
export const isNumberString = _strNum.is;
export const checkIsNumberString = _strNum.check;
export function assertIsNumberString(v: unknown) {
  if (!isNumberString(v)) throw createTypeError(checkIsNumberString.typeName, v);
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
const _digitRange = createIsGuards(
  InDigitRange,
  (v): v is Digit => isNumber(v) && v >= digitMin && v <= digitMax
);
export const isNumberInDigitRange = _digitRange.is;
export const checkIsNumberInDigitRange = _digitRange.check;
export function assertIsNumberInDigitRange(v: unknown) {
  if (!checkIsNumberInDigitRange(v))
    throw createNumRangeError(isNumberInDigitRange.typeName, v, {
      max: digitMax,
      min: digitMin,
      inclusive: true
    });
}
const [positiveDigitMin, positiveDigitMax] = positiveDigit;
const _positiveDigitRange = createIsGuards(
  InPositiveDigitRange,
  (v): v is PositiveDigit => isNumber(v) && v >= positiveDigitMin && v <= positiveDigitMax
);
export const isNumberInPositiveDigitRange = _positiveDigitRange.is;
export const checkIsNumberInPositiveDigitRange = _positiveDigitRange.check;
export function assertIsNumberInPositiveDigitRange(v: unknown) {
  if (!checkIsNumberInPositiveDigitRange(v))
    throw createNumRangeError(isNumberInPositiveDigitRange.typeName, v, {
      max: digitMax,
      min: 1,
      inclusive: true
    });
}
const [negativeDigitMin, negativeDigitMax] = negativeDigit;
const _negativeDigitRange = createIsGuards(
  InNegativeDigitRange,
  (v): v is NegativeDigit => isNumber(v) && v >= negativeDigitMin && v <= negativeDigitMax
);
export const isNumberInNegativeDigitRange = _negativeDigitRange.is;
export const checkIsNumberInNegativeDigitRange = _negativeDigitRange.check;
export function assertIsNumberInNegativeDigitRange(v: unknown) {
  if (!checkIsNumberInNegativeDigitRange(v))
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
export const checkIsNumberInEightBitRange = createCheckGuard(
  InEightBitRange,
  (v) => isNumber(v) && v >= eightBitMin && v <= eightBitMax
);
export function assertIsNumberInEightBitRange(v: unknown) {
  if (!checkIsNumberInEightBitRange(v))
    throw createNumRangeError(checkIsNumberInEightBitRange.typeName, v, {
      inclusive: true,
      max: eightBitMax,
      min: eightBitMin
    });
}
//#endregion
//#region> Sixteen
const [sixteenBitMin, sixteenBitMax] = sixteenBit;
export const checkIsNumberInSixteenBitRange = createCheckGuard(
  InSixteenBitRange,
  (v) => isNumber(v) && v >= sixteenBitMin && v <= sixteenBitMax
);

export function assertIsNumberInSixteenBitRange(v: unknown) {
  if (!checkIsNumberInSixteenBitRange(v))
    throw createNumRangeError(checkIsNumberInSixteenBitRange.typeName, v, {
      max: sixteenBitMax,
      min: sixteenBitMin,
      inclusive: true
    });
}
//#endregion
//#region> TwentyFour
const [twentyFourBitMin, twentyFourBitMax] = twentyFourBit;
export const checkIsNumberInTwentyFourBitRange = createCheckGuard(
  InTwentyFourBitRange,
  (v) => isNumber(v) && v >= twentyFourBitMin && v <= twentyFourBitMax
);
export function assertIsNumberInTwentyFourBitRange(v: unknown) {
  if (!checkIsNumberInTwentyFourBitRange(v))
    throw createNumRangeError(checkIsNumberInTwentyFourBitRange.typeName, v, {
      inclusive: true,
      max: twentyFourBitMax,
      min: twentyFourBitMin
    });
}
//#endregion
//#region> ThirtyTwo
const [thirtyTwoBitMin, thirtyTwoBitMax] = thirtyTwoBit;
export const checkIsNumberInThirtyTwoBitRange = createCheckGuard(
  InThirtyTwoBitRange,
  (v) => isNumber(v) && v >= thirtyTwoBitMin && v <= thirtyTwoBitMax
);
export function assertIsNumberInThirtyTwoBitRange(v: unknown) {
  if (!checkIsNumberInThirtyTwoBitRange(v))
    throw createNumRangeError(checkIsNumberInThirtyTwoBitRange.typeName, v, {
      inclusive: true,
      max: thirtyTwoBitMax,
      min: thirtyTwoBitMin
    });
}
//#endregion
//#endregion

//#region> Byte
const [byteMin, byteMax] = byte;
export const checkIsNumberInByteRange = createCheckGuard(
  InByteRange,
  (v) => isNumber(v) && v >= byteMin && v <= byteMax
);
export function assertIsNumberInByteRange(v: unknown) {
  if (!checkIsNumberInByteRange(v))
    throw createNumRangeError(checkIsNumberInByteRange.typeName, v, {
      inclusive: true,
      max: byteMax,
      min: byteMin
    });
}
//#endregion
//#region> Unit Interval
const [unitMin, unitMax] = unit;
export const checkIsNumberInUnitIntervalRange = createCheckGuard(
  InUnitIntervalRange,
  (v) => isNumber(v) && v >= unitMin && v <= unitMax
);
export function assertIsNumberInUnitIntervalRange(v: unknown) {
  if (!checkIsNumberInUnitIntervalRange(v))
    throw createNumRangeError(checkIsNumberInUnitIntervalRange.typeName, v, {
      inclusive: true,
      max: unitMax,
      min: unitMin
    });
}
//#endregion

//#endregion
