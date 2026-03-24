import { ARTIFACTS as ARTIFACTS_DIR, DEV, DOCS, OUT, PACKAGES, SRC } from './dirs.js';
import { TS_ARTIFACTS } from './extensions.js';
import { CONFIG } from './files.js';

import { ARTIFACTS, at, UP } from './paths.js';

/**
 * - build: Relates to source code, building, compiling, and packaging the code, such as src, dist, artifacts, etc.
 * - dev: Relates to developing and running the code in the local environment only, such as .env, nodemon, .dev utilities, etc.
 * - test: Relates to testing the code, such as jest, mocha, etc.
 */
export const DOMAINS = ['build', 'dev', 'test'] as const;
export type Domain = (typeof DOMAINS)[number];

/**
 * - standard: A repository that contains a single package, with source code typically located in a src directory at the root of the repository.
 * - mono: A repository that contains multiple packages, with source code typically located in separate directories (often named after the packages) within a common src directory at the root of the repository.
 */
export const TYPES = ['standard', 'mono'] as const;
export type Type = (typeof TYPES)[number];

/**
 * - any: Source file location indiscriminate of repository type.
 * - standard: The src directory at the root of the repository.
 * - mono: The packages directory at the root of the repository.
 */
export const ROOT_SRC_DIR = {
  any: [SRC, PACKAGES] as const,
  [TYPES[0]]: SRC,
  [TYPES[1]]: PACKAGES
} as const;

export const SHARED_ROOT_PATHS = {
  ARTIFACTS: at.curr(ARTIFACTS.ROOT),
  BASE_TSCONFIG: at.curr(CONFIG.TS_BASE),
  DEV: at.curr(DEV),
  DOCS: at.curr(DOCS),
  REPORTS: {
    ROOT: at.curr(ARTIFACTS.REPORTS.ROOT),
    DEP_GRAPH: at.curr(ARTIFACTS.REPORTS.DEP_GRAPH),
    DEP_JSON: at.curr(ARTIFACTS.REPORTS.DEP_JSON),
    COVERAGE: at.curr(ARTIFACTS.REPORTS.COVERAGE)
  }
} as const;
export const STANDARD = {
  TYPE: TYPES[0],
  SRC: ROOT_SRC_DIR[TYPES[0]],
  PATHS: {
    ROOT_TO: {
      ...SHARED_ROOT_PATHS,
      SRC_DIR: at.curr(ROOT_SRC_DIR[TYPES[0]]),
      OUT_DIR: at.curr(OUT),
      TS_BUILD_INFO: `${at.curr(ARTIFACTS.CACHE.ROOT)}/.${TS_ARTIFACTS[1]}`
    }
  }
} as const;

const MONO_PKG_TO_ROOT = `${UP}${UP}`;
export const MONO = {
  TYPE: TYPES[1],
  SRC: ROOT_SRC_DIR[TYPES[1]],
  PKG_SRC: SRC,
  PATHS: {
    PKG_TO: {
      ROOT: MONO_PKG_TO_ROOT,
      ARTIFACTS: `${MONO_PKG_TO_ROOT}${ARTIFACTS_DIR}`,
      BASE_TSCONFIG: `${MONO_PKG_TO_ROOT}${CONFIG.TS_BASE}`,
      TS_BUILD_INFO: <const N extends string = string>(pkgName: N) =>
        `${MONO_PKG_TO_ROOT}${ARTIFACTS.CACHE.TS_BUILD_INFO}/${pkgName}.tsbuildinfo` as const
    },
    ROOT_TO: {
      ...SHARED_ROOT_PATHS,
      SRC_DIR: at.curr(ROOT_SRC_DIR[TYPES[1]]),
      PKG: <const N extends string = string>(pkgName: N) =>
        `${at.curr(PACKAGES)}/${pkgName}` as const,
      PKG_SRC: <const N extends string = string>(pkgName: N) =>
        `${at.curr(PACKAGES)}/${pkgName}/${SRC}` as const,
      PKG_OUT: <const N extends string = string>(pkgName: N) =>
        `${at.curr(PACKAGES)}/${pkgName}/${OUT}` as const,
      ANY_PKG_SRC: `${at.curr(PACKAGES)}/*/${SRC}` as const,
      ANY_PKG_OUT: `${at.curr(PACKAGES)}/*/${OUT}` as const
    }
  }
} as const;
