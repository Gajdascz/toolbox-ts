import { describe, expect, it } from 'vitest';

import { TsConfigs } from '../../../../core/index.js';
import { define } from './base.js';

describe('base.ts config module', () => {
  describe('define', () => {
    it('should create config with static fields when called with no arguments', () => {
      const config = define();

      expect(config).toMatchObject(TsConfigs.Base.STATIC_FIELDS);
    });

    it('should merge custom compilerOptions', () => {
      const config = define({
        compilerOptions: { strict: true, target: 'ES2022' }
      });

      expect(config.compilerOptions).toMatchObject({
        strict: true,
        target: 'ES2022'
      });
    });

    it('should preserve additional fields', () => {
      const config = define({
        compilerOptions: { declaration: true },
        include: ['src/**'],
        exclude: ['node_modules']
      } as any);

      expect(config.include).toEqual(['src/**']);
      expect(config.exclude).toEqual(['node_modules']);
    });
  });
});
