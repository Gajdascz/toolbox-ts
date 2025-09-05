export interface ReporterOptions {
  /** The workspace root directory, used for resolving file paths. */
  workspaceRoot?: string;
}

export interface StringifyOptions extends ReporterOptions {
  footer?: string;
  header?: string;
}
/** Abstract base class for creating reporters that format and output data. */
export abstract class Reporter<T = unknown> {
  /** The name of the reporter, used for identification. */
  static readonly name: string;

  /** Produces a string for terminal or CI output. */
  abstract stringify: (item: T, options?: StringifyOptions) => string;

  /** Produces a JSON-serializable representation. */
  toJson?: (item: T, options?: ReporterOptions) => unknown;

  /** Produces a plain object representation (useful for internal consumption). */
  toObject?: (item: T, options?: ReporterOptions) => Record<string, unknown>;
}
