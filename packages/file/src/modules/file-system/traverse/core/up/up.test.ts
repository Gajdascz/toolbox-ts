import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, expect, it, vi } from 'vitest';
import { runSyncAsync } from '@toolbox-ts/test-utils';
import { tryToParent, tryUpSync, tryUp } from './up.ts';

const join = path.posix.join.bind(path.posix);
const PROJECT_ROOT = '/project';
const SRC_DIR = join(PROJECT_ROOT, 'src');
const NESTED_DIR = join(SRC_DIR, 'nested');
const DEEPER_DIR = join(NESTED_DIR, 'deeper');

beforeEach(async () => {
  await fs.promises.mkdir(DEEPER_DIR, { recursive: true });
});

it('File.Traverse.tryToParent() returns parent directory while respecting end boundaries', () => {
  expect(tryToParent(DEEPER_DIR)).toMatchObject({ ok: true, detail: NESTED_DIR });
  expect(tryToParent('/')).toMatchObject({ ok: true, detail: null });
  expect(tryToParent(SRC_DIR)).toMatchObject({ ok: true, detail: PROJECT_ROOT });
});

runSyncAsync('File.Traverse.tryUp()', { async: tryUp, sync: tryUpSync }, [
  {
    itShould: 'aggregate results until break',
    case: () => {
      const visited: string[] = [];
      return {
        fnArgs: [
          (dir: string) => {
            visited.push(dir);
            if (dir === PROJECT_ROOT)
              return { break: true, result: [`break:${path.posix.basename(dir)}`] };
            return { break: false, result: dir };
          },
          { startDir: DEEPER_DIR, endDir: '/' }
        ] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: [DEEPER_DIR, NESTED_DIR, SRC_DIR, 'break:project'] },
        after: () => expect(visited).toEqual([DEEPER_DIR, NESTED_DIR, SRC_DIR, PROJECT_ROOT])
      };
    }
  },
  {
    itShould: 'not traverse endDir',
    case: () => {
      const visited: string[] = [];
      return {
        fnArgs: [
          (dir: string) => {
            visited.push(dir);
            return { break: false, result: dir };
          },
          { startDir: DEEPER_DIR, endDir: SRC_DIR }
        ] as const,
        assertion: 'toMatchObject',
        expected: { ok: true, detail: [DEEPER_DIR, NESTED_DIR] },
        after: () => expect(visited).toEqual([DEEPER_DIR, NESTED_DIR])
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
  }
]);
