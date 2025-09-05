import { EOL } from 'node:os';

/**
 * @module Str
 *
 * Utility functions for safe, type-aware string operations:
 * camel/kebab case conversion, prefix/suffix checks, and
 * string cleaning.
 */
import type { CamelToKebab, KebabToCamel, Prefix, Suffix } from './types.js';

import { regex } from '../constants/index.js';
import { Prim } from '../Prim/index.js';

/**
 * Basic camel to kebab text conversion
 * - Ensures the first letter is lowercase.
 * - Separates uppercase letters and prefixes with hyphen
 *  - This behavior is chosen to align the result with the CamelToKebab Type.
 * - Converts full string to lowercase.
 * @example
 * ```ts
 * camelToKebab('noEdit')      // 'no-edit'
 * camelToKebab('noVerify')    // 'no-verify'
 * camelToKebab('aAAAAA')      // 'a-a-a-a-a-a'
 * ```
 */
export const camelToKebab = <S extends string>(str: S): CamelToKebab<S> =>
  uncapitalize(str)
    .replaceAll(/([A-Z])/g, '-$1')
    .toLowerCase()
    .trim() as CamelToKebab<S>;

/**
 * Capitalizes the first letter of a string.
 * @example
 * ```ts
 * capitalize('hello') // 'Hello'
 * capitalize('h')     // 'H'
 * ```
 */
export const capitalize = <S extends string>(str: S): Capitalize<S> =>
  (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<S>;

/**
 * Uncapitalizes the first letter of a string.
 * @example
 * ```ts
 * uncapitalize('Hello') // 'hello'
 * uncapitalize('H')     // 'h'
 * ```
 */
export const uncapitalize = <S extends string>(str: S): Uncapitalize<S> =>
  (str.charAt(0).toLowerCase() + str.slice(1)) as Uncapitalize<S>;

/**
 * Converts a kebab-case string to camelCase.
 * @example
 * ```ts
 * keyToLong('node-edit')        // 'noEdit'
 * keyToLong('no-verify')        // 'noVerify'
 * camelToKebab('a-a-a-a-a-a')   // 'aAAAAA'
 * ```
 */
export const kebabToCamel = <S extends string>(str: S): KebabToCamel<S> => {
  const [first, ...rest] = str.split('-');
  return `${first.toLowerCase()}${rest.map(capitalize).join('')}` as KebabToCamel<S>;
};
/**
 * Cleans an array of strings:
 * - Trims whitespace from each string.
 * - Filters out empty strings and non-string values.
 * - Returns an empty array if the input is undefined or empty.
 * - Optionally deduplicates the array.
 * @example
 * ```ts
 * cleanStrArray([' foo ', 'bar', '', 123, null, undefined, 'baz '])
 * // ['foo', 'bar', 'baz']
 * cleanStrArray(undefined) // []
 * cleanStrArray([]) // []
 * cleanStrArray(['a', 'b', 'a'], true) // ['a', 'b']
 * ```
 */
export const cleanArr = (
  /** Array to clean */
  arr: unknown = [],
  /** Whether to remove duplicates from the array */
  deduplicate = false
): string[] => {
  const clean = (Array.isArray(arr) ? arr : [])
    .map((str) => (Prim.isTypeOf.string(str) ? str.trim() : ''))
    .filter((str) => str.length > 0);
  return deduplicate ? [...new Set(clean)] : clean;
};

export const is = {
  /**
   * Checks if a value is a string containing only
   * alphabetic characters.
   *
   * @example
   * ```ts
   * is.alphabetic('hello') // true
   * is.alphabetic('Hello123') // false
   * ```
   */
  alphabetic: (str: unknown): str is string =>
    Prim.isTypeOf.string(str) && regex.alphabetic.test(str),
  /**
   * Checks if a string is in camelCase format.
   *
   * @example
   * ```ts
   * is.camel('camelCase') // true
   * is.camel('CamelCase') // false
   * is.camel('camel-case') // false
   * ```
   */
  camel: <S extends string = string>(
    str: unknown,
    type: keyof typeof regex.camel = 'alphabetic'
  ): str is S =>
    Prim.isTypeOf.string(str) && str.length > 0 && regex.camel[type].test(str),
  /**
   * Checks if a string is in kebab-case format.
   *
   * @example
   * ```ts
   * is.kebab('kebab-case') // true
   * is.kebab('Kebab-Case') // false
   * is.kebab('kebabCase') // false
   * ```
   */
  kebab: <S extends string = string>(
    str: unknown,
    type: keyof typeof regex.kebab = 'lowercaseAlphabetic'
  ): str is S =>
    Prim.isTypeOf.string(str) && str.length > 0 && regex.kebab[type].test(str),
  /**
   * Checks if a string is a valid semantic version.
   *
   * @example
   * ```ts
   * is.semVer('1.0.0') // true
   * is.semVer('1.0.0-alpha') // true
   * is.semVer('1.0') // false
   * is.semVer('1.0.0+build') // true
   * ```
   */
  prefixed: <P extends string = string, S extends string = string>(
    str: unknown,
    prefix: P
  ): str is Prefix<P, S> =>
    Prim.isTypeOf.string(str)
    && str.startsWith(prefix)
    && str.length > prefix.length,
  /**
   * Checks if a string is suffixed with a specific string.
   *
   * @example
   * ```ts
   * is.suffixed('test.js', '.js') // true
   * is.suffixed('test.js', '.ts') // false
   * is.suffixed('test', 'test') // false
   * ```
   */
  str: Prim.isTypeOf.string,
  /**
   * Checks if a string is suffixed with a specific string.
   *
   * @example
   * ```ts
   * is.suffixed('test.js', '.js') // true
   * is.suffixed('test.js', '.ts') // false
   * is.suffixed('test', 'test') // false
   * ```
   */
  suffixed: <S extends string = string, P extends string = string>(
    str: unknown,
    suffix: P
  ): str is Suffix<S, P> =>
    Prim.isTypeOf.string(str)
    && str.endsWith(suffix)
    && str.length > suffix.length,
  array: (input: unknown): input is string[] =>
    Array.isArray(input) && input.every((elem) => Prim.isTypeOf.string(elem))
} as const;

/**
 * Prefixes a string with another string.
 *
 * @example
 * ```ts
 * prefix('pre-', 'fix') // 'pre-fix'
 * prefix('pre', 'fix') // 'prefix'
 * prefix('pre', 'fix') // 'prefix'
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
 * suffix('fix', 'post-') // 'fix-post-'
 * suffix('fix', 'post') // 'fixpost'
 * suffix('fix', 'post') // 'fixpost'
 * ```
 */
export const suffix = <P extends string = string, S extends string = string>(
  str: S,
  suf: P
): Suffix<S, P> => `${str}${suf}`;

export const parse = {
  /**
   * Splits a CSV row into an array of trimmed strings.
   *
   * @example
   * ```ts
   * parse.csvRow(' foo, bar , ,baz ') // ['foo', 'bar', 'baz']
   * parse.csvRow('') // []
   * ```
   */
  csvRow: (input = ''): string[] => cleanArr(input.split(',')),
  /**
   * Splits a multiline string into an array of trimmed lines.
   *
   * @example
   * ```ts
   * parse.lines(' foo \n bar \n\n baz ') // ['foo', 'bar', 'baz']
   * parse.lines('') // []
   * ```
   */
  spaceSeparated: (input = ''): string[] => cleanArr(input.split(' ')),
  /**
   * Splits a multiline string into an array of trimmed lines.
   *
   * @example
   * ```ts
   * parse.lines(' foo \n bar \n\n baz ') // ['foo', 'bar', 'baz']
   * parse.lines('') // []
   * ```
   */
  lines: (input = ''): string[] => cleanArr(input.split(EOL)),
  /**
   * Parses a multiline CSV string into a 2D array of trimmed strings.
   *
   * @example
   * ```ts
   * parse.csv(' foo, bar \n baz , qux ') // [['foo', 'bar'], ['baz', 'qux']]
   * parse.csv('') // []
   * ```
   */
  csv: (input = ''): string[][] => parse.lines(input).map(parse.csvRow)
} as const;

export type * from './types.js';
