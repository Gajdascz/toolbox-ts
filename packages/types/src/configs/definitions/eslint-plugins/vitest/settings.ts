export interface Settings {
  /**
   * Toggle optional type checking for Vitest rules.
   *
   * @see https://github.com/vitest-dev/eslint-plugin-vitest#enabling-with-type-testing
   */
  typecheck?: boolean;

  /**
   * Inform the plugin about custom fixtures in a separate file that are imported in test files.
   *
   * @see https://github.com/vitest-dev/eslint-plugin-vitest#custom-fixtures
   *
   * @example
   * ```ts
   * settings: { vitest: { vitestImports: ['@/tests/fixtures', /test-extend$/] } }
   * ```
   */
  vitestImports?: (string | RegExp)[];
}
