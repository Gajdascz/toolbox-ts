import type {
  IsCamelCase,
  IsKebabCase,
  IsPascalCase,
  IsSnakeCase
} from '@toolbox-ts/types/defs/string';

import { REGEX } from '../../../../constants/strings/index.js';
import { createTypeError } from '../../../../utils/errors/index.js';
import { isString } from '../../../base/index.js';
import { createGuard, createNames } from '../../../factories.js';

export {
  assertIsString,
  checkIsString,
  isString
} from '../../../base/index.js';
const TYPES = {
  SNAKE: 'StringSnakeCase',
  CAMEL: 'StringCamelCase',
  KEBAB: 'StringKebabCase',
  PASCAL: 'StringPascalCase'
} as const;
//#region> SnakeCase
const snake = createNames(TYPES.SNAKE);
export const isStringSnakeCase = createGuard(
  snake.isName,
  snake.typeName,
  <S extends string>(v: S): v is IsSnakeCase<S> =>
    REGEX.CASES.snake.alphanumeric.test(v)
);
export const checkIsStringSnakeCase = createGuard(
  snake.checkIsName,
  snake.typeName,
  (v: string): boolean => isString(v) && isStringSnakeCase(v)
);
export function assertIsStringSnakeCase<S extends string>(
  v: S
): asserts v is IsSnakeCase<S> {
  if (!isStringSnakeCase<S>(v))
    throw createTypeError(isStringSnakeCase.typeName, v);
}
//#endregion

//#region> KebabCase
const kebab = createNames(TYPES.KEBAB);
export const isStringKebabCase = createGuard(
  kebab.isName,
  kebab.typeName,
  <V extends string>(v: V): v is IsKebabCase<V> =>
    REGEX.CASES.kebab.alphanumeric.test(v)
);
export const checkIsStringKebabCase = createGuard(
  kebab.checkIsName,
  kebab.typeName,
  (v: string): boolean => isString(v) && isStringKebabCase(v)
);
export function assertIsStringKebabCase<V extends string>(
  v: V
): asserts v is IsKebabCase<V> {
  if (!isStringKebabCase(v))
    throw createTypeError(isStringKebabCase.typeName, v);
}
//#endregion

//#region> CamelCase
const camel = createNames(TYPES.CAMEL);
export const isStringCamelCase = createGuard(
  camel.isName,
  camel.typeName,
  <S extends string>(v: S): v is IsCamelCase<S> =>
    REGEX.CASES.camel.alphanumeric.test(v)
);
export const checkIsStringCamelCase = createGuard(
  camel.checkIsName,
  camel.typeName,
  (v: string): boolean => isString(v) && isStringCamelCase(v)
);
export function assertIsStringCamelCase<S extends string>(
  v: S
): asserts v is IsCamelCase<S> {
  if (!isStringCamelCase(v))
    throw createTypeError(isStringCamelCase.typeName, v);
}
//#endregion

//#region> PascalCase
const pascal = createNames(TYPES.PASCAL);
export const isStringPascalCase = createGuard(
  pascal.isName,
  pascal.typeName,
  <S extends string>(v: S): v is IsPascalCase<S> =>
    REGEX.CASES.pascal.alphanumeric.test(v)
);
export const checkIsStringPascalCase = createGuard(
  pascal.checkIsName,
  pascal.typeName,
  (v: string): boolean => isString(v) && isStringPascalCase(v)
);
export function assertIsStringPascalCase<S extends string>(
  v: S
): asserts v is IsPascalCase<S> {
  if (!isStringPascalCase(v))
    throw createTypeError(isStringPascalCase.typeName, v);
}
//#endregion
