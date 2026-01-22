/* c8 ignore start */
import type { Frozen } from '@toolbox-ts/types/defs/object';

import {
  assertIsNotObjectEmpty,
  assertIsObject,
  assertIsObjectEmpty,
  assertIsObjectExtensible,
  assertIsObjectFrozen,
  assertIsObjectIterable,
  assertIsObjectPlain,
  assertIsObjectPrototypeKey,
  assertIsObjectProxy,
  assertIsObjectSealed,
  assertIsObjectWithConstructor,
  assertIsObjectWithEntries,
  assertIsObjectWithEntry,
  assertIsObjectWithKeys,
  assertIsObjectWithPropertyKey,
  assertIsObjectWithValues,
  checkIsNotObjectEmpty,
  checkIsObject,
  checkIsObjectEmpty,
  checkIsObjectExtensible,
  checkIsObjectFrozen,
  checkIsObjectIterable,
  checkIsObjectPlain,
  checkIsObjectPrototypeKey,
  checkIsObjectProxy,
  checkIsObjectSealed,
  checkIsObjectWithConstructor,
  checkIsObjectWithEntries,
  checkIsObjectWithEntry,
  checkIsObjectWithKeys,
  checkIsObjectWithPropertyKey,
  checkIsObjectWithValues,
  isNotObjectEmpty,
  isObject,
  isObjectEmpty,
  isObjectExtensible,
  isObjectFrozen,
  isObjectIterable,
  isObjectPlain,
  isObjectPrototypeKey,
  isObjectProxy,
  isObjectSealed,
  isObjectWithConstructor,
  isObjectWithEntries,
  isObjectWithEntry,
  isObjectWithKeys,
  isObjectWithPropertyKey,
  isObjectWithValues
} from '../../../core/guards/objs/base/index.js';
import {
  assertIsMapWithEntries,
  assertIsMapWithKeys,
  assertIsMapWithValues,
  checkIsMapWithEntries,
  checkIsMapWithKeys,
  checkIsMapWithValues,
  isMapWithEntries,
  isMapWithKeys,
  isMapWithValues
} from '../../../core/guards/objs/map/index.js';
import {
  assertIsSetOf,
  checkIsSetOf,
  isSetOf
} from '../../../core/guards/objs/set/index.js';
export const is = {
  /** @narrows `T & Record\<string, unknown\>` */
  notEmpty: isNotObjectEmpty,
  /** @narrows `object` */
  value: isObject,
  /** @narrows `Record\<string, never\>` */
  empty: isObjectEmpty,
  /** @narrows `Iterable<T>` */
  iterable: isObjectIterable,
  /** @narrows `'__proto__' | 'constructor' | 'prototype'` */
  prototypeKey: isObjectPrototypeKey,
  /** @narrows `T & InstanceType\<typeof Proxy\>` */
  proxy: isObjectProxy,
  /** @narrows `T & Record\<keyof typeof validators, unknown\>` */
  withEntries: isObjectWithEntries,
  /** @narrows `T & \{ [K in Keys]: unknown \}` */
  withKeys: isObjectWithKeys,
  /** @narrows `Record\<string, V\>` */
  withValues: isObjectWithValues,
  /** @narrows `T & \{ [K]: unknown \}` */
  withPropertyKey: isObjectWithPropertyKey,
  /** @narrows `T & object` */
  extensible: isObjectExtensible,
  /** @narrows {@link Frozen} */
  frozen: isObjectFrozen,
  /** @narrows `T & object` */
  sealed: isObjectSealed,
  /** @narrows `T & Record\<K, unknown\>` */
  plain: isObjectPlain,
  /** @narrows `T & \{ constructor: {@link Constructor} \}` */
  withConstructor: isObjectWithConstructor,
  /** @narrows `T & \{ [Key in K]: V \} & object` */
  withEntry: isObjectWithEntry,
  /** @narrows `Map\<K, V\>` */
  mapWithEntries: isMapWithEntries,
  /** @narrows `Map\<K, unknown\>` */
  mapWithKeys: isMapWithKeys,
  /** @narrows `Map\<unknown, V\>` */
  mapWithValues: isMapWithValues,
  /** @narrows `Set<T>` */
  setOf: isSetOf
} as const;
export const assert = {
  /** @asserts `T & Record\<string, unknown\>` */
  notEmpty: assertIsNotObjectEmpty,
  /** @asserts `object` */
  value: assertIsObject,
  /** @asserts `Record\<string, never\>` */
  empty: assertIsObjectEmpty,
  /** @asserts `Iterable<T>` */
  iterable: assertIsObjectIterable,
  /** @asserts `'__proto__' | 'constructor' | 'prototype'` */
  prototypeKey: assertIsObjectPrototypeKey,
  /** @asserts `T & InstanceType\<typeof Proxy\>` */
  proxy: assertIsObjectProxy,
  /** @asserts `T & Record\<keyof typeof validators, unknown\>` */
  withEntries: assertIsObjectWithEntries,
  /** @asserts `T & \{ [K in Keys]: unknown \}` */
  withKeys: assertIsObjectWithKeys,
  /** @asserts `Record\<string, V\>` */
  withValues: assertIsObjectWithValues,
  /** @asserts `T & \{ [K]: unknown \}` */
  withPropertyKey: assertIsObjectWithPropertyKey,
  /** @asserts `T & object` */
  extensible: assertIsObjectExtensible,
  /** @asserts {@link Frozen} */
  frozen: assertIsObjectFrozen,
  /** @asserts `T & object` */
  sealed: assertIsObjectSealed,
  /** @asserts `T & Record\<K, unknown\>` */
  plain: assertIsObjectPlain,
  /** @asserts `T & \{ constructor: {@link Constructor} \}` */
  withConstructor: assertIsObjectWithConstructor,
  /** @asserts `T & \{ [Key in K]: V \} & object` */
  withEntry: assertIsObjectWithEntry,
  /** @asserts `Map\<K, V\>` */
  mapWithEntries: assertIsMapWithEntries,
  /** @asserts `Map\<K, unknown\>` */
  mapWithKeys: assertIsMapWithKeys,
  /** @asserts `Map\<unknown, V\>` */
  mapWithValues: assertIsMapWithValues,
  /** @asserts `Set<T>` */
  setOf: assertIsSetOf
};
export const check = {
  /** @checks `T & Record\<string, unknown\>` */
  notEmpty: checkIsNotObjectEmpty,
  /** @checks `object` */
  value: checkIsObject,
  /** @checks `Record\<string, never\>` */
  empty: checkIsObjectEmpty,
  /** @checks `Iterable<T>` */
  iterable: checkIsObjectIterable,
  /** @checks `'__proto__' | 'constructor' | 'prototype'` */
  prototypeKey: checkIsObjectPrototypeKey,
  /** @checks `T & InstanceType\<typeof Proxy\>` */
  proxy: checkIsObjectProxy,
  /** @checks `T & Record\<keyof typeof validators, unknown\>` */
  withEntries: checkIsObjectWithEntries,
  /** @checks `T & \{ [K in Keys]: unknown \}` */
  withKeys: checkIsObjectWithKeys,
  /** @checks `Record\<string, V\>` */
  withValues: checkIsObjectWithValues,
  /** @checks `T & \{ [K]: unknown \}` */
  withPropertyKey: checkIsObjectWithPropertyKey,
  /** @checks `T & object` */
  extensible: checkIsObjectExtensible,
  /** @checks {@link Frozen} */
  frozen: checkIsObjectFrozen,
  /** @checks `T & object` */
  sealed: checkIsObjectSealed,
  /** @checks `T & Record\<K, unknown\>` */
  plain: checkIsObjectPlain,
  /** @checks `T & \{ constructor: {@link Constructor} \}` */
  withConstructor: checkIsObjectWithConstructor,
  /** @checks `T & \{ [Key in K]: V \} & object` */
  withEntry: checkIsObjectWithEntry,
  /** @checks `Map\<K, V\>` */
  mapWithEntries: checkIsMapWithEntries,
  /** @checks `Map\<K, unknown\>` */
  mapWithKeys: checkIsMapWithKeys,
  /** @checks `Map\<unknown, V\>` */
  mapWithValues: checkIsMapWithValues,
  /** @checks `Set<T>` */
  setOf: checkIsSetOf
} as const;
/* c8 ignore end */
