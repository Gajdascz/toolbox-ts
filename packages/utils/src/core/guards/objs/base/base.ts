import type {
  Constructor,
  InferValueFromGuard
} from '@toolbox-ts/types/defs/function';
import type { Frozen, Key } from '@toolbox-ts/types/defs/object';

import { isProxy } from 'node:util/types';

import { createTypeError } from '../../../utils/errors/index.js';
import { createGuard, createIsGuards, createNames } from '../../factories.js';

const TYPES = {
  OBJ: 'Object',
  PLAIN: 'ObjectPlain',
  SEALED: 'ObjectSealed',
  WITH_CONSTRUCTOR: 'ObjectWithConstructor',
  ITERABLE: 'ObjectIterable',
  PROTOTYPE_KEY: 'ObjectPrototypeKey',
  EMPTY: 'ObjectEmpty',
  NOT_EMPTY: 'ObjectNotEmpty',
  PROXY: 'ObjectProxy',
  FROZEN: 'ObjectFrozen',
  EXTENSIBLE: 'ObjectExtensible',
  PROTO_KEY: 'ObjectPrototypeKey',
  WITH_PROP_KEY: 'ObjectWithPropertyKey',
  WITH_KEYS: 'ObjectWithKeys',
  WITH_VALUES: 'ObjectWithValues',
  WITH_ENTRY: 'ObjectWithEntry',
  WITH_ENTRIES: 'ObjectWithEntries'
} as const;

//#region> Object
export const { isObject, checkIsObject } = createIsGuards(
  TYPES.OBJ,
  (v): v is object => typeof v === 'object' && v !== null
);
export function assertIsObject(v: unknown): asserts v is object {
  if (!isObject(v)) throw createTypeError(isObject.typeName, v);
}
//#endregion
//#region> Plain
const plain = createNames(TYPES.PLAIN);
export const isObjectPlain = createGuard(
  plain.isName,
  plain.typeName,
  <T, K extends PropertyKey = string>(v: T): v is Record<K, unknown> & T => {
    if (!isObject(v)) return false;
    const proto: unknown = Object.getPrototypeOf(v);
    return proto === Object.prototype || proto === null;
  }
);
export const checkIsObjectPlain = createGuard(
  plain.checkIsName,
  plain.typeName,
  isObjectPlain as (v: unknown) => boolean
);
export function assertIsObjectPlain<T, K extends PropertyKey = string>(
  v: T
): asserts v is Record<K, unknown> & T {
  if (!isObjectPlain(v)) throw createTypeError(isObjectPlain.typeName, v);
}
//#endregion
//#region> WithConstructor
const withCstr = createNames(TYPES.WITH_CONSTRUCTOR);
export const isObjectWithConstructor = createGuard(
  withCstr.isName,
  withCstr.typeName,
  <T, I = unknown>(v: T): v is { constructor: Constructor<I> } & T =>
    isObject(v) && 'constructor' in v && typeof v.constructor === 'function'
);
export const checkIsObjectWithConstructor = createGuard(
  withCstr.checkIsName,
  withCstr.typeName,
  isObjectWithConstructor as (v: unknown) => boolean
);
export function assertIsObjectWithConstructor<T>(
  v: T
): asserts v is { constructor: Constructor } & T {
  if (!isObjectWithConstructor(v))
    throw createTypeError(isObjectWithConstructor.typeName, v);
}
//#endregion
//#region> Iterable
export const { checkIsObjectIterable, isObjectIterable } = createIsGuards(
  'ObjectIterable',
  <T = unknown>(v: unknown): v is Iterable<T> =>
    isObject(v)
    && Symbol.iterator in v
    && typeof v[Symbol.iterator] === 'function'
);

export function assertIsObjectIterable<T = unknown>(
  v: unknown
): asserts v is Iterable<T> {
  if (!isObjectIterable(v)) throw createTypeError(isObjectIterable.typeName, v);
}
//#endregion
//#region> PrototypeKey
export const { checkIsObjectPrototypeKey, isObjectPrototypeKey } =
  createIsGuards(
    TYPES.PROTO_KEY,
    (v): v is Key.Prototype =>
      v === '__proto__' || v === 'constructor' || v === 'prototype'
  );
export function assertIsObjectPrototypeKey(
  v: unknown
): asserts v is Key.Prototype {
  if (!isObjectPrototypeKey(v))
    throw createTypeError(isObjectPrototypeKey.typeName, v);
}
//#endregion
//#region> Empty
export const { checkIsObjectEmpty, isObjectEmpty } = createIsGuards(
  TYPES.EMPTY,
  (v): v is Record<string, never> => isObject(v) && Object.keys(v).length === 0
);

const notEmpty = createNames(TYPES.NOT_EMPTY);
export const isNotObjectEmpty = createGuard(
  notEmpty.isName,
  notEmpty.typeName,
  <T>(v: T): v is { [key: string]: unknown } & T =>
    isObject(v) && Object.keys(v).length > 0
);
export const checkIsNotObjectEmpty = createGuard(
  notEmpty.checkIsName,
  notEmpty.typeName,
  isNotObjectEmpty as (v: unknown) => boolean
);
export function assertIsNotObjectEmpty<T>(
  v: T
): asserts v is { [key: string]: unknown } & T {
  if (!isNotObjectEmpty(v)) throw createTypeError(isNotObjectEmpty.typeName, v);
}
export function assertIsObjectEmpty(
  v: unknown
): asserts v is Record<string, never> {
  if (!isObjectEmpty(v)) throw createTypeError(isObjectEmpty.typeName, v);
}
//#endregion
//#region> Proxy
const proxy = createNames(TYPES.PROXY);
export const isObjectProxy = createGuard(
  proxy.isName,
  proxy.typeName,
  isProxy as <T extends object = object>(
    v: T
  ) => v is InstanceType<typeof Proxy> & T
);
export const checkIsObjectProxy = createGuard(
  proxy.checkIsName,
  proxy.typeName,
  isObjectProxy as (v: unknown) => boolean
);
export function assertIsObjectProxy<T extends object = object>(
  v: T
): asserts v is InstanceType<typeof Proxy> & T {
  if (!isObjectProxy(v)) throw createTypeError(isObjectProxy.typeName, v);
}
//#endregion
//#region> Frozen
const frozen = createNames(TYPES.FROZEN);
export const isObjectFrozen = createGuard(
  frozen.isName,
  frozen.typeName,
  Object.isFrozen as <T>(v: T) => v is Frozen<T>
);
export const checkIsObjectFrozen = createGuard(
  frozen.checkIsName,
  frozen.typeName,
  isObjectFrozen as (v: unknown) => boolean
);
export function assertIsObjectFrozen<T>(v: T): asserts v is Frozen<T> {
  if (!isObjectFrozen(v)) throw createTypeError(isObjectFrozen.typeName, v);
}
//#endregion
//#region> Extensible
const extensible = createNames(TYPES.EXTENSIBLE);
export const isObjectExtensible = createGuard(
  extensible.isName,
  extensible.typeName,
  Object.isExtensible as <T>(v: T) => v is object & T
);
export const checkIsObjectExtensible = createGuard(
  extensible.checkIsName,
  extensible.typeName,
  isObjectExtensible as (v: unknown) => boolean
);
export function assertIsObjectExtensible<T>(v: T): asserts v is object & T {
  if (!isObjectExtensible(v))
    throw createTypeError(isObjectExtensible.typeName, v);
}
//#endregion
//#region> Sealed
const sealed = createNames(TYPES.SEALED);
export const isObjectSealed = createGuard(
  sealed.isName,
  sealed.typeName,
  Object.isSealed as <T>(v: T) => v is object & T
);
export const checkIsObjectSealed = createGuard(
  sealed.checkIsName,
  sealed.typeName,
  isObjectSealed as (v: unknown) => boolean
);
export function assertIsObjectSealed<T>(v: T): asserts v is object & T {
  if (!isObjectSealed(v)) throw createTypeError(isObjectSealed.typeName, v);
}
//#endregion
//#region> ObjectWithPropertyKey
const withPropKey = createNames(TYPES.WITH_PROP_KEY);
export const isObjectWithPropertyKey = createGuard(
  withPropKey.isName,
  withPropKey.typeName,
  <K extends PropertyKey, T = object>(
    v: T,
    prop: K
  ): v is { [Y in K]: unknown } & T => isObject(v) && prop in v
);
export const checkIsObjectWithPropertyKey = createGuard(
  withPropKey.checkIsName,
  withPropKey.typeName,
  isObjectWithPropertyKey as (v: unknown, prop: PropertyKey) => boolean
);
export function assertIsObjectWithPropertyKey<
  K extends PropertyKey,
  T = object
>(v: T, prop: K): asserts v is { [Y in K]: unknown } & T {
  if (!isObjectWithPropertyKey(v, prop))
    throw createTypeError(isObjectWithPropertyKey.typeName, v);
}
//#endregion
//#region> ObjectWithKeys
const withKeys = createNames(TYPES.WITH_KEYS);
export const isObjectWithKeys = createGuard(
  withKeys.isName,
  withKeys.typeName,
  <K extends string, T = object>(
    v: T,
    keys: readonly K[]
  ): v is { [Y in K]: unknown } & T =>
    isObject(v)
    && Object.keys(v).length >= keys.length
    && keys.every((key) => key in v)
);
export const checkIsObjectWithKeys = createGuard(
  withKeys.checkIsName,
  withKeys.typeName,
  isObjectWithKeys as (v: unknown, keys: readonly string[]) => boolean
);
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
//#region> ObjectWithValues
const withValues = createNames(TYPES.WITH_VALUES);
export const isObjectWithValues = createGuard(
  withValues.isName,
  withValues.typeName,
  <T>(
    v: unknown,
    valueGuard: (value: unknown) => value is T
  ): v is Record<string, T> => {
    if (!isObject(v)) return false;
    const objKeys = Object.keys(v);
    return (
      objKeys.length > 0
      && Object.keys(v).every((key) =>
        valueGuard((v as Record<string, unknown>)[key])
      )
    );
  }
);
export const checkIsObjectWithValues = createGuard(
  withValues.checkIsName,
  withValues.typeName,
  isObjectWithValues as unknown as (
    v: unknown,
    valueGuard: (value: unknown) => boolean
  ) => boolean
);
export function assertIsObjectWithValues<T>(
  v: unknown,
  valueGuard: (value: unknown) => value is T,
  expectedTypeName?: string
): asserts v is Record<string, T> {
  if (!checkIsObjectWithValues(v, valueGuard))
    throw createTypeError(
      isObjectWithValues.typeName,
      v,
      expectedTypeName ?
        `\n  Expected values of type: ${expectedTypeName}`
      : undefined
    );
}
//#endregion
//#region> ObjectWithEntry
const withEntry = createNames(TYPES.WITH_ENTRY);
export const isObjectWithEntry = createGuard(
  withEntry.isName,
  withEntry.typeName,
  <K extends PropertyKey, V = unknown, T = object>(
    v: unknown,
    key: K,
    valueGuard: (value: unknown) => value is V
  ): v is { [Y in K]: V } & object & T =>
    isObjectWithPropertyKey(v, key) && valueGuard(v[key])
);
export const checkIsObjectWithEntry = createGuard(
  withEntry.checkIsName,
  withEntry.typeName,
  isObjectWithEntry as unknown as (
    v: unknown,
    key: PropertyKey,
    valueGuard: (value: unknown) => boolean
  ) => boolean
);
export const assertIsObjectWithEntry = <K extends PropertyKey, T = unknown>(
  v: unknown,
  key: K,
  valueGuard: (value: unknown) => value is T
): asserts v is { [Y in K]: T } & object => {
  if (!isObjectWithEntry(v, key, valueGuard))
    throw createTypeError(
      isObjectWithEntry.typeName,
      v,
      `With valid entry at key: ${String(key)}`
    );
};
//#endregion
//#region> ObjectWithEntries
const withEntries = createNames(TYPES.WITH_ENTRIES);
export const isObjectWithEntries = createGuard(
  withEntries.isName,
  withEntries.typeName,
  <T extends Record<string, (v: unknown) => unknown>>(
    v: unknown,
    entries: T
  ): v is { [K in keyof T]: InferValueFromGuard<T[K]> } =>
    isObject(v)
    && Object.keys(entries).every(
      (key) => key in v && entries[key]((v as Record<string, unknown>)[key])
    )
);

export const checkIsObjectWithEntries = createGuard(
  withEntries.checkIsName,
  withEntries.typeName,
  isObjectWithEntries as unknown as (
    v: unknown,
    entries: Record<string, (v: unknown) => boolean>
  ) => boolean
);
export function assertIsObjectWithEntries<
  T extends Record<string, (v: unknown) => unknown>
>(
  v: unknown,
  entries: T
): asserts v is { [K in keyof T]: InferValueFromGuard<T[K]> } {
  if (!isObjectWithEntries(v, entries))
    throw createTypeError(
      isObjectWithEntries.typeName,
      v,
      `valid entries at keys: ${Object.keys(entries).join(', ')}`
    );
}
//#endregion
