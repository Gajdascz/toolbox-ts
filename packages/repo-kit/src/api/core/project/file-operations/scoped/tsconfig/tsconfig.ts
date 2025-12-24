import type { TsConfigMeta, TsConfigWithMeta } from '@toolbox-ts/types';

import { merge as _merge } from '@toolbox-ts/configs/core';
import { isFile, mergeJSON } from '@toolbox-ts/file';
import fs from 'node:fs/promises';
import path from 'node:path';

import type { ScopedFileMergeOp } from '../types.js';

import { OperationError } from '../../../../../Errors.js';
export interface TsConfigOps {
  compilerOptions: () => Promise<TsConfigWithMeta<string>['compilerOptions']>;
  exclude: () => Promise<TsConfigWithMeta<string>['exclude']>;
  extends: () => Promise<TsConfigWithMeta<string>['extends']>;
  files: () => Promise<TsConfigWithMeta<string>['files']>;
  get: typeof get;
  include: () => Promise<TsConfigWithMeta<string>['include']>;
  merge: ScopedFileMergeOp<Partial<TsConfigWithMeta<string>>>;
  meta: () => Promise<TsConfigMeta<string>>;
  readonly path: string;
  references: () => Promise<TsConfigWithMeta<string>['references']>;
  typeAcquisition: () => Promise<TsConfigWithMeta<string>['typeAcquisition']>;
  watchOptions: () => Promise<TsConfigWithMeta<string>['watchOptions']>;
}
async function get<F extends keyof TsConfigWithMeta<string>>(
  filePath: string,
  field?: undefined
): Promise<TsConfigWithMeta<string>>;
async function get<F extends keyof TsConfigWithMeta<string>>(
  filePath: string,
  field: F
): Promise<TsConfigWithMeta<string>[F]>;
async function get<F extends keyof TsConfigWithMeta<string>>(
  filePath: string,
  field: F[]
): Promise<{ [K in F]: TsConfigWithMeta<string>[K] }>;
async function get<F extends keyof TsConfigWithMeta<string>>(
  filePath: string,
  field?: F | F[]
): Promise<
  | { [K in F]: TsConfigWithMeta<string>[K] }
  | TsConfigWithMeta<string>
  | TsConfigWithMeta<string>[F]
> {
  const cfg = JSON.parse(
    await fs.readFile(filePath, 'utf8')
  ) as TsConfigWithMeta<string>;
  if (!field) return cfg;
  if (Array.isArray(field))
    return Object.fromEntries(field.map((f) => [f, cfg[f]])) as {
      [K in F]: TsConfigWithMeta<string>[K];
    };
  return cfg[field];
}
export const createTsConfigOps = async (
  cwd: string,
  filename: string
): Promise<TsConfigOps> => {
  const tsconfigPath = path.join(cwd, filename);
  if (!(await isFile(tsconfigPath)))
    throw new OperationError(
      `No tsconfig with name ${filename} found at ${tsconfigPath}`
    );

  return {
    path: tsconfigPath,
    merge: (input, confirmFn?) =>
      mergeJSON({
        baseFilePath: tsconfigPath,
        inputFilePathOrData: input,
        mergeFn: _merge,
        confirmFn
      }),
    get,
    meta: async () => {
      const {
        name,
        $schema,
        description,
        filename: fn
      } = await get(tsconfigPath, [
        '$schema',
        'name',
        'filename',
        'description'
      ]);
      return { $schema, name, description, filename: fn };
    },
    compilerOptions: async () => get(tsconfigPath, 'compilerOptions'),
    exclude: async () => get(tsconfigPath, 'exclude'),
    extends: async () => get(tsconfigPath, 'extends'),
    files: async () => get(tsconfigPath, 'files'),
    include: async () => get(tsconfigPath, 'include'),
    references: async () => get(tsconfigPath, 'references'),
    typeAcquisition: async () => get(tsconfigPath, 'typeAcquisition'),
    watchOptions: async () => get(tsconfigPath, 'watchOptions')
  };
};
