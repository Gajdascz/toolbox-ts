import type { Nullish } from '../../types/index.js';

import { Str } from '../../Str/index.js';

export type WrapIfKey<K extends string> = false | K | Nullish;

export type WrapIfNum<V> = false | Nullish | V;
export interface WrapIfOpts<K extends string, V, TV> {
  /**
   * When true, excludes falsy values from result
   *
   * @important False is already excluded by default. This option excludes other falsy values like 0 and '' as well.
   */
  exclFalsy?: boolean;
  /**
   * Return value if the condition is not met.
   */
  r?: null | undefined;

  /**
   * A transform function to apply to the value before wrapping it.
   */
  t?: (v: V, k?: K) => TV;
}

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
 * wrapIf('test', true) // { test: true }
 * wrapIf('123', true) // { 123: true }
 * wrapIf('test', false) // undefined
 * wrapIf('test', null) // undefined
 * wrapIf('test', '!', { t: (v, k) => k + v }) // { test: 'test!' }
 * wrapIf(null, true) // undefined
 * wrapIf(undefined, true) // undefined
 * wrapIf(false, true) // undefined
 * ```
 */
const wrapIf = <K extends string, V, TV = V>(
  key: WrapIfKey<K>,
  v: WrapIfNum<V>,
  { exclFalsy = false, t }: WrapIfOpts<K, V, TV> = {}
) =>
  (
    typeof key === 'string'
    && v != null
    && v !== false
    && (!exclFalsy || !!(v as unknown))
  ) ?
    { [key]: typeof t !== 'function' ? v : (t as (v: V, k: K) => TV)(v, key) }
  : undefined;

/**
 * Wrap a comma-separated string into an array if the key is a string and the value is neither null nor false.
 *
 * - Uses @see {@link wrapIf} with a transform function that splits the string by commas and trims the resulting values.
 *
 * @example
 * ```ts
 * wrapIfCsv('test', 'a,b,c') // { test: ['a', 'b', 'c'] }
 * wrapIfCsv('test', ' a , b , c ') // { test: ['a', 'b', 'c'] }
 * wrapIfCsv('test', '') // undefined
 * wrapIfCsv('test', null) // undefined
 * wrapIfCsv('test', false) // undefined
 * wrapIfCsv(null, 'a,b,c') // undefined
 * wrapIfCsv(undefined, 'a,b,c') // undefined
 * wrapIfCsv(false, 'a,b,c') // undefined
 * ```
 */
const ifCsv = <K extends string>(
  key: WrapIfKey<K>,
  v: WrapIfNum<string>,
  opts: Omit<WrapIfOpts<K, string, string[]>, 'exclFalsy' | 't'> = {}
) =>
  wrapIf<K, string, string[]>(key, v, {
    ...opts,
    exclFalsy: true,
    t: Str.split.csv
  });

export { wrapIf as if, ifCsv };
