/** The foundational structure for defining output types. */
export interface BaseDef<
  K extends 'graph' | 'report',
  E extends string,
  L extends boolean = false
> {
  fileExtension: Ext<E>;
  kind: K;
  loggable: L;
}

/** Output types that generate a Graphiz DOT graph  */
export type DotGraph = {
  [K in Type]: TypeDefs[K] extends DotGraphDef ? K : never;
}[Type];

export type DotGraphDef = GraphDef<'dot'>;

export type Ext<E extends string> = `.${E}`;

/** Output types that generate a graph for dependency relationship visualization. */
export type Graph = {
  [K in Type]: TypeDefs[K] extends GraphDef<string> ? K : never;
}[Type];
export interface GraphCfg {
  fileName: string;
  toSvg: boolean;
  type: Graph;
}
export type GraphDef<E extends string> = BaseDef<'graph', E>;
export type HtmlReportDef = ReportDef<'html', false>;

export type JsonReportDef = ReportDef<'json', true>;

/** Output types that generate a text based logs */
export type Loggable = {
  [K in Type]: TypeDefs[K] extends ReportDef<string, true> ? K : never;
}[Type];

/** Generate detailed reporting information to files. */
export type Report = Exclude<
  {
    [K in Type]: TypeDefs[K] extends ReportDef<string, boolean> ? K : never;
  }[Type],
  'null'
>;

export interface ReportCfg {
  fileName: string;
  type: Report;
}

export type ReportDef<E extends string, L extends boolean> = BaseDef<
  'report',
  E,
  L
>;

export interface ResolvedOutput<T extends Type = Type> {
  /**
   * The final path (directory + filename + extension) to write the output to.
   */
  outPath: string;
  /**
   * The type of output to generate.
   */
  type: T;
}
/** Reports generated to `.txt` files */
export type TextReportDef = ReportDef<'txt', true>;

export type Type = keyof TypeDefs;
/** Defines the various output types supported by the dependency cruiser CLI. */
export interface TypeDefs {
  /**
   * Outputs JSON result with anonymized module names
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#anon---obfuscated-json}
   */
  anon: JsonReportDef;

  /**
   * Summarizes (collapse) dependencies to chosen folders
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#archi-cdot}
   */
  archi: DotGraphDef;

  /**
   * Outputs results in Azure DevOps format
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#azure-devops}
   */
  'azure-devops': TextReportDef;

  /**
   * Alias for archi
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#archi-cdot}
   */
  cdot: DotGraphDef;

  /**
   * Creates a comma-separated values file
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#csv}
   */
  csv: ReportDef<'csv', true>;

  /**
   * Generates a D2 diagram
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#d2}
   */
  d2: GraphDef<'svg'>;

  /**
   * Summarizes on folder level
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#ddot---summarise-on-folder-level}
   */
  ddot: DotGraphDef;

  /**
   * Generates a Graphviz DOT format for visualizing dependencies
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#dot}
   */
  dot: DotGraphDef;

  /**
   * Outputs errors in a compact, human-readable format
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#err}
   */
  err: TextReportDef;

  /**
   * Outputs errors in an HTML page
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#err-html}
   */
  'err-html': HtmlReportDef;

  /**
   * Outputs errors in a verbose, human-readable format
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#err-long}
   */
  'err-long': TextReportDef;
  /**
   * Alias for flat
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#flat-fdot}
   */
  fdot: DotGraphDef;

  /**
   * Generates a flat Graphviz DOT format (no hierarchy)
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#flat-fdot}
   */
  flat: DotGraphDef;

  /** Outputs results formatted as GitHub Actions text */
  'gh-actions-annotations': TextReportDef;

  /** Outputs results formatted as GitHub Actions JSON format */
  'gh-actions-json': JsonReportDef;

  /**
   * Creates a contingency style graph (matrix) in a single HTML file
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#html}
   */
  html: HtmlReportDef;

  /**
   * Provides a `modules` and `summary` section providing
   * detailed dependency reporting information
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#json}
   */
  json: JsonReportDef;

  /**
   * Outputs results in Markdown format
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#markdown}
   */
  markdown: ReportDef<'md', false>;

  /**
   * Generates a Mermaid.js diagram
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#mermaid}
   */
  mermaid: GraphDef<'mmd'>;

  /**
   * Outputs stability and other metrics in plain text
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#metrics---generate-a-report-with-stability-metrics-for-each-folder}
   */
  metrics: TextReportDef;

  /**
   * Produces no output (useful for dry runs or testing)
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#null---no-output-just-an-exit-code}
   */
  null: ReportDef<'', false>;

  /**
   * Outputs results in TeamCity CI format
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#teamcity}
   */
  teamcity: TextReportDef;

  /**
   * Outputs results in plain text format
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#text}
   */
  text: TextReportDef;

  /**
   * Runs dot reporter and pipes through GraphViz dot command and wraps it in html
   *
   * - Same as running:  `dependency-cruise -T dot src | dot -T svg | depcruise-wrap-stream-in-html > dependencygraph.html`
   *
   * @see {@link https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#x-dot-webpage}
   */
  'x-dot-webpage': GraphDef<'html'>;
}

export type Types = { [K in Type]: K };
