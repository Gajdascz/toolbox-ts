import {
  createStaticConfigModule,
  dedupeArrays,
  TsConfigs
} from '../../../../core/index.js';

export const { define, meta } = createStaticConfigModule({
  filename: TsConfigs.Dev.META.filename,
  define: ({
    compilerOptions = {},
    exclude = [],
    include = [],
    ...rest
  }: TsConfigs.Dev.InputConfig = {}): TsConfigs.Dev.Config => ({
    ...rest,
    ...TsConfigs.Dev.STATIC_FIELDS,
    compilerOptions: {
      ...compilerOptions,
      ...TsConfigs.Dev.STATIC_COMPILER_OPTIONS
    },
    exclude: dedupeArrays(exclude, TsConfigs.Dev.EXCLUDE),
    include: dedupeArrays(include, TsConfigs.Dev.INCLUDE)
  })
});
export type Config = TsConfigs.Dev.Config;
export type InputConfig = TsConfigs.Dev.InputConfig;
