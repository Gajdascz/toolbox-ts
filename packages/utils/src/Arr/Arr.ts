import type { Falsy, NonNullish, Nullish, Truthy } from '../types/index.js';

import { Prim } from '../Prim/index.js';

export type NonEmptyArray<T> = [T, ...T[]];
/** Type guard to check if an array is non-empty and all elements are of type T. */
export const isOfType = <T>(
  arr: unknown[],
  isValue?: (v: unknown) => v is T
): arr is NonEmptyArray<T> => {
  if (arr.length === 0) return false;
  isValue ??= (t: unknown): t is T => typeof t === typeof arr[0];
  return arr.every(isValue);
};
/**
 * Applies a transformation function to each element of an array,
 * filtering out any `undefined` results.
 *
 * Similar to [].map().filter() but only iterates once and expects undefined
 * to be used for filtering.
 *
 * @important Null values will not be filtered out. If you want to filter out nulls, use a transformation function that returns `undefined` for null inputs.
 *
 *
 * @template T - Type of elements in the input array
 * @template U - Type of elements in the output array
 */
export function transform<T, U>(arr: T[], fn: (item: T) => U | undefined): U[] {
  const result: U[] = [];
  for (const item of arr) {
    const mapped = fn(item);
    if (Prim.isNot.undefined(mapped)) result.push(mapped);
  }
  return result;
}

/**
 * Ensures the input is returned as an array.
 * - If the input is already an array, it is returned as-is.
 * - If the input is a single value, it is wrapped in an array.
 * - If the input is `null` or `undefined`, an empty array is returned.
 *
 *
 * @template V - Type of the input value
 * @example
 * ```ts
 * to(5) // [5]
 * to([1, 2, 3]) // [1, 2, 3]
 * to(null) // []
 * to(undefined) // []
 * ```
 */
export const to = <V = unknown>(v: V): V[] =>
  Prim.is.nullish(v) ? []
  : Array.isArray(v) ? v
  : [v];

/**
 * Removes `null` and `undefined` values from an array.
 * @template T - Type of elements in the input array
 * @example
 * ```ts
 * const compacted = compact([1, null, 2, undefined, 3]);
 * // compacted is [1, 2, 3]
 * ```
 */
export const compactNullish = <T>(arr: (Nullish | T)[]): NonNullish<T>[] =>
  arr.filter(Prim.isNot.nullish) as NonNullish<T>[];

/**
 * Removes all falsy values (`false`, `0`, `''`, `null`, `undefined`, `NaN`) from an array.
 * @template T - Type of elements in the input array
 * @example
 * ```ts
 * const compacted = compactFalsy([0, 1, false, 2, '', 3, null, undefined, NaN]);
 * // compacted is [1, 2, 3]
 * ```
 */
export const compactFalsy = <T>(arr: (Falsy | T)[]): Truthy<T>[] =>
  arr.filter(Prim.isNot.falsy) as Truthy<T>[];

/**
 * Returns the a reference to the longer array.
 *
 * @template A - Type of elements in the first array
 * @template B - Type of elements in the second array
 * @example
 * ```ts
 * longer([1, 2, 3], ['a', 'b']) // [1, 2, 3]
 * longer([1], ['a', 'b', 'c']) // ['a', 'b', 'c']
 * longer([], []) // []
 * ```
 */
export const longer = <A = unknown, B = unknown>(a: A[], b: B[]) =>
  a.length >= b.length ? a : b;
/**
 * Returns a reference to the shorter array.
 * @template A - Type of elements in the first array
 * @template B - Type of elements in the second array
 * @example
 * ```ts
 * shorter([1, 2, 3], ['a', 'b']) // ['a', 'b']
 * shorter([1], ['a', 'b', 'c']) // [1]
 * shorter([], []) // []
 * ```
 */
export const shorter = <A = unknown, B = unknown>(a: A[], b: B[]) =>
  a.length <= b.length ? a : b;
/**
 * Returns a reference to the longest array among the provided arrays.
 * @example
 * ```ts
 * longest([1, 2], ['a', 'b', 'c'], [true])
 * // ['a', 'b', 'c']
 * ```
 */
export const longest = (first: unknown[], ...rest: unknown[][]) =>
  rest.reduce(longer, first);
/**
 * Returns a reference to the shortest array among the provided arrays.
 *
 * @example
 * ```ts
 * shortest([1, 2], ['a', 'b', 'c'], [true])
 * // [true]
 * ```
 */
export const shortest = (first: unknown[], ...rest: unknown[][]) =>
  rest.reduce(shorter, first);

/**
 * Zips two arrays into an array of tuples.
 * - Stops at the length of the shorter array.
 * - If one array is longer, the excess elements are ignored.
 * @example
 * ```ts
 * zip([1, 2, 3], ['a', 'b', 'c'])
 * // [[1, 'a'], [2, 'b'], [3, 'c']]
 * zip([1, 2], ['a', 'b', 'c'])
 * // [[1, 'a'], [2, 'b']]
 * zip([1, 2, 3], ['a'])
 * // [[1, 'a']]
 * ```
 */
export function zip<A, B>(a: A[], b: B[]): [A, B][] {
  const length = Math.min(a.length, b.length);
  const result: [A, B][] = [];
  for (let i = 0; i < length; i++) result[i] = [a[i], b[i]];
  return result;
}

/**
 * Zips two arrays into an array of tuples.
 * - Fills missing values with the specified `fill` value.
 * - The length of the resulting array is equal to the longer of the two input arrays.
 * @example
 * ```ts
 * zipFill([1, 2, 3], ['a', 'b'], null)
 * // [[1, 'a'], [2, 'b'], [3, null]]
 * zipFill([1], ['a', 'b', 'c'], 0)
 * // [[1, 'a'], [0, 'b'], [0, 'c']]
 * ```
 */
export function zipFill<A, B, F>(a: A[], b: B[], fill: F): [A | F, B | F][] {
  const length = Math.max(a.length, b.length);
  const result: [A | F, B | F][] = [];

  for (let i = 0; i < length; i++)
    result[i] = [i < a.length ? a[i] : fill, i < b.length ? b[i] : fill];

  return result;
}
/**
 * Zips two arrays into an array of tuples, returning any excess elements from the longer array.
 * - The `zipped` array contains tuples of paired elements from both arrays, up to the length of the shorter array.
 * - The `remainder` contains the excess elements from the longer array.
 * - If both arrays are of equal length, `remainder` will be an empty array.
 * @example
 * ```ts
 * zipRemainder([1, 2, 3], ['a', 'b'], null)
 * // { zipped: [[1, 'a'], [2, 'b']], remainder: [3] }
 * zipRemainder([1], ['a', 'b', 'c'], 0)
 * // { zipped: [[1, 'a']], remainder: ['b', 'c'] }
 * zipRemainder([1, 2], ['a', 'b'], 0)
 * // { zipped: [[1, 'a'], [2, 'b']], remainder: [] }
 * ```
 */
export function zipRemainder<A, B>(
  a: A[],
  b: B[]
): { remainder: A[] | B[]; zipped: [A, B][] } {
  const length = Math.min(a.length, b.length);
  const result: [A, B][] = [];
  for (let i = 0; i < length; i++) result[i] = [a[i], b[i]];
  return {
    zipped: result,
    remainder: a.length > b.length ? a.slice(length) : b.slice(length)
  };
}
/**
 * Returns the last index of an array, -1 if empty.
 *
 * @example
 * ```ts
 * lastIndex([1, 2, 3]) // 2
 * lastIndex([]) // -1
 * ```
 */
export const lastIndex = <T>(arr: T[]) => arr.length - 1;
/**
 * Returns the last element of an array, or undefined if empty.
 * @example
 * ```ts
 * last([1, 2, 3]) // 3
 * last([]) // undefined
 * ```
 */
export const last = <T>(arr: T[]): T | undefined => arr.at(-1);
/**
 * Returns the last element of an array.
 *
 * @throws Will throw an error if the array is empty.
 * @example
 * ```ts
 * lastOrThrow([1, 2, 3]) // 3
 * lastOrThrow([]) // throws Error
 * ```
 */
export const lastOrThrow = <T>(arr: T[]): T => {
  const val = arr.at(-1);
  if (val === undefined) throw new Error('Array is empty, no last element');
  return val;
};
/**
 * Returns a new array with duplicate values removed, preserving the original order.
 * @template T - Type of elements in the input array
 * @example
 * ```ts
 * const uniqueArr = dedupe([1, 2, 2, 3, 1]);
 * // uniqueArr is [1, 2, 3]
 * ```
 */
export const dedupe = <T>(arr: T[]): T[] => [...new Set(arr)];
/**
 * Returns the first element of an array.
 *
 * @throws Will throw an error if the array is empty.
 * @template T - Type of elements in the input array
 * @example
 * ```ts
 * firstOrThrow([1, 2, 3]) // 1
 * firstOrThrow([]) // throws Error
 * ```
 */
export const firstOrThrow = <T>(arr: T[]): T => {
  const val = arr[0];
  if (val === undefined) throw new Error('Array is empty, no first element');
  return val;
};
/**
 * Groups elements of an array based on a key function.
 * - The key function is applied to each element to determine its group.
 * - Returns an object where each key is a group identifier and the value is an array of elements in that group.
 *
 * @template T - Type of elements in the input array
 * @template K - Type of the key used for grouping (must be a valid object key type)
 *
 * @example
 * ```ts
 * const grouped = group(
 *   ['apple', 'banana', 'apricot', 'blueberry'],
 *   (item) => item[0] // Group by first letter
 * );
 * // grouped is {
 * //   a: ['apple', 'apricot'],
 * //   b: ['banana', 'blueberry']
 * // }
 * ```
 */
export const group = <T, K extends PropertyKey>(
  arr: T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  const result = {} as Record<K, T[]>;
  for (const item of arr) {
    const key = keyFn(item);
    (result[key] as unknown) ??= [];
    result[key].push(item);
  }
  return result;
};
/**
 * Partitions an array into two arrays based on a predicate function.
 * - The first array contains elements that satisfy the predicate.
 * - The second array contains elements that do not satisfy the predicate.
 *
 * @template T - Type of elements in the input array
 *
 *
 * @example
 * ```ts
 * const [evens, odds] = partition([1, 2, 3, 4, 5], (n) => n % 2 === 0);
 * // evens is [2, 4]
 * // odds is [1, 3, 5]
 * ```
 */
export const partition = <T>(
  arr: T[],
  predicate: (item: T) => boolean
): [T[], T[]] => {
  const truthy: T[] = [];
  const falsy: T[] = [];
  for (const item of arr) (predicate(item) ? truthy : falsy).push(item);
  return [truthy, falsy];
};
/**
 * Splits an array into chunks of a specified size.
 * - The last chunk may be smaller if there are not enough elements.
 *
 * @template T - Type of elements in the input array
 *
 * @throws Will throw an error if the specified size is less than or equal to 0.
 *
 *
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5], 2)
 * // [[1, 2], [3, 4], [5]]
 *
 * chunk(['a', 'b', 'c', 'd'], 3)
 * // [['a', 'b', 'c'], ['d']]
 * ```
 */
export const chunk = <T>(arr: T[], size: number): T[][] => {
  if (size <= 0) throw new Error('Chunk size must be greater than 0');
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size)
    result.push(arr.slice(i, i + size));
  return result;
};
/**
 * Generates an array of numbers within a specified range.
 * - The range includes both the start and end values.
 * - Supports both ascending and descending ranges based on the start and end values.
 * - The step parameter defines the increment (or decrement) between consecutive numbers in the range.
 *
 * @throws Will throw an error if the step is less than or equal to 0.
 * @throws Will throw an error if start or end are not safe integers.
 *
 * @example
 * ```ts
 * range(1, 5) // [1, 2, 3, 4, 5]
 * range(5, 1) // [5, 4, 3, 2, 1]
 * range(1, 10, 2) // [1, 3, 5, 7, 9]
 * range(10, 1, 3) // [10, 7, 4, 1]
 * range(3, 3) // [3]
 * range(3, 3, 5) // [3]
 * range(1, 5, -1) // Error: Step must be greater than 0
 * range(5, 1, -2) // Error: Step must be greater than 0
 * ```
 *
 * @param start - The starting number of the range.
 * @param end - The ending number of the range.
 */
export const range = (start: number, end: number, step = 1): number[] => {
  if (step <= 0) throw new Error('Step must be greater than 0');
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end))
    throw new Error('range function only accepts integers');

  const result: number[] = [];
  if (end >= start) for (let i = start; i <= end; i += step) result.push(i);
  else for (let i = start; i >= end; i -= step) result.push(i);
  return result;
};

export type CloneStrategy<T = unknown> =
  | 'shallow'
  | 'structured'
  | ((v: T[]) => T[]);
/**
 * Defines how to merge arrays.
 * - 'append': Adds new elements to the end of the current array.
 * - 'overwrite': Replaces the current array with the last non-empty new array.
 * - 'prepend': Adds new elements to the beginning of the current array.
 * - Custom function: A user-defined function that takes the current array, the next array, and a clone function, returning a new merged array.
 *
 * @template T - Type of elements in the arrays
 *
 * @default 'overwrite'
 */
export type MergeBehavior<T> =
  | 'append'
  | 'overwrite'
  | 'prepend'
  | ((curr: T[], next: T[], c: typeof clone) => T[]);
export interface MergeOpts<T = unknown> {
  behavior?: MergeBehavior<T>;

  cloneStrategy?: CloneStrategy<T>;
  /**
   * Compacts the resulting array by removing empty values.
   *
   * - `true` or `'nullish'` removes all nullish {@link Nullish}
   *
   * - `'falsy'` removes all falsy {@link Falsy}
   *
   * - If omitted or `false`, no compaction is performed.
   */
  compact?: 'falsy' | 'nullish' | boolean;
  /**
   * Ensures all values in the resulting array are dedupe.
   * - If `true`, uses default dedupeness check (same as {@link dedupe}).
   * - If a function, uses the provided function to determine dedupeness.
   * - If omitted or `false`, no dedupeness filtering is performed.
   *
   * @see {@link dedupe}
   */
  dedupe?: ((item: T[]) => T[]) | boolean;
}
/**
 * Clones an array using the specified strategy.
 * - 'shallow': Creates a shallow copy using the spread operator.
 * - 'structured': Uses `structuredClone` for deep cloning (requires Node.js 17+).
 * - Custom function: A user-defined function that takes the array and returns a cloned array.
 *
 * @template T - Type of elements in the array
 *
 * @example
 * ```ts
 * const original = [{ a: 1 }, { b: 2 }];
 * const shallowClone = clone(original, 'shallow');
 * const deepClone = clone(original, 'structured');
 * const customClone = clone(original, (arr) => arr.map(item => ({ ...item })));
 * ```
 */
export const clone = <T>(
  arr: T[],
  strategy: 'shallow' | 'structured' | ((v: T[]) => T[]) = 'shallow'
) => {
  if (typeof strategy === 'function') return strategy(arr);
  return strategy === 'structured' ? structuredClone(arr) : [...arr];
};

/**
 * Merges two arrays based on the specified behavior.
 * - 'overwrite': Replaces the current array with the last non-empty new array.
 * - 'append': Adds new elements to the end of the current array.
 * - 'prepend': Adds new elements to the beginning of the current array.
 * - Custom function: A user-defined function that takes the current array, the next array, and a clone function, returning a new merged array.
 *
 * Additional options allow for compaction (removing empty values) and dedupeness filtering.
 *
 * @template T - Type of elements in the arrays
 *
 * @example
 * ```ts
 * merge([1, 2], [3, 4], { behavior: 'append' }) // [1, 2, 3, 4]
 * merge([1, 2], [3, 4], { behavior: 'prepend' }) // [3, 4, 1, 2]
 * merge([1, 2], [3, 4], { behavior: 'overwrite' }) // [3, 4]
 * merge([1, 2], [2, 3, 4], { behavior: 'append', dedupe: true }) // [1, 2, 3, 4]
 * merge([1, null, 2], [null, 3, 4], { behavior: 'append', compact: 'nullish' }) // [1, 2, 3, 4]
 * merge([1, 2], [[3, 4], [5]], { behavior: (curr, next, c) => c([...curr, ...next.flat()]) }) // [1, 2, 3, 4, 5]
 * ```
 */
export const merge = <T = unknown>(
  current: T[],
  next: T[] | T[][],
  {
    behavior = 'overwrite',
    compact,
    dedupe: _dedupe = false,
    cloneStrategy = 'shallow'
  }: MergeOpts<T> = {}
) => {
  let result: T[] = clone(current, cloneStrategy);
  if (next.length === 0) return result;
  const nextArrays = Array.isArray(next[0]) ? (next as T[][]) : [next as T[]];
  switch (behavior) {
    case 'overwrite': {
      for (let i = lastIndex(nextArrays); i >= 0; i--) {
        const nextArr = nextArrays.at(i);
        if (nextArr !== undefined) {
          result = clone(nextArr, cloneStrategy);
          break;
        }
      }
      break;
    }
    case 'append': {
      for (const arr of nextArrays)
        result = [...result, ...clone(arr, cloneStrategy)];
      break;
    }
    case 'prepend': {
      for (const arr of nextArrays)
        result = [...clone(arr, cloneStrategy), ...result];
      break;
    }
    default:
      if (typeof behavior === 'function')
        for (const arr of nextArrays) result = behavior(result, arr, clone);
  }

  if (compact === true || compact === 'nullish')
    result = compactNullish(result);
  else if (compact === 'falsy') result = compactFalsy(result);

  if (_dedupe === true) result = dedupe(result);
  else if (typeof _dedupe === 'function') result = _dedupe(result);

  return result;
};

/**
 * Creates and returns an array of specified length, filled with the provided initial value.
 *
 * @template T - Type of the initial value
 *
 * @default null
 *
 * @example
 * ```ts
 * init(3, 'a') // ['a', 'a', 'a']
 * init(5, 0) // [0, 0, 0, 0, 0]
 * init(0, true) // []
 * ```
 */
export const init = <T = null>(
  length: number,
  initialValue: ((index: number) => T) | T = null as T
): T[] => {
  if (!Number.isInteger(length) || length < 0)
    throw new Error('Length must be non-negative integer');
  return typeof initialValue === 'function' ?
      Array.from<number, T>({ length }, (_, i) =>
        (initialValue as (index: number) => T)(i)
      )
    : Array.from<number, T>({ length }, () => initialValue);
};

/**
 * Splits an array into two halves.
 * - The first half contains the first `ceil(length / 2)` elements.
 * - The second half contains the remaining elements.
 * - If the array has an odd length, the extra element goes to the first half.
 *
 * @template T - Type of elements in the input array
 *
 * @example
 * ```ts
 * half([1, 2, 3, 4]) // [[1, 2], [3, 4]]
 * half([1, 2, 3]) // [[1, 2], [3]]
 * half([]) // [[], []]
 * ```
 */
export const half = <T>(
  arr: T[],
  roundType: 'ceil' | 'floor' = 'floor'
): [T[], T[]] => {
  const halfNum = arr.length / 2;
  const mid = Math[roundType](halfNum);
  return [arr.slice(0, mid), arr.slice(mid)];
};

export const deep = {
  /**
   * Recursively removes `null` and `undefined` values from an array and any nested arrays.
   * @template T - Type of elements in the input array
   * @example
   * ```ts
   * const compacted = deep.compactNullish([1, null, [2, undefined, [3, null]], 4]);
   * // compacted is [1, [2, [3]], 4]
   * ```
   */
  compactNullish: <T>(arr: T[]): NonNullish<T>[] =>
    arr
      .map((v) =>
        Array.isArray(v) ? deep.compactNullish<T[keyof T]>(v)
        : Prim.isNot.nullish(v) ? v
        : undefined
      )
      .filter(Prim.isNot.nullish) as NonNullish<T>[],
  /**
   * Recursively removes all falsy values (`false`, `0`, `''`, `null`, `undefined`, `NaN`) from an array and any nested arrays.
   * @template T - Type of elements in the input array
   * @example
   * ```ts
   * const compacted = deep.compactFalsy([0, 1, false, [2, '', [3, null]], undefined, NaN, 4]);
   * // compacted is [1, [2, [3]], 4]
   * ```
   */
  compactFalsy: <T>(arr: T[]): Truthy<T>[] =>
    arr
      .map((v) =>
        Array.isArray(v) ? deep.compactFalsy<T[keyof T]>(v)
        : Prim.isNot.falsy(v) ? v
        : undefined
      )
      .filter(Prim.isNot.falsy) as Truthy<T>[]
} as const;
