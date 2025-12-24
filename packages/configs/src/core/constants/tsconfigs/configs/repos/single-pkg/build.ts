import type {
  RequiredProps,
  TsConfigWithMeta,
  TsConfigWithMetaInput
} from '@toolbox-ts/types';

import {
  ALL_SRC_DIRS,
  ARTIFACTS_DIR,
  matchAllInDirs,
  OUT_DIR,
  type OutDir,
  SRC_DIR,
  type SrcDir
} from '../../../../base.js';
import {
  BUILD_META,
  type BuildMeta,
  ROOT_TO_BASE_TSCONFIG_PATH,
  type RootToBaseTsConfigPath,
  SHARED_DEFAULT_BUILD_COMPILER_OPTIONS,
  SHARED_SRC_EXCLUDE,
  TS_BUILD_INFO_EXT
} from '../../../shared.js';

export const TS_BUILD_INFO_FILE = `tsconfig.${TS_BUILD_INFO_EXT}`;
export const PATH_TO_TS_BUILD_INFO_FILE = `./${ARTIFACTS_DIR}/${TS_BUILD_INFO_FILE}`;
export type PathToTsBuildInfoFile = typeof PATH_TO_TS_BUILD_INFO_FILE;

//#region Config
export type Config = RequiredProps<
  TsConfigWithMeta<BuildMeta['name'], StaticCompilerOptions>,
  'compilerOptions' | 'exclude' | 'include'
>;
export type InputConfig = TsConfigWithMetaInput<
  BuildMeta['name'],
  StaticFields,
  StaticCompilerOptions
>;
export interface StaticCompilerOptions {
  composite?: false | never;
  outDir: OutDir;
  rootDir: SrcDir;
  tsBuildInfoFile: PathToTsBuildInfoFile;
}
export interface StaticFields extends BuildMeta {
  extends: RootToBaseTsConfigPath;
  references?: never;
}
export const STATIC_FIELDS: StaticFields = {
  ...BUILD_META,
  extends: ROOT_TO_BASE_TSCONFIG_PATH
} as const;
export const STATIC_COMPILER_OPTIONS: StaticCompilerOptions = {
  outDir: OUT_DIR,
  rootDir: SRC_DIR,
  tsBuildInfoFile: PATH_TO_TS_BUILD_INFO_FILE
} as const;
export const INCLUDE: Config['include'] = matchAllInDirs(ALL_SRC_DIRS);
export const EXCLUDE = [...SHARED_SRC_EXCLUDE] as const;
export const META = { ...BUILD_META } as const;
export const DEFAULT_COMPILER_OPTIONS: InputConfig['compilerOptions'] = {
  ...SHARED_DEFAULT_BUILD_COMPILER_OPTIONS
} as const;
//#endregion
