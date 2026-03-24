import { describe, expect, it } from 'vitest';

import { end, section, compose, combine } from './structure.ts';

describe('(core) structure', () => {
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
  describe('section', () => {
    it('creates a section with header, body, footer, and separator', () => {
      const result = section({ heading: '## Header', body: 'This is the body.', separator: true });
      expect(result).toBe('## Header\n\nThis is the body.\n\n---');
    });
    it('creates a section without separator when specified', () => {
      const result = section({ heading: '## Header', body: 'This is the body.', separator: false });
      expect(result).toBe('## Header\n\nThis is the body.');
    });
  });
  describe('combine', () => {
    it('should combine non-empty strings', () => {
      const result = combine('Line 1', '', 'Line 2', null, 'Line 3');
      expect(result).toBe(`Line 1

Line 2

Line 3`);
    });
  });
  describe('compose', () => {
    it('excludes empty strings and nullish values', () => {
      const result = compose(
        'Line 1',
        '',
        '     ',
        undefined,
        'Line 2',
        null,
        'Line 3',
        { body: 'Line 4', heading: '### Title 4', separator: true },
        { body: 'Line 5', separator: false }
      );
      expect(result).toBe(`Line 1

Line 2

Line 3

### Title 4

Line 4

---

Line 5`);
    });
    it('should exclude sections with empty body', () => {
      const result = compose(
        { body: '', heading: '### Title 1', separator: true },
        { body: '   ', heading: '### Title 2', separator: true },
        { body: '      ', heading: '### Title 3', separator: true },
        { body: '', heading: '### Title 4', separator: true },
        { body: 'Valid body', heading: '### Valid Title', separator: true }
      );
      expect(result).toBe(`### Valid Title

Valid body

---`);
    });
  });
});
