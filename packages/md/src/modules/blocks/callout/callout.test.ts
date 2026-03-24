import { describe, it, expect } from 'vitest';
import { callout } from './callout.ts';
import type { TextWithStyle } from '../../core/text/index.ts';
import { EMOJIS } from '../../core/constants.ts';

describe('(blocks) callout', () => {
  describe('md', () => {
    it('should upper-cases type and uses text formatter', () => {
      const msg: TextWithStyle = { text: 'hello', styles: { italic: 'md' } };
      const calloutMd = callout({ message: msg, type: 'tip' });
      expect(calloutMd).toContain('> [!TIP]');
      expect(calloutMd).toContain('*hello*');
      expect(calloutMd).toContain('\n');
    });
    it('should include emoji by default', () => {
      const calloutMd = callout({ message: 'hello', type: 'important' });
      expect(calloutMd).toContain(EMOJIS.IMPORTANT);
    });
    it('should not include emoji when emoji option is false', () => {
      const calloutMd = callout({ message: 'hello', type: 'important', emoji: false });
      expect(calloutMd).not.toContain(EMOJIS.IMPORTANT);
    });
  });
});
