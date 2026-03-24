//#region> Source
/**
 * Where a project/package's source code exists.
 * @example
 * ├─ src
 * │  ├─ index.ts
 * │  ├─ utils.ts
 * │  └─ ...
 * ├─ package.json
 * └─ ...
 *
 */
export const SRC = 'src';
/**
 * Where a monorepo's packages exist.
 * @example
 * ├─ packages
 * │  ├─ package1
 * │  │  ├─ src
 * │  │  ├─ dist
 * │  │  └─ package.json
 * │  ├─ package2
 * │  │  ├─ src
 * │  │  ├─ dist
 * │  │  └─ package.json
 * │  └─ ...
 */
export const PACKAGES = 'packages';
/**
 * Where public files exist, such as static assets. Used for project-level public files that are meant to be served or published, such as static assets for a web application, etc.
 * @example
 * ├─ public
 * │  ├─ index.html
 * │  ├─ favicon.ico
 * │  └─ assets
 * │     ├─ logo.png
 * │     ├─ styles.css
 * │     └─ fonts
 * │        ├─ font.woff2
 * │        └─ font.woff
 */
export const PUBLIC = 'public';
/**
 * Where static asset files exist. Used for project-level static asset files that are meant to be served or published, such as images, stylesheets, fonts, etc.
 * @example
 * ├─ assets
 * │  ├─ logo.png
 * │  ├─ styles.css
 * │  ├─ fonts
 * │  │  ├─ font.woff2
 * │  │  └─ font.woff
 */
export const ASSETS = 'assets';
//#endregion

//#region> Tool Specific
/**
 * Github related files, such as workflows, issue templates, pull request templates, etc.
 * @see {@link https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions}
 * @example
 * ├─ .github
 * │  ├─ workflows
 * │  │  ├─ ci.yml
 * │  │  └─ cd.yml
 * │  ├─ ISSUE_TEMPLATE
 * │  │  ├─ bug_report.md
 * │  │  └─ feature_request.md
 * │  └─ PULL_REQUEST_TEMPLATE.md
 */
export const GITHUB = '.github';
/**
 * Husky related files, such as pre-commit hooks, commit-msg hooks, etc.
 * @see {@link https://typicode.github.io/husky/#/}
 * @example
 * ├─ .husky
 * │  ├─ _
 * |  | ├─ husky.sh
 * │  │ └─ ...
 * │  ├─ pre-commit
 * │  ├─ commit-msg
 */
export const HUSKY = '.husky';
/**
 * Changeset related files, such as changeset summaries, etc. Used for monorepos.
 * @see {@link https://github.com/changesets/changesets}
 */
export const CHANGESETS = '.changeset';
/**
 * VSCode related files, such as settings, extensions, launch configurations, etc. Used for project-level VSCode configurations, such as workspace settings, recommended extensions, etc.
 * @see {@link https://code.visualstudio.com/docs/editing/workspaces/workspaces}
 * @example
 * ├─ .vscode
 * │  ├─ settings.json
 * │  ├─ extensions.json
 * │  └─ launch.json
 */
export const VSCODE = '.vscode';
//#endregion

//#region> Main Artifacts
/**
 * Where artifact files exist (e.g. test reports, build info files, dependency graphs, performance profiles, etc.)
 * @example
 * ├─ .artifacts
 * │  ├─ test-artifact.json
 * │  └─ build-info
 * │     ├─ pkg1.tsbuildinfo
 * │     └─ pkg2.tsbuildinfo
 */
export const ARTIFACTS = '.artifacts';
/**
 * Where cache files exist, should be directed to the `.artifacts` directory but may exist in `node_modules` directories.
 * @example
 * ├─ .artifacts
 * │  ├─ .cache
 * │  │  ├─ depcruiser.json
 * │  │  └─ vitest.json
 */
export const CACHE = '.cache';
/**
 * Where TypeScript build info files exist in monorepo's, found in the `.artifacts/.cache` directory.
 * @important In monorepo's only. In standard repositories, there should just be a single tsbuildinfo file in the root of `.artifacts/.cache` if one exists at all.
 * @example
 * ├─ .artifacts
 * │  ├─ .cache
 * |  │  ├─ build-info
 * │  │  │  ├─ pkg1.tsbuildinfo
 * │  │  │  └─ pkg2.tsbuildinfo
 *
 * // In a standard repository, there would just be:
 * ├─ .artifacts
 * │  ├─ .cache
 * |  │  └─ pkg.tsbuildinfo
 */
export const BUILD_INFO = 'build-info';
/**
 * Where report files exist, found in the `.artifacts`.
 * @example
 * ├─ .artifacts
 * |  ├─ reports
 * │  │  ├─ test-report.xml
 * │  │  ├─ dependencies.svg
 * │  │  ├─ coverage.html
 * │  │  └─ performance.json
 */
export const REPORTS = 'reports';
/**
 * Where coverage files exist, found in the `.artifacts/reports` directory.
 * @example
 * ├─ .artifacts
 * |  ├─ reports
 * |  │  ├─ coverage
 * │  │  │  ├─ lcov.info
 * │  │  │  ├─ coverage-final.json
 * │  │  │  └─ index.html
 */
export const COVERAGE = 'coverage';
/**
 * Where dependency graph/report files exist, found in the `.artifacts/reports` directory.
 * @example
 * ├─ .artifacts
 * |  ├─ reports
 * │  │  ├─ graph.svg
 * │  │  └─ report.json
 */
export const DEPENDENCIES = 'dependencies';
//#endregion

//#region> Misc Artifacts
/**
 * Where build-related files exist, such as compiled output, artifacts, etc. Used for project-level build outputs and artifacts that are meant to be published or distributed.
 * @example
 * ├─ dist
 * │  ├─ index.js
 * │  ├─ index.d.ts
 * │  └─ package.json
 */
export const OUT = 'dist';
/**
 * Where installed npm package dependencies exist. Used for installed dependencies from npm, such as those installed via npm install, pnpm install, etc.
 * @example
 * ├─ node_modules
 * │  ├─ package1
 * │  │  ├─ index.js
 * │  │  └─ package.json
 * │  ├─ package2
 * │  │  ├─ index.js
 * │  │  └─ package.json
 * │  └─ ...
 */
export const NODE_MODULES = 'node_modules';
/**
 * Where temporary files exist, such as temporary build files, temporary test files, etc. Used for project-level temporary files that are generated during development and build processes and are not meant to be published.
 * @example
 * ├─ .tmp
 * │  ├─ temp1.txt
 * │  └─ temp2.txt
 */
export const TMP = '.tmp';

//#endregion

//#region> Other
/**
 * Where documentation files exist. Used for project-level documentation.
 * @example
 * ├─ docs
 * │  ├─ getting-started.md
 * │  ├─ api.md
 * │  └─ ...
 */
export const DOCS = 'docs';
/**
 * Where development-related files exist, such as custom scripts. Used for project-level development configurations and utilities that are not meant to be published.
 * @example
 * ├─ .dev
 * │  ├─ start.js
 * │  ├─ watch.js
 * │  ├─ build.js
 * │  └─ test.js
 */
export const DEV = '.dev';
/**
 * Where fixture files exist, such as test fixtures, mock data, etc. Used for project-level fixture files that are used during testing and are not meant to be published.
 * @example
 * ├─ fixtures
 * │  ├─ test-fixture.json
 * │  └─ mock-data.yaml
 */
export const FIXTURES = 'fixtures';
/**
 * Where snapshot files exist, such as test snapshots. Used for project-level snapshot files that are generated during testing and are not meant to be published.
 * @example
 * ├─ __snapshots__
 * │  ├─ test-file.test.ts.snap
 * │  └─ another-test-file.test.ts.snap
 */
export const SNAPSHOTS = '__snapshots__';

/**
 * Contains shared static definitions
 */
export const CONSTANTS = 'constants';
/**
 * Contains type definitions.
 */
export const TYPES = 'types';
/**
 * Contains static data files, such as .json, .yaml, .md, data.ts, etc.
 */
export const DATA = 'data';

/**
 * Where git files exist, such as .git directory, .gitattributes, .gitignore, etc. Used for project-level git configurations and metadata.
 */
export const GIT = '.git';
//#endregion
