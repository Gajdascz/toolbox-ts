import type { Falsy, Nullish, PrimitiveType, Truthy } from '@toolbox-ts/types';

import { runGuardSuites } from '@toolbox-ts/test-utils';
import { expectTypeOf } from 'vitest';

import {
  assertIsBigInt,
  assertIsBoolean,
  assertIsFalsy,
  assertIsNotNull,
  assertIsNotNullish,
  assertIsNotUndefined,
  assertIsNull,
  assertIsNullish,
  assertIsNumber,
  assertIsPrimitive,
  assertIsString,
  assertIsSymbol,
  assertIsTruthy,
  assertIsUndefined,
  checkIsBigInt,
  checkIsBoolean,
  checkIsFalsy,
  checkIsNotNull,
  checkIsNotNullish,
  checkIsNotUndefined,
  checkIsNull,
  checkIsNullish,
  checkIsNumber,
  checkIsPrimitive,
  checkIsString,
  checkIsSymbol,
  checkIsTruthy,
  checkIsUndefined,
  isBigInt,
  isBoolean,
  isFalsy,
  isNotNull,
  isNotNullish,
  isNotUndefined,
  isNull,
  isNullish,
  isNumber,
  isPrimitive,
  isString,
  isSymbol,
  isTruthy,
  isUndefined
} from './base.ts';

const NON_PRIMITIVES: object[] = [[], {}, new Date(), () => {}];
const BIGINTS: bigint[] = [42n, 0n, -1n];
const NULLISH: Nullish[] = [null, undefined];
const BOOLS: boolean[] = [true, false];
const STRINGS: string[] = ['true', 'false', 'test'];
const NUMS: number[] = [
  0,
  1,
  42,
  Number.NaN,
  Number.MAX_VALUE,
  Number.MIN_VALUE,
  Number.MAX_SAFE_INTEGER,
  Number.MIN_SAFE_INTEGER
];
const SYMBOLS: symbol[] = [Symbol('test'), Symbol.iterator];
const FALSY: Falsy[] = [0, '', false, null, undefined, '', 0n];
const TRUTHY: Truthy<any> = [
  1,
  'test',
  true,
  42,
  ...NON_PRIMITIVES,
  ...SYMBOLS,
  1n
];
const PRIMITIVES: PrimitiveType[] = [
  ...BIGINTS,
  ...BOOLS,
  ...STRINGS,
  ...NUMS,
  ...SYMBOLS,
  ...NULLISH
];

type Thousand = 1000;
type Yes = 'yes';
runGuardSuites(
  //#region> Bigint
  {
    is: isBigInt,
    check: checkIsBigInt,
    assert: assertIsBigInt,
    expectType: expectTypeOf(isBigInt).guards.toBeBigInt(),
    assertType: expectTypeOf(assertIsBigInt).asserts.toBeBigInt(),
    invalidValues: [...NUMS, ...STRINGS, ...NON_PRIMITIVES, ...NULLISH],
    validValues: BIGINTS
  },
  //#endregion
  //#region> Boolean
  {
    is: isBoolean,
    assert: assertIsBoolean,
    check: checkIsBoolean,
    expectType: expectTypeOf(isBoolean).guards.toBeBoolean(),
    assertType: expectTypeOf(assertIsBoolean).asserts.toBeBoolean(),
    validValues: BOOLS,
    invalidValues: [...NUMS, ...STRINGS, ...NON_PRIMITIVES, ...NULLISH]
  },
  //#endregion
  //#region> Number
  {
    is: isNumber,
    assert: assertIsNumber,
    check: checkIsNumber,
    expectType: expectTypeOf(isNumber).guards.toBeNumber(),
    assertType: expectTypeOf(assertIsNumber).asserts.toBeNumber(),
    validValues: NUMS,
    invalidValues: [
      ...BIGINTS,
      ...BOOLS,
      ...STRINGS,
      ...SYMBOLS,
      ...NON_PRIMITIVES,
      ...NULLISH
    ]
  },
  //#endregion
  //#region> String
  {
    is: isString,
    assert: assertIsString,
    check: checkIsString,
    expectType: expectTypeOf(isString).guards.toBeString(),
    assertType: expectTypeOf(assertIsString).asserts.toBeString(),
    validValues: STRINGS,
    invalidValues: [
      ...BIGINTS,
      ...BOOLS,
      ...NUMS,
      ...SYMBOLS,
      ...NON_PRIMITIVES,
      ...NULLISH
    ]
  },
  //#endregion
  //#region> Symbol
  {
    is: isSymbol,
    check: checkIsSymbol,
    assert: assertIsSymbol,
    expectType: expectTypeOf(isSymbol).guards.toBeSymbol(),
    assertType: expectTypeOf(assertIsSymbol).asserts.toBeSymbol(),
    validValues: SYMBOLS,
    invalidValues: [
      ...BIGINTS,
      ...BOOLS,
      ...NUMS,
      ...STRINGS,
      ...NON_PRIMITIVES,
      ...NULLISH
    ]
  },
  //#endregion
  //#region> Null
  {
    is: isNull,
    assert: assertIsNull,
    check: checkIsNull,
    expectType: expectTypeOf(isNull).guards.toBeNull(),
    assertType: expectTypeOf(assertIsNull).asserts.toBeNull(),
    validValues: [null],
    invalidValues: [
      ...BIGINTS,
      ...BOOLS,
      ...NUMS,
      ...STRINGS,
      ...SYMBOLS,
      ...NON_PRIMITIVES,
      undefined
    ]
  },
  {
    is: isNotNull,
    assert: assertIsNotNull,
    check: checkIsNotNull,
    expectType:
      expectTypeOf(isNotNull).guards.toEqualTypeOf<Exclude<unknown, null>>(),
    assertType: expectTypeOf(
      assertIsNotNull<null | Yes>
    ).asserts.toEqualTypeOf<Yes>(),
    validValues: [
      ...BIGINTS,
      ...BOOLS,
      ...NUMS,
      ...STRINGS,
      ...SYMBOLS,
      ...NON_PRIMITIVES,
      undefined
    ],
    invalidValues: [null]
  },
  //#endregion
  //#region> Undefined
  {
    is: isUndefined,
    assert: assertIsUndefined,
    check: checkIsUndefined,
    expectType: expectTypeOf(isUndefined).guards.toBeUndefined(),
    assertType: expectTypeOf(assertIsUndefined).asserts.toBeUndefined(),
    validValues: [undefined],
    invalidValues: [
      ...BIGINTS,
      ...BOOLS,
      ...NUMS,
      ...STRINGS,
      ...SYMBOLS,
      ...NON_PRIMITIVES,
      null
    ]
  },
  {
    is: isNotUndefined,
    assert: assertIsNotUndefined,
    check: checkIsNotUndefined,
    expectType:
      expectTypeOf(isNotUndefined).guards.toEqualTypeOf<
        Exclude<unknown, undefined>
      >(),
    assertType: expectTypeOf(
      assertIsNotUndefined<Thousand | undefined>
    ).asserts.toEqualTypeOf<Thousand>(),
    validValues: [...BIGINTS, ...BOOLS, ...NUMS],
    invalidValues: [undefined]
  },
  //#endregion
  //#region> Nullish
  {
    is: isNullish,
    assert: assertIsNullish,
    check: checkIsNullish,
    expectType: expectTypeOf(isNullish).guards.toEqualTypeOf<Nullish>(),
    assertType: expectTypeOf(assertIsNullish).asserts.toEqualTypeOf<Nullish>(),
    validValues: NULLISH,
    invalidValues: [
      ...BIGINTS,
      ...BOOLS,
      ...NUMS,
      ...STRINGS,
      ...SYMBOLS,
      ...NON_PRIMITIVES
    ]
  },
  {
    is: isNotNullish,
    assert: assertIsNotNullish,
    check: checkIsNotNullish,
    expectType:
      expectTypeOf(isNotNullish).guards.toEqualTypeOf<
        Exclude<unknown, Nullish>
      >(),
    assertType: expectTypeOf(
      assertIsNotNullish<Nullish | Yes>
    ).asserts.toEqualTypeOf<Yes>(),
    validValues: [
      ...BIGINTS,
      ...BOOLS,
      ...NUMS,
      ...STRINGS,
      ...SYMBOLS,
      ...NON_PRIMITIVES
    ],
    invalidValues: NULLISH
  },
  //#endregion
  //#region> Primitive
  {
    is: isPrimitive,
    assert: assertIsPrimitive,
    check: checkIsPrimitive,
    expectType: expectTypeOf(isPrimitive).guards.toEqualTypeOf<PrimitiveType>(),
    assertType:
      expectTypeOf(assertIsPrimitive).asserts.toEqualTypeOf<PrimitiveType>(),

    validValues: PRIMITIVES,
    invalidValues: NON_PRIMITIVES
  },
  //#endregion
  //#region> Falsy
  {
    is: isFalsy,
    assert: assertIsFalsy,
    check: checkIsFalsy,
    expectType: expectTypeOf(isFalsy).guards.toEqualTypeOf<Falsy>(),
    assertType: expectTypeOf(assertIsFalsy).asserts.toEqualTypeOf<Falsy>(),
    validValues: FALSY,
    invalidValues: TRUTHY
  },
  //#endregion
  //#region> Truthy
  {
    typeName: isTruthy.typeName,
    is: isTruthy,
    assert: assertIsTruthy,
    check: checkIsTruthy,
    validValues: TRUTHY,
    invalidValues: FALSY,
    expectType: expectTypeOf(isTruthy).guards.toEqualTypeOf<Truthy<unknown>>(),
    assertType: expectTypeOf(
      assertIsTruthy<Thousand>
    ).asserts.toEqualTypeOf<Thousand>()
  }
  //#endregion
);
