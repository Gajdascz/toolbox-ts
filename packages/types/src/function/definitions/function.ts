//#region> Base
export type Any = (...args: any[]) => unknown;
/**
 * A function that returns a Promise.
 *
 * @important R is already wrapped in a Promise, do not wrap it again when specifying the return type.
 */
export type Async<A extends unknown[] = unknown[], R = unknown> = (
  ...args: A
) => Promise<R>;
export interface Constructor<T = unknown, N extends string = string> {
  readonly name: N;
  new (...args: any[]): T;
}
export type InferInstanceType<C> = C extends Constructor<infer T> ? T : never;

/**
 * A synchronous function.
 *
 * @important Do not return a Promise from this function, use {@link Async} instead.
 */
export type Sync<A extends unknown[] = unknown[], R = unknown> = (
  ...args: A
) => R;
//#endregion

//#region> Typing
export type ExclusiveTypeGuard<F extends Any, N extends string = string> = F
  & TypeGuardMeta<`Not${Capitalize<N>}`>;
export type TypeGuard<F extends Any, N extends string = string> = F
  & TypeGuardMeta<N>;
export interface TypeGuardMeta<N extends string = string> {
  readonly typeName: Capitalize<N>;
}
//#endregion
//#region> Guards
//#region> Base
export type AssertsIsGuard<V = unknown, A extends unknown[] = void[]> = (
  v: unknown,
  ...args: A
) => asserts v is V;
export type CheckGuard<A extends unknown[] = void[]> = (
  v: unknown,
  ...args: A
) => boolean;
export type CheckNotGuard<E, A extends unknown[]> = (
  v: unknown,
  ...args: A
) => boolean;

export type IsGuard<V = unknown, A extends unknown[] = void[]> = (
  v: unknown,
  ...args: A
) => v is V;
export type IsNotGuard<E, A extends unknown[]> = <V>(
  v: V,
  ...args: A
) => v is Exclude<V, E>;

//#endregion
export type IsNotTypeGuardPair<
  N extends string,
  E,
  A extends unknown[] = void[]
> = {
  readonly [K in N as `checkIsNot${Capitalize<K>}`]: ExclusiveTypeGuard<
    CheckNotGuard<E, A>,
    K
  >;
} & {
  readonly [K in N as `isNot${Capitalize<K>}`]: ExclusiveTypeGuard<
    IsNotGuard<E, A>,
    K
  >;
};
export type IsTypeGuardPair<
  N extends string,
  V = unknown,
  A extends unknown[] = void[]
> = {
  readonly [K in N as `checkIs${Capitalize<K>}`]: TypeGuard<CheckGuard<A>, N>;
} & { readonly [K in N as `is${Capitalize<K>}`]: TypeGuard<IsGuard<V, A>, N> };
export interface TypeGuardSuite<V = unknown, A extends unknown[] = void[]> {
  assert: AssertsIsGuard<V, A>;
  check: CheckGuard<A>;
  is: IsGuard<V, A>;
}

//#endregion
