import { describe, expect, it } from 'vitest';

import { define, STATIC_FIELDS, INCLUDE, EXCLUDE } from './test.ts';

describe('test.ts config module', () => {
  describe('define', () => {
    it('should create config with static fields when called with no arguments', () => {
      const config = define();

      expect(config).toMatchObject({
        ...STATIC_FIELDS,
        include: INCLUDE,
        exclude: EXCLUDE
      });
    });

    it('should prepend custom include patterns to static includes', () => {
      const customInclude = ['custom/**/*.test.ts'];
      const config = define({ include: customInclude });

      expect(config.include).toEqual([...INCLUDE, ...customInclude]);
    });

    it('should prepend custom exclude patterns to static excludes', () => {
      const customExclude = ['temp/**'];
      const config = define({ exclude: customExclude });

      expect(config.exclude).toEqual([...EXCLUDE, ...customExclude]);
    });

    it('should merge all custom fields', () => {
      const config = define({
        include: ['custom/**'],
        exclude: ['temp/**'],
        references: [{ path: './other' }]
      } as any);

      expect(config.references).toEqual([{ path: './other' }]);
    });
  });
});
