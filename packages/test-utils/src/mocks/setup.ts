/**
 * @module test-utils/mocks/setup
 *
 * This file sets up the test environment by mocking necessary modules and
 * resetting their states. It ensures that the environment is correctly mocked
 * before running tests. This prevents potentially destructive operations
 * on the real file system or other modules.
 */

import { afterAll, beforeAll, beforeEach, vi } from 'vitest';

import { assertMockedEnv, type MockCheck } from '../core/core.js';
import {
  child_process,
  execa,
  execaExists,
  fs,
  inquirer,
  inquirerExists,
  MEM_FS
} from './modules/index.js';

const assertions: MockCheck[] = [
  {
    description: '"fs" module',
    modulePath: 'node:fs',
    validate: (m) => m[MEM_FS] === true || 'fs is not a memfs instance'
  },
  {
    description: '"fs/promises" module',
    modulePath: 'node:fs/promises',
    validate: (m) => m[MEM_FS] === true || 'fs.promises is not a memfs instance'
  },
  {
    description: '"child_process" module',
    modulePath: 'node:child_process',
    validate: (m) => m.exec !== undefined || 'child_process.exec is not defined'
  }
];

vi.mock('fs', () => fs);
vi.mock('node:fs', () => fs);

vi.mock('node:fs/promises', () => fs.promises);
vi.mock('fs/promises', () => fs.promises);

vi.mock('node:child_process', () => child_process);
vi.mock('child_process', () => child_process);

if (execaExists) {
  vi.mock('execa', () => execa);
  assertions.push({ description: '"execa" module', modulePath: 'execa' });
}
if (inquirerExists) {
  vi.mock('@inquirer/prompts', () => inquirer);
  assertions.push({
    description: '"@inquirer/prompts" module',
    modulePath: '@inquirer/prompts'
  });
}

beforeEach(() => {
  fs.reset();
});
beforeAll(async () => {
  await assertMockedEnv();
});
afterAll(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  vi.unstubAllGlobals();
});
