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

/**
 * A union of all true primitive types, including functions and objects
 * - Matches the results of JavaScript's `typeof` operator
 */
export type TruePrimitiveType =
  | ((...args: any[]) => unknown)
  | object
  | PrimitiveType;
/**
 * A mapping of all true primitive type names to their corresponding types
 * - Matches the results of JavaScript's `typeof` operator
 */
export type TruePrimitiveTypeMap = {
  function: (...args: any[]) => unknown;
  object: object;
} & PrimitiveTypeMap;
export type TruePrimitiveTypeName = keyof TruePrimitiveTypeMap;
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
