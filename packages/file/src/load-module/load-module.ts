import { createJiti } from 'jiti';

import type { FileContentResolver, ResultObj } from '../types.ts';

const jiti = createJiti(process.cwd());

const isValidObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * The supported values for the exported module data
 */
type ExportableValue<Module> = (() => Module | Promise<Module>) | Module;

const isExportableValue = <Module>(
  importedValue: unknown
): importedValue is ExportableValue<Module> =>
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
type ModuleExport<Module> =
  | { [key: string]: ExportableValue<Module> }
  | { [key: string]: unknown }
  | { default: ExportableValue<Module> }
  | ExportableValue<Module>;

const resolveModuleExport = <Module>(
  imported: unknown,
  exportKey = 'default'
): ExportableValue<Module> | null => {
  let value: unknown = imported;
  if (isValidObject(imported)) {
    if (exportKey in imported) value = imported[exportKey];
    else if ('default' in imported) value = imported.default;
  }
  return isExportableValue<Module>(value) ? value : null;
};
interface LoadModuleOpts<Module> {
  exportKey?: string;
  resolverFn?: FileContentResolver<Module>;
}
const loadModule = async <Module>(
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

export {
  type ExportableValue,
  loadModule,
  type LoadModuleOpts,
  type ModuleExport
};
