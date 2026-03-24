import { STEMS, STATIC_SRC, TEST_INFIXES } from './files.js';
import {
  NODE_MODULES,
  ARTIFACTS,
  OUT,
  TMP,
  DOCS,
  CONSTANTS,
  TYPES,
  DATA,
  FIXTURES,
  SRC,
  PACKAGES,
  DEV,
  SNAPSHOTS
} from './dirs.js';
import { SRC as SRC_EXTS, DATA as DATA_EXTS } from './extensions.js';

/** Glob pattern builders for matching files and directories. */
export const match = {
  /**
   * Matches files containing `segment` between other name parts.
   * @example
   * // match.infix('test') → '*.test.*'
   * // ✓ app.test.ts
   * // ✓ utils.test.js
   * // ✗ test.ts
   * // ✗ app.ts
   */
  infix: <const S extends string = string>(segment: S) => `*.${segment}.*` as const,
  /**
   * Matches files with the given stem (filename without extension).
   * @example
   * // match.stem('index') → 'index.*'
   * // ✓ index.ts
   * // ✓ index.css
   * // ✗ main.ts
   * // ✗ reindex.ts
   */
  stem: <const N extends string = string>(name: N) => `${name}.*` as const,
  /**
   * Matches files with the given extension.
   * @example
   * // match.ext('ts') → '*.ts'
   * // ✓ app.ts
   * // ✓ index.ts
   * // ✗ app.js
   * // ✗ tsconfig.json
   */
  ext: <const E extends string = string>(ext: E) => `*.${ext}` as const,
  /**
   * Matches `pattern` at any depth in the tree.
   * @example
   * // match.deep('*.ts') → '**\/*.ts'
   * // ✓ index.ts
   * // ✓ src/index.ts
   * // ✓ src/utils/helpers/index.ts
   * // ✗ src/index.js
   */
  deep: <const P extends string = string>(pattern: P) => `**/${pattern}` as const,
  /**
   * Matches all descendants under a directory.
   * @example
   * // match.under('src') → 'src/**'
   * // src/
   * //   ✓ index.ts
   * //   utils/
   * //     ✓ helpers.ts
   * // ✗ lib/index.ts
   */
  under: <const D extends string = string>(dir: D) => `${dir}/**` as const,
  /**
   * Finds `dir` at any depth, then matches all its descendants.
   * @example
   * // match.deepUnder('utils') → '**\/utils/**'
   * // src/utils/
   * //   ✓ index.ts
   * //   helpers/
   * //     ✓ parse.ts
   * // lib/utils/
   * //   ✓ format.ts
   * // ✗ src/index.ts
   */
  deepUnder: <const D extends string = string>(dir: D) => `**/${dir}/**` as const,
  /**
   * Matches only direct children of a directory (non-recursive).
   * @example
   * // match.within('src') → 'src/*'
   * // src/
   * //   ✓ index.ts
   * //   ✓ app.ts
   * //   utils/
   * //     ✗ helpers.ts
   */
  within: <const D extends string = string>(dir: D) => `${dir}/*` as const,
  /**
   * Matches `pattern` inside any immediate subdirectory of `dir`.
   * @example
   * // match.inSubdir('src', '*.ts') → 'src/*\/*.ts'
   * // src/
   * //   ✗ index.ts
   * //   utils/
   * //     ✓ helpers.ts
   * //   core/
   * //     ✓ app.ts
   * //     deep/
   * //       ✗ nested.ts
   */
  inSubdir: <const D extends string = string, const P extends string = string>(
    dir: D,
    pattern: P
  ) => `${dir}/*/${pattern}` as const,
  /**
   * Matches `pattern` and all its descendants inside any immediate subdirectory of `dir`.
   * @example
   * // match.deepInSubdir('src', 'tests') → 'src/*\/tests/**'
   * // src/
   * //   utils/
   * //     tests/
   * //       ✓ unit.ts
   * //       integration/
   * //         ✓ e2e.ts
   * //   core/
   * //     tests/
   * //       ✓ app.test.ts
   * //   ✗ tests/root.ts
   */
  deepInSubdir: <const D extends string = string, const P extends string = string>(
    dir: D,
    pattern: P
  ) => `${dir}/*/${pattern}/**` as const
} as const;

/** Factories for `{ MATCH, DEEP }` and `{ UNDER, DEEP }` pattern pairs. */
export const makePair = {
  fileStem: <const N extends string = string>(name: N) => {
    const MATCH = match.stem(name);
    return { MATCH, DEEP: match.deep(MATCH) } as const;
  },
  fileInfix: <const N extends string = string>(name: N) => {
    const MATCH = match.infix(name);
    return { MATCH, DEEP: match.deep(MATCH) } as const;
  },
  fileExt: <const E extends string = string>(ext: E) => {
    const MATCH = match.ext(ext);
    return { MATCH, DEEP: match.deep(MATCH) } as const;
  },

  filesStem: <const N extends string = string>(name: readonly N[]) => {
    const MATCH = name.map(match.stem);
    return { MATCH, DEEP: MATCH.map(match.deep) } as const;
  },
  filesInfix: <const N extends string = string>(name: readonly N[]) => {
    const MATCH = name.map(match.infix);
    return { MATCH, DEEP: MATCH.map(match.deep) } as const;
  },
  filesExt: <const E extends string = string>(ext: readonly E[]) => {
    const MATCH = ext.map(match.ext);
    return { MATCH, DEEP: MATCH.map(match.deep) } as const;
  },
  filesStemAndInfix: <const N extends string>(name: readonly N[]) => {
    const MATCH = name.flatMap((n) => [match.stem(n), match.infix(n)]);
    return { MATCH, DEEP: MATCH.map(match.deep) } as const;
  },
  dir: <const D extends string = string>(dir: D) =>
    ({ UNDER: match.under(dir), DEEP: match.deepUnder(dir) }) as const,
  dirs: <const D extends string>(...dirs: D[]) => {
    return { UNDER: dirs.map(match.under), DEEP: dirs.map(match.deepUnder) } as const;
  }
};

/** Single-file pattern pairs for well-known file roles. */
export const FILE = {
  /**
   * Any file with at `config` infix
   * @example `commitlint.config.ts`
   */
  CONFIG: makePair.fileInfix('config'),
  /**
   * Any file prefixed with a dot.
   * @example `.gitignore`
   */
  DOT: makePair.fileStem(''),
  /**
   * Any file with the stem `index
   * @example `index.ts`
   */
  INDEX: makePair.fileStem(STEMS.SRC.INDEX),
  /**
   * Any file with the stem `types`
   * @example `types.ts`
   */
  TYPES: makePair.fileStem(STEMS.SRC.TYPES),
  /**
   * Any file with the stem `constants`
   * @example `constants.ts`
   */
  CONSTANTS: makePair.fileStem(STEMS.SRC.CONSTANTS),
  /**
   * Any file with the extension `md`
   * @example `README.md`
   */
  MD: makePair.fileExt('md'),
  /**
   * Any file ending with `lock` before the extension.
   * @example `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
   */
  LOCK: makePair.fileStem('*lock')
} as const;

/** Multi-file pattern pairs grouped by file role or extension category. */
export const FILES = {
  /**
   * Any file with a supported test infix.
   * @example `app.test.ts`, `helpers.spec.js`, `index.test-d.ts`
   */
  TESTS: makePair.filesInfix(TEST_INFIXES),
  /**
   * Any file with a supported source code extension.
   * @example `app.ts`, `index.js`, `component.tsx`, `home.astro`
   */
  SRC: makePair.filesExt(SRC_EXTS),
  /**
   * Any file with a supported data file extension.
   * @example `data.json`, `config.yaml`, `info.xml`, `records.csv`
   */
  DATA: makePair.filesExt(DATA_EXTS),
  /**
   * Any file with the stem or infix `constants`
   * @example `constants.ts`, `app.constants.js`
   */
  CONSTANTS: makePair.filesStemAndInfix([STEMS.SRC.CONSTANTS]),
  /**
   * Any file with a supported stem or infix matching declaration-only files within a source directory.
   * @example `types.ts`, `app.types.js`, `helpers.constants.ts`
   */
  STATIC_SRC: makePair.filesStemAndInfix(STATIC_SRC)
} as const;

/** Pattern pairs for well-known project directories. */
export const DIR = {
  /**
   * `.dev` directory for development-only files that shouldn't be published or included in production.
   */
  DEV: makePair.dir(DEV),
  /**
   * `.tmp` directory for temporary files that can be safely deleted between runs, like build caches, temp outputs, or generated artifacts that aren't meant to be checked in or published.
   */
  TMP: makePair.dir(TMP),
  /**
   * `constants` directory for static definitions shared across a domain.
   */
  CONSTANTS: makePair.dir(CONSTANTS),
  /**
   * `types` directory for type definitions.
   */
  TYPES: makePair.dir(TYPES),
  /**
   * `data` directory for static data files like .json, .yaml, .md, or data.ts that are meant to be consumed as data rather than code.
   */
  DATA: makePair.dir(DATA),
  /**
   * `fixtures` directory for test fixtures, mock data, or any static files used during testing that aren't meant to be published.
   */
  FIXTURES: makePair.dir(FIXTURES),
  /**
   * `src` directory for source code files.
   */
  SRC: makePair.dir(SRC),
  /**
   * `packages` directory for monorepo packages, where each immediate subdirectory is a separate package with its own `package.json` and source files.
   */
  PACKAGES: makePair.dir(PACKAGES),
  /**
   * `node_modules` directory for installed dependencies.
   */
  NODE_MODULES: makePair.dir(NODE_MODULES),
  /**
   * `out` directory for build outputs that are meant to be published or deployed, like compiled code, bundled assets, or distribution packages. This is distinct from `tmp`, which is for intermediate files that can be safely deleted and aren't meant to be published.
   */
  OUT: makePair.dir(OUT),
  /**
   * `artifacts` directory for generated files that are not meant to be published, such as build caches, test coverage reports, temporary outputs, and other intermediate files created during development and build processes. This is distinct from `out`, which is for final build outputs that are meant to be published or deployed.
   */
  ARTIFACTS: makePair.dir(ARTIFACTS),
  /**
   * `docs` directory for project documentation files that are not meant to be published as part of the package but are used for developer reference, guides, API docs, etc.
   */
  DOCS: makePair.dir(DOCS),
  /**
   * `__snapshots__` directory for test snapshot files that are generated during testing and are not meant to be published. This is a common convention used by testing frameworks like Jest and Vitest for storing snapshot files.
   */
  SNAPSHOTS: makePair.dir(SNAPSHOTS)
} as const;

const _STATIC_SRC_DIRS = [CONSTANTS, TYPES] as const;
const _ARTIFACTS_DIRS = [ARTIFACTS, OUT, TMP] as const;
/** Pattern pairs for logical directory groups. */
export const DIRS = {
  /**
   * Directories that typically contain only static definitions like types, constants, or configuration data without runtime logic or side effects.
   */
  STATIC_SRC: makePair.dirs(..._STATIC_SRC_DIRS),
  /**
   * Directories that typically contain generated artifacts, build outputs, temporary files, and other non-source files that are not meant to be published. This includes build caches, test coverage reports, compiled code, etc.
   */
  ARTIFACTS: makePair.dirs(..._ARTIFACTS_DIRS)
} as const;

const _ALL_STATIC_SRC = [...FILES.STATIC_SRC.DEEP, ...DIRS.STATIC_SRC.DEEP] as const;
const _ALL_DATA = [...FILES.DATA.DEEP, DIR.DATA.DEEP] as const;
/** Pre-composed glob sets for common cross-cutting concerns (ignore lists, coverage exclusions, etc.). */
export const ALL = {
  /** Directories that should be ignored in virtually all tool configs. */
  COMMON_IGNORE: [
    DIR.NODE_MODULES.DEEP,
    DIR.ARTIFACTS.DEEP,
    DIR.DOCS.DEEP,
    DIR.OUT.DEEP,
    DIR.TMP.DEEP,
    DIR.SNAPSHOTS.DEEP
  ],
  /** Declaration-only source files matched by infix, stem, or known directory. */
  STATIC_SRC: _ALL_STATIC_SRC,
  /** Static data files matched by extension or data directory. */
  DATA: _ALL_DATA,
  /** Union of STATIC_SRC and DATA */
  STATIC: [..._ALL_STATIC_SRC, ..._ALL_DATA],
  /** Test files matched by infix plus fixture directories. */
  TESTS: [...FILES.TESTS.DEEP, DIR.FIXTURES.DEEP]
} as const;
