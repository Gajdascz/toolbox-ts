import { ALPHABETIC as A, ALPHANUMERIC as AN } from '../general.js';

//#region> Cases
export const CASES = {
  snake: {
    /** Checks if a string is in snake_case format (only lowercase alphabetic characters). */
    [A]: /^[a-z]+(_[a-z]+)*$/,
    /** Checks if a string is in snake_case format (alphanumeric characters). */
    [AN]: /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/,
    /** Checks if a string is in SCREAMING_SNAKE_CASE format (only uppercase alphabetic characters). */
    screamingAlphabetic: /^[A-Z]+(_[A-Z]+)*$/,
    /** Checks if a string is in SCREAMING_SNAKE_CASE format (alphanumeric characters). */
    screamingAlphaNumeric: /^[A-Z][A-Z0-9]+(_[A-Z0-9]+)*$/
  },
  title: {
    /**
     * Title Case with alphabetic characters, words separated by space or hyphen
     */
    [A]: /^[A-Z][a-z]*(?:[ -][A-Z][a-z]*)*$/,
    /**
     * Title Case with alphanumeric characters, words separated by space or hyphen
     */
    [AN]: /^[A-Z][a-zA-Z0-9]*(?:[ -][A-Z][a-zA-Z0-9]*)*$/
  },
  /**
   * Pattern to match PascalCase strings
   */
  pascal: {
    /** Checks if a string is in PascalCase format (only alphabetic characters). */
    [A]: /^[A-Z][a-zA-Z]*$/,
    /** Checks if a string is in PascalCase format (alphanumeric characters). */
    [AN]: /^[A-Z][a-zA-Z0-9]*$/
  },
  /**
   * Pattern to match camelCase strings
   */
  camel: {
    /** Checks if a string is in camelCase format (only alphabetic characters). */
    [A]: /^[a-z][a-zA-Z]*$/,
    /** Checks if a string is in camelCase format (alphanumeric characters). */
    [AN]: /^[a-z][a-zA-Z0-9]*$/
  },
  /**
   * Pattern to match kebab-case strings
   */
  kebab: {
    /**
     * Checks if a string is in kebab-case format (only lowercase alphabetic characters).
     */
    [A]: /^[a-z]+(-[a-z]+)*$/,
    /**
     * Checks if a string is in kebab-case format (alphanumeric characters).
     */
    [AN]: /^[a-z][a-z0-9]+(-[a-z0-9]+)*$/
  }
} as const;
//#endregion

export const SEMVER =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const PUNC = /\p{P}$/u;

export const WS = /\s+/;
export const CAPITALIZED = /^[A-Z]/;
