import type {
  Append,
  Arr,
  Insert,
  Prepend
} from '@toolbox-ts/types/defs/array';
/**
 * Defines the strategy for inserting elements into an array.
 * - 'append': Appends the elements to the end of the array.
 * - 'prepend': Prepends the elements to the beginning of the array.
 * - number: Inserts the elements at the specified index.
 */
type InsertStrategy = 'append' | 'prepend' | number;

/**
 * Inserts elements into an array at a specified position.
 * - 'append': Appends the elements to the end of the array.
 * - 'prepend': Prepends the elements to the beginning of the array.
 * - number: Inserts the elements at the specified index.
 *
 * @pure
 *
 * @important If the provided element E is an array, it will be spread/flattened. To insert nested arrays, wrap them in another array.
 *
 * @example
 * ```ts
 * // basic append
 * insert([1, 2, 3], 4, 'append'); // [1, 2, 3, 4]
 * insert([1, 2, 3], [4, 5], 'append'); // [1, 2, 3, 4, 5]
 *
 * // basic prepend
 * insert([1, 2, 3], 0, 'prepend'); // [0, 1, 2, 3]
 * insert([1, 2, 3], [0, -1], 'prepend'); // [0, -1, 1, 2, 3]
 *
 *  // basic insert
 * insert([1, 2, 3], 99, 1); // [1, 99, 2, 3]
 * insert([1, 2, 3], [4, 5], 1); // [1, 4, 5, 2, 3]
 *
 * // inserting nested arrays
 * insert([1, 2, 3], [[4, 5]], 'append'); // [1, 2, 3, [4, 5]]
 * insert([1, 2, 3], [[4, 5]], 'prepend'); // [[4, 5], 1, 2, 3]
 * insert([1, 2, 3], [[4, 5]], 1); // [1, [4, 5], 2, 3]
 * ```
 *
 */
export function insert<T extends Arr = Arr, E = unknown>(
  t: T,
  E: E,
  s?: 'append'
): Append<T, E extends Arr ? E : [E]>;
export function insert<T extends Arr = Arr, E = unknown>(
  t: T,
  e: E,
  s?: 'prepend'
): Prepend<T, E extends Arr ? E : [E]>;
export function insert<T extends Arr = Arr, E = unknown>(
  t: T,
  e: E,
  s?: number
): Insert<T, E extends Arr ? E : [E]>;
export function insert<T extends Arr = Arr, E = unknown>(
  t: T,
  e: E,
  s: InsertStrategy = 'append'
) {
  const elements = Array.isArray(e) ? e : [e];
  switch (s) {
    case 'append':
      return [...t, ...elements];
    case 'prepend':
      return [...elements, ...t];
    default: {
      const index = Math.round(s < 0 ? t.length + s : s);
      const pos = Math.max(0, Math.min(index, t.length));
      return [...t.slice(0, pos), ...elements, ...t.slice(pos)];
    }
  }
}
