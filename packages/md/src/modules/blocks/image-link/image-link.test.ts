import { describe, it, expect } from 'vitest';
import { imageLink, imageLinkElement } from './image-link.ts';

describe('(blocks) imageLink', () => {
  describe('md', () => {
    it('nests image inside a link', () => {
      const md = imageLink({
        imgUrl: 'https://img/x.png',
        description: 'alt',
        linkUrl: 'https://link/page'
      });
      expect(md).toBe('[![alt](https://img/x.png)](https://link/page)');
    });
  });
  describe('element', () => {
    it('nests img inside anchor with props', () => {
      const el = imageLinkElement({
        imgUrl: 'https://img/x.png',
        linkUrl: 'https://link/page',
        description: 'alt',
        id: 'imgLink'
      });
      expect(el).toContain('<a');
      expect(el).toContain('href="https://link/page"');
      expect(el).toContain('id="imgLink"');
      expect(el).toContain('<img');
      expect(el).toContain('alt="alt"');
      expect(el).toContain('src="https://img/x.png"');
    });
  });
});
