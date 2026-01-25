import type { Obj } from '@toolbox-ts/types';
import type { TsConfig } from '@toolbox-ts/types/defs/configs';

import {
  ARTIFACTS_DIR,
  type ArtifactsDir,
  OUT_DIR,
  type OutDir,
  SRC_DIR,
  type SrcDir
} from '../../../../fs-names.js';
import { matchAllInDirs } from '../../../../patterns.js';
import {
  BASE_META,
  BUILD_META,
  SCHEMA,
  SHARED_SRC_EXCLUDE,
  TS_BUILD_INFO_EXT,
  TSCONFIG
} from '../../../shared.js';
export const TO_ROOT_PATH = '../../';
export const TO_ARTIFACTS_PATH = `${TO_ROOT_PATH}${ARTIFACTS_DIR}`;
type TsBuildInfoFilePath<N extends string> =
  `${ArtifactsDir}/${N}.${typeof TS_BUILD_INFO_EXT}`;
export const TO_BASE_TSCONFIG_PATH =
  `${TO_ROOT_PATH}${BASE_META.filename}` as const;
export type ToBaseTsConfigPath = typeof TO_BASE_TSCONFIG_PATH;

export const getToPkgTsBuildInfoFile = <N extends string>(
  pkg: N
): TsBuildInfoFilePath<N> =>
  `${TO_ARTIFACTS_PATH}/${pkg}.${TS_BUILD_INFO_EXT}` as TsBuildInfoFilePath<N>;

export type InputConfig<N extends string> = { description?: string } & Omit<
  TsConfig.ConfigWithMetaInput<N, StaticFields, StaticCompilerOptions<N>>,
  'description'
>;
export interface StaticCompilerOptions<N extends string> {
  composite: true;
  outDir: OutDir;
  rootDir: SrcDir;
  tsBuildInfoFile: TsBuildInfoFilePath<N>;
}
export const getStaticCompilerOptions = <N extends string>(
  pkgName: N
): StaticCompilerOptions<N> => ({
  composite: true,
  outDir: OUT_DIR,
  rootDir: SRC_DIR,
  tsBuildInfoFile: getToPkgTsBuildInfoFile<N>(pkgName)
});
export type Config<N extends string> = Obj.RequiredProps<
  TsConfig.ConfigWithMeta<N, StaticCompilerOptions<N>>,
  'compilerOptions' | 'extends'
>
  & StaticFields;
export interface StaticFields {
  $schema: typeof SCHEMA;
  extends: ToBaseTsConfigPath;
  filename: typeof TSCONFIG;
  references?: never;
}
export const STATIC_FIELDS: StaticFields = {
  $schema: SCHEMA,
  filename: TSCONFIG,
  extends: TO_BASE_TSCONFIG_PATH
};

export const INCLUDE = matchAllInDirs([SRC_DIR]);
export const EXCLUDE = [...SHARED_SRC_EXCLUDE];
export const META = { ...BUILD_META };
