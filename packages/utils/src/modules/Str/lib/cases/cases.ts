import type {
  CamelToKebab,
  CamelToPascal,
  KebabToCamel,
  KebabToPascal,
  KebabToSnake,
  PascalToCamel,
  PascalToKebab,
  PascalToSnake,
  SnakeToCamel,
  SnakeToKebab,
  SnakeToPascal
} from '@toolbox-ts/types/defs/string';

import {
  assertIsStringCamelCase,
  assertIsStringKebabCase,
  assertIsStringPascalCase,
  assertIsStringSnakeCase,
  isStringCamelCase,
  isStringKebabCase,
  isStringPascalCase,
  isStringSnakeCase
} from '../../../../core/guards/primitives/strs/index.js';
import { capitalize, uncapitalize } from '../base/base.js';

//#region> Cases
export const camel = {
  is: isStringCamelCase,
  assert: assertIsStringCamelCase,
  /**
   * Basic camel to kebab text conversion
   * - Ensures the first letter is lowercase.
   * - Separates uppercase letters and prefixes with hyphen
   *  - This behavior is chosen to align the result with the CamelToKebab Type.
   * - Converts full string to lowercase.
   * @example
   * ```ts
   * camelToKebab('noEdit')                 // 'no-edit'
   * camelToKebab('helloWorldHowAreYou')    // 'hello-world-how-are-you-doing-today'
   * camelToKebab('aAAAAA')                 // 'a-a-a-a-a-a'
   * ```
   */
  toKebab: <S extends string>(str: S): CamelToKebab<S> =>
    uncapitalize(str)
      .replaceAll(/([A-Z])/g, '-$1')
      .toLowerCase() as CamelToKebab<S>,
  /**
   * Converts a camelCase string to PascalCase.
   *
   * @template S - The camelCase string to convert.
   * @example
   * ```ts
   * camel.toPascal('camelCase') // 'CamelCase'
   * camel.toPascal('helloWorld') // 'HelloWorld'
   * ```
   */
  toPascal: <S extends string>(s: S): CamelToPascal<S> => capitalize<S>(s),
  /**
   * Converts a camelCase string to snake_case.
   *
   * @example
   * ```ts
   * camel.toSnake('camelCase') // 'camel_case'
   * camel.toSnake('helloWorld') // 'hello_world'
   * ```
   */
  toSnake: <S extends string>(str: S): KebabToSnake<CamelToKebab<S>> =>
    str.replaceAll(/([A-Z])/g, '_$1').toLowerCase() as KebabToSnake<
      CamelToKebab<S>
    >
} as const;
export const pascal = {
  is: isStringPascalCase,
  assert: assertIsStringPascalCase,
  /**
   * Converts a PascalCase string to kebab-case.
   *
   * @example
   * ```ts
   * pascal.toKebab('PascalCase') // 'pascal-case'
   * pascal.toKebab('HelloWorld') // 'hello-world'
   * ```
   */
  toKebab: <S extends string>(str: S): PascalToKebab<S> =>
    camel.toKebab(uncapitalize(str)),
  /**
   * Converts a PascalCase string to camelCase.
   *
   * @example
   * ```ts
   * pascal.toCamel('PascalCase') // 'pascalCase'
   * pascal.toCamel('HelloWorld') // 'helloWorld'
   * ```
   */
  toCamel: <S extends string>(s: S): PascalToCamel<S> => uncapitalize<S>(s),
  /**
   * Converts a PascalCase string to snake_case.
   *
   * @example
   * ```ts
   * pascal.toSnake('PascalCase') // 'pascal_case'
   * pascal.toSnake('HelloWorld') // 'hello_world'
   * ```
   */
  toSnake: <S extends string>(str: S): PascalToSnake<S> =>
    camel.toSnake(uncapitalize(str))
} as const;
export const kebab = {
  is: isStringKebabCase,
  assert: assertIsStringKebabCase,
  /**
   * Converts a kebab-case string to camelCase.
   * @example
   * ```ts
   * kebab.toCamel('node-edit')        // 'noEdit'
   * kebab.toCamel('no-verify')        // 'noVerify'
   * kebab.toCamel('a-a-a-a-a-a')      // 'aAAAAA'
   * ```
   */
  toCamel: <S extends string>(str: S): KebabToCamel<S> => {
    const [first, ...rest] = str.split('-');
    return `${first.toLowerCase()}${rest.map(capitalize).join('')}` as KebabToCamel<S>;
  },
  /**
   * Converts a kebab-case string to PascalCase.
   * @example
   * ```ts
   * kebab.toPascal('node-edit')        // 'NoEdit'
   * kebab.toPascal('no-verify')        // 'NoVerify'
   * kebab.toPascal('a-a-a-a-a-a')      // 'AAAAAA'
   * ```
   */
  toPascal: <S extends string>(str: S): KebabToPascal<S> =>
    capitalize(kebab.toCamel(str)),
  /**
   * Converts a kebab-case string to snake_case.
   *
   * @example
   * ```ts
   * kebab.toSnake('kebab-case') // 'kebab_case'
   * kebab.toSnake('no-verify')  // 'no_verify'
   * ```
   */
  toSnake: <S extends string>(str: S): KebabToSnake<S> =>
    str.toLowerCase().replaceAll('-', '_') as KebabToSnake<S>
} as const;
export const snake = {
  is: isStringSnakeCase,
  assert: assertIsStringSnakeCase,
  /**
   * Converts a snake_case string to kebab-case.
   * @example
   * ```ts
   * snake.toKebab('node_edit')        // 'node-edit'
   * snake.toKebab('no_verify')        // 'no-verify'
   * snake.toKebab('a_a_a_a_a_a')      // 'a-a-a-a-a-a'
   * ```
   */
  toKebab: <S extends string>(str: S): SnakeToKebab<S> =>
    str.toLowerCase().replaceAll('_', '-') as SnakeToKebab<S>,
  /**
   * Converts a snake_case string to camelCase.
   *
   * @example
   * ```ts
   * snake.toCamel('snake_case') // 'snakeCase'
   * snake.toCamel('no_verify')  // 'noVerify'
   * ```
   */
  toCamel: <S extends string>(str: S): SnakeToCamel<S> =>
    kebab.toCamel(snake.toKebab(str)),
  /**
   * Converts a snake_case string to PascalCase.
   *
   * @example
   * ```ts
   * snake.toPascal('snake_case') // 'SnakeCase'
   * snake.toPascal('no_verify')  // 'NoVerify'
   * ```
   */
  toPascal: <S extends string>(str: S): SnakeToPascal<S> =>
    kebab.toPascal(snake.toKebab(str))
} as const;
//#endregion
