import type {
  DefinedPrimitive,
  Falsy,
  Nullish,
  PrimitiveType,
  Truthy
} from '@toolbox-ts/types/general';

import { PRIMITIVES, PRIMITIVES_ARR } from '../../constants/index.js';
import { createTypeError } from '../../utils/errors/index.js';
import { createGenericIsGuards, createIsAndIsNotGuards, createIsGuards } from '../factories.js';
const { bigint, boolean, number, string, symbol, undefined: undef } = PRIMITIVES;

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
  DEFINED_PRIMITIVE: 'DefinedPrimitive',
  NULLISH: 'Nullish'
} as const;

//#region> BigInt
const bigInt = createIsGuards(TYPES.BIGINT, (v): v is bigint => typeof v === bigint);
//
export const isBigInt = bigInt.is;
export const checkIsBigInt = bigInt.check;
export function assertIsBigInt(v: unknown): asserts v is bigint {
  if (!isBigInt(v)) throw createTypeError(isBigInt.typeName, v);
}
//#endregion
//#region> Boolean
const bool = createIsGuards(TYPES.BOOLEAN, (v): v is boolean => typeof v === boolean);
//
export const isBoolean = bool.is;
export const checkIsBoolean = bool.check;
export function assertIsBoolean(v: unknown): asserts v is boolean {
  if (!isBoolean(v)) throw createTypeError(isBoolean.typeName, v);
}
//#endregion
//#region> Number
const num = createIsGuards(TYPES.NUMBER, (v): v is number => typeof v === number);
//
export const isNumber = num.is;
export const checkIsNumber = num.check;
export function assertIsNumber(v: unknown): asserts v is number {
  if (!isNumber(v)) throw createTypeError(isNumber.typeName, v);
}
//#endregion
//#region> String
const str = createIsGuards(TYPES.STRING, (v): v is string => typeof v === string);
//
export const isString = str.is;
export const checkIsString = str.check;
export function assertIsString(v: unknown): asserts v is string {
  if (!isString(v)) throw createTypeError(isString.typeName, v);
}
//#endregion
//#region> Symbol
const sym = createIsGuards(TYPES.SYMBOL, (v): v is symbol => typeof v === symbol);
//
export const isSymbol = sym.is;
export const checkIsSymbol = sym.check;
export function assertIsSymbol(v: unknown): asserts v is symbol {
  if (!isSymbol(v)) throw createTypeError(isSymbol.typeName, v);
}
//#endregion
//#region> Falsy
const falsy = createIsGuards(TYPES.FALSY, (v): v is Falsy => !v);
//
export const isFalsy = falsy.is;
export const checkIsFalsy = falsy.check;
export function assertIsFalsy(v: unknown): asserts v is Falsy {
  if (!isFalsy(v)) throw createTypeError(isFalsy.typeName, v);
}
//#endregion
//#region> Truthy
const truthy = createGenericIsGuards(TYPES.TRUTHY, <V>(v: unknown): v is Truthy<V> => !!v);
export const isTruthy = truthy.is;
export const checkIsTruthy = truthy.check;
export function assertIsTruthy<V>(v: unknown): asserts v is Truthy<V> {
  if (!isTruthy(v)) throw createTypeError(isTruthy.typeName, v);
}
//#endregion
//#region> Primitive
const prim = createIsGuards(
  TYPES.PRIMITIVE,
  (v): v is PrimitiveType => v == null || PRIMITIVES_ARR.includes(typeof v)
);
//
export const isPrimitive = prim.is;
export const checkIsPrimitive = prim.check;
export function assertIsPrimitive(v: unknown): asserts v is PrimitiveType {
  if (!isPrimitive(v)) throw createTypeError(isPrimitive.typeName, v);
}
//#endregion
//#region> DefinedPrimitive
const definedPrimitive = createIsGuards(
  TYPES.DEFINED_PRIMITIVE,
  (v): v is DefinedPrimitive => isPrimitive(v) && v !== undefined
);
export const isDefinedPrimitive = definedPrimitive.is;
export const checkIsDefinedPrimitive = definedPrimitive.check;
export function assertIsDefinedPrimitive(v: unknown): asserts v is DefinedPrimitive {
  if (!isDefinedPrimitive(v)) throw createTypeError(isDefinedPrimitive.typeName, v);
}
//#endregion
//#region> Undefined
const und = createIsAndIsNotGuards(TYPES.UNDEFINED, (v): v is undefined => typeof v === undef);
//
export const isUndefined = und.is;
export const isNotUndefined = und.not;
export const checkIsUndefined = und.check;
export const checkIsNotUndefined = und.checkNot;
export function assertIsUndefined(v: unknown): asserts v is undefined {
  if (!isUndefined(v)) throw createTypeError(isUndefined.typeName, v);
}
export function assertIsNotUndefined<V>(v: V): asserts v is Exclude<V, undefined> {
  if (isUndefined(v)) throw createTypeError(isNotUndefined.typeName, v);
}
//#endregion
//#region> Nullish
const nullish = createIsAndIsNotGuards(TYPES.NULLISH, (v): v is Nullish => v == null);
//
export const isNullish = nullish.is;
export const isNotNullish = nullish.not;
export const checkIsNullish = nullish.check;
export const checkIsNotNullish = nullish.checkNot;
export function assertIsNullish(v: unknown): asserts v is Nullish {
  if (!isNullish(v)) throw createTypeError(isNullish.typeName, v);
}
export function assertIsNotNullish<V>(v: V): asserts v is Exclude<V, Nullish> {
  if (isNullish(v)) throw createTypeError(isNotNullish.typeName, v);
}
//#endregion
//#region> Null
const nil = createIsAndIsNotGuards(TYPES.NULL, (v): v is null => v === null);
//
export const isNull = nil.is;
export const isNotNull = nil.not;
export const checkIsNull = nil.check;
export const checkIsNotNull = nil.checkNot;
export function assertIsNull(v: unknown): asserts v is null {
  if (!isNull(v)) throw createTypeError(isNull.typeName, v);
}
export function assertIsNotNull<V>(v: V): asserts v is Exclude<V, null> {
  if (isNull(v)) throw createTypeError(isNotNull.typeName, v);
}
//#endregion
