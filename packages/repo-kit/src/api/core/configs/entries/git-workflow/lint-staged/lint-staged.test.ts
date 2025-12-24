import { describe, expect, it, vi } from 'vitest';

import { createMockPackageJsonOps } from '../../../../project/file-operations/scoped/package-json/package-json.mock.ts';
import { installDependency } from '../../../../project/index.ts';
import {
  type Config,
  getPackageJsonConfig,
  PKG_NAME,
  setup
} from './lint-staged.ts';

vi.mock('../../../project/index.js');

describe('lint-staged', () => {
  const mockedInstallDependency = vi.mocked(installDependency);
  const mockPkgOps = createMockPackageJsonOps();

  describe('getPackageJsonConfig', () => {
    it('should return default config with no options', () => {
      const config = getPackageJsonConfig({});

      expect(config).toEqual({
        '*.{ts,tsx,js,jsx,cjs,mjs}': [
          'pnpm eslint --fix',
          'pnpm prettier --write'
        ],
        '*.{json,md,yml,yaml}': ['pnpm prettier --write']
      });
    });

    it('should add additional source file extensions', () => {
      const config = getPackageJsonConfig({
        additionalSrcFileExts: ['vue', 'svelte']
      });

      expect(config).toEqual({
        '*.{ts,tsx,js,jsx,cjs,mjs,vue,svelte}': [
          'pnpm eslint --fix',
          'pnpm prettier --write'
        ],
        '*.{json,md,yml,yaml}': ['pnpm prettier --write']
      });
    });

    it('should add additional prettier-only file extensions', () => {
      const config = getPackageJsonConfig({
        additionalPrettierWriteOnlyFileExts: ['css', 'scss', 'html']
      });

      expect(config).toEqual({
        '*.{ts,tsx,js,jsx,cjs,mjs}': [
          'pnpm eslint --fix',
          'pnpm prettier --write'
        ],
        '*.{json,md,yml,yaml,css,scss,html}': ['pnpm prettier --write']
      });
    });

    it('should add other custom rules', () => {
      const config = getPackageJsonConfig({
        otherRules: {
          '*.{png,jpg,jpeg}': ['imagemin'],
          '*.sql': ['sql-formatter']
        }
      });

      expect(config).toEqual({
        '*.{ts,tsx,js,jsx,cjs,mjs}': [
          'pnpm eslint --fix',
          'pnpm prettier --write'
        ],
        '*.{json,md,yml,yaml}': ['pnpm prettier --write'],
        '*.{png,jpg,jpeg}': ['imagemin'],
        '*.sql': ['sql-formatter']
      });
    });

    it('should combine all config options', () => {
      const config = getPackageJsonConfig({
        additionalSrcFileExts: ['vue'],
        additionalPrettierWriteOnlyFileExts: ['css'],
        otherRules: { '*.test.ts': ['vitest run'] }
      });

      expect(config).toEqual({
        '*.{ts,tsx,js,jsx,cjs,mjs,vue}': [
          'pnpm eslint --fix',
          'pnpm prettier --write'
        ],
        '*.{json,md,yml,yaml,css}': ['pnpm prettier --write'],
        '*.test.ts': ['vitest run']
      });
    });

    it('should handle empty arrays for additional extensions', () => {
      const config = getPackageJsonConfig({
        additionalSrcFileExts: [],
        additionalPrettierWriteOnlyFileExts: []
      });

      expect(config).toEqual({
        '*.{ts,tsx,js,jsx,cjs,mjs}': [
          'pnpm eslint --fix',
          'pnpm prettier --write'
        ],
        '*.{json,md,yml,yaml}': ['pnpm prettier --write']
      });
    });
  });

  describe('setup', () => {
    it('should install lint-staged and set package.json config', async () => {
      await setup(mockPkgOps);

      expect(mockedInstallDependency).toHaveBeenCalledWith(PKG_NAME, {
        isDev: true
      });

      expect(mockPkgOps.set).toHaveBeenCalledWith([
        ['lint-staged', getPackageJsonConfig({})],
        ['scripts.lint-staged', 'lint-staged']
      ]);
    });

    it('should setup with custom config', async () => {
      const config: Config = {
        additionalSrcFileExts: ['vue'],
        additionalPrettierWriteOnlyFileExts: ['css'],
        otherRules: { '*.md': ['markdownlint'] }
      };

      await setup(mockPkgOps, config);

      expect(mockedInstallDependency).toHaveBeenCalledWith(PKG_NAME, {
        isDev: true
      });

      expect(mockPkgOps.set).toHaveBeenCalledWith([
        ['lint-staged', getPackageJsonConfig(config)],
        ['scripts.lint-staged', 'lint-staged']
      ]);
    });

    it('should setup with undefined config', async () => {
      await setup(mockPkgOps, undefined);

      expect(mockedInstallDependency).toHaveBeenCalledWith(PKG_NAME, {
        isDev: true
      });

      expect(mockPkgOps.set).toHaveBeenCalledWith([
        ['lint-staged', getPackageJsonConfig({})],
        ['scripts.lint-staged', 'lint-staged']
      ]);
    });

    it('should setup with empty config object', async () => {
      await setup(mockPkgOps, {});

      expect(mockPkgOps.set).toHaveBeenCalledWith([
        ['lint-staged', getPackageJsonConfig({})],
        ['scripts.lint-staged', 'lint-staged']
      ]);
    });

    it('should install as dev dependency', async () => {
      await setup(mockPkgOps);

      expect(mockedInstallDependency).toHaveBeenCalledWith(
        PKG_NAME,
        expect.objectContaining({ isDev: true })
      );
    });
  });
});
