import type { IsCapitalized } from '@toolbox-ts/types/defs/string';

import { REGEX } from '../../../constants/strings/index.js';
import { createTypeError } from '../../../utils/errors/index.js';
import { isString } from '../../base/index.js';
import { createGuard, createNames } from '../../factories.js';
const TYPES = {
  SEMVER: 'StringSemVer',
  PUNCTUATED: 'StringPunctuated',
  CAPITALIZED: 'StringCapitalized'
} as const;
const semver = createNames(TYPES.SEMVER);
export const isStringSemVer = createGuard(
  semver.isName,
  semver.typeName,
  (v) => isString(v) && REGEX.SEMVER.test(v)
);
export function assertIsStringSemver(v: unknown) {
  if (!isStringSemVer(v)) throw createTypeError(isStringSemVer.typeName, v);
}
const punctuated = createNames(TYPES.PUNCTUATED);
export const isStringPunctuated = createGuard(
  punctuated.isName,
  punctuated.typeName,
  (v) => isString(v) && REGEX.PUNC.test(v)
);
export function assertIsStringPunctuated(v: unknown) {
  if (!isStringPunctuated(v))
    throw createTypeError(isStringPunctuated.typeName, v);
}
const capitalized = createNames(TYPES.CAPITALIZED);
export const isStringCapitalized = createGuard(
  capitalized.isName,
  capitalized.typeName,
  <S extends string = string>(v: unknown): v is IsCapitalized<S> =>
    isString(v) && REGEX.CAPITALIZED.test(v)
);
export const checkIsStringCapitalized = createGuard(
  capitalized.checkIsName,
  capitalized.typeName,
  isStringCapitalized as (v: unknown) => boolean
);
export function assertIsStringCapitalized(v: unknown) {
  if (!isStringCapitalized(v))
    throw createTypeError(isStringCapitalized.typeName, v);
}
