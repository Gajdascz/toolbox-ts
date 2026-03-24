import type { RemoveIndexSignature } from '../modifier/index.js';

/**
 * Extracts the `enumerable` property from a PropertyDescriptor type.
 * Defaults to `true` if not explicitly defined (matches JavaScript behavior).
 *
 * @example
 * ```ts
 * type A = ExtractEnumerable<{ value: 1; enumerable: false }> // false
 * type B = ExtractEnumerable<{ value: 1; enumerable: true }> // true
 * type C = ExtractEnumerable<{ value: 1 }> // true (default)
 * ```
 */
export type ExtractEnumerable<P> = P extends { enumerable: infer E } ? E : true;

/**
 * Filters property descriptors to only include enumerable ones.
 * Properties without explicit `enumerable: false` are considered enumerable (JavaScript default).
 *
 * @example
 * ```ts
 * type Descriptors = {
 *   name: { value: 'Alice'; enumerable: true }
 *   age: { value: 30 } // enumerable defaults to true
 *   _internal: { value: 'secret'; enumerable: false }
 *   getId: { get(): string; enumerable: false }
 * }
 * type Result = Enumerable<Descriptors>
 * // { name: { value: 'Alice'; enumerable: true }, age: { value: 30 } }
 * ```
 */
export type Enumerable<P> = {
  [K in keyof P as P[K] extends { get: () => unknown } | { value: unknown }
    ? ExtractEnumerable<P[K]> extends false
      ? never
      : K
    : never]: P[K];
};
/**
 * A union of keys from enumerable property descriptors
 *
 * @example
 * ```ts
 * type Descriptors = {
 *   name: { value: 'Alice'; writable: false; enumerable: true; configurable: false }
 *   age: { value: 30; writable: true; enumerable: true; configurable: true }
 *   getId: { get(): string; enumerable: false; configurable: true }
 * }
 * type Result = EnumerableKeys<Descriptors> // 'name' | 'age'
 * ```
 */
export type EnumerableKeys<P> = keyof Enumerable<P>;

/**
 * A map of enumerable property descriptor entries
 *
 * @example
 * ```ts
 * type Descriptors = {
 *   name: { value: 'Alice'; writable: false; enumerable: true; configurable: false }
 *   age: { value: 30; writable: true; enumerable: true; configurable: true }
 *   getId: { get(): string; enumerable: false; configurable: true }
 * }
 * type Result = EnumerableEntries<Descriptors>
 * // {
 * //   name: ['name', string];
 * //   age: ['age', number];
 * // }
 * ```
 */
export type EnumerableEntries<P> = {
  [K in EnumerableKeys<P> as P[K] extends { value: unknown } ? K : never]: [K, InferValue<P[K]>];
};

/**
 * A union of value types from enumerable property descriptors
 * @example
 * ```ts
 * type Descriptors = {
 *   name: { value: 'Alice'; writable: false; enumerable: true; configurable: false }
 *   age: { value: 30; writable: true; enumerable: true; configurable: true }
 *   getId: { get(): string; enumerable: false; configurable: true }
 * }
 * type Result = InferEnumerableValues<Descriptors>
 * // {
 * //   name: string;
 * //   age: number;
 * // }
 * ```
 */
export type EnumerableValues<P> = {
  [K in EnumerableKeys<P>]: InferValue<P[K]>;
};

/**
 *
 * Infers the actual value type from a PropertyDescriptor
 *
 * @example
 * ```ts
 * type Desc = { value: 42 }
 * type Value = InferValue<Desc> // 42
 *
 * type Getter = { get(): string }
 * type GetValue = InferValue<Getter> // string
 *
 * ```
 */
export type InferValue<T> = T extends { value: infer V }
  ? V
  : T extends { get: () => infer G }
    ? G
    : T extends { set: (v: infer S) => void }
      ? S
      : unknown;

/**
 * A map of property descriptors to their inferred values
 *
 * @example
 * ```ts
 * type Descriptors = {
 *   id: { value: 'user-123' }
 *   count: { value: 42 }
 *   handler: { value: () => void }
 * }
 * type Result = InferValueMap<Descriptors>
 * // { id: 'user-123', count: 42, handler: () => void }
 * ```
 */
export type InferValueMap<P, Narrow extends boolean = false> = Narrow extends true
  ? InferValueMapNarrow<P>
  : InferValueMapWide<P>;

export type InferEnumerableValueMap<P, Narrow extends boolean = false> = Narrow extends true
  ? InferEnumerableValueMapNarrow<P>
  : InferEnumerableValueMapWide<P>;

/**
 * Maps property descriptors to their inferred values, only including properties
 * whose values are PropertyKey (string | number | symbol)
 * - Removes all non-explicitly defined index signatures
 *
 * Useful when you need to ensure all resulting properties can be used as object keys.
 *
 * @example
 * ```ts
 * type Descriptors = {
 *   id: { value: 'user-123' }
 *   count: { value: 42 }
 *   handler: { value: () => void }
 *   sym: { value: Symbol('key') }
 * }
 * type Result = InferValueMapNarrow<Descriptors>
 * // { id: 'user-123', count: 42, sym: symbol } (handler excluded)
 * ```
 */
export type InferValueMapNarrow<P> = RemoveIndexSignature<{
  [K in keyof P]: InferValue<P[K]>;
}>;
/**
 * Maps property descriptors to their inferred values, only including properties
 * whose values are PropertyKey (string | number | symbol)
 * - Removes all non-explicitly defined index signatures
 *
 * Useful when you need to ensure all resulting properties can be used as object keys.
 *
 * @example
 * ```ts
 * type Descriptors = {
 *   id: { value: 'user-123', enumerable: true }
 *   count: { value: 42, enumerable: true }
 *   handler: { value: () => void, enumerable: true }
 *   sym: { value: Symbol('key'), enumerable: true }
 *   hidden: { value: 'secret', enumerable: false }
 *   alsoHidden: { get: () => 'secret', enumerable: false }
 * }
 * type Result = InferEnumerableValueMapNarrow<Descriptors>
 * // { id: 'user-123', count: 42, sym: symbol } (handler, hidden, alsoHidden excluded)
 * ```
 */
export type InferEnumerableValueMapNarrow<P> = RemoveIndexSignature<{
  [K in EnumerableKeys<P>]: InferValue<P[K]>;
}>;

/**
 * Maps property descriptors to their inferred values, including ALL properties
 * (symbols, functions, objects, primitives, etc.)
 *
 * @example
 * ```ts
 * type Descriptors = {
 *   name: { value: 'Alice' }
 *   count: { value: 42 }
 *   getData: { value: () => string }
 *   [Symbol.iterator]: { value: () => Iterator<any> }
 * }
 * type Result = InferValueMapWide<Descriptors>
 * // { name: 'Alice', count: 42, getData: () => string, [Symbol.iterator]: () => Iterator<any> }
 * ```
 */
export type InferValueMapWide<P> = { [K in keyof P]: InferValue<P[K]> };
/**
 * Maps enumerable property descriptors to their inferred values, including ALL properties (symbols, functions, objects, primitives, etc.)
 *
 * @example
 * ```ts
 * type Descriptors = {
 *   name: { value: 'Alice'; enumerable: true }
 *   count: { value: 42; enumerable: true }
 *   getData: { value: () => string; enumerable: true }
 *   [Symbol.iterator]: { value: () => Iterator<any>; enumerable: true }
 *   hidden: { value: 'secret'; enumerable: false },
 *   alsoHidden: { get(): number; enumerable: false }
 * }
 * type Result = InferEnumerableValueMapWide<Descriptors>
 * // { name: 'Alice', count: 42, getData: () => string, [Symbol.iterator]: () => Iterator<any> } (hidden and alsoHidden excluded)
 * ```
 */
export type InferEnumerableValueMapWide<P> = {
  [K in EnumerableKeys<P>]: InferValue<P[K]>;
};
