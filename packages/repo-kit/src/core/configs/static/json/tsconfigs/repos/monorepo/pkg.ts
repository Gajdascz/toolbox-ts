import type {
  TsConfigWithMeta,
  TsConfigWithMetaInput,
  RequiredProps
} from '@toolbox-ts/types';
import {
  type ArtifactsDir,
  TS_BUILD_INFO_EXT,
  ARTIFACTS_DIR,
  TSCONFIG_BASE_FILE,
  type OutDir,
  type SrcDir,
  DIST_DIR,
  SRC_DIR,
  TSCONFIG_SCHEMA,
  TSCONFIG_FILE,
  matchAllInDirs,
  dedupeArrays
} from '../../../../../../../../core/index.js';
import { SHARED_SRC_EXCLUDE } from '../shared.ts';

export { META } from '../shared.ts';

export const TO_ROOT_PATH = '../../';
export const TO_ARTIFACTS_PATH = `${TO_ROOT_PATH}${ARTIFACTS_DIR}`;
type TsBuildInfoFilePath<N extends string> =
  `${ArtifactsDir}/${N}.${typeof TS_BUILD_INFO_EXT}`;
export const TO_BASE_TSCONFIG_PATH =
  `${TO_ROOT_PATH}${TSCONFIG_BASE_FILE}` as const;
export type ToBaseTsConfigPath = typeof TO_BASE_TSCONFIG_PATH;

export const getToPkgTsBuildInfoFile = <N extends string>(
  pkg: N
): TsBuildInfoFilePath<N> =>
  `${TO_ARTIFACTS_PATH}/${pkg}.${TS_BUILD_INFO_EXT}` as TsBuildInfoFilePath<N>;

export type InputConfig<N extends string> = { description?: string } & Omit<
  TsConfigWithMetaInput<N, StaticFields, StaticCompilerOptions<N>>,
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
  outDir: DIST_DIR,
  rootDir: SRC_DIR,
  tsBuildInfoFile: getToPkgTsBuildInfoFile<N>(pkgName)
});
export type Config<N extends string> = RequiredProps<
  TsConfigWithMeta<N, StaticCompilerOptions<N>>,
  'compilerOptions' | 'extends'
>
  & StaticFields;
export interface StaticFields {
  $schema: typeof TSCONFIG_SCHEMA;
  extends: ToBaseTsConfigPath;
  filename: typeof TSCONFIG_FILE;
  references?: never;
}
export const STATIC_FIELDS: StaticFields = {
  $schema: TSCONFIG_SCHEMA,
  filename: TSCONFIG_FILE,
  extends: TO_BASE_TSCONFIG_PATH
} as const;

export const INCLUDE = matchAllInDirs([SRC_DIR]);
export const EXCLUDE = [...SHARED_SRC_EXCLUDE] as const;

export const define = <N extends string>({
  name,
  description = '',
  compilerOptions = {},
  exclude = [],
  include = [],
  ...rest
}: InputConfig<N>): Config<N> => ({
  ...STATIC_FIELDS,
  name,
  description,
  compilerOptions: { ...compilerOptions, ...getStaticCompilerOptions(name) },
  exclude: dedupeArrays(EXCLUDE, exclude),
  include: dedupeArrays(INCLUDE, include),
  ...rest
});
