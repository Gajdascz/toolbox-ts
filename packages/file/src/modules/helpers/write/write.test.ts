import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, expect, vi } from 'vitest';

import { tryWriteFile, tryWriteFileSync } from './write.js';
import { Find } from '../../file-system/find/index.ts';
import { runSyncAsync } from '@toolbox-ts/test-utils';

const CWD = '/test/mock';
vi.stubGlobal('process', { ...process, cwd: () => CWD });
vi.spyOn(process, 'cwd').mockReturnValue(CWD);

const TMP = path.join(process.cwd(), '.tmp-write-test');
const mkFile = async (name: string, data?: string) => {
  const p = path.join(TMP, name);
  if (data) await fs.promises.writeFile(p, data);
  return p;
};
const readFile = (p: string) => fs.readFileSync(p, 'utf8');

beforeEach(async () => {
  await fs.promises.mkdir(CWD, { recursive: true });
  await fs.promises.rm(TMP, { recursive: true, force: true });
  await fs.promises.mkdir(TMP, { recursive: true });
});
afterEach(async () => {
  await fs.promises.rm(TMP, { recursive: true, force: true });
});

runSyncAsync('File.tryWriteFile()', { sync: tryWriteFileSync, async: tryWriteFile }, [
  {
    itShould: 'create a new file',
    case: async () => {
      const f = await mkFile('a.txt');
      return {
        fnArgs: [f, 'hello'] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: { action: 'created', conflict: false, filePath: f } },
        after: () => expect(readFile(f)).toBe('hello')
      };
    }
  },
  {
    itShould: 'create nested directories automatically',
    case: async () => {
      const f = path.join(TMP, 'nested/deep/g.txt');
      return {
        fnArgs: [f, 'deep'] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: { action: 'created', conflict: false, filePath: f } },
        after: () => expect(readFile(f)).toBe('deep')
      };
    }
  },
  {
    itShould: 'use custom stringify when provided',
    case: async () => {
      const f = await mkFile('j.txt');
      const stringify = vi.fn().mockReturnValue('stringified');
      return {
        fnArgs: [f, { a: 1 }, { stringify }] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: { action: 'created' } },
        after: () => {
          expect(stringify).toHaveBeenCalled();
          expect(readFile(f)).toBe('stringified');
        }
      };
    }
  },
  {
    itShould: 'overwrite existing file by default',
    case: async () => {
      const f = await mkFile('c.txt', 'hello');
      return {
        fnArgs: [f, 'world'] as const,
        assertion: 'toMatchObject',
        expected: {
          ok: true,
          detail: { action: 'overwritten', conflict: 'overwrite', filePath: f }
        },
        after: () => expect(readFile(f)).toBe('world')
      };
    }
  },
  {
    itShould: 'overwrite when conflict="overwrite"',
    case: async () => {
      const f = await mkFile('c2.txt', 'hello');
      return {
        fnArgs: [f, 'world', { conflict: 'overwrite' }] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: { action: 'overwritten', conflict: 'overwrite' } },
        after: () => expect(readFile(f)).toBe('world')
      };
    }
  },
  {
    itShould: 'overwrite when handler returns "overwrite"',
    case: async () => {
      const f = await mkFile('d.txt', 'hello');
      return {
        fnArgs: [f, 'world', { conflict: () => 'overwrite' as const }] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: { action: 'overwritten' } },
        after: () => expect(readFile(f)).toBe('world')
      };
    }
  },
  {
    itShould: 'overwrite when handler returns { newData }',
    case: async () => {
      const f = await mkFile('d2.txt', 'hello');
      return {
        fnArgs: [
          f,
          'world',
          {
            conflict: (_fp: string, inputData: string) => ({
              newData: `${readFile(f)}${inputData}`
            })
          }
        ] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: { action: 'overwritten' } },
        after: () => expect(readFile(f)).toBe('helloworld')
      };
    }
  },
  {
    itShould: 'skip when conflict="skip"',
    case: async () => {
      const f = await mkFile('e.txt', 'hello');
      return {
        fnArgs: [f, 'world', { conflict: 'skip' }] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: { action: 'skipped', conflict: 'skip' } },
        after: () => expect(readFile(f)).toBe('hello')
      };
    }
  },
  {
    itShould: 'skip when handler returns "skip"',
    case: async () => {
      const f = await mkFile('e2.txt', 'hello');
      return {
        fnArgs: [f, 'world', { conflict: () => 'skip' as const }] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: { action: 'skipped' } },
        after: () => expect(readFile(f)).toBe('hello')
      };
    }
  },
  {
    itShould: 'abort when conflict="abort"',
    case: async () => {
      const f = await mkFile('f.txt', 'hello');
      return {
        fnArgs: [f, 'world', { conflict: 'abort' }] as const,
        assertion: 'toMatchObject',
        expected: { ok: false },
        after: () => expect(readFile(f)).toBe('hello')
      };
    }
  },
  {
    itShould: 'abort when handler returns "abort"',
    case: async () => {
      const f = await mkFile('f2.txt', 'hello');
      return {
        fnArgs: [f, 'world', { conflict: () => 'abort' as const }] as const,
        assertion: 'toMatchObject',
        expected: { ok: false },
        after: () => expect(readFile(f)).toBe('hello')
      };
    }
  },
  {
    itShould: 'create numbered duplicate when conflict="create"',
    case: async () => {
      const f = await mkFile('a.txt', 'hello');
      return {
        fnArgs: [f, 'world', { conflict: 'create' }] as const,
        assertion: 'toMatchObject',
        expected: {
          ok: true,
          detail: { action: 'created', conflict: 'create', duplicateCount: 1 }
        },
        after: () => expect(readFile(f)).toBe('hello')
      };
    }
  },
  {
    itShould: 'increment counter for multiple duplicates',
    case: async () => {
      const f = await mkFile('b.txt', 'hello');
      await tryWriteFile(f, 'world', { conflict: 'create' });
      return {
        fnArgs: [f, 'again', { conflict: 'create' }] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: { action: 'created', conflict: 'create', duplicateCount: 2 } }
      };
    }
  },
  {
    itShould: 'return error when Find.allAt() returns an error',
    case: async () => {
      vi.spyOn(Find, 'tryAllAt').mockResolvedValueOnce({
        ok: false,
        error: new Error('No files found') as any
      });
      vi.spyOn(Find, 'tryAllAtSync').mockReturnValue({
        ok: false,
        error: new Error('No files found') as any
      });
      const f = await mkFile('a.txt', 'hello');
      return {
        fnArgs: [f, 'world', { conflict: 'create' }] as const,
        expected: { ok: false, error: expect.any(Error) }
      };
    }
  },
  {
    itShould: 'return error when handler is called but no existing files are found',
    case: async () => {
      vi.spyOn(Find, 'tryAllAt').mockResolvedValueOnce({ ok: true, detail: [] });
      vi.spyOn(Find, 'tryAllAtSync').mockReturnValueOnce({ ok: true, detail: [] });
      const f = await mkFile('a.txt', 'hello');
      return {
        expected: { ok: false, error: expect.any(Error) },
        fnArgs: [f, 'world', { conflict: () => 'create' }] as const
      };
    }
  },
  {
    itShould: 'return error when duplicate handler is called but no existing files are found',
    case: async () => {
      vi.spyOn(Find, 'tryAllAt').mockResolvedValueOnce({ ok: true, detail: [] });
      vi.spyOn(Find, 'tryAllAtSync').mockReturnValueOnce({ ok: true, detail: [] });
      const f = await mkFile('a.txt', 'hello');
      return {
        expected: { ok: false, error: expect.any(Error) },
        fnArgs: [f, 'world', { conflict: 'create' }] as const
      };
    }
  }
]);
