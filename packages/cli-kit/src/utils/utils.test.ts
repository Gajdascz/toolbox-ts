import {
  execa,
  ExecaError,
  execaSync,
  ExecaSyncError,
  parseCommandString
} from 'execa';
import { describe, expect, it, vi } from 'vitest';

import * as utils from './utils.js';

const mockExeca = vi.mocked(execa);
const mockExecaSync = vi.mocked(execaSync);
vi.mocked(parseCommandString).mockImplementation((cmd: string) =>
  cmd.split(' ')
);

describe('utils', () => {
  describe('resolveError', () => {
    it('handles ExecaError', () => {
      const err = new ExecaError();
      const res = utils.resolveError(err);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toBeTypeOf('string');
    });

    it('handles ExecaSyncError', () => {
      const err = new ExecaSyncError();
      const res = utils.resolveError(err);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toBeTypeOf('string');
    });

    it('handles generic Error', () => {
      const err = new Error('generic');
      const res = utils.resolveError(err);
      expect(res).toBe(err);
    });

    it('handles unknown error', () => {
      const res = utils.resolveError('fail');
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toMatch(/Unknown Error: fail/);
    });
  });

  describe('kebabKeyToFlagEntry', () => {
    it('maps kebab keys to camel keys and flag values', () => {
      const keys = ['foo-bar', 'baz-qux'] as const;
      const map = keys.map(utils.kebabToFlagEntry);
      expect(map).toEqual([
        ['fooBar', '--foo-bar'],
        ['bazQux', '--baz-qux']
      ]);
    });
  });
  describe('toFlag', () => {
    it('converts string to flag', () => {
      const res = utils.toFlag('foo-bar');
      expect(res).toEqual('--foo-bar');
      const res2 = utils.toFlag('bazQux');
      expect(res2).toEqual('--baz-qux');
    });
    it('throws on invalid input', () => {
      expect(() => utils.toFlag(123 as any)).toThrow();
    });
  });

  describe('normalizeInput', () => {
    it('parses string command', () => {
      const res = utils.normalizeInput('echo hi');
      expect(res).toEqual(['echo', ['hi']]);
    });

    it('parses tuple command', () => {
      const res = utils.normalizeInput(['ls', ['-l', '-a']]);
      expect(res).toEqual(['ls', ['-l', '-a']]);
    });

    it('parses array command', () => {
      const res = utils.normalizeInput(['ls', '-l', '-a']);
      expect(res).toEqual(['ls', ['-l', '-a']]);
    });

    it('throws on invalid input', () => {
      expect(() => utils.normalizeInput(123 as any)).toThrow();
    });
  });

  describe('getNormalizeInputWrapper', () => {
    it('wraps input normalization', () => {
      const wrapper = utils.getNormalizeInputWrapper('git');
      const res = wrapper(['commit', ['-m', 'test']]);
      expect(res).toEqual(['git', ['commit', '-m', 'test']]);
    });
    it('handles input with multiple args', () => {
      const wrapper = utils.getNormalizeInputWrapper('npx');
      const res = wrapper('eslint . --fix'.split(' '));
      expect(res).toEqual(['npx', ['eslint', '.', '--fix']]);
    });
    it('throws on invalid wrapper command', () => {
      expect(() => utils.getNormalizeInputWrapper('')).toThrow();
    });
  });

  describe('spawn', () => {
    it('calls execa with normalized input', () => {
      mockExeca.mockReturnValue('spawned' as any);
      const res = utils.spawn('echo hi');
      expect(mockExeca).toHaveBeenCalledWith('echo', ['hi'], undefined);
      expect(res).toBe('spawned');
    });
  });

  describe('spawnSync', () => {
    it('calls execaSync with normalized input', () => {
      mockExecaSync.mockReturnValue('spawnedSync' as any);
      const res = utils.spawnSync('echo hi');
      expect(mockExecaSync).toHaveBeenCalledWith('echo', ['hi'], undefined);
      expect(res).toBe('spawnedSync');
    });
  });

  describe('chain', () => {
    it('chains multiple commands', async () => {
      const mockPipe = vi.fn();
      const proc = { pipe: mockPipe };
      mockExeca.mockReturnValue(proc as any);
      mockPipe.mockResolvedValue({ stdout: 'done' });

      const res = await utils.chain(['echo hi', 'grep h']);
      expect(mockExeca).toHaveBeenCalledWith(
        'echo',
        ['hi'],
        expect.objectContaining({ stdio: 'pipe' })
      );
      expect(mockPipe).toHaveBeenCalledWith(
        'grep',
        ['h'],
        expect.objectContaining({ stdio: 'pipe' })
      );
      expect(res).toEqual({ stdout: 'done' });
    });

    it('returns result for single command', async () => {
      mockExeca.mockReturnValue(Promise.resolve({ stdout: 'single' }) as any);
      const res = await utils.chain(['echo hi']);
      expect(mockExeca).toHaveBeenCalledWith(
        'echo',
        ['hi'],
        expect.objectContaining({ stdio: 'pipe' })
      );
      expect(res).toEqual({ stdout: 'single' });
    });
  });
  describe('flagMeta', () => {
    it('capitalizes the first letter of the description', () => {
      const desc = 'some description';
      const result = utils.flagMeta('flag', desc);
      expect(result.description.charAt(0)).toBe('S');
    });
    it('adds period to description if no punctuation', () => {
      const desc = 'some description';
      const result = utils.flagMeta('flag', desc);
      expect(result.description.endsWith('.')).toBe(true);
      const desc2 = 'some description!';
      const result2 = utils.flagMeta('flag', desc2);
      expect(result2.description.endsWith('!')).toBe(true);
      const desc3 = 'some description?';
      const result3 = utils.flagMeta('flag', desc3);
      expect(result3.description.endsWith('?')).toBe(true);
      const desc4 = 'some description.';
      const result4 = utils.flagMeta('flag', desc4);
      expect(result4.description.endsWith('.')).toBe(true);
    });
    it('converts camelCase name to kebab-case alias', () => {
      const result = utils.flagMeta('someFlagName', 'desc');
      result.aliases.includes('some-flag-name');
      expect(result.name).toBe('someFlagName');
    });
    it('adds comma separated note when acceptsCommaSeparated is true', () => {
      const result = utils.flagMeta('flag', 'desc', {
        acceptsCommaSeparated: true
      });
      expect(result.description).toMatch(/comma-separated/);
    });
  });
  describe('strOrNum', () => {
    it('returns number when input is a number string', () => {
      expect(utils.strOrNum('123')).toBe(123);
    });
    it('returns number when input is a number', () => {
      expect(utils.strOrNum(123)).toBe(123);
    });
    it('returns string when input is non-number string', () => {
      expect(utils.strOrNum('abc')).toBe('abc');
    });
    it('returns undefined when input is undefined', () => {
      expect(utils.strOrNum(undefined)).toBe(undefined);
    });
  });
  describe('when', () => {
    it('returns value when condition is true', () => {
      expect(utils.when(true, 'value')).toBe('value');
    });
    it('returns undefined when condition is false', () => {
      expect(utils.when(false, 'value')).toBeUndefined();
    });
    it('returns undefined when condition is null', () => {
      expect(utils.when(null, 'value')).toBeUndefined();
    });
    it('returns undefined when condition is undefined', () => {
      expect(utils.when(undefined, 'value')).toBeUndefined();
    });
    it('calls function and returns its value when condition is true', () => {
      expect(
        utils.when(true, () => {
          return 'computed';
        })
      ).toBe('computed');
    });
  });
  describe('nestWhen', () => {
    it('nests value under key when condition is true', () => {
      expect(utils.nestWhen('key', true, 'value')).toEqual({ key: 'value' });
    });
    it('returns undefined when condition is false', () => {
      expect(utils.nestWhen('key', false, 'value')).toBeUndefined();
    });
    it('returns undefined when condition is null', () => {
      expect(utils.nestWhen('key', null, 'value')).toBeUndefined();
    });
    it('returns undefined when condition is undefined', () => {
      expect(utils.nestWhen('key', undefined, 'value')).toBeUndefined();
    });
    it('calls function and nests its value under key when condition is true', () => {
      expect(
        utils.nestWhen('key', true, () => {
          return 'computed';
        })
      ).toEqual({ key: 'computed' });
    });
    it('returns undefined when condition is a falsy value', () => {
      expect(utils.nestWhen('key', '', 'value')).toBeUndefined();
    });
  });
});
