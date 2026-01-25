import {
  DEFAULT_BUILD_COMPILER_OPTIONS,
  type BuildMeta,
  META
} from '../shared.ts';
import type {
  RequiredProps,
  TsConfigWithMeta,
  TsConfigWithMetaInput
} from '@toolbox-ts/types';
export { META } from '../shared.ts';

export type Config = RequiredProps<
  TsConfigWithMeta<BuildMeta['name'], StaticCompilerOptions>,
  'files' | 'references'
>
  & StaticFields;

export type InputConfig = TsConfigWithMetaInput<
  BuildMeta['name'],
  StaticFields,
  StaticCompilerOptions
>;
export interface StaticCompilerOptions {
  composite?: false | never;
  outDir?: never;
  rootDir?: never;
  tsBuildInfoFile?: never;
}
export interface StaticFields extends BuildMeta {
  exclude?: never;
  extends?: never;
  files: [];
  include?: never;
}
export const STATIC_FIELDS: StaticFields = { ...META, files: [] } as const;
export const DEFAULT_COMPILER_OPTIONS: InputConfig['compilerOptions'] = {
  ...DEFAULT_BUILD_COMPILER_OPTIONS
} as const;

export const define = ({
  references = [],
  compilerOptions = {},
  ...rest
}: InputConfig = {}): Config => ({
  ...STATIC_FIELDS,
  references,
  compilerOptions: { ...DEFAULT_COMPILER_OPTIONS, ...compilerOptions },
  ...rest
});
