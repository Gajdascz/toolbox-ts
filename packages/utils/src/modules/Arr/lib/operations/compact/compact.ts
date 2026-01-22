import type {
  Arr,
  WithFalsy,
  WithNull,
  WithNullish,
  WithoutFalsy,
  WithoutNull,
  WithoutNullish,
  WithoutUndefined,
  WithUndefined
} from '@toolbox-ts/types/defs/array';

import {
  isNotNull,
  isNotNullish,
  isNotUndefined,
  isTruthy
} from '../../../../../core/index.js';
/**
 * Defines the mode of compacting an array.
 * - 'falsy': Removes all falsy values (`false`, `0`, `''`, `null`, `undefined`, `NaN`).
 * - 'null': Removes only `null` values.
 * - 'nullish': Removes both `null` and `undefined` values.
 * - 'undefined': Removes only `undefined` values.
 */
export type CompactStrategy = 'falsy' | 'null' | 'nullish' | 'undefined';
const compactFilters: { [key in CompactStrategy]: (v: unknown) => boolean } = {
  falsy: isTruthy,
  null: isNotNull,
  nullish: isNotNullish,
  undefined: isNotUndefined
};
export interface CompactWithoutMap<T extends Arr = Arr> {
  falsy: WithoutFalsy<T>;
  null: WithoutNull<T>;
  nullish: WithoutNullish<T>;
  undefined: WithoutUndefined<T>;
}

/**
 * Removes unwanted values from an array based on the specified mode.
 * - 'falsy': Removes all falsy values (`false`, `0`, `''`, `null`, `undefined`, `NaN`).
 * - 'null': Removes only `null` values.
 * - 'nullish': Removes both `null` and `undefined` values.
 * - 'undefined': Removes only `undefined` values.
 *
 * @pure
 *
 * @example
 * ```ts
 * compact([0, 1, false, 2, '', 3], 'falsy') // [1, 2, 3]
 * compact([1, null, 2, null, 3], 'null') // [1, 2, 3]
 * compact([1, undefined, 2, null, 3], 'nullish') // [1, 2, 3]
 * compact([1, undefined, 2, undefined, 3], 'undefined') // [1, 2, 3]
 * ```
 */
export function compact<T extends WithNullish = WithNullish>(
  a: T,
  mode: 'nullish'
): WithoutNullish<T>;
export function compact<T extends WithNull = WithNull>(
  a: T,
  mode: 'null'
): WithoutNull<T>;
export function compact<T extends WithFalsy = WithFalsy>(
  a: T,
  mode: 'falsy'
): WithoutFalsy<T>;
export function compact<T extends WithUndefined = WithUndefined>(
  a: T,
  mode: 'undefined'
): WithoutUndefined<T>;
export function compact<T extends Arr = Arr>(a: T, mode?: CompactStrategy): Arr;
export function compact<T extends Arr = Arr>(
  a: T,
  mode: CompactStrategy = 'nullish'
) {
  return a.filter(compactFilters[mode]);
}
