import { describe, expect, it } from 'vitest';

import { end, join, section } from './structure.ts';

describe('structure', () => {
  describe('end', () => {
    it('adds separator when text is non-empty and separator is true', () => {
      const result = end('Some content', true);
      expect(result).toBe('Some content\n\n---');
    });

    it('does not add separator when text is empty', () => {
      const result = end('', true);
      expect(result).toBe('');
    });

    it('does not add separator when separator is false', () => {
      const result = end('Some content', false);
      expect(result).toBe('Some content');
    });
  });
  describe('join', () => {
    it('joins multiple non-empty strings with newlines', () => {
      const result = join('Line 1', 'Line 2', 'Line 3');
      expect(result).toBe('Line 1\nLine 2\nLine 3');
    });

    it('filters out empty and undefined strings', () => {
      const result = join('Line 1', '', undefined, 'Line 2', '');
      expect(result).toBe('Line 1\nLine 2');
    });
  });
  describe('section', () => {
    it('creates a section with header, body, footer, and separator', () => {
      const result = section({
        title: '## Header',
        body: 'This is the body.',
        separator: true
      });
      expect(result).toBe('## Header\nThis is the body.\n\n---');
    });
    it('creates a section without separator when specified', () => {
      const result = section({
        title: '## Header',
        body: 'This is the body.',
        separator: false
      });
      expect(result).toBe('## Header\nThis is the body.');
    });
  });
});
