import { describe, expect, it } from 'vitest';

import {
  camelToKebab,
  capitalize,
  cleanArr,
  is,
  kebabToCamel,
  parse,
  prefix,
  suffix,
  uncapitalize
} from '../../Text/Str.ts';

describe('camelToKebab', () => {
  it('converts typical camelCase', () => {
    expect(camelToKebab('noEdit')).toBe('no-edit');
    expect(camelToKebab('myFlagName')).toBe('my-flag-name');
  });
  it('handles all uppercase letters', () => {
    expect(camelToKebab('AAAAAA')).toBe('a-a-a-a-a-a');
  });
  it('trims whitespace', () => {
    expect(camelToKebab('  noVerify  ')).toBe('no-verify');
  });
  it('single letter stays lowercase', () => {
    expect(camelToKebab('A')).toBe('a');
    expect(camelToKebab('a')).toBe('a');
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

describe('kebabToCamel', () => {
  it('converts kebab-case to camelCase', () => {
    expect(kebabToCamel('my-flag-name')).toBe('myFlagName');
  });
  it('single segment stays lowercase', () => {
    expect(kebabToCamel('FOO')).toBe('foo');
  });
  it('handles already lowercase', () => {
    expect(kebabToCamel('simple')).toBe('simple');
  });
  it('handles single characters', () => {
    expect(kebabToCamel('a-a-a-a-a-a')).toBe('aAAAAA');
    expect(kebabToCamel('a-A-A-a-a-A')).toBe('aAAAAA');
  });
});

describe('cleanArr', () => {
  it('returns [] for undefined', () => {
    expect(cleanArr(undefined)).toEqual([]);
  });
  it('cleans, trims and filters invalid', () => {
    const input = [' a ', '', 'b', '  ', 1, null, 'c '];
    expect(cleanArr(input)).toEqual(['a', 'b', 'c']);
  });
  it('deduplicates when requested', () => {
    const input = [' a ', 'a', 'b', 'b', 'c'];
    expect(cleanArr(input, true)).toEqual(['a', 'b', 'c']);
  });
  it('handles non-array input', () => {
    expect(cleanArr('not-an-array' as unknown)).toEqual([]);
  });
});
describe('is', () => {
  describe('camel', () => {
    it('returns true for valid camelCase', () => {
      expect(is.camel('fooBarBaz')).toBe(true);
      expect(is.camel('f')).toBe(true);
    });
    it('returns false for invalid camelCase', () => {
      expect(is.camel('FooBar')).toBe(false); // starts uppercase
      expect(is.camel('foo-bar')).toBe(false); // hyphen
      expect(is.camel('')).toBe(false); // empty
      expect(is.camel(123 as unknown)).toBe(false); // non-string
    });
  });
  describe('kebab', () => {
    it('returns true for valid kebab-case', () => {
      expect(is.kebab('foo-bar-baz')).toBe(true);
      expect(is.kebab('foo')).toBe(true);
    });
    it('returns false for invalid kebab-case', () => {
      expect(is.kebab('Foo-bar')).toBe(false); // uppercase
      expect(is.kebab('foo-')).toBe(false); // trailing hyphen
      expect(is.kebab('')).toBe(false);
      expect(is.kebab(null as unknown)).toBe(false);
    });
  });
  describe('prefixed', () => {
    it('returns true for prefixed strings', () => {
      expect(is.prefixed('--flag', '--')).toBe(true);
      expect(is.prefixed('flag', '--')).toBe(false);
    });
    it('returns false for non-prefixed strings', () => {
      expect(is.prefixed('flag', '--')).toBe(false);
      expect(is.prefixed('no-prefix', '--')).toBe(false);
    });
  });
  describe('suffixed', () => {
    it('returns true for suffixed strings', () => {
      expect(is.suffixed('file.ts', '.ts')).toBe(true);
      expect(is.suffixed('file.js', '.js')).toBe(true);
    });
    it('returns false for non-suffixed strings', () => {
      expect(is.suffixed('file.js', '.ts')).toBe(false);
      expect(is.suffixed('file', '.js')).toBe(false);
    });
  });
  describe('str', () => {
    it('returns true for strings', () => {
      expect(is.str('hello')).toBe(true);
      expect(is.str('')).toBe(true);
    });
    it('returns false for non-strings', () => {
      expect(is.str(123)).toBe(false);
      expect(is.str(null)).toBe(false);
      expect(is.str(undefined)).toBe(false);
    });
  });
  describe('alphabetic', () => {
    it('returns true for alphabetic strings', () => {
      expect(is.alphabetic('hello')).toBe(true);
      expect(is.alphabetic('HelloWorld')).toBe(true);
      expect(is.alphabetic('ABCdef')).toBe(true);
    });
    it('returns false for non-alphabetic strings', () => {
      expect(is.alphabetic('hello123')).toBe(false); // contains numbers
      expect(is.alphabetic('hello_world')).toBe(false); // contains underscore
      expect(is.alphabetic('hello-world')).toBe(false); // contains hyphen
      expect(is.alphabetic('')).toBe(false); // empty string
      expect(is.alphabetic(123 as unknown)).toBe(false); // non-string
    });
  });
  describe('array', () => {
    it('returns true for string arrays', () => {
      expect(is.array(['a', 'b', 'c'])).toBe(true);
      expect(is.array([])).toBe(true);
    });
    it('returns false for non-string arrays', () => {
      expect(is.array(['a', 2, 'c'])).toBe(false);
      expect(is.array([1, 2, 3])).toBe(false);
      expect(is.array('not-an-array' as unknown)).toBe(false);
      expect(is.array(null)).toBe(false);
      expect(is.array(undefined)).toBe(false);
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

describe('parse', () => {
  it('csvRow', () => {
    expect(parse.csvRow('a,b , c')).toEqual(['a', 'b', 'c']);
  });
  it('spaceSeparated', () => {
    expect(parse.spaceSeparated('a b  c')).toEqual(['a', 'b', 'c']);
  });
  it('lines', () => {
    expect(parse.lines('a\nb\r\nc')).toEqual(['a', 'b', 'c']);
  });
  it('csv', () => {
    expect(parse.csv('a,b,c\nd,e,f\r\ng,h,i')).toEqual([
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['g', 'h', 'i']
    ]);
  });
});
