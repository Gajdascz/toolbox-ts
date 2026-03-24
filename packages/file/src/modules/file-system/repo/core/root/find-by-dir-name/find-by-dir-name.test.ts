import { expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import { Find } from '../../../../find/index.js';
import { runSyncAsync } from '@toolbox-ts/test-utils';
import { tryFindRootByDirName, tryFindRootByDirNameSync } from './find-by-dir-name.ts';

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

vi.mock('node:child_process', () => ({ exec: vi.fn(), execSync: vi.fn() }));
vi.mock('node:util', async (importActual) => ({
  ...(await importActual<any>()),
  promisify: (fn = vi.fn()) => fn
}));

const mockFind = vi.mocked(Find);
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
  'File.Repo.tryFindRootByDirName()',
  { async: tryFindRootByDirName, sync: tryFindRootByDirNameSync },
  [
    {
      itShould: 'call lastUp for up direction',
      case: () => {
        mockFind.tryLastUp.mockResolvedValue({ ok: true, detail: '/root/repo' } as any);
        mockFind.tryLastUpSync.mockReturnValue({ ok: true, detail: '/root/repo' } as any);
        return {
          fnArgs: ['repo', '/root/a/b', 'up'] as const,
          assertion: 'toMatchObject',
          expected: { ok: true, detail: '/root/repo' },
          after: () => {
            const calls =
              mockFind.tryLastUp.mock.calls.length + mockFind.tryLastUpSync.mock.calls.length;
            expect(calls).toBe(1);
          }
        };
      }
    },
    {
      itShould: 'call firstDown for down direction',
      case: () => {
        mockFind.tryFirstDown.mockResolvedValue({ ok: true, detail: '/root/repo' } as any);
        mockFind.tryFirstDownSync.mockReturnValue({ ok: true, detail: '/root/repo' } as any);
        return {
          fnArgs: ['repo', '/root/a/b', 'down'] as const,
          assertion: 'toMatchObject',
          expected: { ok: true, detail: '/root/repo' },
          after: () => {
            const calls =
              mockFind.tryFirstDown.mock.calls.length + mockFind.tryFirstDownSync.mock.calls.length;
            expect(calls).toBe(1);
          }
        };
      }
    }
  ]
);
