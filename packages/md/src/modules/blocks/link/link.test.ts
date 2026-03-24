import { describe, it, expect } from 'vitest';
import { link, linkElement } from './link.ts';

describe('(blocks) link', () => {
  describe('md', () => {
    it('should format with and without description', () => {
      const withDesc = link({ content: 'Name', url: 'https://x', description: 'desc' });
      expect(withDesc).toContain('[Name]');
      expect(withDesc).toContain('(https://x)');
      expect(withDesc).toContain(': desc');
      const withoutDesc = link({ content: 'Name', url: 'https://x' });
      expect(withoutDesc).toContain('[Name]');
      expect(withoutDesc).toContain('(https://x)');
      expect(withoutDesc).not.toContain(']:');
    });
  });
  describe('element', () => {
    it('should build anchor and support array props', () => {
      const el = linkElement({
        content: { text: 'N', styles: { italic: 'i' } },
        url: 'u',
        target: '_blank',
        id: 'lnk'
      });
      expect(el).toContain('<a');
      expect(el).toContain('href="u"');
      expect(el).toContain('target="_blank"');
      expect(el).toContain('id="lnk"');
      expect(el).toContain('<i>N</i>');
    });
  });
});
