import type { Falsy, Truthy } from '@toolbox-ts/types/defs/string';

import { runGuardSuites } from '@toolbox-ts/test-utils';
import { expectTypeOf } from 'vitest';

import { BOOLISH } from '../../../../constants/strings/index.ts';
import {
  assertIsStringFalsy,
  assertIsStringTruthy,
  checkIsStringFalsy,
  checkIsStringTruthy,
  isStringFalsy,
  isStringTruthy
} from './boolish.js';
const TRUTHY_VALUES = Object.values(BOOLISH.TRUTHY);
const FALSY_VALUES = Object.values(BOOLISH.FALSY);
runGuardSuites(
  {
    is: isStringTruthy,
    assert: assertIsStringTruthy,
    check: checkIsStringTruthy,
    validValues: TRUTHY_VALUES,
    invalidValues: FALSY_VALUES,
    assertType:
      expectTypeOf(assertIsStringTruthy).asserts.toEqualTypeOf<Truthy>(),
    expectType: expectTypeOf(isStringTruthy).guards.toEqualTypeOf<Truthy>()
  },
  {
    is: isStringFalsy,
    assert: assertIsStringFalsy,
    check: checkIsStringFalsy,
    validValues: FALSY_VALUES,
    invalidValues: TRUTHY_VALUES,
    assertType:
      expectTypeOf(assertIsStringFalsy).asserts.toEqualTypeOf<Falsy>(),
    expectType: expectTypeOf(isStringFalsy).guards.toEqualTypeOf<Falsy>()
  }
);
