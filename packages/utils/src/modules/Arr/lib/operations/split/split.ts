import type { Arr, Split } from '@toolbox-ts/types/defs/array';
export type SplitRoundType = 'ceil' | 'floor';
/**
 * Splits an array into two halves.
 * - The first half contains the first `<roundType>(length / 2)` elements.
 * - The second half contains the remaining elements.
 *
 * @pure
 *
 * @example
 * ```ts
 * split([1, 2, 3, 4]) // [[1, 2], [3, 4]]
 * split([1, 2, 3, 4, 5], 'floor') // [[1, 2], [3, 4, 5]]
 * split([1, 2, 3, 4, 5], 'ceil') // [[1, 2, 3], [4, 5]]
 * ```
 */
export const split = <T extends Arr = Arr>(
  arr: T,
  /**
   * Determines how to round the division of the array length by 2.
   * - 'ceil': Rounds up to the nearest integer.
   * - 'floor': Rounds down to the nearest integer.
   *
   * @default 'floor'
   */
  roundType: SplitRoundType = 'floor'
): Split<T> => {
  const halfNum = arr.length / 2;
  const mid = Math[roundType](halfNum);
  return [arr.slice(0, mid), arr.slice(mid)] as Split<T>;
};

export const splitAt = <T extends Arr = Arr>(arr: T, index: number): Split<T> =>
  [arr.slice(0, index), arr.slice(index)] as Split<T>;
