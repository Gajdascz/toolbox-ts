import { Prim } from '../../../Prim/index.js';

/**
 * Rounds a number to the specified decimal point.
 * @example
 * ```ts
 * round(3.14159) // 3
 * round(3.14159, 2) // 3.14
 * round(3.14159, 4) // 3.1416
 * round(3.14159, -1) // 3
 * round(3.14159, NaN) // 3
 * ```
 */
export const round = (value: number, decimalPosition = 0) => {
  const effectiveDecimalPosition = Math.max(0, decimalPosition);
  if (effectiveDecimalPosition === 0 || Number.isNaN(effectiveDecimalPosition))
    return Math.round(value);
  const factor = 10 ** effectiveDecimalPosition;
  return Math.round(value * factor) / factor;
};

export const is = {
  /**
   * Checks if a value is exactly equal to the specified number or bigint.
   */
  theNumber: <N extends bigint | number>(value: unknown, n: N): value is N =>
    value === n,
  number: Prim.is.number,
  /**
   * Checks if a value is a string that can be converted to a valid number.
   */
  stringNumber: (value: unknown): value is string =>
    Prim.is.string(value) && !Number.isNaN(Number(value)),
  /**
   * Checks if a value is a finite number (not NaN, Infinity, or -Infinity).
   */
  finite: (num: unknown): num is number => Number.isFinite(num),
  /**
   * Checks if a value is not a finite number (NaN, Infinity, or -Infinity).
   */
  infinity: (num: unknown): num is number => !is.finite(num),
  /** Checks if a value is an odd integer. */
  odd: (num: unknown): num is number => is.number(num) && num % 2 !== 0,
  /** Checks if a value is an even integer. */
  even: (num: unknown): num is number => !is.odd(num),
  /** Checks if a value is an integer. */
  integer: (n: unknown, safe = false): n is number =>
    safe ? Number.isSafeInteger(n) : Number.isInteger(n),
  /** Checks if a value is a positive number. */
  positive: (n: unknown, safe = false): n is number =>
    is.integer(n, safe) && n > 0,
  /** Checks if a value is a negative number. */
  negative: (num: unknown, safe = false): num is number =>
    !is.positive(num, safe),
  /** Checks if a value is a decimal (non-integer) number. */
  decimal: (num: unknown): num is number => !is.integer(num),
  /** Checks if a value is within a specified range (inclusive). */
  inRange: (num: unknown, min: number, max: number): num is number =>
    is.number(num) && num >= min && num <= max,
  /** Checks if a value is a positive integer. */
  positiveInt: (num: unknown, safe = true): num is number =>
    is.integer(num, safe) && num > 0,
  /** Checks if a value is a negative integer. */
  negativeInt: (num: unknown, safe = true): num is number =>
    is.integer(num, safe) && num < 0
} as const;

export interface ReducerOpts {
  roundTo?: number;
  start?: number;
}
/**
 * Reduces an array of numbers using the provided callback function,
 * with options for rounding and starting value.
 * @example
 * ```ts
 * reduce([1.234, 2.345, 3.456], (a, b) => a + b, { roundTo: 2 }) // 7.04
 * reduce([1, 2, 3, 4], (a, b) => a * b, { start: 1 }) // 24
 * reduce([], (a, b) => a + b, { start: 10 }) // 10
 * ```
 */
export const reduce = (
  numbers: number[],
  cb: (a: number, b: number) => number,
  { roundTo = 0, start = 0 }: ReducerOpts
): number => round(numbers.reduce(cb, start), roundTo);

/**
 * Calculates the sum of an array of numbers, with optional rounding.
 * @example
 * ```ts
 * sum([1.234, 2.345, 3.456], 2) // 7.04
 * sum([1, 2, 3, 4]) // 10
 * sum([], 2) // 0
 * ```
 */
export const sum = (numbers: number[], roundTo?: number): number =>
  reduce(numbers, (a, b) => a + b, { roundTo });

/**
 * Calculates the product of an array of numbers, with optional rounding.
 * @example
 * ```ts
 * product([1.5, 2, 3], 2) // 9
 * product([1, 2, 3, 4]) // 24
 * product([], 2) // 1
 * ```
 */
export const product = (numbers: number[], roundTo?: number): number =>
  reduce(numbers, (a, b) => a * b, { roundTo, start: 1 });

/**
 * Calculates the average of an array of numbers, with optional rounding.
 * Returns 0 for an empty array.
 * @example
 * ```ts
 * average([1.5, 2.5, 3.5], 2) // 2.5
 * average([1, 2, 3, 4]) // 2.5
 * average([], 2) // 0
 * ```
 */
export const average = (numbers: number[], roundTo?: number): number => {
  const n = numbers.length;
  if (n === 0) return 0;
  return sum(numbers, roundTo) / n;
};

/**
 * Calculates the range (max - min) of an array of numbers.
 * Returns NaN for an empty array.
 * @example
 * ```ts
 * range([1, 2, 3, 4]) // 3
 * range([-10, 0, 10]) // 20
 * range([]) // NaN
 * ```
 */
export const range = (numbers: number[]): number =>
  Math.max(...numbers) - Math.min(...numbers);

export interface ClampOpts {
  decimal?: number;
  max?: number;
  min?: number;
}
/**
 * Clamps a number between min and max
 *  - Inclusive
 *  @default
 * ```ts
 * { min: -Infinity, max: Infinity, decimal: 0 }
 * ```
 *
 * @example
 * ```ts
 * clamp(10, { min: 0, max: 5 }) // 5
 * clamp(-10, { min: 0, max: 5 }) // 0
 * clamp(3.14159, { decimal: 2 }) // 3.14
 * clamp(3.14159, { decimal: 4 }) // 3.1416
 * clamp(3.14159) // 3
 * ```
 */
export const clamp = (
  value: number,
  { min = -Infinity, max = Infinity, decimal = 0 }: ClampOpts = {}
) => round(Math.max(min, Math.min(max, value)), decimal);
