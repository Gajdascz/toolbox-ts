//#region> Base
/**
 * A function with any arguments and return type.
 */
export type Any = (...args: any[]) => unknown;
/**
 * A function that returns a Promise.
 *
 * @important R is already wrapped in a Promise, do not wrap it again when specifying the return type.
 */
export type Async<A extends unknown[] = unknown[], R = unknown> = (...args: A) => Promise<R>;

/**
 * A constructor type.
 *
 * @template T - Instance type
 * @template N - Name type
 *
 * @example
 * ```ts
 * class MyClass {}
 * const ctor: Constructor<MyClass, 'MyClass'> = MyClass;
 * console.log(ctor.name); // 'MyClass'
 * const instance: MyClass = new ctor();
 * ```
 */
export interface Constructor<T = unknown, N extends string = string> {
  readonly name: N;
  new (...args: any[]): T;
}

/**
 * Infers the instance type from a constructor type.
 *
 * @template C - Constructor type
 *
 * @example
 * ```ts
 * class MyClass {}
 * type InstanceType = InferInstanceType<typeof MyClass>; // MyClass
 * ```
 */
export type InferInstanceType<C> = C extends Constructor<infer T> ? T : never;

/**
 * A synchronous function.
 *
 * @important Do not return a Promise from this function, use {@link Async} instead.
 */
export type Sync<A extends unknown[] = unknown[], R = unknown> = (
  ...args: A
) => R extends Promise<unknown> ? never : R;
//#endregion

//#region> Typing
/**
 * A TypeGuard that excludes a specific type from the checked value.
 *
 * @template F - The function type
 * @template N - The name of the type guard
 *
 * @example
 * ```ts
 * const isNotString: ExclusiveTypeGuard<
 *   <T>(v: T | string) => v is not Exclude<T, string>,
 *   'NotString'
 * > = ...;
 * ```
 */
export type ExclusiveTypeGuard<F extends Any, N extends string = string> = F &
  TypeGuardMeta<`Not${Capitalize<N>}`>;
/**
 * A TypeGuard that asserts a specific type from the checked value.
 *
 * @template F - The function type
 * @template N - The name of the type guard
 *
 * @example
 * ```ts
 * const isString: TypeGuard<
 *   (v: unknown) => v is string,
 *   'String'
 * > = ...;
 * ```
 */
export type TypeGuard<F extends Any, N extends string = string> = F & TypeGuardMeta<N>;

/**
 * Metadata for a TypeGuard, including its type name.
 *
 * @template N - The name of the type guard
 */
export interface TypeGuardMeta<N extends string = string> {
  readonly typeName: Capitalize<N>;
}
//#endregion
//#region> Guards
//#region> Base
/**
 * A guard that does not narrow the type and returns a boolean.
 * @template A - Additional argument types
 * @example
 * ```ts
 * const isValid: CheckGuard<[min: number]> = (v, min) => typeof v === 'number' && v >= min;
 * ```
 */
export type CheckGuard<A extends unknown[] = void[]> = (v: unknown, ...args: A) => boolean;
/**
 * A guard that does not narrow the type and returns a boolean.
 * @template A - Additional argument types
 * @example
 * ```ts
 * const isNotValid: CheckNotGuard<[min: number]> = (v, min) => typeof v !== 'number' || v < min;
 * ```
 */
export type CheckNotGuard<A extends unknown[] = void[]> = (v: unknown, ...args: A) => boolean;

/**
 * A type guard that narrows the type of a value.
 *
 * @template V - The type to narrow to
 * @template A - Additional argument types
 *
 * @example
 * ```ts
 * const isString: IsGuard<string> = (v): v is string => typeof v === 'string';
 * ```
 */
export type IsGuard<V = unknown, A extends unknown[] = void[]> = (v: unknown, ...args: A) => v is V;
/**
 * A type guard that excludes a specific type from the value.
 *
 * @template E - The type to exclude
 * @template A - Additional argument types
 * @example
 * ```ts
 * const isNotString: IsNotGuard<string> = <V>(v:V|string): v is Exclude<V,string> => typeof v !== 'string';
 * ```
 */
export type IsNotGuard<E, A extends unknown[] = void[]> = <V>(
  v: E | V,
  ...args: A
) => v is Exclude<V, E>;

//#endregion
/**
 * A pair of exclusive type guards
 * - `isNotX`: {@link IsNotGuard} // Excludes E from the checked value
 * - `checkIsNotX`: {@link CheckNotGuard}
 *
 * @template N - The base name for the type guards.
 * @template E - The excluded type.
 * @template A - Additional argument types.
 * @example
 * ```ts
 * type Pair = IsNotTypeGuardPair<'String', string, [trim?: boolean]>
 * {
 *   readonly isNotString: IsNotGuard<string, [trim?: boolean]>;
 *   readonly checkIsNotString: CheckNotGuard<[trim?: boolean]>;
 * }
 * ```
 */
export type IsNotTypeGuardPair<N extends string, E, A extends unknown[] = void[]> = {
  readonly [K in N as `checkIsNot${Capitalize<K>}`]: ExclusiveTypeGuard<CheckNotGuard<A>, K>;
} & {
  readonly [K in N as `isNot${Capitalize<K>}`]: ExclusiveTypeGuard<IsNotGuard<E, A>, K>;
};
/**
 * A pair of type guards
 * - `isX`: {@link IsGuard} // Asserts V on the checked value
 * - `checkIsX`: {@link CheckGuard}
 *
 * @template N - The base name for the type guards.
 * @template V - The asserted type.
 * @template A - Additional argument types.
 * @example
 * ```ts
 * type Pair = IsTypeGuardPair<'String', string, [trim?: boolean]>
 * {
 *   readonly isString: IsGuard<string, [trim?: boolean]>;
 *   readonly checkIsString: CheckGuard<[trim?: boolean]>;
 * }
 * ```
 */
export type IsTypeGuardPair<N extends string, V = unknown, A extends unknown[] = void[]> = {
  readonly [K in N as `checkIs${Capitalize<K>}`]: TypeGuard<CheckGuard<A>, N>;
} & { readonly [K in N as `is${Capitalize<K>}`]: TypeGuard<IsGuard<V, A>, N> };

//#endregion

/**
 * Infers the return type of any function type.
 * @template F - Function type
 *
 * @example
 * ```ts
 * type Fn = (a: number, b: string) => boolean;
 * type ReturnType = InferValueFromAnyFn<Fn>; // boolean
 * ```
 */
export type InferValueFromAnyFn<F extends Any> = F extends (...args: any[]) => infer R
  ? R
  : unknown;

/**
 * Infers the value type from an IsGuard type.
 *
 * @template G - IsGuard type
 *
 * @example
 * ```ts
 * const isString: IsGuard<string> = (v): v is string => typeof v === 'string';
 * type ValueType = InferValueFromGuard<typeof isString>; // string
 * ```
 */
export type InferValueFromGuard<G> = G extends ((v: unknown, ...args: unknown[]) => v is infer V)
  ? V
  : G extends ((v: unknown, ...args: unknown[]) => asserts v is infer R)
    ? R
    : G extends (v: unknown, ...args: unknown[]) => boolean
      ? unknown
      : never;

export type InferArgs<F> = F extends (...args: infer A) => any ? A : unknown;
