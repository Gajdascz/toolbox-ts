import type {
  IsFunction,
  IsNever,
  IsNullish,
  IsObject,
  NonNullish
} from '../../../general.js';
import type { Increment } from '../../../number/definitions/number.js';
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

//#region>> Deep
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
export type DeepMutable<T> =
  T extends object ? { -readonly [P in keyof T]: DeepMutable<T[P]> } : T;
/**
 * Marks all properties of a type as optional, including nested objects.
 *
 * @deep
 *
 * @example
 * ```ts
 * type User = { name: string, address: { street: string } }
 * type PartialUser = DeepPartial<User> // { name?: string, address?: { street?: string } }
 * ```
 */
export type DeepPartial<T> =
  T extends readonly unknown[] | unknown[] ? T | undefined
  : T extends object ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;
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
export type DeepPartiallyOptional<T, K extends keyof T> = DeepPartial<
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
 * type ReadonlyUser = DeepReadonly<User> // { readonly name: string, readonly address: { readonly street: string } }
 * ```
 */
export type DeepReadonly<T> =
  T extends object ? { readonly [P in keyof T]: DeepReadonly<T[P]> } : T;
/**
 * Marks all properties of a type as required, including nested objects.
 *
 * @deep
 *
 * @example
 * ```ts
 * type User = { name?: string, address?: { street?: string } }
 * type RequiredUser = DeepRequired<User> // { name: string, address: { street: string } }
 * ```
 */
export type DeepRequired<T> =
  T extends object ? { [P in keyof T]-?: DeepRequired<T[P]> } : T;
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
export type DeepRequiredProps<T, K extends keyof T> = DeepRequired<Pick<T, K>>
  & Omit<T, K>;
//#endregion

//#region>> Depth Based
/**
 * Makes properties of an object type readonly up to a certain depth.
 *
 * @example
 * ```ts
 * interface User {
 *   id: number;
 *   nested: { deeper: { value: number }, prop: string };
 * }
 * type Depth0 = DepthReadonly<User, 0>
 * |=> {
 *   readonly id: number;
 *   readonly nested: { deeper: { value: number }, prop: string };
 * }
 * type Depth1 = DepthReadonly<User, 1>
 * |=> {
 *   readonly id: number;
 *   readonly nested: { readonly deeper: { value: number }, prop: string };
 * }
 * type Depth2 = DepthReadonly<User, 2>
 * |=> {
 *   readonly id: number;
 *   readonly nested: { readonly deeper: { readonly value: number }, readonly prop: string };
 * }
 * ```
 */
export type DepthReadonly<
  T,
  D extends number = 9999,
  I extends number = 0
> = Readonly<{
  [P in keyof T]: I extends D ? T[P]
  : T[P] extends object ?
    DepthReadonly<T[P], D, I extends number ? Increment<I> : never>
  : T[P];
}>;
//#endregion

//#region>> Frozen
/**
 * A frozen object type T, with an optional depth for nested properties.
 *
 * @example
 * ```ts
 * type User = { id: number, name: string, address: { street: string } }
 * type ShallowFrozenUser = Frozen<User> // { readonly id: number, readonly name: string, readonly address: { street: string } }
 * type DeepFrozenUser = Frozen<User, 1> // { readonly id: number, readonly name: string, readonly address: { readonly street: string } }
 * ```
 */
export type Frozen<T, Depth extends number = 0> = DepthReadonly<
  { __frozen__: true } & T,
  Depth
>;
//#endregion

//#region> Strip
/**
 * Removes properties with null or undefined values from an object type, including nested objects.
 * @deep
 *
 * @example
 * ```ts
 * type Data = {
 *   id: number | null;
 *   name: string | undefined;
 *   details: {
 *     age: number | null;
 *     address?: {
 *       street: string | null;
 *       city: string;
 *     } | null;
 *   };
 *   tags: (string | null)[];
 *   getInfo: () => string | null;
 *   legacy: null;
 * }
 * type CleanData = StripNullish<Data>
 * // Result: {
 * //   id: number;
 * //   name: string;
 * //   details: {
 * //     age: number;
 * //     address: { street: string; city: string; };
 * //   };
 * //   tags: string[];
 * //   getInfo: () => string | null;
 * //   legacy: never;
 * // }
 * ```
 */
export type StripNullish<T> =
  IsNullish<T> extends true ? never
  : T extends (infer U)[] ? StripNullish<NonNullish<U>>[]
  : IsFunction<T> extends true ? T
  : IsObject<T> extends true ? { [K in keyof T]: StripNullish<T[K]> }
  : NonNullish<T>;
//#endregion

//#region> Remove
/**
 * Removes index signature keys from a type, leaving only explicit keys
 *
 * @example
 * ```ts
 * type T = { a: number; [key: string]: unknown }
 * type Result = RemoveIndexSignature<T> // { a: number }
 * ```
 */
export type RemoveIndexSignature<T> = {
  [K in keyof T as string extends K ? never
  : number extends K ? never
  : symbol extends K ? never
  : K]: T[K];
};

/**
 * Removes properties with type `never` from an object type, including nested objects.
 * @deep
 * @example
 * ```ts
 * type Data = {
 *   a: never;
 *   b: {
 *     c: never;
 *     d: string;
 *     e: {
 *       f: never;
 *       g: number;
 *     };
 *   };
 *   h: number[];
 * }
 * type CleanData = RemoveNever<Data>
 * // Result: {
 * //   b: {
 * //     d: string;
 * //     e: {
 * //       g: number;
 * //     };
 * //   };
 * //   h: number[];
 * // }
 * ```
 */
export type RemoveNever<T> =
  IsNever<T> extends true ? never
  : T extends (infer U)[] ? RemoveNever<U>[]
  : IsObject<T> extends true ?
    {
      [K in keyof T as IsNever<RemoveNever<T[K]>> extends true ? never
      : K]: RemoveNever<T[K]>;
    }
  : T;

//#endregion
