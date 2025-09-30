/**
 * @module Regex
 *
 * Utility constants for commonly used regular expressions.
 */

/**
 * Validates a semantic version string.
 *
 * @see  https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
 */
export const semver =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/**
 * Basic alphabetic pattern
 *
 * @example
 * ```ts
 * alphabetic.test('HelloWorld') // true
 * alphabetic.test('Hello123') // false
 * ```
 */
export const alphabetic = /^[A-Za-z]+$/;
/**
 * Alphanumeric pattern
 *
 * @example
 * ```ts
 * alphanumeric.test('Hello123') // true
 * alphanumeric.test('Hello_123') // false
 * ```
 */
export const alphanumeric = /^[A-Za-z0-9]+$/;
/**
 * Punctuation pattern (matches any Unicode punctuation character)
 *
 * @example
 * ```ts
 * punctuation.test('Hello!') // true
 * punctuation.test('Hello') // false
 * ```
 */
export const punctuation = /\p{P}/gu;
/**
 * Whitespace pattern (matches one or more whitespace characters)
 *
 * @example
 * ```ts
 * whitespace.test('Hello World') // true
 * whitespace.test('HelloWorld') // false
 * ```
 */
export const whitespace = /\s+/g;
/**
 * Pattern to match capitalized strings (starting with an uppercase letter)
 *
 * @example
 * ```ts
 * capitalized.test('Hello') // true
 * capitalized.test('hello') // false
 * ```
 */
export const capitalized = /^[A-Z]/;
/**
 * Pattern to match strings ending with punctuation
 *
 * @example
 * ```ts
 * punctuated.test('Hello!') // true
 * punctuated.test('Hello') // false
 * ```
 */
export const punctuated = /\p{P}$/u;

/**
 * Pattern to match strings containing only whitespace
 *
 * @example
 * ```ts
 * onlyWhitespace.test('   ') // true
 * onlyWhitespace.test('Hello') // false
 * ```
 */
export const space = /\s+/g;

/**
 * Pattern to match PascalCase strings
 */
export const pascalCase = {
  /** Checks if a string is in PascalCase format (only alphabetic characters). */
  alphabetic: /^[A-Z][a-zA-Z]*$/,
  /** Checks if a string is in PascalCase format (alphanumeric characters). */
  alphanumeric: /^[A-Z][a-zA-Z0-9]*$/
};

/**
 * Pattern to match camelCase strings
 */
export const camelCase = {
  /** Checks if a string is in camelCase format (only alphabetic characters). */
  alphabetic: /^[a-z][a-zA-Z]*$/,
  /** Checks if a string is in camelCase format (alphanumeric characters). */
  alphanumeric: /^[a-z][a-zA-Z0-9]*$/
} as const;
/**
 * Pattern to match kebab-case strings
 */
export const kebabCase = {
  /**
   * Checks if a string is in kebab-case format (only lowercase alphabetic characters).
   */
  lowercaseAlphabetic: /^[a-z]+(-[a-z]+)*$/
} as const;

export const titleCase = {
  /**
   * Title Case with alphabetic characters, words separated by space or hyphen
   */
  alphabetic: /^[A-Z][a-z]*(?:[ -][A-Z][a-z]*)*$/,

  /**
   * Title Case with alphanumeric characters, words separated by space or hyphen
   */
  alphanumeric: /^[A-Z][a-zA-Z0-9]*(?:[ -][A-Z][a-zA-Z0-9]*)*$/
};

/**
 * Pattern to match space-separated strings
 */
export const spaceSeparated = {
  /**
   * Checks if a string is in space-separated format (only alphabetic characters).
   */
  alphabetic: /^[A-Za-z]+( [A-Za-z]+)*$/,
  /**
   * Checks if a string is in space-separated format (alphanumeric characters).
   */
  alphanumeric: /^[0-9A-Za-z0-9]+( [0-9A-Za-z0-9]+)*$/
} as const;
