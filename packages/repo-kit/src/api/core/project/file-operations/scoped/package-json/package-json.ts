import type { Options, Result } from 'execa';

import { packageJson } from '@toolbox-ts/configs';
import { merge as _merge } from '@toolbox-ts/configs/core';
import { isFile, mergeJSON } from '@toolbox-ts/file';
import path from 'node:path';

import type { ScopedFileMergeOp } from '../types.js';

import { OperationError } from '../../../../../Errors.js';
import { $pnpm } from '../../../shell-exec.js';
const sortObjKeys = <T extends Record<string, unknown>>(obj: T): T =>
  Object.fromEntries(
    Object.entries(obj).sort(([a], [b]) => a.localeCompare(b))
  ) as T;

const serialize = (v: unknown) =>
  typeof v === 'string' ? v : JSON.stringify(v);

const pkgExec = (
  cmd: 'delete' | 'get' | 'set',
  args: string | string[],
  opts: Options
): Promise<Result> =>
  $pnpm(
    `pkg ${cmd} ${Array.isArray(args) ? args.join(' ') : args} --json`,
    opts
  );

const pkgGet = async <T = unknown>(prop: string, opts: Options): Promise<T> => {
  const { stdout } = await pkgExec('get', prop, opts);
  if (!stdout) return {} as T;
  return JSON.parse(stdout as string) as T;
};

const pkgSet = async (entries: [string, unknown][], opts: Options) => {
  await pkgExec(
    'set',
    entries.map(([k, v]) => `${k}=${serialize(v)}`),
    opts
  );
};

const pkgDelete = async (props: string[], opts: Options) => {
  if (props.length === 0) return;
  await pkgExec('delete', props, opts);
};

export interface PackageJsonOps {
  config: {
    get: (names?: string[]) => Promise<Record<string, unknown>>;
    set: (entries: [string, unknown][]) => Promise<void>;
  };
  delete: (props: string[]) => Promise<void>;
  deps: {
    get: (
      type:
        | 'dependencies'
        | 'devDependencies'
        | 'optionalDependencies'
        | 'peerDependencies'
    ) => Promise<Record<string, string>>;
    sort: () => Promise<void>;
  };
  merge: ScopedFileMergeOp<packageJson.Config>;

  readonly path: string;

  scripts: {
    delete: (names: string[]) => Promise<void>;
    find: (search: string) => Promise<[string, string][]>;
    get: (names?: string[]) => Promise<Record<string, string>>;
    set: (entries: [string, string][]) => Promise<void>;
    sort: () => Promise<void>;
  };

  set: (entries: [string, unknown][]) => Promise<void>;
}

export const createPackageJsonOps = async (
  cwd: string,
  opts: Omit<Options, 'cwd'> = {}
): Promise<PackageJsonOps> => {
  const execOpts: Options = { ...opts, cwd };
  const pkgPath = path.join(cwd, packageJson.meta.filename);

  if (!(await isFile(pkgPath)))
    throw new OperationError(`No package.json found at ${pkgPath}`);

  return {
    path: pkgPath,
    merge: (input, confirmFn?) =>
      mergeJSON<packageJson.Config>({
        baseFilePath: pkgPath,
        inputFilePathOrData: input,
        mergeFn: _merge,
        confirmFn
      }),

    set: (entries) => pkgSet(entries, execOpts),

    delete: (props) => pkgDelete(props, execOpts),

    scripts: {
      async get(names = []) {
        const scripts = await pkgGet<Record<string, string>>(
          'scripts',
          execOpts
        );
        if (names.length === 0) return scripts;
        return Object.fromEntries(
          names.filter((n) => n in scripts).map((n) => [n, scripts[n]])
        );
      },

      async set(entries) {
        await pkgSet(
          entries.map(([n, c]) => [`scripts.${n}`, c]),
          execOpts
        );
      },

      async find(search) {
        const scripts = await this.get();
        return Object.entries(scripts).filter(
          ([n, c]) => n.includes(search) || c.includes(search)
        );
      },

      async delete(names) {
        await pkgDelete(
          names.map((n) => `scripts.${n}`),
          execOpts
        );
      },

      async sort() {
        await pkgSet([['scripts', sortObjKeys(await this.get())]], execOpts);
      }
    },

    config: {
      async get(names = []) {
        const cfg = await pkgGet<Record<string, unknown>>('config', execOpts);
        if (names.length === 0) return cfg;
        return Object.fromEntries(
          names.filter((n) => n in cfg).map((n) => [n, cfg[n]])
        );
      },

      async set(entries) {
        await pkgSet(
          entries.map(([n, v]) => [`config.${n}`, v]),
          execOpts
        );
      }
    },

    deps: {
      async get(type) {
        return await pkgGet<Record<string, string>>(type, execOpts);
      },

      async sort() {
        const types = [
          'dependencies',
          'devDependencies',
          'optionalDependencies',
          'peerDependencies'
        ] as const;

        for (const t of types) {
          const deps = await this.get(t);
          await pkgSet([[t, sortObjKeys(deps)]], execOpts);
        }
      }
    }
  };
};
