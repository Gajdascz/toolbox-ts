import { THIS_PACKAGE } from '../constants/index.js';

export type ConfigModuleType = 'runtime' | 'static';
//#region> Shared
export interface BaseConfigModuleMeta<
  T extends ConfigModuleType = ConfigModuleType
> {
  dependencies: ConfigModuleDependency[];
  filename: string;
  type: T;
}
export interface ConfigModuleDependency {
  optional?: boolean;
  packageName: string;
}
export type DefineFn<I, O = I, HasRequiredInput extends boolean = false> =
  HasRequiredInput extends false ? (input?: I) => O : (input: I) => O;

//#endregion

//#region> Runtime

/**
 * Function to define the configuration object and process input.
 * - Can be imported and used in runtime configuration files directly.
 * @example
 * ```ts
 * // config-name.config.ts
 * import { aRuntimeConfig } from '@toolbox-ts/configs';
 *
 * export default aRuntimeConfig.define({ /* config options *\/ });
 * ```
 * - Used in `getTemplateString` to generate the runtime configuration file content.
 * @example
 * ```ts
 * const templateString = aRuntimeConfig.getTemplateString({ /* config options *\/ });
 * // `config options` are passed to this `define` function.
 * ```
 */
export type DefineRuntimeConfig<I, O = I, R extends boolean = false> = DefineFn<
  I,
  O,
  R
>;
/**
 * Generates the template string for the configuration file.
 * - Passes `input` to the `define` function to generate the configuration object.
 * - Returns a string that can be used as the content of the configuration file.
 * @example
 * ```ts
 * const templateString = aConfig.getTemplateString({ /* config options *\/ });
 * // `config options` are passed to this `define` function.
 * ```
 */
export type GetRunTimeTemplateString<I> = (input?: I) => RuntimeConfigTemplate;

export interface RuntimeConfigModule<I, O = I, R extends boolean = false> {
  define: DefineRuntimeConfig<I, O, R>;
  getTemplateString: GetRunTimeTemplateString<I>;
  meta: RuntimeConfigTemplateMeta;
}

export type RuntimeConfigTemplate<
  M extends RuntimeConfigTemplateMeta = RuntimeConfigTemplateMeta
> = `import { ${M['importName']} } from '${M['importFrom']}';

export default ${M['importName']}.define(${string});`;

const normalizeDependencies = (
  dependencies: (ConfigModuleDependency | string)[]
): ConfigModuleDependency[] =>
  dependencies.map((d) => (typeof d === 'string' ? { packageName: d } : d));

export interface RuntimeConfigTemplateMeta extends BaseConfigModuleMeta {
  /**
   * Name of the package to import from in the template string.
   * @example `@toolbox-ts/configs`
   * ```ts
   * import { importName } from '@toolbox-ts/configs';
   *
   * export default importName.define({ /* config options *\/ });
   * ```
   */
  importFrom: string;
  /**
   * Name of the import to use in the template string.
   * - Must include a define function.
   * @example `aRuntimeConfig`
   * ```ts
   * import { aRuntimeConfig } from 'package-name';
   *
   * export default aRuntimeConfig.define({ /* config options *\/ });
   * ```
   */
  importName: string;
}
interface RuntimeConfigModuleConfig<
  I,
  O = I,
  R extends boolean = false
> extends Omit<RuntimeConfigTemplateMeta, 'type'> {
  define: DefineRuntimeConfig<I, O, R>;
}
export const createRuntimeConfigModule = <I, O = I, R extends boolean = false>({
  filename,
  importName,
  importFrom = THIS_PACKAGE,
  define,
  dependencies = []
}: {
  dependencies?: (ConfigModuleDependency | string)[];
  importFrom?: string;
} & Pick<
  RuntimeConfigModuleConfig<I, O>,
  'define' | 'filename' | 'importName'
>): RuntimeConfigModule<I, O, R> => ({
  meta: {
    type: 'runtime',
    filename,
    importName,
    importFrom,
    dependencies: normalizeDependencies(dependencies)
  },
  define,
  getTemplateString: (input?) =>
    `import { ${importName} } from '${importFrom}';

export default ${importName}.define(${JSON.stringify(define(input), null, 2)});`
});
//#endregion

//#region> Static
/**
 * Function to define the configuration object and process input.
 * - Cannot be imported and used like a runtime configuration.
 *  - The result of define must be written to a file for it to work.
 */
export type DefineStaticConfig<
  I,
  O = I,
  HasRequiredInput extends boolean = false
> = HasRequiredInput extends false ? (input?: I) => O : (input: I) => O;

export interface StaticConfigModule<I, O = I, R extends boolean = false> {
  define: DefineStaticConfig<I, O, R>;
  meta: StaticConfigModuleMeta;
}
export interface StaticConfigModuleConfig<
  I,
  O = I,
  R extends boolean = false
> extends Omit<StaticConfigModuleMeta, 'type'> {
  define: DefineStaticConfig<I, O, R>;
}

export type StaticConfigModuleMeta = BaseConfigModuleMeta;

export const createStaticConfigModule = <I, O = I, R extends boolean = false>({
  define,
  filename,
  dependencies = []
}: { dependencies?: (ConfigModuleDependency | string)[] } & Omit<
  StaticConfigModuleConfig<I, O, R>,
  'dependencies'
>): StaticConfigModule<I, O, R> => ({
  meta: {
    type: 'static',
    filename,
    dependencies: normalizeDependencies(dependencies)
  },
  define
});
//#endregion

export type ConfigModule<I, O = I, R extends boolean = false> =
  | RuntimeConfigModule<I, O, R>
  | StaticConfigModule<I, O, R>;
