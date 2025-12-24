import type {
  RequiredProps,
  TsConfigWithMeta,
  TsConfigWithMetaInput
} from '@toolbox-ts/types';

import {
  BUILD_META,
  type BuildMeta,
  SHARED_DEFAULT_BUILD_COMPILER_OPTIONS
} from '../../../shared.js';

export type Config = RequiredProps<
  TsConfigWithMeta<BuildMeta['name'], StaticCompilerOptions>,
  'files' | 'references'
>
  & StaticFields;

export type InputConfig = TsConfigWithMetaInput<
  BuildMeta['name'],
  StaticFields,
  StaticCompilerOptions
>;
export interface StaticCompilerOptions {
  composite?: false | never;
  outDir?: never;
  rootDir?: never;
  tsBuildInfoFile?: never;
}
export interface StaticFields extends BuildMeta {
  exclude?: never;
  extends?: never;
  files: [];
  include?: never;
}
export const STATIC_FIELDS: StaticFields = {
  ...BUILD_META,
  files: []
} as const;
export const META = { ...BUILD_META } as const;
export const DEFAULT_COMPILER_OPTIONS: InputConfig['compilerOptions'] = {
  ...SHARED_DEFAULT_BUILD_COMPILER_OPTIONS
} as const;
