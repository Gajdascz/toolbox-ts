import { describe, expect, it } from 'vitest';
import { define, toFileEntry } from './module.ts';
import type { InputConfig } from './types.ts';
describe('configs/runtime/oxfmt', () => {
  describe('define', () => {
    it('should override defaults with input config', () => {
      const inputConfig: InputConfig = { proseWrap: 'always', printWidth: 120, tabWidth: 10 };
      const result = define(inputConfig);
      expect(result).toEqual(expect.objectContaining(inputConfig));
    });
  });
  it('toFileEntry should produce correct file entry', () => {
    const config: InputConfig = { proseWrap: 'always', printWidth: 120, tabWidth: 10 };
    const content = toFileEntry(config);
    expect(content).toMatchSnapshot();
  });
});
