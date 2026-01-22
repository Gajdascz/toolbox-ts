import type {
  Falsy,
  Nullish,
  PrimitiveType,
  Truthy
} from '@toolbox-ts/types/general';

import { PRIMITIVES, PRIMITIVES_ARR } from '../../constants/index.js';
import { createTypeError } from '../../utils/errors/index.js';
import {
  createGuard,
  createIsAndIsNotGuards,
  createIsGuards,
  createNames
} from '../factories.js';
const {
  bigint,
  boolean,
  number,
  string,
  symbol,
  undefined: undef
} = PRIMITIVES;

const TYPES = {
  BIGINT: 'BigInt',
  BOOLEAN: 'Boolean',
  NUMBER: 'Number',
  STRING: 'String',
  SYMBOL: 'Symbol',
  UNDEFINED: 'Undefined',
  NULL: 'Null',
  FALSY: 'Falsy',
  TRUTHY: 'Truthy',
  PRIMITIVE: 'Primitive',
  NULLISH: 'Nullish'
} as const;
//#region> isBigint
export const { checkIsBigInt, isBigInt } = createIsGuards(
  TYPES.BIGINT,
  (v): v is bigint => typeof v === bigint
);
export function assertIsBigInt(v: unknown): asserts v is bigint {
  if (!isBigInt(v)) throw createTypeError(isBigInt.typeName, v);
}
//#endregion
//#region> isBoolean
export const { checkIsBoolean, isBoolean } = createIsGuards(
  TYPES.BOOLEAN,
  (v): v is boolean => typeof v === boolean
);
export function assertIsBoolean(v: unknown): asserts v is boolean {
  if (!isBoolean(v)) throw createTypeError(isBoolean.typeName, v);
}
//#endregion
//#region> isNumber
export const { checkIsNumber, isNumber } = createIsGuards(
  TYPES.NUMBER,
  (v): v is number => typeof v === number
);
export function assertIsNumber(v: unknown): asserts v is number {
  if (!isNumber(v)) throw createTypeError(isNumber.typeName, v);
}
//#endregion
//#region> isString
export const { checkIsString, isString } = createIsGuards(
  TYPES.STRING,
  (v): v is string => typeof v === string
);
export function assertIsString(v: unknown): asserts v is string {
  if (!isString(v)) throw createTypeError(isString.typeName, v);
}
//#endregion
//#region> isSymbol
export const { checkIsSymbol, isSymbol } = createIsGuards(
  TYPES.SYMBOL,
  (v): v is symbol => typeof v === symbol
);
export function assertIsSymbol(v: unknown): asserts v is symbol {
  if (!isSymbol(v)) throw createTypeError(isSymbol.typeName, v);
}
//#endregion
//#region> isFalsy
export const { checkIsFalsy, isFalsy } = createIsGuards(
  TYPES.FALSY,
  (v): v is Falsy => !v
);
export function assertIsFalsy(v: unknown): asserts v is Falsy {
  if (!isFalsy(v)) throw createTypeError(isFalsy.typeName, v);
}
//#endregion
//#region> isTruthy
const truthy = createNames(TYPES.TRUTHY);
export const isTruthy = createGuard(
  truthy.isName,
  truthy.typeName,
  <V>(v: unknown): v is Truthy<V> => !!v
);
export const checkIsTruthy = createGuard(
  truthy.checkIsName,
  truthy.typeName,
  (v: unknown) => !!v
);
export function assertIsTruthy<V = unknown>(
  v: unknown
): asserts v is Truthy<V> {
  if (!isTruthy(v)) throw createTypeError(isTruthy.typeName, v);
}
//#endregion
//#region> isPrimitive
/**
 * Checks if a value is a primitive (string, number, boolean, bigint, symbol, null, or undefined).
 * - Functions and Objects are omitted from this guard.
 */
export const { checkIsPrimitive, isPrimitive } = createIsGuards(
  TYPES.PRIMITIVE,
  (v): v is PrimitiveType => v == null || PRIMITIVES_ARR.includes(typeof v)
);
export function assertIsPrimitive<V>(
  v: PrimitiveType | V
): asserts v is PrimitiveType {
  if (!isPrimitive(v)) throw createTypeError(isPrimitive.typeName, v);
}
//#endregion

//#region> is/isNotUndefined
export const {
  checkIsUndefined,
  isUndefined,
  checkIsNotUndefined,
  isNotUndefined
} = createIsAndIsNotGuards(
  TYPES.UNDEFINED,
  (v): v is undefined => typeof v === undef
);
export function assertIsNotUndefined<T>(
  v: T | undefined
): asserts v is Exclude<T, undefined> {
  if (isUndefined(v)) throw createTypeError(isNotUndefined.typeName, v);
}
export function assertIsUndefined(v: unknown): asserts v is undefined {
  if (!isUndefined(v)) throw createTypeError(isUndefined.typeName, v);
}
//#endregion
//#region> is/isNotNull
export const { checkIsNull, isNull, checkIsNotNull, isNotNull } =
  createIsAndIsNotGuards(TYPES.NULL, (v): v is null => v === null);
export function assertIsNotNull<T>(v: null | T): asserts v is Exclude<T, null> {
  if (isNull(v)) throw createTypeError(isNotNull.typeName, v);
}
export function assertIsNull(v: unknown): asserts v is null {
  if (!isNull(v)) throw createTypeError(isNotNull.typeName, v);
}

//#endregion
//#region> is/isNotNullish
export const { checkIsNullish, isNullish, checkIsNotNullish, isNotNullish } =
  createIsAndIsNotGuards(TYPES.NULLISH, (v): v is Nullish => v == null);
export function assertIsNotNullish<T>(
  v: Nullish | T
): asserts v is Exclude<T, Nullish> {
  if (isNullish(v)) throw createTypeError(isNotNullish.typeName, v);
}
export function assertIsNullish(v: unknown): asserts v is Nullish {
  if (!isNullish(v)) throw createTypeError(isNullish.typeName, v);
}
//#endregion
