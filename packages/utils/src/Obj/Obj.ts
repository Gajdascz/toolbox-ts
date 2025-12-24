import type {
  Filter,
  Pluck,
  StripNullish,
  StrRecord
} from '../types/object.js';
export type * from '../types/object.js';

import { Arr } from '../Arr/index.js';
import { Prim } from '../Prim/index.js';

export const is = {
  /**
   * Checks if a value is a non-null object (excluding arrays, functions, etc.).
   * - typeof v === 'object'
   * - v is not null
   * - v.constructor is Object
   *
   * @example
   * ```ts
   * is.obj({}) // true
   * is.obj(null) // false
   * is.obj([]) // false
   * is.obj(() => {}) // false
   * is.obj(new Date()) // false
   * ```
   */
  obj: (v: unknown): v is NonNullable<object> =>
    typeof v === 'object' && v !== null && v.constructor === Object,
  /**
   * Checks if a key is a prototype key that can lead to prototype pollution.
   * Specifically checks for '__proto__', 'constructor', and 'prototype'.
   */
  prototypeKey: (key: string) =>
    key === '__proto__' || key === 'constructor' || key === 'prototype',

  /**
   * Checks if an object has no own enumerable string-keyed properties.
   *
   * @example
   * ```ts
   * is.empty({}) // true
   * is.empty({ a: 1 }) // false
   * is.empty([]) // false
   * is.empty(null) // false
   * ```
   */
  empty: (obj: unknown) => is.obj(obj) && keys(obj).length === 0,
  /**
   * Checks if a key exists in an object, with proper typing.
   *
   * @example
   * ```ts
   * const obj = { a: 1, b: 2 };
   * is.keyOf('a', obj) // true
   * is.keyOf('c', obj) // false
   * ```
   */
  keyOf: <T>(k: unknown, obj: T): k is keyof T =>
    is.obj(obj)
    && (typeof k === 'string' || typeof k === 'number' || typeof k === 'symbol')
    && k in obj
} as const;
export interface CloneOpts {
  maxDepth?: number;
  strategy?: CloneStrategy;
}
/**
 * Cloning strategies:
 * - `deep` (default): Deeply clones objects, arrays, maps, sets, dates, regexps, and array buffers. Handles circular references.
 * - `shallow`: Shallow clones only the top-level object or array.
 * - `structured`: Uses `structuredClone`
 */
export type CloneStrategy = 'deep' | 'shallow' | 'structured';
/**
 * Deeply clones values with circular reference handling.
 *
 * - Primitives are returned as-is.
 * - Arrays, Objects, Maps, Sets, Dates, RegExps, and ArrayBuffers are cloned.
 * - Circular references are preserved.
 *
 * @template T - Value type
 * @example
 * ```ts
 * const original = { a: 1, b: { c: 2 } };
 * const copy = clone(original);
 * console.log(copy); // { a: 1, b: { c: 2 } }
 * console.log(copy === original); // false
 * ```
 */
export const clone = <T>(
  value: T,
  { maxDepth = Infinity, strategy = 'deep' }: CloneOpts = {},
  seen = new WeakMap()
): T => {
  if (strategy === 'shallow') {
    if (Array.isArray(value)) return [...value] as T;
    if (is.obj(value)) return { ...value } as T;
    return value;
  }
  if (strategy === 'structured') return structuredClone(value);

  if (value === null || typeof value !== 'object' || maxDepth === 0)
    return value;

  if (seen.has(value)) return seen.get(value) as T;
  const nextDepth = maxDepth - 1;

  if (Array.isArray(value)) {
    const arr: unknown[] = [];
    seen.set(value, arr);
    for (const item of value)
      arr.push(clone(item, { maxDepth: nextDepth }, seen));
    return arr as T;
  }

  if (value instanceof Map) {
    const map = new Map();
    seen.set(value, map);
    for (const [k, v] of value)
      map.set(
        clone(k, { maxDepth: nextDepth }, seen),
        clone(v, { maxDepth: nextDepth }, seen)
      );
    return map as T;
  }

  if (value instanceof Set) {
    const set = new Set();
    seen.set(value, set);
    for (const item of value)
      set.add(clone(item, { maxDepth: nextDepth }, seen));
    return set as T;
  }

  if (value instanceof Date) return new Date(value) as T;
  if (value instanceof RegExp)
    return new RegExp(value.source, value.flags) as T;
  if (value instanceof ArrayBuffer) return value.transfer() as T;
  const obj: Record<string, unknown> = {};
  seen.set(value, obj);
  for (const [k, v] of entries(value))
    obj[k] = clone(v, { maxDepth: nextDepth }, seen);
  return obj as T;
};
export interface FreezeOpts<T> {
  /** Clone before freezing to avoid mutating the original object. */
  clone:
    | ((obj: T, maxDepth?: number, ...args: unknown[]) => unknown)
    | boolean
    | CloneOpts;
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
  { clone: _c, maxDepth }: Partial<FreezeOpts<T>> = {}
): Readonly<T> => {
  if (Object.isFrozen(obj)) return obj;
  const target =
    typeof _c === 'function' ? _c(obj, maxDepth)
    : is.obj(_c) ? clone(obj, _c)
    : _c === true ? clone(obj)
    : obj;

  const _freeze = (object: unknown, depth: number): Readonly<T> => {
    if (depth === 0 || !is.obj(object) || Object.isFrozen(object))
      return object as Readonly<T>;

    return Object.freeze(
      Object.fromEntries(
        entries(object).map(([key, value]) => [
          key,
          is.obj(value) ? _freeze(value, depth - 1) : value
        ])
      )
    ) as Readonly<T>;
  };
  return _freeze(target, maxDepth ?? 1);
};

/** Returns all string keys of an object as a typed array. */
export const keys = <T>(obj: T) => {
  if (!is.obj(obj))
    throw new TypeError(`Obj.keys expects an object, but got: ${typeof obj}`);
  return Object.keys(obj) as Extract<keyof T, string>[];
};
/**
 * Returns all entries (key-value pairs) of an object as a typed array.
 *
 * @template T - Object type
 * @throws `TypeError` If the input is not an object
 */
export const entries = <T>(obj: T) => {
  if (!is.obj(obj))
    throw new TypeError(
      `Obj.entries expects an object, but got: ${typeof obj}`
    );
  return Object.entries(obj) as [
    Extract<keyof T, string>,
    T[Extract<keyof T, string>]
  ][];
};
/** Returns all values of an object as a typed array. */
export const values = <T>(obj: T) => {
  if (!is.obj(obj))
    throw new TypeError(`Obj.values expects an object, but got: ${typeof obj}`);
  return Object.values(obj) as T[Extract<keyof T, string>][];
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
 *       i: undefined,
 *       j: [1, null, 2, undefined, 3]
 *     }
 *   }
 * }) // { a: 1, d: { e: 2, g: { h: 3, j: [1,2,3] } } }
 * ```
 */
export const stripNullish = <T>(
  value: T,
  compactArrays = false
): StripNullish<T> => {
  if (!is.obj(value)) return value as StripNullish<T>;
  const result = {} as Record<string, unknown>;
  for (const [key, val] of entries(value))
    if (Prim.isNot.nullish(val))
      result[key] =
        is.obj(val) ? stripNullish(val, compactArrays)
        : Array.isArray(val) && compactArrays ? Arr.compactNullish(val)
        : val;

  return result as StripNullish<T>;
};

export interface MergeOpts {
  /**
   * Custom handler for merging arrays.
   */
  arrayHandler?: MergeArrayHandler<unknown>;
  cloneDepth?: number;
  cloneStrategy?: CloneStrategy;
  maxDepth?: number;
  primitiveHandler?: MergePrimitiveHandler<unknown>;
  /**
   * If true, empty object properties `{}` from `next`
   * overwrite existing populated properties in `current`.
   */
  retainEmptyObjectProps?: boolean;
  /**
   * If true, strip nullish values from the result.
   *
   * @important Includes removing nullish values from arrays.
   */
  stripNullish?: boolean;
}

type MergeArrayHandler<T> = (a: unknown[], b: unknown[]) => T;

type MergePrimitiveHandler<T> = (a: NonNullable<unknown>, b: unknown) => T;
/**
 * Recursively merges `next` into `current`.
 *
 *
 * @important Without handlers, arrays and primitives in `next` ALWAYS replace those in `current` when present in `next`. This includes nullish and falsy values.
 *
 * @important When using an array handler, `next` array is not cloned by default. Clone in your handler if needed.
 *
 * 1: current or next are not objects → returns current
 * 1.5: If the key is a prototype key, it is skipped
 * 2: Arrays are merged using `arrayHandler` if provided, otherwise `next` replaces `current`
 * 3: Primitives are merged using `primitiveHandler` if provided, otherwise `next` replaces `current`
 * 4: Empty objects `{}` in `next` and `retainEmptyObjectProps` is true, set the key in `current` to `{}`
 * 5: Objects are merged recursively
 *
 * @template R - Result type
 *
 * @example
 * ```ts
 * const merged = merge(
 *   { a: 1, b: { c: 2, d: [3] } },
 *   { a: null, b: { c: undefined, d: [4], e: 5, f: 6, g: NaN }, h: 7, x: undefined }
 * ) // { a: null, b: { c: undefined, d: [4], e: 5, f: 6, g: NaN }, f: 7, x: undefined }
 *
 * const mergedWithHandlers = merge(
 *  { a: 1, b: { c: 2, d: [3] } },
 *  { a: null, b: { c: undefined, d: [4], e: 5, f: 6, g: NaN }, h: 7, x: undefined },
 *  { arrayHandler: (a, b) => [...a, ...b], primitiveHandler: (a, b) => (typeof b === 'number' ? b : a) }
 * ) // { a: 1, b: { c: 2, d: [3, 4], e: 5, f: 6, g: NaN }, h: 7, x: undefined }
 * ```
 */
export function merge<R>(
  /** Current object to merge into */
  current: R,
  /** Next object to merge from */
  next: unknown,
  /** Options for merging */
  {
    arrayHandler,
    retainEmptyObjectProps = false,
    maxDepth = Infinity,
    cloneStrategy = 'shallow',
    primitiveHandler,
    cloneDepth = maxDepth,
    stripNullish: _stripNullish = false
  }: MergeOpts = {}
): R {
  if (!is.obj(current) || !is.obj(next)) return current;
  const result = clone(current, {
    maxDepth: Infinity,
    strategy: cloneStrategy
  }) as StrRecord;
  for (const [key, value] of entries(next)) {
    if ((value as unknown) === undefined) continue;
    if (Array.isArray(value)) {
      result[key] =
        Array.isArray(result[key]) && arrayHandler ?
          arrayHandler(result[key], value)
        : clone(value, { maxDepth: cloneDepth, strategy: cloneStrategy });
      continue;
    }
    if (!is.obj(value)) {
      result[key] =
        primitiveHandler ? primitiveHandler(result[key]!, value) : value;
      continue;
    }
    if (retainEmptyObjectProps && is.empty(value)) {
      result[key] = {};
      continue;
    }
    result[key] =
      key in result ?
        merge(result[key], value, {
          arrayHandler,
          primitiveHandler,
          retainEmptyObjectProps,
          cloneStrategy: cloneStrategy,
          maxDepth: maxDepth - 1
        })
      : clone(value, { maxDepth: cloneDepth, strategy: cloneStrategy });
  }

  return (_stripNullish ? stripNullish(result, true) : result) as R;
}
/**
 * Recursively merges all objects in `other` into `base`.
 * - Handles non-objects by returning the last non-nullish value found in `other` or `base`
 *
 * Uses same rules as @see {@link merge}
 * @important The last object in `other` has highest precedence
 *
 * @template R - Result type
 */
export function mergeAll<R>(base: R, other: unknown[], opts?: MergeOpts) {
  return Arr.compactNullish(other).reduce<R>(
    (acc, next) => merge(acc, next, opts),
    base
  );
}
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
  predicate: (key: keyof T, value: R) => boolean
): Filter<T, R> => {
  const result: Partial<T> = {};
  if (!is.obj(obj)) return result as Filter<T, R>;
  for (const [key, value] of entries<T>(obj))
    if (predicate(key, value as R)) result[key] = value;

  return result as Filter<T, R>;
};

/** Creates a new object by picking specified keys from the original object. */
export const pick = <T, K extends keyof T = keyof T>(
  /** Object to pick properties from */
  obj: T,
  /** Keys of properties to pick */
  pickKeys: K[] | readonly K[]
): Pick<T, K> => {
  const result: Partial<T> = {};
  if (!is.obj(obj)) return result as Pick<T, K>;
  for (const key of pickKeys) if (key in obj) result[key] = obj[key];
  return result as Pick<T, K>;
};
/** Creates a new object by omitting specified keys from the original object. */
export const omit = <T, K extends keyof T = keyof T>(
  /** Object to omit properties from */
  obj: T,
  /** Keys of properties to omit */
  omitKeys: K[] | readonly K[]
): Omit<T, K> => {
  const result: Partial<T> = {};
  if (!is.obj(obj)) return result as Omit<T, K>;
  for (const key of keys<T>(obj))
    if (!omitKeys.includes(key as string as K)) result[key] = obj[key];
  return result as Omit<T, K>;
};

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
export const map = <T, R>(
  obj: T,
  cb: (key: keyof T, value: T[keyof T]) => R
) => {
  const result: StrRecord<R> = {};
  if (!is.obj(obj)) return result;
  for (const [key, value] of entries<T>(obj)) result[key] = cb(key, value);
  return result;
};
/**
 * Reduces an object to a single value by applying a reducer function to each key-value pair.
 *
 * @template T - Original object type
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
export const reduce = <T, R>(
  obj: T,
  fn: (acc: R, value: T[keyof T], key: keyof T) => R,
  initial: R
): R => {
  if (!is.obj(obj)) return initial;
  let acc = initial;
  for (const [key, value] of entries(obj)) acc = fn(acc, value, key);

  return acc;
};

/**
 * Creates a new object by plucking a specified property from each value in the original object.
 *
 * @template T - Original object type
 * @template K - Key of the property to pluck
 * @example
 * ```ts
 * const pluck = pluck(
 *   { a: { id: 1 }, b: { id: 2 }, c: { id: 3 } },
 *   'id'
 * ) // { a: 1, b: 2, c: 3 }
 * ```
 */
export const pluck = <T, K extends keyof T[keyof T]>(
  obj: T,
  key: K
): Pluck<T, K> => {
  if (!is.obj(obj)) return obj as Pluck<T, K>;
  return reduce<T, Pluck<T, K>>(
    obj,
    (acc, item, StrKey) => {
      if (is.obj(item) && key in item) acc[StrKey] = item[key];
      return acc;
    },
    {} as Pluck<T, K>
  );
};
