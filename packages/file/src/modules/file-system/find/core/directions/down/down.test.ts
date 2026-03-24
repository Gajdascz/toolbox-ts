import fs from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeEach, expect, vi } from 'vitest';
import { runSyncAsync } from '@toolbox-ts/test-utils';
import {
  tryAllDown,
  tryAllDownSync,
  tryFirstDown,
  tryFirstDownSync,
  tryLastDown,
  tryLastDownSync
} from './down.ts';

const ROOT = '/root';

const FN1 = 'file1.txt';
const FN2 = 'file2.txt';
const FN3 = 'file3.log';
const FN4 = 'file4.txt';

const D1 = 'l1';
const D2 = 'l2';
const D3 = 'l3';
const D4 = 'l4';

const L1 = path.join(ROOT, D1);
const L2 = path.join(L1, D2);
const L3 = path.join(L2, D3);
const L4 = path.join(L3, D4);
const F1 = path.join(L1, FN1);
const F2 = path.join(L2, FN2);
const F3 = path.join(L3, FN3);
const F4 = path.join(L4, FN4);
vi.stubGlobal('process', { cwd: () => ROOT });

beforeEach(async () => {
  await fs.mkdir(L4, { recursive: true });
  await Promise.all([
    fs.writeFile(F1, '1'),
    fs.writeFile(F2, '2'),
    fs.writeFile(F3, '3'),
    fs.writeFile(F4, '4')
  ]);
});
afterAll(async () => {
  vi.unstubAllGlobals();
});

runSyncAsync('File.Find.tryAllDown()', { async: tryAllDown, sync: tryAllDownSync }, [
  {
    itShould: 'find all matching files',
    case: () => ({
      fnArgs: ['**/*.txt', { startDir: ROOT }] as const,
      assertion: 'toMatchObject',
      expected: { ok: true },
      after: async () => {
        const res: any = await tryAllDown('**/*.txt', { startDir: ROOT });
        expect(res.detail).toEqual(
          expect.arrayContaining([
            expect.stringContaining(path.basename(F1)),
            expect.stringContaining(path.basename(F2)),
            expect.stringContaining(path.basename(F4))
          ])
        );
        expect(res.detail.some((r: string) => r.endsWith('.log'))).toBe(false);
      }
    })
  },
  {
    itShould: 'respect endDir boundary',
    case: () => ({
      fnArgs: ['**/*.txt', { startDir: ROOT, endDir: L3 }] as const,
      assertion: 'toMatchObject',
      expected: { ok: true },
      after: async () => {
        const res: any = await tryAllDown('**/*.txt', { startDir: ROOT, endDir: L3 });
        expect(res.detail).toEqual(
          expect.arrayContaining([
            expect.stringContaining(path.basename(F1)),
            expect.stringContaining(path.basename(F2))
          ])
        );
        expect(res.detail.some((r: string) => r.endsWith('file4.txt'))).toBe(false);
      }
    })
  },
  {
    itShould: 'return error if traversal fails',
    case: () => {
      return {
        fnArgs: ['**/*.txt', { startDir: ROOT, endDir: '/an/end/dir' }] as const,
        assertion: 'toMatchObject',
        expected: { ok: false, error: expect.any(Error) }
      };
    }
  }
]);
runSyncAsync('File.Find.tryFirstDown()', { async: tryFirstDown, sync: tryFirstDownSync }, [
  {
    itShould: 'find the first matching file',
    case: () => ({
      fnArgs: ['**/*.txt', { startDir: ROOT }] as const,
      assertion: 'toMatchObject',
      expected: { ok: true, detail: path.resolve(F1) }
    })
  }
]);
runSyncAsync('File.Find.tryLastDown()', { async: tryLastDown, sync: tryLastDownSync }, [
  {
    itShould: 'find the last matching file',
    case: () => ({
      fnArgs: ['**/*.txt', { startDir: ROOT }] as const,
      assertion: 'toMatchObject',
      expected: { ok: true, detail: path.resolve(F4) }
    })
  }
]);
