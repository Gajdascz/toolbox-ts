import {
  createStaticConfigModule,
  dedupeArrays,
  TsConfigs
} from '../../../../core/index.js';

export const { define, meta } = createStaticConfigModule({
  filename: TsConfigs.Test.META.filename,
  define: ({
    exclude = [],
    include = [],
    compilerOptions = {},
    ...rest
  }: TsConfigs.Test.InputConfig = {}): TsConfigs.Test.Config => ({
    ...TsConfigs.Test.STATIC_FIELDS,
    include: dedupeArrays(TsConfigs.Test.INCLUDE, include),
    exclude: dedupeArrays(TsConfigs.Test.EXCLUDE, exclude),
    compilerOptions: {
      ...TsConfigs.Test.DEFAULT_COMPILER_OPTIONS,
      ...compilerOptions
    },
    ...rest
  })
});
export type Config = TsConfigs.Test.Config;
export type InputConfig = TsConfigs.Test.InputConfig;
