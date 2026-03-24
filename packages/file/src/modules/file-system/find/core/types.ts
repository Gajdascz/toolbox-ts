import type fg from 'fast-glob';

export type FindDirection = 'down' | 'up' | 'at';
export type FindTarget = 'first' | 'last' | 'all';
/**
 * The directory to terminate the search at (not included in the search).
 *
 * - direction 'up': defaults to the filesystem root `path.parse(process.cwd()).root`.
 * - direction 'down': defaults to `undefined` (searches until no more subdirectories are found).
 */
export type FindEndDir = string;
/**
 * The directory to start the search from (included in the search).
 *
 * @default process.cwd()
 */
export type FindStartDir = string;
export type FindResult<R = string> = false | R | R[] | undefined;
export interface WhenOpts {
  direction: FindDirection;
  endDir?: FindEndDir;
  startDir?: FindStartDir;
}

/** Options for `fast-glob` patterns passed to search functions to find a single file. */
export type fgFindSingleInputOpts = Omit<FgOptionsWithStartEnd, 'deep' | 'unique'>;

/** Options for `fast-glob` search with directory overrides. */
export type FgOptionsWithStartEnd = { endDir?: FindEndDir; startDir?: FindStartDir } & FgOptions;

export type FgOptions = Omit<fg.Options, 'cwd'> & { sort?: (a: string, b: string) => number };
