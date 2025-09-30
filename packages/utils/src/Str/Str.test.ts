import { describe, expect, it } from 'vitest';

import {
  camel,
  capitalize,
  is,
  kebab,
  normalize,
  pascal,
  prefix,
  split,
  suffix,
  title,
  uncapitalize
} from './Str.ts';

describe('Str', () => {
  describe('cases', () => {
    describe('camel', () => {
      const { is: isCamel, toKebab, toPascal, toTitle } = camel;
      it('is', () => {
        expect(isCamel('fooBarBaz')).toBe(true);
        expect(isCamel('f')).toBe(true);
        expect(isCamel('FooBar')).toBe(false);
        expect(isCamel('foo-bar')).toBe(false);
        expect(isCamel('')).toBe(false);
        expect(isCamel(123 as unknown)).toBe(false);
      });
      it('toKebab', () => {
        expect(toKebab('noEdit')).toBe('no-edit');
        expect(toKebab('myFlagName')).toBe('my-flag-name');
        expect(toKebab('AAAAAA')).toBe('a-a-a-a-a-a');
        expect(toKebab('  noVerify  ')).toBe('no-verify');
        expect(toKebab('A')).toBe('a');
        expect(toKebab('a')).toBe('a');
      });
      it('toPascal', () => {
        expect(toPascal('myFlagName')).toBe('MyFlagName');
        expect(toPascal('noEdit')).toBe('NoEdit');
        expect(toPascal('a')).toBe('A');
        expect(toPascal('A')).toBe('A');
        expect(toPascal('aAaAaA')).toBe('AAaAaA');
      });
      it('toTitle', () => {
        expect(toTitle('myFlagName')).toBe('My Flag Name');
        expect(toTitle('noEdit')).toBe('No Edit');
        expect(toTitle('a')).toBe('A');
        expect(toTitle('A')).toBe('A');
        expect(toTitle('aAaAaA')).toBe('A Aa Aa A');
      });
    });
    describe('kebab', () => {
      const { is: isKebab, toCamel, toPascal, toTitle } = kebab;
      it('is', () => {
        expect(isKebab('foo-bar-baz')).toBe(true);
        expect(isKebab('foo')).toBe(true);
        expect(isKebab('Foo-bar')).toBe(false);
        expect(isKebab('foo-')).toBe(false);
        expect(isKebab('')).toBe(false);
        expect(isKebab(null as unknown)).toBe(false);
      });
      it('toCamel', () => {
        expect(toCamel('no-edit')).toBe('noEdit');
        expect(toCamel('my-flag-name')).toBe('myFlagName');
        expect(toCamel('a-a-a-a-a-a')).toBe('aAAAAA');
        expect(toCamel('  no-verify  ')).toBe('noVerify');
        expect(toCamel('a')).toBe('a');
        expect(toCamel('A')).toBe('a');
      });
      it('toPascal', () => {
        expect(toPascal('my-flag-name')).toBe('MyFlagName');
        expect(toPascal('no-edit')).toBe('NoEdit');
        expect(toPascal('a')).toBe('A');
        expect(toPascal('A')).toBe('A');
        expect(toPascal('a-a-a-a-a-a')).toBe('AAAAAA');
      });
      it('toTitle', () => {
        expect(toTitle('my-flag-name')).toBe('My Flag Name');
        expect(toTitle('no-edit')).toBe('No Edit');
        expect(toTitle('a')).toBe('A');
        expect(toTitle('A')).toBe('A');
        expect(toTitle('a-a-a-a-a-a')).toBe('A A A A A A');
      });
    });
    describe('pascal', () => {
      const { is: isPascal, toCamel, toKebab, toTitle } = pascal;
      it('is', () => {
        expect(isPascal('FooBar')).toBe(true);
        expect(isPascal('F')).toBe(true);
        expect(isPascal('fooBar')).toBe(false);
        expect(isPascal('Foo-Bar')).toBe(false);
        expect(isPascal('')).toBe(false);
        expect(isPascal(123 as unknown)).toBe(false);
      });
      it('toCamel', () => {
        expect(toCamel('NoEdit')).toBe('noEdit');
        expect(toCamel('MyFlagName')).toBe('myFlagName');
        expect(toCamel('A')).toBe('a');
        expect(toCamel('a')).toBe('a');
        expect(toCamel('AAaAaA')).toBe('aAaAaA');
      });
      it('toKebab', () => {
        expect(toKebab('NoEdit')).toBe('no-edit');
        expect(toKebab('MyFlagName')).toBe('my-flag-name');
        expect(toKebab('AAAAAA')).toBe('a-a-a-a-a-a');
        expect(toKebab('  NoVerify  ')).toBe('no-verify');
        expect(toKebab('A')).toBe('a');
        expect(toKebab('a')).toBe('a');
      });
      it('toTitle', () => {
        expect(toTitle('MyFlagName')).toBe('My Flag Name');
        expect(toTitle('NoEdit')).toBe('No Edit');
        expect(toTitle('a')).toBe('A');
        expect(toTitle('A')).toBe('A');
        expect(toTitle('AAaAaA')).toBe('A Aa Aa A');
      });
    });
    describe('title', () => {
      const { is: isTitle, toKebab, toCamel, toPascal } = title;
      it('is', () => {
        expect(isTitle('Hello World')).toBe(true);
        expect(isTitle('A')).toBe(true);
        expect(isTitle('Hello')).toBe(true);
        expect(isTitle('hello world')).toBe(false);
        expect(isTitle('HelloWorld')).toBe(false);
        expect(isTitle('Hello-World')).toBe(true);
        expect(isTitle('')).toBe(false);
        expect(isTitle(123 as unknown)).toBe(false);
      });
      it('toKebab', () => {
        expect(toKebab('Hello World')).toBe('hello-world');
        expect(toKebab('  Hello   World  ')).toBe('hello-world');
        expect(toKebab('A')).toBe('a');
        expect(toKebab('a')).toBe('a');
        expect(toKebab('This is a Test')).toBe('this-is-a-test');
      });
      it('toCamel', () => {
        expect(toCamel('Hello World')).toBe('helloWorld');
        expect(toCamel('  Hello   World  ')).toBe('helloWorld');
        expect(toCamel('A')).toBe('a');
        expect(toCamel('a')).toBe('a');
        expect(toCamel('This is a Test')).toBe('thisIsATest');
      });
      it('toPascal', () => {
        expect(toPascal('Hello World')).toBe('HelloWorld');
        expect(toPascal('  Hello   World  ')).toBe('HelloWorld');
        expect(toPascal('A')).toBe('A');
        expect(toPascal('a')).toBe('A');
        expect(toPascal('This is a Test')).toBe('ThisIsATest');
      });
    });
  });
  describe('is', () => {
    it('prefixed', () => {
      expect(is.prefixed('--flag', '--')).toBe(true);
      expect(is.prefixed('flag', '--')).toBe(false);
      expect(is.prefixed('flag', '--')).toBe(false);
      expect(is.prefixed('no-prefix', '--')).toBe(false);
    });
    it('suffixed', () => {
      expect(is.suffixed('file.ts', '.ts')).toBe(true);
      expect(is.suffixed('file.js', '.js')).toBe(true);
      expect(is.suffixed('file.js', '.ts')).toBe(false);
      expect(is.suffixed('file', '.js')).toBe(false);
    });
    it('alphabetic', () => {
      expect(is.alphabetic('hello')).toBe(true);
      expect(is.alphabetic('HelloWorld')).toBe(true);
      expect(is.alphabetic('ABCdef')).toBe(true);
      expect(is.alphabetic('hello123')).toBe(false);
      expect(is.alphabetic('hello_world')).toBe(false);
      expect(is.alphabetic('hello-world')).toBe(false);
      expect(is.alphabetic('')).toBe(false);
      expect(is.alphabetic(123 as unknown)).toBe(false);
    });
    it('array', () => {
      expect(is.array(['a', 'b', 'c'])).toBe(true);
      expect(is.array([])).toBe(true);
      expect(is.array(['a', 2, 'c'])).toBe(false);
      expect(is.array([1, 2, 3])).toBe(false);
      expect(is.array('not-an-array' as unknown)).toBe(false);
      expect(is.array(null)).toBe(false);
      expect(is.array(undefined)).toBe(false);
    });
    it('alphanumeric', () => {
      expect(is.alphanumeric('hello123')).toBe(true);
      expect(is.alphanumeric('HelloWorld2024')).toBe(true);
      expect(is.alphanumeric('ABCdef456')).toBe(true);
      expect(is.alphanumeric('hello_world')).toBe(false);
      expect(is.alphanumeric('hello-world')).toBe(false);
      expect(is.alphanumeric('hello!')).toBe(false);
      expect(is.alphanumeric('')).toBe(false);
      expect(is.alphanumeric(123 as unknown)).toBe(false);
    });
    it('char', () => {
      expect(is.char('a')).toBe(true);
      expect(is.char('Z')).toBe(true);
      expect(is.char('1')).toBe(true);
      expect(is.char('@')).toBe(true);
      expect(is.char('ab')).toBe(false);
      expect(is.char('')).toBe(false);
      expect(is.char(1 as unknown)).toBe(false);
    });
    it('capitalized', () => {
      expect(is.capitalized('Hello')).toBe(true);
      expect(is.capitalized('A')).toBe(true);
      expect(is.capitalized('HelloWorld')).toBe(true);
      expect(is.capitalized('hello')).toBe(false);
      expect(is.capitalized('HELLO')).toBe(true);
      expect(is.capitalized('Hello123')).toBe(true);
      expect(is.capitalized('')).toBe(false);
      expect(is.capitalized(123 as unknown)).toBe(false);
    });
  });
  describe('capitalize / uncapitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('h')).toBe('H');
    });
    it('uncapitalizes first letter', () => {
      expect(uncapitalize('Hello')).toBe('hello');
      expect(uncapitalize('H')).toBe('h');
    });
  });
  describe('normalize', () => {
    describe('array', () => {
      it('returns [] for undefined', () => {
        expect(normalize.array(undefined)).toEqual([]);
      });
      it('cleans, trims and filters invalid', () => {
        const input = [' a ', '', 'b', '  ', 1, null, 'c '];
        expect(normalize.array(input)).toEqual(['a', 'b', 'c']);
      });
      it('deduplicates when requested', () => {
        const input = [' a ', 'a', 'b', 'b', 'c'];
        expect(normalize.array(input, { deduplicate: true })).toEqual([
          'a',
          'b',
          'c'
        ]);
      });
      it('handles non-array input', () => {
        expect(normalize.array('not-an-array' as unknown)).toEqual([
          'not-an-array'
        ]);
      });
    });
    describe('sentence', () => {
      it('normalizes a sentence', () => {
        expect(normalize.sentence(' hello world ')).toBe('Hello world.');
      });
      it('custom end punctuation', () => {
        expect(normalize.sentence('hello world', { endPunctuation: '!' })).toBe(
          'Hello world!'
        );
      });
      it('does not double end punctuation', () => {
        expect(normalize.sentence('Hello world.')).toBe('Hello world.');
        expect(normalize.sentence('Hello world!')).toBe('Hello world!');
      });
      it('capitalizes first letter by default', () => {
        expect(normalize.sentence('hello world')).toBe('Hello world.');
      });
      it('can disable first letter capitalization', () => {
        expect(
          normalize.sentence('hello world', { capitalizeFirst: false })
        ).toBe('hello world.');
      });
      it('returns empty string for non-string input', () => {
        expect(normalize.sentence(123)).toBe('123.');
        expect(normalize.sentence(null)).toBe('Null.');
        expect(normalize.sentence(undefined)).toBe('');
      });
    });
  });
  describe('prefix / suffix', () => {
    it('prefixes string', () => {
      expect(prefix('--', 'flag')).toBe('--flag');
    });
    it('suffixes string', () => {
      expect(suffix('file', '.ts')).toBe('file.ts');
    });
  });
  describe('split', () => {
    it('csv', () => {
      expect(split.csv('a,b , c')).toEqual(['a', 'b', 'c']);
    });
    it('spaceSeparated', () => {
      expect(split.space('a b  c')).toEqual(['a', 'b', 'c']);
    });
    it('lines', () => {
      expect(split.lines('a\nb\r\nc')).toEqual(['a', 'b', 'c']);
    });
    it('csvRows', () => {
      expect(split.csvRows('a,b,c\nd,e,f\r\ng,h,i')).toEqual([
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
        ['g', 'h', 'i']
      ]);
    });
  });
});
