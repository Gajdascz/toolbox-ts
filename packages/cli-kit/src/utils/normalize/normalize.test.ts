import { parseCommandString } from 'execa';
import { describe, expect, it, vi } from 'vitest';

import {
  commandInput,
  flagArgs,
  getCommandInputWrapper,
  nestWhen,
  objToFlags,
  type ObjToFlagSpec,
  strOrNum,
  when
} from './normalize.ts';

vi.mocked(parseCommandString).mockImplementation((cmd: string) =>
  cmd.split(' ')
);

describe('cli-kit: Normalize Utils', () => {
  describe('commandInput', () => {
    it('parses string command', () => {
      const res = commandInput('echo hi');
      expect(res).toEqual(['echo', ['hi']]);
    });

    it('parses tuple command', () => {
      const res = commandInput(['ls', ['-l', '-a']]);
      expect(res).toEqual(['ls', ['-l', '-a']]);
    });

    it('parses array command', () => {
      const res = commandInput(['ls', '-l', '-a']);
      expect(res).toEqual(['ls', ['-l', '-a']]);
    });

    it('throws on invalid input', () => {
      expect(() => commandInput(123 as any)).toThrow();
    });
  });
  describe('getCommandInputWrapper', () => {
    it('wraps input normalization', () => {
      const wrapper = getCommandInputWrapper('git');
      const res = wrapper(['commit', ['-m', 'test']]);
      expect(res).toEqual(['git', ['commit', '-m', 'test']]);
    });
    it('handles input with multiple args', () => {
      const wrapper = getCommandInputWrapper('npx');
      const res = wrapper('eslint . --fix'.split(' '));
      expect(res).toEqual(['npx', ['eslint', '.', '--fix']]);
    });
    it('throws on invalid wrapper command', () => {
      expect(() => getCommandInputWrapper('')).toThrow();
    });
  });
  describe('strOrNum', () => {
    it('returns number when input is a number string', () => {
      expect(strOrNum('123')).toBe(123);
    });
    it('returns number when input is a number', () => {
      expect(strOrNum(123)).toBe(123);
    });
    it('returns string when input is non-number string', () => {
      expect(strOrNum('abc')).toBe('abc');
    });
    it('returns undefined when input is undefined', () => {
      expect(strOrNum(undefined)).toBe(undefined);
    });
    it('returns empty string when input is empty string', () => {
      expect(strOrNum('')).toBe('');
    });
  });
  describe('when', () => {
    it('returns value when condition is true', () => {
      expect(when(true, 'value')).toBe('value');
    });
    it('returns undefined when condition is false', () => {
      expect(when(false, 'value')).toBeUndefined();
    });
    it('returns undefined when condition is null', () => {
      expect(when(null, 'value')).toBeUndefined();
    });
    it('returns undefined when condition is undefined', () => {
      expect(when(undefined, 'value')).toBeUndefined();
    });
    it('calls function and returns its value when condition is true', () => {
      expect(
        when(true, () => {
          return 'computed';
        })
      ).toBe('computed');
    });
  });
  describe('nestWhen', () => {
    it('nests value under key when condition is true', () => {
      expect(nestWhen('key', true, 'value')).toEqual({ key: 'value' });
    });
    it('returns undefined when condition is false', () => {
      expect(nestWhen('key', false, 'value')).toBeUndefined();
    });
    it('returns undefined when condition is null', () => {
      expect(nestWhen('key', null, 'value')).toBeUndefined();
    });
    it('returns undefined when condition is undefined', () => {
      expect(nestWhen('key', undefined, 'value')).toBeUndefined();
    });
    it('calls function and nests its value under key when condition is true', () => {
      expect(
        nestWhen('key', true, () => {
          return 'computed';
        })
      ).toEqual({ key: 'computed' });
    });
    it('returns undefined when condition is a falsy value', () => {
      expect(nestWhen('key', '', 'value')).toBeUndefined();
    });
  });
  describe('objToFlags', () => {
    it('converts object keys to flags', () => {
      const res = objToFlags({
        dryRun: true,
        'force-with-lease': false,
        json: undefined,
        setUpstream: 'origin main',
        tags: true,
        verbose: null
      });
      expect(res).toEqual([
        '--dry-run',
        '--set-upstream',
        'origin main',
        '--tags'
      ]);
    });
    it('uses equals separator when specified', () => {
      const res = objToFlags(
        {
          dryRun: true,
          'force-with-lease': false,
          json: undefined,
          setUpstream: 'origin main',
          tags: true,
          verbose: null
        },
        { sep: 'equals' }
      );
      expect(res).toEqual([
        '--dry-run',
        '--set-upstream=origin main',
        '--tags'
      ]);
    });
    it('handles boolean true/false values correctly', () => {
      const res = objToFlags({
        dryRun: true,
        force: true,
        quiet: false,
        verbose: 2
      });
      expect(res).toEqual(
        expect.arrayContaining(['--dry-run', '--force', '--verbose', '2'])
      );
    });
    it('handles JSON array format', () => {
      const res = objToFlags(
        { exclude: ['test', 'docs'], include: ['src', 'lib'] },
        { arrayFormat: 'json' }
      );
      expect(res).toEqual(
        expect.arrayContaining([
          '--include',
          '["src","lib"]',
          '--exclude',
          '["test","docs"]'
        ])
      );
    });
    it('handles comma array format', () => {
      const res = objToFlags(
        { exclude: ['test', 'docs'], include: ['src', 'lib'] },
        { arrayFormat: 'comma' }
      );
      expect(res).toEqual(
        expect.arrayContaining([
          '--include',
          'src,lib',
          '--exclude',
          'test,docs'
        ])
      );
    });
    it('handles repeat array format with space separator', () => {
      const res = objToFlags(
        { exclude: ['test', 'docs'], include: ['src', 'lib'] },
        { arrayFormat: 'repeat', sep: 'space' }
      );
      expect(res).toEqual(
        expect.arrayContaining([
          '--include',
          'src',
          '--include',
          'lib',
          '--exclude',
          'test',
          '--exclude',
          'docs'
        ])
      );
    });
    it('handles repeat array format with equals separator', () => {
      const res = objToFlags(
        { exclude: ['test', 'docs'], include: ['src', 'lib'] },
        { arrayFormat: 'repeat', sep: 'equals' }
      );
      expect(res).toEqual(
        expect.arrayContaining([
          '--include=src',
          '--include=lib',
          '--exclude=test',
          '--exclude=docs'
        ])
      );
    });
    it('respects local spec over global options', () => {
      const res = objToFlags(
        {
          exclude: ['test', 'docs'],
          include: ['src', 'lib'],
          message: ['one', 'two'],
          verbose: 2
        },
        { arrayFormat: 'comma', sep: 'equals' },
        {
          exclude: { arrayFormat: 'repeat', sep: 'space' },
          message: { arrayFormat: 'repeat', sep: 'equals' }
        }
      );
      expect(res).toEqual(
        expect.arrayContaining([
          '--include=src,lib',
          '--exclude',
          'test',
          '--exclude',
          'docs',
          '--message=one',
          '--message=two',
          '--verbose=2'
        ])
      );
    });
    it('overrides defaults with options', () => {
      const res = objToFlags(
        {
          exclude: ['test', 'docs'],
          include: ['src', 'lib'],
          message: ['one', 'two'],
          verbose: 2
        },
        { arrayFormat: 'repeat', sep: 'equals' }
      );
      expect(res).toEqual(
        expect.arrayContaining([
          '--include=src',
          '--include=lib',
          '--exclude=test',
          '--exclude=docs',
          '--message=one',
          '--message=two',
          '--verbose=2'
        ])
      );
    });
  });
  describe('flagArgs', () => {
    const mockSpec: Record<string, ObjToFlagSpec> = {
      verbose: { arrayFormat: undefined, sep: 'space' },
      dryRun: { arrayFormat: undefined, sep: 'space' },
      date: { arrayFormat: undefined, sep: 'equals' },
      short: { arrayFormat: undefined, sep: 'equals' },
      exclude: { arrayFormat: 'repeat', sep: 'space' },
      glob: { arrayFormat: 'repeat', sep: 'equals' },
      filter: { arrayFormat: 'repeat', sep: 'space' },
      grep: { arrayFormat: 'repeat', sep: 'space' },
      other: { arrayFormat: 'json', sep: 'equals' },
      random: { arrayFormat: 'comma', sep: 'equals' }
    };
    it('normalizes flags and args according to spec', () => {
      const res = flagArgs(
        {
          verbose: true,
          dryRun: false,
          date: 'now',
          short: 5,
          exclude: 'a,b',
          glob: null,
          filter: {},
          unknown: 'x',
          grep: ['t'],
          other: undefined,
          random: ''
        } as any,
        mockSpec
      );
      expect(res).toEqual({
        verbose: true,
        dryRun: false,
        date: 'now',
        short: 5,
        glob: null,
        filter: ['[object Object]'],
        exclude: ['a', 'b'],
        unknown: 'x',
        grep: ['t'],
        other: undefined,
        random: []
      });
    });
  });
});
