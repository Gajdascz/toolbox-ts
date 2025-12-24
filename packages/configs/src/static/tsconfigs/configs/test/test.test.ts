import { describe, expect, it } from 'vitest';

import { TsConfigs } from '../../../../core/index.ts';
import { define } from './test.ts';

describe('test.ts config module', () => {
  describe('define', () => {
    it('should create config with static fields when called with no arguments', () => {
      const config = define();

      expect(config).toMatchObject({
        ...TsConfigs.Test.STATIC_FIELDS,
        include: TsConfigs.Test.INCLUDE,
        exclude: TsConfigs.Test.EXCLUDE
      });
    });

    it('should prepend custom include patterns to static includes', () => {
      const customInclude = ['custom/**/*.test.ts'];
      const config = define({ include: customInclude });

      expect(config.include).toEqual([
        ...TsConfigs.Test.INCLUDE,
        ...customInclude
      ]);
    });

    it('should prepend custom exclude patterns to static excludes', () => {
      const customExclude = ['temp/**'];
      const config = define({ exclude: customExclude });

      expect(config.exclude).toEqual([
        ...TsConfigs.Test.EXCLUDE,
        ...customExclude
      ]);
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
