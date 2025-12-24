import {
  createStaticConfigModule,
  dedupeArrays,
  TsConfigs
} from '../../../../../core/index.js';

export const { define, meta } = createStaticConfigModule({
  filename: TsConfigs.SinglePkg.Build.META.filename,
  define: ({
    compilerOptions = {},
    include = [],
    exclude = []
  }: TsConfigs.SinglePkg.Build.InputConfig = {}): TsConfigs.SinglePkg.Build.Config => ({
    ...TsConfigs.SinglePkg.Build.STATIC_FIELDS,
    compilerOptions: {
      ...TsConfigs.SinglePkg.Build.DEFAULT_COMPILER_OPTIONS,
      ...compilerOptions,
      ...TsConfigs.SinglePkg.Build.STATIC_COMPILER_OPTIONS
    },
    include: dedupeArrays(TsConfigs.SinglePkg.Build.INCLUDE, include),
    exclude: dedupeArrays(TsConfigs.SinglePkg.Build.EXCLUDE, exclude)
  })
});
export type Config = TsConfigs.SinglePkg.Build.Config;
export type InputConfig = TsConfigs.SinglePkg.Build.InputConfig;
