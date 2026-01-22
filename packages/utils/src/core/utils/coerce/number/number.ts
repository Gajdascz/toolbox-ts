import {
  isNumberFinite,
  isNumberNaN
} from '../../../guards/primitives/number/index.js';

export interface BaseCoerceNumberOpts {
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
   * - `parseInt`: uses `Number.parseInt` to convert strings to integers. Requires the `radix` option to be set.
   * - `undefined`: uses the `Number` constructor for conversion.
   * @default 'parseFloat'
   * @remarks
   * The `Number` constructor is more strict and will return `NaN` for
   * strings that are not valid numbers, while `parseFloat` will parse valid
   * leading numeric characters and ignore trailing non-numeric characters.
   * For example, `Number('123abc')` returns `NaN`, while
   * `parseFloat('123abc')` returns `123`.
   * @example
   * ```ts
   * coerce.number('123.45abc', { stringCoercion: 'parseFloat' }) // 123.45
   * coerce.number('123.45abc') // 0
   * coerce.number('abc123', { stringCoercion: 'parseFloat' }) // NaN
   * coerce.number('abc123') // NaN
   * ```
   */
  stringCoercion?: 'parseFloat' | 'parseInt';
}
export type CoerceNumberOpts = (
  | { radix?: number; stringCoercion?: 'parseInt' }
  | { radix?: void; stringCoercion?: 'NumberCstr' | 'parseFloat' }
)
  & BaseCoerceNumberOpts;
/**
 * Coerces a value to a number with various options for handling edge cases.
 * - Handles `null`, `undefined`, and `boolean` inputs based on provided options.
 * - Converts strings to numbers using specified methods.
 * - Manages `NaN` and `Infinity` according to configuration.
 * - Returns a fallback value when coercion fails, if specified.
 *
 * @example
 * ```ts
 * coerce.number('123.45') // 123.45
 * coerce.number('123.45abc', { stringCoercion: 'parseFloat' }) // 123.45
 * coerce.number('123.45abc') // 0
 * coerce.number(true) // 1
 * coerce.number(false) // 0
 * coerce.number(null, { fallbackOnNull: true, fallback: 10 }) // 10
 * coerce.number(undefined, { fallbackOnUndefined: true, fallback: 10 }) // 10
 * coerce.number(NaN, { fallbackOnNaN: true, fallback: 10 }) // 10
 * coerce.number(Infinity, { allowInfinity: true }) // Infinity
 * coerce.number(-Infinity, { allowInfinity: 'negative' }) // -Infinity
 * coerce.number('abc', { fallbackOnNaN: true, fallback: 10 }) // 10
 * ```
 */
export const coerceNumber = (
  input: unknown,
  {
    allowInfinity = false,
    fallbackOnNaN = true,
    fallback = 0,
    stringCoercion,
    fallbackOnNull = true,
    fallbackOnBoolean = false,
    fallbackOnUndefined = true,
    radix = 10
  }: CoerceNumberOpts = {}
): number => {
  // ---- Null / undefined ----
  if (input == null && (fallbackOnNull || fallbackOnUndefined)) return fallback;

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
      typeof stringCoercion === 'string' ?
        Number[stringCoercion](input, radix)
      : Number(input);
  } else {
    num = Number(input);
  }

  // ---- NaN handling ----
  if (isNumberNaN(num)) return fallbackOnNaN ? fallback : num;

  // ---- Infinity handling ----
  if (!isNumberFinite(num)) {
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
};
