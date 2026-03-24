import path from 'node:path';
import fs from 'node:fs';
import { isFile, isFileSync } from '../../../queries/index.js';
import { tryCatch, tryCatchSync, unwrap } from '../../../../result.js';
import { RepositoryError } from '../error.js';
import { findRootByDirName, findRootByDirNameSync } from '../root/index.js';

const defaultMonorepoIdentifierFiles = [
  'lerna.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'turbo.json',
  'nx.json'
];

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
 * @important If requiredIdentifierFilesCount is greater than the number of provided required files, the required count is clamped. eg if 2 files are provided but requiredIdentifierFilesCount is set to 3, the function will require both files to be present to consider the repo a monorepo.
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
 * console.log(await tryIsMonorepo('repo', { cwd: '/root/a', findRootDirection: 'down' })); // {ok:true detail:true}
 * console.log(await tryIisMonorepo('repo', { cwd: '/root/repo' })); // {ok: true, detail:true}
 * ```
 */
export const tryIsMonorepo = async (
  rootDirName: string,
  {
    cwd = process.cwd(),
    packageJsonMonorepoProp = 'isMonorepo',
    identifierFiles = defaultMonorepoIdentifierFiles,
    requiredIdentifierFilesCount = 2,
    findRootDirection = 'up'
  }: IsMonoRepoOpts = {}
) =>
  tryCatch<boolean, RepositoryError>(
    async () => {
      const root = await findRootByDirName(rootDirName, cwd, findRootDirection);
      if (!root) throw new RepositoryError('cannot determine repo root');
      const pkgPath = path.join(root, 'package.json');
      if (await isFile(path.join(root, 'package.json'))) {
        const read = await fs.promises.readFile(pkgPath, 'utf-8');
        const parsed = JSON.parse(read) as Record<string, unknown>;
        if (packageJsonMonorepoProp in parsed) return parsed[packageJsonMonorepoProp] === true;
      }
      let requiredCount = Math.min(requiredIdentifierFilesCount, identifierFiles.length);
      if (requiredCount === 0)
        throw new RepositoryError(
          'No package.json property, identifier files, or required identifier files count provided to determine monorepo status.'
        );
      let result: boolean = false;
      for (const file of identifierFiles) {
        if (await isFile(path.join(root, file))) {
          requiredCount--;
          if (requiredCount === 0) {
            result = true;
            break;
          }
        }
      }
      return result;
    },
    /* c8 ignore next */
    (e) => new RepositoryError('Failed to determine if repo is monorepo', e)
  );

/** Synchronous version of {@link tryIsMonorepo} */
export const tryIsMonorepoSync = (
  rootDirName: string,
  {
    cwd = process.cwd(),
    packageJsonMonorepoProp = 'isMonorepo',
    identifierFiles = defaultMonorepoIdentifierFiles,
    requiredIdentifierFilesCount = 2,
    findRootDirection = 'up'
  }: IsMonoRepoOpts = {}
) =>
  tryCatchSync<boolean, RepositoryError>(
    () => {
      const root = findRootByDirNameSync(rootDirName, cwd, findRootDirection);
      if (!root) throw new RepositoryError('cannot determine repo root');
      const pkgPath = path.join(root, 'package.json');
      if (isFileSync(pkgPath)) {
        const read = fs.readFileSync(pkgPath, 'utf-8');
        const parsed = JSON.parse(read) as { [packageJsonMonorepoProp]?: unknown };
        if (packageJsonMonorepoProp in parsed) return parsed[packageJsonMonorepoProp] === true;
      }
      let requiredCount = Math.min(requiredIdentifierFilesCount, identifierFiles.length);
      if (requiredCount === 0)
        throw new RepositoryError(
          'No package.json property, identifier files, or required identifier files count provided to determine monorepo status.'
        );
      let result: boolean = false;
      for (const file of identifierFiles) {
        if (isFileSync(path.join(root, file))) {
          requiredCount--;
          if (requiredCount === 0) {
            result = true;
            break;
          }
        }
      }
      return result;
    },
    /* c8 ignore next */
    (e) => new RepositoryError('Failed to determine if repo is monorepo', e)
  );

//#region> Unwrapped
/* c8 ignore start */
/** @see {@link tryIsMonorepo} */
export const isMonorepo = async (rootDirName: string, opts?: IsMonoRepoOpts) =>
  unwrap(await tryIsMonorepo(rootDirName, opts));
/** @see {@link tryIsMonorepoSync} */
export const isMonorepoSync = (rootDirName: string, opts?: IsMonoRepoOpts) =>
  unwrap(tryIsMonorepoSync(rootDirName, opts));
/* c8 ignore stop */
//#endregion
