import { describe, it, expect } from 'vitest';
import { blockQuote, blockQuoteElement } from './block-quote.ts';

describe('(blocks) blockQuote', () => {
  describe('md', () => {
    it('should format single string content as block quote', () => {
      const out = blockQuote('hello');
      expect(out).toBe('> hello');
    });
    it('should format multiple string content as block quote', () => {
      const out = blockQuote(['hello', 'world']);
      expect(out).toBe('> hello\n> world');
    });
  });
  describe('element', () => {
    it('should format single string content as block quote element', () => {
      const out = blockQuoteElement('hello');
      expect(out).toContain('<blockquote>');
      expect(out).toContain('hello');
      expect(out).toContain('</blockquote>');
    });
    it('should format multiple string content as block quote element', () => {
      const out = blockQuoteElement(['hello', 'world']);
      expect(out).toContain('<blockquote>');
      expect(out).toContain('hello');
      expect(out).toContain('world');
      expect(out).toContain('</blockquote>');
    });
  });
});
