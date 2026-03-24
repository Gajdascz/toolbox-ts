import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, vi } from 'vitest';
import {
  hasDirs,
  hasDirsSync,
  hasFiles,
  hasFilesSync,
  isDir,
  isDirSync,
  isFile,
  isFileSync,
  size,
  sizeSync
} from './queries.js';
import { runSyncAsync } from '@toolbox-ts/test-utils';
const CWD = '/test/mock';

vi.stubGlobal('process', { ...process, cwd: () => CWD });
vi.spyOn(process, 'cwd').mockReturnValue(CWD);
const TMP = path.join(process.cwd(), '.tmp-write-test');
const FILE = path.join(TMP, 'file.txt');
beforeEach(async () => {
  await fs.promises.mkdir(TMP, { recursive: true });
  await fs.promises.writeFile(FILE, 'Hello, world!', { encoding: 'utf-8' });
});
afterEach(async () => {
  await fs.promises.rm(TMP, { recursive: true, force: true });
});

runSyncAsync('File.isDir()', { async: isDir, sync: isDirSync }, [
  {
    itShould: 'returns true for directories',
    case: async () => {
      return { fnArgs: [CWD] as const, expected: true };
    }
  },
  {
    itShould: 'returns false for files',
    case: async () => {
      return { fnArgs: [FILE] as const, expected: false };
    }
  },
  {
    itShould: 'returns false for non-existent paths',
    case: async () => {
      return { fnArgs: [FILE] as const, expected: false };
    }
  }
]);
runSyncAsync('File.isFile()', { async: isFile, sync: isFileSync }, [
  {
    itShould: 'returns true for files',
    case: async () => {
      return { fnArgs: [CWD + 'nope.txt'] as const, expected: false };
    }
  },
  {
    itShould: 'returns false for directories',
    case: async () => {
      return { fnArgs: [CWD] as const, expected: false };
    }
  },
  {
    itShould: 'returns false for non-existent paths',
    case: async () => {
      return { fnArgs: [CWD + '/nope/file.txt'] as const, expected: false };
    }
  }
]);
runSyncAsync('File.size()', { async: size, sync: sizeSync }, [
  {
    itShould: 'returns file size in bytes',
    case: async () => {
      return { fnArgs: [FILE] as const, expected: 'Hello, world!'.length };
    }
  },
  {
    itShould: 'return null for non-existent paths',
    case: async () => {
      return { fnArgs: [CWD + '/nope3'] as const, expected: null };
    }
  }
]);
runSyncAsync('File.hasFiles()', { async: hasFiles, sync: hasFilesSync }, [
  {
    itShould: 'return true if all specified files exist in directory',
    case: async () => {
      const dir = CWD + '/dir1';
      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.writeFile(dir + '/file1.txt', 'x');
      await fs.promises.writeFile(dir + '/file2.txt', 'y');
      return { fnArgs: [dir, ['file1.txt', 'file2.txt'] as string[]] as const, expected: true };
    }
  },
  {
    itShould: 'return false if any specified file does not exist in directory',
    case: async () => {
      const dir = CWD + '/dir2';
      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.writeFile(dir + '/file1.txt', 'x');
      return {
        fnArgs: [CWD + '/dir2', ['file1.txt', 'file2.txt'] as string[]] as const,
        expected: false
      };
    }
  }
]);
runSyncAsync('File.hasDirs()', { async: hasDirs, sync: hasDirsSync }, [
  {
    itShould: 'return true if all specified dirs exist in directory',
    case: async () => {
      const dir = CWD + '/dir1';
      await fs.promises.mkdir(dir + '/sub1', { recursive: true });
      await fs.promises.mkdir(dir + '/sub2', { recursive: true });
      return { fnArgs: [dir, ['sub1', 'sub2'] as string[]] as const, expected: true };
    }
  },
  {
    itShould: 'return false if any specified dir does not exist in directory',
    case: async () => {
      const dir = CWD + '/dir2';
      await fs.promises.mkdir(dir + '/sub1', { recursive: true });
      return { fnArgs: [dir, ['sub1', 'sub2'] as string[]] as const, expected: false };
    }
  },
  {
    itShould: 'return false if directory does not exist',
    case: async () => {
      return {
        fnArgs: [CWD + '/nope-dir', ['sub1', 'sub2'] as string[]] as const,
        expected: false
      };
    }
  }
]);
