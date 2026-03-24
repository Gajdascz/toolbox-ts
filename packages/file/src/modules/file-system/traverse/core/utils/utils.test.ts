import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { defaultResultHandler, normalizeStartEnd, toParent } from './utils.ts';

describe('File.Traverse utils', () => {
  describe('defaultResultHandler', () => {
    it('adds single result to current results array', () => {
      const curr: number[] = [];
      defaultResultHandler(1, curr);
      expect(curr).toEqual([1]);
    });
    it('adds multiple results to current results array', () => {
      const curr: number[] = [];
      defaultResultHandler([1, 2, 3], curr);
      expect(curr).toEqual([1, 2, 3]);
    });
  });
  describe('toParent', () => {
    it('returns the parent directory', () => {
      expect(toParent('/a/b/c')).toBe('/a/b');
    });
    it('returns null if at root', () => {
      expect(toParent('/')).toBeNull();
    });
    it('returns null if at end directory', () => {
      expect(toParent('/a/b/c', '/a/b/c')).toBeNull();
    });
  });
  describe('normalizeStartEnd', () => {
    it('sets end to null if not provided', () => {
      const { start, end } = normalizeStartEnd('up', '/a/b/c');
      expect(start).toBe(path.resolve('/a/b/c'));
      expect(end).toBeNull();
    });
    it('resolves valid start and end directories for "up" direction', () => {
      const { start, end } = normalizeStartEnd('up', '/a/b/c', '/a');
      expect(start).toBe(path.resolve('/a/b/c'));
      expect(end).toBe(path.resolve('/a'));
    });
    it('resolves valid start and end directories for "down" direction', () => {
      const { start, end } = normalizeStartEnd('down', '/a', '/a/b/c');
      expect(start).toBe(path.resolve('/a'));
      expect(end).toBe(path.resolve('/a/b/c'));
    });
    it('throws error if end directory is not a parent of start for "up" direction', () => {
      expect(() => normalizeStartEnd('up', '/a/b/c', '/x')).toThrow(/must be a parent directory/);
    });
    it('throws error if end directory is not a subdirectory of start for "down" direction', () => {
      expect(() => normalizeStartEnd('down', '/a', '/x')).toThrow(/must be a subdirectory of/);
    });
  });
});
