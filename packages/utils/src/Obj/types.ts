import type { Prim } from '../Prim/index.js';

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

/**
 * Creates a new object type by filtering properties of T whose values extend R
 *
 * @example
 * ```ts
 * type Mixed = { a: number, b: string, c: boolean }
 * type Numbers = FilterRecord<Mixed, number> // { a: number }
 * ```
 */
export type FilterRecord<T, R extends T[keyof T]> = Pick<
  T,
  { [K in keyof T]: T[K] extends R ? K : never }[keyof T]
>;

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

export type Narrow<T> =
  // preserve string literals
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

/** Excludes existing keys K from T */
export type OmitKeys<T, K extends keyof T> = Omit<T, K>;

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

export type PluckRecord<T, K extends keyof T[keyof T]> = {
  [P in keyof T]: T[P] extends Record<K, infer V> ? V : undefined;
};

export type StripNullish<T> = {
  [K in keyof T as [Extract<T[K], null | undefined>] extends [never] ? K
  : never]: StripNullish<NonNullable<T[K]>>;
};

/** Extracts string keys from an object */
export type StrKey<T> = keyof T & string;

/** Record type with string keys and values of type V (default to unknown) */
export type StrRecord<V = unknown> = Record<string, V>;

export type SymbolKey<T> = keyof T & symbol;

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
