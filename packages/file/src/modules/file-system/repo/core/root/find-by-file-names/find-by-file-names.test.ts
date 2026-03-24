import { expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import { hasFiles, hasFilesSync, isFile, isFileSync } from '../../../../queries/index.js';
import { Find } from '../../../../find/index.js';
import { runSyncAsync } from '@toolbox-ts/test-utils';
import { tryFindRootByFileNames, tryFindRootByFileNamesSync } from './find-by-file-names.ts';
vi.mock('../../../../find/index.js', () => ({
  Find: {
    tryLastUp: vi.fn(),
    tryFirstWhen: vi.fn(),
    tryFirstDown: vi.fn(),
    tryLastUpSync: vi.fn(),
    tryFirstWhenSync: vi.fn(),
    tryFirstDownSync: vi.fn()
  }
}));
vi.mock('../../../../queries/index.js', () => ({
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

runSyncAsync(
  'File.Repo.tryFindRootByFileNames()',
  { async: tryFindRootByFileNames, sync: tryFindRootByFileNamesSync },
  [
    {
      itShould: 'return the first dir with all files',
      case: async () => {
        mockQueries.hasFiles.mockImplementation(async (dir, files) => {
          return files.every((file) => files.includes(file));
        });
        mockQueries.hasFilesSync.mockImplementation((dir, files) => {
          return files.every((file) => files.includes(file));
        });
        mockFind.tryFirstWhen.mockImplementation(
          async (cb: (dir: string) => Promise<null | string>, _opts: any) => {
            const res = await cb(root);
            if (res) return { ok: true, detail: res };
            return { ok: true, detail: null };
          }
        );
        mockFind.tryFirstWhenSync.mockImplementation(
          (cb: (dir: string) => null | string, _opts: any) => {
            const res = cb(root);
            if (res) return { ok: true, detail: res };
            return { ok: true, detail: null };
          }
        );
        return {
          fnArgs: [['.git', 'package.json'] as string[], root] as const,
          expected: { ok: true, detail: '/repo' },
          after: () => {
            const calls =
              mockQueries.hasFiles.mock.calls.length + mockQueries.hasFilesSync.mock.calls.length;
            expect(calls).toBe(3);
          }
        };
      }
    },
    {
      itShould: 'return null if no dir has all files',
      case: async () => {
        mockQueries.hasFiles.mockResolvedValue(false);
        mockQueries.hasFilesSync.mockReturnValue(false);
        return {
          fnArgs: [['.git', 'package.json'] as string[], root] as const,
          expected: { ok: true, detail: null }
        };
      }
    }
  ]
);
