import { tryCh, tryChSync } from './ch.ts';
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
runSyncAsync('File.Dir.tryCh()', { async: tryCh, sync: tryChSync }, [
  {
    itShould: 'change to the specified existing directory',
    case: async () => {
      const dir = 'path/to/dir';
      await fs.promises.mkdir(dir, { recursive: true });
      return {
        fnArgs: [dir, { mkdir: false }] as const,
        expected: { ok: true, detail: { fromDir: ROOT, toDir: dir, madeDir: false } }
      };
    }
  },
  {
    itShould: 'change to the specified directory, creating it if necessary',
    case: async () => {
      const dir = 'path/to/dir';
      return {
        fnArgs: [dir, { mkdir: true }] as const,
        expected: { ok: true, detail: { fromDir: ROOT, toDir: dir, madeDir: true } }
      };
    }
  },
  {
    itShould: 'pass through mkdir options to fs.mkdir when creating a directory',
    case: async () => {
      const dir = 'path/to/dir';
      const mkdirOptions = { recursive: true, mode: 0o755 };
      const mkdirSpy = vi.spyOn(fs.promises, 'mkdir');
      return {
        fnArgs: [dir, { mkdir: mkdirOptions }] as const,
        expected: { ok: true, detail: { fromDir: ROOT, toDir: dir, madeDir: true } },
        after: () => expect(mkdirSpy).toHaveBeenCalledWith(dir, mkdirOptions)
      };
    }
  },
  {
    itShould: 'return an error if mkdir is false and the directory does not exist',
    case: async () => {
      const dir = 'path/to/nonexistent/dir';
      vi.spyOn(process, 'chdir').mockImplementation(() => {
        throw new Error('Directory does not exist');
      });
      return {
        fnArgs: [dir, { mkdir: false }] as const,
        expected: { ok: false, error: expect.any(Error) }
      };
    }
  }
]);
