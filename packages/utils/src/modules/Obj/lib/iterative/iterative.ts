import type {
  Key,
  StringRecord,
  Entry,
  Entries,
  FromEntries,
  Paths,
  PickPaths,
  Flat
} from '@toolbox-ts/types/defs/object';

import {
  assertIsObject,
  isObject,
  isObjectEmpty,
  isObjectWithKeys
} from '../../../../core/guards/index.js';
import { entries, fromEntries, keys } from '../base/index.js';

/**
 * Callback function for iterating over object key-value pairs.
 *
 * @important Keys are enumerable strings
 * - Numeric keys like `0` become string literals `'0'`
 * - String keys remain as-is: `'name'`
 * - Symbol keys are excluded (use `symbolEntries` for those)
 *
 * @example
 * ```ts
 * const obj = { 0: 'a', 1: 'b', name: 'c' };
 *
 * forEach(obj, (value, key) => {
 *   // ✅ Works - key is properly typed for indexing
 *   console.log(obj[key]);
 *
 *   // ✅ Works - string comparison for numeric keys
 *   if (key === '0') // true for numeric key 0
 *
 *   // ✅ Works - string comparison for string keys
 *   if (key === 'name')
 * });
 * ```
 */
export type KeyValueCb<T, R> = (value: T[keyof T], key: Key.Enumerable<T>) => R;
//#region> ForEach
/**
 * Executes a callback for each key-value pair in an object
 *
 * @template T - Object type
 * @example
 * ```ts
 * forEach({ a: 1, b: 2 }, (value, key) => {
 *   console.log(`${key}: ${value}`)
 * })
 * ```
 */
export const forEach = <T>(obj: T, cb: KeyValueCb<T, void>): void => {
  for (const [key, value] of entries(obj)) cb(value, key);
};
//#endregion
//#region> Reduce
export type ReduceCb<T, R> = (acc: R, value: T[keyof T], key: Key.Enumerable<T>) => R;
/**
 * Reduces an object to a single value by applying a reducer function to each key-value pair.
 *
 * @template T - Plain object type `({})`
 * @template R - Accumulator type
 * @example
 * ```ts
 * const sum = reduce(
 *   { a: 1, b: 2, c: 3 },
 *   (acc, value) => acc + value,
 *   0
 * ) // 6
 * ```
 */
export const reduce = <T, R = StringRecord>(
  obj: T,
  cb: ReduceCb<T, R>,
  initial: R = {} as R
): R => {
  let acc = initial;
  for (const [key, value] of entries(obj)) acc = cb(acc, value, key);
  return acc;
};
//#endregion
//#region> Map
/**
 * Creates a new object by applying a callback to each key-value pair of the original object.
 *
 * @template T - Original object type
 * @template R - Resulting value type
 * @example
 * ```ts
 * const mapped = map(
 *   { a: 1, b: 2, c: 3 },
 *   (key, value) => value * 2
 * ) // { a: 2, b: 4, c: 6 }
 * ```
 */
export const map = <T, R>(obj: T, cb: KeyValueCb<T, R>): { [K in Key.Enumerable<T>]: R } => {
  const result: StringRecord<R> = {};
  for (const [key, value] of entries<T>(obj)) result[key] = cb(value, key);
  return result as { [K in Key.Enumerable<T>]: R };
};
//#endregion
//#region> Filter
export interface FilterFunction {
  <T, V>(
    obj: T,
    predicate: FilterInPredicate<V>
  ): { [K in keyof T as T[K] extends V ? Key.CoerceNumber<K> : never]: T[K] };
  <T, E>(
    obj: T,
    predicate: FilterOutPredicate<T, E>
  ): { [K in keyof T as T[K] extends E ? never : Key.CoerceNumber<K>]: T[K] };
  <T>(
    obj: T,
    predicate: (value: unknown) => boolean
  ): { [K in keyof T as Key.CoerceNumber<K>]?: T[K] };
}
export type FilterInPredicate<V> = (value: unknown) => value is V;
export type FilterOutPredicate<T, V> = (value: unknown) => value is Exclude<T[keyof T], V>;
export type FilterPredicate<T, V> =
  | FilterInPredicate<V>
  | FilterOutPredicate<T, V>
  | FilterSimplePredicate;
export type FilterSimplePredicate = (value: unknown) => boolean;
export const filter: FilterFunction = <T, V>(obj: T, predicate: FilterPredicate<T, V>) => {
  const result: StringRecord = {};
  for (const [key, value] of entries<T>(obj)) if (predicate(value)) result[key] = value;
  return result;
};
//#endregion
//#region> Omit
/** Creates a new object by omitting specified keys from the original object. */
export const omit = <T, K extends keyof T>(
  /** Object to omit properties from */
  obj: T,
  /** Keys of properties to omit */
  omitKeys: K[] | readonly K[]
) => {
  const result: StringRecord = {};
  for (const key of keys(obj)) {
    if (!omitKeys.some((k) => String(k) === key)) {
      const numKey = Number(key);
      result[key] = !Number.isNaN(numKey)
        ? (obj as StringRecord)[numKey]
        : (obj as StringRecord)[key];
    }
  }
  return result as {
    [P in keyof T as P extends K ? never : Key.CoerceNumber<P>]: T[P];
  };
};
//#endregion
//#region> Pick
/**
 * Creates a new object by picking specified paths from the original object.
 *
 * @important Keys with dots that are not paths will not properly reconstruct as nested objects.
 *
 * @example
 * ```ts
 * const obj = { a: { b: { c: 3 } }, d: 4 };
 * const result = pick(obj, ['a.b.c', 'd']);
 * // result is { a: { b: { c: 3 } }, d: 4 }
 *
 * const obj2 = { 'x.y': { z: 5 } };
 * const result2 = pick(obj2, ['x.y']);
 * // result2 is { x: { y: { z: never } } }
 */
export const pick = <T, const P extends Paths<T>>(
  obj: T,
  pickPaths: P[] | readonly P[]
): PickPaths<T, P> => {
  assertIsObject(obj);
  if (isObjectEmpty(obj)) return {} as PickPaths<T, P>;
  let result: StringRecord = {};
  for (const p of pickPaths) {
    const keys = p.split('.');
    let current: unknown = structuredClone(obj);
    let found = true;
    for (const key of keys) {
      if (isObjectWithKeys(current, [key])) current = current[key];
      else {
        found = false;
        break;
      }
    }
    if (!found) continue;
    let nested: StringRecord = { [keys[keys.length - 1]]: current };
    for (let i = keys.length - 2; i >= 0; i--) nested = { [keys[i]]: nested };
    result = { ...result, ...nested };
  }
  return result as PickPaths<T, P>;
};
//#endregion
//#region> Flat
/**
 * Flattens a nested object into a single-level object with dot-separated keys.
 *
 * @important Objects with keys that contain dots will not be flattened correctly.
 *
 * @example
 * ```ts
 * // ✅
 * const obj = { a: { b: { c: 3 } }, d: 4 };
 * const result = flat(obj);
 * // result is { 'a.b.c': 3, d: 4 }
 *
 * // ❌
 * const obj2 = { 'x.y': { z: 5 } };
 * const result2 = flat(obj2);
 * // result2 is {}
 * ```
 */
export const flat = <T>(obj: T): Flat<T> => {
  const result: StringRecord = {};
  for (const [key, value] of entries(obj)) {
    if (isObject(value)) {
      const flatObject = flat(value);
      for (const [flatKey, flatValue] of entries(flatObject))
        result[`${key}.${flatKey}`] = flatValue;
    } else result[key] = value;
  }
  return result as Flat<T>;
};
//#endregion
//#region> Some
/**
 * Tests whether at least one property satisfies the predicate
 *
 * @example
 * ```ts
 * some({ a: 1, b: 2, c: 3 }, v => v > 2) // true
 * ```
 */
export const some = <T>(obj: T, predicate: KeyValueCb<T, boolean>): boolean => {
  for (const [key, value] of entries(obj)) if (predicate(value, key)) return true;

  return false;
};
//#endregion
//#region> Every
/**
 * Tests whether all properties satisfy the predicate
 *
 * @example
 * ```ts
 * every({ a: 1, b: 2, c: 3 }, v => v > 0) // true
 * ```
 */
export const every = <T>(obj: T, predicate: KeyValueCb<T, boolean>): boolean => {
  for (const [key, value] of entries(obj)) if (!predicate(value, key)) return false;

  return true;
};
//#endregion
//#region> Find
/**
 * Returns the first key-value pair that satisfies the predicate
 *
 * @example
 * ```ts
 * find({ a: 1, b: 2, c: 3 }, v => v > 1) // ['b', 2]
 * ```
 */
export const find = <T>(
  obj: T,
  predicate: KeyValueCb<T, boolean>
): [key: Key.Enumerable<T>, value: T[keyof T]] | undefined => {
  for (const [key, value] of entries(obj)) if (predicate(value, key)) return [key, value];

  return undefined;
};
//#endregion
//#region> Sort
export type ObjectSortComparator<T> = (a: Entry<T>, b: Entry<T>) => number;
/**
 * Creates a new object with its keys sorted based on the provided comparator function.
 *
 * @template T - Object type
 * @template K - Key type
 * @param obj - The object to be sorted.
 * @param comparator - A function that defines the sort order of the keys.
 * By default, it sorts keys in ascending lexicographical order.
 * @returns A new object with the same key-values but in sorted order.
 *
 * @example
 * ```ts
 * const unsorted = { b: 2, a: 1, c: 3 };
 * const sorted = sort(unsorted);
 * // sorted is { a: 1, b: 2, c: 3 }
 * const customSorted = sort(unsorted, (a, b) => b[0].localeCompare(a[0]));
 * // customSorted is { c: 3, b: 2, a: 1 }
 * ```
 */
export const sort = <T>(obj: T, comparator?: ObjectSortComparator<T>): FromEntries<Entries<T>> =>
  fromEntries(sortEntries(obj, comparator));

/**
 * Sorts the entries of an object based on the provided comparator function.
 *
 * @template T - Object type
 * @param obj - The object whose entries are to be sorted.
 * @param comparator - A function that defines the sort order of the entries.
 * By default, it sorts entries in ascending lexicographical order based on their keys.
 * @returns An array of sorted entries (key-value pairs) from the object.
 *
 * @example
 * ```ts
 * const unsorted = { b: 2, a: 1, c: 3 };
 * const sortedEntries = sortEntries(unsorted);
 * // sortedEntries is [['a', 1], ['b', 2], ['c', 3]]
 * const customSortedEntries = sortEntries(unsorted, (a, b) => b[0].localeCompare(a[0]));
 * // customSortedEntries is [['c', 3], ['b', 2], ['a', 1]]
 * ```
 */
export const sortEntries = <T>(
  obj: T,
  comparator: ObjectSortComparator<T> = ([aKey], [bKey]) => aKey.localeCompare(bKey)
): Entries<T> => entries(obj).sort(comparator);
//#endregion
