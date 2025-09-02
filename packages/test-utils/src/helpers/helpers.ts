import { isDeepStrictEqual } from 'node:util';
import { vi } from 'vitest';

import { recursiveReset } from '../core/index.js';

/**
 * Checks if the first call of a mock function matches
 * the provided arguments.
 *
 * @example
 * ```ts
 * const mock = vi.fn();
 * mock('a', 'b');
 * mockFirstArgsMatch(mock, ['a', 'b']); // true
 * mockFirstArgsMatch(mock, ['a', 'c']); // false
 * ```
 */
export const mockFirstArgsMatch = (
  mock: ReturnType<typeof vi.fn>,
  args: unknown[]
) => args.every((arg, i) => isDeepStrictEqual(mock.mock.calls[i]?.[0], arg));

/* c8 ignore start */
/**
 * Mocked console module with all methods replaced by Vitest mock functions.
 */
export type MockedConsole = { [K in keyof Console]: ReturnType<typeof vi.fn> };
const _console: MockedConsole = {
  assert: vi.fn((s: unknown) => s),
  clear: vi.fn(),
  Console: vi.fn(),
  count: vi.fn((n: unknown) => n),
  countReset: vi.fn(),
  debug: vi.fn((s: unknown) => s),
  dir: vi.fn((s: unknown) => s),
  dirxml: vi.fn((s: unknown) => s),
  error: vi.fn((s: unknown) => s),
  group: vi.fn((s: unknown) => s),
  groupCollapsed: vi.fn((s: unknown) => s),
  groupEnd: vi.fn(),
  info: vi.fn((s: unknown) => s),
  log: vi.fn((s: unknown) => s),
  profile: vi.fn((s: unknown) => s),
  profileEnd: vi.fn((s: unknown) => s),
  table: vi.fn((s: unknown) => s),
  time: vi.fn((s: unknown) => s),
  timeEnd: vi.fn((s: unknown) => s),
  timeLog: vi.fn((s: unknown) => s),
  timeStamp: vi.fn((s: unknown) => s),
  trace: vi.fn((s: unknown) => s),
  warn: vi.fn((s: unknown) => s)
} as const;

export const mockConsole = {
  methods: _console,
  stub: () => vi.stubGlobal('console', _console),
  restore: () => vi.unstubAllGlobals(),
  reset: () => recursiveReset(_console)
} as const;
/* c8 ignore end */
