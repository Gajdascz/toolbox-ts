import type { Fn } from '@toolbox-ts/types';
import type {
  IsGuard,
  IsNotGuard,
  IsNotTypeGuardPair,
  IsTypeGuardPair
} from '@toolbox-ts/types/defs/function';

export const createGuard = <
  Name extends string,
  TypeName extends string,
  F extends Fn.Any
>(
  name: Name,
  typeName: TypeName,
  fn: F
): { readonly name: Name; readonly typeName: TypeName } & F => {
  Object.defineProperty(fn, 'name', {
    value: name,
    writable: false,
    configurable: true
  });

  Object.defineProperty(fn, 'typeName', {
    value: typeName.charAt(0).toUpperCase() + typeName.slice(1),
    writable: false,
    configurable: true
  });
  return fn as { readonly name: Name; readonly typeName: TypeName } & F;
};
export const createNames = <N extends string>(
  typeName: N
): {
  checkIsName: `checkIs${Capitalize<N>}`;
  isName: `is${Capitalize<N>}`;
  typeName: Capitalize<N>;
} => {
  const cap = typeName.charAt(0).toUpperCase() + typeName.slice(1);
  return {
    typeName: cap,
    isName: `is${cap}`,
    checkIsName: `checkIs${cap}`
  } as {
    checkIsName: `checkIs${Capitalize<N>}`;
    isName: `is${Capitalize<N>}`;
    typeName: Capitalize<N>;
  };
};
/**
 * Creates a pair of type guards: `isX` and `checkIsX`.
 *
 * @param name - The base name for the type guards.
 * @param is - The implementation of the `isX` guard.
 * @returns An object containing the `isX` and `checkIsX` guards.
 *
 * @example
 * ```ts
 * const { isString, checkIsString } = createIsGuards('string', (v): v is string => typeof v === 'string');
 *
 * isString('hello'); // true
 * checkIsString(123); // false
 * ```
 */
export function createIsGuards<
  Name extends string,
  T,
  A extends unknown[] = void[]
>(name: Name, is: IsGuard<T, A>): IsTypeGuardPair<Name, T, A> {
  const { typeName, isName, checkIsName } = createNames(name);
  const isGuard = createGuard(isName, typeName, is);
  const checkIsGuard = createGuard(checkIsName, typeName, is);
  return { [isName]: isGuard, [checkIsName]: checkIsGuard } as IsTypeGuardPair<
    Name,
    T,
    A
  >;
}

/**
 * Creates a pair of negated type guards: `isNotX` and `checkIsNotX`.
 *
 * @param name - The base name for the type guards. Exclude the "Not" prefix, it is added automatically.
 * @param isNot - The implementation of the `isNotX` guard.
 * @returns An object containing the `isNotX` and `checkIsNotX` guards.
 * @example
 * ```ts
 * const { isNotString, checkIsNotString } = createIsNotGuards('string', (v): v is not string => typeof v !== 'string');
 *
 * isNotString(123); // true
 * checkIsNotString('hello'); // false
 * ```
 *
 */
export function createIsNotGuards<
  Name extends string,
  T,
  A extends unknown[] = void[]
>(
  name: Name,
  isNot: <V>(v: V, ...args: A) => v is Exclude<V, T>
): IsNotTypeGuardPair<Name, T, A> {
  const { typeName, isName, checkIsName } = createNames(
    `Not${name.charAt(0).toUpperCase() + name.slice(1)}`
  );
  const isNotGuard = createGuard(isName, typeName, isNot);
  const checkIsNotGuard = createGuard(checkIsName, typeName, isNot);
  return {
    [isName]: isNotGuard,
    [checkIsName]: checkIsNotGuard
  } as IsNotTypeGuardPair<Name, T, A>;
}

export const createIsAndIsNotGuards = <
  Name extends string,
  T,
  A extends unknown[] = void[]
>(
  name: Name,
  is: IsGuard<T, A>,
  isNot: IsNotGuard<T, A> = <V>(v: V, ...args: A): v is Exclude<V, T> =>
    !is(v, ...args)
): IsNotTypeGuardPair<Name, T, A> & IsTypeGuardPair<Name, T, A> =>
  ({ ...createIsGuards(name, is), ...createIsNotGuards(name, isNot) }) as const;
