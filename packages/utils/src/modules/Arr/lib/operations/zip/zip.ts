import type {
  Arr,
  Zip,
  ZipFill,
  ZipRemainderObj
} from '@toolbox-ts/types/defs/array';
/**
 * Defines the mode of zipping two arrays.
 * - 'default': Stops at the length of the shorter array.
 * - 'fill': Continues to the length of the longer array, filling missing values with a specified fill value.
 * - 'remainder': Continues to the length of the shorter array and returns the excess elements from the longer array separately.
 *
 * @example
 * ```ts
 * zip([1, 2], ['a', 'b', 'c'], 'default')
 * // [[1, 'a'], [2, 'b']]
 *
 * zip([1, 2], ['a', 'b', 'c'], 'fill', null)
 * // [[1, 'a'], [2, 'b'], [null, 'c']]
 *
 * zip([1, 2], ['a', 'b', 'c'], 'remainder')
 * // { zipped: [[1, 'a'], [2, 'b']], remainder: ['c'] }
 * ```
 */
export type ZipMode = 'default' | 'fill' | 'remainder';
/**
 * Zips two arrays into an array of tuples.
 *
 * @see {@link ZipMode} for different zipping modes.
 */
export function zip<A extends Arr = Arr, B extends Arr = Arr>(
  a: A,
  b: B,
  mode?: 'default'
): Zip<A, B>;
export function zip<A extends Arr = Arr, B extends Arr = Arr, F = null>(
  a: A,
  b: B,
  mode?: 'fill',
  fill?: F
): ZipFill<A, B, F>;
export function zip<A extends Arr = Arr, B extends Arr = Arr>(
  a: A,
  b: B,
  mode?: 'remainder'
): ZipRemainderObj<A, B>;
export function zip<A extends Arr = Arr, B extends Arr = Arr, F = null>(
  a: A,
  b: B,
  mode?: ZipMode,
  fill?: F
): Zip<A, B> | ZipFill<A, B, F> | ZipRemainderObj<A, B>;
export function zip<A extends Arr = Arr, B extends Arr = Arr, F = null>(
  a: A,
  b: B,
  mode: ZipMode = 'default',
  fill?: F
) {
  if (a.length === 0 && b.length === 0)
    return mode === 'remainder' ? { zipped: [], remainder: [] } : [];
  const result: unknown[] = [];
  let len: number;
  let push: (i: number) => void;

  switch (mode) {
    case 'fill':
      if (a.length === 0) return b.map((v) => [fill, v]) as ZipFill<A, B, F>;
      if (b.length === 0) return a.map((v) => [v, fill]) as ZipFill<A, B, F>;
      len = Math.max(a.length, b.length);
      push = (i) =>
        (result[i] = [i < a.length ? a[i] : fill, i < b.length ? b[i] : fill]);
      break;

    case 'remainder':
      if (a.length === 0)
        return { zipped: [], remainder: b } as ZipRemainderObj<A, B>;
      if (b.length === 0)
        return { zipped: [], remainder: a } as ZipRemainderObj<A, B>;
      len = Math.min(a.length, b.length);
      push = (i) => (result[i] = [a[i], b[i]]);
      break;

    default:
      if (a.length === 0 || b.length === 0) return [];
      len = Math.min(a.length, b.length);
      push = (i) => (result[i] = [a[i], b[i]]);
  }
  for (let i = 0; i < len; i++) push(i);
  return mode === 'remainder' ?
      {
        zipped: result,
        remainder: a.length > b.length ? a.slice(len) : b.slice(len)
      }
    : result;
}
