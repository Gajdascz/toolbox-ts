import type {
  Audit,
  Build,
  Cli,
  DependencyResolution,
  File,
  Hoisting,
  Lockfile,
  Node,
  NodeModules,
  Other,
  Patching,
  Peers,
  Registry,
  Requests,
  Store,
  Workspace
} from './sections/index.js';

export type WorkspaceYAML = {
  /**
   * Named dependency catalogs.
   * Used to centralize dependency versions.
   *
   * @see {@link https://pnpm.io/catalogs#the-catalog-protocol-catalog}
   */
  catalog?: Record<string, string>;
  /**
   * Multiple named catalogs.
   * Each catalog is a map of dependency name → version specifier.
   *
   * @see {@link https://pnpm.io/catalogs#named-catalogs}
   */
  catalogs?: Record<string, Record<string, string>>;
  /**
   * Explicit list of workspace packages.
   *
   * @see {@link https://pnpm.io/pnpm-workspace_yaml}
   */
  packages?: readonly string[] | string[];
} & Audit
  & Build
  & Cli
  & DependencyResolution
  & File
  & Hoisting
  & Lockfile
  & Node
  & NodeModules
  & Other
  & Patching
  & Peers
  & Registry
  & Requests
  & Store
  & Workspace;
