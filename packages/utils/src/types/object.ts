import type { Nullish } from './general.js';

//#region> Extract Types
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
export type Filter<T, R extends T[keyof T]> = Pick<
  T,
  { [K in keyof T]: T[K] extends R ? K : never }[keyof T]
>;
/**
 * Extracts 1-level nested property values from an object type and raises them to the top level.
 *
 * @example
 * ```ts
 * type Obj = { a: { id: number, name: string }, b: { id: number, age: number } }
 * type PluckedIds = Plucked<Obj, 'id'> // { a: number, b: number }
 * ```
 */
export type Pluck<T, K extends keyof T[keyof T]> = {
  [Key in keyof T]: T[Key][K];
};
/**
 * Removes properties with null or undefined values from an object type, including nested objects.
 */
export type StripNullish<T> = {
  [K in keyof T as [Extract<T[K], Nullish>] extends [never] ? K
  : never]: StripNullish<NonNullable<T[K]>>;
};
//#endregion

//#region> Keys
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
 * All keys of T that are of type string
 *
 * @example
 * ```ts
 * type User = { id: number, name: string, 0: boolean }
 * type StringKeys = StrKey<User> // 'id' | 'name'
 * ```
 */
export type StrKey<T> = Extract<keyof T, string>;
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
//#endregion

//#region> Property Modifiers
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
 * type RequiredAddress = RequiredProps<User, 'address'> // { id: number, name?: string, address: { street: string } }
 * ```
 */
export type RequiredProps<T, K extends keyof T> = NestedRequired<Pick<T, K>>
  & Omit<T, K>;

//#region> Nested
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
//#endregion

//#endregion

/**  An object with string keys */
export type StrRecord<V = unknown> = Record<string, V>;
