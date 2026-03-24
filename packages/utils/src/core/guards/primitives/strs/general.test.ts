import { type GuardSuiteConfig, runGuardSuites } from '@toolbox-ts/test-utils';
import { expectTypeOf } from 'vitest';

import {
  assertIsStringCapitalized,
  assertIsStringPunctuated,
  assertIsStringSemver,
  isStringCapitalized,
  checkIsStringPunctuated,
  checkIsStringSemVer
} from './general.ts';

const createEntry = (
  is: (v: unknown) => boolean,
  assert: (v: unknown) => void,
  validValues: unknown[],
  invalidValues: unknown[]
): GuardSuiteConfig<any> =>
  ({
    is,
    assert,
    check: is,
    expectType: expectTypeOf<never>().toEqualTypeOf<never>(),
    assertType: expectTypeOf<never>().toEqualTypeOf<never>(),
    validValues,
    invalidValues
  }) as GuardSuiteConfig<any>;

runGuardSuites(
  createEntry(
    checkIsStringSemVer,
    assertIsStringSemver,
    ['1.0.0', '2.0.0', '1.0.0-alpha', '1.0.0+build.1'],
    ['1', '1.0', '1.0.0.0', 'a.b.c']
  ),
  createEntry(
    checkIsStringPunctuated,
    assertIsStringPunctuated,
    ['Hello, world!', 'This is a test.'],
    ['hello world', 'this is a test']
  ),
  createEntry(
    isStringCapitalized,
    assertIsStringCapitalized,
    ['Hello', 'World'],
    ['hello', 'world']
  )
);
