import type { Arr } from '@toolbox-ts/types/defs/array';

/**
 * Defines how to clone arrays.
 * - 'shallow': Creates a shallow copy using the spread operator.
 * - 'structured': Uses `structuredClone` for deep cloning (requires Node.js 17+).
 * - Custom function: A user-defined function that takes the array and returns a cloned array.
 */
export type CloneStrategy<T extends Arr = Arr> =
  | 'structured'
  | 'shallow'
  | { depth: number; handler: (v: T[number]) => T[number] };
/**
 * Clones an array using the specified strategy.
 * - 'shallow': Creates a shallow copy using the spread operator.
 * - 'structured': Uses `structuredClone` for deep cloning (requires Node.js 17+).
 * - Custom function: A user-defined function that takes the array and returns a cloned array.
 *
 * @pure
 *
 * @example
 * ```ts
 * const original = [{ a: 1 }, { b: 2 }];
 * const shallowClone = clone(original, 'shallow');
 * const deepClone = clone(original, 'structured');
 * const customClone = clone(original, (arr) => arr.map(item => ({ ...item })));
 * ```
 */
export const clone = <T extends Arr = Arr>(arr: T, strategy: CloneStrategy<T> = 'shallow'): T => {
  if (strategy === 'shallow') return [...arr] as T;
  if (strategy === 'structured') return structuredClone(arr);
  const array = [...arr];
  for (let i = 0; i < strategy.depth; i++) array[i] = strategy.handler(array[i]);

  return array as T;
};
