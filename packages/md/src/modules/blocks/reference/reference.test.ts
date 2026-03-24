import { describe, it, expect } from 'vitest';
import { reference } from './reference.ts';
import { type TextWithStyle } from '../../core/text/index.ts';
describe('(blocks) reference', () => {
  describe('md', () => {
    it('without description', () => {
      expect(reference({ name: 'n', url: 'u' })).toBe('[n]: u');
    });
    it('with styled description', () => {
      const desc: TextWithStyle = { text: 'd', styles: { bold: 'md' } };
      expect(reference({ name: 'n', url: 'u', description: desc })).toBe('[n]: u "**d**"');
    });
  });
});
