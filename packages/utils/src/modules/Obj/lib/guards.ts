// oxlint-disable no-unused-vars
import type { Frozen } from '@toolbox-ts/types/defs/object';

import {
  assertIsObject,
  checkIsObject,
  isObject,
  //
  assertIsObjectEmpty,
  checkIsObjectEmpty,
  isObjectEmpty,
  //
  assertIsNotObjectEmpty,
  checkIsNotObjectEmpty,
  isNotObjectEmpty,
  //
  assertIsObjectExtensible,
  checkIsObjectExtensible,
  isObjectExtensible,
  //
  assertIsObjectAny,
  checkIsObjectAny,
  isObjectAny,
  //
  assertIsObjectNotPlain,
  checkIsObjectNotPlain,
  isObjectNotPlain,
  //
  assertIsObjectFrozen,
  checkIsObjectFrozen,
  isObjectFrozen,
  //
  assertIsObjectIterable,
  checkIsObjectIterable,
  isObjectIterable,
  //
  assertIsObjectPrototypeKey,
  checkIsObjectPrototypeKey,
  isObjectPrototypeKey,
  //
  assertIsObjectProxy,
  checkIsObjectProxy,
  isObjectProxy,
  //
  assertIsObjectWithEntry,
  checkIsObjectWithEntry,
  isObjectWithEntry,
  //
  assertIsObjectWithKeys,
  checkIsObjectWithKeys,
  isObjectWithKeys,
  //
  assertIsObjectWithValues,
  checkIsObjectWithValues,
  isObjectWithValues,
  //
  assertIsObjectSealed,
  checkIsObjectSealed,
  isObjectSealed
} from '../../../core/guards/objs/base/index.js';
import {
  assertIsMapWithEntries,
  checkIsMapWithEntries,
  isMapWithEntries,
  //
  assertIsMapWithKeys,
  checkIsMapWithKeys,
  isMapWithKeys,
  //
  assertIsMapWithValues,
  checkIsMapWithValues,
  isMapWithValues
} from '../../../core/guards/objs/map/index.js';
import { assertIsSetOf, checkIsSetOf, isSetOf } from '../../../core/guards/objs/set/index.js';
export const is = {
  /** @narrows `object` */
  any: isObjectAny,
  /** @narrows `T & object` */
  notPlain: isObjectNotPlain,
  /** @narrows `T & Record\<string, unknown\>` */
  notEmpty: isNotObjectEmpty,
  /** @narrows `Record\<string, never\>` */
  empty: isObjectEmpty,
  /** @narrows `Iterable<T>` */
  iterable: isObjectIterable,
  /** @narrows `'__proto__' | 'constructor' | 'prototype'` */
  prototypeKey: isObjectPrototypeKey,
  /** @narrows `T & InstanceType\<typeof Proxy\>` */
  proxy: isObjectProxy,
  /** @narrows `T & T.Key0.Key1...KeyN: V */
  withEntry: isObjectWithEntry,
  /** @narrows `T & \{ [K in Keys]: unknown \}` */
  withKeys: isObjectWithKeys,
  /** @narrows `Record\<string, V\>` */
  withValues: isObjectWithValues,
  /** @narrows `T & object` */
  extensible: isObjectExtensible,
  /** @narrows {@link Frozen} */
  frozen: isObjectFrozen,
  /** @narrows `T & object` */
  sealed: isObjectSealed,
  /** @narrows `T & Record\<K, unknown\>` */
  plain: isObject,

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
  /** @asserts `object` */
  any: assertIsObjectAny,
  /** @asserts `T & object` */
  notPlain: assertIsObjectNotPlain,
  /** @asserts `T & Record\<string, unknown\>` */
  notEmpty: assertIsNotObjectEmpty,
  /** @asserts `Record\<string, never\>` */
  empty: assertIsObjectEmpty,
  /** @asserts `Iterable<T>` */
  iterable: assertIsObjectIterable,
  /** @asserts `'__proto__' | 'constructor' | 'prototype'` */
  prototypeKey: assertIsObjectPrototypeKey,
  /** @asserts `T & InstanceType\<typeof Proxy\>` */
  proxy: assertIsObjectProxy,
  /** @asserts `T & T.Key0.Key1...KeyN: V */
  withEntry: assertIsObjectWithEntry,
  /** @asserts `T & \{ [K in Keys]: unknown \}` */
  withKeys: assertIsObjectWithKeys,
  /** @asserts `Record\<string, V\>` */
  withValues: assertIsObjectWithValues,
  /** @asserts `T & object` */
  extensible: assertIsObjectExtensible,
  /** @asserts {@link Frozen} */
  frozen: assertIsObjectFrozen,
  /** @asserts `T & object` */
  sealed: assertIsObjectSealed,
  /** @asserts `T & Record\<K, unknown\>` */
  plain: assertIsObject,
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
  /** @checks `object` */
  any: checkIsObjectAny,
  /** @checks `T & object` */
  notPlain: checkIsObjectNotPlain,
  /** @checks `T & Record\<string, unknown\>` */
  notEmpty: checkIsNotObjectEmpty,
  /** @checks `Record\<string, never\>` */
  empty: checkIsObjectEmpty,
  /** @checks `Iterable<T>` */
  iterable: checkIsObjectIterable,
  /** @checks `'__proto__' | 'constructor' | 'prototype'` */
  prototypeKey: checkIsObjectPrototypeKey,
  /** @checks `T & InstanceType\<typeof Proxy\>` */
  proxy: checkIsObjectProxy,
  /** @checks `T & T.Key0.Key1...KeyN: V */
  withEntry: checkIsObjectWithEntry,
  /** @checks `T & \{ [K in Keys]: unknown \}` */
  withKeys: checkIsObjectWithKeys,
  /** @checks `Record\<string, V\>` */
  withValues: checkIsObjectWithValues,
  /** @checks `T & object` */
  extensible: checkIsObjectExtensible,
  /** @checks {@link Frozen} */
  frozen: checkIsObjectFrozen,
  /** @checks `T & object` */
  sealed: checkIsObjectSealed,
  /** @checks `T & Record\<K, unknown\>` */
  plain: checkIsObject,
  /** @checks `Map\<K, V\>` */
  mapWithEntries: checkIsMapWithEntries,
  /** @checks `Map\<K, unknown\>` */
  mapWithKeys: checkIsMapWithKeys,
  /** @checks `Map\<unknown, V\>` */
  mapWithValues: checkIsMapWithValues,
  /** @checks `Set<T>` */
  setOf: checkIsSetOf
} as const;
