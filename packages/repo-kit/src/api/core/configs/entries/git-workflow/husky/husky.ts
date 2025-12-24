import type { OrchestratorConfigEntry } from '../../../types.js';

import { $pnpm, $shell } from '../../../../project/index.js';

export const PKG_NAME = 'husky';
export const DIR = '.husky';
export const GIT_HOOKS = {
  /** validate commit message from git am */
  applyPatchMsg: 'applypatch-msg',

  /** run before git am applies a patch */
  preApplypatch: 'pre-applypatch',

  /** run after git am applies a patch */
  postApplypatch: 'post-applypatch',

  /** run before a commit is created */
  preCommit: 'pre-commit',

  /** edit or validate the commit message template */
  prepareCommitMsg: 'prepare-commit-msg',

  /** validate the final commit message */
  commitMsg: 'commit-msg',

  /** run after a commit is created */
  postCommit: 'post-commit',

  /** run before a rebase starts */
  preRebase: 'pre-rebase',

  /** run after git checkout or branch switch */
  postCheckout: 'post-checkout',

  /** run after a merge completes */
  postMerge: 'post-merge',

  /** run before pushing to a remote */
  prePush: 'pre-push',

  /** run before Git’s automatic garbage collection */
  preAutoGc: 'pre-auto-gc',

  /** run after history-rewriting commands (rebase, commit --amend) */
  postRewrite: 'post-rewrite'
} as const;
export const getGitHookPath = (
  hookName: keyof typeof GIT_HOOKS,
  dir = process.cwd()
) => `${dir}/${DIR}/${GIT_HOOKS[hookName]}`;
export const writeToGitHook = (
  hookName: keyof typeof GIT_HOOKS,
  content: string,
  dir = process.cwd()
) => $shell(`echo ${content} > ${getGitHookPath(hookName, dir)}`);
export const init = async () => $pnpm('husky init');

export interface Config {
  dir?: string;
  hooks?: [hook: keyof typeof GIT_HOOKS, fileContentLines: string[]][];
}

export const getEntry = ({
  dir,
  hooks
}: Config = {}): OrchestratorConfigEntry => ({
  dependencies: [[PKG_NAME, { isDev: true }]],
  async postProcess() {
    await $pnpm('husky init');
    if (hooks) {
      for (const [hookName, fileContentLines] of hooks)
        await writeToGitHook(hookName, fileContentLines.join('\n'), dir);
    }
  }
});
