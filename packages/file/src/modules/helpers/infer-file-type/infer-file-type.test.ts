import { inferFileType } from './infer-file-type.ts';
import { describe, it, expect } from 'vitest';

describe('File.inferFileType()', () => {
  it('should return json for json files', () => {
    const files = ['a.json', 'dir/test/b.jsonc', './c.json5'];
    expect(files.every((f) => inferFileType(f) === 'json')).toBeTruthy();
  });
  it('should return yaml for yaml files', () => {
    const files = ['a.yaml', 'dir/test/b.yml'];
    expect(files.every((f) => inferFileType(f) === 'yaml')).toBeTruthy();
  });
  it('should return module for module files', () => {
    const files = ['a.js', 'dir/test/b.astro', './c.ts', './x/y/z/o.vue'];
    expect(files.every((f) => inferFileType(f) === 'module')).toBeTruthy();
  });
  it('should return text for any other type', () => {
    const files = ['a.txt', 'dir/test/b.unknown', './c.exe'];
    expect(files.every((f) => inferFileType(f) === 'text')).toBeTruthy();
  });
});
