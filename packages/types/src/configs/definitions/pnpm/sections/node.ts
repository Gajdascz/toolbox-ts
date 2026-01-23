/**
 * Node.js-related pnpm settings.
 */
export interface Node {
  /**
   * Execution environment overrides.
   *
   * @see https://pnpm.io/settings#executionenvnodeversion
   */
  executionEnv?: {
    /**
     * Node.js version used when running scripts in this project.
     *
     * @see https://pnpm.io/settings#executionenvnodeversion
     */
    nodeVersion?: string;
  };

  /**
   * Base URL used to download Node.js binaries.
   *
   * @see https://pnpm.io/settings#node-mirror
   */
  nodeMirror?: string;

  /**
   * Node.js version used for validating package engines.
   *
   * @see https://pnpm.io/settings#nodeversion
   */
  nodeVersion?: string;

  /**
   * Node.js version used for running pnpm commands in a workspace.
   *
   * @see https://pnpm.io/settings#usenodeversion
   */
  useNodeVersion?: string;
}
