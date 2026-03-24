import { describe, it, expect } from 'vitest';
import { heading, clampHeadingSize, headingElement } from './heading.ts';

describe('(blocks) heading', () => {
  it('should clamp heading size between 1 and 6', () => {
    expect(clampHeadingSize(0)).toBe(1);
    expect(clampHeadingSize(7)).toBe(6);
    expect(clampHeadingSize(3)).toBe(3);
    expect(clampHeadingSize(-5)).toBe(1);
    expect(clampHeadingSize(10)).toBe(6);
  });

  describe('md', () => {
    it('should create markdown heading with correct number of # based on size', () => {
      expect(heading({ content: 'Title', size: 1 })).toBe('# Title');
      expect(heading({ content: 'Subtitle', size: 3 })).toBe('### Subtitle');
      expect(heading({ content: 'Small Heading', size: 6 })).toBe('###### Small Heading');
    });
    it('should include id if provided', () => {
      expect(heading({ content: 'Title', size: 2, id: 'title-id' })).toBe('## Title{#title-id}');
    });
  });
  describe('element', () => {
    it('should create correct HTML element', () => {
      const el = headingElement({ content: 'Heading', size: 4, id: 'h1' });
      expect(el).toBe('<h4 id="h1">Heading</h4>');
    });
  });
});
