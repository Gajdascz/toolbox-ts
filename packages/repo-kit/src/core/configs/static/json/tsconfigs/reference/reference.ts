import type { TsConfigMeta, TsConfigWithMeta } from '@toolbox-ts/types';
import {
  type TsConfigBuildFile,
  type TsConfigDevFile,
  type TsConfigTestFile,
  TSCONFIG_BUILD_FILE,
  TSCONFIG_DEV_FILE,
  TSCONFIG_DOMAIN,
  TSCONFIG_SCHEMA,
  TSCONFIG_TEST_FILE
} from '../../../../../../../core/index.js';

export interface Config extends TsConfigWithMeta<ReferenceMeta['name'], never> {
  files: [];
  references: [
    { path: `./${TsConfigBuildFile}` },
    { path: `./${TsConfigDevFile}` },
    { path: `./${TsConfigTestFile}` }
  ];
}
export const META: TsConfigMeta<typeof TSCONFIG_DOMAIN.reference> = {
  $schema: TSCONFIG_SCHEMA,
  name: TSCONFIG_DOMAIN.reference,
  description:
    'Provides full VSCode IDE typing and intellisense support. This is required to correctly match configurations to their targeted files.'
} as const;
export const CONFIG: Config = {
  ...META,
  files: [] as const,
  references: [
    { path: `./${TSCONFIG_BUILD_FILE}` },
    { path: `./${TSCONFIG_DEV_FILE}` },
    { path: `./${TSCONFIG_TEST_FILE}` }
  ]
} as const;

export type ReferenceMeta = typeof META;

export const define = () => structuredClone(CONFIG);
