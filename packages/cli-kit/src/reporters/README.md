# @toolbox-ts/cli-kit Reporters

`Reporters` provide a consistent way to format domain-specific data for CLI and CI/CD output.

This package includes a reporter interface and a GitHub Actions Annotations reporter, driven by **adapters** you supply.

---

## 🔑 Features

* **Adapter-driven**: map your own data structures into annotations.
* **Multiple output formats**: raw strings, JSON, or grouped objects.
* **Customizable string output**: headers and footers for grouping logs.
* **Workspace-aware paths**: supports `workspaceRoot` or `GITHUB_WORKSPACE`.
* **Round-trip capable**: parse annotation strings back into objects.

---

## 🧩 API Overview

### Common Types

| Type               | Description                                              |
| ------------------ | -------------------------------------------------------- |
| `ReporterOptions`  | `{ workspaceRoot?: string }`                             |
| `StringifyOptions` | `{ header?: string; footer?: string } & ReporterOptions` |
| `Message`          | `{ type, message, file?, line?, col?, title? }`          |
| `NoticeType`       | `'debug' \| 'error' \| 'notice' \| 'warning'`            |

---

### Base Reporter

| API                                   | Description                                             |
| ------------------------------------- | ------------------------------------------------------- |
| `abstract class Reporter<T>`          | Base class for all reporters.                           |
| `static readonly name: string`        | Identifier for the reporter type.                       |
| `stringify(item, options?) => string` | Abstract — must return a string for terminal/CI output. |
| `toJson?(item, options?) => unknown`  | Optional — return JSON-serializable output.             |
| `toObject?(item, options?) => object` | Optional — return plain object output.                  |

**Notes:**

* All reporters extend `Reporter<T>` and must implement `stringify`.
* `toJson` and `toObject` are optional but recommended for structured output.
* `ReporterOptions.workspaceRoot` ensures file paths resolve consistently in mono-repos or CI.

---

### GitHub Actions Annotations

| API                                                          | Description                                           |
| ------------------------------------------------------------ | ----------------------------------------------------- |
| `ghActionsAnnotations.Adapter<T>(item, options?) => Message` | Maps your data type into a GitHub message.            |
| `ghActionsAnnotations.Reporter<T>(adapter)`                  | Creates a reporter instance.                          |
| `Reporter.name`                                              | `"gh-actions-annotations"`.                           |
| `Reporter.noticeTypes`                                       | `['debug','error','notice','warning']`.               |
| `reporter.format(items, options?)`                           | Returns raw annotation strings (`string[]`).          |
| `reporter.stringify(items, options?)`                        | Returns a single string with optional header/footer.  |
| `reporter.toJson(items, options?)`                           | Returns JSON string grouped by type.                  |
| `reporter.toObject(items, options?)`                         | Returns `{ error, warning, notice, debug }` buckets.  |
| `reporter.parseAnnotations(annotations)`                     | Parses raw annotation strings back into `Message[]`.  |
| `reporter.isNoticeType(type)`                                | Returns `true` if the string is a valid `NoticeType`. |

---

## 📖 Usage Examples

### 1. Create an adapter

```ts
import type { NoticeType } from '@toolbox-ts/cli-kit/reporters/gh-actions-annotations';

type LintIssue = {
  file: string;
  line?: number;
  col?: number;
  severity: 'error' | 'warning';
  message: string;
  ruleId?: string;
};

const adapter = (issue: LintIssue) => {
  const type: NoticeType = issue.severity === 'error' ? 'error' : 'warning';
  return {
    type,
    message: issue.ruleId ? `${issue.message} (${issue.ruleId})` : issue.message,
    file: issue.file,
    line: issue.line,
    col: issue.col,
    title: 'Lint'
  };
};
```

---

### 2. Produce GitHub annotations inside a command

```ts
import { BaseCommand } from '@toolbox-ts/cli-kit';

export default class LintCmd extends BaseCommand {
  async run() {
    const reporter = BaseCommand.reporters.ghActionsAnnotations(adapter);

    const issues = await this.loadIssues(); // LintIssue[]
    const output = reporter.stringify(issues, {
      header: '::group::Lint results',
      footer: '::endgroup::',
      workspaceRoot: this.config.root
    });

    this.log(output); // GitHub Actions renders these as annotations
  }
}
```

---

### 3. JSON or grouped object output

```ts
const reporter = BaseCommand.reporters.ghActionsAnnotations(adapter);
const json = reporter.toJson(issues);
const grouped = reporter.toObject(issues);

// grouped.error / grouped.warning / grouped.notice / grouped.debug
```

---

### 4. Parsing existing annotations

```ts
const reporter = BaseCommand.reporters.ghActionsAnnotations(adapter);

const parsed = reporter.parseAnnotations([
  '::error file=src/app.ts,line=2,col=4::Unexpected token'
]);

// -> [{ type:'error', file:'src/app.ts', line:2, col:4, message:'Unexpected token' }]
```

---

## 🧪 Extending

* Write **custom adapters** to reuse the GitHub reporter for linters, type checkers, or test failures.
* Build new reporters by following `src/reporters/types.ts`, implementing `stringify`, and optionally `toJson`/`toObject`.

---

## License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)

* @toolbox-ts

  * [NPM](https://www.npmjs.com/org/toolbox-ts)
  * [GitHub](https://github.com/toolbox-ts/toolbox-ts)
