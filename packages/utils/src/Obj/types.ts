import type { Nullish } from '../types/index.js';

/**
 * Creates a new object type by filtering properties of T whose values extend R
 *
 * @example
 * ```ts
 * type Mixed = { a: number, b: string, c: boolean }
 * type Numbers = FilterRecord<Mixed, number> // { a: number }
 * ```
 */
export type Filtered<T, R extends T[keyof T]> = Pick<
  T,
  { [K in keyof T]: T[K] extends R ? K : never }[keyof T]
>;

export type Plucked<T, K extends keyof T[keyof T]> = {
  [Key in keyof T]: T[Key][K];
};

/**
 * Removes properties with null or undefined values from an object type, including nested objects.
 */
export type StripNullish<T> = {
  [K in keyof T as [Extract<T[K], Nullish>] extends [never] ? K
  : never]: StripNullish<NonNullable<T[K]>>;
};
export type StrKey<T> = Extract<keyof T, string>;
/**  An object with string keys */
export type StrRecord<V = unknown> = Record<string, V>;
