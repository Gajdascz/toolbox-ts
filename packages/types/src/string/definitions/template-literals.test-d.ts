import { describe, expectTypeOf, it } from 'vitest';

import type {
  CsvPair,
  Prefix,
  Repeat,
  SeparatedLiterals,
  SeparatedPair,
  Suffix,
  TemplateValue,
  Wrap,
  WrapTag
} from './template-literals.js';

describe('Template Literal Types', () => {
  describe('SeparatedLiterals', () => {
    it('joins array with default comma separator', () => {
      expectTypeOf<
        SeparatedLiterals<['1', '2', '3']>
      >().toEqualTypeOf<'1,2,3'>();
    });

    it('joins array with custom separator', () => {
      expectTypeOf<
        SeparatedLiterals<['a', 'b', 'c'], '-'>
      >().toEqualTypeOf<'a-b-c'>();
    });

    it('handles single element array', () => {
      expectTypeOf<SeparatedLiterals<['onlyOne']>>().toEqualTypeOf<'onlyOne'>();
    });

    it('handles empty array', () => {
      expectTypeOf<SeparatedLiterals<[]>>().toEqualTypeOf<''>();
    });

    it('joins with pipe separator', () => {
      expectTypeOf<
        SeparatedLiterals<['x', 'y', 'z'], ' | '>
      >().toEqualTypeOf<'x | y | z'>();
    });

    it('joins numeric values', () => {
      expectTypeOf<
        SeparatedLiterals<[1, 2, 3], ':'>
      >().toEqualTypeOf<'1:2:3'>();
    });

    it('joins boolean values', () => {
      expectTypeOf<
        SeparatedLiterals<[true, false]>
      >().toEqualTypeOf<'true,false'>();
    });

    it('joins mixed types', () => {
      expectTypeOf<
        SeparatedLiterals<['a', 1, true]>
      >().toEqualTypeOf<'a,1,true'>();
    });

    it('handles two elements', () => {
      expectTypeOf<
        SeparatedLiterals<['first', 'second'], ' '>
      >().toEqualTypeOf<'first second'>();
    });
  });

  describe('SeparatedPair', () => {
    it('creates pair with default space separator', () => {
      expectTypeOf<
        SeparatedPair<'hello', 'world'>
      >().toEqualTypeOf<'hello world'>();
    });

    it('creates pair with custom separator', () => {
      expectTypeOf<
        SeparatedPair<'key', 'value', '='>
      >().toEqualTypeOf<'key=value'>();
    });

    it('creates pair with numeric values', () => {
      expectTypeOf<SeparatedPair<1, 2, ','>>().toEqualTypeOf<'1,2'>();
    });

    it('creates pair with boolean values', () => {
      expectTypeOf<
        SeparatedPair<true, false, '-'>
      >().toEqualTypeOf<'true-false'>();
    });

    it('creates pair with mixed types', () => {
      expectTypeOf<
        SeparatedPair<'count', 42, ': '>
      >().toEqualTypeOf<'count: 42'>();
    });
  });

  describe('CsvPair', () => {
    it('creates csv pair with default template values', () => {
      expectTypeOf<CsvPair>().toEqualTypeOf<`${TemplateValue},${TemplateValue}`>();
    });
    it('creates csv pair with string literals', () => {
      expectTypeOf<CsvPair<'a', 'b'>>().toEqualTypeOf<'a,b'>();
    });
    it('creates csv pair with numbers', () => {
      expectTypeOf<CsvPair<1, 2>>().toEqualTypeOf<'1,2'>();
    });
    it('creates csv pair with booleans', () => {
      expectTypeOf<CsvPair<true, false>>().toEqualTypeOf<'true,false'>();
    });
    it('creates csv pair with union types', () => {
      expectTypeOf<CsvPair<'one' | 'two', 'four' | 'three'>>().toEqualTypeOf<
        'one,four' | 'one,three' | 'two,four' | 'two,three'
      >();
    });
    it('creates csv pair with same type for both', () => {
      expectTypeOf<CsvPair<number>>().toEqualTypeOf<`${number},${number}`>();
    });
    it('creates csv pair with separator including space', () => {
      expectTypeOf<CsvPair<'x', 'y', ', '>>().toEqualTypeOf<'x, y'>();
    });
  });

  describe('Repeat', () => {
    it('repeats character once', () => {
      expectTypeOf<Repeat<'a', 1>>().toEqualTypeOf<'a'>();
    });

    it('repeats character multiple times', () => {
      expectTypeOf<Repeat<'a', 5>>().toEqualTypeOf<'aaaaa'>();
    });

    it('repeats character zero times', () => {
      expectTypeOf<Repeat<'x', 0>>().toEqualTypeOf<''>();
    });

    it('repeats multi-character string', () => {
      expectTypeOf<Repeat<'ab', 3>>().toEqualTypeOf<'ababab'>();
    });

    it('repeats special characters', () => {
      expectTypeOf<Repeat<'-', 4>>().toEqualTypeOf<'----'>();
    });

    it('repeats with different numbers', () => {
      expectTypeOf<Repeat<'*', 10>>().toEqualTypeOf<'**********'>();
    });
  });

  describe('Wrap', () => {
    it('wraps content with same left and right', () => {
      expectTypeOf<Wrap<'*', '*', 'text'>>().toEqualTypeOf<'*text*'>();
    });

    it('wraps content with different left and right', () => {
      expectTypeOf<Wrap<'(', ')', 'content'>>().toEqualTypeOf<'(content)'>();
    });

    it('wraps with square brackets', () => {
      expectTypeOf<Wrap<'[', ']', 'value'>>().toEqualTypeOf<'[value]'>();
    });

    it('wraps with curly braces', () => {
      expectTypeOf<Wrap<'{', '}', 'data'>>().toEqualTypeOf<'{data}'>();
    });

    it('wraps with quotes', () => {
      expectTypeOf<Wrap<'"', '"', 'string'>>().toEqualTypeOf<'"string"'>();
    });

    it('wraps with angle brackets', () => {
      expectTypeOf<Wrap<'<', '>', 'tag'>>().toEqualTypeOf<'<tag>'>();
    });

    it('allows generic string content', () => {
      expectTypeOf<Wrap<'(', ')'>>().toEqualTypeOf<`(${string})`>();
    });
  });

  describe('WrapTag', () => {
    it('wraps content in HTML tag', () => {
      expectTypeOf<
        WrapTag<'div', 'Content'>
      >().toEqualTypeOf<'<div>Content</div>'>();
    });

    it('wraps content in different tag', () => {
      expectTypeOf<
        WrapTag<'span', 'Text'>
      >().toEqualTypeOf<'<span>Text</span>'>();
    });

    it('wraps content in self-closing-style tag', () => {
      expectTypeOf<
        WrapTag<'p', 'Paragraph'>
      >().toEqualTypeOf<'<p>Paragraph</p>'>();
    });

    it('wraps with custom tag names', () => {
      expectTypeOf<
        WrapTag<'custom-element', 'data'>
      >().toEqualTypeOf<'<custom-element>data</custom-element>'>();
    });

    it('allows generic string content', () => {
      expectTypeOf<WrapTag<'div'>>().toEqualTypeOf<`<div>${string}</div>`>();
    });
    it('wraps with attributes', () => {
      expectTypeOf<
        WrapTag<'a', 'Link', 'href="https://example.com" rel="nofollow"'>
      >().toEqualTypeOf<'<a href="https://example.com" rel="nofollow">Link</a>'>();
    });
  });

  describe('Prefix', () => {
    it('prepends prefix to string', () => {
      expectTypeOf<Prefix<'pre-', 'fix'>>().toEqualTypeOf<'pre-fix'>();
    });

    it('prepends empty prefix', () => {
      expectTypeOf<Prefix<'', 'text'>>().toEqualTypeOf<'text'>();
    });

    it('prepends to empty string', () => {
      expectTypeOf<Prefix<'pre-', ''>>().toEqualTypeOf<'pre-'>();
    });

    it('prepends special characters', () => {
      expectTypeOf<Prefix<'$', 'variable'>>().toEqualTypeOf<'$variable'>();
    });

    it('prepends multiple characters', () => {
      expectTypeOf<Prefix<'test-', 'file'>>().toEqualTypeOf<'test-file'>();
    });
  });

  describe('Suffix', () => {
    it('appends suffix to string', () => {
      expectTypeOf<Suffix<'file', '.txt'>>().toEqualTypeOf<'file.txt'>();
    });

    it('appends empty suffix', () => {
      expectTypeOf<Suffix<'text', ''>>().toEqualTypeOf<'text'>();
    });

    it('appends to empty string', () => {
      expectTypeOf<Suffix<'', '-end'>>().toEqualTypeOf<'-end'>();
    });

    it('appends special characters', () => {
      expectTypeOf<Suffix<'name', '!'>>().toEqualTypeOf<'name!'>();
    });

    it('appends file extensions', () => {
      expectTypeOf<
        Suffix<'document', '.pdf'>
      >().toEqualTypeOf<'document.pdf'>();
    });
  });

  describe('Combined operations', () => {
    it('combines prefix and suffix', () => {
      type PrefixedAndSuffixed = Suffix<Prefix<'pre-', 'middle'>, '-post'>;
      expectTypeOf<PrefixedAndSuffixed>().toEqualTypeOf<'pre-middle-post'>();
    });

    it('wraps then adds prefix', () => {
      type WrappedThenPrefixed = Prefix<'$', Wrap<'(', ')', 'value'>>;
      expectTypeOf<WrappedThenPrefixed>().toEqualTypeOf<'$(value)'>();
    });

    it('creates tagged wrapped content', () => {
      type TaggedContent = WrapTag<'div', Wrap<'"', '"', 'text'>>;
      expectTypeOf<TaggedContent>().toEqualTypeOf<'<div>"text"</div>'>();
    });
  });
});
