import type {
  IsCamelCase,
  IsKebabCase,
  IsPascalCase,
  IsSnakeCase
} from '@toolbox-ts/types/defs/string';

import { REGEX } from '../../../../constants/strings/index.js';
import { createTypeError } from '../../../../utils/errors/index.js';
import { createGenericIsGuards, createTypeNames } from '../../../factories.js';

const { Camel, Kebab, Pascal, Snake } = createTypeNames('StringCase', [
  'Snake',
  'Camel',
  'Kebab',
  'Pascal'
]);
//#region> Snake
const _snake = createGenericIsGuards(Snake, <S extends string>(v: S): v is IsSnakeCase<S> =>
  REGEX.CASES.snake.alphanumeric.test(v)
);
//
export const isStringSnakeCase = _snake.is;
export const checkIsStringSnakeCase = _snake.check;
export function assertIsStringSnakeCase<S extends string>(v: S): asserts v is IsSnakeCase<S> {
  if (!isStringSnakeCase<S>(v)) throw createTypeError(isStringSnakeCase.typeName, v);
}
//#endregion

//#region> Kebab
const _kebab = createGenericIsGuards(Kebab, <V extends string>(v: V): v is IsKebabCase<V> =>
  REGEX.CASES.kebab.alphanumeric.test(v)
);
//
export const isStringKebabCase = _kebab.is;
export const checkIsStringKebabCase = _kebab.check;
export function assertIsStringKebabCase<V extends string>(v: V): asserts v is IsKebabCase<V> {
  if (!isStringKebabCase(v)) throw createTypeError(isStringKebabCase.typeName, v);
}
//#endregion

//#region> Camel
const _camel = createGenericIsGuards(Camel, <S extends string>(v: S): v is IsCamelCase<S> =>
  REGEX.CASES.camel.alphanumeric.test(v)
);
//
export const isStringCamelCase = _camel.is;
export const checkIsStringCamelCase = _camel.check;
export function assertIsStringCamelCase<S extends string>(v: S): asserts v is IsCamelCase<S> {
  if (!isStringCamelCase(v)) throw createTypeError(isStringCamelCase.typeName, v);
}
//#endregion

//#region> Pascal
const _pascal = createGenericIsGuards(Pascal, <S extends string>(v: S): v is IsPascalCase<S> =>
  REGEX.CASES.pascal.alphanumeric.test(v)
);
//
export const isStringPascalCase = _pascal.is;
export const checkIsStringPascalCase = _pascal.check;
export function assertIsStringPascalCase<S extends string>(v: S): asserts v is IsPascalCase<S> {
  if (!isStringPascalCase(v)) throw createTypeError(isStringPascalCase.typeName, v);
}
//#endregion
