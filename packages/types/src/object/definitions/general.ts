import type { KeyCoerceNumber, KeyEnumerable, KeyString, KeySymbol } from './key/index.js';
import type { UnionToIntersection } from '../../general.js';

/**
 * Simplifies a type by flattening its structure and resolving any intersections.
 * This can make complex types easier to read and work with.
 *
 * @example
 * ```ts
 * type A = { a: number } & { b: string };
 * type B = Simplify<A>; // { a: number; b: string }
 *
 * type C = { a: number } & { a: string };
 * type D = Simplify<C>; // { a: never }
 * ```
 */
export type Simplify<T> = { [K in keyof T]: T[K] } & {};
/**
 * Recursively simplifies a type by flattening its structure and resolving any intersections at all levels.
 * This can make deeply nested types easier to read and work with.
 *
 * @example
 * ```ts
 * type A = { a:number; b: { c: string; d: { e:number } } } & { b: { d: { f: boolean } } }
 * type B = DeepSimplify<A>; // { a: number; b: { c: string; d: { e: number; f: boolean } } }
 * ```
 */
export type DeepSimplify<T> = T extends object ? { [K in keyof T]: DeepSimplify<T[K]> } : T;

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
export type InferPrototype<T> = T extends { prototype: infer P }
  ? P
  : T extends { __proto__: infer P }
    ? P
    : T extends null
      ? null
      : T extends object
        ? { [K in keyof T]: T[K] }
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

/**
 * Generates all valid dot-separated paths for a given object type T.
 *
 * @template T - The object type for which to generate paths.
 *
 * @example
 * ```ts
 * interface T {
 *   a: { b: { c: number } };
 *   d: string;
 * }
 * type Result = Paths<T>;
 * // Result is 'a' | 'a.b' | 'a.b.c' | 'd'
 * ```
 */
export type Paths<T> = T extends object
  ? {
      [K in KeyString<T>]: K | (Paths<T[K]> extends never ? never : `${K}.${Paths<T[K]>}`);
    }[KeyString<T>]
  : never;

/**
 * Gets the leaf paths (paths that do not lead to an object) of a given object type
 * @example
 * ```ts
 * interface T {
 *   a: { b: { c: number } };
 *   d: string;
 * }
 * type Result = PathLeaves<T>;
 * // Result is 'a.b.c' | 'd'
 * ```
 */
export type PathLeaves<T> = {
  [K in Paths<T>]: PathToValue<T, K> extends object ? never : K;
}[Paths<T>];

/**
 * Flattens a nested object type into a single-level object type with dot-separated keys
 * @example
 * ```ts
 * interface T {
 *   a: { b: { c: number } };
 *   d: string;
 * }
 * type Result = Flat<T>;
 * // Result is { 'a.b.c': number; 'd': string }
 * ```
 */
export type Flat<T> = {
  [K in PathLeaves<T>]: PathToValue<T, K>;
};

/**
 * Gets the type of the value at a given path in an object type
 *
 * @example
 * ```ts
 * interface T {
 *   a: { b: { c: { d: number } } };
 * }
 * type Result = PathToValue<T, 'a.b.c.d'>;
 * // Result is number
 * type Result2 = PathToValue<T, 'a.b.x'>;
 * // Result2 is never
 * ```
 */
export type PathToValue<T, K extends string> = K extends `${infer Head}.${infer Tail}`
  ? Head extends keyof T
    ? PathToValue<T[Head], Tail>
    : never
  : K extends keyof T
    ? T[K]
    : never;

/**
 * Builds a nested object type from a path string with a specified value type at the leaf
 *
 * @example
 * ```ts
 * type Result = PathToObjectWithValue<'a.b.c', number>;
 * // Result is { a: { b: { c: number } } }
 * type Result2 = PathToObjectWithValue<'x', string>;
 * // Result2 is { x: string }
 * ```
 */
export type ValuePathToObject<K extends string, V> = K extends `${infer Head}.${infer Tail}`
  ? { [P in Head]: ValuePathToObject<Tail, V> }
  : { [P in K]: V };

/**
 * Picks the value type at a given path in an object type and constructs an object type with that value at the leaf
 * @example
 * ```ts
 * interface T {
 *   a: { b: { c: number } };
 * }
 * type Result = PickPath<T, 'a.b.c'>;
 * // Result is { a: { b: { c: number } } }
 * type Result2 = PickPath<T, 'a.x'>;
 * // Result2 is never
 * ```
 */
export type PickPath<T, P extends Paths<T>> = ValuePathToObject<P, PathToValue<T, P>>;
export type PickPaths<T, P extends Paths<T>> = Simplify<
  UnionToIntersection<{ [K in P]: PickPath<T, K> }[P]>
>;

/**
 * Constructs an object type from an array of key-value pair tuples.
 *
 * @example
 * ```ts
 * type Entries = (['a', number] | ['b', string])[];
 * type Result = FromEntries<Entries>;
 * // Result is { a: number; b: string }
 * ```
 */
export type FromEntries<T extends Entries<StringRecord>> = {
  [K in T[number] as K[0]]: K[1];
};
