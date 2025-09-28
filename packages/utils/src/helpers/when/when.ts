export type WhenValue<T, C> = ((c?: C) => T) | T;
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
export function when<T, C = unknown>(
  condition: C,
  value: WhenValue<T, C>
): T | undefined;
export function when<T, R, C = unknown>(
  condition: C,
  value: WhenValue<T, C>,
  fallback: R
): R | T;
export function when(
  condition: unknown,
  value: unknown,
  fallback?: unknown
): unknown {
  if (!condition) return fallback;
  return typeof value === 'function' ?
      (value as (c: typeof condition) => unknown)(condition)
    : value;
}
