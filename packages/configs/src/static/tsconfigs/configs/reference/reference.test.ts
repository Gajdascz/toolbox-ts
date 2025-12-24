import { describe, expect, it } from 'vitest';

import { TsConfigs } from '../../../../core/index.ts';
import { define } from './reference.ts';

describe('reference.ts config module', () => {
  describe('define', () => {
    it('should return reference config', () => {
      const config = define();

      expect(config).toEqual(TsConfigs.Reference.CONFIG);
    });

    it('should return a new instance (deep clone)', () => {
      const config1 = define();
      const config2 = define();

      expect(config1).not.toBe(config2);
      expect(config1.references).not.toBe(config2.references);
    });
  });
});
