import { createJiti } from 'jiti';

import type { FileContentResolver, ResultObj } from '../types.ts';

const jiti = createJiti(process.cwd());

const isValidObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * The supported values for the exported module data
 */
export type LoadModuleExportableValue<Module> =
  | (() => Module | Promise<Module>)
  | Module;

const isExportableValue = <Module>(
  importedValue: unknown
): importedValue is LoadModuleExportableValue<Module> =>
  typeof importedValue === 'function' || isValidObject(importedValue);

/**
 * Represents possible module structures when importing from a script (ts|js) file
 *
 * A module can export it's content as:
 * 1. default export
 * 2. A named export
 * 3. The entire module
 * 4. A function that returns a it's content
 */
export type LoadModuleExport<Module> =
  | { [key: string]: LoadModuleExportableValue<Module> }
  | { [key: string]: unknown }
  | { default: LoadModuleExportableValue<Module> }
  | LoadModuleExportableValue<Module>;

const resolveModuleExport = <Module>(
  imported: unknown,
  exportKey = 'default'
): LoadModuleExportableValue<Module> | null => {
  let value: unknown = imported;
  if (isValidObject(imported)) {
    if (exportKey in imported) value = imported[exportKey];
    else if ('default' in imported) value = imported.default;
  }
  return isExportableValue<Module>(value) ? value : null;
};

/**
 * Options for loading a module from a script file
 */
export interface LoadModuleOpts<Module> {
  /**
   * The name of the export to load from the module.
   * - If not provided, it will first look for a `default` export, then fall back to the entire module.
   *
   * @default 'default'
   */
  exportKey?: string;
  /**
   * A function to further process or validate the loaded module content.
   * - If the function returns `null`, it indicates a failure to resolve the module content.
   */
  resolverFn?: FileContentResolver<Module>;
}

/**
 * Dynamically load and resolve a module from a given script file path.
 * - Supports both default and named exports.
 * - Can handle modules that export a function returning the desired content.
 *
 * @example
 * ```ts
 * // module.ts
 * export default { key: 'value' };
 *
 * // load-module.ts
 * const { result, error } = await loadModule<{ key: string }>('module.ts');
 * console.log(result); // { key: 'value' }
 * ```
 */
export const loadModule = async <Module>(
  cfgPath: string,
  { resolverFn, exportKey = 'default' }: LoadModuleOpts<Module> = {}
): Promise<ResultObj<Module>> => {
  let err: unknown;
  try {
    const module = await jiti.import(cfgPath);
    const importedValue = resolveModuleExport<Module>(module, exportKey);
    if (importedValue !== null) {
      const value = (
        typeof importedValue === 'function' ?
          await (importedValue as () => Promise<Module>)()
        : importedValue) as Module;
      const result = resolverFn ? resolverFn(value) : value;
      if (result === null)
        throw new Error(
          `Resolver function returned null for the module export`
        );
      return { result };
    }
  } catch (error) {
    err = error;
  }
  return {
    result: null,
    error: `Failed to load script from ${cfgPath}: ${
      err instanceof Error ? err.message : String(err)
    }`
  };
};
