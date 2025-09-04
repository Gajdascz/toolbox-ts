import { cruise as _cruise } from 'dependency-cruiser';
import { expect, it, vi } from 'vitest';

import { cruise } from './cruise.ts';

// Mock dependency-cruiser
vi.mock('dependency-cruiser', async () => {
  const actual = await vi.importActual<any>('dependency-cruiser');
  return { ...actual, cruise: vi.fn() };
});

// Mock config resolver
vi.mock('../config/index.ts', async (actual) => ({
  ...(await actual()),
  resolve: { config: vi.fn() }
}));

import { resolve } from '../config/index.ts';

const mockResolveConfig = vi.mocked(resolve.config);
const mockCruise = vi.mocked(_cruise);

it('wraps resolveConfig and dependency-cruiser correctly', async () => {
  mockResolveConfig.mockResolvedValue({
    cruiseOptions: { parser: 'acorn' },
    output: {
      graph: { type: 'archi', outPath: 'output/graph.svg' },
      formatting: {},
      log: 'json',
      overwriteBehavior: 'force',
      report: { type: 'json', outPath: 'output/report.json' }
    },
    resolveOptions: undefined,
    transpileOptions: { babelConfig: {}, tsConfig: {} }
  });

  mockCruise.mockResolvedValue({
    output: {
      modules: [],
      summary: {
        error: 0,
        ignore: 0,
        info: 0,
        optionsUsed: {},
        totalCruised: 0,
        warn: 0,
        violations: []
      }
    },
    exitCode: 0
  });

  const result = await cruise('src', { flags: {}, input: {} });

  expect(mockResolveConfig).toHaveBeenCalledWith({ flags: {}, input: {} });
  expect(mockCruise).toHaveBeenCalledWith(
    ['src'],
    { parser: 'acorn' },
    undefined,
    { tsConfig: {}, babelConfig: {} }
  );
  expect(result).toEqual({
    output: {
      graph: { type: 'archi', outPath: 'output/graph.svg' },
      formatting: {},
      log: 'json',
      overwriteBehavior: 'force',
      report: { type: 'json', outPath: 'output/report.json' }
    },
    result: {
      modules: [],
      summary: {
        error: 0,
        ignore: 0,
        info: 0,
        optionsUsed: {},
        totalCruised: 0,
        warn: 0,
        violations: []
      }
    },
    exitCode: 0
  });

  const result2 = await cruise(['src', 'test'], { flags: {}, input: {} });

  expect(mockResolveConfig).toHaveBeenCalledWith({ flags: {}, input: {} });
  expect(mockCruise).toHaveBeenCalledWith(
    ['src', 'test'],
    { parser: 'acorn' },
    undefined,
    { tsConfig: {}, babelConfig: {} }
  );
  expect(result2).toEqual({ ...result });
});
it('throws if dependency-cruiser returns unexpected output', async () => {
  mockCruise.mockResolvedValue({ output: null, exitCode: 0 });
  await expect(cruise('src', { flags: {}, input: {} })).rejects.toThrow();
  // @ts-expect-error testing invalid
  mockCruise.mockResolvedValue('not an object');
  await expect(cruise('src', { flags: {}, input: {} })).rejects.toThrow();
});
