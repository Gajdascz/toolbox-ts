import {
  DIST_DIR,
  NODE_MODULES_DIR,
  ARTIFACTS_DIR,
  ENV_FILE,
  dedupeArrays,
  PNPM_STORE_FILE
} from '../../../../../core/index.js';

export const DEFAULTS = [
  DIST_DIR,
  NODE_MODULES_DIR,
  ARTIFACTS_DIR,
  ENV_FILE,
  `*${ENV_FILE}`,
  `*${ENV_FILE}.*`,
  PNPM_STORE_FILE,
  'DS_Store'
] as const;
export const define = (additional: string[] = []): string[] =>
  dedupeArrays(DEFAULTS, additional).sort();
