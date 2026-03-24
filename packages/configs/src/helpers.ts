export const THIS_PACKAGE_NAME = '@toolbox-ts/configs' as const;
export const THIS_PACKAGE_RUNTIME_IMPORT_PATH = `${THIS_PACKAGE_NAME}/runtime` as const;
export const THIS_PACKAGE_STATIC_IMPORT_PATH = `${THIS_PACKAGE_NAME}/static` as const;
export const DEFINE_METHOD = 'define' as const;

/**
 * Wraps JSON.stringify with a default indentation of 2 spaces for better readability when writing config files.
 */
export const serializeJson = (config: unknown) => JSON.stringify(config, null, 2);
/**
 * Generates the content of a config file that imports a `define` method from this package's runtime and calls it with the provided parameters.
 * This is useful for emitting config files that can be easily edited by users, while still leveraging the runtime `define` method for processing the config.
 * - `importName`: The name of the import to use in the generated file (e.g. 'define').
 * - `params`: An array of strings representing the parameters to pass to the `define` method in the generated file. These should be stringified versions of the config objects.
 * - `options`: Optional overrides for the import package name and define method name, allowing for flexibility in how the generated file is structured.
 */
export const runtimeConfigToFileContent = (
  importName: string,
  params: (string | undefined)[],
  {
    defineMethodName = DEFINE_METHOD,
    importPackageName = THIS_PACKAGE_RUNTIME_IMPORT_PATH
  }: { importPackageName?: string; defineMethodName?: string } = {}
) =>
  `import { ${importName} } from '${importPackageName}';

export default ${importName}.${defineMethodName}(${params.join(', ')});` as const;
