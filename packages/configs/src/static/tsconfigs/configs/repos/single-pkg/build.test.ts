import { describe, expect, it } from 'vitest';

import { TsConfigs } from '../../../../../core/index.ts';
import { define } from './build.ts';

describe('single-pkg build.ts config module', () => {
  describe('define', () => {
    it('should create config with static fields when called with no arguments', () => {
      const config = define();

      expect(config).toMatchObject({
        ...TsConfigs.SinglePkg.Build.STATIC_FIELDS,
        compilerOptions: {
          ...TsConfigs.SinglePkg.Build.STATIC_COMPILER_OPTIONS,
          ...TsConfigs.SinglePkg.Build.DEFAULT_COMPILER_OPTIONS
        },
        include: TsConfigs.SinglePkg.Build.INCLUDE,
        exclude: TsConfigs.SinglePkg.Build.EXCLUDE
      });
    });

    it('should merge custom compilerOptions with static compiler options', () => {
      const config = define({
        compilerOptions: { declaration: true, sourceMap: true }
      });

      expect(config.compilerOptions).toEqual({
        declaration: true,
        sourceMap: true,
        ...TsConfigs.SinglePkg.Build.STATIC_COMPILER_OPTIONS,
        ...TsConfigs.SinglePkg.Build.DEFAULT_COMPILER_OPTIONS
      });
    });

    it('should override custom compilerOptions with static values', () => {
      const config = define({
        compilerOptions: {
          //@ts-expect-error testing invalid input
          outDir: './wrong',
          rootDir: './wrong',
          declaration: true
        }
      });

      expect(config.compilerOptions.outDir).toBe(
        TsConfigs.SinglePkg.Build.STATIC_COMPILER_OPTIONS.outDir
      );
      expect(config.compilerOptions.rootDir).toBe(
        TsConfigs.SinglePkg.Build.STATIC_COMPILER_OPTIONS.rootDir
      );
      expect(config.compilerOptions.declaration).toBe(true);
    });

    it('should prepend custom include patterns to static includes', () => {
      const customInclude = ['custom/**/*.ts'];
      const config = define({ include: customInclude });

      expect(config.include).toEqual([
        ...TsConfigs.SinglePkg.Build.INCLUDE,
        ...customInclude
      ]);
    });

    it('should prepend custom exclude patterns to static excludes', () => {
      const customExclude = ['temp/**'];
      const config = define({ exclude: customExclude });

      expect(config.exclude).toEqual([
        ...TsConfigs.SinglePkg.Build.EXCLUDE,
        ...customExclude
      ]);
    });

    it('should handle empty arrays', () => {
      const config = define({ include: [], exclude: [] });

      expect(config.include).toEqual(TsConfigs.SinglePkg.Build.INCLUDE);
      expect(config.exclude).toEqual(TsConfigs.SinglePkg.Build.EXCLUDE);
    });
  });
});
