import path from 'node:path';
import { parser } from 'typescript-eslint';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { BaseCfg, CfgInput } from '../../types.js';

import { getTsconfigPath } from '../get-tsconfig-path/index.js';
import { create, type CreateInput } from './create.js';

vi.mock('../get-tsconfig-path/index.js');

describe('create', () => {
  const mockGetTsconfigPath = vi.mocked(getTsconfigPath);

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTsconfigPath.mockReturnValue('/mock/path/tsconfig.test.json');
  });

  const mockBaseCfg: BaseCfg<'test'> = {
    files: ['src/**/*.ts'],
    ignores: ['node_modules/**'],
    importResolverNodeExtensions: ['.ts', '.js'],
    name: 'test',
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      'no-console': 'warn'
    }
  };

  it('should create config with only base configuration', () => {
    const input: CreateInput<'test'> = { base: mockBaseCfg };

    const result = create(input);

    expect(mockGetTsconfigPath).toHaveBeenCalledWith('tsconfig.test.json');
    expect(result).toEqual({
      extends: [],
      files: ['src/**/*.ts'],
      ignores: ['node_modules/**'],
      languageOptions: {
        parser,
        parserOptions: { projectService: true, tsconfigRootDir: '/mock/path' },
        sourceType: 'module'
      },
      name: 'test',
      rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        'no-console': 'warn'
      },
      settings: {
        'import/resolver': {
          node: { extensions: ['.ts', '.js'] },
          typescript: { project: '/mock/path/tsconfig.test.json' }
        }
      }
    });
  });

  it('should merge base and cfg configurations', () => {
    const cfg: CfgInput<'test'> = {
      extends: [{ name: '@eslint/js/recommended' }],
      files: ['additional/**/*.ts'],
      ignores: ['test/**/*.spec.ts'],
      rules: {
        'no-console': 'error', // Override base rule
        'prefer-const': 'warn' // Add new rule
      }
    };

    const input: CreateInput<'test'> = { base: mockBaseCfg, cfg };

    const result = create(input);

    expect(result.extends).toEqual([{ name: '@eslint/js/recommended' }]);
    expect(result.files).toEqual(['src/**/*.ts', 'additional/**/*.ts']);
    expect(result.ignores).toEqual(['node_modules/**', 'test/**/*.spec.ts']);
    expect(result.rules).toEqual({
      '@typescript-eslint/no-unused-vars': 'error', // From base
      'no-console': 'error', // Overridden
      'prefer-const': 'warn' // Added
    });
  });

  it('should use custom tsconfig filename when provided', () => {
    const cfg: CfgInput<'test'> = {
      tsconfigFilenameOverride: 'tsconfig.custom.json'
    };

    const input: CreateInput<'test'> = { base: mockBaseCfg, cfg };

    create(input);

    expect(mockGetTsconfigPath).toHaveBeenCalledWith('tsconfig.custom.json');
  });

  it('should use custom basePath when provided', () => {
    const customBasePath = '/custom/base/path';
    const cfg: CfgInput<'test'> = { basePath: customBasePath };

    const input: CreateInput<'test'> = { base: mockBaseCfg, cfg };

    const result = create(input);

    expect(result.basePath).toBe(customBasePath);
    expect(result.languageOptions.parserOptions.tsconfigRootDir).toBe(
      customBasePath
    );
  });

  it('should use dirname of tsconfig when basePath is not provided', () => {
    const tsconfigPath = '/project/config/tsconfig.build.json';
    mockGetTsconfigPath.mockReturnValue(tsconfigPath);

    const input: CreateInput<'test'> = { base: mockBaseCfg };

    const result = create(input);

    expect(result.languageOptions.parserOptions.tsconfigRootDir).toBe(
      path.dirname(tsconfigPath)
    );
    expect(result).not.toHaveProperty('basePath');
  });

  it('should override import resolver node extensions when provided in cfg', () => {
    const cfg: CfgInput<'test'> = {
      importResolverNodeExtensions: ['.tsx', '.jsx']
    };

    const input: CreateInput<'test'> = { base: mockBaseCfg, cfg };

    const result = create(input);

    expect(result.settings['import/resolver'].node.extensions).toEqual([
      '.tsx',
      '.jsx'
    ]);
  });

  it('should use base import resolver extensions when not overridden', () => {
    const input: CreateInput<'test'> = { base: mockBaseCfg, cfg: {} };

    const result = create(input);

    expect(result.settings['import/resolver'].node.extensions).toEqual([
      '.ts',
      '.js'
    ]);
  });

  it('should include optional properties when provided', () => {
    const cfg: CfgInput<'test'> = {
      language: 'typescript',
      languageOptions: { ecmaVersion: 2022, globals: { window: 'readonly' } },
      linterOptions: {
        noInlineConfig: true,
        reportUnusedDisableDirectives: true
      },
      processor: 'custom-processor',
      settings: { customSetting: 'value' }
    };

    const input: CreateInput<'test'> = { base: mockBaseCfg, cfg };

    const result = create(input);

    expect(result.language).toBe('typescript');
    expect(result.languageOptions).toEqual({
      ecmaVersion: 2022,
      globals: { window: 'readonly' },
      parser,
      parserOptions: { projectService: true, tsconfigRootDir: '/mock/path' },
      sourceType: 'module'
    });
    expect(result.linterOptions).toEqual({
      noInlineConfig: true,
      reportUnusedDisableDirectives: true
    });
    expect(result.processor).toBe('custom-processor');
    expect(result.settings).toEqual({
      customSetting: 'value',
      'import/resolver': {
        node: { extensions: ['.ts', '.js'] },
        typescript: { project: '/mock/path/tsconfig.test.json' }
      }
    });
  });

  it('should not include optional properties when not provided', () => {
    const input: CreateInput<'test'> = { base: mockBaseCfg };

    const result = create(input);

    expect(result).not.toHaveProperty('basePath');
    expect(result).not.toHaveProperty('language');
    expect(result).not.toHaveProperty('linterOptions');
    expect(result).not.toHaveProperty('processor');
  });

  it('should handle empty extends array', () => {
    const cfg: CfgInput<'test'> = { extends: [] };

    const input: CreateInput<'test'> = { base: mockBaseCfg, cfg };

    const result = create(input);

    expect(result.extends).toEqual([]);
  });

  it('should handle undefined extends', () => {
    const cfg: CfgInput<'test'> = { extends: undefined };

    const input: CreateInput<'test'> = { base: mockBaseCfg, cfg };

    const result = create(input);

    expect(result.extends).toEqual([]);
  });

  it('should handle empty arrays in cfg', () => {
    const cfg: CfgInput<'test'> = { files: [], ignores: [], rules: {} };

    const input: CreateInput<'test'> = { base: mockBaseCfg, cfg };

    const result = create(input);

    expect(result.files).toEqual(['src/**/*.ts']);
    expect(result.ignores).toEqual(['node_modules/**']);
    expect(result.rules).toEqual({
      '@typescript-eslint/no-unused-vars': 'error',
      'no-console': 'warn'
    });
  });

  it('should handle base config with different name', () => {
    const buildBaseCfg: BaseCfg<'build'> = {
      files: ['src/**/*.ts'],
      ignores: [],
      importResolverNodeExtensions: ['.ts'],
      name: 'build',
      rules: {}
    };

    const input: CreateInput<'build'> = { base: buildBaseCfg };

    const result = create(input);

    expect(mockGetTsconfigPath).toHaveBeenCalledWith('tsconfig.build.json');
    expect(result.name).toBe('build');
  });
});
