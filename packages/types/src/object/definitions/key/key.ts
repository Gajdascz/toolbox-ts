//#region> Base

/**
 * Extracts keys of T that are of type K
 *
 * @shallow
 * @example
 * ```ts
 * type User = { id: number, name: string, 0: boolean }
 * type NumKeys = OfType<User, number> // 0
 * ```
 */
export type OfType<T, K extends PropertyKey> = Extract<keyof T, K>;
/**
 * Keys that are part of the object's prototype
 * @see {@link https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Advanced_JavaScript_objects/Object_prototypes#the_prototype_chain}
 */
export type Prototype = '__proto__' | 'constructor' | 'prototype';
//#endregion

//#region> KeysOfType
/**
 * All keys of T that are of type number
 *
 * @shallow
 *
 * @example
 * ```ts
 * type User = { id: number, name: string, 0: boolean }
 * type Numbers = Number<User> // 0
 * ```
 */
export type Number<T> = OfType<T, number>;
/**
 * All keys of T that are of type string
 *
 * @shallow
 *
 * @example
 * ```ts
 * type User = { id: number, name: string, 0: boolean }
 * type Strings = String<User> // 'id' | 'name'
 * ```
 */
export type String<T> = OfType<T, string>;
/**
 * All keys of T that are of type symbol
 *
 * @shallow
 *
 * @example
 * ```ts
 * type User = { id: number, name: string, [Symbol.iterator]: () => Iterator<any> }
 * type Symbols = Symbol<User> // typeof Symbol.iterator
 * ```
 */
export type Symbol<T> = OfType<T, symbol>;
//#endregion

/**
 * Coerces a key to a string if it is a number, otherwise returns the key as is.
 *
 * @shallow
 *
 * @example
 * ```ts
 * type K1 = CoerceNumber<0> // '0'
 * type K2 = CoerceNumber<'a'> // 'a'
 * ```
 */
export type CoerceNumber<T> = T extends string ? T : T extends number ? `${T}` : never;

/**
 * Keys of T as enumerable strings
 *
 * @shallow
 *
 * @example
 * ```ts
 * type User = { id: number, name: string, 0: boolean, [Symbol.iterator]: () => Iterator<any> }
 * type EnuKeys = Enumerable<User> // 'id' | 'name' | '0'
 * ```
 */
export type Enumerable<T> = CoerceNumber<keyof T>;

/**
 * Keys that are optional in T
 *
 * @shallow
 *
 * @example
 * ```ts
 * type User = { id: number, name?: string, address: { zip: number; city?: string;} }
 * type OptKeys = Optional<User> // 'name'
 * ```
 */
export type Optional<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? K : never;
}[keyof T];

/**
 * Keys that are required in T
 *
 * @shallow
 *
 * @example
 * ```ts
 * type User = { id: number, name?: string, address: { zip: number; city?: string;} }
 * type ReqKeys = Required<User> // 'id' | 'address'
 * ```
 */
export type Required<T> = {
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
 * type Shared = Shared<A, B> // 'id'
 * ```
 */
export type Shared<T, U> = keyof T & keyof U;

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
 * type Unique = Unique<A, B> // 'name' | 'age' | 'email'
 * ```
 */
export type Unique<T, U> = Exclude<keyof T | keyof U, Shared<T, U>>;
