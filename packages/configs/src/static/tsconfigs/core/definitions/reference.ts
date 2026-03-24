import type { TsConfig } from '@toolbox-ts/types/defs/configs';
import { getPresetMeta, FILENAMES, type Filename } from '../core.js';

export type Meta = TsConfig.Meta<'reference'>;
export type Config = {
  files: [];
  references: [
    { path: `./${Filename<'build'>}` },
    { path: `./${Filename<'dev'>}` },
    { path: `./${Filename<'test'>}` }
  ];
};
export type ProcessedConfig = Config;
export const META: Meta = getPresetMeta(
  'reference',
  'Provides full VSCode IDE typing and intellisense support. This is required to correctly match configurations to their targeted files.'
);
/** Produces a root tsconfig with project references to build, dev, and test configs. No inputs. */
export const define = (): ProcessedConfig => ({
  ...META,
  files: [],
  references: [
    { path: `./${FILENAMES.build}` },
    { path: `./${FILENAMES.dev}` },
    { path: `./${FILENAMES.test}` }
  ]
});

export const toFileEntry = () => ({ [FILENAMES.reference]: JSON.stringify(define(), null, 2) });
