import { describe, expect, it } from 'vitest';

import notToDeprecated from './not-to-deprecated.ts';

const { generate, META } = notToDeprecated;

describe('notToDeprecated', () => {
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

  it('should have correct rule configuration for deprecated dependencies', () => {
    const rule = generate();

    expect(rule.comment).toBe(META.comment);
    expect(rule.from).toEqual({});
    expect(rule.to).toEqual({ dependencyTypes: ['deprecated'] });
  });
});
