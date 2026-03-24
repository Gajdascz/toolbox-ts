import { tryRm, tryRmSync } from './rm.ts';
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
runSyncAsync('File.Dir.tryRm()', { async: tryRm, sync: tryRmSync }, [
  {
    itShould: 'remove a directory',
    case: async () => {
      const dir = 'root/path/to/dir';
      await fs.promises.mkdir(dir, { recursive: true });
      return { fnArgs: [dir] as const, expected: { ok: true, detail: dir } };
    }
  },
  {
    itShould: 'return an error if the directory does not exist',
    case: async () => {
      const dir = '/root/path/to/nonexistent/dir';
      return { fnArgs: [dir] as const, expected: { ok: false, error: expect.any(Error) } };
    }
  },
  {
    itShould: 'return an error if the directory is not empty',
    case: async () => {
      const dir = 'root/path/to/nonempty/dir';
      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.writeFile(`${dir}/file.txt`, 'Hello, world!');
      return { fnArgs: [dir] as const, expected: { ok: false, error: expect.any(Error) } };
    }
  }
]);
