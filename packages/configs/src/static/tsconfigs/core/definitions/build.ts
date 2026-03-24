import type { TsConfig } from '@toolbox-ts/types/defs/configs';
import {
  getPresetMeta,
  createStatic,
  createDefine,
  SRC_INCLUDE,
  SRC_EXCLUDE,
  ROOT_TO_BASE_TSCONFIG_PATH,
  FILENAMES
} from '../core.js';
import { DIRS } from '@toolbox-ts/constants/fs';
import { serializeJson } from '../../../../helpers.js';

export type Meta = TsConfig.Meta<'build'>;
export const META: Meta = getPresetMeta(
  'build',
  'Strict configuration for building production code.'
);
export const SHARED_COMPILER_OPTIONS = {
  declaration: true,
  declarationMap: true,
  sourceMap: true,
  removeComments: true,
  esModuleInterop: true,
  rewriteRelativeImportExtensions: true
} as const;

//#region> Monorepo

const MONOREPO_STATIC = createStatic({ ...META, files: [] }, { ...SHARED_COMPILER_OPTIONS });
/** Produces monorepo build  Input `compilerOptions` applied under static options (static wins). */
export const defineMonorepo = createDefine(MONOREPO_STATIC);
export type MonorepoConfig = Parameters<typeof defineMonorepo>[0];
//#endregion

//#region> Single Package
export const SINGLE_PACKAGE_STATIC = createStatic(
  { ...META, include: SRC_INCLUDE, exclude: SRC_EXCLUDE, extends: ROOT_TO_BASE_TSCONFIG_PATH },
  {
    ...SHARED_COMPILER_OPTIONS,
    outDir: DIRS.OUT,
    rootDir: DIRS.SRC,
    tsBuildInfoFile: ROOT_TO_BASE_TSCONFIG_PATH
  }
);
/** Produces single-package build  Input `compilerOptions` applied under static options (static wins). */
export const defineSinglePackage = createDefine(SINGLE_PACKAGE_STATIC);
export type SinglePackageConfig = Parameters<typeof defineSinglePackage>[0];

//#endregion

export const monorepoToFileEntry = (config?: MonorepoConfig) => ({
  [FILENAMES.build]: serializeJson(defineMonorepo(config))
});
export const singlePackageToFileEntry = (config?: SinglePackageConfig) => ({
  [FILENAMES.build]: serializeJson(defineSinglePackage(config))
});
