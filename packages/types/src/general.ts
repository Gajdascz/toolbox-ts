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
export type Truthy<T> = Exclude<T, Falsy>;
//#endregion

//#region> Primitive Types
/**
 * A union of traditional primitive types (not one-to-one with JavaScript's `typeof` operator)
 */
export type PrimitiveType = PrimitiveTypeMap[PrimitiveTypeName];

/**
 * A union of traditional primitive types excluding undefined
 */
export type DefinedPrimitive = Exclude<PrimitiveType, undefined>;
/**
 * A union of traditional primitive types excluding null and undefined
 */
export type NonNullishPrimitive = Exclude<PrimitiveType, Nullish>;
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

export type AnyDefined = DefinedPrimitive | object;

//#endregion

//#region> Type Modifier
export type NarrowFunction<T> = T extends (...args: infer A) => infer R ? (...args: A) => R : T;
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
  IsString<T> extends true
    ? string
    : IsNumber<T> extends true
      ? number
      : IsBoolean<T> extends true
        ? boolean
        : IsBigInt<T> extends true
          ? bigint
          : IsSymbol<T> extends true
            ? symbol
            : IsFunction<T> extends true
              ? NarrowFunction<T>
              : IsUndefined<T> extends true
                ? undefined
                : IsNull<T> extends true
                  ? null
                  : IsObject<T> extends true
                    ? { readonly [K in keyof T]: Narrow<T[K]> }
                    : T;

/**
 * Widens a type to its primitive counterpart.
 * Handles objects recursively.
 */
export type WidenPrimitive<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends bigint
        ? bigint
        : T extends symbol
          ? symbol
          : T extends undefined
            ? undefined
            : T extends null
              ? null
              : T;

export type WidenMap<T> =
  T extends Map<infer K, infer V>
    ? Map<Widen<K>, Widen<V>>
    : T extends ReadonlyMap<infer K, infer V>
      ? ReadonlyMap<Widen<K>, Widen<V>>
      : T;
export type WidenSet<T> =
  T extends Set<infer U>
    ? Set<Widen<U>>
    : T extends ReadonlySet<infer U>
      ? ReadonlySet<Widen<U>>
      : T;
export type WidenArray<T> = T extends unknown[] | readonly unknown[] ? Widen<T[number]>[] : T;
export type WidenFunction<T> = T extends (...args: infer A) => infer R
  ? (...args: { [K in keyof A]: Widen<A[K]> }) => Widen<R>
  : T;

/**
 * Widens a type T by converting primitive types to their broader counterparts.
 * Handles arrays, maps, sets, functions, and objects recursively.
 *
 * If O is provided as an object type, it will be used as the widened type for objects instead of widening their properties.
 *
 * @example
 * ```ts
 * type A = Widen<"hello"> // string
 * type B = Widen<{ a: 1, b: "test", c: { d: true } }> // { a: number; b: string; c: { d: boolean } }
 * type C = Widen<{ a: 1, b: "test" }, Record<string, unknown>> // Record<string, unknown>
 * type D = Widen<{ a: 1, b: "test"}, object> // object
 * ```
 */
export type Widen<T, O extends 'preserve' | object | Record<string, unknown> = 'preserve'> =
  IsPrimitive<T> extends true
    ? WidenPrimitive<T>
    : IsArray<T> extends true
      ? WidenArray<T>
      : IsMap<T> extends true
        ? WidenMap<T>
        : IsSet<T> extends true
          ? WidenSet<T>
          : IsFunction<T> extends true
            ? WidenFunction<T>
            : T extends object
              ? O extends 'preserve'
                ? { -readonly [K in keyof T]: Widen<T[K]> }
                : O
              : T;
//#endregion

//#region> Conditionals
/**
 * Wraps a type T in a Promise if B is true, otherwise returns T as is.
 */
export type MaybePromise<T, B extends boolean = boolean> = B extends true ? Promise<T> : T;
//#endregion

export type IsArray<T> = T extends unknown[] | readonly unknown[] ? true : false;
export type IsBigInt<T> = T extends bigint ? true : false;
export type IsBoolean<T> = T extends boolean ? true : false;
export type IsFalsy<T> = T extends Falsy ? true : false;
export type IsFunction<T> = T extends (...args: any[]) => unknown ? true : false;
export type IsNever<T> = [T] extends [never] ? true : false;
export type IsNull<T> = T extends null ? true : false;
export type IsNullish<T> = T extends Nullish ? true : false;
export type IsNumber<T> = T extends number ? true : false;
export type IsObject<T> = T extends object ? true : false;
export type IsPrimitive<T> = T extends PrimitiveType ? true : false;
export type IsDefinedPrimitive<T> = T extends DefinedPrimitive ? true : false;
export type IsAnyDefined<T> = T extends AnyDefined ? true : false;
export type IsString<T> = T extends string ? true : false;
export type IsSymbol<T> = T extends symbol ? true : false;
export type IsTuple<T> = T extends readonly [] | readonly [unknown, ...unknown[]] ? true : false;
export type IsUndefined<T> = T extends undefined ? true : false;
export type IsMap<T> = T extends Map<unknown, unknown> | ReadonlyMap<unknown, unknown>
  ? true
  : false;
export type IsSet<T> = T extends Set<unknown> | ReadonlySet<unknown> ? true : false;

export type IsRegExp<T> = T extends RegExp ? true : false;
export type IsDate<T> = T extends Date ? true : false;
export type IsError<T> = T extends Error ? true : false;
export type IsPlainObject<T> = T extends Record<string, unknown> ? true : false;

/**
 * Converts a union type to an intersection type.
 *
 * @example
 * ```ts
 * type A = { a: number } | { b: string };
 * type B = UnionToIntersection<A>; // { a: number } & { b: string }
 * ```
 *
 * @see https://github.com/sindresorhus/type-fest/blob/main/source/union-to-intersection.d.ts
 */
export type UnionToIntersection<Union> =
  // `extends unknown` is always going to be the case and is used to convert the
  // `Union` into a [distributive conditional
  // type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
  (
    Union extends unknown
      ? // The union type is used as the only argument to a function since the union
        // of function arguments is an intersection.
        (distributedUnion: Union) => void
      : // This won't happen.
        never
  ) extends (mergedIntersection: infer Intersection) => void // arguments of unions of functions as an intersection of the union. // Infer the `Intersection` type since TypeScript represents the positional
    ? // The `& Union` is to ensure result of `UnionToIntersection<A | B>` is always assignable to `A | B`
      Intersection & Union
    : never;

export interface Person {
  /** The person's email address. */
  email: string;
  /** The person's name. */
  name: string;
  /** The URL of the person's homepage or profile. */
  url: string;
}
