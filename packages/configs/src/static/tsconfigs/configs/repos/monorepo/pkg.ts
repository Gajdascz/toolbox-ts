import {
  createStaticConfigModule,
  dedupeArrays,
  TsConfigs
} from '../../../../../core/index.js';

export const { define, meta } = createStaticConfigModule<
  TsConfigs.Monorepo.Pkg.InputConfig<string>,
  TsConfigs.Monorepo.Pkg.Config<string>,
  true
>({
  filename: TsConfigs.Monorepo.Pkg.META.filename,
  define: <N extends string>({
    name,
    description = '',
    compilerOptions = {},
    exclude = [],
    include = [],
    ...rest
  }: TsConfigs.Monorepo.Pkg.InputConfig<N>): TsConfigs.Monorepo.Pkg.Config<N> => ({
    ...TsConfigs.Monorepo.Pkg.STATIC_FIELDS,
    name,
    description,
    compilerOptions: {
      ...compilerOptions,
      ...TsConfigs.Monorepo.Pkg.getStaticCompilerOptions(name)
    },
    exclude: dedupeArrays(TsConfigs.Monorepo.Pkg.EXCLUDE, exclude),
    include: dedupeArrays(TsConfigs.Monorepo.Pkg.INCLUDE, include),
    ...rest
  })
});
export type Config<N extends string = string> =
  TsConfigs.Monorepo.Pkg.Config<N>;
export type InputConfig<N extends string = string> =
  TsConfigs.Monorepo.Pkg.InputConfig<N>;
