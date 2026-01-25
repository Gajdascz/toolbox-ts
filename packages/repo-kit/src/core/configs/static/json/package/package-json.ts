import type { PackageJson } from '@toolbox-ts/types';

import {
  DIST_DIR,
  DIST_INDEX_PATH,
  DIST_TYPES_INDEX_PATH,
  PACKAGE_JSON_FILE,
  README_FILE
} from '../architecture/constants/base/index.js';
export type StaticPackageJsonFields = keyof Pick<
  PackageJson,
  'exports' | 'files' | 'main' | 'types'
>;

/**
 * Applies only to monorepo root package.json files
 */
export const MONOREPO_ROOT_PACKAGE_JSON = {
  private: true,
  exports: undefined,
  main: undefined,
  files: undefined,
  types: undefined
} as const;
export type MonorepoPackageJson = PackageJson
  & typeof MONOREPO_ROOT_PACKAGE_JSON;

/**
 * Applies to single-package root package.json files and monorepo package package.json files
 */
export const SRC_PACKAGE_JSON = {
  main: DIST_INDEX_PATH,
  types: DIST_TYPES_INDEX_PATH,
  files: [DIST_DIR, README_FILE, PACKAGE_JSON_FILE],
  exports: { '.': { import: DIST_INDEX_PATH, types: DIST_TYPES_INDEX_PATH } }
} as const;
export type SrcPackageJson = PackageJson & typeof SRC_PACKAGE_JSON;
