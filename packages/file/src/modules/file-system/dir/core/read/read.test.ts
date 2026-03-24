import {
  tryRead,
  tryReadDirs,
  tryReadDirsSync,
  tryReadSync,
  tryReadFiles,
  tryReadFilesByExts,
  tryReadFilesByExtsSync,
  tryReadFilesSync
} from './read.ts';
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

runSyncAsync('File.Dir.tryRead()', { async: tryRead, sync: tryReadSync }, [
  {
    itShould: 'read a directory with depth of 1 by default',
    case: async () => {
      const searchDir = '/path/to';
      const dir = `${searchDir}/dir`;
      const f1 = `${searchDir}/file1.txt`;
      const dir2 = `${searchDir}/other-dir`;
      const f2 = `${searchDir}/file2.txt`;
      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.mkdir(dir2, { recursive: true });
      await fs.promises.writeFile(f1, 'Hello, world!');
      await fs.promises.writeFile(f2, 'Hello, world!');

      return {
        fnArgs: [searchDir] as const,
        expected: { ok: true, detail: expect.arrayContaining([f1, dir, dir2, f2]) }
      };
    }
  }
]);
runSyncAsync('File.Dir.tryReadDirs()', { async: tryReadDirs, sync: tryReadDirsSync }, [
  {
    itShould: 'read a directories nested directories only',
    case: async () => {
      const searchDir = '/path/to';
      const dir = `${searchDir}/dir`;
      const dir2 = `${searchDir}/other-dir`;
      const dir3 = `${searchDir}/another-dir`;
      const dir4 = `${searchDir}/yet-another-dir`;
      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.mkdir(dir2, { recursive: true });
      await fs.promises.mkdir(dir3, { recursive: true });
      await fs.promises.mkdir(dir4, { recursive: true });
      return {
        fnArgs: [searchDir] as const,
        expected: { ok: true, detail: expect.arrayContaining([dir, dir2, dir3, dir4]) }
      };
    }
  }
]);
runSyncAsync('File.Dir.tryReadFiles()', { async: tryReadFiles, sync: tryReadFilesSync }, [
  {
    itShould: 'read a directories nested files only',
    case: async () => {
      const searchDir = '/path/to';
      const f1 = `${searchDir}/file1.txt`;
      const f2 = `${searchDir}/file2.txt`;
      const dir = `${searchDir}/dir`;
      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.writeFile(f1, 'Hello, world!');
      await fs.promises.writeFile(f2, 'Hello, world!');

      return {
        fnArgs: [searchDir] as const,
        expected: { ok: true, detail: expect.arrayContaining([f1, f2]) }
      };
    }
  }
]);
runSyncAsync(
  'File.Dir.tryReadFilesByExts()',
  { async: tryReadFilesByExts, sync: tryReadFilesByExtsSync },
  [
    {
      itShould: 'read a directories nested files by exts',
      case: async () => {
        const searchDir = '/path/to';
        const f1 = `${searchDir}/file1.txt`;
        const f2 = `${searchDir}/file2.md`;
        const f3 = `${searchDir}/file3.txt`;
        const dir = `${searchDir}/dir`;
        await fs.promises.mkdir(dir, { recursive: true });
        await fs.promises.writeFile(f1, 'Hello, world!');
        await fs.promises.writeFile(f2, 'Hello, world!');
        await fs.promises.writeFile(f3, 'Hello, world!');
        return {
          fnArgs: [searchDir, ['.txt']] as const satisfies [string, string[]],
          expected: { ok: true, detail: expect.arrayContaining([f1, f3]) }
        };
      }
    },
    {
      itShould: 'normalize exts with or without dot',
      case: async () => {
        const searchDir = '/path/to';
        const f1 = `${searchDir}/file1.txt`;
        const f2 = `${searchDir}/file2.md`;
        const f3 = `${searchDir}/file3.txt`;
        const dir = `${searchDir}/dir`;
        await fs.promises.mkdir(dir, { recursive: true });
        await fs.promises.writeFile(f1, 'Hello, world!');
        await fs.promises.writeFile(f2, 'Hello, world!');
        await fs.promises.writeFile(f3, 'Hello, world!');
        return {
          fnArgs: [searchDir, ['txt']] as const satisfies [string, string[]],
          expected: { ok: true, detail: expect.arrayContaining([f1, f3]) }
        };
      }
    }
  ]
);
