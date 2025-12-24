import { createStaticConfigModule, TsConfigs } from '../../../../core/index.js';

export const { define, meta } = createStaticConfigModule({
  filename: TsConfigs.Base.META.filename,
  define: ({
    compilerOptions = {},
    ...rest
  }: TsConfigs.Base.InputConfig = {}): TsConfigs.Base.Config => ({
    ...TsConfigs.Base.STATIC_FIELDS,
    compilerOptions: {
      ...TsConfigs.Base.DEFAULT_COMPILER_OPTIONS,
      ...compilerOptions,
      types: [
        ...TsConfigs.Base.DEFAULT_COMPILER_OPTIONS.types,
        ...(compilerOptions.types ?? [])
      ]
    },
    ...rest
  })
});
export type Config = TsConfigs.Base.Config;
export type InputConfig = TsConfigs.Base.InputConfig;
