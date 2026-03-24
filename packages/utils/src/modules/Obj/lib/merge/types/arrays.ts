import type { AnyDefined, Arr } from '@toolbox-ts/types';
import type { CloneStrategy as ArrayCloneStrat } from '../../../../Arr/lib/index.js';
import type { MergeStrategy } from './base.js';

export type CloneArrayHandler = (value: Arr.Arr) => Arr.Arr;
export type CloneArrayStrategy = ArrayCloneStrat | ((v: Arr.Arr) => Arr.Arr) | 'none';

/**
 * Handle merging of both arrays entirely.
 *
 * @example
 * ```ts
 * const handler: MergeArrayFullHandler = {
 *    full: <number[], Map<number, number>>(current, next) => new Map(current.map((val, index) => [index, val * next[index]]))
 * }
 * merge({ a: [1,2,3] }, { a: [4,5,6] }, { on: { array: handler } })
 * // { a: Map { 0 => 4, 1 => 10, 2 => 18 } }
 * ```
 */
export type ArrayMergeHandler = (current: AnyDefined, next: Arr.Arr) => unknown;
/**
 * Combine two arrays by index values.
 * - Incoming `undefined` values are skipped.
 * - Primitive values are merged using the primitive merge handler.
 *  - Null values are handled according to the overwrite options.
 *    - `omit` cannot be applied to array items. `omit` will skip the item, leaving the current value.
 * - Non-Plain objects use the provided mergeObjectType handler.
 * - Plain objects are merged recursively.
 *
 * @example
 * ```ts
 * merge({
 *  a: [1,2,3, { b: 1 }, null]
 * },
 * {
 *  a: [undefined, 5, null, { c: 2 }, 6]
 * },
 * { on: { array: 'combine' }, overwrites: { null: 'omit' } });
 * // { a: [1,5,3, { b: 1, c: 2 }, 6] }
 * ```
 */
export type ArrayCombineStrategy = 'combine';
/**
 * Concatenate two arrays.
 *
 * @example
 * ```ts
 * merge({ a: [1,2,3] }, { a: [3,4,5,6] }, { on: { array: 'concat' } })
 * // { a: [1,2,3,3,4,5,6] }
 * ```
 */
export type ArrayConcatStrategy = 'concat';
/**
 * Remove duplicate values from the merged array.
 * - Uses strict-equality comparison.
 * - Preserves first-occurrence order.
 *
 * @example
 * ```ts
 * const obj = { a: 'obj' }
 * merge({ a: [1,2,3,obj, { b: 1 }] }, { a: [3,4,5,6,1,2,obj, { b: 1 }] }, { on: { array: 'unique' } })
 * // { a: [1,2,3,{ b: 1 },4,5,6,{ b: 1 }] }
 * // obj is removed because it is a duplicate reference
 * // { b:1 } objects remain because they are different references
 * ```
 */
export type ArrayUniqueStrategy = 'unique';
/**
 * Prepend the incoming array to the current array.
 *
 * @example
 * ```ts
 * merge({ a: [1,2,3] }, { a: [4,5,6] }, { on: { array: 'prepend' } })
 * // { a: [4,5,6,1,2,3] }
 * ```
 */
export type ArrayPrependStrategy = 'prepend';

export type ArrayMergeStrategy = MergeStrategy<
  | ArrayCombineStrategy
  | ArrayConcatStrategy
  | ArrayUniqueStrategy
  | ArrayPrependStrategy
  | ArrayMergeHandler
>;
