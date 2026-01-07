import type { Nullish } from '../../general.js';

//#region> Extract Types
/**
 * Extracts non-primitive properties from a type
 *
 * @shallow
 *
 * @example
 * ```ts
 * type User = { id: number, name: string, address: { street: string }, siblings: string[] }
 * type NonPrimitives = ExtractNonPrimitive<User> // { address: { street: string }, siblings: string[] }
 * ```
 */
export type ExtractNonPrimitives<T> = {
  [K in keyof T as NonNullable<T[K]> extends object ? K : never]: T[K];
};
/**
 * Extracts optional properties from a type
 *
 * @shallow
 *
 * @example
 * ```ts
 * type User = { id: number, name?: string }
 * type Optional = ExtractOptional<User> // { name?: string }
 * ```
 */
export type ExtractOptional<T> = Pick<T, OptionalKeys<T>>;

/**
 * Extracts primitive properties from a type
 *
 * @shallow
 *
 * @example
 * ```ts
 * type User = { id: number, name: string, address: { street: string } }
 * type Primitives = ExtractPrimitive<User> // { id: number, name: string }
 * ```
 */
export type ExtractPrimitives<T> = {
  [K in keyof T as NonNullable<T[K]> extends object ? never : K]: T[K];
};
/**
 * Extracts required properties from a type
 *
 * @shallow
 *
 * @example
 * ```ts
 * type User = { id: number, name?: string }
 * type Required = ExtractRequired<User> // { id: number }
 * ```
 */
export type ExtractRequired<T> = Pick<T, RequiredKeys<T>>;
/**
 * Creates a new object type by filtering properties of T whose values extend R
 *
 * @shallow
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
 * Removes properties with null or undefined values from an object type, including nested objects.
 * @deep
 */
export type StripNullish<T> =
  // 1. Preserve functions as-is
  T extends (...args: any[]) => unknown ? T
  : // 2. Handle arrays / tuples
  T extends readonly (infer U)[] ? readonly StripNullish<NonNullable<U>>[]
  : T extends (infer U)[] ? StripNullish<NonNullable<U>>[]
  : // 3. Handle objects
  T extends object ?
    {
      [K in keyof T as [Extract<T[K], Nullish>] extends [never] ? K
      : never]: StripNullish<NonNullable<T[K]>>;
    }
  : // 4. Primitives
    T;
//#endregion

//#region> Keys
export type OptionalKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? K : never;
}[keyof T];

export type RequiredKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? never : K;
}[keyof T];
/**
 * Extracts keys that are shared between two types
 *
 * @shallow
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
 * @shallow
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
 * @shallow
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
 * @shallow
 *
 * @example
 * ```ts
 * type User = { readonly id: number, readonly name: string, readonly address: { street: string, zip?: number } }
 * type WritableUser = Mutable<User> // { id: number, name: string, address: { street: string, zip?: number } }
 * ```
 */
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };
/**
 * Mark keys K in T as required, keep the rest as original (optional or otherwise)
 * @shallow
 */
export type RequiredProps<T, K extends keyof T> = Omit<T, K>
  & Required<Pick<T, K>>;

//#region> Nested
/**
 * Removes readonly modifiers from all properties of a type,
 * including nested objects.
 *
 * @deep
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
 * @deep
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
 * Mark keys K in T as optional (nested), keep the rest as original (optional or otherwise)
 *
 * @deep
 *
 * @example
 * ```ts
 * type User = { id: number, name?: string, address: { street: string } }
 * type PartialAddress = PartiallyOptional<User, 'address'> // { id: number, name?: string, address?: { street?: string } }
 * ```
 */
export type NestedPartiallyOptional<T, K extends keyof T> = NestedPartial<
  Pick<T, K>
>
  & Omit<T, K>;

/**
 * Marks all properties of a type as readonly, including nested objects.
 *
 * @deep
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
 * @deep
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
 * Mark keys K in T as required (nested), keep the rest as original (optional or otherwise)
 *
 * @deep
 *
 * @example
 * ```ts
 * type User = { id: number, name?: string, address?: { street?: string } }
 * type RequiredAddress = RequiredProps<User, 'address'> // { id: number, name?: string, address: { street: string } }
 * ```
 */
export type NestedRequiredProps<T, K extends keyof T> = NestedRequired<
  Pick<T, K>
>
  & Omit<T, K>;

//#endregion

//#endregion

/**
 * A tuple type representing key-value pairs of an object type T
 *
 * @example
 * ```ts
 * type User = { id: number, name: string }
 * type UserEntries = Entries<User> // ['id', number] | ['name', string]
 * ```
 */
export type Entries<T> = { [K in StrKey<T>]: [K, T[K]] }[StrKey<T>];
/**
 * Extracts the values of a record type T
 *
 * @example
 * ```ts
 * type Obj = { a: number, b: string, c: boolean }
 * type RecordValues = ExtractRecordValues<Obj> // number | string | boolean
 * ```
 */
export type ExtractRecordValues<T extends StrRecord> = {
  [K in keyof T]: T[K];
}[keyof T];
/**
 * An array of the keys of an object type T
 *
 * @example
 * ```ts
 * type User = { id: number, name: string }
 * type UserKeys = Keys<User> // ('id' | 'name')[]
 * ```
 */
export type Keys<T> = StrKey<T>[];
/**
 * Keys that are part of the object's prototype
 * @see {@link https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Advanced_JavaScript_objects/Object_prototypes#the_prototype_chain}
 */
export type PrototypeKey = '__proto__' | 'constructor' | 'prototype';
/** An object with string keys */
export type StrRecord<V = unknown> = Record<string, V>;

/**
 * An array of the values of an object type T
 *
 * @example
 * ```ts
 * type User = { id: number, name: string }
 * type UserValues = Values<User> // (number | string)[]
 * ```
 */
export type Values<T> = T[StrKey<T>][];
