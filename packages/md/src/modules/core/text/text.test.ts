import { describe, expect, it } from 'vitest';

import {
  bold,
  inlineCode,
  isText,
  italic,
  strikethrough,
  subScript,
  superScript,
  text,
  type TextWithStyle,
  underline
} from './text.ts';

describe('(core) text', () => {
  it('underline: default, md, tag and false', () => {
    expect(underline('hello')).toBe('<ins>hello</ins>');
    expect(underline('hello', 'md')).toBe('<ins>hello</ins>');
    expect(underline('hello', 'u')).toBe('<u>hello</u>');
    expect(underline('hello', false)).toBe('<ins>hello</ins>');
  });

  it('superScript and subScript produce correct tags', () => {
    expect(superScript('2')).toBe('<sup>2</sup>');
    expect(subScript('x')).toBe('<sub>x</sub>');
  });

  it('bold: md, b and strong variants', () => {
    expect(bold('T')).toBe('**T**');
    expect(bold('T', 'b')).toBe('<b>T</b>');
    expect(bold('T', 'strong')).toBe('<strong>T</strong>');
  });

  it('italic: md, i and em variants', () => {
    expect(italic('i')).toBe('*i*');
    expect(italic('i', 'i')).toBe('<i>i</i>');
    expect(italic('i', 'em')).toBe('<em>i</em>');
  });

  it('strikethrough: md, del and strike variants', () => {
    expect(strikethrough('s')).toBe('~~s~~');
    expect(strikethrough('s', 'del')).toBe('<del>s</del>');
    expect(strikethrough('s', 'strike')).toBe('<strike>s</strike>');
  });

  it('inlineCode: md and tag variants', () => {
    expect(inlineCode('code')).toBe('`code`');
    expect(inlineCode('c', 'code')).toBe('<code>c</code>');
    expect(inlineCode('p', 'pre')).toBe('<pre>p</pre>');
  });

  it('text: returns plain string unchanged', () => {
    expect(text('plain')).toBe('plain');
  });

  it('text: applies multiple styles in insertion order', () => {
    const styled: TextWithStyle = {
      text: 'hey',
      styles: {
        italic: 'i', // first applied -> <i>hey</i>
        bold: 'b', // second -> <b><i>hey</i></b>
        underline: 'u' // third -> <u><b><i>hey</i></b></u>
      }
    };
    expect(text(styled)).toBe('<u><b><i>hey</i></b></u>');
  });

  it('text: supports styles without a second parameter (superScript)', () => {
    const styled: TextWithStyle = { text: 'x', styles: { bold: 'b', superScript: undefined } };
    // bold applied first -> <b>x</b>, then superScript -> <sup><b>x</b></sup>
    expect(text(styled)).toBe('<sup><b>x</b></sup>');
  });

  it('text: inlineCode with md produces backticks', () => {
    const styled: TextWithStyle = { text: 'z', styles: { inlineCode: 'md' } };
    expect(text(styled)).toBe('`z`');
  });
  it('text: returns empty string for undefined and plain text when no styles property is provided', () => {
    expect(text(undefined)).toBe('');
    expect(text({ text: 'noStyle' })).toBe('noStyle');
  });

  it('isText: validates input', () => {
    expect(isText(undefined)).toBe(false);
    expect(isText(null)).toBe(false);
    expect(isText(123)).toBe(false);
    expect(isText({})).toBe(false);
    expect(isText({ text: 'hi' })).toBe(true);
    expect(isText('hello')).toBe(true);
  });
});
