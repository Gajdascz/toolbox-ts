import { describe, it, expect } from 'vitest';
import { define, toFileEntry } from './module.ts';
import type { InputConfig } from './types.ts';
describe('configs/runtime/lint-staged', () => {
  describe('define', () => {
    it('should return an empty config when no parameters are provided', () => {
      const result = define();
      expect(result).toEqual({});
    });

    it('should return config with srcFilesCmds and dataFilesCmds', () => {
      const config: InputConfig = {
        srcFilesCmds: ['eslint --fix', 'prettier --write'],
        dataFilesCmds: ['prettier --write']
      };
      const result = JSON.stringify(define(config));
      expect(result).toContain('eslint --fix');
      expect(result).toContain('prettier --write');
    });
  });

  it('toFileEntry should produce correct file entry', () => {
    const config: InputConfig = {
      srcFilesCmds: ['eslint --fix', 'prettier --write'],
      dataFilesCmds: ['prettier --write']
    };
    const fileEntry = toFileEntry(config);
    expect(fileEntry).toMatchSnapshot();
  });
});
