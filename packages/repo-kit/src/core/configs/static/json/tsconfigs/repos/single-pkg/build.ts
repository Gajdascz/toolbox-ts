import {
  TS_BUILD_INFO_EXT,
  ARTIFACTS_DIR,
  type OutDir,
  type SrcDir,
  type TsConfigBaseFile,
  DIST_DIR,
  SRC_DIR,
  TSCONFIG_BASE_FILE,
  ANY_ROOT_SRC_DIR,
  matchAllInDirs,
  dedupeArrays
} from '../../../../../../../../core/index.js';
import type {
  RequiredProps,
  TsConfigWithMeta,
  TsConfigWithMetaInput
} from '@toolbox-ts/types';
import {
  type BuildMeta,
  META,
  SHARED_SRC_EXCLUDE,
  DEFAULT_BUILD_COMPILER_OPTIONS
} from '../shared.ts';
export { META } from '../shared.ts';
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
  extends: `./${TsConfigBaseFile}`;
  references?: never;
}
export const STATIC_FIELDS: StaticFields = {
  ...META,
  extends: `./${TSCONFIG_BASE_FILE}`
} as const;
export const STATIC_COMPILER_OPTIONS: StaticCompilerOptions = {
  outDir: DIST_DIR,
  rootDir: SRC_DIR,
  tsBuildInfoFile: PATH_TO_TS_BUILD_INFO_FILE
} as const;
export const INCLUDE: Config['include'] = matchAllInDirs(ANY_ROOT_SRC_DIR);
export const EXCLUDE = [...SHARED_SRC_EXCLUDE] as const;

export const DEFAULT_COMPILER_OPTIONS: InputConfig['compilerOptions'] = {
  ...DEFAULT_BUILD_COMPILER_OPTIONS
} as const;
//#endregion

export const define = ({
  compilerOptions = {},
  include = [],
  exclude = []
}: InputConfig = {}): Config => ({
  ...STATIC_FIELDS,
  compilerOptions: {
    ...DEFAULT_COMPILER_OPTIONS,
    ...compilerOptions,
    ...STATIC_COMPILER_OPTIONS
  },
  include: dedupeArrays(INCLUDE, include),
  exclude: dedupeArrays(EXCLUDE, exclude)
});
