import { exec, execSync } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

import { find } from '../find/index.js';
import {
  hasFiles,
  hasFilesSync,
  isFile,
  isFileSync
} from '../helpers/helpers.js';
import { parseJson, parseJsonSync } from '../parse-json/parse-json.js';
const execAsync = promisify(exec);
const defaultMonorepoIdentifierFiles = [
  'lerna.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'turbo.json',
  'nx.json'
];
const defaultRootDirIdentifierFiles = ['.git', 'package.json'];

export const findRoot = {
  /** Search for a parent (or child, if direction='down') directory matching the specified name starting from the given cwd. */
  byDirName: async (
    dirName: string,
    cwd = process.cwd(),
    direction: 'down' | 'up' = 'up'
  ) =>
    direction === 'up' ?
      await find.lastUp(dirName, { startDir: cwd })
    : await find.firstDown(dirName, { startDir: cwd }),

  /**
   * Find the repo root by looking for files that typically indicate a repo root (like .git or package.json).
   * - You can customize the files to look for by providing an array of file names.
   * - Returns the first directory found that contains all specified files “so ensure the files you provide are all together exclusively in the root” → could be shorter: “Returns the first directory that contains all specified files.”
   * @example
   * ```ts
   * const root = await findRoot.byFiles(['.git', 'package.json']);
   * console.log(root); // e.g., '/path/to/repo'
   * ```
   */
  byFiles: async (
    identifierFiles = defaultRootDirIdentifierFiles,
    cwd = process.cwd()
  ) =>
    find.firstWhen(
      async (dir) => ((await hasFiles(dir, identifierFiles)) ? dir : null),
      { startDir: cwd }
    ),
  /** Find the repo root by using git to determine the top-level directory. */
  byGit: async () => {
    try {
      return (
        (await execAsync('git rev-parse --show-toplevel')).stdout.trim() || null
      );
    } catch {
      return null;
    }
  }
};

export interface IsMonoRepoOpts {
  cwd?: string;
  /**
   * The direction to search for the root directory.
   * - `up`: Search parent directories (default).
   * - `down`: Search child directories.
   *
   * @default 'up'
   */
  findRootDirection?: 'down' | 'up';
  /** Files that are typically present in monorepos */
  identifierFiles?: string[];
  /**
   * The name of the property in package.json that indicates the repo is a monorepo.
   * - The property needs to be set to `true` to indicate a monorepo.
   *
   * @default 'isMonorepo'
   */
  packageJsonMonorepoProp?: string;

  /**
   * The number of identifier files that must be present to consider the repo a monorepo.
   * - Any value higher than the length of the identifierFiles array enforces all files exist.
   * - Defaults to 2 to check for a package.json and at least one other common monorepo file.
   *
   * @default 2
   */
  requiredIdentifierFilesCount?: number;
}
/**
 * Determine whether the current working directory (or optionally another directory) is in a monorepo.
 * - Looks for a package.json property (default: `isMonorepo`) to determine the repo type.
 * - If that property is not present it looks for files that are typically present in monorepos (lerna.json, pnpm-workspace.yaml, etc).
 *
 * @throws when the repo root cannot be determined (no git repo and no dirName provided/ found)
 *
 * @throws when the requiredIdentifierFilesCount is set to 0 and the packageJsonMonorepoProp is not found in package.json
 *
 * @example
 * ```ts
 * /root
 * ├─ /a
 * ├─ /b
 * └─ /repo
 *    ├─ package.json (with "isMonorepo": true)
 *    ├─ lerna.json
 *    └─ /packages
 *       ├─ /package1
 *       └─ /package2
 *
 * console.log(await isMonorepo('repo', { cwd: '/root/a', findRootDirection: 'down' })); // true
 * console.log(await isMonorepo('repo', { cwd: '/root/repo' })); // true
 * ```
 */
export const isMonorepo = async (
  rootDirName: string,
  {
    cwd = process.cwd(),
    packageJsonMonorepoProp = 'isMonorepo',
    identifierFiles = defaultMonorepoIdentifierFiles,
    requiredIdentifierFilesCount = 2,
    findRootDirection = 'up'
  }: IsMonoRepoOpts = {}
): Promise<boolean> => {
  const root = await findRoot.byDirName(rootDirName, cwd, findRootDirection);
  if (!root) throw new Error('cannot determine repo root');
  const pkgPath = path.join(root, 'package.json');
  if (await isFile(path.join(root, 'package.json'))) {
    const { result } = await parseJson<{ [packageJsonMonorepoProp]?: unknown }>(
      pkgPath
    );
    if (result && packageJsonMonorepoProp in result)
      return result[packageJsonMonorepoProp] === true;
  }
  let requiredCount = Math.min(
    requiredIdentifierFilesCount,
    identifierFiles.length
  );

  if (requiredCount === 0)
    throw new Error(
      'No package.json property, identifier files, or required identifier files count provided to determine monorepo status.'
    );

  for (const file of identifierFiles) {
    if (await isFile(path.join(root, file))) {
      requiredCount--;
      if (requiredCount === 0) return true;
    }
  }
  return false;
};

export const sync = {
  findRoot: {
    /** Synchronous version of {@link findRoot.byDirName} */
    byDirName: (
      dirName: string,
      cwd = process.cwd(),
      direction: 'down' | 'up' = 'up'
    ) =>
      direction === 'up' ?
        find.sync.lastUp(dirName, { startDir: cwd })
      : find.sync.firstDown(dirName, { startDir: cwd }),
    /** Synchronous version of {@link findRoot.byFiles} */
    byFiles: (
      identifierFiles = defaultRootDirIdentifierFiles,
      cwd = process.cwd()
    ) =>
      find.sync.firstWhen(
        (dir) => (hasFilesSync(dir, identifierFiles) ? dir : undefined),
        { startDir: cwd }
      ),
    /** Synchronous version of {@link findRoot.byGit} */
    byGit: () => {
      try {
        return (
          execSync('git rev-parse --show-toplevel').toString().trim() || null
        );
      } catch {
        return null;
      }
    }
  },
  /** Synchronous version of {@link isMonorepo} */
  isMonorepo: (
    rootDirName: string,
    {
      cwd = process.cwd(),
      packageJsonMonorepoProp = 'isMonorepo',
      identifierFiles = defaultMonorepoIdentifierFiles,
      requiredIdentifierFilesCount = 2,
      findRootDirection = 'up'
    }: IsMonoRepoOpts = {}
  ): boolean => {
    const root = sync.findRoot.byDirName(rootDirName, cwd, findRootDirection);
    if (!root) throw new Error('cannot determine repo root');
    if (isFileSync(path.join(root, 'package.json'))) {
      const pkgPath = path.join(root, 'package.json');
      const { result } = parseJsonSync<{ [packageJsonMonorepoProp]?: unknown }>(
        pkgPath
      );
      if (result && packageJsonMonorepoProp in result)
        return result[packageJsonMonorepoProp] === true;
    }
    let requiredCount = Math.min(
      requiredIdentifierFilesCount,
      identifierFiles.length
    );

    if (requiredCount === 0)
      throw new Error(
        'No package.json property, identifier files, or required identifier files count provided to determine monorepo status.'
      );

    for (const file of identifierFiles) {
      if (isFileSync(path.join(root, file))) {
        requiredCount--;
        if (requiredCount === 0) return true;
      }
    }
    return false;
  }
} as const;
