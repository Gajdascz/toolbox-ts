import { exec, execSync } from 'node:child_process';
import { expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import { runSyncAsync } from '@toolbox-ts/test-utils';
import { tryFindRootByGit, tryFindRootByGitSync } from './find-by-git.ts';

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
vi.mock('../queries/index.js', () => ({
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

const execMock = vi.mocked(exec);
const execSyncMock = vi.mocked(execSync);
const root = '/repo';
const files = ['.git', 'package.json', 'pnpm-workspace.yaml'];
const cmd = 'git rev-parse --show-toplevel';
beforeEach(() => {
  vi.clearAllMocks();
  fs.mkdirSync(root, { recursive: true });
  files.forEach((file) => {
    fs.writeFileSync(`${root}/${file}`, '');
  });
});
afterEach(() => vi.clearAllMocks());

runSyncAsync(
  'File.Repo.tryFindRootByGit()',
  { async: tryFindRootByGit, sync: tryFindRootByGitSync },
  [
    {
      itShould: 'return repo root on success',
      case: async () => {
        execMock.mockResolvedValue({ stdout: '/repo\n' } as any);
        execSyncMock.mockReturnValue(Buffer.from('/repo\n'));
        return {
          fnArgs: [] as const,
          expected: { ok: true, detail: '/repo' },
          after: () => {
            expect(execMock).toHaveBeenCalledWith(cmd);
            expect(execSyncMock).toHaveBeenCalledWith(cmd);
          }
        };
      }
    },
    {
      itShould: 'return error on exec failure',
      case: async () => {
        execMock.mockRejectedValue(new Error('fail'));
        execSyncMock.mockImplementation(() => {
          throw new Error('fail');
        });
        return {
          fnArgs: [] as const,
          assertion: 'toMatchObject',
          expected: { ok: false, error: expect.any(Error) },
          after: () => {
            expect(execMock).toHaveBeenCalledWith(cmd);
            expect(execSyncMock).toHaveBeenCalledWith(cmd);
          }
        };
      }
    }
  ]
);
