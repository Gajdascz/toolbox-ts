import { exec, execSync } from 'node:child_process';
import { promisify } from 'node:util';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { find } from '../find/index.ts';
import * as helpers from '../helpers/helpers.js';
import * as parse from '../parse-json/parse-json.js';
import * as repo from './repo.ts';
vi.mock('../find/index.js', () => ({
  find: {
    lastUp: vi.fn(),
    firstWhen: vi.fn(),
    firstDown: vi.fn(),
    sync: { lastUp: vi.fn(), firstWhen: vi.fn(), firstDown: vi.fn() }
  }
}));

vi.mock('../helpers/helpers.js', () => ({
  hasFiles: vi.fn(),
  hasFilesSync: vi.fn(),
  isFile: vi.fn(),
  isFileSync: vi.fn()
}));

vi.mock('../parse-json/parse-json.js', () => ({
  parseJson: vi.fn(),
  parseJsonSync: vi.fn()
}));

vi.mock('node:child_process', () => ({ exec: vi.fn(), execSync: vi.fn() }));
vi.mock('node:util', async (importActual) => ({
  ...(await importActual<any>()),
  promisify: (fn = vi.fn()) => fn
}));
let execMock, execSyncMock, mockedPromisify, mockFind, mockHelpers, mockParse;

beforeEach(() => {
  vi.clearAllMocks();
  mockFind = vi.mocked(find);
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
      const result = await repo.findRoot.byDirName('repo', '/root/a/b');
      expect(result).toBe('/root/repo');
      expect(mockFind.lastUp).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
      mockFind.firstDown.mockResolvedValue('/root/repo');
      const result2 = await repo.findRoot.byDirName(
        'repo',
        '/root/a/b',
        'down'
      );
      expect(result2).toBe('/root/repo');
      expect(mockFind.firstDown).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
    });
    it('(sync)', () => {
      mockFind.sync.lastUp.mockReturnValue('/root/repo');
      const result = repo.sync.findRoot.byDirName('repo', '/root/a/b');
      expect(result).toBe('/root/repo');
      expect(mockFind.sync.lastUp).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
      mockFind.sync.firstDown.mockReturnValue('/root/repo');
      const result2 = repo.sync.findRoot.byDirName('repo', '/root/a/b', 'down');
      expect(result2).toBe('/root/repo');
      expect(mockFind.sync.firstDown).toHaveBeenCalledWith('repo', {
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
      const result = await repo.findRoot.byFiles(
        ['.git', 'package.json'],
        '/start'
      );
      expect(result).toBe('/repo');
      expect(helpers.hasFiles).toHaveBeenCalledTimes(3);
      expect(mockFind.firstWhen).toHaveBeenCalled();
    });
    it('(sync)', () => {
      mockFind.sync.firstWhen.mockImplementation(
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
      const result = repo.sync.findRoot.byFiles(
        ['.git', 'package.json'],
        '/start'
      );
      expect(result).toBe('/repo');
      expect(helpers.hasFilesSync).toHaveBeenCalledTimes(2);
      expect(mockFind.sync.firstWhen).toHaveBeenCalled();
    });
  });
  describe('byGit returns git toplevel path (trimmed), null on error, and null on falsy result', () => {
    it('(async)', async () => {
      execMock.mockImplementation(() => {
        return { stdout: '/repo' } as any;
      });
      const p = await repo.findRoot.byGit();
      expect(p).toBe('/repo');
      expect(execMock).toHaveBeenCalledWith('git rev-parse --show-toplevel');
      execMock.mockImplementation(() => {
        throw new Error('bad');
      });
      const p2 = await repo.findRoot.byGit();
      expect(p2).toBeNull();
      execMock.mockImplementation(() => {
        return { stdout: '' } as any;
      });
      const p3 = await repo.findRoot.byGit();
      expect(p3).toBeNull();
    });
    it('(sync)', () => {
      execSyncMock.mockReturnValue(Buffer.from('/repo\n'));
      const p = repo.sync.findRoot.byGit();
      expect(p).toBe('/repo');
      expect(execSyncMock).toHaveBeenCalledWith(
        'git rev-parse --show-toplevel'
      );
      execSyncMock.mockImplementation(() => {
        throw new Error('bad');
      });
      const p2 = repo.sync.findRoot.byGit();
      expect(p2).toBeNull();
      execSyncMock.mockReturnValue(Buffer.from('   \n'));
      const p3 = repo.sync.findRoot.byGit();
      expect(p3).toBeNull();
    });
  });
});
describe('isMonorepo', () => {
  describe('(async)', () => {
    it('throws when repo root cannot be determined', async () => {
      mockFind.lastUp.mockResolvedValue(null);
      await expect(
        repo.isMonorepo('repo', { cwd: '/root/a/b' })
      ).rejects.toThrow('cannot determine repo root');
      expect(mockFind.lastUp).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
    });
    it('returns true when package.json has the monorepo property set to true', async () => {
      mockFind.lastUp.mockResolvedValue('/root/repo');
      mockHelpers.isFile.mockResolvedValue(true);
      mockParse.parseJson.mockResolvedValue({ result: { isMonorepo: true } });
      const p = await repo.isMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(true);
      expect(mockFind.lastUp).toHaveBeenCalledWith('repo', {
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
      mockFind.lastUp.mockResolvedValue('/root/repo');
      mockHelpers.isFile.mockResolvedValue(true);
      mockParse.parseJson.mockResolvedValue({ result: { isMonorepo: false } });
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
      mockFind.lastUp.mockResolvedValue('/root/repo');
      mockHelpers.isFile.mockResolvedValue(true);
      mockParse.parseJson.mockResolvedValue({ result: {} });
      const p = await repo.isMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(true);
    });
    it('returns false when package.json does not have the monorepo property and identifier files do not exist', async () => {
      mockFind.lastUp.mockResolvedValue('/root/repo');
      mockHelpers.isFile.mockResolvedValueOnce(true).mockResolvedValue(false);
      mockParse.parseJson.mockResolvedValue({ result: {} });
      const p = await repo.isMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(false);
    });
  });
  describe('(sync)', () => {
    it('throws when repo root cannot be determined', () => {
      mockFind.sync.lastUp.mockReturnValue(null);
      expect(() => repo.sync.isMonorepo('repo', { cwd: '/root/a/b' })).toThrow(
        'cannot determine repo root'
      );
      expect(mockFind.sync.lastUp).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
    });
    it('returns true when package.json has the monorepo property set to true', () => {
      mockFind.sync.lastUp.mockReturnValue('/root/repo');
      mockHelpers.isFileSync.mockReturnValue(true);
      mockParse.parseJsonSync.mockReturnValue({ result: { isMonorepo: true } });
      const p = repo.sync.isMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(true);
      expect(mockFind.sync.lastUp).toHaveBeenCalledWith('repo', {
        startDir: '/root/a/b'
      });
      expect(mockHelpers.isFileSync).toHaveBeenCalledWith(
        '/root/repo/package.json'
      );
      expect(mockParse.parseJsonSync).toHaveBeenCalledWith(
        '/root/repo/package.json'
      );
    });
    it('returns false when package.json has the monorepo property set to false', () => {
      mockFind.sync.lastUp.mockReturnValue('/root/repo');
      mockHelpers.isFileSync.mockReturnValue(true);
      mockParse.parseJsonSync.mockReturnValue({
        result: { isMonorepo: false }
      });
      const p = repo.sync.isMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(false);
    });
    it('throws when package.json does not have the monorepo property and no identifier files are provided', () => {
      mockHelpers.isFileSync.mockReturnValue(true);
      mockParse.parseJsonSync.mockReturnValue({ result: {} });
      expect(() =>
        repo.sync.isMonorepo('repo', { cwd: '/root/a/b', identifierFiles: [] })
      ).toThrow();
    });
    it('returns true when package.json does not have the monorepo property but identifier files exist', () => {
      mockFind.sync.lastUp.mockReturnValue('/root/repo');
      mockHelpers.isFileSync.mockReturnValue(true);
      mockParse.parseJsonSync.mockReturnValue({ result: {} });
      const p = repo.sync.isMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(true);
    });
    it('returns false when package.json does not have the monorepo property and identifier files do not exist', () => {
      mockFind.sync.lastUp.mockReturnValue('/root/repo');
      mockHelpers.isFileSync.mockReturnValueOnce(true).mockReturnValue(false);
      mockParse.parseJsonSync.mockReturnValue({ result: {} });
      const p = repo.sync.isMonorepo('repo', { cwd: '/root/a/b' });
      expect(p).toBe(false);
    });
  });
});
