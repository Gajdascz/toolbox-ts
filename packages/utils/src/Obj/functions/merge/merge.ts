import type { StrRecord } from '../../types.ts';

import { clone, is } from '../Obj.js';

export type MergeFn<R> = (current: R, next: unknown) => R;

/**
 * Behavior for merging arrays:
 * - `append` (default) → concatenate arrays and optionally deduplicate
 * - `prepend` → concatenate arrays with next array first and optionally deduplicate
 * - `overwrite` → replace current array with next array
 * - `merge` → merge arrays element-wise using deep merge logic
 */
type MergeArrayBehavior = 'append' | 'overwrite' | 'prepend';

export interface MergeOptions {
  array?: {
    behavior: MergeArrayBehavior;
    dedupe?: boolean;
    filter?: (item: unknown, index: number, array: unknown[]) => boolean;
  };

  /**
   * If true, empty object properties `{}` from `next`
   * overwrite existing populated properties in `current`.
   */
  retainEmptyObjectProps?: boolean;
}

export const mergeArr = (
  currArr: unknown[],
  nextArr: unknown[],
  { array = { behavior: 'overwrite' } }: Partial<MergeOptions> = {}
): unknown[] => {
  let result;
  switch (array.behavior) {
    case 'overwrite':
      result = clone(nextArr);
      break;
    case 'append':
      result = [...currArr, ...nextArr];
      break;

    case 'prepend':
      result = [...nextArr, ...currArr];
      break;
    default:
      throw new Error(`Unknown array merge behavior: ${array.behavior}`);
  }
  if (array.filter) result = result.filter(array.filter);
  if (array.dedupe) result = [...new Set(result)];
  return result;
};

/**
 * Recursively merges `next` into `current`.
 *
 * Rules:
 * - Non-object `next` → return `current` unchanged
 * - Arrays → deep cloned into result
 * - Non-object values → overwrite directly
 * - Objects → merged recursively
 * - Value in next is not in current → added to result
 * - Optionally preserve empty object properties
 *
 * @template R - Result type
 */
export const merge = <R, N = R>(
  /** Current object to merge into */
  current: R,
  /** Next object to merge from */
  next: N,
  /** Options for merging */
  opts: MergeOptions = {}
): N & R => {
  // 0. If next is not an object, return current as-is
  return !is.obj(next) || !is.obj(current) ?
      (current as N & R)
    : (Object.entries(next).reduce<StrRecord>(
        (acc, [key, value]) => {
          // 1. Skip prototype properties
          if (is.prototypeKey(key)) return acc;
          // 2. Handle arrays
          else if (Array.isArray(value))
            acc[key] =
              Array.isArray(acc[key]) ?
                mergeArr(acc[key], value, opts)
              : clone(value);
          // 3. Return Primitives
          else if (!is.obj(value)) acc[key] = value;
          // 4. Check for empty object
          else if (opts.retainEmptyObjectProps && is.empty(value))
            acc[key] = {};
          // 5. Merge objects
          else if (key in acc) acc[key] = merge(clone(acc[key]), value, opts);
          // 6. New object prop - clone it
          else acc[key] = clone(value);
          return acc;
        },
        clone(current as StrRecord)
      ) as N & R);
};
