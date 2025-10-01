/**
 * @module Str
 *
 * Utility functions for safe, type-aware string operations:
 * camel/kebab case conversion, prefix/suffix checks, and
 * string cleaning.
 */
import { EOL } from 'node:os';

import type {
  CamelToKebab,
  KebabToCamel,
  KebabToPascal,
  KebabToTitle,
  PascalToKebab,
  PascalToTitle,
  Prefix,
  Suffix,
  TitleToKebab
} from '../types/str.js';
export type * from '../types/str.js';

import { Arr } from '../Arr/index.js';
import { Prim } from '../Prim/index.js';
import {
  alphabetic,
  alphanumeric,
  camelCase,
  capitalized,
  kebabCase,
  pascalCase,
  punctuated,
  space,
  titleCase
} from './regex.js';

export const SPACE = ' ';

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

export const camel = {
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
  toKebab: <S extends string>(str: S): CamelToKebab<S> =>
    uncapitalize(str.trim())
      .replaceAll(/([A-Z])/g, '-$1')
      .toLowerCase() as CamelToKebab<S>,

  /**
   * Converts a camelCase string to PascalCase.
   *
   * @template S - The camelCase string to convert.
   * @example
   * ```ts
   * camel.toPascal('camelCase') // 'CamelCase'
   * camel.toPascal('helloWorld') // 'HelloWorld'
   * ```
   */
  toPascal: <S extends string>(s: S): Capitalize<S> =>
    capitalize<S>(s.trim() as S),

  toTitle: <S extends string>(str: S): KebabToTitle<CamelToKebab<S>> =>
    kebab.toTitle(camel.toKebab(str)),

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
  is: <S extends string = string>(
    str: unknown,
    type: keyof typeof camelCase = 'alphabetic'
  ): str is S =>
    Prim.is.string(str) && str.length > 0 && camelCase[type].test(str)
} as const;

export const pascal = {
  toKebab: <S extends string>(str: S): PascalToKebab<S> =>
    camel.toKebab(uncapitalize(str)),
  toCamel: <S extends string>(s: S): Uncapitalize<S> =>
    uncapitalize<S>(s.trim() as S),
  toTitle: <S extends string>(str: S): PascalToTitle<S> =>
    kebab.toTitle(pascal.toKebab(str)),
  is: <S extends string = string>(
    str: unknown,
    type: keyof typeof pascalCase = 'alphabetic'
  ): str is S =>
    Prim.is.string(str) && str.length > 0 && pascalCase[type].test(str)
} as const;
export const kebab = {
  /**
   * Checks if a string is in kebab-case format.
   *
   * @example
   * ```ts
   * kebab.is('kebab-case') // true
   * kebab.is('Kebab-Case') // false
   * kebab.is('kebabCase') // false
   * ```
   */
  is: <S extends string = string>(
    str: unknown,
    type: keyof typeof kebabCase = 'lowercaseAlphabetic'
  ): str is S =>
    Prim.is.string(str) && str.length > 0 && kebabCase[type].test(str),
  /**
   * Converts a kebab-case string to camelCase.
   * @example
   * ```ts
   * kebab.toCamel('node-edit')        // 'noEdit'
   * kebab.toCamel('no-verify')        // 'noVerify'
   * kebab.toCamel('a-a-a-a-a-a')      // 'aAAAAA'
   * ```
   */
  toCamel: <S extends string>(str: S): KebabToCamel<S> => {
    const [first, ...rest] = str.trim().split('-');
    return `${first.toLowerCase()}${rest.map(capitalize).join('')}` as KebabToCamel<S>;
  },
  toTitle: <S extends string>(str: S): KebabToTitle<S> =>
    str
      .trim()
      .split('-')
      .map((word) => capitalize(word.toLowerCase()))
      .join(SPACE) as KebabToTitle<S>,
  /**
   * Converts a kebab-case string to PascalCase.
   * @example
   * ```ts
   * kebab.toPascal('node-edit')        // 'NoEdit'
   * kebab.toPascal('no-verify')        // 'NoVerify'
   * kebab.toPascal('a-a-a-a-a-a')      // 'AAAAAA'
   * ```
   */
  toPascal: <S extends string>(str: S): KebabToPascal<S> =>
    capitalize(kebab.toCamel(str))
} as const;
export const title = {
  is: <S extends string = string>(
    str: unknown,
    type: keyof typeof titleCase = 'alphabetic'
  ): str is S =>
    Prim.is.string(str) && str.length > 0 && titleCase[type].test(str),
  toKebab: <S extends string>(str: S): TitleToKebab<S> =>
    str.trim().toLowerCase().replaceAll(/\s+/g, '-') as TitleToKebab<S>,
  toCamel: <S extends string>(str: S): KebabToCamel<TitleToKebab<S>> =>
    kebab.toCamel(title.toKebab(str)),
  toPascal: <S extends string>(str: S): KebabToPascal<TitleToKebab<S>> =>
    kebab.toPascal(title.toKebab(str))
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

export const is = {
  str: Prim.is.string,
  /** Checks if a value is a string containing only alphanumeric characters. */
  alphanumeric: (str: unknown): str is string =>
    Prim.is.string(str) && alphanumeric.test(str),
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
    Prim.is.string(str) && alphabetic.test(str),

  /** Checks if a value is a single character string */
  char: (str: unknown): str is string =>
    Prim.is.string(str) && str.length === 1,

  /** Checks if a string is capitalized (first letter uppercase, rest lowercase). */
  capitalized: (str: unknown): str is string =>
    Prim.is.string(str) && str.length > 0 && capitalized.test(str),

  /** Checks if a string is prefixed with a specific string. */
  prefixed: <P extends string = string, S extends string = string>(
    str: unknown,
    p: P
  ): str is Prefix<P, S> =>
    Prim.is.string(str) && str.startsWith(p) && str.length > p.length,

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
    s: P
  ): str is Suffix<S, P> =>
    Prim.is.string(str) && str.endsWith(s) && str.length > s.length,

  /** Checks if a value is an array containing only strings. */
  array: (input: unknown): input is string[] =>
    Array.isArray(input) && input.every(Prim.is.string)
} as const;

export const split = {
  /** Splits a string by a specified pattern (string or RegExp) and normalizes the result. */
  by: (input: string, pattern: RegExp | string) =>
    normalize.array(input.split(pattern)),
  /**
   * Splits csv (comma separated values) into an array of trimmed strings.
   *
   * @example
   * ```ts
   * split.csv(' foo, bar , ,baz ') // ['foo', 'bar', 'baz']
   * split.csv('') // []
   * ```
   */
  csv: (input = ''): string[] => split.by(input, ','),
  /**
   * Splits a multiline string into an array of trimmed lines.
   *
   * @example
   * ```ts
   * split.lines(' foo \n bar \n\n baz ') // ['foo', 'bar', 'baz']
   * split.lines('') // []
   * ```
   */
  space: (input = ''): string[] => split.by(input, space),
  /**
   * Splits a multiline string into an array of trimmed lines.
   *
   * @example
   * ```ts
   * split.lines(' foo \n bar \n\n baz ') // ['foo', 'bar', 'baz']
   * split.lines('') // []
   * ```
   */
  lines: (input = ''): string[] => split.by(input, EOL),
  /**
   * Splits a new line separate rows csv string into an array of arrays of trimmed strings.
   *
   * @example
   * ```ts
   * split.csvRows('a,b , c\nd,e,f\r\ng,h,i')
   * // [
   * //   ['a', 'b', 'c'],
   * //   ['d', 'e', 'f'],
   * //   ['g', 'h', 'i']
   * // ]
   * split.csvRows('') // []
   * ```
   */
  csvRows: (input = ''): string[][] =>
    normalize.array(split.lines(input)).map(split.csv)
} as const;

export interface NormalizeArrayOptions {
  deduplicate?: boolean;
}
export interface NormalizeSentenceOptions {
  capitalizeFirst?: boolean;
  endPunctuation?: string;
}
export const normalize: {
  /**
   * Cleans an array of strings:
   * - Trims whitespace from each string.
   * - Filters out empty strings and non-string values.
   * - Returns an empty array if the input is undefined or empty.
   * - Optionally deduplicates the array.
   * @example
   * ```ts
   * normalize.array([' foo ', 'bar', '', 123, null, undefined, 'baz '])
   * // ['foo', 'bar', 'baz']
   * normalize.array(undefined) // []
   * normalize.array([]) // []
   * normalize.array(['a', 'b', 'a'], true) // ['a', 'b']
   * ```
   */
  array: (arr?: unknown, options?: NormalizeArrayOptions) => string[];
  /**
   * Normalizes a string into a well-formed sentence:
   * - Trims whitespace from the string.
   * - Capitalizes the first letter (optional, default: true).
   * - Ensures the string ends with proper punctuation (optional, default: '.').
   * - Returns an empty string if the input is not a valid string.
   * @example
   * ```ts
   * normalize.sentence(' hello world ') // 'Hello world.'
   * normalize.sentence('hello world', { endPunctuation: '!' }) // 'Hello world!'
   * normalize.sentence('Hello world.') // 'Hello world.'
   * normalize.sentence('') // ''
   * normalize.sentence(123) // ''
   * ```
   */
  sentence: (str: unknown, options?: NormalizeSentenceOptions) => string;
} = {
  sentence: (str, { capitalizeFirst = true, endPunctuation = '.' } = {}) => {
    let result = Prim.coerce.string(str).trim();
    if (!result) return '';
    if (capitalizeFirst && !capitalized.test(result))
      result = capitalize(result);
    if (endPunctuation && !punctuated.test(result)) result += endPunctuation;
    return result;
  },
  array: (arr: unknown = [], { deduplicate = false } = {}): string[] => {
    const result = Arr.transform(Arr.to(arr), (item) => {
      if (Prim.is.string(item)) {
        const trimmed = item.trim();
        if (trimmed.length > 0) return trimmed;
      }
      return undefined;
    });
    return deduplicate ? Arr.dedupe(result) : result;
  }
} as const;
export * as regex from './regex.js';
