import type { PackageJson } from '@toolbox-ts/types';

import { type Dependency } from '../../../../core/architecture/types.js';
import type {
  ConflictFileDataType,
  ConflictMergeHandling
} from '../../../../core/index.js';

export interface BaseConfigModuleInput<I, O = I> {
  filename: string;
  dependencies: Dependency[];
  name: string;
  description: string;
  url: string;
  define: (cfg?: I) => O | Promise<O>;
  packagePatch?: Partial<PackageJson>;
}
export interface BaseConfigModule<
  I,
  O = string,
  S extends string = string
> extends BaseConfigModuleInput<I, O> {
  packagePatch?: Partial<PackageJson>;
  getTemplate: (cfg?: I) => S;
  mergeStrategy: ConflictMergeHandling<I>;
}

export type RuntimeConfigTemplate = `import { ${string} } from '${string}';

export default ${string}.define(${string});`;

export interface RuntimeConfigModuleInput<
  I,
  O = I
> extends BaseConfigModuleInput<I, O> {
  fileType: 'runtime';
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

export type RuntimeConfigModule<I, O = I> = BaseConfigModule<
  I,
  O,
  RuntimeConfigTemplate
>
  & RuntimeConfigModuleInput<I, O>;

export type StaticConfigModuleInput<I, O = I> = BaseConfigModuleInput<I, O> & {
  fileType: 'static';
  contentType: ConflictFileDataType;
};

export type StaticConfigModule<I, O = I> = BaseConfigModule<I, O, string>
  & StaticConfigModuleInput<I, O>;

export type ConfigModule<I, O = I> =
  | RuntimeConfigModule<I, O>
  | StaticConfigModule<I, O>;
export type ConfigModuleInput<I, O = I> =
  | RuntimeConfigModuleInput<I, O>
  | StaticConfigModuleInput<I, O>;
