import type {
  FilterRecord,
  PluckRecord,
  StripNullish,
  StrKey,
  StrRecord,
  SymbolKey
} from '../types.js';
/**
 * @module Object
 *
 * Utility functions for safe, type-aware object operations:
 * type guards, deep cloning, freezing, merging, and introspection.
 */

export const is = {
  /**
   * Type guard: Checks if `provided` is a non-null object
   * with string keys.
   * - Optionally ensures that specific keys exist on the object.
   *
   * @template T - Expected object type (defaults to `StrRecord`)
   * @template K - Keys to check (must be valid keys of T)
   */
  obj: <T = StrRecord, K extends keyof T = StrKey<T>>(
    /** Value to check if it is an object with specific string keys. */
    provided: unknown,
    /** List of string keys to check for existence in the object. */
    hasKeys: K[] = []
  ): provided is T =>
    typeof provided === 'object'
    && provided !== null
    && !Array.isArray(provided)
    && hasKeys.every((key) => key in provided),
  /**
   * Type guard: Checks if `key` is a string and a property of `obj`.
   * @template T - Object type
   */
  strKeyOf: <T extends object = object>(
    /** Key to check if it is a string and a property of the object. */
    key: unknown,
    /** Object to check against. */
    obj: T
  ): key is StrKey<T> => typeof key === 'string' && key in obj,
  /**
   * Type guard: Checks if `key` is a symbol and a property of `obj`.
   * @template T - Object type
   */
  symbolKeyOf: <T extends object = object>(
    /** Key to check if it is a symbol and a property of the object. */
    key: unknown,
    /** Object to check against. */
    obj: T
  ): key is SymbolKey<T> => typeof key === 'symbol' && key in obj,
  /** Checks if an object has no own enumerable keys. */
  empty: (obj: unknown) => is.obj(obj) && Object.keys(obj).length === 0,

  /**
   * Type guard: Checks if `partial` is a valid partial structure
   * of `established`.
   */
  partialOf: <T extends object = object>(
    /** Value to check if it is a partial of the established object. */
    partial: unknown,
    /** Established object to compare against. */
    established: T
  ): partial is Partial<T> =>
    is.obj(partial)
    && is.obj(established)
    && entries(partial).every(([key, value]) => {
      if (!(key in established)) return false;
      const val = established[key];
      if (Array.isArray(val)) {
        if (!Array.isArray(value)) return false;
        return value.every((item, i) =>
          i < val.length ? typeof item === typeof val[i] : false
        );
      }
      return typeof val === 'object' ?
          is.partialOf(value, val ?? {})
        : typeof value === typeof val;
    }),
  prototypeKey: (key: string) =>
    key === '__proto__' || key === 'constructor' || key === 'prototype'
} as const;

/**
 * Deep clones an object or array.
 *
 * - Recursively clones nested objects
 * - Clones each array element
 * - Returns non-objects as-is
 *
 * @template T - Value type
 */
export const clone = <T>(
  /** Value to clone */
  obj: T
): T => {
  if (Array.isArray(obj))
    return obj.map((item: unknown) =>
      is.obj(item) || Array.isArray(item) ? clone(item) : item
    ) as T;
  if (!is.obj(obj)) return obj;
  const result: StrRecord = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = is.obj(value) || Array.isArray(value) ? clone(value) : value;
  }
  return result as T;
};

export interface FreezeOpts {
  /** Clone before freezing to avoid mutating the original object. */
  clone: boolean;
  /**
   * Depth of recursive freezing:
   * - `0` → freeze only the top-level object
   * - `1` (default) → freeze object + direct children
   * - `n` → freeze object + `n` nested levels
   */
  maxDepth: number;
}
/**
 * Deep freezes an object up to a given depth.
 *
 * - Skips already frozen objects
 * - Optionally clones before freezing
 * - Stops freezing at `maxDepth`
 *
 * @template T - Object type
 */
export const freeze = <T>(
  /** Object to freeze */
  obj: T,
  /** Options for freezing */
  opts: Partial<FreezeOpts> = {}
): Readonly<T> => {
  if (Object.isFrozen(obj)) return obj;
  const target = opts.clone ? clone(obj) : obj;
  const _freeze = (object: unknown, depth: number): Readonly<T> => {
    if (depth === 0 || !is.obj(object) || Object.isFrozen(object))
      return object as Readonly<T>;

    return Object.freeze(
      Object.fromEntries(
        Object.entries(object).map(([key, value]) => [
          key,
          is.obj(value) ? _freeze(value, depth - 1) : value
        ])
      )
    ) as Readonly<T>;
  };
  return _freeze(target, opts.maxDepth ?? 1);
};

/** Returns all string keys of an object as a typed array. */
export const keys = <T, K extends keyof T = StrKey<T>>(obj: T) =>
  is.obj(obj) ? (Object.keys(obj) as K[]) : [];

/** Returns all `[key, value]` entries of an object with type safety. */
export const entries = <T, K extends keyof T = StrKey<T>>(obj: T) =>
  is.obj(obj) ? (Object.entries(obj) as [K, T[K]][]) : [];

/** Creates a new object by picking specified keys from the original object. */
export const pick = <T, K extends keyof T = StrKey<T>>(
  /** Object to pick properties from */
  obj: T,
  /** Keys of properties to pick */
  pickKeys: K[]
): Pick<T, K> => {
  const result: Partial<T> = {};
  if (!is.obj(obj)) return result as Pick<T, K>;
  for (const key of pickKeys) if (key in obj) result[key] = obj[key];
  return result as Pick<T, K>;
};

/** Creates a new object by omitting specified keys from the original object. */
export const omit = <T, K extends keyof T = StrKey<T>>(
  /** Object to omit properties from */
  obj: T,
  /** Keys of properties to omit */
  omitKeys: K[]
): Omit<T, K> => {
  const result: Partial<T> = {};
  if (!is.obj(obj)) return result as Omit<T, K>;
  for (const key of keys<T, K>(obj))
    if (!omitKeys.includes(key)) result[key] = obj[key];
  return result as Omit<T, K>;
};

/**
 * Creates a new object by filtering properties of T whose values extend R
 *
 * @template T - Original object type
 * @template R - Value type to filter by
 * @example
 * ```ts
 * const filtered = filter(
 *   { a: 1, b: '2', c: 3 },
 *   (v): v is number => typeof v === 'number'
 * ) // { a: 1, c: 3 }
 * ```
 */
export const filter = <T, R extends T[keyof T]>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => value is R
): FilterRecord<T, R> => {
  const result: Partial<T> = {};
  if (!is.obj(obj)) return result as FilterRecord<T, R>;
  for (const [key, value] of entries<T, keyof T>(obj))
    if (predicate(value, key)) result[key] = value;

  return result as FilterRecord<T, R>;
};

/**
 * Creates a new object by plucking a specific property from each value in
 * the original object.
 *
 * @important Note: Only plucks properties from values that are objects at depth 1. Every nested object must have the specified key or TypeScript will throw a TypeError.
 *
 * @template T - Original object type
 * @template K - Key of the property to pluck from each value
 * @example
 * ```ts
 * const plucked = pluck(
 *   {
 *     item1: { id: 1, name: 'Item 1' },
 *     item2: { id: 2, name: 'Item 2' }
 *   },
 *   'id'
 * ) // { item1: 1, item2: 2 }
 * ```
 */
export const pluck = <T, K extends keyof T[keyof T] = keyof T[keyof T]>(
  obj: T,
  key: K
): PluckRecord<T, K> => {
  if (!is.obj<T>(obj))
    throw new TypeError(
      `Obj.pluck expects an object as first argument, but got: ${typeof obj}`
    );
  const result = {} as PluckRecord<T, K>;
  for (const [k, v] of entries(obj))
    if (is.obj(v) && key in v) (result as StrRecord)[k] = v[key];

  return result;
};

/**
 * Omits properties with `null` or `undefined` values from an object,
 * recursively applying the same logic to nested objects.
 *
 * @template T - Object type
 * @example
 * ```ts
 * const cleaned = stripNullish({
 *   a: 1,
 *   b: null,
 *   c: undefined,
 *   d: {
 *     e: 2,
 *     f: null,
 *     g: {
 *       h: 3,
 *       i: undefined
 *     }
 *   }
 * }) // { a: 1, d: { e: 2, g: { h: 3 } } }
 * ```
 */
export const stripNullish = <T>(obj: T): StripNullish<T> => {
  if (!is.obj(obj)) return obj as StripNullish<T>;
  const result = {} as StrRecord;
  for (const [key, value] of entries(obj)) {
    if (value === null || value === undefined) continue;
    result[key] = is.obj(value) ? stripNullish(value) : value;
  }
  return result as StripNullish<T>;
};

export type * from '../types.js';
