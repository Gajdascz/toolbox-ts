import { exec, execSync } from 'node:child_process';
import { promisify } from 'node:util';
import { tryCatch, tryCatchSync, unwrap } from '../../../../../result.js';
import { RepositoryError } from '../../error.js';

const execAsync = promisify(exec);
const GIT_ROOT_CMD = 'git rev-parse --show-toplevel';
const GIT_ROOT_ERROR = `Failed to find repo root using git:\n    cmd: ${GIT_ROOT_CMD}`;

/** Find the repo root by using git to determine the top-level directory. */
export const tryFindRootByGit = async () =>
  tryCatch<string, RepositoryError>(
    async () => (await execAsync(GIT_ROOT_CMD)).stdout.trim(),
    (e) => new RepositoryError(GIT_ROOT_ERROR, e)
  );

/** Synchronous version of {@link findRootByGit} */
export const tryFindRootByGitSync = () =>
  tryCatchSync<string, RepositoryError>(
    () => execSync(GIT_ROOT_CMD).toString().trim(),
    (e) => new RepositoryError(GIT_ROOT_ERROR, e)
  );

// #region> Unwrapped
/* c8 ignore start */
/** @see {@link tryFindRootByGit} */
export const findRootByGit = async () => unwrap(await tryFindRootByGit());
/** @see {@link tryFindRootByGitSync} */
export const findRootByGitSync = () => unwrap(tryFindRootByGitSync());
/* c8 ignore stop */
//#endregion
