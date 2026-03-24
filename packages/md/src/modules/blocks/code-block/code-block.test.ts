import { describe, it, expect } from 'vitest';
import { codeBlock } from './code-block.ts';

describe('(blocks) codeBlock', () => {
  describe('md', () => {
    it('should use provided language or plaintext by default', () => {
      expect(codeBlock('x', 'ts')).toBe('```ts\nx\n```');
    });
    it('should default to plaintext language', () => {
      expect(codeBlock('y')).toBe('```plaintext\ny\n```');
    });
  });
});
