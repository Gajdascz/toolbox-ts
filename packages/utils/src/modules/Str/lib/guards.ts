/* c8 ignore start */
import type {
  Falsy,
  IsCamelCase,
  IsCapitalized,
  IsKebabCase,
  IsPascalCase,
  IsSnakeCase,
  Truthy
} from '@toolbox-ts/types/defs/string';

import {
  assertIsString,
  assertIsStringCamelCase,
  assertIsStringCapitalized,
  assertIsStringFalsy,
  assertIsStringKebabCase,
  assertIsStringPascalCase,
  assertIsStringPunctuated,
  assertIsStringSemver,
  assertIsStringSnakeCase,
  assertIsStringTruthy,
  checkIsString,
  checkIsStringCamelCase,
  checkIsStringCapitalized,
  checkIsStringFalsy,
  checkIsStringKebabCase,
  checkIsStringPascalCase,
  checkIsStringSnakeCase,
  checkIsStringTruthy,
  isString,
  isStringCamelCase,
  isStringCapitalized,
  isStringFalsy,
  isStringKebabCase,
  isStringPascalCase,
  isStringPunctuated,
  isStringSemVer,
  isStringSnakeCase,
  isStringTruthy
} from '../../../core/guards/primitives/strs/index.js';
export const is = {
  /** @narrows `string` */
  string: isString,
  /** @narrows {@link IsCamelCase} */
  stringCamelCase: isStringCamelCase,
  /** @narrows {@link IsCapitalized} */
  stringCapitalized: isStringCapitalized,
  /** @narrows {@link Falsy} */
  stringFalsy: isStringFalsy,
  /** @narrows {@link IsKebabCase} */
  stringKebabCase: isStringKebabCase,
  /** @narrows {@link IsPascalCase} */
  stringPascalCase: isStringPascalCase,
  /** @narrows {@link IsSnakeCase} */
  stringSnakeCase: isStringSnakeCase,
  /** @checks if string is punctuated. */
  stringPunctuated: isStringPunctuated,
  /** @checks if string is a valid semantic version (semver) */
  stringSemVer: isStringSemVer,
  /** @narrows {@link Truthy} */
  stringTruthy: isStringTruthy
} as const;

export const assert = {
  /** @asserts `string` */
  string: assertIsString,
  /** @asserts {@link IsCamelCase} */
  stringCamelCase: assertIsStringCamelCase,
  /** @asserts {@link IsCapitalized} */
  stringCapitalized: assertIsStringCapitalized,
  /** @asserts {@link Falsy} */
  stringFalsy: assertIsStringFalsy,
  /** @asserts {@link IsKebabCase} */
  stringKebabCase: assertIsStringKebabCase,
  /** @asserts {@link IsPascalCase} */
  stringPascalCase: assertIsStringPascalCase,
  /** @asserts {@link IsSnakeCase} */
  stringPunctuated: assertIsStringPunctuated,
  /** @asserts a string is punctuated. */
  stringSemVer: assertIsStringSemver,
  /** @asserts a string is a valid semantic version (semver) */
  stringSnakeCase: assertIsStringSnakeCase,
  /** @asserts {@link Truthy} */
  stringTruthy: assertIsStringTruthy
} as const;

export const check = {
  /** @checks `string` */
  string: checkIsString,
  /** @checks {@link IsCamelCase} */
  stringCamelCase: checkIsStringCamelCase,
  /** @checks {@link Falsy} */
  stringFalsy: checkIsStringFalsy,
  /** @checks {@link IsKebabCase} */
  stringKebabCase: checkIsStringKebabCase,
  /** @checks {@link IsPascalCase} */
  stringPascalCase: checkIsStringPascalCase,
  /** @checks {@link IsSnakeCase} */
  stringSnakeCase: checkIsStringSnakeCase,
  /** @checks {@link Truthy} */
  stringTruthy: checkIsStringTruthy,
  /** @checks {@link IsCapitalized} */
  stringCapitalized: checkIsStringCapitalized
} as const;
/* c8 ignore end */
