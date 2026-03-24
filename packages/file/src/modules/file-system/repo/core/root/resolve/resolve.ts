import { type OperationResult, unwrap } from '../../../../../result.js';
import {
  findRootByGit,
  findRootByGitSync,
  tryFindRootByGit,
  tryFindRootByGitSync
} from '../find-by-git/index.js';

export const tryResolveRoot = async (
  root?: string,
  finder: () => Promise<OperationResult<string>> = tryFindRootByGit
) => (root ? ({ ok: true, detail: root } as const) : await finder());

export const tryResolveRootSync = (
  root?: string,
  finder: () => OperationResult<string> = tryFindRootByGitSync
) => (root ? ({ ok: true, detail: root } as const) : finder());

export const resolveRoot = async (
  root?: string,
  finder: () => Promise<string | OperationResult<string>> = findRootByGit
): Promise<string> => {
  const result = root ?? (await finder());
  return typeof result === 'string' ? result : unwrap(result);
};
export const resolveRootSync = (
  root?: string,
  finder: () => string | OperationResult<string> = findRootByGitSync
): string => {
  const result = root ?? finder();
  return typeof result === 'string' ? result : unwrap(result);
};
