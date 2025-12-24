import { describe, expect, it } from 'vitest';

import { define, getTemplateString } from './commitlint.js';

describe('commitlint', () => {
  it('should return default config when called without arguments', () => {
    const result = define();

    expect(result.extends).toContain('@commitlint/config-conventional');
    expect(result.rules).toBeDefined();
    expect(result.defaultIgnores).toBe(true);
    expect(result.ignores).toEqual([]);
  });

  it('should merge custom extends as array', () => {
    const result = define({ extends: ['custom-config'] });

    expect(result.extends).toContain('@commitlint/config-conventional');
    expect(result.extends).toContain('custom-config');
  });

  it('should handle extends as string', () => {
    const result = define({ extends: 'single-config' as unknown as string[] });

    expect(result.extends).toContain('single-config');
  });

  it('should set scope-enum from scopes', () => {
    const result = define({ scopes: ['core', 'cli'] });

    expect(result.rules?.['scope-enum']).toEqual([
      2,
      'always',
      ['core', 'cli']
    ]);
  });

  it('should merge custom rules', () => {
    const result = define({
      rules: { 'subject-max-length': [1, 'always', 100] }
    });

    expect(result.rules?.['subject-max-length']).toEqual([1, 'always', 100]);
  });

  it('should add changeset ignore function when usingChangeset is true', () => {
    const result = define({ usingChangeset: true });

    expect(result.ignores).toHaveLength(1);
    expect(typeof result.ignores?.[0]).toBe('function');
  });
  it('should filter out changeset commits when usingChangeset is true', () => {
    const result = define({ usingChangeset: true });

    const ignoreFn = result.ignores?.[0];
    expect(ignoreFn).toBeDefined();
    expect(ignoreFn('Version Packages\n\nSome other info')).toBe(true);
    expect(ignoreFn('feat: add new feature')).toBe(false);
  });

  it('should pass through additional config properties', () => {
    const result = define({ helpUrl: 'https://example.com' });

    expect(result.helpUrl).toBe('https://example.com');
  });

  it('should merge custom ignores with changeset ignore', () => {
    const customIgnore = () => false;
    const result = define({ usingChangeset: true, ignores: [customIgnore] });

    expect(result.ignores).toHaveLength(2);
  });
});

describe('getTemplateString', () => {
  it('should generate valid template string', () => {
    const template = getTemplateString({});

    expect(template).toContain('import { commitlint }');
    expect(template).toContain('export default commitlint.define(');
  });
});
