import { Obj } from '@toolbox-ts/utils';
import type { TsConfig } from '@toolbox-ts/types/defs/configs';
import { FS, URLS } from '@toolbox-ts/constants';
import { GLOBS } from '@toolbox-ts/constants/fs';

//#region> Constants
export const SCHEMA = URLS.SCHEMA_TSCONFIG;
export const FILENAMES = {
  reference: FS.FILES.CONFIG.TS,
  base: FS.FILES.CONFIG.TS_BASE,
  build: FS.FILES.CONFIG.TS_BUILD,
  dev: FS.FILES.CONFIG.TS_DEV,
  test: FS.FILES.CONFIG.TS_TEST
} as const;
export const DOMAINS = Obj.keys(FILENAMES);
export const BUILD_INFO_EXT = FS.EXTS.TS_ARTIFACTS[1];
export const SRC_EXCLUDE = [...GLOBS.ALL.COMMON_IGNORE, ...GLOBS.ALL.TESTS];
export const SRC_INCLUDE = [FS.DIRS.SRC];
export const ROOT_TO_BASE_TSCONFIG_PATH = `./${FILENAMES.base}` as const;

//#endregion
//#region> Types
export type BuildInfoFile<N extends string = 'tsconfig'> =
  `${N}.${Extract<FS.EXTS.TsArtifactExtension, 'tsbuildinfo'>}`;
export type Domain = (typeof DOMAINS)[number];
export type RootToBaseTsConfigPath = typeof ROOT_TO_BASE_TSCONFIG_PATH;
export type Filename<T extends Domain> = (typeof FILENAMES)[T];

export type InputCompilerOptions<Static extends TsConfig.CompilerOptions = never> = Omit<
  TsConfig.CompilerOptions,
  keyof Static
>;
//#endregion
//#region> Helpers
export const genericDefine = <N extends string = string>(
  cfg: Omit<TsConfig.ExtendedConfig<N>, '$schema'>
): TsConfig.ExtendedConfig<N> => ({ $schema: SCHEMA, ...cfg });
export const getPresetMeta = <N extends Domain>(
  name: N,
  description: string
): TsConfig.Meta<N> => ({ $schema: SCHEMA, name, description, filename: FILENAMES[name] });
export const createStatic = <
  StaticFields extends Partial<
    Omit<TsConfig.ExtendedConfig<string>, 'compilerOptions' | '$schema'>
  >,
  StaticCompilerOptions extends TsConfig.CompilerOptions
>(
  fields: StaticFields,
  compilerOptions: StaticCompilerOptions
) => ({ fields: { $schema: SCHEMA, ...fields }, compilerOptions });

export const createDefine =
  <
    StaticFields extends Partial<Omit<TsConfig.ExtendedConfig<string>, 'compilerOptions'>> &
      Omit<TsConfig.Meta, '$schema'>,
    StaticCompilerOptions extends TsConfig.CompilerOptions
  >({
    compilerOptions: staticCompilerOptions,
    fields,
    defaultCompilerOptions = {},
    defaultFields = {}
  }: {
    fields: StaticFields;
    compilerOptions: StaticCompilerOptions;
    defaultFields?: Partial<Omit<TsConfig.ExtendedConfig<string>, 'compilerOptions'>>;
    defaultCompilerOptions?: Partial<TsConfig.CompilerOptions>;
  }) =>
  (input?: {
    compilerOptions: InputCompilerOptions<StaticCompilerOptions>;
  }): TsConfig.ExtendedConfig => ({
    $schema: SCHEMA,
    ...defaultFields,
    ...fields,
    compilerOptions: {
      ...defaultCompilerOptions,
      ...input?.compilerOptions,
      ...staticCompilerOptions
    }
  });
//#endregion
