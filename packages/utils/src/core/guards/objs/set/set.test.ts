import { runGuardSuites } from '@toolbox-ts/test-utils';
import { expect, expectTypeOf, it } from 'vitest';

import { assertIsSetOf, checkIsSetOf, isSetOf } from './set.ts';

const isStrOrNum = (v: unknown): v is number | string =>
  typeof v === 'number' || typeof v === 'string';
type SetOfStrOrNum = Set<number | string>;

runGuardSuites({
  is: (v) => isSetOf(v, isStrOrNum),
  assert: (v) => assertIsSetOf(v, isStrOrNum),
  check: (v) => checkIsSetOf(v, isStrOrNum),
  expectType: expectTypeOf(isSetOf<number | string>).guards.toEqualTypeOf<SetOfStrOrNum>(),
  assertType: expectTypeOf(assertIsSetOf<number | string>).asserts.toEqualTypeOf<SetOfStrOrNum>(),
  validValues: [new Set(), new Set([1, 2, 3]), new Set(['hello', 'world'])],
  invalidValues: [null, undefined, 42, 'string', [], {}, new Map(), new Date()]
});

it('assertIsSetOf throws when invalid entries are found', () => {
  expect(() => assertIsSetOf(new Set([{}, 1, 'a']), isStrOrNum)).toThrow();
});
it('isSetOf returns false for invalid sets', () => {
  expect(isSetOf(new Set([{}, 1, 'a']), isStrOrNum)).toBe(false);
});
