import { describe, expect, it } from 'vitest';

import noOrphans from './no-orphans.ts';

const { generate, META } = noOrphans;

describe('noOrphans', () => {
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

  it('should have correct rule configuration for orphan modules', () => {
    const rule = generate();

    expect(rule.comment).toBe(META.comment);
    expect(rule.from).toMatchObject({
      orphan: true,
      pathNot: expect.any(Array)
    });
    expect(rule.to).toEqual({});
  });

  it('should exclude dot files, TypeScript declarations, and config files', () => {
    const rule = generate();

    expect(rule.from.pathNot).toEqual(
      expect.arrayContaining([expect.any(String)])
    );
  });
});
