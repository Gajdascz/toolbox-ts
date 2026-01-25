import type { Obj } from '@toolbox-ts/types';
import type { TsConfig } from '@toolbox-ts/types/defs/configs';

import {
  BUILD_META,
  type BuildMeta,
  SHARED_DEFAULT_BUILD_COMPILER_OPTIONS
} from '../../../shared.js';

export type Config = Obj.RequiredProps<
  TsConfig.ConfigWithMeta<BuildMeta['name'], StaticCompilerOptions>,
  'files' | 'references'
>
  & StaticFields;

export type InputConfig = TsConfig.ConfigWithMetaInput<
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
export const STATIC_FIELDS: StaticFields = { ...BUILD_META, files: [] };
export const META = { ...BUILD_META };
export const DEFAULT_COMPILER_OPTIONS: InputConfig['compilerOptions'] = {
  ...SHARED_DEFAULT_BUILD_COMPILER_OPTIONS
};
