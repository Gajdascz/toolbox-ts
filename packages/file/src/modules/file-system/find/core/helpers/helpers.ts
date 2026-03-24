import fg from 'fast-glob';
import fs from 'node:fs';

import type { FgOptions } from '../types.js';
import type { OperationResult } from '../../../../result.js';
import type { TraverseError } from '../../../traverse/core/error.js';

//#region> FG Helpers
/* c8 ignore start */
export const IGNORE = ['**/node_modules/**', '**/dist/**', '**/build/**', '**/out/**'];
export const FG_DEFAULT_OPTS: { all: fg.Options; single: fg.Options } = {
  all: { absolute: true, onlyFiles: true, dot: true, unique: true, fs: fs, ignore: IGNORE },
  single: {
    absolute: true,
    onlyFiles: true,
    deep: 0,
    dot: true,
    unique: true,
    fs: fs,
    ignore: IGNORE
  }
} as const;

/**
 * Performs a `fast-glob` search with the provided pattern and options, returning all matches in the specified directory and its subdirectories.
 */
export const fgAll = async (pattern: fg.Pattern, cwd: string, opts: FgOptions = {}) => {
  const result = await fg(pattern, { ...FG_DEFAULT_OPTS.all, ...opts, cwd });
  if (opts.sort) result.sort(opts.sort);
  return result;
};
/**
 * Performs a single step of `fast-glob` with the provided pattern and options, returning all matches in the current directory (non-recursive).
 * - `step` because depth is always set to `0`, so it only checks the specified directory without traversing subdirectories.
 * - `all` because it returns all matches found in the current directory as an array.
 */
export const fgAllStep = async (
  pattern: fg.Pattern,
  cwd: string,
  opts: Omit<FgOptions, 'sort'> = {}
) => await fg(pattern, { ...FG_DEFAULT_OPTS.all, ...opts, cwd, deep: 0 });
/**
 * Used to find a single match for the pattern
 * - `single` because it returns a single match (the first one found) instead of an array.
 */
export const fgSingle = async (
  pattern: fg.Pattern,
  cwd: string,
  at: number = 0,
  { sort, ...rest }: FgOptions = {}
) => {
  const result = await fg(pattern, { ...FG_DEFAULT_OPTS.single, ...rest, cwd });
  if (sort) result.sort(sort);
  return result.at(at) ?? null;
};
/**
 * Synchronous version of {@link fgAll} - performs a `fast-glob` search with the provided pattern and options, returning all matches in the specified directory and its subdirectories.
 */
export const sFgAll = (pattern: fg.Pattern, cwd: string, opts: FgOptions = {}) => {
  const result = fg.sync(pattern, { ...FG_DEFAULT_OPTS.all, ...opts, cwd });
  if (opts.sort) result.sort(opts.sort);
  return result;
};

/**
 * Synchronous version of {@link fgAllStep} - performs a single step of `fast-glob` and returns all matches in the current directory.
 * - `step` because depth is always set to `0`, so it only checks the specified directory without traversing subdirectories.
 * - `all` because it returns all matches found in the current directory as an array.
 */
export const sFgAllStep = (
  pattern: fg.Pattern,
  cwd: string,
  opts: Omit<FgOptions, 'deep' | 'cwd' | 'sort'> = {}
) => fg.sync(pattern, { ...FG_DEFAULT_OPTS.all, ...opts, cwd, deep: 0 });
/**
 * Synchronous version of {@link fgSingle} - finds a single match for the pattern in the specified directory.
 * - `single` because it returns a single match (the first one found) instead of an array.
 */
export const sFgSingle = (
  pattern: fg.Pattern,
  cwd: string,
  at: number = 0,
  { sort, ...rest }: FgOptions = {}
) => {
  const result = fg.sync(pattern, { ...FG_DEFAULT_OPTS.single, ...rest, cwd });
  if (sort) result.sort(sort);
  return result.at(at) ?? null;
};
/* c8 ignore stop */
//#endregion

//#region>> General
export const handleTraversalResult = (
  traverseResult: OperationResult<string[], TraverseError>,
  sort?: FgOptions['sort']
) => {
  if (!traverseResult.ok) throw traverseResult.error;
  const result = traverseResult.detail.flat();
  if (sort) result.sort(sort);
  return result;
};
//#endregion
