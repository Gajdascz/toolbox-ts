import { expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import { hasFiles, hasFilesSync, isFile, isFileSync } from '../../../queries/index.ts';
import { Find } from '../../../find/index.ts';
import { runSyncAsync } from '@toolbox-ts/test-utils';
import { tryIsMonorepo, tryIsMonorepoSync } from './is-monorepo.ts';
vi.mock('../../../find/index.ts', () => ({
  Find: {
    tryLastUp: vi.fn(),
    tryFirstWhen: vi.fn(),
    tryFirstDown: vi.fn(),
    tryLastUpSync: vi.fn(),
    tryFirstWhenSync: vi.fn(),
    tryFirstDownSync: vi.fn()
  }
}));
vi.mock('../../../queries/index.ts', () => ({
  hasFiles: vi.fn(),
  hasFilesSync: vi.fn(),
  isFile: vi.fn(),
  isFileSync: vi.fn()
}));
vi.mock('node:child_process', () => ({ exec: vi.fn(), execSync: vi.fn() }));
vi.mock('node:util', async (importActual) => ({
  ...(await importActual<any>()),
  promisify: (fn = vi.fn()) => fn
}));

const mockFind = vi.mocked(Find);
const mockQueries = vi.mocked({ hasFiles, hasFilesSync, isFile, isFileSync });

const root = '/repo';
const files = ['.git', 'package.json', 'pnpm-workspace.yaml'];

beforeEach(() => {
  vi.clearAllMocks();
  fs.mkdirSync(root, { recursive: true });
  files.forEach((file) => {
    fs.writeFileSync(`${root}/${file}`, '');
  });
});
afterEach(() => vi.clearAllMocks());
runSyncAsync('File.Repo.tryIsMonorepo()', { async: tryIsMonorepo, sync: tryIsMonorepoSync }, [
  {
    itShould: 'return error when repo root cannot be determined',
    case: () => {
      mockFind.tryLastUp.mockResolvedValue({ ok: true, detail: null } as any);
      mockFind.tryLastUpSync.mockReturnValue({ ok: true, detail: null } as any);
      return {
        fnArgs: ['repo', { cwd: '/root/a/b' }] as const,
        assertion: 'toMatchObject',
        expected: { ok: false, error: expect.any(Error) }
      };
    }
  },
  {
    itShould: 'return true when package.json has isMonorepo true',
    case: () => {
      mockFind.tryLastUp.mockResolvedValue({ ok: true, detail: '/root/repo' } as any);
      mockFind.tryLastUpSync.mockReturnValue({ ok: true, detail: '/root/repo' } as any);
      mockQueries.isFile.mockResolvedValue(true);
      mockQueries.isFileSync.mockReturnValue(true);
      vi.spyOn(fs.promises, 'readFile').mockResolvedValue(JSON.stringify({ isMonorepo: true }));
      vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ isMonorepo: true }));
      return {
        fnArgs: ['repo', { cwd: '/root/a/b' }] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: true }
      };
    }
  },
  {
    itShould: 'return false when package.json has isMonorepo false',
    case: () => {
      mockFind.tryLastUp.mockResolvedValue({ ok: true, detail: '/root/repo' } as any);
      mockFind.tryLastUpSync.mockReturnValue({ ok: true, detail: '/root/repo' } as any);
      mockQueries.isFile.mockResolvedValue(true);
      mockQueries.isFileSync.mockReturnValue(true);
      vi.spyOn(fs.promises, 'readFile').mockResolvedValue(JSON.stringify({ isMonorepo: false }));
      vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ isMonorepo: false }));
      return {
        fnArgs: ['repo', { cwd: '/root/a/b' }] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: false }
      };
    }
  },
  {
    itShould: 'check for identifier files when package.json property is not present',
    case: () => {
      mockFind.tryLastUp.mockResolvedValue({ ok: true, detail: '/root/repo' } as any);
      mockFind.tryLastUpSync.mockReturnValue({ ok: true, detail: '/root/repo' } as any);
      mockQueries.isFile.mockResolvedValueOnce(true);
      mockQueries.isFileSync.mockReturnValue(true);
      vi.spyOn(fs.promises, 'readFile').mockResolvedValue(JSON.stringify({}));
      vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({}));
      return {
        fnArgs: ['repo', { cwd: '/root/a/b' }] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: true }
      };
    }
  },
  {
    itShould: 'return true when identifier files exist',
    case: () => {
      mockFind.tryLastUp.mockResolvedValue({ ok: true, detail: '/root/repo' } as any);
      mockFind.tryLastUpSync.mockReturnValue({ ok: true, detail: '/root/repo' } as any);
      mockQueries.isFile.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      mockQueries.isFileSync.mockReturnValueOnce(false).mockReturnValueOnce(true);
      return {
        fnArgs: ['repo', { cwd: '/root/a/b' }] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: true }
      };
    }
  },
  {
    itShould: 'return false when identifier files do not exist',
    case: () => {
      mockFind.tryLastUp.mockResolvedValue({ ok: true, detail: '/root/repo' } as any);
      mockFind.tryLastUpSync.mockReturnValue({ ok: true, detail: '/root/repo' } as any);
      mockQueries.isFile.mockResolvedValue(false);
      mockQueries.isFileSync.mockReturnValue(false);
      return {
        fnArgs: ['repo', { cwd: '/root/a/b' }] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: false }
      };
    }
  },
  {
    itShould: 'return error when requiredIdentifierFilesCount is 0 and no packageJsonMonorepoProp',
    case: () => {
      mockFind.tryLastUp.mockResolvedValue({ ok: true, detail: '/root/repo' } as any);
      mockFind.tryLastUpSync.mockReturnValue({ ok: true, detail: '/root/repo' } as any);
      mockQueries.isFile.mockResolvedValue(false);
      mockQueries.isFileSync.mockReturnValue(false);
      return {
        fnArgs: [
          'repo',
          { cwd: '/root/a/b', requiredIdentifierFilesCount: 0, identifierFiles: [] }
        ] as const,
        assertion: 'toMatchObject',
        expected: { ok: false, error: expect.any(Error) }
      };
    }
  },
  {
    itShould: 'return error when findRootByDirName fails',
    case: () => {
      mockFind.tryLastUp.mockResolvedValue({ ok: false, error: new Error('fail') } as any);
      mockFind.tryLastUpSync.mockReturnValue({ ok: false, error: new Error('fail') } as any);
      return {
        fnArgs: ['repo', { cwd: '/root/a/b' }] as const,
        assertion: 'toMatchObject',
        expected: { ok: false, error: expect.any(Error) }
      };
    }
  }
]);
