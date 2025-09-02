import type { Options, ResultPromise } from 'execa';

import {
  BaseCommand,
  type CommandInput,
  type CommandOptions,
  type CommandOptionsNoStdio
} from '@toolbox-ts/cli-kit';
import fs from 'node:fs';
import path from 'node:path';

import {
  BRANCH_REGEX,
  CONVENTIONAL,
  CONVENTIONAL_KEYS,
  getScopes,
  GIT,
  GIT_CMDS,
  type ParsedBranchConvention,
  PROTECTED_BRANCHES,
  REPO_SCOPE,
  STRINGS,
  VERSION_NOT_REQUIRED
} from './config/index.js';

/** Base class for Git-related commands.*/
export abstract class BaseGit extends BaseCommand {
  static readonly CMDS = GIT_CMDS;
  static readonly CONVENTIONAL = CONVENTIONAL;
  static readonly CONVENTIONAL_KEYS = CONVENTIONAL_KEYS;
  static readonly GIT = GIT;
  static override id = 'git';
  static readonly PROTECTED_BRANCHES = PROTECTED_BRANCHES;
  static readonly REPO_SCOPE = REPO_SCOPE;
  static readonly STRINGS = STRINGS;
  static readonly VERSION_NOT_REQUIRED = VERSION_NOT_REQUIRED;
  git = this.wrap(GIT);
  readonly fetch = {
    /**
     * Fetches the latest state of the provided branch from the origin.
     * - Defaults to 'main' if no branch is provided.
     * - Executes `git fetch origin <branch>` to update the local repository.
     */
    origin: (branch = 'main', opts?: CommandOptionsNoStdio): Promise<string> =>
      this.git.string(['fetch', ['origin', branch]], opts)
  } as const;
  readonly branch = {
    assertConvention: async (input: ParsedBranchConvention | string) => {
      const convention =
        typeof input === 'string' ?
          await this.branch.parseConvention(input)
        : input;
      const errors: string[] = [];
      if (
        !CONVENTIONAL_KEYS.includes(
          convention.type as keyof typeof CONVENTIONAL
        )
      ) {
        errors.push(
          `Invalid branch type "${convention.type}". Must be one of: ${STRINGS.conventional}.`
        );
      }
      if (!(await this.SCOPES).includes(convention.scope)) {
        errors.push(
          `Invalid branch scope "${convention.scope}". Must be one of: ${JSON.stringify(this.SCOPES)}.`
        );
      }
      if (convention.description.trim().length === 0) {
        errors.push(`Branch description cannot be empty.`);
      }
      const str = `${convention.type}/${convention.scope}/${convention.description}`;
      if (convention.raw !== str)
        errors.push(
          `Branch name "${convention.raw}" does not match the expected format "${str}".`
        );

      if (errors.length > 0) this.error(errors.join('\n'));

      return convention;
    },
    /** Asserts that the provided branch is not behind its origin counterpart. */
    assertNotBehindOrigin: async (branch: string) => {
      if (await this.branch.isBehindOrigin(branch))
        this.error(
          `Your local branch "${branch}" is not up to date with origin. Please pull or rebase before pushing.`
        );
      return branch;
    },
    /** Asserts that the provided branch is not a protected branch. */
    assertNotProtected: (branch: string) => {
      if (this.branch.isProtected(branch))
        this.error(
          `Direct commits to protected branches (${STRINGS.protectedBranches}) are not allowed. Please checkout a new branch and commit your changes there.`
        );
      return branch;
    },
    /**
     * Asserts that the provided branch is ready for development (defaults to current).
     * - checks if the branch is protected
     * - checks if the branch is behind its origin counterpart
     * - checks if the branch follows the conventional format
     */
    assertReadyForDevelopment: async (
      branch?: string
    ): Promise<ParsedBranchConvention> => {
      branch ??= await this.branch.get();
      this.branch.assertNotProtected(branch);
      await this.branch.assertNotBehindOrigin(branch);
      return this.branch.parseConvention(branch);
    },
    /**
     * Retrieve the provided Git branch name.
     * If no branch is provided, defaults to 'HEAD' (current).
     * - executes `git rev-parse --abbrev-ref (if true) ...flags <branch>`
     */
    get: async (branch = 'HEAD', abbrevRef = true, ...flags: string[]) =>
      await this.git.string([
        'rev-parse',
        [abbrevRef ? '--abbrev-ref' : '', ...flags, branch]
      ]),
    /**
     * Checks if the provided branch is behind the provided origin counterpart.
     * If no branch is provided, defaults to 'main'.
     * - executes
     *   - `git fetch origin main`: to ensure the latest state
     *   - `git rev-parse --verify origin/<branch>`: to check if the remote
     *      branch exists
     *   - `git rev-list --left-right --count origin/<branch>...<branch>`: to count
     *      commits behind the origin branch.
     */
    isBehindOrigin: async (branch = 'main'): Promise<boolean> => {
      await this.fetch.origin(branch);

      const exists = await this.git.string(['rev-parse', [`origin/${branch}`]]);
      if (!exists) return false;
      const counts = await this.git.string([
        'rev-parse',
        ['--left-right', '--count', `origin/${branch}...${branch}`]
      ]);
      const [behindStr] = counts.trim().split(/\s+/);
      const behind = Number(behindStr);
      return behind > 0;
    },
    isProtected: (
      branch: string
    ): branch is (typeof BaseGit.PROTECTED_BRANCHES)[number] =>
      BaseGit.PROTECTED_BRANCHES.includes(
        branch as (typeof BaseGit.PROTECTED_BRANCHES)[number]
      ),
    /**
     * Parses a branch name into its components (type, scope, description).
     * - expects the branch name to follow the format:
     *   `type/scope/short-description`
     * - uses the `BRANCH_REGEX` to extract type, scope, and description
     * - returns an object with the parsed components
     * @example
     * ```ts
     * const result = git.parseBranch('feat/ui/add-button');
     * console.log(result);
     * // {
     * //   type: 'feat',
     * //   scope: 'ui',
     * //   description: 'add-button',
     * // }
     * ```
     */
    parseConvention: async (
      branch: string
    ): Promise<ParsedBranchConvention> => {
      const parts = branch.split('/').filter(Boolean);
      let description = '',
        scope = '',
        type = '';
      if (parts.length === 3) {
        [type, scope, description] = parts;
      } else {
        throw new Error(
          `Invalid branch format: "${branch}". Expected <type>/<scope>/<description>`
        );
      }

      const errors: string[] = [];
      if (!BRANCH_REGEX.BRANCH_TYPE.test(type)) {
        errors.push(
          `Invalid branch type "${type}". Must be lowercase letters only.`
        );
      }
      if (!BRANCH_REGEX.BRANCH_SCOPE.test(scope)) {
        errors.push(
          `Invalid branch scope "${scope}". Must be lowercase letters, numbers, and hyphens only.`
        );
      }
      if (!BRANCH_REGEX.BRANCH_DESCRIPTION.test(description)) {
        errors.push(
          `Invalid branch description "${description}". Must be lowercase letters, numbers, and hyphens only.`
        );
      }
      if (errors.length > 0) throw new Error(errors.join('\n'));

      return await this.branch.assertConvention({
        description,
        raw: branch,
        scope,
        type
      });
    }
  };
  readonly changeset = {
    /**
     * Asserts that the provided branch/commit is in a valid changeset related state.
     * - If a changeset is required but does not exists, it throws an error.
     * - If a changeset exists but is not required, it throws an error.
     */
    assertValidState: ({
      description,
      raw,
      scope,
      type
    }: ParsedBranchConvention) => {
      const isVersionReq = this.changeset.isRequired({
        description,
        raw,
        scope,
        type
      });
      const hasChangeset = this.changeset.isInRepo();
      if (isVersionReq && !hasChangeset)
        this.error(
          `A changeset is required for "${type}" branches with scope "${scope}". Please create a changeset before proceeding.`
        );
      if (hasChangeset && !isVersionReq)
        this.error(
          `A changeset exists but is not required for "${type}" branches with scope "${scope}". Either create a new branch to better represent what's being modified or remove the changeset.`
        );
      return { scope, type };
    },
    /**
     * Checks if there is an active changeset in the repository.
     * - checks for the existence of `.changeset` directory
     * - checks for any `.md` files in the directory that do not start with 'README'
     */
    isInRepo: () => {
      const changesetDir = path.join(process.cwd(), '.changeset');
      if (!fs.existsSync(changesetDir)) return false;
      return fs
        .readdirSync(changesetDir)
        .some((f: string) => f.endsWith('.md') && !f.startsWith('README'));
    },
    /**
     * Checks if a changeset is required for the provided scope and type.
     * - checks against the predefined list of scopes and types that do not require
     *   a changeset
     */
    isRequired: ({ scope, type }: ParsedBranchConvention): boolean =>
      !(
        BaseGit.VERSION_NOT_REQUIRED.scope.includes(
          scope as (typeof BaseGit.VERSION_NOT_REQUIRED)['scope'][number]
        ) || BaseGit.VERSION_NOT_REQUIRED.type.includes(type)
      )
  } as const;

  get SCOPES() {
    return getScopes();
  }

  /* c8 ignore start */
  protected postExec(): void {
    delete process.env.EXECUTED_WITH_GIT_KIT;
  }
  protected preExec(): void {
    process.env.EXECUTED_WITH_GIT_KIT = 'true';
  }
  /* c8 ignore end */
}
