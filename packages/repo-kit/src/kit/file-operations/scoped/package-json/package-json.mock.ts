import { type MockedObject, vi } from 'vitest';

import type { PackageJsonOps } from './package-json.js';

export const createMockPackageJsonOps = (
  path = '/package.json'
): MockedObject<PackageJsonOps> => ({
  path,
  config: { set: vi.fn(), get: vi.fn().mockResolvedValue({}) },
  scripts: {
    set: vi.fn(),
    find: vi.fn().mockResolvedValue([]),
    delete: vi.fn(),
    get: vi.fn().mockResolvedValue({}),
    sort: vi.fn()
  },
  merge: vi.fn(),
  delete: vi.fn(),
  deps: { get: vi.fn().mockResolvedValue({}), sort: vi.fn() },
  set: vi.fn()
});
