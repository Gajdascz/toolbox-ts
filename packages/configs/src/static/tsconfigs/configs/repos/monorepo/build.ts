import {
  createStaticConfigModule,
  TsConfigs
} from '../../../../../core/index.js';

export const { define, meta } = createStaticConfigModule({
  filename: TsConfigs.Monorepo.Build.META.filename,
  define: ({
    references = [],
    compilerOptions = {},
    ...rest
  }: TsConfigs.Monorepo.Build.InputConfig = {}): TsConfigs.Monorepo.Build.Config => ({
    ...TsConfigs.Monorepo.Build.STATIC_FIELDS,
    references,
    compilerOptions: {
      ...TsConfigs.Monorepo.Build.DEFAULT_COMPILER_OPTIONS,
      ...compilerOptions
    },
    ...rest
  })
});
export type Config = TsConfigs.Monorepo.Build.Config;
export type InputConfig = TsConfigs.Monorepo.Build.InputConfig;
