import fg from 'fast-glob';
import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_OPTS: { all: fg.Options; first: fg.Options } = {
  all: {
    absolute: true,
    onlyFiles: true,
    dot: true,
    unique: true,
    fs: fs,
    ignore: ['**/node_modules/**', '**/dist/**']
  },
  first: {
    absolute: true,
    onlyFiles: true,
    deep: 0,
    dot: true,
    unique: true,
    fs: fs,
    ignore: ['**/node_modules/**', '**/dist/**']
  }
} as const;

type OverrideOpts = Omit<fg.Options, 'cwd'>;
/**
 * Find all files matching a pattern starting from a directory (children only).
 */
export const all = async (
  pattern: string,
  startingDir = process.cwd(),
  opts: OverrideOpts = {}
): Promise<string[]> =>
  await fg(pattern, { ...DEFAULT_OPTS.all, ...opts, cwd: startingDir });

/**
 * Find the first file matching a pattern starting from a directory and traversing up
 * to an end directory.
 * - Returns `null` if no file is found.
 */
export const firstUp = async (
  pattern: string,
  startingDir = process.cwd(),
  endDir = path.parse(startingDir).root,
  opts: Omit<OverrideOpts, 'deep' | 'unique'> = {}
): Promise<null | string> => {
  let curr: null | string = startingDir;
  const _opts = { ...DEFAULT_OPTS.first, ...opts };
  while (curr) {
    const [found] = await fg(pattern, { ..._opts, cwd: curr });
    if (found) return found;

    if (curr === endDir) break;
    const parent = path.dirname(curr);
    /* c8 ignore start */
    curr = parent === curr ? null : parent;
    /* c8 ignore end */
  }
  /* c8 ignore start */
  return null;
  /* c8 ignore end */
};

export const firstDown = async (
  pattern: string,
  startingDir = process.cwd(),
  opts: Omit<OverrideOpts, 'deep' | 'unique'> = {}
) => {
  const _opts = { ...DEFAULT_OPTS.first, ...opts };
  const queue = startingDir ? [startingDir] : [];
  while (queue.length > 0) {
    const curr = queue.shift();
    const [found] = await fg(pattern, { ..._opts, cwd: curr });
    if (found) return found;
    queue.push(
      ...(await fg('*', { ..._opts, onlyDirectories: true, cwd: curr }))
    );
  }
  /* c8 ignore start */
  return null;
  /* c8 ignore end */
};

export const sync = {
  all: (
    pattern: string,
    startingDir = process.cwd(),
    opts: OverrideOpts = {}
  ) => fg.sync(pattern, { cwd: startingDir, ...DEFAULT_OPTS.all, ...opts }),
  firstUp: (
    pattern: string,
    startingDir = process.cwd(),
    endDir = path.parse(startingDir).root,
    opts: Omit<OverrideOpts, 'deep'> = {}
  ): null | string => {
    let curr: null | string = startingDir;
    const _opts = { ...DEFAULT_OPTS.first, ...opts };
    while (curr) {
      const [found] = fg.sync(pattern, { cwd: curr, ..._opts });
      if (found) return found;

      if (curr === endDir) break;
      const parent = path.dirname(curr);
      curr = parent === curr ? null : parent;
    }

    /* c8 ignore start */
    return null;
    /* c8 ignore end */
  },
  firstDown: (
    pattern: string,
    startingDir = process.cwd(),
    opts: Omit<OverrideOpts, 'deep' | 'unique'> = {}
  ) => {
    const _opts = { ...DEFAULT_OPTS.first, ...opts };
    const queue = startingDir ? [startingDir] : [];

    while (queue.length > 0) {
      const curr = queue.shift();
      const [found] = fg.sync(pattern, { ..._opts, cwd: curr });
      if (found) return found;
      queue.push(
        ...fg.sync('*', { ..._opts, onlyDirectories: true, cwd: curr })
      );
    }
    /* c8 ignore start */
    return null;
    /* c8 ignore end */
  }
} as const;
