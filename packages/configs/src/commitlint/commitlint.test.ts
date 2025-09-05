import { describe, expect, it } from 'vitest';

import { define as commitlintConfig } from './commitlint.js';

describe('commitlint config', () => {
  it('should return default config with no parameters', () => {
    const result = commitlintConfig();

    expect(result).toMatchObject({
      extends: ['@commitlint/config-conventional'],
      rules: { 'scope-enum': [2, 'always', []] }
    });
  });

  it('should include scopes in scope-enum rule', () => {
    const scopes = ['feat', 'fix', 'docs'];
    const result = commitlintConfig({ scopes });

    expect(result.rules['scope-enum']).toEqual([2, 'always', scopes]);
  });

  it('should merge extends array', () => {
    const config = { extends: ['custom-config'] };
    const result = commitlintConfig(config);

    expect(result.extends).toEqual([
      '@commitlint/config-conventional',
      'custom-config'
    ]);
  });

  it('should handle single extends string', () => {
    const config = { extends: 'single-config' };
    const result = commitlintConfig(config);

    expect(result.extends).toMatchObject([
      '@commitlint/config-conventional',
      'single-config'
    ]);
  });

  it('should merge custom rules', () => {
    const result = commitlintConfig({
      rules: { 'type-enum': [2, 'always', ['feat']] },
      scopes: ['scope']
    });

    expect(result.rules).toMatchObject({
      'scope-enum': [2, 'always', ['scope']],
      'type-enum': [2, 'always', ['feat']]
    });
  });

  it('should spread additional config properties', () => {
    const config = { formatter: 'json', helpUrl: 'https://example.com' };
    const result = commitlintConfig(config);

    expect(result.helpUrl).toBe('https://example.com');
    expect(result.formatter).toBe('json');
  });
  it('respects usingChangeset flag', () => {
    const result = commitlintConfig({ usingChangeset: true });
    expect(result.ignores[0]?.('Version Packages')).toBe(true);
    const result2 = commitlintConfig({ usingChangeset: false });
    expect(result2.ignores[0]).toBeUndefined();
  });
});
