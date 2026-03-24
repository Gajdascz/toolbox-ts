// oxlint-disable no-unused-vars
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
  checkIsStringPunctuated,
  checkIsStringSemVer,
  isStringSnakeCase,
  isStringTruthy
} from '../../../core/guards/primitives/strs/index.js';
export const is = {
  /** @narrows `string` */
  any: isString,
  /** @narrows {@link IsCamelCase} */
  camelCase: isStringCamelCase,
  /** @narrows {@link IsCapitalized} */
  capitalized: isStringCapitalized,
  /** @narrows {@link Falsy} */
  falsy: isStringFalsy,
  /** @narrows {@link IsKebabCase} */
  kebabCase: isStringKebabCase,
  /** @narrows {@link IsPascalCase} */
  pascalCase: isStringPascalCase,
  /** @narrows {@link IsSnakeCase} */
  snakeCase: isStringSnakeCase,

  /** @narrows {@link Truthy} */
  truthy: isStringTruthy
} as const;

export const assert = {
  /** @asserts `string` */
  any: assertIsString,
  /** @asserts {@link IsCamelCase} */
  camelCase: assertIsStringCamelCase,
  /** @asserts {@link IsCapitalized} */
  capitalized: assertIsStringCapitalized,
  /** @asserts {@link Falsy} */
  falsy: assertIsStringFalsy,
  /** @asserts {@link IsKebabCase} */
  kebabCase: assertIsStringKebabCase,
  /** @asserts {@link IsPascalCase} */
  pascalCase: assertIsStringPascalCase,
  /** @asserts {@link IsSnakeCase} */
  stringPunctuated: assertIsStringPunctuated,
  /** @asserts a string is punctuated. */
  stringSemVer: assertIsStringSemver,
  /** @asserts a string is a valid semantic version (semver) */
  snakeCase: assertIsStringSnakeCase,
  /** @asserts {@link Truthy} */
  truthy: assertIsStringTruthy
} as const;

export const check = {
  /** @checks `string` */
  any: checkIsString,
  /** @checks {@link IsCamelCase} */
  camelCase: checkIsStringCamelCase,
  /** @checks {@link Falsy} */
  falsy: checkIsStringFalsy,
  /** @checks {@link IsKebabCase} */
  kebabCase: checkIsStringKebabCase,
  /** @checks {@link IsPascalCase} */
  pascalCase: checkIsStringPascalCase,
  /** @checks {@link IsSnakeCase} */
  snakeCase: checkIsStringSnakeCase,
  /** @checks {@link Truthy} */
  truthy: checkIsStringTruthy,
  /** @checks {@link IsCapitalized} */
  capitalized: checkIsStringCapitalized,
  /** @checks if string is punctuated. */
  punctuated: checkIsStringPunctuated,
  /** @checks if string is a valid semantic version (semver) */
  semver: checkIsStringSemVer
} as const;
