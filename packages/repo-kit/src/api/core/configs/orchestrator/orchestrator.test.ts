import { isFile } from '@toolbox-ts/file';
import fs from 'node:fs/promises';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createMockPackageJsonOps } from '../../project/file-operations/scoped/package-json/package-json.mock.ts';
import { orchestrateConfigs } from './orchestrator.js';
vi.mock('../../project/index.js', () => ({
  installDependencies: vi.fn(() => [
    { packageName: 'dep-a' },
    { packageName: 'dep-b' }
  ]),
  handleConflict: vi.fn(() => ({ strategy: 'skip', applied: false })),
  createPackageJsonOps: createMockPackageJsonOps
}));

vi.mock('../entries/index.js', () => {
  const mkEntry = (name: string, noFiles = false) => ({
    get: () => ({
      dependencies: [['dep-a'], ['dep-b']],
      pkgPatch: { [`${name}Key`]: true },
      files:
        noFiles ? undefined : (
          [
            {
              filename: `${name}.json`,
              contentSerializer: () => JSON.stringify({ name }),
              fileData: {
                type: 'default',
                name: 'runtime',
                options: { serialize: { name: 'json', fn: JSON.stringify } }
              }
            }
          ]
        )
    })
  });

  return {
    depcruiserEntry: mkEntry('depcruiser'),
    prettierEntry: mkEntry('prettier'),
    tsdocEntry: mkEntry('tsdoc'),
    tseslintEntry: mkEntry('tseslint'),
    vitestEntry: mkEntry('vitest', true),
    tsconfigsEntry: mkEntry('tsconfigs'),
    gitWorkflowEntry: mkEntry('gitWorkflow')
  };
});

const mockPkgOps = createMockPackageJsonOps('/repo/package.json');

describe('orchestrateConfigs', () => {
  beforeEach(() => {
    fs.rm('/repo', { recursive: true, force: true });
    fs.mkdir('/repo', { recursive: true });
  });

  it('runs end-to-end with no conflicts', async () => {
    vi.mocked(mockPkgOps.scripts.find).mockResolvedValue([
      ['lint', 'pnpm run lint'],
      ['test', 'pnpm run test']
    ]);
    const result = await orchestrateConfigs({
      repoType: 'singlePackage',
      writePath: '/repo',
      pkgOps: mockPkgOps,
      configs: {}
    });

    // entries created
    expect(Object.keys(result.entries)).toHaveLength(7);

    // files written
    expect(await isFile('/repo/depcruiser.json')).toBe(true);
    expect(await isFile('/repo/prettier.json')).toBe(true);

    // package.json merge
    expect(result.finalPkgPatch.scripts?.check).toBe(
      'pnpm run lint && pnpm run test'
    );

    // dependencies installed
    expect(result.entries.depcruiser.installedDependencies.length).toBe(2);
  });

  it('handles file conflicts via handleConflict', async () => {
    // pre-create file to force conflict
    await fs.writeFile('/repo/prettier.json', '{}');

    const result = await orchestrateConfigs({
      repoType: 'singlePackage',
      writePath: '/repo',
      pkgOps: mockPkgOps,
      configs: {}
    });

    const prettierFiles = result.entries.prettier.files;
    expect(prettierFiles[0].conflict).toEqual({
      strategy: 'skip',
      applied: false
    });
  });

  it('respects process priority ordering', async () => {
    const result = await orchestrateConfigs({
      repoType: 'singlePackage',
      writePath: '/repo',
      pkgOps: mockPkgOps,
      configs: {
        prettier: { processPriority: 10 },
        depcruiser: { processPriority: -10 },
        tsdoc: { processPriority: 0 },
        tseslint: { processPriority: 5 },
        gitWorkflow: { processPriority: 2 },
        tsconfigs: { processPriority: 3 },
        vitest: { processPriority: 1 }
      }
    });

    expect(result.entries.depcruiser.processOrder).toBe(0);
    expect(result.entries.prettier.processOrder).toBeGreaterThan(0);
  });

  it('produces empty files array when no files are defined', async () => {
    const result = await orchestrateConfigs({
      repoType: 'monorepo',
      writePath: '/repo',
      pkgOps: mockPkgOps,
      configs: {}
    });

    expect(result.entries.vitest.files).toBeUndefined();
  });
});
