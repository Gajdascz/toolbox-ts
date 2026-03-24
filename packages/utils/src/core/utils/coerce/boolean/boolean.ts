// oxlint-disable no-unused-vars
import type { Falsy, Truthy } from '@toolbox-ts/types/defs/string';

import { isStringFalsy, isStringTruthy } from '../../../guards/primitives/strs/boolish/boolish.js';
export interface CoerceBooleanOpts {
  /**
   * Strings that should be interpreted as `false` (case-insensitive).
   *
   * @important @see {@link Falsy} for already provided common falsy strings.
   */
  falsy?: string[];
  /**
   * Strings that should be interpreted as `true` (case-insensitive).
   *
   * @important @see {@link Truthy} for already provided common truthy strings.
   */
  truthy?: string[];
}
/**
 * Coerces a value to a boolean.
 * - For boolean inputs, returns the input as is.
 * - For string inputs, checks against predefined truthy and falsy string sets (case-insensitive).
 * - For all other types, uses standard JavaScript truthiness evaluation.
 */
export const coerceBoolean = (
  input: unknown,
  { falsy = [], truthy = [] }: CoerceBooleanOpts = {}
): boolean => {
  switch (typeof input) {
    case 'boolean':
      return input;
    case 'string': {
      const normalized = input.toLowerCase().trim();
      if (falsy.includes(normalized) || isStringFalsy(normalized)) return false;
      if (truthy.includes(normalized) || isStringTruthy(normalized)) return true;
    }
  }
  return Boolean(input);
};
