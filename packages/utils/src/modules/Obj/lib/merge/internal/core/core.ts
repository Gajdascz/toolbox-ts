import type { StringRecord } from '@toolbox-ts/types/defs/object';
import { isNotNullish, isNullish, isPrimitive } from '../../../../../../core/guards/base/index.js';
import {
  assertIsObject,
  isObjectEmpty,
  isObject
} from '../../../../../../core/guards/objs/base/index.js';
import { Arr } from '../../../../../Arr/index.js';
import { allEntries } from '../../../base/base.js';
import type { Context, DeepMerge, InitOptions } from '../../types/index.js';
import type { NonNullish, Nullish } from '@toolbox-ts/types';

import { handleReplace, resolveOptions } from '../helpers/index.js';
import type { IntersectElementUnions } from '@toolbox-ts/types/defs/tuple';

const _merge = <B, N, R = DeepMerge<B, N, 'overwrite'>>(
  current: StringRecord,
  next: StringRecord,
  ctx: Context<N>
): R => {
  for (const [key, value] of allEntries(next)) {
    // Handle incoming null values based on nullBehavior
    if (value === null) {
      if (ctx.nullBehavior === 'overwrite') current[key] = null;
      else if (ctx.nullBehavior === 'omit') delete current[key];
      continue;
    }
    // Skip `undefined` `next` values (current value unchanged)
    if (value === undefined) continue;

    const currentValue = current[key];

    // Replace `undefined` or `null` current values
    if (currentValue == null) {
      current[key] = handleReplace(value, ctx);
      continue;
    }

    // Check for key-specific handler and invoke if present
    if (ctx.hasKeyHandler(key))
      current[key] = ctx.mergeKey(key, currentValue, value as NonNullish<N[typeof key]>);

    // Primitive values
    else if (isPrimitive(value)) current[key] = ctx.mergePrimitive(currentValue, value);
    // Arrays
    else if (Arr.is.any(value)) {
      if (value.length === 0) {
        if (ctx.overwriteWithEmptyArrays) current[key] = [];
        continue;
      }
      current[key] = ctx.mergeArray(currentValue, value);
    }
    // Non-plain objects
    else if (!isObject(value)) current[key] = ctx.mergeObjectType(currentValue, value);
    // Empty plain objects
    else if (isObjectEmpty(value) && ctx.overwriteWithEmptyObjects) current[key] = {};
    // Replace plain object at max depth
    else if (ctx.depth.curr >= ctx.depth.max) current[key] = ctx.clonePlainObject(value);
    // Recurse into plain objects and increment depth
    else {
      ctx.depth.curr++;
      current[key] = _merge(isObject(current[key]) ? current[key] : {}, value, ctx);
    }
  }
  return current as R;
};

export function initMerge<R = DeepMerge<unknown, unknown, 'overwrite'>>(
  current: unknown | Nullish,
  next: unknown | Nullish,
  /**
   * Maximum recursion depth. At 0, `next` values replace `current` without recursion.
   * @default Infinity
   */
  maxDepth: number = Infinity,
  { clone: cl = {}, on = {} }: InitOptions = {}
): R {
  if (isNullish(current)) return (isNotNullish(next) ? next : {}) as R;

  assertIsObject(current);
  if (!isObject(next) || maxDepth < 0) return current as R;

  const { cloneBase, ...ctx } = resolveOptions({ clone: cl, maxDepth, on }, _merge, handleReplace);
  return _merge<unknown, unknown, R>(cloneBase(current), next, ctx as Context<unknown>);
}
/**
 * Recursively merges all objects into `base`.
 *
 * @see {@link merge} for merge behavior and options.
 * @important The last object has highest precedence.
 * @important Nullish values are skipped.
 */
export function initMergeAll<
  B,
  N extends readonly unknown[] = readonly B[],
  R = DeepMerge<B, IntersectElementUnions<N>, 'overwrite'>
>(
  base: B | Nullish,
  next: [...(N | Nullish[])],
  /**
   * Maximum recursion depth. At 0, `next` values replace `current` without recursion.
   * @default Infinity
   */
  maxDepth: number = Infinity,
  { clone: cl = {}, on = {} }: InitOptions = {}
): R {
  if (isNullish(base)) base = {} as B;
  assertIsObject(base);
  if (maxDepth < 0) return base as R;

  const { cloneBase, ...ctx } = resolveOptions({ clone: cl, maxDepth, on }, _merge, handleReplace);
  let result: StringRecord | R = cloneBase(base as StringRecord);
  for (const obj of next) {
    if (isNullish(obj)) continue;
    result = _merge<unknown, unknown, R>(
      result as StringRecord,
      obj as StringRecord,
      ctx as Context<unknown>
    );
  }
  return result as R;
}
