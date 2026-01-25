import type { Obj } from '@toolbox-ts/types';
import type { TsConfig } from '@toolbox-ts/types/defs/configs';

import { BASE_META, type BaseMeta } from '../shared.js';

export type Config = Obj.RequiredProps<
  TsConfig.ConfigWithMeta<BaseMeta['name']>,
  'compilerOptions'
>
  & StaticFields;

export type InputConfig = TsConfig.ConfigWithMetaInput<
  BaseMeta['name'],
  StaticFields
>;
export interface StaticFields extends BaseMeta {
  exclude?: never;
  include?: never;
  references?: never;
}
export const STATIC_FIELDS: StaticFields = { ...BASE_META } as const;
export const META = { ...BASE_META } as const;
export const DEFAULT_COMPILER_OPTIONS: {
  types: string[];
} & InputConfig['compilerOptions'] = {
  // Strictness
  strict: true,
  skipLibCheck: true,
  forceConsistentCasingInFileNames: true,
  types: ['@types/node'],

  // Interop
  esModuleInterop: true,
  allowSyntheticDefaultImports: true,
  resolveJsonModule: true,
  isolatedModules: true,
  verbatimModuleSyntax: true,
  moduleDetection: 'auto',

  // DX
  noErrorTruncation: true,
  pretty: true,

  // Optional properties (classic behavior)
  exactOptionalPropertyTypes: false
} as const;
