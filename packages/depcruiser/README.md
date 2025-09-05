# @toolbox-ts/depcruiser

A high-level, TypeScript-first wrapper around [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) designed to make **dependency analysis simpler, more predictable, and configurable for modern projects**.

```sh
pnpm add -D @toolbox-ts/configs
# or
npm install --save-dev @toolbox-ts/configs
# or
yarn add --dev @toolbox-ts/configs
```

---

## ✨ Key Features

* **Comprehensive Configuration Management: [See Example Config](#-example-config)**
  * Strongly typed `config()` for authoring.
  * Sensible defaults; minimal boilerplate (export the `config()` result and go).
  * CLI flags still override config values.
  * Built‑in forbidden rule set you can toggle/extend directly in config.
  * Structured, extensible output types mapped to explicit use cases.
* **Oclif-base CLI:** for improved UX and extensibility.
* **One cruise multiple outputs:** Reuse a single cruise result to generate JSON and human‑readable reports (and console output).
* **GitHub Actions Support:** Annotations for inline feedback in PRs and optional job summary output.

---

## 🧩 Example Config

```ts
import { config } from '@toolbox-ts/depcruiser';

export default config({
  configFileName: 'depcruiser.config.*',
  forbidden: {
    noCircular: true,
    noOrphans: true,
    noDeprecatedCore: true,
    noNonPackageJson: true,
    noDuplicateDepTypes: true,
    notToDeprecated: true,
    notToDevDep: true,
    notToSpec: true,
    notToUnresolvable: true,
    optionalDepsUsed: true,
    peerDepsUsed: true
  },
  options: {
    overwriteBehavior: 'force',
    moduleSystems: ['es6', 'amd', 'cjs'],
    includeOnly: {
      // monorepo 
      path: 'packages/*'
      // single package
      // path: 'src/*' 
    },
    doNotFollow: {
      path: [
        'node_modules',
        'bin',
        '.d.ts',
        '.test.ts',
        '.spec.ts',
        '.bench.ts',
        '.md',
        'LICENSE',
        'dist'
      ]
    },
    outputTo: 'docs/reports/dependencies',
    cache: false,
    report: { fileName: 'dependency-report', type: 'json' },
    graph: {
      fileName: 'dependency-graph',
      type: 'x-dot-webpage',
      toSvg: false
    },
    log: 'text',
    progress: {
      type: PROGRESS_TYPES.cliFeedback,
      maximumLevel: PROGRESS_MAXIMUM_LEVEL.SUMMARY
    },
    enhancedResolveOptions: {
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      exportsFields: ['exports'],
      mainFields: ['module', 'main', 'types', 'typings']
    }
  }
});
```

---

## 🚩 CLI Flags

<details><summary>📤 Output</summary>

* `--no-log`: Disable logging.
* `--log-type <type>`:Set logging output type.
* `--no-report`: Do not generate a report.
* `--report-file-name <path>`: Path to write report output. No report is written if omitted.
* `--report-type <type>`:  Report output format.
* `--no-graph`: Do not generate a dependency graph.
* `--graph-type <type>`: Type of graph to generate.
* `--graph-file-name <name>`: File name for the generated graph. Requires `--graph-type`.
* `--graph-dot-to-svg`
  Transform DOT output into SVG. Requires `--graph-type`.
* `--overwrite-behavior <mode>`
  What to do if output file already exists.
  Options: `overwrite`, `append`, `skip`, etc.
* `--output-to, -f <dir>`: Directory to write output files.
* `--emit-actions-summary <sha>`: Emit a GitHub Actions step summary with a Mermaid diagram of affected modules. Pass the git revision to compare against (`${{ github.event.pull_request.base.sha }}` for PRs). Requires the `GITHUB_STEP_SUMMARY` environment variable.

</details>

<details><summary>⚡ Cache</summary>

* `--no-cache`: Disable caching.
* `--cache-folder <dir>`: Directory to store the cache.
* `--cache-strategy <strategy>`: Strategy for cache invalidation:
* `--cache-compression`: Compress cache contents.

</details>

<details><summary>⏳ Progress</summary>

* `--progress-type <type>`: Type of progress indicator to use.
* `--progress-maximum-level <depth>`: Maximum depth of progress detail to display.

</details>

<details><summary>📦 Resolution</summary>

* `--ts-config <path>`: Path to `tsconfig.json`.
* `--webpack-config <path>`: Path to webpack configuration (for alias resolution).
* `--babel-config <path>`: Path to babel configuration (for alias resolution).
* `--preserve-symlinks`: Do not resolve symlinks to their real path.
* `--module-systems, -M <systems>`: Comma-separated list of module systems to support.

</details>

<details><summary>🔍 Traversal</summary>

* `--max-depth, -d <n>`: Limit how deep to follow dependencies.
* `--ts-pre-compilation-deps`: Detect dependencies that exist only pre TypeScript compilation.
* `--do-not-follow-path, -X <patterns>`: Include modules matching regex but do not follow their dependencies.
* `--do-not-follow-dependency-types <types>`: Dependency types to ignore when applying `doNotFollowPath`.

</details>

<details><summary>🎯 Filtering</summary>

* `--include-only, -I <pattern>`: Only include modules matching regex.
* `--prefix, -P <prefix>`: Prefix to use for links in `dot` and `err-html` reports.
* `--exclude, -x <patterns>`: Exclude all modules matching regex.
* `--collapse, -S <depth|pattern>`: Collapse modules to given folder depth or regex group.
* `--reaches, -R <pattern>`: Include modules matching regex and all they reach.
* `--focus, -F <pattern>`: Include modules matching regex and their direct neighbors.
* `--focus-depth <n>`: Depth for `--focus`. Requires `--focus`.
* `--highlight, -H <pattern>`: Highlight modules matching regex.

</details>

<details><summary>🛠 Misc</summary>

* `--init`: Generate a default dependency-cruiser configuration file.
* `--affected, -A <revision>`: Include modules changed since revision and all that depend on them.
* `--metrics, -m`: Calculate and include code metrics.
* `--validate, -v`: Validate the configuration file.
* `--config, -c <path>`: Path to configuration file. Must exist.

</details>

---

## 🏗️ GitHub Actions CI

>*Note: The following examples use pnpm and assume depcruiser is locally installed and setup in the CI environment.*

### Validation

Add this wherever you want to validate project dependencies.

```yaml
- name: 🕵️ Dependencies
  run:
    pnpm depcruiser --log-type "gh-actions-annotations" --no-graph --no-report
  shell: bash
```

### Summary Generation

Add this to your PR workflow.

```yaml
- name: 🛠️ Depcruise - Generate Dependency Graph
  run:
    pnpm depcruiser --emit-actions-summary ${{
    github.event.pull_request.base.sha }} --no-graph --no-report
```

## ⚖️ License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)
[GitHub](https://github.com/gajdascz/toolbox-ts) | [NPM](https://npmjs.com/package/@toolbox-ts)
