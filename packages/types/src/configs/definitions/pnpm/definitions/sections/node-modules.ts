/**
 * pnpm node_modules and linker configuration.
 * Controls how dependencies are laid out on disk and resolved by Node.js.
 */
export interface NodeModules {
  /**
   * Time (in minutes) after which the pnpm dlx cache expires.
   *
   * @see https://pnpm.io/settings#dlxcachemaxage
   */
  dlxCacheMaxAge?: number;

  /**
   * Enables a shared global virtual store for node_modules.
   *
   * When enabled, node_modules symlinks into a central virtual store
   * located at `<store-path>/links`.
   *
   * Disabled automatically in CI environments.
   *
   * Experimental feature.
   *
   * @see https://pnpm.io/settings#enableglobalvirtualstore
   */
  enableGlobalVirtualStore?: boolean;

  /**
   * When false, pnpm will not write any files to the modules directory.
   *
   * Useful when node_modules is mounted via FUSE.
   *
   * @see https://pnpm.io/settings#enablemodulesdir
   */
  enableModulesDir?: boolean;

  /**
   * Time (in minutes) after which orphan packages
   * in the modules directory are removed.
   *
   * Helps speed up installs when switching branches.
   *
   * @see https://pnpm.io/settings#modulescachemaxage
   */
  modulesCacheMaxAge?: number;

  /**
   * Directory in which dependencies are installed.
   *
   * @see https://pnpm.io/settings#modulesdir
   */
  modulesDir?: string;

  /**
   * Defines which node linker strategy pnpm should use.
   *
   * - `isolated`: symlinked node_modules from a virtual store (default, safest)
   * - `hoisted`: flat node_modules without symlinks (npm/Yarn Classic–like)
   * - `pnp`: Plug'n'Play, no node_modules directory
   *
   * @see https://pnpm.io/settings#nodelinker
   */
  nodeLinker?: 'hoisted' | 'isolated' | 'pnp';

  /**
   * Controls how packages are imported from the store into node_modules.
   *
   * This does NOT affect symlinks; use `nodeLinker` for that.
   *
   * - `auto`: clone → hardlink → copy (fallback)
   * - `hardlink`: hard link from store
   * - `clone`: copy-on-write clone (fastest, safest)
   * - `clone-or-copy`: clone if possible, otherwise copy
   * - `copy`: full copy
   *
   * @see https://pnpm.io/settings#packageimportmethod
   */
  packageImportMethod?:
    | 'auto'
    | 'clone-or-copy'
    | 'clone'
    | 'copy'
    | 'hardlink';

  /**
   * Whether pnpm should create symlinks inside node_modules.
   *
   * When false, pnpm creates a virtual store without symlinks.
   * Typically used together with `nodeLinker: "pnp"`.
   *
   * @see https://pnpm.io/settings#symlink
   */
  symlink?: boolean;

  /**
   * Directory containing links to the content-addressable store.
   *
   * All direct and transitive dependencies are linked here.
   * Can be relocated to mitigate long path issues (especially on Windows).
   *
   * Must be unique per project (workspace roots are shared).
   *
   * @see https://pnpm.io/settings#virtualstoredir
   */
  virtualStoreDir?: string;

  /**
   * Maximum allowed directory name length inside the virtual store.
   *
   * Lower this value to mitigate Windows path length issues.
   *
   * Defaults:
   * - Linux/macOS: 120
   * - Windows: 60
   *
   * @see https://pnpm.io/settings#virtualstoredirmaxlength
   */
  virtualStoreDirMaxLength?: number;
}
