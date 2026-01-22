import type { PrimitiveType } from '@toolbox-ts/types';
import type { StringRecord } from '@toolbox-ts/types/defs/object';

import { isNotNull, isPrimitive } from '../../../../core/guards/base/index.js';
import {
  assertIsObjectPlain,
  isObjectEmpty,
  isObjectPlain
} from '../../../../core/guards/objs/base/index.js';
import { Arr } from '../../../Arr/index.js';
import { entries } from '../base/base.js';
import { clone, cloneDeep } from '../clone/clone.js';

//#region Types
/** Handler for merging two arrays. */
export type MergeArrayHandler = (
  current: unknown[],
  next: unknown[]
) => unknown[];

export interface MergeOptions {
  /**
   * Controls whether `null` or empty object `{}` values can overwrite.
   * - `true`: Both null and empty objects overwrite
   * - `false`: Neither overwrite (default)
   * - `{ null?: boolean, emptyObject?: boolean }`: Fine-grained control
   */
  allowOverwrite?: { emptyObject?: boolean; null?: boolean } | boolean;

  /**
   * How to clone values.
   * - `'deep'`: Deep clone (default)
   * - `'shallow'`: Shallow clone
   * - `'none'`: No cloning (mutates current)
   */
  cloneStrategy?: 'deep' | 'none' | 'shallow';

  /**
   * Maximum recursion depth. At 0, `next` values replace `current` without recursion.
   * @default Infinity
   */
  maxDepth?: number;

  /** Custom handler for merging arrays. Default: replace. */
  onArray?: Arr.MergeOptions<unknown[]>;

  /** Custom handler for merging primitives. Default: replace. */
  onPrimitive?: MergePrimitiveHandler;
}

/** Handler for merging two primitive values. */
export type MergePrimitiveHandler = (
  current: unknown,
  next: Exclude<PrimitiveType, null | undefined>
) => unknown;

interface MergeContext {
  allowEmptyObjectOverwrite: boolean;
  allowNullOverwrite: boolean;
  cloneStrategy: 'deep' | 'none' | 'shallow';
  currentDepth: number;
  maxDepth: number;
  onArray: MergeArrayHandler;
  onPrimitive: MergePrimitiveHandler;
}
//#endregion

//#region Internal
const cloneValue = <T>(value: T, ctx: MergeContext): T => {
  if (ctx.cloneStrategy === 'none') return value;
  if (ctx.cloneStrategy === 'shallow')
    return clone(value, { strategy: 'shallow' });
  return cloneDeep(value);
};

const handlePrimitive = (
  current: unknown,
  next: Exclude<PrimitiveType, undefined>,
  ctx: MergeContext
): unknown => {
  if (isNotNull(next)) return ctx.onPrimitive(current, next);
  return ctx.allowNullOverwrite ? null : current;
};

const handleArray = (
  current: unknown,
  next: unknown[],
  ctx: MergeContext
): unknown[] => {
  if (Arr.is.value(current)) return ctx.onArray(current, next);
  return cloneValue(next, ctx);
};

const internalMerge = <R>(
  current: StringRecord,
  next: StringRecord,
  ctx: MergeContext
): R => {
  for (const [key, value] of entries(next)) {
    if (value === undefined) continue;

    // Primitives
    if (isPrimitive(value)) {
      current[key] = handlePrimitive(current[key], value, ctx);
      continue;
    }

    // Arrays
    if (Arr.is.value(value)) {
      current[key] = handleArray(current[key], value, ctx);
      continue;
    }

    // Non-plain objects (class instances) - just replace/clone
    if (!isObjectPlain(value)) {
      current[key] = clone(value);
      continue;
    }

    // Empty plain objects
    if (isObjectEmpty(value)) {
      if (ctx.allowEmptyObjectOverwrite) current[key] = {};
      continue;
    }

    // Plain objects - check depth before recursing
    if (ctx.currentDepth >= ctx.maxDepth) {
      // At max depth, replace instead of merging
      current[key] = cloneValue(value, ctx);
      continue;
    }

    // Ensure the current key is a plain object before recursing
    if (!isObjectPlain(current[key])) current[key] = {};
    // Plain objects - recurse
    current[key] = internalMerge(
      current[key] as StringRecord,
      value as StringRecord,
      { ...ctx, currentDepth: ctx.currentDepth + 1 }
    );
  }

  return current as R;
};
//#endregion

//#region Exported
/**
 * Recursively merges `next` into `current`, returning a new object.
 *
 * - `current` is not mutated (unless `cloneStrategy: 'none'`)
 * - `undefined` values in `next` are skipped
 * - Class instances are replaced, not merged
 * - Without handlers, values in `next` replace those in `current`
 *
 * @throws `TypeError` If `current` is not a plain object
 *
 * @example
 * ```ts
 * merge({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 });
 * // { a: 1, b: { c: 2, d: 3 }, e: 4 }
 *
 * // Custom array merging
 * merge({ arr: [1, 2] }, { arr: [3, 4] }, {
 *   onArray: (a, b) => [...a, ...b]
 * });
 * // { arr: [1, 2, 3, 4] }
 * ```
 */
export function merge<B, N, R = B & N>(
  current: B,
  next: N,
  {
    allowOverwrite = false,
    cloneStrategy = 'deep',
    maxDepth = Infinity,
    onArray = { behavior: 'overwrite' },
    onPrimitive = (_, b) => b
  }: MergeOptions = {}
): R {
  assertIsObjectPlain(current);
  if (!isObjectPlain(next) || maxDepth === 0) return current as R;

  const { emptyObject: allowEmptyObjectOverwrite, null: allowNullOverwrite } =
    typeof allowOverwrite === 'boolean' ?
      { emptyObject: allowOverwrite, null: allowOverwrite }
    : {
        emptyObject: allowOverwrite.emptyObject ?? false,
        null: allowOverwrite.null ?? false
      };

  const base =
    cloneStrategy === 'none' ?
      (current as StringRecord)
    : (cloneValue(current, { cloneStrategy } as MergeContext) as StringRecord);

  return internalMerge<R>(base, next as StringRecord, {
    allowEmptyObjectOverwrite,
    allowNullOverwrite,
    cloneStrategy,
    currentDepth: 0,
    maxDepth,
    onArray: (c: unknown[], n: unknown[]) => Arr.merge(onArray, c, n),
    onPrimitive
  });
}

/**
 * Recursively merges all objects into `base`.
 *
 * @important The last object has highest precedence.
 * @important Nullish values are skipped.
 */
export function mergeAll<B, N extends unknown[], R = B & N[number]>(
  base: B,
  others: [...N],
  opts?: MergeOptions
): R {
  let result = base as unknown as R;
  for (const obj of others) {
    if (obj != null) result = merge(result, obj, opts);
  }
  return result;
}
//#endregion
