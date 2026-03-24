import { type AnyExtension, withExt } from './extensions.js';

export const withInfix = <N extends string, S extends string, E extends AnyExtension>(
  name: N,
  suffix: S,
  ext: E
): `${N}.${S}.${E}` => `${name}.${suffix}.${ext}` as const;

export const STEMS = {
  TXT: { LICENSE: 'LICENSE' },
  SRC: { INDEX: 'index', TYPES: 'types', CONSTANTS: 'constants', DATA: 'data', ERRORS: 'errors' },
  VCS: { GITIGNORE: '.gitignore' },
  PKG_MANAGER: {
    PNPM: { WORKSPACE: 'pnpm-workspace', STORE: '.pnpm-store', LOCK: 'pnpm-lock' },
    NPM: { LOCK: 'package-lock', PACKAGE: 'package' }
  },
  RUNTIME: { ENV: '.env' },
  MD: {
    README: 'README',
    CONTRIBUTING: 'CONTRIBUTING',
    CHANGELOG: 'CHANGELOG',
    CODE_OF_CONDUCT: 'CODE_OF_CONDUCT'
  },
  CONFIGS: {
    TSCONFIG: 'tsconfig',
    LINT_STAGED: 'lint-staged',
    VITEST: 'vitest',
    OXFMT: 'oxfmt',
    OXLINT: 'oxlint',
    COMMITLINT: 'commitlint',
    MD_LINT: '.markdownlint-cli2',
    DEPCRUISER: '.dependency-cruiser',
    WEBPACK: 'webpack',
    BABEL: 'babel',
    VITE: 'vite',
    STYLELINT: 'stylelint'
  }
} as const;

export const LICENSE = STEMS.TXT.LICENSE;
export const PACKAGE_JSON = withExt(STEMS.PKG_MANAGER.NPM.PACKAGE, 'json');
export const GITIGNORE = STEMS.VCS.GITIGNORE;

export const MD = {
  README: withExt(STEMS.MD.README, 'md'),
  CONTRIBUTING: withExt(STEMS.MD.CONTRIBUTING, 'md'),
  CHANGELOG: withExt(STEMS.MD.CHANGELOG, 'md'),
  CODE_OF_CONDUCT: withExt(STEMS.MD.CODE_OF_CONDUCT, 'md')
} as const;

export const CONFIG = {
  LINT_STAGED: withInfix(STEMS.CONFIGS.LINT_STAGED, 'config', 'ts'),
  MD_LINT: withExt(STEMS.CONFIGS.MD_LINT, 'mjs'),
  VITEST: withInfix(STEMS.CONFIGS.VITEST, 'config', 'ts'),
  TS: withExt(STEMS.CONFIGS.TSCONFIG, 'json'),
  TS_BASE: withInfix(STEMS.CONFIGS.TSCONFIG, 'base', 'json'),
  TS_BUILD: withInfix(STEMS.CONFIGS.TSCONFIG, 'build', 'json'),
  TS_TEST: withInfix(STEMS.CONFIGS.TSCONFIG, 'test', 'json'),
  TS_DEV: withInfix(STEMS.CONFIGS.TSCONFIG, 'dev', 'json'),
  DEPCRUISER: withExt(STEMS.CONFIGS.DEPCRUISER, 'js'),
  OXFMT: withInfix(STEMS.CONFIGS.OXFMT, 'config', 'ts'),
  OXLINT: withInfix(STEMS.CONFIGS.OXLINT, 'config', 'ts'),
  COMMITLINT: withInfix(STEMS.CONFIGS.COMMITLINT, 'config', 'ts'),
  WEBPACK: withInfix(STEMS.CONFIGS.WEBPACK, 'config', 'js'),
  BABEL: withInfix(STEMS.CONFIGS.BABEL, 'config', 'js'),
  VITE: withInfix(STEMS.CONFIGS.VITE, 'config', 'ts'),
  STYLELINT: withInfix(STEMS.CONFIGS.STYLELINT, 'config', 'ts')
} as const;
export type ConfigFile = (typeof CONFIG)[keyof typeof CONFIG];

export const INDEX = {
  JS: withExt(STEMS.SRC.INDEX, 'js'),
  TS: withExt(STEMS.SRC.INDEX, 'ts'),
  DTS: withExt(STEMS.SRC.INDEX, 'd.ts')
} as const;
export type IndexFile = (typeof INDEX)[keyof typeof INDEX];

export const PNPM = {
  WS_YAML: withExt(`${STEMS.PKG_MANAGER.PNPM.WORKSPACE}`, 'yaml'),
  STORE: STEMS.PKG_MANAGER.PNPM.STORE,
  LOCK_YAML: withExt(STEMS.PKG_MANAGER.PNPM.LOCK, 'yaml')
} as const;
export type PnpmFile = (typeof PNPM)[keyof typeof PNPM];

export const TEST_INFIXES = [
  'test',
  'test-d',
  'spec',
  'spec-d',
  'bench',
  'mock',
  'mocks',
  'fixture',
  'fixtures'
] as const;
export const TEST_INFIXES_SET = new Set<string>(TEST_INFIXES);
export type TestFileInfix = (typeof TEST_INFIXES)[number];

export const DEP_REPORT = {
  GRAPH: withExt('graph', 'svg'),
  JSON: withExt('report', 'json')
} as const;
export type DepReportFile = (typeof DEP_REPORT)[keyof typeof DEP_REPORT];

/**
 * Infix/Name identifiers for source files that contain only declarations like
 * types, constants, or static data.
 */
export const STATIC_SRC = [
  STEMS.SRC.INDEX,
  STEMS.SRC.TYPES,
  STEMS.SRC.CONSTANTS,
  STEMS.SRC.DATA,
  'schema',
  'enums',
  'config',
  'defaults'
] as const;
export type StaticSrcFile = (typeof STATIC_SRC)[keyof typeof STATIC_SRC];
