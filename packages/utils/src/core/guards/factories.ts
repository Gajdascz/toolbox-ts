import type { Fn } from '@toolbox-ts/types';
import type {
  CheckGuard,
  CheckNotGuard,
  ExclusiveTypeGuard,
  IsGuard,
  IsNotGuard,
  TypeGuard
} from '@toolbox-ts/types/defs/function';
import type { StringRecord } from '@toolbox-ts/types/defs/object';

//#region> Naming
const capitalize = <S extends string>(s: S) =>
  (s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<S>;
export const createNames = <N extends string>(
  typeName: N
): { check: `checkIs${Capitalize<N>}`; is: `is${Capitalize<N>}`; type: Capitalize<N> } => {
  const cap = typeName.charAt(0).toUpperCase() + typeName.slice(1);
  return { type: cap, is: `is${cap}`, check: `checkIs${cap}` } as {
    check: `checkIs${Capitalize<N>}`;
    is: `is${Capitalize<N>}`;
    type: Capitalize<N>;
  };
};
export const createTypeNames = <D extends string, N extends string>(
  domain: D,
  names: N[]
): { [K in N]: `${Capitalize<D>}${Capitalize<K>}` } & { _: D } =>
  names.reduce(
    (acc, name) => {
      (acc as StringRecord)[name] = `${capitalize(domain)}${capitalize(name)}`;
      return acc;
    },
    { _: domain } as { [K in N]: `${Capitalize<D>}${Capitalize<K>}` } & { _: D }
  );
//#endregion
//#region> Single Guards
export const createGuard = <Name extends string, TypeName extends string, F extends Fn.Any>(
  name: Name,
  typeName: TypeName,
  fn: F
): { readonly name: Name; readonly typeName: TypeName } & F => {
  Object.defineProperty(fn, 'name', { value: name, writable: false, configurable: true });

  Object.defineProperty(fn, 'typeName', {
    value: capitalize(typeName),
    writable: false,
    configurable: true
  });
  return fn as { readonly name: Name; readonly typeName: TypeName } & F;
};
export const createCheckGuard = <TypeName extends string, F extends Fn.CheckGuard>(
  typeName: TypeName,
  fn: F
): {
  readonly typeName: Capitalize<TypeName>;
  readonly name: `checkIs${Capitalize<TypeName>}`;
} & F =>
  createGuard(`checkIs${capitalize(typeName)}`, typeName, fn) as {
    readonly typeName: Capitalize<TypeName>;
    readonly name: `checkIs${Capitalize<TypeName>}`;
  } & F;
//#endregion
//#region> Grouped Guards
export const createGenericIsGuards = <TypeName extends string, F extends Fn.Any>(
  typeName: TypeName,
  fn: F
) => ({
  is: createGuard(`is${capitalize(typeName)}`, typeName, fn),
  check: createGuard(
    `checkIs${capitalize(typeName)}`,
    typeName,
    fn as unknown as F extends ((v: unknown, ...args: infer A) => v is unknown)
      ? (v: unknown, ...args: A) => boolean
      : never
  )
});

export type IsGuardPair<N extends string, V = unknown, A extends unknown[] = void[]> = {
  is: TypeGuard<IsGuard<V, A>, N>;
  check: TypeGuard<CheckGuard<A>, N>;
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
export function createIsGuards<Name extends string, T, A extends unknown[] = void[]>(
  name: Name,
  is: IsGuard<T, A>
): IsGuardPair<Name, T, A> {
  const { type, is: isN, check } = createNames(name);
  const isGuard = createGuard(isN, type, is);
  const checkIsGuard = createGuard(check, type, is);
  return { is: isGuard, check: checkIsGuard };
}

export type NotGuardPair<N extends string, T, A extends unknown[] = void[]> = {
  not: ExclusiveTypeGuard<IsNotGuard<T, A>, N>;
  checkNot: ExclusiveTypeGuard<CheckNotGuard<A>, N>;
};
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
export function createIsNotGuards<Name extends string, T, A extends unknown[] = void[]>(
  name: Name,
  isNot: <V>(v: V, ...args: A) => v is Exclude<V, T>
): NotGuardPair<Name, T, A> {
  const { check, is, type } = createNames(`Not${name.charAt(0).toUpperCase() + name.slice(1)}`);
  const isNotGuard = createGuard(is, type, isNot);
  const checkIsNotGuard = createGuard(check, type, isNot);
  return { not: isNotGuard, checkNot: checkIsNotGuard } as NotGuardPair<Name, T, A>;
}

export const createIsAndIsNotGuards = <Name extends string, T, A extends unknown[] = void[]>(
  name: Name,
  is: IsGuard<T, A>,
  isNot: IsNotGuard<T, A> = <V>(v: V, ...args: A): v is Exclude<V, T> => !is(v, ...args)
): NotGuardPair<Name, T, A> & IsGuardPair<Name, T, A> =>
  ({ ...createIsGuards(name, is), ...createIsNotGuards(name, isNot) }) as const;
//#endregion
