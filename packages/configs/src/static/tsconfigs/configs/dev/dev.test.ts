import { describe, expect, it } from 'vitest';

import { TsConfigs } from '../../../../core/index.ts';
import { define } from './dev.ts';

describe('dev.ts config module', () => {
  describe('define', () => {
    it('should create config with static fields when called with no arguments', () => {
      const config = define();

      expect(config).toMatchObject({
        ...TsConfigs.Dev.STATIC_FIELDS,
        compilerOptions: TsConfigs.Dev.STATIC_COMPILER_OPTIONS,
        exclude: TsConfigs.Dev.EXCLUDE,
        include: TsConfigs.Dev.INCLUDE
      });
    });

    it('should merge custom compilerOptions with static compiler options', () => {
      const customOptions = { strictNullChecks: true, esModuleInterop: true };

      const config = define({ compilerOptions: customOptions });

      expect(config.compilerOptions).toEqual({
        ...customOptions,
        ...TsConfigs.Dev.STATIC_COMPILER_OPTIONS
      });
    });

    it('should override custom compilerOptions with static values', () => {
      const config = define({
        compilerOptions: {
          //@ts-expect-error testing invalid input
          noEmit: false, // Should be overridden to true
          allowJs: false, // Should be overridden to true
          strictNullChecks: true
        }
      });

      expect(config.compilerOptions).toEqual({
        strictNullChecks: true,
        ...TsConfigs.Dev.STATIC_COMPILER_OPTIONS
      });
    });

    it('should append custom exclude patterns to static excludes', () => {
      const customExclude = ['custom-dir/**', 'temp/**'];

      const config = define({ exclude: customExclude });

      expect(config.exclude).toEqual([
        ...customExclude,
        ...TsConfigs.Dev.EXCLUDE
      ]);
    });

    it('should append custom include patterns to static includes', () => {
      const customInclude = ['custom-src/**', 'additional/**'];

      const config = define({ include: customInclude });

      expect(config.include).toEqual([
        ...customInclude,
        ...TsConfigs.Dev.INCLUDE
      ]);
    });

    it('should merge all custom fields with static fields', () => {
      const config = define({
        compilerOptions: { strict: true },
        exclude: ['custom-exclude/**'],
        include: ['custom-include/**'],
        typeAcquisition: { enable: true },
        watchOptions: { watchFile: 'usefsevents' }
      });

      expect(config).toMatchObject({
        ...TsConfigs.Dev.STATIC_FIELDS,
        typeAcquisition: { enable: true },
        watchOptions: { watchFile: 'usefsevents' },
        compilerOptions: {
          strict: true,
          ...TsConfigs.Dev.STATIC_COMPILER_OPTIONS
        },
        exclude: ['custom-exclude/**', ...TsConfigs.Dev.EXCLUDE],
        include: ['custom-include/**', ...TsConfigs.Dev.INCLUDE]
      });
    });

    it('should handle empty arrays for exclude and include', () => {
      const config = define({ exclude: [], include: [] });

      expect(config.exclude).toEqual(TsConfigs.Dev.EXCLUDE);
      expect(config.include).toEqual(TsConfigs.Dev.INCLUDE);
    });

    it('should preserve additional root-level fields', () => {
      const config = define({
        references: [{ path: '../other-project' }]
      } as any);

      expect(config.references).toEqual([{ path: '../other-project' }]);
    });
  });

  describe('integration', () => {
    it('should create, define, and format a complete config workflow', () => {
      const additionalInclude = ['extra/**'];
      const additionalExclude = ['logs/**'];
      const expectedInclude = [...additionalInclude, ...TsConfigs.Dev.INCLUDE];
      const config = define({
        compilerOptions: { declaration: true, sourceMap: true },
        exclude: additionalExclude,
        include: additionalInclude
      });

      expect(config.compilerOptions).toMatchObject({
        declaration: true,
        sourceMap: true,
        ...TsConfigs.Dev.STATIC_COMPILER_OPTIONS
      });
    });
  });
});
