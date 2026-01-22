import type { Arr } from '@toolbox-ts/types/defs/array';

import { dedupe, type DedupeComparator } from '../dedupe/dedupe.js';

export type MergeBehavior =
  | 'append'
  | 'overwrite'
  | 'per-item'
  | 'prepend'
  | 'unique';

/**
 * Function type for merging individual items in an array.
 * @template T - The type of the array.
 * @param current - The current item in the array.
 * @param incoming - The incoming item to merge with the current item.
 * @param index - The index of the item in the array.
 *
 * @important If incoming or current is undefined, the defined value is automatically used and the function is not called. If both are undefined, the function is not called and undefined is used.
 */
export type MergeItemHandler<T extends Arr> = (
  current: T[number],
  incoming: T[number],
  index: number
) => T[number];

export type MergeOptions<T extends Arr> =
  | { behavior: 'per-item'; handler: MergeItemHandler<T> }
  | { behavior: 'unique'; comparator?: DedupeComparator<T[number][]> }
  | { behavior: Exclude<MergeBehavior, 'per-item' | 'unique'> };
export const merge = <T extends Arr>(
  { behavior, ...rest }: MergeOptions<T>,
  ...arrs: T[]
): T[number][] => {
  switch (behavior) {
    case 'per-item': {
      if (!('handler' in rest))
        throw new TypeError(
          'For "per-item" behavior, a MergeItemHandler must be provided.'
        );

      const maxLen = Math.max(...arrs.map((a) => a.length));
      const result: T[number][] = [];
      for (let i = 0; i < maxLen; i++) {
        let current = arrs[0]?.[i];
        for (let a = 1; a < arrs.length; a++) {
          const incoming = arrs[a]?.[i];
          if (current === undefined) current = incoming;
          else if (incoming !== undefined)
            current = rest.handler(current, incoming, i);
        }
        result[i] = current as T[number];
      }

      return result;
    }
    case 'overwrite': {
      for (let i = arrs.length - 1; i >= 0; i--) {
        const arr = arrs[i];
        if ((arr as unknown) !== undefined) return [...arr];
      }
      return [];
    }
    case 'append':
      return arrs.flat();
    case 'prepend':
      return arrs.toReversed().flat();
    case 'unique':
      return dedupe<T[number][]>(
        arrs.flat(),
        'comparator' in rest ? rest.comparator : undefined
      );
    default:
      throw new Error(`Unknown behavior: ${behavior}`);
  }
};
