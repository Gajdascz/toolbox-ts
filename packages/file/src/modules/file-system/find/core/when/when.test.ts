import fs from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeEach, vi } from 'vitest';
import { runSyncAsync } from '@toolbox-ts/test-utils';
import {
  tryFirstWhen,
  tryFirstWhenRead,
  tryFirstWhenSync,
  tryLastWhen,
  tryLastWhenRead,
  tryFirstWhenReadSync,
  tryLastWhenReadSync,
  tryLastWhenSync
} from './when.ts';

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

runSyncAsync('File.Find.tryFirstWhen()', { async: tryFirstWhen, sync: tryFirstWhenSync }, [
  {
    itShould: '[down] finds the first matching result',
    case: async () => {
      return {
        fnArgs: [
          (dir) => (dir.endsWith(D3) ? dir : undefined),
          { startDir: ROOT, direction: 'down' }
        ],
        expected: { ok: true, detail: L3 }
      };
    }
  },
  {
    itShould: '[up] finds the first matching result',
    case: async () => {
      return {
        fnArgs: [
          (dir) => (dir.endsWith(D1) ? dir : undefined),
          { startDir: L4, endDir: ROOT, direction: 'up' }
        ],
        expected: { ok: true, detail: L1 }
      };
    }
  },
  {
    itShould: 'respect endDir boundary',
    case: async () => {
      return {
        fnArgs: [
          (dir) => (dir.endsWith(D2) ? dir : undefined),
          { startDir: L3, endDir: L1, direction: 'up' }
        ],
        expected: { ok: true, detail: L2 }
      };
    }
  }
]);
runSyncAsync(
  'File.Find.tryFirstWhenRead()',
  { async: tryFirstWhenRead, sync: tryFirstWhenReadSync },
  [
    {
      itShould: 'find the first matching result based on directory content [down]',
      case: () => ({
        fnArgs: [
          (_: string, content: string[]) => content.find((f) => f === FN3),
          { startDir: ROOT, direction: 'down' }
        ] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: FN3 }
      })
    },
    {
      itShould: 'find the first matching result based on directory content [up]',
      case: () => ({
        fnArgs: [
          (_: string, content: string[]) => content.find((f) => f === FN1),
          { startDir: L4, endDir: ROOT, direction: 'up' }
        ] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: FN1 }
      })
    }
  ]
);
runSyncAsync('File.Find.tryLastWhen()', { async: tryLastWhen, sync: tryLastWhenSync }, [
  {
    itShould: 'find the last matching result [down]',
    case: () => ({
      fnArgs: [
        (dir: string) => (dir.endsWith(D1) ? dir : undefined),
        { startDir: ROOT, direction: 'down' }
      ] as const,
      assertion: 'toMatchObject',
      expected: { ok: true, detail: L1 }
    })
  },
  {
    itShould: 'find the last matching result [up]',
    case: () => ({
      fnArgs: [
        (dir: string) => (dir.endsWith(D3) ? dir : undefined),
        { startDir: L4, endDir: ROOT, direction: 'up' }
      ] as const,
      assertion: 'toMatchObject',
      expected: { ok: true, detail: L3 }
    })
  },
  {
    itShould: 'normalize find results to null when falsy',
    case: () => ({
      fnArgs: [
        (dir: string) => (dir.endsWith(D3) ? '' : undefined),
        { startDir: L4, endDir: ROOT, direction: 'up' }
      ] as const,
      assertion: 'toMatchObject',
      expected: { ok: true, detail: null }
    })
  }
]);
runSyncAsync('File.Find.tryLastWhenRead()', { async: tryLastWhenRead, sync: tryLastWhenReadSync }, [
  {
    itShould: 'find the last matching result based on directory content [down]',
    case: () => ({
      fnArgs: [
        (_: string, content: string[]) => content.find((f) => f === FN1),
        { direction: 'down' }
      ] as const,
      assertion: 'toMatchObject',
      expected: { ok: true, detail: FN1 }
    })
  },
  {
    itShould: 'find the last matching result based on directory content [up]',
    case: () => ({
      fnArgs: [
        (_: string, content: string[]) => content.find((f) => f === FN3),
        { startDir: L4, direction: 'up' }
      ] as const,
      assertion: 'toMatchObject',
      expected: { ok: true, detail: FN3 }
    })
  }
]);
