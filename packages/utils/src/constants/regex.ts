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

/** Validates a string only contains alphabetic characters. */
export const alphabetic = /^[A-Za-z]+$/;
/** Validates a string in camelCase format. */
export const camel = {
  /** Validates a camelCase string with only alphabetic characters. */
  alphabetic: /^[a-z][a-zA-Z]*$/
} as const;
/** Validates a string in kebab-case format. */
export const kebab = {
  /** Validates a kebab-case string with only lowercase alphabetic characters. */
  lowercaseAlphabetic: /^[a-z]+(-[a-z]+)*$/
} as const;
