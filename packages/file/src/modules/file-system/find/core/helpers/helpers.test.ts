import { describe, it, expect } from 'vitest';
import { handleTraversalResult } from './helpers.ts';

describe('File.Find helpers', () => {
  describe('handleTraversalResult', () => {
    it('handles successful traversal result without sorting', () => {
      const traverseResult = {
        ok: true,
        detail: [['file1.txt', 'file2.txt'], ['file3.txt']]
      } as any;
      const result = handleTraversalResult(traverseResult);
      expect(result).toEqual(['file1.txt', 'file2.txt', 'file3.txt']);
    });
    it('handles successful traversal result with sorting', () => {
      const traverseResult = {
        ok: true,
        detail: [['file2.txt', 'file1.txt'], ['file3.txt']]
      } as any;
      const result = handleTraversalResult(traverseResult, (a, b) => a.localeCompare(b));
      expect(result).toEqual(['file1.txt', 'file2.txt', 'file3.txt']);
    });
    it('throws error if traversal result is not ok', () => {
      const error = new Error('Traversal failed');
      const traverse = { ok: false, error } as any;
      expect(() => handleTraversalResult(traverse)).toThrow('Traversal failed');
    });
  });
});
