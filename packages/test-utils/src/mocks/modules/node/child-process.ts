import type childProcess from 'node:child_process';

import {
  type ExportedMock,
  type MockedFn as MockedFunction,
  mockKeys,
  wrapMockExport
} from '../../../core/core.js';

export type MockChildProcess = ExportedMock<{
  [K in keyof typeof childProcess]: MockedFunction;
}>;

export const child_process: MockChildProcess = wrapMockExport(
  mockKeys([
    'ChildProcess',
    'exec',
    'execFile',
    'execFileSync',
    'execSync',
    'fork',
    'spawn',
    'spawnSync'
  ])
);
