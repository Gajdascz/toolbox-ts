import type { Falsy, Mutable, Nullish, Truthy } from '../types/index.js';

/**
 * @module Prim
 *
 * Utility functions for safe, type-aware primitive operations:
 * type guards, type introspection, and value checks.
 */

/**
 * Primitive types in JavaScript/TypeScript.
 */
export const types = {
  bigint: 'bigint',
  boolean: 'boolean',
  null: 'null',
  number: 'number',
  string: 'string',
  symbol: 'symbol',
  undefined: 'undefined'
} as const;

export type Type = keyof typeof types;

/**
 * Type names mapped to their corresponding TypeScript type.
 */
export interface TypeMap {
  array: unknown[];
  bigint: bigint;
  boolean: boolean;
  falsy: Falsy;
  null: null;
  nullish: Nullish;
  number: number;
  string: string;
  symbol: symbol;
  truthy: Truthy<unknown>;
  type: Type;
  undefined: undefined;
}
export const is = {
  bigint: <V = bigint>(v: unknown): v is V => typeof v === types.bigint,
  boolean: <V = boolean>(v: unknown): v is V => typeof v === types.boolean,
  null: <V = null>(v: unknown): v is V => v === null,
  number: <V = number>(v: unknown): v is V =>
    typeof v === types.number && !Number.isNaN(v),
  string: <V = string>(v: unknown): v is V => typeof v === types.string,
  symbol: <V = symbol>(v: unknown): v is V => typeof v === types.symbol,
  undefined: <V = undefined>(v: unknown): v is V =>
    typeof v === types.undefined,
  falsy: <V = Falsy>(v: unknown): v is V => !v,
  type: <T = Type>(type: unknown): type is T =>
    is.string(type) && type in types,
  nullish: <V = Nullish>(v: unknown): v is V => v === null || v === undefined,
  truthy: <V = Truthy<unknown>>(v: unknown): v is V => !is.falsy(v)
} as const;

export const isNot = (Object.keys(is) as (keyof typeof is)[]).reduce<{
  [K in Mutable<keyof typeof is>]: <V>(v: V) => v is Exclude<V, TypeMap[K]>;
}>(
  (acc, key) => {
    (acc as Record<string, unknown>)[key] = <V>(
      v: V
    ): v is Exclude<V, TypeMap[typeof key]> => !is[key](v);
    return acc;
  },
  { ...is }
);

export interface CoerceNumberOpts {
  /**
   * Whether to allow `Infinity` as a valid number.
   * - If set to `true`, both positive and negative infinity are allowed.
   * - If set to `'positive'`, only positive infinity is allowed.
   * - If set to `'negative'`, only negative infinity is allowed.
   * - If set to `false`, neither positive nor negative infinity are allowed.
   */
  allowInfinity?: 'negative' | 'positive' | boolean;
  /**
   * The value to return when normalization fails (e.g., input is `NaN`, `null`, or `undefined`).
   */
  fallback?: number;
  /**
   * Whether to return the `fallback` value when the input is `null`.
   */
  fallbackOnBoolean?: 'false' | 'true' | boolean;
  /**
   * Whether to return the `fallback` value when the input is `NaN`.
   */
  fallbackOnNaN?: boolean;
  /**
   * Whether to return the `fallback` value when the input is `null`.
   */
  fallbackOnNull?: boolean;
  /**
   * Whether to return the `fallback` value when the input is `undefined`.
   */
  fallbackOnUndefined?: boolean;

  /**
   * How to coerce strings to numbers.
   * - `parseFloat`: uses `Number.parseFloat` to convert strings to numbers.
   * - `NumberCstr`: uses the `Number` constructor to convert strings to numbers.
   * @default 'parseFloat'
   * @remarks
   * The `Number` constructor is more strict and will return `NaN` for strings that are not valid numbers,
   * while `parseFloat` will parse valid leading numeric characters and ignore trailing non-numeric characters.
   * For example, `Number('123abc')` returns `NaN`, while `parseFloat('123abc')` returns `123`.
   * Choose the method that best fits your use case.
   * If the input is not a string, this option is ignored.
   * @example
   * ```ts
   * coerce.number('123.45abc', { stringCoercion: 'parseFloat' }) // 123.45
   * coerce.number('123.45abc', { stringCoercion: 'NumberCstr' }) // 0
   * coerce.number('abc123', { stringCoercion: 'parseFloat' }) // NaN
   * coerce.number('abc123', { stringCoercion: 'NumberCstr' }) // NaN
   * ```
   */
  stringCoercion?: 'NumberCstr' | 'parseFloat';
}

export const coerce = {
  string: (input: unknown): string => {
    switch (typeof input) {
      case 'string':
        return input;
      case 'number':
      case 'bigint':
      case 'boolean':
      case 'function':
        return String(input);
      case 'symbol':
        return input.toString();
      case 'undefined':
        return '';
      default:
        return JSON.stringify(input);
    }
  },
  number: (
    input: unknown,
    {
      allowInfinity = false,
      fallbackOnNaN = true,
      fallback = 0,
      stringCoercion = 'parseFloat',
      fallbackOnNull = true,
      fallbackOnBoolean = false
    }: CoerceNumberOpts = {}
  ): number => {
    // ---- Null / undefined ----
    if (input === null && fallbackOnNull) return fallback;

    // ---- Boolean ----
    if (typeof input === 'boolean') {
      if (
        fallbackOnBoolean === true
        || (fallbackOnBoolean === 'true' && input)
        || (fallbackOnBoolean === 'false' && !input)
      )
        return fallback;
      return Number(input); // coerces true -> 1, false -> 0 if not using fallback
    }

    // ---- Coercion ----
    let num: number;
    if (typeof input === 'number') {
      num = input;
    } else if (typeof input === 'string') {
      num =
        stringCoercion === 'parseFloat' ?
          Number.parseFloat(input)
        : Number(input);
    } else {
      num = Number(input);
    }

    // ---- NaN handling ----
    if (Number.isNaN(num)) return fallbackOnNaN ? fallback : num;

    // ---- Infinity handling ----
    if (!Number.isFinite(num)) {
      if (
        allowInfinity === true
        || (allowInfinity === 'positive' && num > 0)
        || (allowInfinity === 'negative' && num < 0)
      ) {
        return num;
      }
      return fallback;
    }

    return num;
  }
};
export type ExcludeStrategy =
  | 'falsy'
  | 'none'
  | 'null'
  | 'nullish'
  | 'undefined';

/**
 * Defines the behavior when merging values with `overwrite` behavior.
 * - first: the first value is kept
 * - last: the last value is kept
 * - custom function: a user-defined function that takes two values and returns the one to keep
 * @example
 * ```ts
 * merge(5, 10, { behavior: 'first' }) // 5
 * merge(50, 10, { behavior: 'last' }) // 10
 * merge('apple', 'banana', { behavior: (a, b) => a.length > b.length ? a : b }) // 'banana'
 * ```
 */
export type MergeBehavior<T> =
  | 'first'
  | 'last'
  | ((prev: T, next: T) => T | true);
export interface MergeOpts<T = unknown> {
  behavior?: MergeBehavior<T>;
  exclude?: ExcludeStrategy;
}
const excludeStrategies = {
  none: () => true,
  falsy: isNot.falsy,
  null: isNot.null,
  nullish: isNot.nullish,
  undefined: isNot.undefined
} as const;

/**
 * Merges a base primitive value with one or more new values according to the specified behavior.
 * Supports merging numbers, strings, booleans, bigints, and symbols.
 *
 * @param a - The base primitive value (must be non-nullish)
 * @param b - The new value(s) to merge (can be a single value or an array of values)
 * @param opts - Options for merging behavior and exclusion criteria
 * @returns The merged primitive value
 *
 * @throws {TypeError} If the base value `a` is nullish or not a primitive
 *
 * @example
 * ```ts
 * merge(10, [20, 30], { behavior: 'last' }) // 30
 * merge('hello', [' ', 'world'], { behavior: (a, b) => a + b }) //' hello world'
 * merge(true, [false, true], { behavior: 'firstOther', exclude: 'falsy' }) // true
 * merge(()=>0,[(n)=>1,(n)=>2,(n)=>3],{behavior:(a,b)=> {
 *    const res = b(a());
 *    return res >= 3 ? true : res;
 * }}) // 3
 * ```
 */
export const merge = <T = unknown>(
  a: T,
  b: T | T[],
  { behavior = 'last', exclude = 'nullish' }: MergeOpts<T> = {}
): T => {
  const excludeFn = excludeStrategies[exclude];
  const values = (Array.isArray(b) ? [a, ...b] : [a, b]).filter(excludeFn);
  if (behavior === 'first') return values[0];
  if (behavior === 'last') return values.at(-1)!;
  const [first, ...rest] = values;
  let acc = first;
  for (const val of rest) {
    const res = behavior(acc, val);
    if (res === true) return acc;
    acc = res;
  }
  return acc;
};

/**
 * Resolves the type of a value, distinguishing between arrays, functions, objects, and primitive types.
 */
export const resolveType = <T>(
  v: T
): 'array' | 'function' | 'object' | Type => {
  if (Array.isArray(v)) return 'array';
  if (v === null) return 'null';
  return typeof v;
};
