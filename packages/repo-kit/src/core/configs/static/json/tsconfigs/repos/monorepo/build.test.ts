import { describe, expect, it } from 'vitest';

import { define, STATIC_FIELDS, DEFAULT_COMPILER_OPTIONS } from './build.ts';

describe('monorepo build.ts config module', () => {
  describe('define', () => {
    it('should create config with static fields when called with no arguments', () => {
      const config = define();

      expect(config).toMatchObject({ ...STATIC_FIELDS, references: [] });
    });

    it('should set custom references', () => {
      const customReferences = [
        { path: './packages/pkg1' },
        { path: './packages/pkg2' }
      ];

      const config = define({ references: customReferences });

      expect(config.references).toEqual(customReferences);
    });

    it('should preserve additional fields', () => {
      const config = define({
        references: [{ path: './packages/core' }],
        compilerOptions: { strict: true }
      } as any);

      expect(config.references).toEqual([{ path: './packages/core' }]);
      expect(config.compilerOptions).toEqual({
        strict: true,
        ...DEFAULT_COMPILER_OPTIONS
      });
    });

    it('should handle empty references array', () => {
      const config = define({ references: [] });

      expect(config.references).toEqual([]);
    });
  });
});
