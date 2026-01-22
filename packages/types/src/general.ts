//#region> Flow Control Types
/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy}
 *
 * @important NaN is also falsy but cannot be accurately represented in a type
 */
export type Falsy = -0 | '' | 0n | false | Nullish;
/** @see {@link https://developer.mozilla.org/en-US/docs/Glossary/Nullish} */
export type NonNullish<T> = Exclude<T, Nullish>;
/** @see {@link https://developer.mozilla.org/en-US/docs/Glossary/Nullish} */
export type Nullish = null | undefined;
/** @see {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy} */
export type Truthy<T> = T extends Falsy ? never : T;
//#endregion

//#region> Primitive Types
/**
 * A union of traditional primitive types (not one-to-one with JavaScript's `typeof` operator)
 */
export type PrimitiveType = PrimitiveTypeMap[PrimitiveTypeName];
/**
 * A mapping of traditional primitive type names to their corresponding types
 *
 * function and object are omitted.
 */
export interface PrimitiveTypeMap {
  bigint: bigint;
  boolean: boolean;
  null: null;
  number: number;
  string: string;
  symbol: symbol;
  undefined: undefined;
}
export type PrimitiveTypeName = keyof PrimitiveTypeMap;
//#endregion

//#region> Type Modifier
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
  : T extends object ? { -readonly [K in keyof T]: Widen<T[K]> }
  : unknown;
//#endregion

//#region> Conditionals
/**
 * Wraps a type T in a Promise if B is true, otherwise returns T as is.
 */
export type MaybePromise<T, B extends boolean = boolean> =
  B extends true ? Promise<T> : T;
//#endregion

export type IsArray<T> = T extends unknown[] ? true : false;
export type IsBigInt<T> = T extends bigint ? true : false;
export type IsBoolean<T> = T extends boolean ? true : false;
export type IsFalsy<T> = T extends Falsy ? true : false;
export type IsFunction<T> =
  T extends (...args: any[]) => unknown ? true : false;
export type IsNever<T> = [T] extends [never] ? true : false;
export type IsNullish<T> = T extends Nullish ? true : false;
export type IsNumber<T> = T extends number ? true : false;
export type IsObject<T> = T extends object ? true : false;
export type IsPrimitive<T> = T extends PrimitiveType ? true : false;
export type IsString<T> = T extends string ? true : false;
export type IsSymbol<T> = T extends symbol ? true : false;
export type IsTuple<T> = T extends [] | [unknown, ...unknown[]] ? true : false;
export type IsUndefined<T> = T extends undefined ? true : false;
