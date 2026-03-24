import type { Frozen, Key, StringRecord, ValuePathToObject } from '@toolbox-ts/types/defs/object';

import { isProxy } from 'node:util/types';

import { createTypeError } from '../../../utils/errors/index.js';
import { createGenericIsGuards, createIsGuards, createTypeNames } from '../../factories.js';

const {
  Any,
  Empty,
  Extensible,
  Frozen: Frzn,
  Iterable,
  NotEmpty,
  PrototypeKey,
  Proxy: Prxy,
  Sealed,
  WithEntry,
  WithKeys,
  WithValues,
  NotPlain,
  _
} = createTypeNames('Object', [
  'Any',
  'Sealed',
  'Iterable',
  'NotPlain',
  'PrototypeKey',
  'Empty',
  'NotEmpty',
  'Proxy',
  'Frozen',
  'Extensible',
  'Proxy',
  'WithKeys',
  'WithValues',
  'WithEntry'
]);
//#region> Any
const _any = createIsGuards(
  Any,
  (v, allowNull: boolean = false): v is object =>
    (typeof v === 'object' || typeof v === 'function') && (allowNull || v !== null)
);

/**
 * Checks if a value is of any `object` type (including functions), with an option to allow `null`.
 * - Excludes null by default, but can be included by setting `allowNull` to `true`.
 */
export const isObjectAny = _any.is;
/**
 * Checks if a value is of any `object` type (including functions), with an option to allow `null`.
 * - Excludes null by default, but can be included by setting `allowNull` to `true`.
 */
export const checkIsObjectAny = _any.check;
/**
 * Asserts if a value is of any `object` type (including functions), with an option to allow `null`.
 * - Excludes null by default, but can be included by setting `allowNull` to `true`.
 */
export function assertIsObjectAny(v: unknown, allowNull: boolean = false): asserts v is object {
  if (!isObjectAny(v, allowNull)) throw createTypeError(isObjectAny.typeName, v);
}
//#endregion
//#region> Object
const _obj = createGenericIsGuards(_, <T>(v: T): v is StringRecord & T => {
  if (typeof v !== 'object' || v === null) return false;
  const proto: unknown = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
});
//
export const isObject = _obj.is;
export const checkIsObject = _obj.check;
export function assertIsObject<T>(v: T): asserts v is StringRecord & T {
  if (!isObject(v)) throw createTypeError(isObject.typeName, v);
}
//#endregion
//#region> NonPlainObject
const _notPlain = createGenericIsGuards(
  NotPlain,
  <T>(v: T): v is T & object => isObjectAny(v) && !isObject(v)
);
//
export const isObjectNotPlain = _notPlain.is;
export const checkIsObjectNotPlain = _notPlain.check;
export function assertIsObjectNotPlain<T>(v: T): asserts v is T & object {
  if (!isObjectNotPlain(v)) throw createTypeError(isObjectNotPlain.typeName, v);
}
//#endregion
//#region> Empty
const _empty = createIsGuards(
  Empty,
  (v: unknown): v is Record<string, never> => isObject(v) && Object.keys(v).length === 0
);
const _notEmpty = createGenericIsGuards(
  NotEmpty,
  <T>(v: T): v is { [key: string]: unknown } & T => isObject(v) && Object.keys(v).length > 0
);
//
export const isObjectEmpty = _empty.is;
export const checkIsObjectEmpty = _empty.check;
export function assertIsObjectEmpty(v: unknown): asserts v is Record<string, never> {
  if (!isObjectEmpty(v)) throw createTypeError(isObjectEmpty.typeName, v);
}

export const isNotObjectEmpty = _notEmpty.is;
export const checkIsNotObjectEmpty = _notEmpty.check;
export function assertIsNotObjectEmpty<T>(v: T): asserts v is StringRecord & T {
  if (!isNotObjectEmpty(v)) throw createTypeError(isNotObjectEmpty.typeName, v);
}
//#endregion
//#region> WithKeys
const _withKeys = createGenericIsGuards(
  WithKeys,
  <K extends string, T = object>(v: T, keys: readonly K[]): v is { [Y in K]: unknown } & T => {
    if (!isObject(v)) return false;
    return Object.keys(v).length >= keys.length && keys.every((key) => key in v);
  }
);
//
export const isObjectWithKeys = _withKeys.is;
export const checkIsObjectWithKeys = _withKeys.check;
export function assertIsObjectWithKeys<K extends string, T = object>(
  v: T,
  keys: readonly K[]
): asserts v is { [Y in K]: unknown } & T {
  if (!isObjectWithKeys(v, keys))
    throw createTypeError(
      isObjectWithKeys.typeName,
      v,
      `\n Expected keys: [${keys.join(', ')}]\n${isObject(v) ? ` |-> Received keys: [${Object.keys(v).join(', ')}` : ''}]`
    );
}
//#endregion
//#region> WithValues
const _withValues = createGenericIsGuards(
  WithValues,
  <T>(v: unknown, valueGuard: (value: unknown) => value is T): v is StringRecord<T> => {
    if (!isObject(v)) return false;
    const objKeys = Object.keys(v);
    return (
      objKeys.length > 0 &&
      Object.keys(v).every((key) => valueGuard((v as Record<string, unknown>)[key]))
    );
  }
);
//
export const isObjectWithValues = _withValues.is;
export const checkIsObjectWithValues = _withValues.check;
export function assertIsObjectWithValues<T>(
  v: unknown,
  valueGuard: (value: unknown) => value is T,
  expectedTypeName?: string
): asserts v is Record<string, T> {
  if (!checkIsObjectWithValues(v, valueGuard))
    throw createTypeError(
      isObjectWithValues.typeName,
      v,
      expectedTypeName ? `\n  Expected values of type: ${expectedTypeName}` : undefined
    );
}
//#endregion

//#region> WithEntry
const withEntry = createGenericIsGuards(
  WithEntry,
  <K extends string, V = unknown, T = object>(
    obj: unknown,
    key: K,
    valueGuard?: (value: unknown) => value is V
  ): obj is ValuePathToObject<K, V> & T => {
    const keys = key.split('.') as K[];
    let current: unknown = obj;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (!isObjectAny(current) || !(k in current)) return false;
      current = (current as Record<string, unknown>)[k];
    }
    return valueGuard ? valueGuard(current) : current !== undefined;
  }
);
//
export const isObjectWithEntry = withEntry.is;
export const checkIsObjectWithEntry = withEntry.check;
export const assertIsObjectWithEntry = <K extends string, V = unknown, T = object>(
  v: unknown,
  key: K,
  valueGuard?: (value: unknown) => value is T
): asserts v is ValuePathToObject<K, V> & T => {
  if (!isObjectWithEntry(v, key, valueGuard))
    throw createTypeError(isObjectWithEntry.typeName, v, `With valid entry at key: ${String(key)}`);
};
//#endregion
//#region> Proxy
const _proxy = createGenericIsGuards(
  Prxy,
  <T extends object = object>(v: T): v is InstanceType<typeof Proxy> & T => isProxy(v)
);
//
export const isObjectProxy = _proxy.is;
export const checkIsObjectProxy = _proxy.check;
export function assertIsObjectProxy<T extends object = object>(
  v: T
): asserts v is InstanceType<typeof Proxy> & T {
  if (!isObjectProxy(v)) throw createTypeError(isObjectProxy.typeName, v);
}
//#endregion
//#region> Iterable
const _iterable = createIsGuards(
  Iterable,
  <T = unknown>(v: unknown): v is Iterable<T> =>
    isObjectAny(v) && typeof (v as Record<symbol, unknown>)[Symbol.iterator] === 'function'
);
//
export const isObjectIterable = _iterable.is;
export const checkIsObjectIterable = _iterable.check;
export function assertIsObjectIterable<T = unknown>(v: unknown): asserts v is Iterable<T> {
  if (!isObjectIterable(v)) throw createTypeError(isObjectIterable.typeName, v);
}
//#endregion
//#region> PrototypeKey
const _protoKey = createIsGuards(
  PrototypeKey,
  (v): v is Key.Prototype => v === '__proto__' || v === 'constructor' || v === 'prototype'
);
//
export const isObjectPrototypeKey = _protoKey.is;
export const checkIsObjectPrototypeKey = _protoKey.check;
export function assertIsObjectPrototypeKey(v: unknown): asserts v is Key.Prototype {
  if (!isObjectPrototypeKey(v)) throw createTypeError(isObjectPrototypeKey.typeName, v);
}
//#endregion
//#region> Frozen
const _frzn = createGenericIsGuards(Frzn, <T>(v: T): v is Frozen<T> => Object.isFrozen(v));
//
export const isObjectFrozen = _frzn.is;
export const checkIsObjectFrozen = _frzn.check;
export function assertIsObjectFrozen<T>(v: T): asserts v is Frozen<T> {
  if (!isObjectFrozen(v)) throw createTypeError(isObjectFrozen.typeName, v);
}
//#endregion
//#region> Extensible
const _extensible = createGenericIsGuards(Extensible, <T>(v: T): v is object & T =>
  Object.isExtensible(v)
);
//
export const isObjectExtensible = _extensible.is;
export const checkIsObjectExtensible = _extensible.check;
export function assertIsObjectExtensible<T>(v: T): asserts v is object & T {
  if (!isObjectExtensible(v)) throw createTypeError(isObjectExtensible.typeName, v);
}
//#endregion
//#region> Sealed
const _sealed = createGenericIsGuards(Sealed, <T>(v: T): v is object & T => Object.isSealed(v));
//
export const isObjectSealed = _sealed.is;
export const checkIsObjectSealed = _sealed.check;
export function assertIsObjectSealed<T>(v: T): asserts v is object & T {
  if (!isObjectSealed(v)) throw createTypeError(isObjectSealed.typeName, v);
}
//#endregion
