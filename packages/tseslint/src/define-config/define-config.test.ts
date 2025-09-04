import { defineConfig as defCfg } from 'eslint/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { create } from '../base/index.js';
import { defineConfig, type DefineConfigInput } from './define-config.js';
vi.mock('eslint/config', () => ({
  defineConfig: vi.fn((configs: any[]) => configs)
}));

vi.mock('../base/index.js', () => ({
  configs: {
    __root: { name: '__root' },
    build: {
      'build-rule': 'error',
      files: ['src/**/*.{ts,tsx}'],
      name: 'build'
    },
    dev: { 'dev-rule': 'warn', files: ['dev/**/*.{ts,tsx}'], name: 'dev' },
    test: {
      files: ['**/*.{test,spec}.{ts,tsx}'],
      name: 'test',
      'test-rule': 'off'
    }
  },
  create: vi.fn(),
  DEFAULT_CONFIG_ORDER: ['build', 'dev', 'test'] as const
}));

describe('defineConfig', () => {
  const mockCreate = vi.mocked(create);
  const mockConfig = vi.mocked(defCfg);

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockImplementation(
      ({ base, cfg }) => ({ ...base, ...(cfg && { cfg }) }) as any
    );
  });

  it('should create config with all default rule sets when no input provided', () => {
    defineConfig();

    expect(mockCreate).toHaveBeenCalledTimes(3);
    expect(mockConfig).toHaveBeenCalledWith([
      expect.objectContaining({ name: '__root' }),
      expect.objectContaining({ name: 'build' }),
      expect.objectContaining({ name: 'dev' }),
      expect.objectContaining({ name: 'test' })
    ]);
  });

  it('should apply default overrides when provided', () => {
    const defaults: DefineConfigInput = {
      defaults: {
        build: {
          files: ['custom/build/**/*.ts'],
          ignores: ['custom/ignore/**/*']
        },
        dev: { files: ['custom/dev/**/*.ts'] }
      }
    };

    defineConfig({ ...defaults });

    expect(mockCreate).toHaveBeenCalledWith({
      base: expect.objectContaining({ 'build-rule': 'error', name: 'build' }),
      cfg: { files: ['custom/build/**/*.ts'], ignores: ['custom/ignore/**/*'] }
    });

    expect(mockCreate).toHaveBeenCalledWith({
      base: expect.objectContaining({ 'dev-rule': 'warn', name: 'dev' }),
      cfg: { files: ['custom/dev/**/*.ts'] }
    });

    expect(mockCreate).toHaveBeenCalledWith({
      base: expect.objectContaining({ name: 'test', 'test-rule': 'off' })
    });
  });

  it('should exclude disabled rule sets when set to false', () => {
    const defaults = {
      build: false as const,
      dev: { files: ['custom/dev/**/*.ts'] }
    };

    defineConfig({ defaults });

    expect(mockCreate).toHaveBeenCalledTimes(2); // dev + test only

    // Verify build config is NOT called
    expect(mockCreate).not.toHaveBeenCalledWith(
      expect.objectContaining({
        base: expect.objectContaining({ name: 'build' })
      })
    );

    // Verify dev config IS called with overrides
    expect(mockCreate).toHaveBeenCalledWith({
      base: expect.objectContaining({ name: 'dev' }),
      cfg: { files: ['custom/dev/**/*.ts'] }
    });

    // Verify test config IS called without overrides
    expect(mockCreate).toHaveBeenCalledWith({
      base: expect.objectContaining({ name: 'test' })
    });
  });

  it('should add custom configurations', () => {
    const custom: DefineConfigInput['custom'] = {
      custom1: {
        base: {
          files: ['custom1/**/*.ts'],
          ignores: [],
          importResolverNodeExtensions: ['ts'],
          name: 'custom1',
          rules: { 'custom-rule': 'error' }
        },
        cfg: { files: ['overridden/**/*.ts'] }
      },
      custom2: {
        base: {
          files: ['custom2/**/*.ts'],
          ignores: [],
          importResolverNodeExtensions: ['ts'],
          name: 'custom2',
          rules: { 'another-rule': 'warn' }
        }
      }
    };

    defineConfig({ custom });

    expect(mockCreate).toHaveBeenCalledTimes(5); // 3 defaults + 2 custom

    expect(mockCreate).toHaveBeenCalledWith({
      base: custom.custom1.base,
      cfg: { files: ['overridden/**/*.ts'] }
    });

    expect(mockCreate).toHaveBeenCalledWith({
      base: custom.custom2.base,
      cfg: {}
    });
  });

  it('should handle both defaults and custom configurations', () => {
    const defaults = { build: false, test: { files: ['custom-test/**/*.ts'] } };

    const custom: DefineConfigInput['custom'] = {
      integration: {
        base: {
          files: ['integration/**/*.ts'],
          ignores: [],
          importResolverNodeExtensions: ['ts'],
          name: 'integration',
          rules: { 'integration-rule': 'error' }
        }
      }
    };

    defineConfig({ custom, defaults });

    expect(mockCreate).toHaveBeenCalledTimes(3); // dev, test (modified), integration
  });

  it('should work with empty custom', () => {
    defineConfig({ custom: {} });

    expect(mockCreate).toHaveBeenCalledTimes(3);
  });

  it('should preserve rule sets and node extensions from defaults', () => {
    defineConfig({});

    expect(mockCreate).toHaveBeenCalledWith({
      base: expect.objectContaining({ 'build-rule': 'error', name: 'build' })
    });

    expect(mockCreate).toHaveBeenCalledWith({
      base: expect.objectContaining({ 'dev-rule': 'warn', name: 'dev' })
    });

    expect(mockCreate).toHaveBeenCalledWith({
      base: expect.objectContaining({ name: 'test', 'test-rule': 'off' })
    });
  });

  it('should pass cfg when defaults[key] is an object', () => {
    const defaults = {
      build: { files: ['custom/build/**/*.ts'], ignores: ['ignore'] },
      dev: true,
      test: true
    };

    defineConfig({ defaults });

    expect(create).toHaveBeenCalledWith({
      base: expect.objectContaining({ name: 'build' }),
      cfg: { files: ['custom/build/**/*.ts'], ignores: ['ignore'] }
    });
    expect(create).toHaveBeenCalledWith({
      base: expect.objectContaining({ name: 'dev' })
    });
    expect(create).toHaveBeenCalledWith({
      base: expect.objectContaining({ name: 'test' })
    });
  });
});
