import { describe, expect, it } from 'vitest';

import { EXPECT } from '../../helpers/index.js';
/**
 * Asserts that the value is of type T and validates its type using `expectTypeOf`.
 *
 * @example
 * ```ts
 * import { expectTypeOf } from 'vitest';
 * ...
 * {
 *   assertType: expectTypeOf(assertIsString).asserts.toEqualTypeof<string>()
 * },
 * {
 *   assertType: expectTypeOf(assertNotString<number|string>).asserts.toEqualTypeof<number>()
 * }
 * ```
 */
export type GuardSuiteAssertTypeOf = boolean | void;
export interface GuardSuiteConfig<T> extends GuardSuiteGuards<T> {
  customCases?: {
    cases: {
      expectType?: GuardSuiteExpectTypeOf;
      itShould: string;
      run: GuardSuiteCustomCaseRun;
    }[];
    describe?: string;
  }[];
  error?: ErrorConstructor;

  invalidValues: unknown[];

  /**
   * Optional name for the guard suite if `is` function does not include `typeName` property
   * @default `is.name`
   */
  typeName?: string;
  validValues: unknown[];
}

/**
 * A function or array of functions that should return `false` if the test fails.
 */
export type GuardSuiteCustomCaseRun = () => boolean | void;
/**
 * Use to validate that the a guard properly narrows a type
 *
 * Recommended Pattern:
 * ```ts
 * import { expectTypeOf } from 'vitest';
 *
 * ...
 * {
 *   expectTypeOf: expectTypeOf(isNum).guards.toBeNumber()
 * },
 * {
 *   expectTypeOf: expectTypeOf(isNotString<number|string>).guards.toEqualTypeOf<number>(),
 * },
 *
 * ```
 */

export type GuardSuiteExpectTypeOf = boolean | void;

export interface GuardSuiteGuards<T> {
  /**
   * Asserts that the value is of type T.
   *
   * @example
   * ```ts
   * function assertIsStringArray(v: unknown): asserts v is string[] {
   *   if (!Array.isArray(v) || !v.every(item => typeof item === 'string')) {
   *     throw new TypeError('Value is not a string array');
   *   }
   * }
   * ```
   */
  assert: (v: unknown) => asserts v is T;
  assertType: GuardSuiteAssertTypeOf;
  /**
   * Checks if the value is of type T.
   *
   * @example
   * ```ts
   * function checkIsStringArray(v: unknown): boolean {
   *   return Array.isArray(v) && v.every(item => typeof item === 'string');
   * }
   * ```
   */
  check: (v: unknown) => boolean;
  expectType: GuardSuiteExpectTypeOf;
  /**
   * Determines if the value is of type T.
   *
   * @example
   * ```ts
   * function isStringArray(v: unknown): v is string[] {
   *   return Array.isArray(v) && v.every(item => typeof item === 'string');
   * }
   * Object.assign(isStringArray, { typeName: 'StringArray' });
   * ```
   */
  is: ((v: unknown) => v is T) & { readonly typeName?: string };
}
export function runGuardSuite<T>({
  assert,
  invalidValues,
  validValues,
  is,
  error = TypeError,
  check,
  customCases,
  typeName
}: GuardSuiteConfig<T>) {
  const name = typeName ?? is.typeName ?? is.name;
  describe(name, () => {
    const valid = ['Valid', validValues, true] as const;
    const invalid = ['Invalid', invalidValues, false] as const;
    describe.each([valid, invalid])('%s', (_, values, expected) => {
      describe.each([values])('value: %s', (v) => {
        const should = expected ? 'pass' : 'fail';
        it(`${is.name} ${should} for value: ${String(v)}`, () => {
          expect(is(v)).toBe(expected);
        });
        it(`${check.name} should ${should} for value: ${String(v)}`, () => {
          expect(check(v)).toBe(expected);
        });
        it(`${assert.name} should ${should} for value: ${String(v)}`, () => {
          if (expected) EXPECT.notToThrow(() => assert(v));
          else EXPECT.toThrow(() => assert(v), error);
        });
      });
    });
  });
  if (customCases) {
    for (const { cases, describe: dsc } of customCases) {
      for (const { itShould, run } of cases)
        describe(dsc ?? name, () => {
          it(itShould, () => expect(run()).not.toBe(false));
        });
    }
  }
}
export function runGuardSuites(...cfgs: GuardSuiteConfig<unknown>[]) {
  for (const cfg of cfgs) runGuardSuite(cfg);
}

export { DATA, EXPECT } from '../../helpers/index.js';
