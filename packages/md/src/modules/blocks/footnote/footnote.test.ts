import { describe, it, expect } from 'vitest';
import { footnote, footnoteDefinition } from './footnote.ts';

describe('(blocks) footnote', () => {
  describe('md', () => {
    describe('footnote (inline)', () => {
      it('should create footnote reference with given label', () => {
        expect(footnote('1')).toBe('[^1]');

        expect(footnote(2)).toBe('[^2]');
      });
    });
    describe('footnoteDefinition', () => {
      it('should create footnote definition with given label and content', () => {
        expect(footnoteDefinition('1', 'This is a footnote.')).toBe('[^1]: This is a footnote.');

        expect(footnoteDefinition(2, 'Another footnote.')).toBe('[^2]: Another footnote.');
      });
    });
  });
});
