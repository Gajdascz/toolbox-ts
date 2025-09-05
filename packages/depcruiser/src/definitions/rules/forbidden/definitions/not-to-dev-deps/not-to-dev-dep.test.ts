import { describe, expect, it } from 'vitest';

import notToDevDep from './not-to-dev-dep.ts';

const { generate, META } = notToDevDep;

describe('notToDevDep', () => {
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

  it('should have correct rule configuration for dev dependencies', () => {
    const rule = generate();

    expect(rule.comment).toBe(META.comment);
    expect(rule.from).toMatchObject({
      path: expect.arrayContaining(['^(src)']),
      pathNot: expect.arrayContaining([
        expect.stringMatching(/spec|test|bench/)
      ])
    });
    expect(rule.to).toMatchObject({
      dependencyTypes: ['npm-dev'],
      dependencyTypesNot: ['type-only'],
      pathNot: expect.arrayContaining(['node_modules/@types/'])
    });
  });

  it('should exclude test files from source path restriction', () => {
    const rule = generate();

    expect(rule.from.pathNot).toBeInstanceOf(Array);
  });

  it('should exclude type-only dependencies', () => {
    const rule = generate();

    expect(rule.to.dependencyTypesNot).toContain('type-only');
  });
});
