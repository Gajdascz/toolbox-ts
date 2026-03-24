import { describe, it, expect } from 'vitest';
import { define, toFileEntry } from './module.ts';

describe('configs/static/.gitignore', () => {
  describe('define', () => {
    it('should merge unique input entries with defaults, sorted alphabetically', () => {
      const additional = ['custom-dir', 'node_modules', 'another-file'];
      const result = define(additional);
      expect(result).toContain(additional[0]);
      expect(result).toContain(additional[2]);
      expect(result).toContain('node_modules');
    });
  });
  it('toFileEntry should produce correct file entry', () => {
    const content = toFileEntry([
      'custom-dir',
      'node_modules',
      'another-file',
      'dist',
      'build',
      'coverage',
      'vendor',
      'logs',
      'temp',
      'cache'
    ]);
    expect(content).toMatchSnapshot();
  });
});
