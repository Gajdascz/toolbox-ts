import { exec, execSync } from 'node:child_process';
import { promisify } from 'node:util';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  findFirstDown,
  findFirstWhen,
  findLastUp,
  syncFindFirstDown,
  syncFindFirstWhen,
  syncFindLastUp
} from '../find/index.js';
import * as helpers from '../helpers/helpers.js';
import * as parse from '../parse-json/parse-json.js';
import * as repo from './repo.ts';
vi.mock('../find/index.js', () => ({
  findLastUp: vi.fn(),
  findFirstWhen: vi.fn(),
  findFirstDown: vi.fn(),
  syncFindLastUp: vi.fn(),
  syncFindFirstWhen: vi.fn(),
  syncFindFirstDown: vi.fn()
}));

vi.mock('../helpers/helpers.js', () => ({
  hasFiles: vi.fn(),
  syncHasFiles: vi.fn(),
  isFile: vi.fn(),
  syncIsFile: vi.fn()
}));

vi.mock('../parse-json/parse-json.js', () => ({
  parseJson: vi.fn(),
  syncParseJson: vi.fn()
}));

vi.mock('node:child_process', () => ({ exec: vi.fn(), execSync: vi.fn() }));
vi.mock('node:util', async (importActual) => ({
  ...(await importActual<any>()),
  promisify: (fn = vi.fn()) => fn
}));
let execMock, execSyncMock, mockedPromisify, mockFind, mockHelpers, mockParse;

beforeEach(() => {
  vi.clearAllMocks();
  mockFind = {
    findLastUp: vi.mocked(findLastUp),
    findFirstWhen: vi.mocked(findFirstWhen),
    findFirstDown: vi.mocked(findFirstDown),
    syncLastUp: vi.mocked(syncFindLastUp),
    syncFindFirstWhen: vi.mocked(syncFindFirstWhen),
    syncFindFirstDown: vi.mocked(syncFindFirstDown)
  };
  mockHelpers = vi.mocked(helpers);
  mockParse = vi.mocked(parse);
  execMock = vi.mocked(exec);
  execSyncMock = vi.mocked(execSync);
  mockedPromisify = vi.mocked(promisify);
});
describe('findRoot', () => {
  describe('byDirName', () => {
    it('(async', async () => {
      mockFind.findLastUp.mockResolvedValue('/root/repo');
      const result = await repo.findRootByDirName('repo', '/root/a/b');
      expect(result).toBe('/root/repo');
      expect(mockFind.findLastUp).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
      mockFind.findFirstDown.mockResolvedValue('/root/repo');
      const result2 = await repo.findRootByDirName('repo', '/root/a/b', 'down');
      expect(result2).toBe('/root/repo');
      expect(mockFind.findFirstDown).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
    });
    it('(sync)', () => {
      mockFind.syncLastUp.mockReturnValue('/root/repo');
      const result = repo.syncFindRootByDirName('repo', '/root/a/b');
      expect(result).toBe('/root/repo');
      expect(mockFind.syncLastUp).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
      mockFind.syncFindFirstDown.mockReturnValue('/root/repo');
      const result2 = repo.syncFindRootByDirName('repo', '/root/a/b', 'down');
      expect(result2).toBe('/root/repo');
      expect(mockFind.syncFindFirstDown).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
    });
  });
  describe('byFiles', () => {
    it('(async)', async () => {
      mockFind.findFirstWhen.mockImplementation(
        async (cb: (dir: string) => Promise<null | string>, _opts: any) => {
          for (const d of ['/x/one', '/x/two', '/repo']) {
            const res = await cb(d);
            if (res) return res;
          }
          return null;
        }
      );
      // First two dirs do not have files, last one does
      mockHelpers.hasFiles.mockImplementation(
        (dir: string, f: string[] = []) => dir === '/repo'
      );
      const result = await repo.findRootByFiles(
        ['.git', 'package.json'],
        '/start'
      );
      expect(result).toBe('/repo');
      expect(helpers.hasFiles).toHaveBeenCalledTimes(3);
      expect(mockFind.findFirstWhen).toHaveBeenCalled();
    });
    it('(sync)', () => {
      mockFind.syncFindFirstWhen.mockImplementation(
        (cb: (dir: string) => null | string, _opts: any) => {
          for (const d of ['/x', '/repo']) {
            const res = cb(d);
            if (res) return res;
          }
          return null;
        }
      );
      mockHelpers.syncHasFiles.mockImplementation(
        (dir: string) => dir === '/repo'
      );
      const result = repo.syncFindRootByFiles(
        ['.git', 'package.json'],
        '/start'
      );
      expect(result).toBe('/repo');
      expect(helpers.syncHasFiles).toHaveBeenCalledTimes(2);
      expect(mockFind.syncFindFirstWhen).toHaveBeenCalled();
    });
  });
  describe('byGit returns git toplevel path (trimmed), null on error, and null on falsy result', () => {
    it('(async)', async () => {
      execMock.mockImplementation(() => {
        return { stdout: '/repo' } as any;
      });
      const p = await repo.findRootByGit();
      expect(p).toBe('/repo');
      expect(execMock).toHaveBeenCalledWith('git rev-parse --show-toplevel');
      execMock.mockImplementation(() => {
        throw new Error('bad');
      });
      const p2 = await repo.findRootByGit();
      expect(p2).toBeNull();
      execMock.mockImplementation(() => {
        return { stdout: '' } as any;
      });
      const p3 = await repo.findRootByGit();
      expect(p3).toBeNull();
    });
    it('(sync)', () => {
      execSyncMock.mockReturnValue(Buffer.from('/repo\n'));
      const p = repo.syncFindRootByGit();
      expect(p).toBe('/repo');
      expect(execSyncMock).toHaveBeenCalledWith(
        'git rev-parse --show-toplevel'
      );
      execSyncMock.mockImplementation(() => {
        throw new Error('bad');
      });
      const p2 = repo.syncFindRootByGit();
      expect(p2).toBeNull();
      execSyncMock.mockReturnValue(Buffer.from('   \n'));
      const p3 = repo.syncFindRootByGit();
      expect(p3).toBeNull();
    });
  });
});
describe('isMonorepo', () => {
  describe('(async)', () => {
    it('throws when repo root cannot be determined', async () => {
      mockFind.findLastUp.mockResolvedValue(null);
      await expect(
        repo.isMonorepo('repo', { cwd: '/root/a/b' })
      ).rejects.toThrow('cannot determine repo root');
      expect(mockFind.findLastUp).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
    });
    it('returns true when package.json has the monorepo property set to true', async () => {
      mockFind.findLastUp.mockResolvedValue('/root/repo');
      mockHelpers.isFile.mockResolvedValue(true);
      mockParse.parseJson.mockResolvedValue({ result: { isMonorepo: true } });
      const p = await repo.isMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(true);
      expect(mockFind.findLastUp).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
      expect(mockHelpers.isFile).toHaveBeenCalledWith(
        '/root/repo/package.json'
      );
      expect(mockParse.parseJson).toHaveBeenCalledWith(
        '/root/repo/package.json'
      );
    });
    it('returns false when package.json has the monorepo property set to false', async () => {
      mockFind.findLastUp.mockResolvedValue('/root/repo');
      mockHelpers.isFile.mockResolvedValue(true);
      mockParse.parseJson.mockResolvedValue({ isMonorepo: false });
      const p = await repo.isMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(false);
    });
    it('throws when package.json does not have the monorepo property and no identifier files are provided', async () => {
      mockHelpers.isFile.mockResolvedValue(true);
      mockParse.parseJson.mockResolvedValue({ result: {} });
      await expect(
        repo.isMonorepo('repo', { cwd: '/root/a/b', identifierFiles: [] })
      ).rejects.toThrow();
    });
    it('returns true when package.json does not have the monorepo property but identifier files exist', async () => {
      mockFind.findLastUp.mockResolvedValue('/root/repo');
      mockHelpers.isFile.mockResolvedValue(true);
      mockParse.parseJson.mockResolvedValue({ result: {} });
      const p = await repo.isMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(true);
    });
    it('returns false when package.json does not have the monorepo property and identifier files do not exist', async () => {
      mockFind.findLastUp.mockResolvedValue('/root/repo');
      mockHelpers.isFile.mockResolvedValueOnce(true).mockResolvedValue(false);
      mockParse.parseJson.mockResolvedValue({ result: {} });
      const p = await repo.isMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(false);
    });
  });
  describe('(sync)', () => {
    it('throws when repo root cannot be determined', () => {
      mockFind.syncLastUp.mockReturnValue(null);
      expect(() => repo.syncIsMonorepo('repo', { cwd: '/root/a/b' })).toThrow(
        'cannot determine repo root'
      );
      expect(mockFind.syncLastUp).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
    });
    it('returns true when package.json has the monorepo property set to true', () => {
      mockFind.syncLastUp.mockReturnValue('/root/repo');
      mockHelpers.syncIsFile.mockReturnValue(true);
      mockParse.syncParseJson.mockReturnValue({ result: { isMonorepo: true } });
      const p = repo.syncIsMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(true);
      expect(mockFind.syncLastUp).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
      expect(mockHelpers.syncIsFile).toHaveBeenCalledWith(
        '/root/repo/package.json'
      );
      expect(mockParse.syncParseJson).toHaveBeenCalledWith(
        '/root/repo/package.json'
      );
    });
    it('returns false when package.json has the monorepo property set to false', () => {
      mockFind.syncLastUp.mockReturnValue('/root/repo');
      mockHelpers.syncIsFile.mockReturnValue(true);
      mockParse.syncParseJson.mockReturnValue({ isMonorepo: false });
      const p = repo.syncIsMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(false);
    });
    it('throws when package.json does not have the monorepo property and no identifier files are provided', () => {
      mockHelpers.syncIsFile.mockReturnValue(true);
      mockParse.syncParseJson.mockReturnValue({ result: {} });
      expect(() =>
        repo.syncIsMonorepo('repo', { cwd: '/root/a/b', identifierFiles: [] })
      ).toThrow();
    });
    it('returns true when package.json does not have the monorepo property but identifier files exist', () => {
      mockFind.syncLastUp.mockReturnValue('/root/repo');
      mockHelpers.syncIsFile.mockReturnValue(true);
      mockParse.syncParseJson.mockReturnValue({ result: {} });
      const p = repo.syncIsMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(true);
    });
    it('returns false when package.json does not have the monorepo property and identifier files do not exist', () => {
      mockFind.syncLastUp.mockReturnValue('/root/repo');
      mockHelpers.syncIsFile.mockReturnValueOnce(true).mockReturnValue(false);
      mockParse.syncParseJson.mockReturnValue({ result: {} });
      const p = repo.syncIsMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(false);
    });
  });
});
