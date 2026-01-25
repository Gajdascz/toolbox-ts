import type {
  RequiredProps,
  TsConfigMeta,
  TsConfigWithMeta,
  TsConfigWithMetaInput
} from '@toolbox-ts/types';
import {
  TSCONFIG_DOMAIN,
  TSCONFIG_SCHEMA
} from '../../../../../../../core/index.js';

export type Config = RequiredProps<
  TsConfigWithMeta<BaseMeta['name']>,
  'compilerOptions'
>
  & StaticFields;

export type InputConfig = TsConfigWithMetaInput<BaseMeta['name'], StaticFields>;
export interface StaticFields extends BaseMeta {
  exclude?: never;
  include?: never;
  references?: never;
}

export const META: TsConfigMeta<typeof TSCONFIG_DOMAIN.base> = {
  $schema: TSCONFIG_SCHEMA,
  name: TSCONFIG_DOMAIN.base,
  description:
    'Base TypeScript configuration shared across all other configurations.'
} as const;
export type BaseMeta = typeof META;

export const STATIC_FIELDS: StaticFields = { ...META } as const;
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

export const define = ({
  compilerOptions = {},
  ...rest
}: InputConfig = {}): Config => ({
  ...STATIC_FIELDS,
  compilerOptions: {
    ...DEFAULT_COMPILER_OPTIONS,
    ...compilerOptions,
    types: [...DEFAULT_COMPILER_OPTIONS.types, ...(compilerOptions.types ?? [])]
  },
  ...rest
});
