import type { IsCapitalized } from '@toolbox-ts/types/defs/string';

import { REGEX } from '../../../constants/strings/index.js';
import { createTypeError } from '../../../utils/errors/index.js';
import { createCheckGuard, createGenericIsGuards, createTypeNames } from '../../factories.js';
import { isString } from '../../base/index.js';
export { assertIsString, checkIsString, isString } from '../../base/index.js';
const { Capitalized, Punctuated, SemVer } = createTypeNames('String', [
  'SemVer',
  'Punctuated',
  'Capitalized'
]);
export const checkIsStringSemVer = createCheckGuard(
  SemVer,
  (v) => isString(v) && REGEX.SEMVER.test(v)
);
export function assertIsStringSemver(v: unknown) {
  if (!checkIsStringSemVer(v)) throw createTypeError(checkIsStringSemVer.typeName, v);
}
export const checkIsStringPunctuated = createCheckGuard(
  Punctuated,
  (v) => isString(v) && REGEX.PUNC.test(v)
);
export function assertIsStringPunctuated(v: unknown) {
  if (!checkIsStringPunctuated(v)) throw createTypeError(checkIsStringPunctuated.typeName, v);
}
const _capitalized = createGenericIsGuards(
  Capitalized,
  <S extends string = string>(v: unknown): v is IsCapitalized<S> =>
    isString(v) && REGEX.CAPITALIZED.test(v)
);
export const isStringCapitalized = _capitalized.is;
export const checkIsStringCapitalized = _capitalized.check;
export function assertIsStringCapitalized(v: unknown) {
  if (!isStringCapitalized(v)) throw createTypeError(isStringCapitalized.typeName, v);
}
