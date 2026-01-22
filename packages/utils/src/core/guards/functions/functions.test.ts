import type { Fn } from '@toolbox-ts/types';

import { runGuardSuites } from '@toolbox-ts/test-utils';
import { expectTypeOf } from 'vitest';

import {
  assertIsFunction,
  assertIsFunctionAsync,
  assertIsFunctionAsyncGenerator,
  assertIsFunctionSync,
  assertIsFunctionSyncGenerator,
  checkIsFunction,
  checkIsFunctionAsync,
  checkIsFunctionAsyncGenerator,
  checkIsFunctionSync,
  checkIsFunctionSyncGenerator,
  isFunction,
  isFunctionAsync,
  isFunctionAsyncGenerator,
  isFunctionSync,
  isFunctionSyncGenerator
} from './functions.ts';

const SHARED_INVALID = [null, undefined, 42, 'string', {}, []];

type Thousand = 1000;
type Yes = 'yes';
runGuardSuites(
  {
    is: isFunction,
    assert: assertIsFunction,
    check: checkIsFunction,
    validValues: [
      () => {},
      function () {},
      async function () {},
      function* () {},
      async function* () {}
    ],
    invalidValues: SHARED_INVALID,
    expectType: expectTypeOf(isFunction).guards.toEqualTypeOf<Fn.Any>(),
    assertType: expectTypeOf(assertIsFunction).asserts.toEqualTypeOf<Fn.Any>()
  },
  {
    is: isFunctionAsync,
    assert: assertIsFunctionAsync,
    check: checkIsFunctionAsync,
    validValues: [async () => {}, async function () {}, async function* () {}],
    invalidValues: [
      ...SHARED_INVALID,
      () => {},
      function () {},
      function* () {}
    ],
    expectType: expectTypeOf(isFunctionAsync).guards.toEqualTypeOf<Fn.Async>(),
    assertType: expectTypeOf(
      assertIsFunctionAsync
    ).asserts.toEqualTypeOf<Fn.Async>()
  },
  {
    is: isFunctionSync,
    assert: assertIsFunctionSync,
    check: checkIsFunctionSync,
    validValues: [() => {}, function () {}, function* () {}],
    invalidValues: [
      ...SHARED_INVALID,
      async () => {},
      async function () {},
      async function* () {}
    ],
    expectType: expectTypeOf(isFunctionSync).guards.toEqualTypeOf<Fn.Sync>(),
    assertType:
      expectTypeOf(assertIsFunctionSync).asserts.toEqualTypeOf<Fn.Sync>()
  },
  {
    is: isFunctionSyncGenerator,
    assert: assertIsFunctionSyncGenerator,
    check: checkIsFunctionSyncGenerator,
    validValues: [function* () {}],
    invalidValues: [
      ...SHARED_INVALID,
      () => {},
      function () {},
      async () => {},
      async function () {},
      async function* () {}
    ],
    expectType: expectTypeOf(
      isFunctionSyncGenerator
    ).guards.toEqualTypeOf<GeneratorFunction>(),
    assertType: expectTypeOf(
      assertIsFunctionSyncGenerator
    ).asserts.toEqualTypeOf<GeneratorFunction>()
  },
  {
    is: isFunctionAsyncGenerator,
    assert: assertIsFunctionAsyncGenerator,
    check: checkIsFunctionAsyncGenerator,
    validValues: [async function* () {}],
    invalidValues: [
      ...SHARED_INVALID,
      () => {},
      function () {},
      function* () {},
      async () => {},
      async function () {}
    ],
    expectType: expectTypeOf(
      isFunctionAsyncGenerator
    ).guards.toEqualTypeOf<AsyncGeneratorFunction>(),
    assertType: expectTypeOf(
      assertIsFunctionAsyncGenerator
    ).asserts.toEqualTypeOf<AsyncGeneratorFunction>()
  }
);
