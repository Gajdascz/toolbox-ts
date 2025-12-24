import { beforeEach, describe, expect, it, vi } from 'vitest';

const calls: string[] = [];

vi.mock('@toolbox-ts/configs', () => ({
  commitlint: { meta: { dependencies: [['commitlint-dep', { isDev: true }]] } }
}));

vi.mock('../../../project/index.js', () => ({
  mapConfigModuleDeps: (deps: any) => deps
}));

vi.mock('./husky/index.js', () => {
  return {
    husky: {
      getEntry: vi.fn(() => ({
        dependencies: [['husky-dep', { isDev: true }]],
        postProcess: () => {
          calls.push('husky-post');
        }
      })),
      writeToGitHook: vi.fn((hook: string, cmd: string) => {
        calls.push(`${hook}:${cmd}`);
      })
    }
  };
});

vi.mock('./lint-staged/index.js', () => ({
  lintStaged: {
    getEntry: vi.fn(() => ({
      dependencies: [['ls-dep', { isDev: false }]],
      pkgPatch: { scripts: { 'lint-staged': 'run-lint-staged' } }
    }))
  }
}));

import { get } from './git-workflow.js';

beforeEach(() => {
  calls.length = 0;
  vi.clearAllMocks();
});

describe('git-workflow.getEntry', () => {
  it('composes dependencies and pkgPatch and runs postProcess hooks (default includeCommitizen=true)', async () => {
    const entry = get();

    // dependencies include commitlint, lint-staged and husky deps + commitizen plugins
    const names = entry.dependencies.map((d: any) =>
      Array.isArray(d) ? d[0] : d
    );
    expect(names).toEqual(
      expect.arrayContaining([
        'commitlint-dep',
        'ls-dep',
        'husky-dep',
        'commitizen',
        '@commitlint/cz-commitlint'
      ])
    );

    // pkgPatch merges lint-staged pkgPatch and adds commitizen config
    expect(entry.pkgPatch).toHaveProperty('scripts');
    expect(entry.pkgPatch.config).toEqual({
      commitizen: { path: '@commitlint/cz-commitlint' }
    });

    // postProcess invokes husky postProcess and writeToGitHook in order
    await entry.postProcess?.();
    expect(calls).toEqual([
      'husky-post',
      'commitMsg:pnpm exec commitlint --edit "$1"',
      'preCommit:pnpm run lint-staged'
    ]);
  });

  it('omits commitizen deps and config when includeCommitizen is false', () => {
    const entry = get({ includeCommitizen: false });
    const names = entry.dependencies.map((d: any) =>
      Array.isArray(d) ? d[0] : d
    );
    expect(names).not.toContain('commitizen');
    expect(names).not.toContain('@commitlint/cz-commitlint');
    expect(entry.pkgPatch.config).toBeUndefined();
  });
});
