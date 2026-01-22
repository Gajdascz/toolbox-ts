import type { Prefix, Suffix } from '@toolbox-ts/types/defs/string';

//#region> Capitalization
/**
 * Capitalizes the first letter of a string.
 * @example
 * ```ts
 * capitalize('hello') // 'Hello'
 * capitalize('h')     // 'H'
 * ```
 */
export const capitalize = <S extends string = string>(str: S): Capitalize<S> =>
  (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<S>;

/**
 * Uncapitalizes the first letter of a string.
 * @example
 * ```ts
 * uncapitalize('Hello') // 'hello'
 * uncapitalize('H')     // 'h'
 * ```
 */
export const uncapitalize = <S extends string = string>(
  str: S
): Uncapitalize<S> =>
  (str.charAt(0).toLowerCase() + str.slice(1)) as Uncapitalize<S>;
//#endregion

//#region> Affix
/**
 * Prefixes a string with another string.
 *
 * @example
 * ```ts
 * prefix('pre', '-fix') // 'pre-fix'
 * prefix('pre-', 'fix') // 'pre-fix'
 * ```
 */
export const prefix = <P extends string = string, S extends string = string>(
  pre: P,
  str: S
): Prefix<P, S> => `${pre}${str}`;
/**
 * Suffixes a string with another string.
 *
 * @example
 * ```ts
 * suffix('suf-', 'fix') // 'suf-fix'
 * suffix('suf', '-fix') // 'suf-fix'
 * ```
 */
export const suffix = <P extends string = string, S extends string = string>(
  str: S,
  suf: P
): Suffix<S, P> => `${str}${suf}`;
//#endregion
