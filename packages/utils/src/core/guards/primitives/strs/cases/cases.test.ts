import { runGuardSuites } from '@toolbox-ts/test-utils';
import { expectTypeOf } from 'vitest';

import {
  assertIsStringCamelCase,
  assertIsStringKebabCase,
  assertIsStringPascalCase,
  assertIsStringSnakeCase,
  checkIsStringCamelCase,
  checkIsStringKebabCase,
  checkIsStringPascalCase,
  checkIsStringSnakeCase,
  isStringCamelCase,
  isStringKebabCase,
  isStringPascalCase,
  isStringSnakeCase
} from './cases.ts';

type CamelCaseString = 'camelCase';
type KebabCaseString = 'kebab-case';
type PascalCaseString = 'PascalCase';
type SnakeCaseString = 'snake_case';

runGuardSuites(
  {
    is: isStringSnakeCase,
    assert: assertIsStringSnakeCase,
    check: checkIsStringSnakeCase,
    validValues: ['snake_case', 'long_snake_case'],
    invalidValues: ['kebab-case', '_snake_case', 'snake___case', 'snake_case_'],
    assertType:
      expectTypeOf(
        assertIsStringSnakeCase<SnakeCaseString>
      ).asserts.toEqualTypeOf<SnakeCaseString>()
      && expectTypeOf(
        assertIsStringSnakeCase<CamelCaseString>
      ).asserts.toEqualTypeOf<never>(),
    expectType:
      expectTypeOf(
        isStringSnakeCase<SnakeCaseString>
      ).guards.toEqualTypeOf<'snake_case'>()
      && expectTypeOf(
        isStringSnakeCase<PascalCaseString>
      ).guards.toEqualTypeOf<never>()
  },
  {
    is: isStringKebabCase,
    assert: assertIsStringKebabCase,
    check: checkIsStringKebabCase,
    invalidValues: ['snake_case', '-kebab-case', 'kebab---case', 'kebab-case-'],
    validValues: ['kebab-case', 'long-kebab-case'],
    assertType:
      expectTypeOf(
        assertIsStringKebabCase<KebabCaseString>
      ).asserts.toEqualTypeOf<KebabCaseString>()
      && expectTypeOf(
        assertIsStringKebabCase<CamelCaseString>
      ).asserts.toEqualTypeOf<never>(),
    expectType:
      expectTypeOf(
        isStringKebabCase<KebabCaseString>
      ).guards.toEqualTypeOf<'kebab-case'>()
      && expectTypeOf(
        isStringKebabCase<CamelCaseString>
      ).guards.toEqualTypeOf<never>()
  },
  {
    is: isStringCamelCase,
    assert: assertIsStringCamelCase,
    check: checkIsStringCamelCase,
    validValues: ['camelCase', 'longCamelCase'],
    invalidValues: ['CamelCase', 'camel_Case', 'camel-Case'],
    assertType:
      expectTypeOf(
        assertIsStringCamelCase<CamelCaseString>
      ).asserts.toEqualTypeOf<CamelCaseString>()
      && expectTypeOf(
        assertIsStringCamelCase<KebabCaseString>
      ).asserts.toEqualTypeOf<never>(),
    expectType:
      expectTypeOf(
        isStringCamelCase<CamelCaseString>
      ).guards.toEqualTypeOf<'camelCase'>()
      && expectTypeOf(
        isStringCamelCase<KebabCaseString>
      ).guards.toEqualTypeOf<never>()
  },
  {
    is: isStringPascalCase,
    assert: assertIsStringPascalCase,
    check: checkIsStringPascalCase,
    validValues: ['PascalCase', 'LongPascalCase'],
    invalidValues: ['pascalCase', 'pascalcase', 'Pascal_Case', 'Pascal-Case'],
    assertType:
      expectTypeOf(
        assertIsStringPascalCase<PascalCaseString>
      ).asserts.toEqualTypeOf<PascalCaseString>()
      && expectTypeOf(
        assertIsStringPascalCase<CamelCaseString>
      ).asserts.toEqualTypeOf<never>(),
    expectType:
      expectTypeOf(
        isStringPascalCase<PascalCaseString>
      ).guards.toEqualTypeOf<'PascalCase'>()
      && expectTypeOf(
        isStringPascalCase<CamelCaseString>
      ).guards.toEqualTypeOf<never>()
  }
);
