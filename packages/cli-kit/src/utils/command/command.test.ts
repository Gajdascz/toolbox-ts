import { execa, ExecaError, execaSync, ExecaSyncError } from 'execa';
import { describe, expect, it, vi } from 'vitest';

import { chain, resolveError, spawn, spawnSync } from './command.ts';

const mockExeca = vi.mocked(execa);
const mockExecaSync = vi.mocked(execaSync);

describe('cli-kit: Command Utils', () => {
  describe('resolveError', () => {
    it('handles ExecaError', () => {
      const err = new ExecaError();
      const res = resolveError(err);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toBeTypeOf('string');
    });

    it('handles ExecaSyncError', () => {
      const err = new ExecaSyncError();
      const res = resolveError(err);
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toBeTypeOf('string');
    });

    it('handles generic Error', () => {
      const err = new Error('generic');
      const res = resolveError(err);
      expect(res).toBe(err);
    });

    it('handles unknown error', () => {
      const res = resolveError('fail');
      expect(res).toBeInstanceOf(Error);
      expect(res.message).toMatch(/Unknown Error: fail/);
    });
  });
  describe('spawn', () => {
    it('calls execa with normalized input', () => {
      mockExeca.mockReturnValue('spawned' as any);
      const res = spawn('echo hi');
      expect(mockExeca).toHaveBeenCalledWith('echo', ['hi'], undefined);
      expect(res).toBe('spawned');
    });
  });
  describe('spawnSync', () => {
    it('calls execaSync with normalized input', () => {
      mockExecaSync.mockReturnValue('spawnedSync' as any);
      const res = spawnSync('echo hi');
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

      const res = await chain(['echo hi', 'grep h']);
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
      const res = await chain(['echo hi']);
      expect(mockExeca).toHaveBeenCalledWith(
        'echo',
        ['hi'],
        expect.objectContaining({ stdio: 'pipe' })
      );
      expect(res).toEqual({ stdout: 'single' });
    });
  });
});
