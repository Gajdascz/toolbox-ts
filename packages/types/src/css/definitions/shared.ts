import type { Angle, Percent } from './units.js';

export type CustomProperty<P extends string = string> = `--${P}`;

export type SharedKeyword = 'inherit' | 'initial' | 'revert' | 'unset';
/** https://www.w3.org/TR/css-variables-1/#custom-property */
export type Var = `var(--${string})`;

//#region> WithVar
export type AngleWithVar = WithVar<Angle>;
export type NumberWithVar = WithVar<number>;
export type PercentWithVar = WithVar<Percent>;
export type WithVar<T> = T | Var;
//#endregion

/**
 * A type that accepts either a specific type T, a CSS variable, or a shared keyword.
 * @example
 * ```ts
 * Accepts<'10px'> can be '10px', 'var(--any-variable)', 'initial', 'inherit', 'unset', or 'revert'.
 * ```
 */
export type Accepts<T> = SharedKeyword | WithVar<T>;
