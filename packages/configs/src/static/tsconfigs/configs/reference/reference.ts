import { createStaticConfigModule, TsConfigs } from '../../../../core/index.js';

export const { define, meta } = createStaticConfigModule({
  filename: TsConfigs.Reference.CONFIG.filename,
  define: () => structuredClone(TsConfigs.Reference.CONFIG)
});
export type Config = TsConfigs.Reference.Config;
