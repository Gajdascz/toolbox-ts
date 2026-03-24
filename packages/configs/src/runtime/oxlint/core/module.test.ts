import { describe, it, expect } from 'vitest';
import { define, DEFAULTS, toFileEntry } from './module.ts';

const minimal = (): Parameters<typeof define>[0] => ({});

describe('configs/runtime/oxlint', () => {
  describe('define', () => {
    describe('plugins', () => {
      it('uses default plugins when not provided', () => {
        const result = define(minimal());
        expect(Array.isArray(result.plugins)).toBe(true);
        expect((result.plugins as string[]).length).toBeGreaterThan(0);
      });
      it('uses default plugins when set to "default"', () => {
        const defaultResult = define({ plugins: 'default' });
        const omittedResult = define(minimal());
        expect(defaultResult.plugins).toEqual(omittedResult.plugins);
      });
      it('includes eslint in default resolved plugins', () => {
        const result = define(minimal());
        expect(result.plugins).toContain('eslint');
      });
      it('includes typescript in default resolved plugins', () => {
        const result = define(minimal());
        expect(result.plugins).toContain('typescript');
      });
      it('merges rules from all active plugins', () => {
        const result = define(minimal());
        expect(Object.keys(result.rules ?? []).length).toBeGreaterThan(0);
      });
      it('does not include disabled plugins (false) in resolved list', () => {
        const result = define(minimal());
        expect(result.plugins).not.toContain('react');
        expect(result.plugins).not.toContain('react-perf');
        expect(result.plugins).not.toContain('nextjs');
      });
      it('respects custom plugin config', () => {
        const result = define({
          plugins: {
            eslint: true,
            jsdoc: false,
            unicorn: false,
            typescript: false,
            oxc: false,
            'react-perf': false,
            'jsx-a11y': false,
            nextjs: false,
            import: false,
            jest: false,
            node: false,
            promise: false,
            react: false,
            vitest: false,
            vue: false
          }
        });
        expect(result.plugins).toContain('eslint');
        expect(result.plugins).not.toContain('typescript');
      });
      it('does not mutate DEFAULTS.plugins', () => {
        const before = JSON.stringify(DEFAULTS.plugins);
        define({ plugins: 'default' });
        expect(JSON.stringify(DEFAULTS.plugins)).toBe(before);
      });
      it('skips plugins not found in defaults (defaults is a complete collection)', () => {
        const result = define({
          plugins: { eslint: true, customPlugin: { rules: { 'custom/rule': 'error' } } } as any
        });
        expect(result.plugins).toContain('eslint');
        expect(result.plugins).not.toContain('customPlugin');
        expect(result.rules).not.toHaveProperty('custom/rule');
      });
    });
    describe('globals', () => {
      it('defaults to empty globals', () => {
        const result = define(minimal());
        expect(result.globals).toEqual({});
      });
      it('merges input globals over defaults', () => {
        const result = define({ globals: { MY_GLOBAL: 'readonly' } as any });
        expect((result.globals as any).MY_GLOBAL).toBe('readonly');
      });
      it('does not mutate DEFAULTS.globals', () => {
        const before = { ...DEFAULTS.globals };
        define({ globals: { X: 'readonly' } as any });
        expect(DEFAULTS.globals).toEqual(before);
      });
    });
    describe('env', () => {
      it('includes builtin env by default', () => {
        const result = define(minimal());
        expect(result.env?.builtin).toBe(true);
      });
      it('merges input env with defaults', () => {
        const result = define({ env: { browser: true } as any });
        expect((result.env as any).browser).toBe(true);
        expect(result.env?.builtin).toBe(true);
      });
    });
    describe('categories', () => {
      it('defaults to empty categories', () => {
        const result = define(minimal());
        expect(result.categories).toEqual({});
      });
      it('merges input categories over defaults', () => {
        const result = define({ categories: { correctness: 'warn' } as any });
        expect((result.categories as any).correctness).toBe('warn');
      });
    });
    describe('ignorePatterns', () => {
      it('defaults to empty array', () => {
        const result = define(minimal());
        expect(result.ignorePatterns).toEqual([]);
      });

      it('includes input ignorePatterns', () => {
        const result = define({ ignorePatterns: ['**/generated/**'] });
        expect(result.ignorePatterns).toContain('**/generated/**');
      });

      it('deduplicates ignorePatterns', () => {
        const result = define({ ignorePatterns: ['**/generated/**', '**/generated/**'] });
        const count = result.ignorePatterns?.filter((p) => p === '**/generated/**').length;
        expect(count).toBe(1);
      });
    });
    describe('overrides', () => {
      it('includes default overrides', () => {
        const result = define(minimal());
        expect(result.overrides?.length).toBeGreaterThanOrEqual(DEFAULTS.overrides.length);
      });

      it('merges input overrides with defaults', () => {
        const customOverride = { files: ['**/*.js'], rules: { 'eslint/no-eval': 'error' } } as any;
        const result = define({ overrides: [customOverride] });
        expect(result.overrides?.length).toBeGreaterThan(DEFAULTS.overrides.length);
      });

      it('each override has a plugins array', () => {
        const result = define(minimal());
        for (const override of result.overrides ?? []) {
          expect(Array.isArray(override.plugins)).toBe(true);
        }
      });

      it('does not mutate DEFAULTS.overrides', () => {
        const before = JSON.stringify(DEFAULTS.overrides);
        define({ overrides: [{ files: ['*.js'], rules: {} } as any] });
        expect(JSON.stringify(DEFAULTS.overrides)).toBe(before);
      });
    });
    describe('extends', () => {
      it('omits extends key when not provided', () => {
        const result = define(minimal());
        expect('extends' in result).toBe(false);
      });
      it('includes extends when provided', () => {
        const result = define({ extends: ['some/config'] } as any);
        expect((result as any).extends).toEqual(['some/config']);
      });
    });
    describe('jsPlugins', () => {
      it('omits jsPlugins key when not provided', () => {
        const result = define(minimal());
        expect('jsPlugins' in result).toBe(false);
      });

      it('includes jsPlugins when provided', () => {
        const result = define({ jsPlugins: ['some-plugin'] } as any);
        expect((result as any).jsPlugins).toEqual(['some-plugin']);
      });
    });
    describe('rules', () => {
      it('includes eslint rules in default output', () => {
        const result = define(minimal());
        const hasEslintRule = Object.keys(result.rules ?? {}).some((k) => k.startsWith('eslint/'));
        expect(hasEslintRule).toBe(true);
      });

      it('includes typescript rules in default output', () => {
        const result = define(minimal());
        const hasTsRule = Object.keys(result.rules ?? {}).some((k) => k.startsWith('typescript/'));
        expect(hasTsRule).toBe(true);
      });

      it('no react rules when react plugin is false', () => {
        const result = define(minimal());
        const hasReactRule = Object.keys(result.rules ?? {}).some((k) => k.startsWith('react/'));
        expect(hasReactRule).toBe(false);
      });
    });
  });
  it('toFileEntry should produce correct file entry', () => {
    const content = toFileEntry({
      categories: { correctness: 'warn' },
      globals: { MY_GLOBAL: 'readonly' },
      env: {},
      extends: ['some/config'],
      jsPlugins: [
        {
          name: 'custom-js-plugin',
          specifier: 'custom-js-plugin',
          rules: { 'custom-js-plugin/rule': 'error' }
        }
      ],
      plugins: {
        eslint: { rules: { 'eslint/no-eval': 'error', 'eslint/no-implied-eval': 'error' } },
        typescript: true,
        react: false
      },
      ignorePatterns: ['**/generated/**'],
      options: { denyWarnings: true, maxWarnings: 100, typeAware: true, typeCheck: true }
    });
    expect(content).toMatchSnapshot();
  });
});
