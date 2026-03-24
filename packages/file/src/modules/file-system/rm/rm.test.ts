import fs from 'node:fs';
import { tryRm, tryRmSync } from './rm.ts';
import { expect } from 'vitest';
import { runSyncAsync } from '@toolbox-ts/test-utils';

runSyncAsync('File.tryRm()', { async: tryRm, sync: tryRmSync }, [
  {
    itShould: 'remove a file successfully',
    case: async () => {
      await fs.promises.writeFile('/test-file.txt', 'Test content');
      const filePath = '/test-file.txt';
      return {
        fnArgs: [filePath] as const,
        expected: { ok: true, detail: filePath },
        after: async () => {
          expect(await fs.promises.access(filePath).catch(() => null)).toBeNull();
        }
      };
    }
  }
]);
