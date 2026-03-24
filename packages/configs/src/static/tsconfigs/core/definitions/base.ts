import type { TsConfig } from '@toolbox-ts/types/defs/configs';
import { getPresetMeta, createStatic, createDefine, FILENAMES } from '../core.js';
import { serializeJson } from '../../../../helpers.js';
export type Meta = TsConfig.Meta<'base'>;

export const META: Meta = getPresetMeta(
  'base',
  'Base TypeScript configuration shared across all other configurations.'
);
export const FILE_NAME = FILENAMES.base;

export const STATIC = createStatic(
  { ...META },
  {
    // Strictness
    strict: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,

    // Interop
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    resolveJsonModule: true,
    isolatedModules: true,
    verbatimModuleSyntax: true,
    moduleDetection: 'auto',

    // DX
    noErrorTruncation: true,
    pretty: true
  }
);
/** Produces base tsconfig. Input `compilerOptions` are applied under static options (static wins). */
export const define = createDefine(STATIC);
export type Config = Parameters<typeof define>[0];

export const toFileEntry = (config?: Config) => ({ [FILE_NAME]: serializeJson(define(config)) });
