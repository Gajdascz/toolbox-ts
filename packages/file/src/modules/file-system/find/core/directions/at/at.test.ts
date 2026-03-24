import fs from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeEach, vi } from 'vitest';
import { runSyncAsync } from '@toolbox-ts/test-utils';
import {
  tryAllAt,
  tryAllAtSync,
  tryFirstAt,
  tryFirstAtSync,
  tryLastAt,
  tryLastAtSync
} from './at.ts';
const ROOT = '/root';

const FN1 = 'file1.txt';
const FN2 = 'file2.txt';
const FN3 = 'file3.log';
const FN4 = 'file4.txt';
const FN4_1 = 'file4_1.txt';
const FN4_2 = 'file4_2.txt';
const FN4_3 = 'file4_3.txt';
const FN4_4 = 'file4_4.txt';
const FN4_5 = 'file4_5.txt';

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
const F4_1 = path.join(L4, FN4_1);
const F4_2 = path.join(L4, FN4_2);
const F4_3 = path.join(L4, FN4_3);
const F4_4 = path.join(L4, FN4_4);
const F4_5 = path.join(L4, FN4_5);
vi.stubGlobal('process', { cwd: () => ROOT });

beforeEach(async () => {
  await fs.mkdir(L4, { recursive: true });
  await Promise.all([
    fs.writeFile(F1, '1'),
    fs.writeFile(F2, '2'),
    fs.writeFile(F3, '3'),
    fs.writeFile(F4, '4'),
    fs.writeFile(F4_1, '4_1'),
    fs.writeFile(F4_2, '4_2'),
    fs.writeFile(F4_3, '4_3'),
    fs.writeFile(F4_4, '4_4'),
    fs.writeFile(F4_5, '4_5')
  ]);
});
afterAll(async () => {
  vi.unstubAllGlobals();
});

runSyncAsync('File.Find.tryAllAt()', { async: tryAllAt, sync: tryAllAtSync }, [
  {
    itShould: 'find all matching files at a specific directory',
    case: () => ({
      fnArgs: ['**/*.txt', L4] as const,
      assertion: 'toMatchObject',
      expected: { ok: true }
    })
  }
]);
runSyncAsync('File.Find.tryFirstAt()', { async: tryFirstAt, sync: tryFirstAtSync }, [
  {
    itShould: 'find the first matching file at a specific directory',
    case: () => ({
      fnArgs: ['**/*.txt', L4] as const,
      assertion: 'toMatchObject',
      expected: { ok: true, detail: path.resolve(F4) }
    })
  },
  {
    itShould: 'sort the results before finding the first match if a sort function is provided',
    case: () => ({
      fnArgs: ['**/*.txt', L4, { sort: (a, b) => a.localeCompare(b) }] as const,
      assertion: 'toMatchObject',
      expected: { ok: true, detail: path.resolve(F4_1) }
    })
  },
  {
    itShould: 'return null if no matches are found',
    case: () => ({
      fnArgs: ['**/*.md', L4] as const,
      assertion: 'toMatchObject',
      expected: { ok: true, detail: null }
    })
  }
]);
runSyncAsync('File.Find.tryLastAt()', { async: tryLastAt, sync: tryLastAtSync }, [
  {
    itShould: 'find the last matching file at a specific directory',
    case: () => ({
      fnArgs: ['**/*.txt', L4] as const,
      assertion: 'toMatchObject',
      expected: { ok: true, detail: path.resolve(F4_5) }
    })
  },
  {
    itShould: 'sort the results before finding the last match if a sort function is provided',
    case: () => ({
      fnArgs: ['**/*.txt', L4, { sort: (a, b) => a.length - b.length }] as const,
      assertion: 'toMatchObject',
      expected: { ok: true, detail: path.resolve(F4_5) }
    })
  }
]);
