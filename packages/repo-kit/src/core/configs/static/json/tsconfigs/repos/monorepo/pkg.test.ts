import { describe, expect, it } from 'vitest';

import {
  define,
  STATIC_FIELDS,
  EXCLUDE,
  INCLUDE,
  getStaticCompilerOptions
} from './pkg.ts';

describe('monorepo pkg.ts config module', () => {
  describe('define', () => {
    it('should create config with required name parameter', () => {
      const config = define({ name: 'my-package' });

      expect(config).toMatchObject({
        ...STATIC_FIELDS,
        name: 'my-package',
        description: '',
        compilerOptions: getStaticCompilerOptions('my-package'),
        include: INCLUDE,
        exclude: EXCLUDE
      });
    });

    it('should set custom description', () => {
      const config = define({
        name: 'my-package',
        description: 'Custom package description'
      });

      expect(config.description).toBe('Custom package description');
    });

    it('should generate package-specific compiler options', () => {
      const config = define({ name: 'core' });

      expect(config.compilerOptions.outDir).toContain('dist');
      expect(config.compilerOptions.tsBuildInfoFile).toContain('core');
    });

    it('should merge custom compilerOptions with static options', () => {
      const config = define({
        name: 'utils',
        compilerOptions: { declaration: true, sourceMap: true }
      });

      expect(config.compilerOptions).toEqual({
        declaration: true,
        sourceMap: true,
        ...getStaticCompilerOptions('utils')
      });
    });

    it('should override custom compilerOptions with static values', () => {
      const config = define({
        name: 'pkg',
        compilerOptions: {
          composite: false,
          outDir: './wrong',
          strict: true
        } as any
      });

      expect(config.compilerOptions.composite).toBe(true);
      expect(config.compilerOptions.outDir).toContain('dist');
      expect(config.compilerOptions.strict).toBe(true);
    });

    it('should prepend custom include patterns to static includes', () => {
      const customInclude = ['custom/**/*.ts'];
      const config = define({ name: 'pkg', include: customInclude });

      expect(config.include).toEqual([...INCLUDE, ...customInclude]);
    });

    it('should prepend custom exclude patterns to static excludes', () => {
      const customExclude = ['temp/**'];
      const config = define({ name: 'pkg', exclude: customExclude });

      expect(config.exclude).toEqual([...EXCLUDE, ...customExclude]);
    });

    it('should preserve additional fields', () => {
      const config = define({
        name: 'pkg',
        typeAcquisition: { enable: true }
      } as any);

      expect(config.typeAcquisition).toEqual({ enable: true });
    });
  });
});
