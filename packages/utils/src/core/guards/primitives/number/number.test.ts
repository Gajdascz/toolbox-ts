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
  checkIsNumberDecimal,
  checkIsNumberFinite,
  checkIsNumberInByteRange,
  checkIsNumberInDigitRange,
  checkIsNumberInEightBitRange,
  checkIsNumberInfinite,
  checkIsNumberInNegativeDigitRange,
  checkIsNumberInPositiveDigitRange,
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
    checkIsNumberFinite,
    assertIsNumberFinite,
    [0, 1, -1, 42, -42, 3.14],
    COMMONLY_INVALID
  ),
  createEntry(
    checkIsNumberInfinite,
    assertIsNumberInfinite,
    [Infinity, -Infinity],
    [...ALWAYS_INVALID, 0, 1, -1, 42, Number.NaN]
  ),
  createEntry(
    checkIsNumberDecimal,
    assertIsNumberDecimal,
    [3.14, -3.14, 0.5, -0.5, 1.1],
    [...COMMONLY_INVALID, 0, 1, -1, 42]
  ),
  createEntry(
    checkIsNumberInteger,
    assertIsNumberInteger,
    [0, 1, -1, 42, -42, 100],
    [...COMMONLY_INVALID, 3.14, -3.14, 0.5]
  ),
  createEntry(
    checkIsNumberSafeInteger,
    assertIsNumberSafeInteger,
    [0, 1, -1, 42, -42, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
    [...COMMONLY_INVALID, 3.14, Number.MAX_SAFE_INTEGER + 1, Number.MIN_SAFE_INTEGER - 1]
  ),
  createEntry(
    checkIsNumberPositive,
    assertIsNumberPositive,
    [1, 42, 3.14, 0.1, Infinity],
    [...ALWAYS_INVALID, 0, -1, -42, -3.14, -Infinity, Number.NaN]
  ),
  createEntry(
    checkIsNumberPositiveInteger,
    assertIsNumberPositiveInteger,
    [1, 42, 100, 1000],
    [...COMMONLY_INVALID, 0, -1, -42, 3.14, 0.5]
  ),
  createEntry(
    checkIsNumberNegative,
    assertIsNumberNeg,
    [-1, -42, -3.14, -0.1, -Infinity],
    [...ALWAYS_INVALID, 0, 1, 42, 3.14, Infinity, Number.NaN]
  ),
  createEntry(
    checkIsNumberNegativeInteger,
    assertIsNumberNegInteger,
    [-1, -42, -100, -1000],
    [...COMMONLY_INVALID, 0, 1, 42, -3.14, -0.5]
  ),
  createEntry(
    checkIsNumberNaN,
    assertIsNumberNaN,
    [Number.NaN, Number.NaN],
    [...ALWAYS_INVALID, 0, 1, -1, Infinity, -Infinity]
  ),
  createEntry(
    checkIsNumberNotNaN,
    assertIsNumberNotNaN,
    [0, 1, -1, 42, Infinity, -Infinity, 3.14],
    [...ALWAYS_INVALID, Number.NaN, Number.NaN]
  ),
  createEntry(
    checkIsNumberInByteRange,
    assertIsNumberInByteRange,
    [0, 127, 255, 100, 50],
    [...COMMONLY_INVALID, -1, 256, 300, -100],
    RangeError
  ),
  createEntry(
    checkIsNumberInEightBitRange,
    assertIsNumberInEightBitRange,
    [0, 127, 50],
    [...COMMONLY_INVALID, -129, 128, 200, -200],
    RangeError
  ),
  createEntry(
    checkIsNumberInSixteenBitRange,
    assertIsNumberInSixteenBitRange,
    [0, 32_767, 1000],
    [...COMMONLY_INVALID, -32_769, 32_768, 40_000, -40_000],
    RangeError
  ),
  createEntry(
    checkIsNumberInTwentyFourBitRange,
    assertIsNumberInTwentyFourBitRange,
    [0, 8_388_607, 1_000_000],
    [...COMMONLY_INVALID, -8_388_609, 8_388_608, 10_000_000, -10_000_000],
    RangeError
  ),
  createEntry(
    checkIsNumberInThirtyTwoBitRange,
    assertIsNumberInThirtyTwoBitRange,
    [0, 2_147_483_647, 1_000_000],
    [...COMMONLY_INVALID, -2_147_483_649, 2_147_483_648, 3_000_000_000, -3_000_000_000],
    RangeError
  ),
  createEntry(
    checkIsNumberInDigitRange,
    assertIsNumberInDigitRange,
    [0, 1, 5, 9, -9, -5, -1],
    [...COMMONLY_INVALID, 10, -10, 15, -15],
    RangeError
  ),
  createEntry(
    checkIsNumberInPositiveDigitRange,
    assertIsNumberInPositiveDigitRange,
    [1, 5, 9],
    [...COMMONLY_INVALID, -1, 10, 15, -5],
    RangeError
  ),
  createEntry(
    checkIsNumberInNegativeDigitRange,
    assertIsNumberInNegativeDigitRange,
    [-9, -5, -1, 0],
    [...COMMONLY_INVALID, 1, 10, -10, -15],
    RangeError
  ),
  createEntry(
    checkIsNumberInUnitIntervalRange,
    assertIsNumberInUnitIntervalRange,
    [0, 0.5, 1, 0.25, 0.75],
    [...COMMONLY_INVALID, -0.1, 1.1, 2, -1],
    RangeError
  ),
  createEntry(
    checkIsNumberString,
    assertIsNumberString,
    ['0', '123', '-456', '3.14', '-3.14', '1e10'],
    [null, undefined, {}, [], 123, 'abc', 'NaN', '']
  )
);
