import { constants, Obj } from '@toolbox-ts/utils';
const { icons } = constants;

import fg from 'fast-glob';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
//#region> Conventional
export const REVERT = {
  key: 'revert',
  description: 'Reverts a previous commit',
  title: 'Reverts',
  semver: null,
  emoji: icons.revert
} as const;
export const DOCS = {
  key: 'docs',
  description: 'Documentation only changes',
  title: 'Documentation',
  semver: null,
  emoji: icons.books
} as const;
export const STYLE = {
  key: 'style',
  title: 'Styles',
  description:
    'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
  semver: null,
  emoji: icons.paintPalette
} as const;
export const REFACTOR = {
  key: 'refactor',
  description: 'A code change that neither fixes a bug nor adds a feature',
  title: 'Code Refactoring',
  semver: null,
  emoji: icons.wrench
} as const;
export const BUILD = {
  key: 'build',
  description:
    'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
  title: 'Builds',
  semver: null,
  emoji: icons.hammer
} as const;
export const CI = {
  key: 'ci',
  description:
    'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
  title: 'Continuous Integration',
  semver: null,
  emoji: icons.screwdriver
} as const;
export const CHORE = {
  key: 'chore',
  description: "Other changes that don't modify src or test files",
  title: 'Chores',
  semver: null,
  emoji: icons.chore
} as const;
export const TEST = {
  key: 'test',
  description: 'Adding missing tests or correcting existing tests',
  title: 'Tests',
  semver: null,
  emoji: icons.rotatingLight
} as const;
export const FIX = {
  key: 'fix',
  description: 'A bug fix',
  title: 'Bug Fixes',
  semver: 'patch',
  emoji: icons.bug
} as const;
export const PERF = {
  key: 'perf',
  description: 'A code change that improves performance',
  title: 'Performance Improvements',
  semver: 'patch',
  emoji: icons.performance
} as const;
export const FEAT = {
  key: 'feat',
  description: 'A new feature',
  title: 'Features',
  semver: 'minor',
  emoji: icons.tada
} as const;

export const CONVENTIONAL = {
  [REVERT.key]: REVERT,
  [DOCS.key]: DOCS,
  [STYLE.key]: STYLE,
  [REFACTOR.key]: REFACTOR,
  [BUILD.key]: BUILD,
  [CI.key]: CI,
  [CHORE.key]: CHORE,
  [TEST.key]: TEST,
  [FIX.key]: FIX,
  [PERF.key]: PERF,
  [FEAT.key]: FEAT
} as const;
export const CONVENTIONAL_KEYS = Obj.keys(CONVENTIONAL);
//#endregion

export const PROTECTED_BRANCHES = ['main'] as const;
export const REPO_SCOPE = 'repo';
export const getScopes = async (cwd = process.cwd()): Promise<string[]> => {
  const result = new Set([REPO_SCOPE]);
  try {
    let currentDir = cwd;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      const workspaceFile = path.join(currentDir, 'pnpm-workspace.yaml');
      if (fs.existsSync(workspaceFile)) {
        const yaml = fs.readFileSync(workspaceFile, 'utf8');
        const { packages: packagePatterns = [] } = parse(yaml) as {
          packages?: string[];
        };

        const matchedPackages = [];
        /* c8 ignore start */
        for (const pattern of packagePatterns) {
          const r = await fg(pattern, {
            cwd: currentDir,
            onlyDirectories: true
          });
          matchedPackages.push(...r);
        }
        /* c8 ignore end */

        for (const pkgPath of matchedPackages) {
          const name = path.basename(pkgPath);
          result.add(name);
        }
        return [...result].map((s) => s.replace('packages/', ''));
      }

      const parent = path.resolve(currentDir, '..');
      if (parent === currentDir) break; // reached root
      currentDir = parent;
    }

    return [...result].map((s) => s.replace('packages/', ''));
  } catch {
    return [...result].map((s) => s.replace('packages/', ''));
  }
};
export const VERSION_NOT_REQUIRED = {
  scope: [REPO_SCOPE],
  type: Object.values(CONVENTIONAL).reduce<string[]>((acc, curr) => {
    if (curr.semver === null) acc.push(curr.key);
    return acc;
  }, [])
} as const;
export const STRINGS = {
  conventional: CONVENTIONAL_KEYS.join(', '),
  protectedBranches: PROTECTED_BRANCHES.join(', '),
  versionNotRequired:
    `scopes: ${VERSION_NOT_REQUIRED.scope.join(', ')}, `
    + `types: ${VERSION_NOT_REQUIRED.type.join(', ')}`
} as const;

export const GIT = 'git';
export const GIT_CMDS = {
  add: 'add',
  apply: 'apply',
  archive: 'archive',
  bisect: 'bisect',
  blame: 'blame',
  branch: 'branch',
  checkout: 'checkout',
  cherryPick: 'cherry-pick',
  clean: 'clean',
  commit: 'commit',
  config: 'config',
  diff: 'diff',
  fetch: 'fetch',
  formatPatch: 'format-patch',
  grep: 'grep',
  log: 'log',
  lsFiles: 'ls-files',
  lsRemote: 'ls-remote',
  merge: 'merge',
  mv: 'mv',
  pull: 'pull',
  push: 'push',
  rebase: 'rebase',
  reflog: 'reflog',
  remote: 'remote',
  reset: 'reset',
  revList: 'rev-list',
  revParse: 'rev-parse',
  rm: 'rm',
  show: 'show',
  stash: 'stash',
  status: 'status',
  submodule: 'submodule',
  tag: 'tag'
} as const;
export const BRANCH_REGEX = {
  /**
   * One of the conventional types (e.g., feat, fix, chore)
   * Must be lower and kebab case letters and digits only.
   */
  BRANCH_DESCRIPTION: /^([a-z0-9-]+)$/,
  /**
   * One of the predefined scopes (e.g., ui, core)
   * Must be lower and kebab case letters only.
   */
  BRANCH_SCOPE: /^([a-z-]+)$/,
  /**
   * One of the conventional types (e.g., feat, fix, chore)
   * Must be lower case letters only.
   */
  BRANCH_TYPE: /^([a-z]+)$/
} as const;

export interface BranchConvention {
  /**
   * Description of the branch name that immediately follows the type and scope (if scope is provided).
   * Must be short, descriptive, lowercase and kebab-case.
   * @example
   * ```txt
   * feat/ui/add-button
   * fix/core/resolve-issue
   * chore/update-dependencies
   * feat/classes/implement-classname-method
   * ```
   */
  description: string;
  scope: string;
  type: string;
}

export type ConventionType = (typeof CONVENTIONAL)[keyof typeof CONVENTIONAL];

export type GitCmd = keyof typeof GIT_CMDS;

/**
 * Parsed branch convention object.
 * Contains the full branch name, scope, type, and description.
 * The `raw` property contains the original branch name
 * @example
 * ```ts
 * {
 *   raw: 'feat/ui/add-button',
 *   scope: 'ui',
 *   type: 'feat',
 *   description: 'add-button',
 * }
 * ```
 */
export interface ParsedBranchConvention extends BranchConvention {
  raw: string;
}

export type ProtectedBranch = (typeof PROTECTED_BRANCHES)[number];
