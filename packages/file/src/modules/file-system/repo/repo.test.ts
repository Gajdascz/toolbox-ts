import { exec, execSync } from 'node:child_process';
import { promisify } from 'node:util';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as parse from '../../file-types/index.ts';
import * as helpers from '../../helpers/helpers.ts';
import { Find } from '../find/index.ts';
import * as Repo from './repo.ts';
vi.mock('../find/index.js', () => ({
  Find: {
    lastUp: vi.fn(),
    firstWhen: vi.fn(),
    firstDown: vi.fn(),
    lastUpSync: vi.fn(),
    firstWhenSync: vi.fn(),
    firstDownSync: vi.fn()
  }
}));

vi.mock('../helpers/helpers.js', () => ({
  hasFiles: vi.fn(),
  hasFilesSync: vi.fn(),
  isFile: vi.fn(),
  syncIsFile: vi.fn()
}));

vi.mock('../../file-types/index.js', () => ({
  Json: { parseFile: vi.fn(), parseFileSync: vi.fn() }
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
    lastUp: vi.mocked(Find.lastUp),
    firstWhen: vi.mocked(Find.firstWhen),
    firstDown: vi.mocked(Find.firstDown),
    syncLastUp: vi.mocked(Find.lastUpSync),
    firstWhenSync: vi.mocked(Find.firstWhenSync),
    firstDownSync: vi.mocked(Find.firstDownSync)
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
      mockFind.lastUp.mockResolvedValue('/root/repo');
      const result = await Repo.findRootByDirName('repo', '/root/a/b');
      expect(result).toBe('/root/repo');
      expect(mockFind.lastUp).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
      mockFind.firstDown.mockResolvedValue('/root/repo');
      const result2 = await Repo.findRootByDirName('repo', '/root/a/b', 'down');
      expect(result2).toBe('/root/repo');
      expect(mockFind.firstDown).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
    });
    it('(sync)', () => {
      mockFind.syncLastUp.mockReturnValue('/root/repo');
      const result = Repo.findRootByDirNameSync('repo', '/root/a/b');
      expect(result).toBe('/root/repo');
      expect(mockFind.syncLastUp).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
      mockFind.firstDownSync.mockReturnValue('/root/repo');
      const result2 = Repo.findRootByDirNameSync('repo', '/root/a/b', 'down');
      expect(result2).toBe('/root/repo');
      expect(mockFind.firstDownSync).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
    });
  });
  describe('byFiles', () => {
    it('(async)', async () => {
      mockFind.firstWhen.mockImplementation(
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
      const result = await Repo.findRootByFiles(
        ['.git', 'package.json'],
        '/start'
      );
      expect(result).toBe('/repo');
      expect(helpers.hasFiles).toHaveBeenCalledTimes(3);
      expect(mockFind.firstWhen).toHaveBeenCalled();
    });
    it('(sync)', () => {
      mockFind.firstWhenSync.mockImplementation(
        (cb: (dir: string) => null | string, _opts: any) => {
          for (const d of ['/x', '/repo']) {
            const res = cb(d);
            if (res) return res;
          }
          return null;
        }
      );
      mockHelpers.hasFilesSync.mockImplementation(
        (dir: string) => dir === '/repo'
      );
      const result = Repo.findRootByFilesSync(
        ['.git', 'package.json'],
        '/start'
      );
      expect(result).toBe('/repo');
      expect(helpers.hasFilesSync).toHaveBeenCalledTimes(2);
      expect(mockFind.firstWhenSync).toHaveBeenCalled();
    });
  });
  describe('byGit returns git toplevel path (trimmed), null on error, and null on falsy result', () => {
    it('(async)', async () => {
      execMock.mockImplementation(() => {
        return { stdout: '/repo' } as any;
      });
      const p = await Repo.findRootByGit();
      expect(p).toBe('/repo');
      expect(execMock).toHaveBeenCalledWith('git rev-parse --show-toplevel');
      execMock.mockImplementation(() => {
        throw new Error('bad');
      });
      const p2 = await Repo.findRootByGit();
      expect(p2).toBeNull();
      execMock.mockImplementation(() => {
        return { stdout: '' } as any;
      });
      const p3 = await Repo.findRootByGit();
      expect(p3).toBeNull();
    });
    it('(sync)', () => {
      execSyncMock.mockReturnValue(Buffer.from('/repo\n'));
      const p = Repo.findRootByGitSync();
      expect(p).toBe('/repo');
      expect(execSyncMock).toHaveBeenCalledWith(
        'git rev-parse --show-toplevel'
      );
      execSyncMock.mockImplementation(() => {
        throw new Error('bad');
      });
      const p2 = Repo.findRootByGitSync();
      expect(p2).toBeNull();
      execSyncMock.mockReturnValue(Buffer.from('   \n'));
      const p3 = Repo.findRootByGitSync();
      expect(p3).toBeNull();
    });
  });
});
describe('isMonorepo', () => {
  describe('(async)', () => {
    it('throws when repo root cannot be determined', async () => {
      mockFind.lastUp.mockResolvedValue(null);
      await expect(
        Repo.isMonorepo('repo', { cwd: '/root/a/b' })
      ).rejects.toThrow('cannot determine repo root');
      expect(mockFind.lastUp).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
    });
    it('returns true when package.json has the monorepo property set to true', async () => {
      mockFind.lastUp.mockResolvedValue('/root/repo');
      mockHelpers.isFile.mockResolvedValue(true);
      mockParse.Json.parseFile.mockResolvedValue({
        result: { isMonorepo: true }
      });
      const p = await Repo.isMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(true);
      expect(mockFind.lastUp).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
      expect(mockHelpers.isFile).toHaveBeenCalledWith(
        '/root/repo/package.json'
      );
      expect(mockParse.Json.parseFile).toHaveBeenCalledWith(
        '/root/repo/package.json'
      );
    });
    it('returns false when package.json has the monorepo property set to false', async () => {
      mockFind.lastUp.mockResolvedValue('/root/repo');
      mockHelpers.isFile.mockResolvedValue(true);
      mockParse.Json.parseFile.mockResolvedValue({ isMonorepo: false });
      const p = await Repo.isMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(false);
    });
    it('throws when package.json does not have the monorepo property and no identifier files are provided', async () => {
      mockHelpers.isFile.mockResolvedValue(true);
      mockParse.Json.parseFile.mockResolvedValue({ result: {} });
      await expect(
        Repo.isMonorepo('repo', { cwd: '/root/a/b', identifierFiles: [] })
      ).rejects.toThrow();
    });
    it('returns true when package.json does not have the monorepo property but identifier files exist', async () => {
      mockFind.lastUp.mockResolvedValue('/root/repo');
      mockHelpers.isFile.mockResolvedValue(true);
      mockParse.Json.parseFile.mockResolvedValue({ result: {} });
      const p = await Repo.isMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(true);
    });
    it('returns false when package.json does not have the monorepo property and identifier files do not exist', async () => {
      mockFind.lastUp.mockResolvedValue('/root/repo');
      mockHelpers.isFile.mockResolvedValueOnce(true).mockResolvedValue(false);
      mockParse.Json.parseFile.mockResolvedValue({ result: {} });
      const p = await Repo.isMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(false);
    });
  });
  describe('(sync)', () => {
    it('throws when repo root cannot be determined', () => {
      mockFind.syncLastUp.mockReturnValue(null);
      expect(() => Repo.isMonorepoSync('repo', { cwd: '/root/a/b' })).toThrow(
        'cannot determine repo root'
      );
      expect(mockFind.syncLastUp).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
    });
    it('returns true when package.json has the monorepo property set to true', () => {
      mockFind.syncLastUp.mockReturnValue('/root/repo');
      mockHelpers.syncIsFile.mockReturnValue(true);
      mockParse.Json.parseFileSync.mockReturnValue({
        result: { isMonorepo: true }
      });
      const p = Repo.isMonorepoSync('repo', { cwd: '/root/a/b' });
      expect(p).toBe(true);
      expect(mockFind.syncLastUp).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
      expect(mockHelpers.syncIsFile).toHaveBeenCalledWith(
        '/root/repo/package.json'
      );
      expect(mockParse.Json.parseFileSync).toHaveBeenCalledWith(
        '/root/repo/package.json'
      );
    });
    it('returns false when package.json has the monorepo property set to false', () => {
      mockFind.syncLastUp.mockReturnValue('/root/repo');
      mockHelpers.syncIsFile.mockReturnValue(true);
      mockParse.Json.parseFileSync.mockReturnValue({ isMonorepo: false });
      const p = Repo.isMonorepoSync('repo', { cwd: '/root/a/b' });
      expect(p).toBe(false);
    });
    it('throws when package.json does not have the monorepo property and no identifier files are provided', () => {
      mockHelpers.syncIsFile.mockReturnValue(true);
      mockParse.Json.parseFileSync.mockReturnValue({ result: {} });
      expect(() =>
        Repo.isMonorepoSync('repo', { cwd: '/root/a/b', identifierFiles: [] })
      ).toThrow();
    });
    it('returns true when package.json does not have the monorepo property but identifier files exist', () => {
      mockFind.syncLastUp.mockReturnValue('/root/repo');
      mockHelpers.syncIsFile.mockReturnValue(true);
      mockParse.Json.parseFileSync.mockReturnValue({ result: {} });
      const p = Repo.isMonorepoSync('repo', { cwd: '/root/a/b' });
      expect(p).toBe(true);
    });
    it('returns false when package.json does not have the monorepo property and identifier files do not exist', () => {
      mockFind.syncLastUp.mockReturnValue('/root/repo');
      mockHelpers.syncIsFile.mockReturnValueOnce(true).mockReturnValue(false);
      mockParse.Json.parseFileSync.mockReturnValue({ result: {} });
      const p = Repo.isMonorepoSync('repo', { cwd: '/root/a/b' });
      expect(p).toBe(false);
    });
  });
});
