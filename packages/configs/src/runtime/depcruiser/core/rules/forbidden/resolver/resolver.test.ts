import { expect, it } from 'vitest';

import { resolve } from './resolver.js';

const NAMES = new Set([
  'no-circular',
  'no-deprecated-core',
  'no-duplicate-dep-types',
  'no-non-package-json',
  'no-orphans',
  'not-to-deprecated',
  'not-to-dev-dep',
  'not-to-spec',
  'not-to-unresolvable',
  'optional-deps-used',
  'peer-deps-used'
]);

it('should return an array of rules with default configs', () => {
  const result = resolve({});
  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBe(11);
  expect(result.every((r) => NAMES.has(r.name))).toBe(true);
});
it('should return an array of rules with custom configs', () => {
  const result = resolve({
    noCircular: { severity: 'info' },
    noOrphans: { severity: 'info' },
    notToSpec: { severity: 'info' }
  });
  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBe(11);
  expect(result.find((r) => r.name === 'no-circular')?.severity).toBe('info');
  expect(result.find((r) => r.name === 'no-orphans')?.severity).toBe('info');
  expect(result.find((r) => r.name === 'not-to-spec')?.severity).toBe('info');
});
it('should return an array of rules with some omitted', () => {
  const setToFalse = { noCircular: false, noOrphans: false, notToSpec: false };
  const result = resolve(setToFalse);
  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBe(8);
  expect(result.every((r) => !(r.name in setToFalse))).toEqual(true);
});
it('should return an array of rules with some extended', () => {
  const mockExtendedRules = [
    {
      name: 'mock-rule-1',
      severity: 'error' as const,
      comment: 'this is a mock rule',
      from: {},
      to: {}
    },
    {
      name: 'mock-rule-2',
      severity: 'warn' as const,
      comment: 'this is another mock rule',
      from: {},
      to: {}
    }
  ];
  const result = resolve({}, mockExtendedRules);
  const withExtended = new Set(['mock-rule-1', 'mock-rule-2', ...NAMES]);
  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBe(13);
  expect(result.every((r) => withExtended.has(r.name))).toEqual(true);
  expect(result.find((r) => r.name === 'mock-rule-1')).toEqual(
    mockExtendedRules[0]
  );
  expect(result.find((r) => r.name === 'mock-rule-2')).toEqual(
    mockExtendedRules[1]
  );
});
it('should use default config when set to true', () => {
  const result = resolve({ noCircular: true });
  expect(result.find((r) => r.name === 'no-circular')).toMatchObject({
    name: 'no-circular',
    severity: 'error',
    from: {},
    to: { circular: true }
  });
});
