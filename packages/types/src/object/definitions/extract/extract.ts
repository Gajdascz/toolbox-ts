import type { IsPrimitive } from '../../../general.js';
import type { Key } from '../key/index.js';

/**
 * Extracts non-primitive properties from a type
 *
 * @shallow
 *
 * @example
 * ```ts
 * type User = { id: number, name: string, address: { street: string }, siblings: string[] }
 * type NonPrimitives = NonPrimitive<User> // { address: { street: string }, siblings: string[] }
 * ```
 */
export type NonPrimitives<T> = Omit<T, keyof Primitives<T>>;

/**
 * Extracts optional properties from a type
 *
 * @shallow
 *
 * @example
 * ```ts
 * type User = { id: number, name?: string }
 * type Optional = Optional<User> // { name?: string }
 * ```
 */
export type Optional<T> = Pick<T, Key.Optional<T>>;
/**
 * Extracts primitive properties from a type
 *
 * @shallow
 *
 * @example
 * ```ts
 * type User = { id: number, name: string, address: { street: string } }
 * type Primitives = Primitive<User> // { id: number, name: string }
 * ```
 */
export type Primitives<T> = {
  [K in keyof T as IsPrimitive<T[K]> extends true ? K : never]: T[K];
};
/**
 * Extracts required properties from a type
 *
 * @shallow
 *
 * @example
 * ```ts
 * type User = { id: number, name?: string }
 * type Required = Required<User> // { id: number }
 * ```
 */
export type Required<T> = Pick<T, Key.Required<T>>;
