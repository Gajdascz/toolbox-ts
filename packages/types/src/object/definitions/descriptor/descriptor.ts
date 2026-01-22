import type { RemoveIndexSignature } from '../modifier/index.js';
/**
 * A map of enumerable property descriptors
 *
 * @example
 * ```ts
 * type Descriptors = {
 *   name: { value: 'Alice'; writable: false; enumerable: true; configurable: false }
 *   age: { value: 30; writable: true; enumerable: true; configurable: true }
 *   getId: { get(): string; enumerable: false; configurable: true }
 * }
 * type Result = PropertyDescriptorMap<Descriptors>
 * // {
 * //   name: {value: string; writable: boolean; enumerable: boolean; configurable: boolean};
 * //   age: {value: number; writable: boolean; enumerable: boolean; configurable: boolean};
 * //   getId: {get: () => string; enumerable: boolean; configurable: boolean};
 * // }
 * ```
 */
export type Enumerable<P> = {
  [K in keyof P as P[K] extends (
    { enumerable: true } & ({ get: () => unknown } | { value: unknown })
  ) ?
    K
  : never]: P[K];
};

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
  [K in EnumerableKeys<P> as P[K] extends { value: unknown } ? K : never]: [
    K,
    InferValue<P[K]>
  ];
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
export type InferValue<T> =
  T extends { value: infer V } ? V
  : T extends { get: () => infer G } ? G
  : T extends { set: (v: infer S) => void } ? S
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
export type InferValueMap<P, Narrow extends boolean = false> =
  Narrow extends true ? InferValueMapNarrow<P> : InferValueMapWide<P>;
/**
 * Maps property descriptors to their inferred values, only including properties
 * whose values are PropertyKey (string | number | symbol)
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
