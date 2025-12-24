import { describe, expect, it } from 'vitest';

import notToUnresolvable from './not-to-unresolvable.js';

const { generate, META } = notToUnresolvable;

describe('notToUnresolvable', () => {
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

  it('should have correct rule configuration for unresolvable dependencies', () => {
    const rule = generate();

    expect(rule.comment).toBe(META.comment);
    expect(rule.from).toEqual({});
    expect(rule.to).toEqual({ couldNotResolve: true });
  });
});
