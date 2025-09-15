/**
 * Returns true if the value is a number within [0, 1] (inclusive).
 *
 * @example
 * ```ts
 * is(0) // true
 * is(0.5) // true
 * is(1) // true
 * is(-0.1) // false
 * is(1.1) // false
 * is('0.5') // false
 * is(NaN) // false
 * ```
 */
export const is = (value: unknown): value is number =>
  typeof value === 'number' && value >= 0 && value <= 1;

/**
 * Parses a number or numeric string, returns a clamped [0, 1] value.
 * Returns 0 for non-finite values.
 *
 * @example
 * ```ts
 * parse(0.5) // 0.5
 * parse('0.75') // 0.75
 * parse(1.5) // 1
 * parse(-0.5) // 0
 * parse('not-a-number') // 0
 * parse(NaN) // 0
 * parse(Infinity) // 0
 * ```
 */
export const parse = (value: `${number}` | number): number => {
  const n = Number(value);
  return Number.isFinite(n) ? clamp(n) : 0;
};

/**
 * Clamps a number to the [0, 1] interval.
 * Returns 0 for values less than 0, and 1 for values greater than 1.
 *
 * @example
 * ```ts
 * clamp(0.5) // 0.5
 * clamp(-0.1) // 0
 * clamp(1.1) // 1
 * ```
 */
export const clamp = (value: number): number => Math.min(1, Math.max(0, value));

interface OperationOpts {
  max: number;
  min: number;
  value: number;
}

/**
 * Scales a unit interval value to the range [min, max].
 * Clamps the input value to [0, 1].
 * @example
 * ```ts
 * scale({ value: 0.5, min: 10, max: 20 }) // 15
 * scale({ value: -0.1, min: 10, max: 20 }) // 10
 * scale({ value: 1.5, min: 10, max: 20 }) // 20
 * ```
 */
export const scale = ({ value, min, max }: OperationOpts): number =>
  Number.parseFloat((clamp(value) * (max - min) + min).toFixed(10));

/**
 * Normalizes a value in [min, max] to the unit interval.
 * Returns 0 if min equals max.
 * @example
 * ```ts
 * normalize({ value: 15, min: 10, max: 20 }) // 0.5
 * normalize({ value: 10, min: 10, max: 20 }) // 0
 * normalize({ value: 20, min: 10, max: 20 }) // 1
 * normalize({ value: 10, min: 10, max: 10 }) // 0
 * ```
 */
export const normalize = ({ value, min, max }: OperationOpts): number =>
  min === max ? 0 : clamp((value - min) / (max - min));
