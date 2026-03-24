import type { CloneStrategy as ClStrat } from '../../clone/clone.js';
import type { AnyDefined } from '@toolbox-ts/types';

export type Depth = { curr: number; max: number };

/**
 * Incoming values fully replace the current values.
 *
 * @example
 * ```ts
 * merge(
 * {
 *  a: 1,
 *  b: {
 *    c: 4,
 *    d: [1,2,3]
 *  },
 *  d: [0,1,2],
 *  e: Map<string, number>,
 * },
 * {
 *  a: 0,
 *  b: 'override',
 *  d: [3,4,5],
 *  e: Set<string>
 * }
 * )
 * // {
 * // a: 0,
 * // b: 'override',
 * // d: [3,4,5],
 * // e: Set<string>
 * // }
 * ```
 */
export type ReplaceStrategy = 'replace';

export type MergeStrategy<S> = ReplaceStrategy | S;
export type CloneStrategy<S = void> = ClStrat | 'none' | S;

export type CloneHandler<T = unknown> = (value: T) => T;
export type MergeHandler<T = unknown> = (current: AnyDefined, next: T) => T;

/**
 * Behavior for handling `null` values during merge.
 *
 * - `omit`: Deletes the key from the merged result.
 * - `overwrite`: Incoming `null` values overwrite current values.
 * - `skip`: Incoming `null` values are ignored, preserving current values.
 */
export type NullBehavior = 'omit' | ('overwrite' | undefined) | 'skip';

/**
 * Behavior for handling incoming empty objects (`{}`) during merge.
 * - `overwrite`: Incoming empty objects overwrite current values.
 * - `skip`: Incoming empty objects are ignored, preserving current values.
 */
export type EmptyObjectBehavior = 'overwrite' | 'skip';

/**
 * Behavior for handling incoming empty arrays (`[]`) during merge.
 * - `overwrite`: Incoming empty arrays overwrite current values.
 * - `skip`: Incoming empty arrays are ignored, preserving current values.
 */
export type EmptyArrayBehavior = 'overwrite' | 'skip';
