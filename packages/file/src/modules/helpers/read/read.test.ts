import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, vi } from 'vitest';

import { tryReadFile, tryReadFileSync } from './read.js';
import { runSyncAsync } from '@toolbox-ts/test-utils';

const CWD = '/test/mock';
vi.stubGlobal('process', { ...process, cwd: () => CWD });
vi.spyOn(process, 'cwd').mockReturnValue(CWD);

const TMP = path.join(process.cwd(), '.tmp-write-test');
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

runSyncAsync('File.tryReadFile()', { sync: tryReadFileSync, async: tryReadFile }, [
  {
    itShould: 'read basic file content',
    case: async () => ({
      fnArgs: [await file('r.txt', 'hello world')] as const,
      assertion: 'toMatchObject',
      expected: { ok: true, detail: 'hello world' }
    })
  },
  {
    itShould: 'use parser when provided',
    case: async () => ({
      fnArgs: [await file('r.json', '{"x":1}'), JSON.parse] as const,
      assertion: 'toMatchObject',
      expected: { ok: true, detail: { x: 1 } }
    })
  }
]);
