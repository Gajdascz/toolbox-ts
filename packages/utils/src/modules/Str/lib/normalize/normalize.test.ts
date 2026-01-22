import { describe, expect, it } from 'vitest';

import { array, sentence } from './normalize.ts';

describe('normalize', () => {
  describe('array', () => {
    it('returns [] for undefined', () => {
      expect(array(undefined)).toEqual([]);
    });
    it('cleans, trims and filters invalid', () => {
      const input = [' a ', '', 'b', '  ', 1, null, 'c '];
      expect(array(input)).toEqual(['a', 'b', 'c']);
    });
    it('deduplicates when requested', () => {
      const input = [' a ', 'a', 'b', 'b', 'c'];
      expect(array(input, { deduplicate: true })).toEqual(['a', 'b', 'c']);
    });
    it('handles non-array input', () => {
      expect(array('not-an-array' as unknown)).toEqual(['not-an-array']);
    });
  });
  describe('sentence', () => {
    it('normalizes a sentence', () => {
      expect(sentence(' hello world ')).toBe('Hello world.');
    });
    it('custom end punctuation', () => {
      expect(sentence('hello world', { endPunctuation: '!' })).toBe(
        'Hello world!'
      );
    });
    it('does not double end punctuation', () => {
      expect(sentence('Hello world.')).toBe('Hello world.');
      expect(sentence('Hello world!')).toBe('Hello world!');
    });
    it('capitalizes first letter by default', () => {
      expect(sentence('hello world')).toBe('Hello world.');
    });
    it('can disable first letter capitalization', () => {
      expect(sentence('hello world', { capitalizeFirst: false })).toBe(
        'hello world.'
      );
    });
    it('returns empty string for non-string input', () => {
      expect(sentence(null)).toBe('');
      expect(sentence(undefined)).toBe('');
    });
    it('returns empty string for whitespace only input', () => {
      expect(sentence('   ')).toBe('');
    });
  });
});
