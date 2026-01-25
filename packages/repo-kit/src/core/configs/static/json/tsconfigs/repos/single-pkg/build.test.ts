import { describe, expect, it } from 'vitest';

import {
  define,
  STATIC_FIELDS,
  STATIC_COMPILER_OPTIONS,
  INCLUDE,
  EXCLUDE,
  DEFAULT_COMPILER_OPTIONS
} from './build.ts';

describe('single-pkg build.ts config module', () => {
  describe('define', () => {
    it('should create config with static fields when called with no arguments', () => {
      const config = define();

      expect(config).toMatchObject({
        ...STATIC_FIELDS,
        compilerOptions: {
          ...STATIC_COMPILER_OPTIONS,
          ...DEFAULT_COMPILER_OPTIONS
        },
        include: INCLUDE,
        exclude: EXCLUDE
      });
    });

    it('should merge custom compilerOptions with static compiler options', () => {
      const config = define({
        compilerOptions: { declaration: true, sourceMap: true }
      });

      expect(config.compilerOptions).toEqual({
        declaration: true,
        sourceMap: true,
        ...STATIC_COMPILER_OPTIONS,
        ...DEFAULT_COMPILER_OPTIONS
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
        STATIC_COMPILER_OPTIONS.outDir
      );
      expect(config.compilerOptions.rootDir).toBe(
        STATIC_COMPILER_OPTIONS.rootDir
      );
      expect(config.compilerOptions.declaration).toBe(true);
    });

    it('should prepend custom include patterns to static includes', () => {
      const customInclude = ['custom/**/*.ts'];
      const config = define({ include: customInclude });

      expect(config.include).toEqual([...INCLUDE, ...customInclude]);
    });

    it('should prepend custom exclude patterns to static excludes', () => {
      const customExclude = ['temp/**'];
      const config = define({ exclude: customExclude });

      expect(config.exclude).toEqual([...EXCLUDE, ...customExclude]);
    });

    it('should handle empty arrays', () => {
      const config = define({ include: [], exclude: [] });

      expect(config.include).toEqual(INCLUDE);
      expect(config.exclude).toEqual(EXCLUDE);
    });
  });
});
