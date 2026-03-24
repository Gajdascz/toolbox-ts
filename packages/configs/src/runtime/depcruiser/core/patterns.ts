import { DIRS, EXTS, FILES, REPO } from '@toolbox-ts/constants/fs';

const BOUNDARY = '(^|/)';
const DOT = '[.]';

export const SRC_FILE_EXTS = EXTS.SRC.join('|');
export const JSON_FILE_EXTS = EXTS.JSON.join('|');
/**
 * Matches all packages in node_modules.
 */
export const NODE_MODULES_PACKAGES = 'node_modules/(?:@[^/]+/[^/]+|[^/]+)';
/**
 * Directories containing source files for any type of repository.
 */
export const ROOT_SRC_DIRS = REPO.ROOT_SRC_DIR.any.join('|');
export const SRC_FILES_DIR = `^(${DIRS.SRC})`;
export const TEST_FILE_INFIXES = FILES.TEST_INFIXES.join('|');
export const TEST_FILES = `${BOUNDARY}[^/]+[.](${TEST_FILE_INFIXES})[.](?:${SRC_FILE_EXTS})$`;
export const TS_CONFIG_FILES = `${BOUNDARY}tsconfig(?:${DOT}[^/]*)?${DOT}json$`;
export const TS_DECLARATION_FILES = `${DOT}d${DOT}ts$`;

const { LINT_STAGED, VITEST, OXFMT, OXLINT, COMMITLINT, WEBPACK, BABEL, VITE, STYLELINT } =
  FILES.STEMS.CONFIGS;

export const CONFIG_INFIXED_FILE_STEMS = [
  LINT_STAGED,
  VITEST,
  OXFMT,
  OXLINT,
  COMMITLINT,
  WEBPACK,
  BABEL,
  VITE,
  STYLELINT
];

export const DOT_FILES = `${BOUNDARY}${DOT}[^/]+${DOT}(?:${SRC_FILE_EXTS}|${JSON_FILE_EXTS})$`;
export const CONFIG_INFIXED_FILES = `${BOUNDARY}(?:${CONFIG_INFIXED_FILE_STEMS.join('|')})${DOT}config${DOT}(?:${SRC_FILE_EXTS}|${JSON_FILE_EXTS})$`;
