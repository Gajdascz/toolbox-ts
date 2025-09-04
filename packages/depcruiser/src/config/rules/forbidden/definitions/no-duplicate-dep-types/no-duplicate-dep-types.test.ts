import { describe, expect, it } from 'vitest';

import noDuplicateDepTypes from './no-duplicate-dep-types.ts';

const { generate, META } = noDuplicateDepTypes;

describe('noDuplicateDepTypes', () => {
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

  it('should have correct rule configuration', () => {
    const rule = generate();

    expect(rule.comment).toBe(META.comment);
    expect(rule.from).toEqual({});
    expect(rule.to).toEqual({
      dependencyTypesNot: ['type-only'],
      moreThanOneDependencyType: true
    });
  });

  it('should exclude type-only dependencies', () => {
    const rule = generate();

    expect(rule.to.dependencyTypesNot).toContain('type-only');
  });

  it('should set moreThanOneDependencyType to true', () => {
    const rule = generate();

    expect(rule.to.moreThanOneDependencyType).toBe(true);
  });
});
