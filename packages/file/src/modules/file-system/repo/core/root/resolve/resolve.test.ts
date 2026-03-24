import { expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import { runSyncAsync } from '@toolbox-ts/test-utils';
import { resolveRoot, resolveRootSync, tryResolveRoot, tryResolveRootSync } from './resolve.ts';
import {
  findRootByGit,
  findRootByGitSync,
  tryFindRootByGit,
  tryFindRootByGitSync
} from '../find-by-git/index.ts';
vi.mock('../find-by-git/index.ts', () => ({
  tryFindRootByGit: vi.fn(),
  findRootByGit: vi.fn(),
  tryFindRootByGitSync: vi.fn(),
  findRootByGitSync: vi.fn()
}));
vi.mock('node:child_process', () => ({ exec: vi.fn(), execSync: vi.fn() }));
vi.mock('node:util', async (importActual) => ({
  ...(await importActual<any>()),
  promisify: (fn = vi.fn()) => fn
}));

const root = '/repo';
const files = ['.git', 'package.json', 'pnpm-workspace.yaml'];

const mockedTryFindRootByGit = vi.mocked(tryFindRootByGit);
const mockedTryFindRootByGitSync = vi.mocked(tryFindRootByGitSync);

beforeEach(() => {
  vi.clearAllMocks();
  fs.mkdirSync(root, { recursive: true });
  files.forEach((file) => {
    fs.writeFileSync(`${root}/${file}`, '');
  });
});
afterEach(() => vi.clearAllMocks());
runSyncAsync('File.Repo.tryResolveRoot()', { async: tryResolveRoot, sync: tryResolveRootSync }, [
  {
    itShould: 'use findByGit by default',
    case: async () => {
      const expected = { ok: true, detail: '/repo' } as const;
      mockedTryFindRootByGit.mockResolvedValueOnce(expected);
      mockedTryFindRootByGitSync.mockReturnValueOnce(expected);
      return {
        fnArgs: [] as const,
        expected,
        after: () => {
          expect(mockedTryFindRootByGit).toHaveBeenCalled();
          expect(mockedTryFindRootByGitSync).toHaveBeenCalled();
        }
      };
    }
  },
  {
    itShould: 'uses custom finder when provided',
    case: async () => {
      const expected = { ok: true, detail: '/repo' } as const;
      const finder = vi.fn(() => expected);
      return {
        fnArgs: [undefined, finder] as const,
        expected,
        after: () => {
          expect(finder).toHaveBeenCalled();
        }
      };
    }
  },
  {
    itShould: 'return provided root if defined',
    case: async () => {
      const expected = { ok: true, detail: '/repo' } as const;
      const finder = vi.fn(() => expected);
      return {
        fnArgs: ['root', finder] as const,
        expected: { ok: true, detail: 'root' },
        after: () => {
          expect(mockedTryFindRootByGit).not.toHaveBeenCalled();
        }
      };
    }
  }
]);

const mockedFindRootByGit = vi.mocked(findRootByGit);
const mockedFindRootByGitSync = vi.mocked(findRootByGitSync);

runSyncAsync('File.Repo.resolveRoot()', { async: resolveRoot, sync: resolveRootSync }, [
  {
    itShould: 'use findByGit by default',
    case: async () => {
      const expected = '/repo';
      mockedFindRootByGit.mockResolvedValueOnce(expected);
      mockedFindRootByGitSync.mockReturnValueOnce(expected);
      return {
        fnArgs: [] as const,
        expected,
        after: () => {
          expect(mockedFindRootByGit).toHaveBeenCalled();
          expect(mockedFindRootByGitSync).toHaveBeenCalled();
        }
      };
    }
  },
  {
    itShould: 'handle operation result result from finder',
    case: async () => {
      const expected = '/repo';
      const finder = vi.fn(() => ({ ok: true, detail: expected }) as const);
      return {
        fnArgs: [undefined, finder] as const,
        expected,
        after: () => {
          expect(finder).toHaveBeenCalled();
        }
      };
    }
  },
  {
    itShould: 'return provided root if defined',
    case: async () => {
      const expected = '/repo';
      const finder = vi.fn(() => expected);
      return {
        fnArgs: ['root', finder] as const,
        expected: 'root',
        after: () => {
          expect(mockedFindRootByGit).not.toHaveBeenCalled();
        }
      };
    }
  }
]);
