import type { Nullish, Truthy } from '@toolbox-ts/types';
import type { Arr, WithoutFalsy } from '@toolbox-ts/types/defs/array';

export type WhenValue<T, C> = ((c: Truthy<C>) => T) | T;
/**
 * Return `value` if `condition` is **truthy**, otherwise return `fallback` (or `undefined` if no fallback is provided).
 *
 * - If `value` is a function, it will be called with `condition` as its argument and its return value will be used.
 * - If `value` is not a function, it will be returned as is.
 * - If `condition` is falsy, `fallback` will be returned (or `undefined` if no fallback is provided).
 *
 * @example
 * ```ts
 * when(true, { a: 1 }) // { a: 1 }
 * when(false, { a: 1 }, { b: 2 }) // { b: 2 }
 * when(true, () => ({a: 'passed'})) // { a: 'passed' }
 * when(false, (c) => ({ a: c }), { b: 2 }) // { b: 2 }
 * when('true' as const, (c) => ({ a: c })) // { a: 'true' }
 * when('key' as const, (c) => ({[c]: 1 })) // { key: 1 }
 * { ...when(true, { a: 1 }) } // { a: 1 }
 * ```
 */
export function when<T, C = unknown>(condition: C, value: WhenValue<T, C>): T | undefined;
export function when<T, R, C = unknown>(condition: C, value: WhenValue<T, C>, fallback: R): R | T;

export function when(condition: unknown, value: unknown, fallback?: unknown): unknown {
  return !condition
    ? fallback
    : typeof value === 'function'
      ? (value as (c: typeof condition) => unknown)(condition)
      : value;
}

//#region> All
export type WhenAllValue<T, C extends Arr = Arr> = ((c: WithoutFalsy<C>) => T) | T;
export function whenAll<T, C extends Arr = Arr>(
  conditions: C,
  value: WhenAllValue<T, C>
): T | undefined;
export function whenAll<T, R, C extends Arr = Arr>(
  conditions: C,
  value: WhenAllValue<T, C>,
  fallback: R
): R | T;
export function whenAll(conditions: unknown[], value: unknown, fallback?: unknown): unknown {
  return conditions.some((c) => !c)
    ? fallback
    : typeof value === 'function'
      ? (value as (c: typeof conditions) => unknown)(conditions)
      : value;
}
//#endregion

/**
 * A key that can be used with `wrapWhen`.
 *
 * If the key is false or Nullish the property will not be included in the resulting object.
 */
export type WrapWhenKey<K extends string> = false | K | Nullish;

export interface WrapWhenOpts<K extends string, V, TV> {
  /**
   * When true, excludes falsy values from result
   *
   * @important False is already excluded by default. This option excludes other falsy values like 0 and '' as well.
   */
  excludeFalsy?: boolean;
  /**
   * Return value if the condition is not met.
   */
  failReturn?: Nullish;

  /**
   * A transform function to apply to the value before wrapping it.
   */
  transform?: (v: V, k?: K) => TV;
}
/**
 * A value that can be used with `wrapWhen`.
 *
 * If the value is false or Nullish the property will not be included in the resulting object.
 */
export type WrapWhenValue<V> = false | Nullish | V;

/**
 * Wrap a value if it’s not null and not false
 *
 * - Checks if the key is a string and the value is neither null nor false.
 * - If both conditions are met, it returns an object with the key and value.
 * - If a transform function `t` is provided, it applies this function to the value before wrapping it.
 * - If the conditions are not met, it returns the specified return value `r`, which defaults to `undefined`.
 *
 * @example
 * ```ts
 * wrapWhen('test', true) // { test: true }
 * wrapWhen('123', true) // { 123: true }
 * wrapWhen('test', false) // undefined
 * wrapWhen('test', null) // undefined
 * wrapWhen('test', '!', { t: (v, k) => k + v }) // { test: 'test!' }
 * wrapWhen(null, true) // undefined
 * wrapWhen(undefined, true) // undefined
 * wrapWhen(false, true) // undefined
 * ```
 */
export const wrapWhen = <K extends string, V, TV = V>(
  key: WrapWhenKey<K>,
  v: WrapWhenValue<V>,
  { excludeFalsy = false, transform, failReturn }: WrapWhenOpts<K, V, TV> = {}
) =>
  typeof key === 'string' && v != null && v !== false && (!excludeFalsy || !!(v as unknown))
    ? { [key]: typeof transform !== 'function' ? v : transform(v, key) }
    : failReturn;

/**
 * Wrap multiple values if they are not null and not false
 *
 * @example
 * ```ts
 * wrapAllWhen([
 *   ['a', 1],
 *   ['b', null],
 *   ['c', false],
 *   ['d', 4]
 * ]) // { a: 1, d: 4 }
 * ```
 */
export const wrapAllWhen = <K extends string, V, TV = V>(
  props: [WrapWhenKey<K>, WrapWhenValue<V>][],
  opts: WrapWhenOpts<K, V, TV> = {}
): Partial<Record<K, TV>> =>
  props.reduce<Partial<Record<K, TV>>>((acc, [k, v]) => {
    acc = { ...acc, ...wrapWhen(k, v, opts) };
    return acc;
  }, {});
