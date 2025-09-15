export type * as Spatial from './spatial.js';

/**
 * Extracts optional properties from a type
 *
 * @example
 * ```ts
 * type User = { id: number, name?: string }
 * type Optional = ExtractOptional<User> // { name?: string }
 * ```
 */
export type ExtractOptional<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]: T[K];
};

/**
 * Extracts required properties from a type
 *
 * @example
 * ```ts
 * type User = { id: number, name?: string }
 * type Required = ExtractRequired<User> // { id: number }
 * ```
 */
export type ExtractRequired<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

//#region> Flow Control Types
/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy}
 *
 * @important NaN is also falsy but cannot be accurately represented in a type
 */
export type Falsy = -0 | '' | 0n | false | Nullish;
export type NonNullish<T> = Exclude<T, Nullish>;
/** @see {@link https://developer.mozilla.org/en-US/docs/Glossary/Nullish} */
export type Nullish = null | undefined;
/** @see {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy} */
export type Truthy<T> = T extends Falsy ? never : T;
//#endregion

export type Indexed<V, T, K extends string = string> = Record<K, V> & T;

/**
 * Removes readonly modifiers from top level properties of a type.
 *
 * @example
 * ```ts
 * type User = { readonly id: number, readonly name: string, readonly address: { street: string, zip?: number } }
 * type WritableUser = Mutable<User> // { id: number, name: string, address: { street: string, zip?: number } }
 * ```
 */
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Narrows a type to its most specific form.
 * Preserves string, number, boolean, bigint, and symbol literals.
 * Handles objects recursively.
 *
 * @example
 * ```ts
 * type A = Narrow<"hello"> // "hello"
 * type B = Narrow<string> // string
 * type C = Narrow<{ a: 1, b: "test", c: { d: true } }> // { readonly a: 1, readonly b: "test", readonly c: { readonly d: true } }
 * ```
 */
export type Narrow<T> =
  T extends string ?
    string extends T ?
      string
    : T
  : T extends number ?
    number extends T ?
      number
    : T
  : T extends boolean ?
    boolean extends T ?
      boolean
    : T
  : T extends bigint ?
    bigint extends T ?
      bigint
    : T
  : T extends symbol ?
    symbol extends T ?
      symbol
    : T
  : T extends undefined ? undefined
  : T extends null ? null
  : T extends object ? { readonly [K in keyof T]: Narrow<T[K]> }
  : T;

/**
 * Removes readonly modifiers from all properties of a type,
 * including nested objects.
 *
 * @example
 * ```ts
 * type User = { readonly name: string, readonly address: { readonly street: string } }
 * type WritableUser = NestedWritable<User> // { name: string, address: { street: string } }
 * ```
 */
export type NestedMutable<T> =
  T extends object ? { -readonly [P in keyof T]: NestedMutable<T[P]> } : T;

/**
 * Marks all properties of a type as optional, including nested objects.
 *
 * @example
 * ```ts
 * type User = { name: string, address: { street: string } }
 * type PartialUser = NestedPartial<User> // { name?: string, address?: { street?: string } }
 * ```
 */
export type NestedPartial<T> =
  T extends object ? { [P in keyof T]?: NestedPartial<T[P]> } : T;

/**
 * Marks all properties of a type as readonly, including nested objects.
 *
 * @example
 * ```ts
 * type User = { name: string, address: { street: string } }
 * type ReadonlyUser = NestedReadonly<User> // { readonly name: string, readonly address: { readonly street: string } }
 * ```
 */
export type NestedReadonly<T> =
  T extends object ? { readonly [P in keyof T]: NestedReadonly<T[P]> } : T;

/**
 * Marks all properties of a type as required, including nested objects.
 *
 * @example
 * ```ts
 * type User = { name?: string, address?: { street?: string } }
 * type RequiredUser = NestedRequired<User> // { name: string, address: { street: string } }
 * ```
 */
export type NestedRequired<T> =
  T extends object ? { [P in keyof T]-?: NestedRequired<T[P]> } : T;
/**
 * Mark keys K in T as optional (nested), keep the rest as original (optional or otherwise)
 * @example
 * ```ts
 * type User = { id: number, name?: string, address: { street: string } }
 * type PartialAddress = PartiallyOptional<User, 'address'> // { id: number, name?: string, address?: { street?: string } }
 * ```
 */
export type PartiallyOptional<T, K extends keyof T> = NestedPartial<Pick<T, K>>
  & Omit<T, K>;
/**
 * Mark keys K in T as required (nested), keep the rest as original (optional or otherwise)
 * @example
 * ```ts
 * type User = { id: number, name?: string, address?: { street?: string } }
 * type RequiredAddress = PartiallyRequired<User, 'address'> // { id: number, name?: string, address: { street: string } }
 * ```
 */
export type PartiallyRequired<T, K extends keyof T> = NestedRequired<Pick<T, K>>
  & Omit<T, K>;

/**
 * Extracts keys that are shared between two types
 *
 * @example
 * ```ts
 * type A = { id: number, name: string, age: number }
 * type B = { id: number, email: string }
 * type Shared = SharedKeys<A, B> // 'id'
 * ```
 */
export type SharedKeys<T, U> = keyof T & keyof U;

/**
 * Extracts keys that are unique to each of the two types
 * (i.e., keys that are in either T or U but not in both)
 *
 * @example
 * ```ts
 * type A = { id: number, name: string, age: number }
 * type B = { id: number, email: string }
 * type Unique = UniqueKeys<A, B> // 'name' | 'age' | 'email'
 * ```
 */
export type UniqueKeys<T, U> = Exclude<keyof T | keyof U, SharedKeys<T, U>>;

/**
 * Widens a type to its primitive counterpart.
 * Handles objects recursively.
 */
export type Widen<T> =
  T extends string ? string
  : T extends number ? number
  : T extends boolean ? boolean
  : T extends bigint ? bigint
  : T extends symbol ? symbol
  : T extends undefined ? undefined
  : T extends null ? null
  : T extends object ? { [K in keyof T]: Widen<T[K]> }
  : unknown;
