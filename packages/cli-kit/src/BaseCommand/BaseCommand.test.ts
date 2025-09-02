import { Command } from '@oclif/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ghActionsAnnotations } from '../reporters/index.ts';
import { Reporter } from '../reporters/types.ts';
import {
  chain,
  getNormalizeInputWrapper,
  resolveError,
  spawn,
  spawnSync
} from '../utils/index.js';
import { BaseCommand } from './BaseCommand.ts';
vi.mock('../utils/index.js', () => ({
  chain: vi.fn(),
  getNormalizeInputWrapper: vi.fn(),
  kebabKeysToFlagMap: vi.fn(),
  normalizeInput: vi.fn(),
  resolveError: vi.fn(),
  spawn: vi.fn(),
  spawnSync: vi.fn()
}));

class TestCommand extends BaseCommand {
  public _chain = this.chain;
  public _exec = this.exec;
  public _execWithStdio = this.execWithStdio;
  public _postExec = this.postExec;
  public _preExec = this.preExec;
  public _string = this.string;
  public _sync = this.sync;
  public _wrap = this.wrap;

  async run() {}
}
let instance;

let mockChain,
  mockGetNormalizeInputWrapper,
  mockResolveError,
  mockSpawn,
  mockSpawnSync;
beforeEach(() => {
  vi.clearAllMocks();
  instance = new TestCommand([], {} as any);
  mockChain = vi.mocked(chain);
  mockSpawn = vi.mocked(spawn);
  mockSpawnSync = vi.mocked(spawnSync);
  mockResolveError = vi.mocked(resolveError);
  mockGetNormalizeInputWrapper = vi.mocked(getNormalizeInputWrapper);
});
describe('BaseCommand', () => {
  it('sets and gets defaultErrorBehavior', () => {
    instance.defaultErrorBehavior = 'throw';
    expect(instance.defaultErrorBehavior).toBe('throw');
    instance.defaultErrorBehavior = 'terminate';
    expect(instance.defaultErrorBehavior).toBe('terminate');
  });

  describe('sync', () => {
    it('exec returns result on success', () => {
      mockSpawnSync.mockReturnValue('ok');
      const res = instance._sync.exec('echo hi');
      expect(res).toBe('ok');
    });
    it('exec throws error on failure with throw', () => {
      const error = new Error('fail');
      mockSpawnSync.mockImplementation(() => {
        throw error;
      });
      mockResolveError.mockReturnValue(error);
      expect(() =>
        instance._sync.exec('echo hi', { onExecFail: 'throw' })
      ).toThrow('fail');
    });
    it('exec calls error on failure with terminate', () => {
      const error = new Error('fail');
      mockSpawnSync.mockImplementation(() => {
        throw error;
      });
      mockResolveError.mockReturnValue(error);
      const errorSpy = vi.spyOn(instance, 'error').mockImplementation((err) => {
        throw err;
      });
      expect(() =>
        instance._sync.exec('echo hi', { onExecFail: 'terminate' })
      ).toThrow('fail');
      expect(errorSpy).toHaveBeenCalledWith(error);
    });
    it('execWithStdio', () => {
      const execSpy = vi
        .spyOn(instance._sync, 'exec')
        .mockReturnValue({ stdio: 'pipe', stdout: 'hi' });
      const res = instance._sync.execWithStdio('echo hi', 'pipe', {
        execaOpts: { foo: 1 }
      });
      expect(execSpy).toHaveBeenCalledWith('echo hi', {
        onExecFail: undefined,
        execaOpts: { foo: 1, stdio: 'pipe' }
      });
      expect(res).toEqual({ stdio: 'pipe', stdout: 'hi' });
    });
    it('string', () => {
      vi.spyOn(instance._sync, 'execWithStdio').mockReturnValue({
        stdout: ' ok '
      });
      const res = instance._sync.string('echo hi');
      expect(res).toBe('ok');
    });
  });
  describe('async', () => {
    describe('chain', () => {
      it('calls preExec, chain, postExec and returns result', async () => {
        const preSpy = vi.spyOn(instance, 'preExec');
        const postSpy = vi.spyOn(instance, 'postExec');
        mockChain.mockResolvedValue('chained');
        const res = await instance._chain(['echo hi']);
        expect(preSpy).toHaveBeenCalled();
        expect(postSpy).toHaveBeenCalled();
        expect(mockChain).toHaveBeenCalledWith(['echo hi'], undefined);
        expect(res).toBe('chained');
      });
      it('throws error if chain fails and onExecFail is throw', async () => {
        const error = new Error('fail');
        mockChain.mockRejectedValue(error);
        mockResolveError.mockReturnValue(error);
        await expect(
          instance._chain(['echo hi'], { onExecFail: 'throw' })
        ).rejects.toThrow('fail');
      });
      it('calls error if chain fails and onExecFail is terminate', async () => {
        mockChain.mockRejectedValue('fail');
        mockResolveError.mockReturnValue(new Error('fail'));
        const errorSpy = vi
          .spyOn(instance, 'error')
          .mockImplementation((err) => {
            throw err;
          });
        await expect(
          instance._chain(['echo hi'], { onExecFail: 'terminate' })
        ).rejects.toThrow('fail');
        expect(errorSpy).toHaveBeenCalled();
      });
      it('always calls postExec', async () => {
        mockChain.mockResolvedValue('chained');
        const postSpy = vi.spyOn(instance, 'postExec');
        await instance._chain(['echo hi']);
        expect(postSpy).toHaveBeenCalled();
        mockChain.mockRejectedValue('fail');
        await expect(instance._chain(['echo hi'])).rejects.toThrow('fail');
        expect(postSpy).toHaveBeenCalledTimes(2);
      });
    });

    it('exec calls preExec, spawn, postExec and returns result', async () => {
      const preSpy = vi.spyOn(instance, 'preExec');
      const postSpy = vi.spyOn(instance, 'postExec');
      mockSpawn.mockResolvedValue('spawned');
      const res = await instance._exec('echo hi');
      expect(preSpy).toHaveBeenCalled();
      expect(postSpy).toHaveBeenCalled();
      expect(mockSpawn).toHaveBeenCalledWith('echo hi', undefined);
      expect(res).toBe('spawned');
    });

    it('exec throws error if spawn fails and onExecFail is throw', async () => {
      const error = new Error('fail');
      mockSpawn.mockRejectedValue(error);
      mockResolveError.mockReturnValue(error);
      await expect(
        instance._exec('echo hi', { onExecFail: 'throw' })
      ).rejects.toThrow('fail');
    });

    it('exec calls error if spawn fails and onExecFail is terminate', async () => {
      mockSpawn.mockRejectedValue('fail');
      mockResolveError.mockReturnValue(new Error('fail'));
      const errorSpy = vi.spyOn(instance, 'error').mockImplementation((err) => {
        throw err;
      });
      await expect(
        instance._exec('echo hi', { onExecFail: 'terminate' })
      ).rejects.toThrow('fail');
      expect(errorSpy).toHaveBeenCalled();
    });

    it('execWithStdio', async () => {
      mockSpawn.mockResolvedValue({ stdio: 'pipe', stdout: 'hi' });
      const execSpy = vi.spyOn(instance, '_exec');
      const res = await instance._execWithStdio('echo hi', 'pipe', {
        execaOpts: { foo: 1 }
      });
      expect(mockSpawn).toHaveBeenCalledWith('echo hi', {
        foo: 1,
        stdio: 'pipe'
      });
      expect(res).toEqual({ stdio: 'pipe', stdout: 'hi' });
    });

    it('string returns trimmed stdout from execWithStdio', async () => {
      mockSpawn.mockResolvedValue({ stdout: ' ok ' });
      const res = await instance._string('echo hi');
      expect(res).toBe('ok');
    });
  });
  describe('wrap', () => {
    it('returns wrapper object with exec, execWithStdio, string, normalizeInput, sync', () => {
      mockGetNormalizeInputWrapper.mockReturnValue((cmd) => [
        'main',
        Array.isArray(cmd) ? cmd : [cmd]
      ]);
      const wrapper = instance._wrap('main');
      expect(wrapper).toHaveProperty('exec');
      expect(wrapper).toHaveProperty('execWithStdio');
      expect(wrapper).toHaveProperty('string');
      expect(wrapper).toHaveProperty('normalizeInput');
      expect(wrapper).toHaveProperty('sync');
    });

    it('exec calls exec with normalized input', async () => {
      mockGetNormalizeInputWrapper.mockReturnValue((cmd) => [
        'main',
        Array.isArray(cmd) ? cmd : [cmd]
      ]);
      mockSpawn.mockResolvedValue('wrapped');
      const wrapper = instance._wrap('main');
      const res = await wrapper.exec('sub arg', { execaOpts: { foo: 1 } });
      expect(mockSpawn).toHaveBeenCalledWith(['main', ['sub arg']], { foo: 1 });
      expect(res).toBe('wrapped');
    });

    it('execWithStdio calls execWithStdio with normalized input', async () => {
      mockGetNormalizeInputWrapper.mockReturnValue((cmd) => [
        'main',
        Array.isArray(cmd) ? cmd : [cmd]
      ]);
      mockSpawn.mockResolvedValue('wrappedStdio');
      const wrapper = instance._wrap('main');
      const res = await wrapper.execWithStdio('sub arg', 'pipe', {
        execaOpts: { foo: 1 }
      });
      expect(mockSpawn).toHaveBeenCalledWith(['main', ['sub arg']], {
        foo: 1,
        stdio: 'pipe'
      });
      expect(res).toBe('wrappedStdio');
    });

    it('string calls string with normalized input', async () => {
      mockGetNormalizeInputWrapper.mockReturnValue((cmd) => [
        'main',
        Array.isArray(cmd) ? cmd : [cmd]
      ]);
      mockSpawn.mockResolvedValue({ stdout: 'wrappedString' });
      const wrapper = instance._wrap('main');
      const res = await wrapper.string('sub arg', { execaOpts: { foo: 1 } });
      expect(mockSpawn).toHaveBeenCalledWith(['main', ['sub arg']], {
        foo: 1,
        stdio: 'pipe'
      });
      expect(res).toBe('wrappedString');
    });

    it('sync.exec calls sync.exec with normalized input', () => {
      mockGetNormalizeInputWrapper.mockReturnValue((cmd) => [
        'main',
        Array.isArray(cmd) ? cmd : [cmd]
      ]);
      const syncExecSpy = vi
        .spyOn(instance._sync, 'exec')
        .mockReturnValue('syncWrapped');
      const wrapper = instance._wrap('main');
      const res = wrapper.sync.exec('sub arg', { execaOpts: { foo: 1 } });
      expect(syncExecSpy).toHaveBeenCalledWith(['main', ['sub arg']], {
        onExecFail: undefined,
        execaOpts: { foo: 1 }
      });
      expect(res).toBe('syncWrapped');
    });

    it('sync.execWithStdio calls sync.execWithStdio with normalized input', () => {
      mockGetNormalizeInputWrapper.mockReturnValue((cmd) => [
        'main',
        Array.isArray(cmd) ? cmd : [cmd]
      ]);
      const syncExecWithStdioSpy = vi
        .spyOn(instance._sync, 'execWithStdio')
        .mockReturnValue('syncWrappedStdio');
      const wrapper = instance._wrap('main');
      const res = wrapper.sync.execWithStdio('sub arg', 'pipe', {
        execaOpts: { foo: 1 }
      });
      expect(syncExecWithStdioSpy).toHaveBeenCalledWith(
        ['main', ['sub arg']],
        'pipe',
        { onExecFail: undefined, execaOpts: { foo: 1 } }
      );
      expect(res).toBe('syncWrappedStdio');
    });

    it('sync.string calls sync.string with normalized input', () => {
      mockGetNormalizeInputWrapper.mockReturnValue((cmd) => [
        'main',
        Array.isArray(cmd) ? cmd : [cmd]
      ]);
      const syncStringSpy = vi
        .spyOn(instance._sync, 'string')
        .mockReturnValue('syncWrappedString');
      const wrapper = instance._wrap('main');
      const res = wrapper.sync.string('sub arg', { execaOpts: { foo: 1 } });
      expect(syncStringSpy).toHaveBeenCalledWith(['main', ['sub arg']], {
        execaOpts: { foo: 1 }
      });
      expect(res).toBe('syncWrappedString');
    });
  });
  describe('postExec/preExec', () => {
    it('returns undefined', () => {
      expect(instance._preExec()).toBeUndefined();
      expect(instance._postExec()).toBeUndefined();
    });
  });

  describe('reporters', () => {
    it('ghActionsAnnotations', () => {
      expect(BaseCommand.reporters.ghActionsAnnotations).toBeInstanceOf(
        Function
      );
      expect(
        (BaseCommand.reporters.ghActionsAnnotations as any)()
      ).toBeInstanceOf(ghActionsAnnotations.Reporter);
    });
  });
});
