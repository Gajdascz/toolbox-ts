import type { TsConfig } from '@toolbox-ts/types/defs/configs';
import { getPresetMeta, createStatic, createDefine, SRC_EXCLUDE, FILENAMES } from '../core.js';
import { GLOBS, REPO } from '@toolbox-ts/constants/fs';
import { serializeJson } from '../../../../helpers.js';
export type Meta = TsConfig.Meta<'dev'>;
export const META: Meta = getPresetMeta(
  'dev',
  'Development configuration for tooling, mocks, and config files.'
);

export const STATIC = createStatic(
  {
    ...META,
    include: [
      /**
       * All Dev Source files anywhere in the repository.
       */
      GLOBS.DIR.DEV.DEEP,
      /**
       * All *.config.* files in Root
       */
      `./${GLOBS.FILE.CONFIG.MATCH}`,
      /**
       * All Source files in Root
       */
      ...GLOBS.FILES.SRC.MATCH.map((p) => `./${p}` as const)
    ],
    exclude: [...SRC_EXCLUDE, ...REPO.ROOT_SRC_DIR.any]
  },
  { rootDir: '.', noEmit: true, allowImportingTsExtensions: true, allowJs: true }
);
/** Produces dev  Input `compilerOptions` are applied under static options (static wins). */
export const define = createDefine(STATIC);
export type Config = Parameters<typeof define>[0];

export const toFileEntry = (config?: Config) => ({
  [FILENAMES.dev]: serializeJson(define(config))
});
