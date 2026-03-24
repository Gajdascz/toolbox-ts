import type { Arr } from '@toolbox-ts/types/defs/array';
/**
 * Returns a new array with duplicate values removed, preserving the original order.
 * - If a key function is provided, it is used to determine uniqueness.
 *
 * @important Uses `Set` for deduplication, which checks for strict equality (`===`). This means that for objects and arrays, only references are compared, not their contents.
 *
 * @important If a key function is provided and two items produce the same key, only the first is kept.
 *
 * @pure
 *
 * @example
 * ```ts
 * const arr1 = [1, 2, 2, 3, 1];
 * const uniqueArr = dedupe(arr1);
 * // uniqueArr is [1, 2, 3]
 *
 * const arr2 = [{a:1}, {b:2}, {a:1}];
 * const uniqueArr2 = dedupe(arr2);
 * // uniqueArr2 is [{a:1}, {b:2}, {a:1}] because the two {a:1} are different references
 * ```
 *
 * @example
 * ```ts
 * const arr = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 1, name: 'Alice' }
 * ];
 * const uniqueArr = dedupeBy(arr, item => item.id);
 * // uniqueArr is [
 * //   { id: 1, name: 'Alice' },
 * //   { id: 2, name: 'Bob' }
 * // ]
 * ```
 */
export const dedupe = <T extends Arr = Arr, K = unknown>(
  a: T,
  keyFn?: (item: T[number]) => K
): T => {
  if (!keyFn) return [...new Set(a)] as T;
  const seen = new Set<K>();
  const result: T[number][] = [];
  for (const item of a) {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result as T;
};

const _dedupeInPlaceBy = <T extends unknown[] = unknown[], K = unknown>(
  a: T,
  keyFn: (item: T[number]) => K
): T => {
  const seen = new Set<K>();
  let writeIndex = 0;

  for (let readIndex = 0; readIndex < a.length; readIndex++) {
    const item = a[readIndex];
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      a[writeIndex] = item;
      writeIndex++;
    }
  }

  a.length = writeIndex;
  return a;
};

/**
 * Removes duplicate values from the array in place, preserving the original order.
 * - If a key function is provided, it is used to determine uniqueness.
 *
 * @important Uses `Set` for deduplication, which checks for strict equality (`===`). This means that for objects and arrays, only references are compared, not their contents.
 *
 * @important If a key function is provided and two items produce the same key, only the first is kept.
 *
 * @example
 * ```ts
 * const arr = [1, 2, 2, 3, 1];
 * dedupeInPlace(arr);
 * // arr is now [1, 2, 3]
 *
 * const arr2 = [{a:1}, {b:2}, {a:1}];
 * dedupeInPlace(arr2);
 * // arr2 is now [{a:1}, {b:2}, {a:1}] because the two {a:1} are different references
 * ```
 *
 * @example
 * ```ts
 * const arr = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 1, name: 'Alice' }
 * ];
 * dedupeInPlace(arr, item => item.id);
 * // arr is now [
 * //   { id: 1, name: 'Alice' },
 * //   { id: 2, name: 'Bob' }
 * // ]
 * ```
 */
export const dedupeInPlace = <T extends unknown[] = unknown[], K = unknown>(
  a: T,
  keyFn?: (item: T[number]) => K
): T => {
  if (keyFn) return _dedupeInPlaceBy(a, keyFn);

  const seen = new Set();
  let writeIndex = 0;

  for (let readIndex = 0; readIndex < a.length; readIndex++) {
    const item = a[readIndex];
    if (!seen.has(item)) {
      seen.add(item);
      a[writeIndex] = item;
      writeIndex++;
    }
  }

  a.length = writeIndex;
  return a;
};
