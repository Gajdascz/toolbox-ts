import { describe, expect, it } from 'vitest';
import * as commitlint from './module.ts';
import type { InputConfig } from './types.ts';

describe('configs/runtime/commitlint', () => {
  describe('define', () => {
    it('should return default config with no parameters', () => {
      const result = commitlint.define();

      expect(result).toMatchObject({
        extends: ['@commitlint/config-conventional'],
        rules: { 'scope-enum': [2, 'always', []] }
      });
    });

    it('should include scopes in scope-enum rule', () => {
      const scopes = ['feat', 'fix', 'docs'];
      const result = commitlint.define({ scopes });

      expect(result.rules?.['scope-enum']).toEqual([2, 'always', scopes]);
    });

    it('should merge extends array', () => {
      const config = { extends: ['custom-config'] };
      const result = commitlint.define(config);

      expect(result.extends).toEqual(['@commitlint/config-conventional', 'custom-config']);
    });

    it('should handle single extends string', () => {
      const config = { extends: 'single-config' };
      const result = commitlint.define(config);

      expect(result.extends).toMatchObject(['@commitlint/config-conventional', 'single-config']);
    });

    it('should merge custom rules', () => {
      const result = commitlint.define({
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
      const result = commitlint.define(config);

      expect(result.helpUrl).toBe('https://example.com');
      expect(result.formatter).toBe('json');
    });
  });
  it('toFileEntry should produce correct file entry', () => {
    const config: InputConfig = { rules: { 'type-enum': [2, 'always', ['feat']] } };
    const content = commitlint.toFileEntry(config);
    expect(content).toMatchSnapshot();
  });
});
