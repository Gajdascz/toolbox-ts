import { expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';

import { tryPatchFile, tryPatchFileSync } from './patch.js';
import { ReadFileError } from '../read/read.ts';
import { runSyncAsync } from '@toolbox-ts/test-utils';

const CWD = '/test/mock';
const TMP = path.join(CWD, '.tmp-write-test');
vi.stubGlobal('process', { ...process, cwd: () => CWD });
vi.spyOn(process, 'cwd').mockReturnValue(CWD);

const file = async (name: string, data?: string) => {
  const p = path.join(TMP, name);
  if (data) await fs.promises.writeFile(p, data);
  return p;
};

beforeEach(async () => {
  await fs.promises.mkdir(CWD, { recursive: true });
  await fs.promises.rm(TMP, { recursive: true, force: true });
  await fs.promises.mkdir(TMP, { recursive: true });
});
afterEach(async () => {
  await fs.promises.rm(TMP, { recursive: true, force: true });
});

runSyncAsync('File.tryPatchFile()', { sync: tryPatchFileSync, async: tryPatchFile }, [
  {
    itShould: 'patch an existing file',
    case: async () => ({
      fnArgs: [await file('a.txt', 'hello'), (d: string) => `${d}-patched`] as const,
      assertion: 'toMatchObject',
      expected: {
        ok: true,
        detail: { action: 'patched', data: { prePatch: 'hello', postPatch: 'hello-patched' } }
      }
    })
  },
  {
    itShould: 'use custom parser',
    case: async () => {
      const filePath = await file('b.json', '{"x":1}');
      const parser = vi.fn((d: string) => JSON.parse(d));
      return {
        fnArgs: [
          filePath,
          (d: { x: number } | null) => (d ? { x: d.x + 1 } : { x: 1 }),
          { parser }
        ] as const,
        assertion: 'toMatchObject',
        expected: {
          ok: true,
          detail: { action: 'patched', data: { prePatch: { x: 1 }, postPatch: { x: 2 } } }
        },
        after: () => expect(parser).toHaveBeenCalledWith('{"x":1}')
      };
    }
  },
  {
    itShould: 'use custom reader that returns OperationResult',
    case: async () => {
      const filePath = await file('c.txt', 'data');
      const reader = vi.fn((p: string): { ok: true; detail: string } => ({
        ok: true,
        detail: fs.readFileSync(p, 'utf8')
      }));
      return {
        fnArgs: [filePath, (d: string) => `${d}-modified`, { reader }] as const,
        assertion: 'toMatchObject',
        expected: {
          ok: true,
          detail: { action: 'patched', data: { prePatch: 'data', postPatch: 'data-modified' } }
        },
        after: () => expect(reader).toHaveBeenCalledWith(filePath)
      };
    }
  },
  {
    itShould: 'use custom reader that returns string',
    case: async () => {
      const filePath = await file('d.txt', 'info');
      const reader = (p: string): string => fs.readFileSync(p, 'utf8');
      return {
        fnArgs: [filePath, (d: string) => `${d}-updated`, { reader }] as const,
        assertion: 'toMatchObject',
        expected: {
          ok: true,
          detail: { action: 'patched', data: { prePatch: 'info', postPatch: 'info-updated' } }
        }
      };
    }
  },
  {
    itShould: 'fail when reader returns error result',
    case: async () => {
      const filePath = await file('e.txt', 'content');
      const reader = (_: string): { ok: false; error: ReadFileError } => ({
        ok: false,
        error: new ReadFileError(filePath, 'Read error')
      });
      return {
        fnArgs: [filePath, (d: string) => `${d}-changed`, { reader }] as const,
        assertion: 'toMatchObject',
        expected: { ok: false }
      };
    }
  },
  {
    itShould: 'skip when file is missing',
    case: async () => ({
      fnArgs: [path.join(TMP, 'missing.txt'), (d: string) => d, { onMissingFile: 'skip' }] as const,
      assertion: 'toMatchObject',
      expected: { ok: true, detail: { action: 'skipped', data: null } }
    })
  },
  {
    itShould: 'abort when file is missing',
    case: async () => ({
      fnArgs: [
        path.join(TMP, 'missing.txt'),
        (d: string) => d,
        { onMissingFile: 'abort' }
      ] as const,
      assertion: 'toMatchObject',
      expected: { ok: false }
    })
  },
  {
    itShould: 'create file with defaultData when missing',
    case: async () => ({
      fnArgs: [
        path.join(TMP, 'new.txt'),
        (d: string) => `${d}-x`,
        { onMissingFile: 'create', defaultData: 'default' }
      ] as const,
      assertion: 'toMatchObject',
      expected: {
        ok: true,
        detail: { action: 'created', data: { prePatch: undefined, postPatch: 'default-x' } }
      }
    })
  },
  {
    itShould: 'create file with defaultData factory when missing',
    case: async () => ({
      fnArgs: [
        path.join(TMP, 'new2.txt'),
        (d: string) => `${d}-x`,
        { onMissingFile: 'create', defaultData: () => 'default' }
      ] as const,
      assertion: 'toMatchObject',
      expected: {
        ok: true,
        detail: { action: 'created', data: { prePatch: undefined, postPatch: 'default-x' } }
      }
    })
  },
  {
    itShould: 'use custom stringify',
    case: async () => {
      const filePath = await file('f.json', '{"a":1}');
      const stringify = vi.fn(JSON.stringify);
      return {
        fnArgs: [
          filePath,
          (d: { a: number }) => ({ a: d.a + 1 }),
          { parser: JSON.parse, stringify }
        ] as const,
        assertion: 'toMatchObject',
        expected: {
          ok: true,
          detail: { action: 'patched', data: { prePatch: { a: 1 }, postPatch: { a: 2 } } }
        },
        after: () => expect(stringify).toHaveBeenCalledWith({ a: 2 })
      };
    }
  },
  {
    itShould: 'fail when write fails',
    case: async () => {
      const filePath = await file('g.txt', 'data');
      return {
        fnArgs: [
          filePath,
          (d: string) => `${d}-x`,
          {
            // stringify is only executed in writeFile, so this will make writeFile fail
            stringify: () => {
              throw new Error('Stringify error');
            }
          }
        ] as const,
        assertion: 'toMatchObject',
        expected: { ok: false }
      };
    }
  }
]);
