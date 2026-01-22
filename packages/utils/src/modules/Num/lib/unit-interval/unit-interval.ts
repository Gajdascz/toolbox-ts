import { INTERVALS } from '../../../../core/constants/nums.js';
export {
  assertIsNumberInUnitIntervalRange as assert,
  isNumberInUnitIntervalRange as is
} from '../../../../core/guards/primitives/number/index.js';

export const unit = INTERVALS.unit;

/**
 * Parses a number or numeric string, returns a clamped value in the unit-interval range [0, 1].
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
export const clamp = (value: number): number =>
  Math.min(unit[1], Math.max(unit[0], value));

/** Options for operations for a value within a range. */
export interface OperationOpts {
  /** The maximum value of the range. */
  max: number;
  /** The minimum value of the range. */
  min: number;
  /** The value to be operated on. */
  value: number;
}

/**
 * Scales an input value, which is clamped to the unit interval [0, 1], to the range [min, max].
 *
 * @example
 * ```ts
 * // value 0.5 is within the unit interval [0, 1]. 0.5 scaled relative to the range [10, 20] is 15
 * scale({ value: 0.5, min: 10, max: 20 }) // 15
 * // value -0.1 is clamped to 0. 0 is the minimum bound of the unit interval
 * scale({ value: -0.1, min: 10, max: 20 }) // 10
 * // value 1.5 is clamped to 1. 1 is the maximum bound of the unit interval
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
