import { DIRS, FILES, GLOBS, REPO } from '@toolbox-ts/constants/fs';
import type { TsConfig } from '@toolbox-ts/types/defs/configs';
import { FILENAMES, SCHEMA, genericDefine } from '../core.js';
import { serializeJson } from '../../../../helpers.js';

export interface StaticFields {
  $schema: string;
  extends: string;
  filename: string;
  references?: never;
  include: string[];
  exclude: string[];
}
export type Config = Omit<
  TsConfig.ExtendedConfig<string>,
  keyof StaticFields | 'compilerOptions'
> & { compilerOptions?: Omit<TsConfig.CompilerOptions, keyof StaticCompilerOptions> };

export type ProcessedConfig = TsConfig.ExtendedConfig<string>;

export interface StaticCompilerOptions {
  composite: true;
  outDir: string;
  rootDir: string;
  tsBuildInfoFile: string;
}

const getStaticCompilerOptions = (pkgName: string): StaticCompilerOptions => ({
  composite: true,
  outDir: DIRS.OUT,
  rootDir: DIRS.SRC,
  tsBuildInfoFile: REPO.MONO.PATHS.PKG_TO.TS_BUILD_INFO(pkgName)
});

export const STATIC_FIELDS: StaticFields = {
  $schema: SCHEMA,
  filename: FILES.CONFIG.TS,
  extends: REPO.MONO.PATHS.PKG_TO.BASE_TSCONFIG,
  include: [DIRS.SRC],
  exclude: [...GLOBS.ALL.COMMON_IGNORE, ...GLOBS.ALL.TESTS]
};
export const define = ({
  name,
  compilerOptions = {},
  ...rest
}: Config & { name: string; description: string }): ProcessedConfig =>
  genericDefine({
    name,
    ...rest,
    compilerOptions: { ...compilerOptions, ...getStaticCompilerOptions(name) },
    ...STATIC_FIELDS
  });
export const toFileEntry = (config: Config & { name: string; description: string }) => ({
  [FILENAMES.reference]: serializeJson(define(config))
});
