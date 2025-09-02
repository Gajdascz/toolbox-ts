import { vi } from 'vitest';

import {
  dependencyExists,
  mockKeys,
  wrapMockExport
} from '../../../core/index.js';

export const execaExists = await dependencyExists('execa');

export const execa = wrapMockExport({
  ...mockKeys([
    '$',
    'execa',
    'execaCommand',
    'execaCommandSync',
    'execaNode',
    'execaSync',
    'ExecaSyncError',
    'getCancelSignal',
    'getEachMessage',
    'getOneMessage',
    'sendMessage'
  ]),
  parseCommandString: vi.fn((c: string) => c.split(' ')),
  ExecaError: class MockExecaError extends Error {
    command: string;
    exitCode: number;

    constructor(message: string, command: string, exitCode: number) {
      super(message);
      this.name = 'ExecaError';
      this.command = command;
      this.exitCode = exitCode;
    }
  },
  ExecaSyncError: class MockExecaSyncError extends Error {
    command: string;
    exitCode: number;

    constructor(message: string, command: string, exitCode: number) {
      super(message);
      this.name = 'ExecaSyncError';
      this.command = command;
      this.exitCode = exitCode;
    }
  }
});
