import { describe, it, expect } from 'vitest';
import { applyProp, makeHtmlElement, makeSingleTagHtmlElement, spanTag } from './utils.ts';

describe('(core) utils', () => {
  describe('applyProp', () => {
    describe('returns an empty string when', () => {
      it('value is undefined', () => {
        expect(applyProp('data-test', undefined)).toBe('');
      });
      it('when value is null', () => {
        expect(applyProp('data-test', null)).toBe('');
      });
      it('when value is just whitespace', () => {
        expect(applyProp('data-test', '   ')).toBe('');
      });
      it('when value is an empty array', () => {
        expect(applyProp('class', [])).toBe('');
      });
    });
    describe('returns name=value when', () => {
      it('value is string', () => {
        expect(applyProp('data-test', 'value')).toBe(' data-test="value"');
      });

      it('value is number', () => {
        expect(applyProp('data-test', 123)).toBe(' data-test=123');
      });

      it('value is boolean', () => {
        expect(applyProp('data-test', true)).toBe(' data-test=true');
      });
      it('value is an array of strings', () => {
        expect(applyProp('class', ['btn', 'btn-primary'])).toBe(' class="btn btn-primary"');
      });
      it('value is an array of strings with duplicates', () => {
        expect(applyProp('class', ['btn', 'btn-primary', 'btn'])).toBe(' class="btn btn-primary"');
      });
      it('value is an array of strings with style', () => {
        expect(applyProp('style', ['color: red', 'font-size: 12px'])).toBe(
          ' style="color: red; font-size: 12px;"'
        );
      });
      it('value is an object value', () => {
        expect(applyProp('data-info', { key: 'value' })).toBe(' data-info={"key":"value"}');
      });
    });
  });

  describe('makeHtmlElement', () => {
    it('should create an HTML element with content and props', () => {
      const result = makeHtmlElement('div', 'Hello World', { class: 'greeting' });
      expect(result).toBe('<div class="greeting">Hello World</div>');
    });
    it('should create an HTML element without content', () => {
      const result = makeHtmlElement('div', undefined, { class: 'greeting' });
      expect(result).toBe('<div class="greeting"></div>');
    });
    it('should create an HTML element without props', () => {
      const result = makeHtmlElement('div', 'Hello World');
      expect(result).toBe('<div>Hello World</div>');
    });
  });
  describe('makeSingleTagHtmlElement', () => {
    it('should create a single tag HTML element with props', () => {
      const result = makeSingleTagHtmlElement('img', { src: 'image.png', alt: 'An image' });
      expect(result).toBe('<img src="image.png" alt="An image" />');
    });
    it('should create a single tag HTML element without props', () => {
      const result = makeSingleTagHtmlElement('br');
      expect(result).toBe('<br />');
    });
  });

  describe('spanTag', () => {
    it('should create a span tag with content and props', () => {
      const result = spanTag({ text: 'Hello', styles: { bold: 'strong' } }, { class: 'greeting' });
      expect(result).toBe('<span class="greeting"><strong>Hello</strong></span>');
    });
    it('should create a span tag with content and no props', () => {
      const result = spanTag({ text: 'Hello', styles: { italic: 'i' } });
      expect(result).toBe('<span><i>Hello</i></span>');
    });
    it('should create a span tag with empty content and no props', () => {
      const result = spanTag({ text: '', styles: {} });
      expect(result).toBe('<span></span>');
    });
  });
});
