import { beforeEach, describe, expect, it, vi } from 'vitest';

import { $pnpm, $shell, installDependency } from '../../../../project/index.ts';
import {
  type Config,
  DIR,
  getGitHookPath,
  GIT_HOOKS,
  init,
  PKG_NAME,
  setup,
  writeToGitHook
} from './husky.ts';
vi.mock('../../../project/index.js', async (actual) => ({
  ...(await actual()),
  $pnpm: vi.fn(),
  $shell: vi.fn(),
  installDependency: vi.fn()
}));

describe('husky', () => {
  const mockedInstallDependency = vi.mocked(installDependency);
  const $mockedPnpm = vi.mocked($pnpm);
  const $mockedShell = vi.mocked($shell);
  beforeEach(() => {
    vi.clearAllMocks();
    $mockedPnpm.mockResolvedValue({} as any);
    $mockedShell.mockResolvedValue({} as any);
  });

  describe('getGitHookPath', () => {
    it('should return correct path for pre-commit hook', () => {
      const path = getGitHookPath('preCommit');
      expect(path).toBe(`${process.cwd()}/${DIR}/pre-commit`);
    });

    it('should return correct path for commit-msg hook', () => {
      const path = getGitHookPath('commitMsg');
      expect(path).toBe(`${process.cwd()}/${DIR}/commit-msg`);
    });

    it('should return correct path with custom directory', () => {
      const path = getGitHookPath('preCommit', '/custom/path');
      expect(path).toBe(`/custom/path/${DIR}/pre-commit`);
    });

    it('should handle all git hook types', () => {
      const hookNames = Object.keys(GIT_HOOKS) as (keyof typeof GIT_HOOKS)[];

      for (const hookName of hookNames) {
        const path = getGitHookPath(hookName);
        expect(path).toContain(DIR);
        expect(path).toContain(GIT_HOOKS[hookName]);
      }
    });
  });

  describe('writeToGitHook', () => {
    it('should write content to git hook file', async () => {
      await writeToGitHook('preCommit', 'npm test');

      expect($mockedShell).toHaveBeenCalledWith(
        `echo npm test > ${getGitHookPath('preCommit')}`
      );
    });

    it('should write multi-line content', async () => {
      const content = 'line1\nline2\nline3';
      await writeToGitHook('commitMsg', content);

      expect($mockedShell).toHaveBeenCalledWith(
        `echo ${content} > ${getGitHookPath('commitMsg')}`
      );
    });

    it('should write to custom directory', async () => {
      const customDir = '/custom/dir';
      await writeToGitHook('prePush', 'npm run lint', customDir);

      expect($mockedShell).toHaveBeenCalledWith(
        `echo npm run lint > ${getGitHookPath('prePush', customDir)}`
      );
    });
  });

  describe('init', () => {
    it('should initialize husky', async () => {
      await init();

      expect($mockedPnpm).toHaveBeenCalledWith('husky init');
    });
  });

  describe('setup', () => {
    it('should install husky and initialize', async () => {
      await setup();

      expect(mockedInstallDependency).toHaveBeenCalledWith(PKG_NAME, {
        isDev: true
      });
      expect($mockedPnpm).toHaveBeenCalledWith('husky init');
    });

    it('should setup without hooks', async () => {
      await setup({});

      expect(mockedInstallDependency).toHaveBeenCalledWith(PKG_NAME, {
        isDev: true
      });
      expect($mockedPnpm).toHaveBeenCalledWith('husky init');
      expect($mockedPnpm).toHaveBeenCalledTimes(1);
    });

    it('should setup with single hook', async () => {
      const config: Config = { hooks: [['preCommit', ['npm test']]] };

      await setup(config);

      expect($mockedPnpm).toHaveBeenCalledWith('husky init');
      expect($mockedShell).toHaveBeenCalledWith(
        `echo npm test > ${getGitHookPath('preCommit')}`
      );
    });

    it('should setup with multiple hooks', async () => {
      const config: Config = {
        hooks: [
          ['preCommit', ['npm run lint', 'npm test']],
          ['commitMsg', ['commitlint --edit $1']],
          ['prePush', ['npm run build']]
        ]
      };

      await setup(config);

      expect($mockedPnpm).toHaveBeenCalledWith('husky init');
      expect($mockedShell).toHaveBeenCalledWith(
        `echo npm run lint\nnpm test > ${getGitHookPath('preCommit')}`
      );
      expect($mockedShell).toHaveBeenCalledWith(
        `echo commitlint --edit $1 > ${getGitHookPath('commitMsg')}`
      );
      expect($mockedShell).toHaveBeenCalledWith(
        `echo npm run build > ${getGitHookPath('prePush')}`
      );
    });

    it('should setup with custom directory', async () => {
      const config: Config = {
        dir: '/custom/dir',
        hooks: [['preCommit', ['npm test']]]
      };

      await setup(config);

      expect($mockedShell).toHaveBeenCalledWith(
        `echo npm test > ${getGitHookPath('preCommit', '/custom/dir')}`
      );
    });

    it('should handle empty hooks array', async () => {
      const config: Config = { hooks: [] };

      await setup(config);

      expect($mockedPnpm).toHaveBeenCalledWith('husky init');
      expect($mockedPnpm).toHaveBeenCalledTimes(1);
    });

    it('should install as dev dependency', async () => {
      await setup();

      expect(mockedInstallDependency).toHaveBeenCalledWith(
        PKG_NAME,
        expect.objectContaining({ isDev: true })
      );
    });

    it('should handle all git hook types', async () => {
      const config: Config = {
        hooks: [
          ['applyPatchMsg', ['test1']],
          ['preApplypatch', ['test2']],
          ['postApplypatch', ['test3']],
          ['preCommit', ['test4']],
          ['prepareCommitMsg', ['test5']],
          ['commitMsg', ['test6']],
          ['postCommit', ['test7']],
          ['preRebase', ['test8']],
          ['postCheckout', ['test9']],
          ['postMerge', ['test10']],
          ['prePush', ['test11']],
          ['preAutoGc', ['test12']],
          ['postRewrite', ['test13']]
        ]
      };

      await setup(config);

      expect($mockedPnpm).toHaveBeenCalledTimes(1); // init
      expect($mockedShell).toHaveBeenCalledTimes(13); // one for each hook
    });
  });
});
