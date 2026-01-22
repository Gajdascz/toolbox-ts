import type { KeyCoerceNumber, KeyEnumerable, KeySymbol } from './key/index.js';
/**
 * Infers the prototype type of a given object type
 * - If the type has a `prototype` property, infers that
 * - If the type has a `__proto__` property, infers that
 * - If the type is `null`, returns `null`
 * - If the type is an object without prototype properties, returns the object shape
 * - Otherwise, returns `unknown`
 * @example
 * ```ts
 * class MyClass {
 *   myMethod() {}
 * }
 * type Result = InferPrototype<typeof MyClass> // { myMethod(): void }
 *
 * interface T {
 *   a: number;
 *   b: string;
 * }
 * type Result2 = InferPrototype<T> // { a: number; b: string }
 *
 * type Result3 = InferPrototype<null> // null
 * ```
 */
export type InferPrototype<T> =
  T extends { prototype: infer P } ? P
  : T extends { __proto__: infer P } ? P
  : T extends null ? null
  : T extends object ? { [K in keyof T]: T[K] }
  : unknown;

//#region> Records
/** An object with string keys */
export type StringRecord<V = unknown> = Record<string, V>;
//#endregion

//#region> Enumerable Return Types
export type Entries<T> = Entry<T>[];
export type Entry<T> = { [K in keyof T]: [KeyCoerceNumber<K>, T[K]] }[keyof T];
export type Keys<T> = KeyEnumerable<T>[];
export type Values<T> = T[keyof T][];
//#endregion
//#region> Symbol Return Types
export type SymbolEntries<T> = SymbolEntry<T>[];
export type SymbolEntry<T> = { [K in KeySymbol<T>]: [K, T[K]] }[KeySymbol<T>];
export type Symbols<T> = KeySymbol<T>[];
export type SymbolValues<T> = T[KeySymbol<T>][];
//#endregion

/**
 * Makes T indexable with values of type V.
 *
 * @example
 * ```ts
 * interface T {
 *   a: number;
 *   b: string;
 * }
 * type Result = MapIndexable<T, boolean>;
 * // Result is { [key: PropertyKey]: boolean } & { a: boolean; b: boolean }
 * ```
 */
export type MapIndexable<T, V> = { [K in keyof ToIndexable<T>]: V };

/**
 * Converts a type to an indexable type with `PropertyKey` keys and `unknown` values,
 * while preserving the enumerable keys of the original type.
 * @example
 * ```ts
 * interface T {
 *   a: number;
 *   b: string;
 * }
 * type Result = ToIndexable<T>;
 * // Result is { [key: PropertyKey]: unknown } & { a: number; b: string }
 * ```
 */
export type ToIndexable<T> = { [key: PropertyKey]: unknown } & {
  [K in keyof T as KeyEnumerable<T>]: T[K];
};
