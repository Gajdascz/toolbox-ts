import { describe, it, expect } from 'vitest';
import { image, imageElement } from './image.ts';

describe('(blocks) image', () => {
  describe('md', () => {
    it('should include description when provided and empty description when not', () => {
      const withDesc = image({ url: 'u', description: 'alt' });
      expect(withDesc).toContain('![alt]');
      expect(withDesc).toContain('(u)');
      const withoutDesc = image({ url: 'u' });
      expect(withoutDesc).toContain('![]');
      expect(withoutDesc).toContain('(u)');
    });
  });

  describe('element', () => {
    it('should return a single-tag HTML img with props', () => {
      const withDesc = imageElement({ url: 'u', description: 'alt' });
      expect(withDesc).toContain('alt="alt"');
      expect(withDesc).toContain('src="u"');
      const withoutDesc = imageElement({ url: 'u' });
      expect(withoutDesc).toContain('<img');
      expect(withoutDesc).toContain('src="u"');
      expect(withoutDesc).not.toContain('alt');
      expect(withoutDesc).not.toContain('</img>');
    });
  });
});
