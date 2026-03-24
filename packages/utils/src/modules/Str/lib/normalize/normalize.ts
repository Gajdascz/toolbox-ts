import type { Arr } from '@toolbox-ts/types/defs/array';

import { checkIsStringPunctuated } from '../../../../core/guards/primitives/strs/index.js';
import { capitalize } from '../base/base.js';

export interface NormalizeArrayOptions {
  deduplicate?: boolean;
}
export interface NormalizeSentenceOptions {
  capitalizeFirst?: boolean;
  endPunctuation?: string;
}
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

export const array = <A extends Arr = unknown[]>(
  a: unknown = [],
  { deduplicate = false }: NormalizeArrayOptions = {}
): (A[number] & string)[] => {
  const input = Array.isArray(a) ? a : [a];
  const clean: string[] = [];
  for (const item of input) {
    if (typeof item === 'string') {
      const trimmed = item.trim();
      if (trimmed.length > 0) clean.push(trimmed);
    }
  }
  return deduplicate ? Array.from(new Set(clean)) : clean;
};
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
 * ```
 */
export const sentence = (str: unknown, { capitalizeFirst = true, endPunctuation = '.' } = {}) => {
  if (typeof str !== 'string') return '';
  let result = str.trim();
  if (!result) return '';
  if (capitalizeFirst) result = capitalize(result);
  if (endPunctuation && !checkIsStringPunctuated(result)) result += endPunctuation;
  return result;
};
