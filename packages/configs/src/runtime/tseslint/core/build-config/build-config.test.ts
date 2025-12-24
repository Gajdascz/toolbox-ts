import { describe, expect, it } from 'vitest';

import { buildConfig } from './build-config.js';

describe('buildConfig', () => {
  const mockBase = {
    name: 'test-config',
    tsconfigFilename: 'tsconfig.json',
    importResolverNodeExtensions: ['.js', '.ts'],
    files: ['src/**/*.ts'],
    ignores: ['dist/**'],
    rules: { 'no-console': 'warn' }
  } as const;

  it('should build config with base options only', () => {
    const result = buildConfig(mockBase);

    expect(result.name).toBe('test-config');
    expect(result.files).toContain('src/**/*.ts');
    expect(result.ignores).toContain('dist/**');
    expect(result.rules).toEqual({ 'no-console': 'warn' });
  });

  it('should use provided projectRootDir', () => {
    const result = buildConfig(mockBase, { projectRootDir: process.cwd() });

    expect(result.languageOptions?.parserOptions).toBeDefined();
  });

  it('should merge input files with base files', () => {
    const result = buildConfig(mockBase, { files: ['test/**/*.test.ts'] });

    expect(result.files).toContain('src/**/*.ts');
    expect(result.files).toContain('test/**/*.test.ts');
  });

  it('should merge input ignores with base ignores', () => {
    const result = buildConfig(mockBase, { ignores: ['coverage/**'] });

    expect(result.ignores).toContain('dist/**');
    expect(result.ignores).toContain('coverage/**');
  });

  it('should merge input rules with base rules', () => {
    const result = buildConfig(mockBase, { rules: { 'no-debugger': 'error' } });

    expect(result.rules).toEqual({
      'no-console': 'warn',
      'no-debugger': 'error'
    });
  });

  it('should merge import resolver extensions', () => {
    const result = buildConfig(mockBase, {
      importResolverNodeExtensions: ['.jsx', '.tsx']
    });

    expect(result.settings?.['import/resolver']?.node?.extensions).toContain(
      '.js'
    );
    expect(result.settings?.['import/resolver']?.node?.extensions).toContain(
      '.jsx'
    );
  });

  it('should set typescript resolver with tsconfig path', () => {
    const result = buildConfig(mockBase);

    expect(result.settings?.['import/resolver']?.typescript).toBeDefined();
  });

  it('should merge languageOptions', () => {
    const result = buildConfig(mockBase, {
      languageOptions: { ecmaVersion: 2022 }
    });

    expect(result.languageOptions?.ecmaVersion).toBe(2022);
    expect(result.languageOptions?.parser).toBeDefined();
    expect(result.languageOptions?.sourceType).toBe('module');
  });

  it('should merge settings', () => {
    const result = buildConfig(mockBase, {
      settings: {
        'custom-setting': 'value',
        'import/resolver': {
          unknown: { moduleDirectory: ['node_modules', 'custom_modules'] },
          typescript: { unknown: {} }
        }
      }
    });

    expect(result.settings?.['custom-setting']).toBe('value');
    expect(result.settings?.['import/resolver']?.unknown).toHaveProperty(
      'moduleDirectory'
    );
    expect(result.settings?.['import/resolver']?.typescript.unknown).toBeTypeOf(
      'object'
    );
  });

  it('should include extends when provided', () => {
    const result = buildConfig(mockBase, {
      extends: ['plugin:custom/recommended']
    });

    expect(result.extends).toContain('plugin:custom/recommended');
  });

  it('should include basePath when provided', () => {
    const result = buildConfig(mockBase, { basePath: '/custom/base' });

    expect(result.basePath).toBe('/custom/base');
  });

  it('should include language when provided', () => {
    const result = buildConfig(mockBase, { language: 'ts/typescript' });

    expect(result.language).toBe('ts/typescript');
  });

  it('should include linterOptions when provided', () => {
    const result = buildConfig(mockBase, {
      linterOptions: { reportUnusedDisableDirectives: 'error' }
    });

    expect(result.linterOptions?.reportUnusedDisableDirectives).toBe('error');
  });

  it('should include processor when provided', () => {
    const mockProcessor = { preprocess: () => [], postprocess: () => [] };
    const result = buildConfig(mockBase, { processor: mockProcessor });

    expect(result.processor).toBe(mockProcessor);
  });

  it('should throw error when tsconfig file not found', () => {
    const invalidBase = { ...mockBase, tsconfigFilename: 'nonexistent.json' };

    expect(() => buildConfig(invalidBase)).toThrow();
  });

  it('should deduplicate import resolver extensions', () => {
    const result = buildConfig(mockBase, {
      importResolverNodeExtensions: ['.js', '.ts', '.tsx']
    });

    const extensions =
      result.settings?.['import/resolver']?.node?.extensions || [];
    const uniqueExtensions = [...new Set(extensions)];

    expect(extensions.length).toBe(uniqueExtensions.length);
  });

  it('should use basePath in parserOptions when provided', () => {
    const result = buildConfig(mockBase, { basePath: '/custom/path' });

    expect(result.languageOptions?.parserOptions?.tsconfigRootDir).toBe(
      '/custom/path'
    );
  });

  it('should handle empty input object', () => {
    const result = buildConfig(mockBase, {});

    expect(result.name).toBe('test-config');
    expect(result.extends).toEqual([]);
  });
});
