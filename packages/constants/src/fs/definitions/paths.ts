import {
  ARTIFACTS as _ARTIFACTS,
  REPORTS,
  CACHE,
  COVERAGE,
  OUT as _OUT,
  DEPENDENCIES,
  BUILD_INFO
} from './dirs.js';
import { DEP_REPORT, INDEX } from './files.js';

export const CURR = './';
export const UP = '../';
export const ROOT = '/';
export const at = {
  curr: <const P extends string = string>(path: P) => `${CURR}${path}` as const,
  up: <const P extends string = string>(path: P) => `${UP}${path}` as const,
  root: <const P extends string = string>(path: P) => `${ROOT}${path}` as const
} as const;

const _artifactsReports = `${_ARTIFACTS}/${REPORTS}`;
export const ARTIFACTS = {
  ROOT: _ARTIFACTS,
  REPORTS: {
    ROOT: _artifactsReports,
    DEP_GRAPH: `${_artifactsReports}/${DEPENDENCIES}/${DEP_REPORT.GRAPH}`,
    DEP_JSON: `${_artifactsReports}/${DEPENDENCIES}/${DEP_REPORT.JSON}`,
    COVERAGE: `${_artifactsReports}/${COVERAGE}`
  },
  CACHE: { ROOT: `${_ARTIFACTS}/${CACHE}`, TS_BUILD_INFO: `${_ARTIFACTS}/${CACHE}/${BUILD_INFO}` }
} as const;

export const OUT = {
  ROOT: _OUT,
  INDEX: `${_OUT}/${INDEX.JS}`,
  TYPES: `${_OUT}/${INDEX.DTS}`
} as const;
