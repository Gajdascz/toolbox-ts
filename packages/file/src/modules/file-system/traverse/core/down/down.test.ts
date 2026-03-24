import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, expect, vi } from 'vitest';
import { runSyncAsync } from '@toolbox-ts/test-utils';
import { tryDown, tryDownSync } from './down.ts';

const join = path.posix.join.bind(path.posix);
const PROJECT_ROOT = '/project';
const SRC_DIR = join(PROJECT_ROOT, 'src');
const NESTED_DIR = join(SRC_DIR, 'nested');
const DEEPER_DIR = join(NESTED_DIR, 'deeper');
const STOP_DIR = join(PROJECT_ROOT, 'stop');

beforeEach(async () => {
  await fs.promises.mkdir(DEEPER_DIR, { recursive: true });
});

runSyncAsync('File.Traverse.tryDown()', { async: tryDown, sync: tryDownSync }, [
  {
    itShould: 'perform breadth-first traversal and stop at endDir',
    case: async () => {
      await fs.promises.mkdir(STOP_DIR, { recursive: true });
      const visited: string[] = [];
      return {
        fnArgs: [
          (dir: string) => {
            visited.push(dir);
            return { break: false, result: dir };
          },
          { startDir: PROJECT_ROOT, endDir: STOP_DIR }
        ] as const,
        assertion: 'toMatchObject',
        expected: { ok: true },
        after: () => {
          expect(visited[0]).toBe(PROJECT_ROOT);
          expect(visited).not.toContain(STOP_DIR);
          expect(visited).not.toContain(DEEPER_DIR);
        }
      };
    }
  },
  {
    itShould: 'break when onDir signals to break',
    case: () => {
      const visited: string[] = [];
      return {
        fnArgs: [
          (dir: string) => {
            visited.push(dir);
            return dir === NESTED_DIR
              ? { break: true, result: dir }
              : { break: false, result: dir };
          },
          { startDir: PROJECT_ROOT, endDir: STOP_DIR }
        ] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: [PROJECT_ROOT, SRC_DIR, NESTED_DIR] },
        after: () => expect(visited).toEqual([PROJECT_ROOT, SRC_DIR, NESTED_DIR])
      };
    }
  },
  {
    itShould: 'handle start equal to end with a custom result handler',
    case: () => {
      const captured: string[] = [];
      const handler = vi.fn((res: string | string[], acc: string[], _dir?: string) => {
        const values = Array.isArray(res) ? res : [res];
        captured.push(...values);
        acc.push(...values);
      });
      return {
        fnArgs: [
          (dir: string) => ({ break: false, result: dir }),
          { startDir: SRC_DIR, endDir: SRC_DIR, resultHandler: handler }
        ] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: [SRC_DIR] },
        after: () => {
          expect(handler).toHaveBeenCalledTimes(1);
          expect(handler).toHaveBeenCalledWith(expect.anything(), expect.anything(), SRC_DIR);
          expect(captured).toEqual([SRC_DIR]);
        }
      };
    }
  },
  {
    itShould: 'skip resulHandler when onDir returns no result',
    case: () => {
      const handler = vi.fn();
      return {
        fnArgs: [
          (_dir: string) => ({ break: false }),
          { startDir: SRC_DIR, endDir: SRC_DIR, resultHandler: handler }
        ] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: [] },
        after: () => expect(handler).not.toHaveBeenCalled()
      };
    }
  }
]);
