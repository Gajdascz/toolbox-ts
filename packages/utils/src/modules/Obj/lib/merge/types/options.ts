import type { CloneBaseStrategy } from './objects.js';
import type { CloneArrayStrategy, ArrayMergeStrategy } from './arrays.js';
import type { PrimitiveMergeStrategy } from './primitives.js';
import type {
  ObjectTypeMergeStrategy,
  ClonePlainObjectStrategy,
  CloneObjectTypeStrategy
} from './objects.js';
import type { KeyMergeHandlerMapOptions } from './key-handler.js';
import type { EmptyArrayBehavior, EmptyObjectBehavior, NullBehavior } from './base.js';
/**
 * Cloning strategies for different data types during merge.
 */
export interface MergeCloneStrategyOptions {
  /**
   * Applied to base `current` object before merging values from `next`.
   * @default 'deep'
   */
  base?: CloneBaseStrategy;
  /**
   * Applied to plain objects (`{}`) when encountered during merge.
   * - Preserves property descriptors by default.
   * @default 'shallow'
   */
  plainObject?: ClonePlainObjectStrategy;
  /**
   * Applied to arrays when encountered during merge.
   * @default 'shallow'
   */
  array?: CloneArrayStrategy;
  /**
   * Applied to non-plain object types when encountered during merge.
   * @default 'shallow'
   */
  objectType?: Partial<CloneObjectTypeStrategy>;
}
/**
 * Handlers or strategies for merging different data types.
 */
export interface MergeDataTypeHandlerOptions<B, N> {
  /**
   * Handlers for specific object keys.
   * @example
   * ```ts
   * {
   *  key: {
   *    'settings': (curr:undefined | {theme:string}, next: {theme:string}) => ({ ...curr, theme: next.theme ?? curr?.theme ?? 'light' }),
   *    'metadata': 'replace'
   *  }
   * }
   * ```
   */
  key?: KeyMergeHandlerMapOptions<B, N>;
  /**
   * Handler or strategy for merging arrays.
   * @default 'replace'
   */
  array?: ArrayMergeStrategy;
  /**
   * Handler or strategy for merging primitive values.
   * @default 'replace'
   */
  primitive?: PrimitiveMergeStrategy;
  /**
   * Handlers or strategy for merging non-plain object types.
   * @default 'replace'
   */
  objectType?: ObjectTypeMergeStrategy;
  /**
   * Strategy for handling incoming empty objects.
   * - `overwrite`: Incoming empty objects (`{}`) overwrite current values.
   * - `skip`: Incoming empty objects are ignored, preserving current values.
   * @default 'skip'
   */
  emptyObject?: EmptyObjectBehavior;
  /**
   * Strategy for handling incoming empty arrays.
   * - `overwrite`: Incoming empty arrays (`[]`) overwrite current values.
   * - `skip`: Incoming empty arrays are ignored, preserving current values.
   * @default 'skip'
   */
  emptyArray?: EmptyArrayBehavior;
  /**
   * Behavior when encountering `null` values in the incoming `next` object.
   * - `omit`: Deletes the key from the merged result.
   * - `overwrite`: Incoming `null` values overwrite current values.
   * - `skip`: Incoming `null` values are ignored, preserving current values.
   * @default 'overwrite'
   */
  null?: NullBehavior;
}
export interface InitOptions<B = object, N = B> {
  /**
   * Cloning strategy for merged values.
   *
   * @see {@link MergeCloneStrategyOptions} for granular control
   *
   * **Presets:**
   * - `false | 'none'`: No cloning (fastest, but base is mutated)
   * - `true`: Balanced defaults (base: deep, array/plainObject/objectType: shallow)
   * - `'structured'`: Use structuredClone for all types (handles circular refs, but slower)
   * - `'deep'`: Deep clone all types where possible. Uses structured for array and {@link clone} for others.
   *
   * **Custom:**
   * - Object: Specify per-type strategies {@link MergeCloneStrategyOptions}
   *
   * @default true
   */
  clone?: MergeCloneStrategyOptions | boolean | 'structured' | 'deep' | 'none';
  /** @see {@link MergeDataTypeHandlerOptions} */
  on?: MergeDataTypeHandlerOptions<B, N>;
}
