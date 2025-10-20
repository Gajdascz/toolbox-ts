import { describe, expect, it } from 'vitest';

import { DATA, EXPECT } from '../../helpers/index.js';

export const IS = {
  num: (v: unknown): v is number => typeof v === 'number',
  str: (v: unknown): v is string => typeof v === 'string'
} as const;

export const MIXED_GUARDS = {
  tuple: DATA.TUPLES.mixed.map(([_, v]) =>
    typeof v === 'number' ? IS.num : IS.str
  ),
  record: (Object.keys(DATA.RECORDS.mixed) as DATA.ValidKey[]).reduce<{
    [K in DATA.ValidKey]: (v: unknown) => boolean;
  }>(
    (acc, key) => {
      const v = DATA.RECORDS.mixed[key];
      acc[key] = typeof v === 'number' ? IS.num : IS.str;
      return acc;
    },
    {} as { [K in DATA.ValidKey]: (v: unknown) => boolean }
  )
} as const;

export const UTILS = {
  is: IS,
  mixedGuards: MIXED_GUARDS,
  getData: DATA.VALUES
} as const;

export interface GuardSuiteConfig<T> {
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
  customCases?: {
    cases: {
      itShould: string;
      /**
       * A function or array of functions that should return `false` if the test fails.
       */
      run: (() => boolean | void)[] | (() => boolean | void);
    }[];
    describe?: string;
  }[];
  error?: ErrorConstructor;
  invalidValues: unknown[];
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
  /**
   * Optional name for the guard suite if `is` function does not include `typeName` property
   * @default `is.name`
   */
  typeName?: string;
  validValues: unknown[];
}

export function runGuardSuite<T>({
  assert,
  invalidValues,
  validValues,
  is,
  error = TypeError,
  check,
  customCases,
  typeName = is.name
}: GuardSuiteConfig<T>) {
  describe(is.typeName ?? typeName, () => {
    const valid = ['Valid', validValues, true] as const;
    const invalid = ['Invalid', invalidValues, false] as const;
    describe.each([valid, invalid])('%s', (_, values, expected) => {
      it.each([values])('value: %s', (v) => {
        expect(is(v)).toBe(expected);
        expect(check(v)).toBe(expected);
        if (expected) EXPECT.notToThrow(() => assert(v));
        else EXPECT.toThrow(() => assert(v), error);
      });
    });
  });
  if (customCases) {
    for (const { cases, describe: dsc } of customCases) {
      for (const { itShould, run } of cases)
        if (dsc)
          describe(dsc, () => {
            it(itShould, () => EXPECT.every(run, (f) => f() !== false));
          });
        else it(itShould, () => EXPECT.every(run, (f) => f() !== false));
    }
  }
}
export function runGuardSuites(cfgs: GuardSuiteConfig<unknown>[]) {
  for (const cfg of cfgs) runGuardSuite(cfg);
}

export { DATA, EXPECT } from '../../helpers/index.js';
