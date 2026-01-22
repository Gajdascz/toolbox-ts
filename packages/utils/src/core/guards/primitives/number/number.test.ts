import { type GuardSuiteConfig, runGuardSuites } from '@toolbox-ts/test-utils';
import { expectTypeOf } from 'vitest';

import {
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
} from './number.ts';

const ALWAYS_INVALID = ['string', null, undefined, {}, []];
const COMMONLY_INVALID = [...ALWAYS_INVALID, Infinity, -Infinity, Number.NaN];

const createEntry = (
  is: (v: unknown) => boolean,
  assert: (v: unknown) => void,
  validValues: any[],
  invalidValues: unknown[],
  err: typeof Error = TypeError
): GuardSuiteConfig<any> =>
  ({
    is,
    assert,
    check: is,
    expectType: expectTypeOf<never>().toEqualTypeOf<never>(),
    assertType: expectTypeOf<never>().toEqualTypeOf<never>(),
    validValues,
    invalidValues,
    error: err
  }) as GuardSuiteConfig<any>;

runGuardSuites(
  createEntry(
    isNumberFinite,
    assertIsNumberFinite,
    [0, 1, -1, 42, -42, 3.14],
    COMMONLY_INVALID
  ),
  createEntry(
    isNumberInfinite,
    assertIsNumberInfinite,
    [Infinity, -Infinity],
    [...ALWAYS_INVALID, 0, 1, -1, 42, Number.NaN]
  ),
  createEntry(
    isNumberDecimal,
    assertIsNumberDecimal,
    [3.14, -3.14, 0.5, -0.5, 1.1],
    [...COMMONLY_INVALID, 0, 1, -1, 42]
  ),
  createEntry(
    isNumberInteger,
    assertIsNumberInteger,
    [0, 1, -1, 42, -42, 100],
    [...COMMONLY_INVALID, 3.14, -3.14, 0.5]
  ),
  createEntry(
    isNumberSafeInteger,
    assertIsNumberSafeInteger,
    [0, 1, -1, 42, -42, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
    [
      ...COMMONLY_INVALID,
      3.14,
      Number.MAX_SAFE_INTEGER + 1,
      Number.MIN_SAFE_INTEGER - 1
    ]
  ),
  createEntry(
    isNumberPositive,
    assertIsNumberPositive,
    [1, 42, 3.14, 0.1, Infinity],
    [...ALWAYS_INVALID, 0, -1, -42, -3.14, -Infinity, Number.NaN]
  ),
  createEntry(
    isNumberPositiveInteger,
    assertIsNumberPositiveInteger,
    [1, 42, 100, 1000],
    [...COMMONLY_INVALID, 0, -1, -42, 3.14, 0.5]
  ),
  createEntry(
    isNumberNegative,
    assertIsNumberNeg,
    [-1, -42, -3.14, -0.1, -Infinity],
    [...ALWAYS_INVALID, 0, 1, 42, 3.14, Infinity, Number.NaN]
  ),
  createEntry(
    isNumberNegativeInteger,
    assertIsNumberNegInteger,
    [-1, -42, -100, -1000],
    [...COMMONLY_INVALID, 0, 1, 42, -3.14, -0.5]
  ),
  createEntry(
    isNumberNaN,
    assertIsNumberNaN,
    [Number.NaN, Number.NaN],
    [...ALWAYS_INVALID, 0, 1, -1, Infinity, -Infinity]
  ),
  createEntry(
    isNumberNotNaN,
    assertIsNumberNotNaN,
    [0, 1, -1, 42, Infinity, -Infinity, 3.14],
    [...ALWAYS_INVALID, Number.NaN, Number.NaN]
  ),
  createEntry(
    isNumberInByteRange,
    assertIsNumberInByteRange,
    [0, 127, 255, 100, 50],
    [...COMMONLY_INVALID, -1, 256, 300, -100],
    RangeError
  ),
  createEntry(
    isNumberInEightBitRange,
    assertIsNumberInEightBitRange,
    [0, 127, 50],
    [...COMMONLY_INVALID, -129, 128, 200, -200],
    RangeError
  ),
  createEntry(
    isNumberInSixteenBitRange,
    assertIsNumberInSixteenBitRange,
    [0, 32_767, 1000],
    [...COMMONLY_INVALID, -32_769, 32_768, 40_000, -40_000],
    RangeError
  ),
  createEntry(
    isNumberInTwentyFourBitRange,
    assertIsNumberInTwentyFourBitRange,
    [0, 8_388_607, 1_000_000],
    [...COMMONLY_INVALID, -8_388_609, 8_388_608, 10_000_000, -10_000_000],
    RangeError
  ),
  createEntry(
    isNumberInThirtyTwoBitRange,
    assertIsNumberInThirtyTwoBitRange,
    [0, 2_147_483_647, 1_000_000],
    [
      ...COMMONLY_INVALID,
      -2_147_483_649,
      2_147_483_648,
      3_000_000_000,
      -3_000_000_000
    ],
    RangeError
  ),
  createEntry(
    isNumberInDigitRange,
    assertIsNumberInDigitRange,
    [0, 1, 5, 9, -9, -5, -1],
    [...COMMONLY_INVALID, 10, -10, 15, -15],
    RangeError
  ),
  createEntry(
    isNumberInPositiveDigitRange,
    assertIsNumberInPositiveDigitRange,
    [1, 5, 9],
    [...COMMONLY_INVALID, -1, 10, 15, -5],
    RangeError
  ),
  createEntry(
    isNumberInNegativeDigitRange,
    assertIsNumberInNegativeDigitRange,
    [-9, -5, -1, 0],
    [...COMMONLY_INVALID, 1, 10, -10, -15],
    RangeError
  ),
  createEntry(
    isNumberInUnitIntervalRange,
    assertIsNumberInUnitIntervalRange,
    [0, 0.5, 1, 0.25, 0.75],
    [...COMMONLY_INVALID, -0.1, 1.1, 2, -1],
    RangeError
  ),
  createEntry(
    isNumberString,
    assertIsNumberString,
    ['0', '123', '-456', '3.14', '-3.14', '1e10'],
    [null, undefined, {}, [], 123, 'abc', 'NaN', '']
  )
);
