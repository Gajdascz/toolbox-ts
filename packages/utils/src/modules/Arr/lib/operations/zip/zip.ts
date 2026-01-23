import type {
  Arr,
  Zip,
  ZipFill,
  ZipRemainderObj
} from '@toolbox-ts/types/defs/array';

/**
 * Zips two arrays together and returns the zipped array.
 * The length of the returned array is equal to the length of the shorter input array and discards the remaining elements of the longer array.
 *
 * @param a - The first array to zip.
 * @param b - The second array to zip.
 * @returns The zipped array.
 *
 * @example
 * ```ts
 * zip([1, 2], ['a', 'b', 'c'])
 * // [[1, 'a'], [2, 'b']]
 * ```
 */
export function zip<A extends Arr = Arr, B extends Arr = Arr>(
  a: A,
  b: B
): Zip<A, B> {
  const len = Math.min(a.length, b.length);
  const result: unknown[] = [];
  for (let i = 0; i < len; i++) result[i] = [a[i], b[i]];
  return result as Zip<A, B>;
}
/**
 * Zips two arrays together and fills the shorter array with a specified value.
 *
 * @param a - The first array to zip.
 * @param b - The second array to zip.
 * @param fill - The value to fill the shorter array with.
 * @returns The zipped array with the shorter array filled with the specified value.
 *
 * @example
 * ```ts
 * zipFill([1, 2], ['a', 'b', 'c'], null)
 * // [[1, 'a'], [2, 'b'], [null, 'c']]
 * ```
 */
export function zipFill<A extends Arr = Arr, B extends Arr = Arr, F = null>(
  a: A,
  b: B,
  fill?: F
): ZipFill<A, B, F> {
  if (a.length === 0) return b.map((v) => [fill, v]) as ZipFill<A, B, F>;
  if (b.length === 0) return a.map((v) => [v, fill]) as ZipFill<A, B, F>;
  const len = Math.max(a.length, b.length);
  const result: unknown[] = [];
  const f = fill ?? null;
  for (let i = 0; i < len; i++)
    result[i] = [i < a.length ? a[i] : f, i < b.length ? b[i] : f];
  return result as ZipFill<A, B, F>;
}

/**
 * Zips two arrays together and returns the zipped array along with the remainder of the longer array.
 * If one of the arrays is empty, the remainder will be the non-empty array.
 *
 * @param a - The first array to zip.
 * @param b - The second array to zip.
 * @returns An object containing the zipped array and the remainder of the longer array.
 *
 * @example
 * ```ts
 * zipRemainder([1, 2], ['a', 'b', 'c'])
 * // { zipped: [[1, 'a'], [2, 'b']], remainder: ['c'] }
 * ```
 */
export function zipRemainder<A extends Arr = Arr, B extends Arr = Arr>(
  a: A,
  b: B
): ZipRemainderObj<A, B> {
  if (a.length === 0)
    return { zipped: [], remainder: b } as ZipRemainderObj<A, B>;
  if (b.length === 0)
    return { zipped: [], remainder: a } as ZipRemainderObj<A, B>;
  const len = Math.min(a.length, b.length);
  const result: unknown[] = [];
  for (let i = 0; i < len; i++) result[i] = [a[i], b[i]];
  return {
    zipped: result,
    remainder: a.length > b.length ? a.slice(len) : b.slice(len)
  } as ZipRemainderObj<A, B>;
}

export function zipWith<A extends Arr = Arr, B extends Arr = Arr, R = unknown>(
  a: A,
  b: B,
  fn: (a: A[number], b: B[number]) => R
): R[] {
  const len = Math.min(a.length, b.length);
  const result: R[] = [];
  for (let i = 0; i < len; i++) result[i] = fn(a[i], b[i]);
  return result;
}
