import { tryMk, tryMkSync } from './mk.ts';
import { expect, vi, afterAll } from 'vitest';
import fs from 'node:fs';
import { beforeEach } from 'node:test';
import { runSyncAsync } from '@toolbox-ts/test-utils';

const ROOT = '/root';

vi.stubGlobal('process', { cwd: () => ROOT, chdir: (dir: string) => `${ROOT}/${dir}` });

beforeEach(async () => {
  await fs.promises.mkdir(ROOT, { recursive: true });
});
afterAll(async () => {
  vi.unstubAllGlobals();
});
runSyncAsync('File.Dir.tryMk()', { async: tryMk, sync: tryMkSync }, [
  {
    itShould: 'create a directory',
    case: async () => {
      const dir = 'path/to/dir';
      return { fnArgs: [dir] as const, expected: { ok: true, detail: dir } };
    }
  },
  {
    itShould: 'return an error if the directory cannot be created',
    case: async () => {
      return { fnArgs: [null as any] as const, expected: { ok: false, error: expect.any(Error) } };
    }
  },
  {
    itShould: 'return the directory even if recursive is set to false',
    case: async () => {
      return {
        fnArgs: ['/path', { recursive: false }] as const,
        expected: { ok: true, detail: '/path' }
      };
    }
  }
]);
