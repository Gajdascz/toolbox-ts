import { describe, expect, it } from 'vitest';

import notToSpec from './not-to-spec.js';

const { generate, META } = notToSpec;

describe('notToSpec', () => {
  it('should return a rule with default severity "error"', () => {
    const rule = generate();

    expect(rule.severity).toBe('error');
    expect(rule.name).toBe(META.name);
  });

  it('should return a rule with custom severity', () => {
    const rule = generate({ severity: 'warn' });

    expect(rule.severity).toBe('warn');
    expect(rule.name).toBe(META.name);
  });

  it('should have correct rule configuration for spec files', () => {
    const rule = generate();

    expect(rule.comment).toBe(META.comment);
    expect(rule.from).toEqual({});
    expect(rule.to).toMatchObject({
      path: expect.arrayContaining([expect.stringMatching(/spec|test|bench/)])
    });
  });

  it('should target spec, test, and bench files', () => {
    const rule = generate();

    const pathPattern = rule.to.path?.[0];
    expect(pathPattern).toMatch(/spec|test|bench/);
    expect(pathPattern).toMatch(/js|mjs|cjs|jsx|ts|mts|cts|tsx/);
  });
});
