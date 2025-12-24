import type { TsConfigWithMeta } from '@toolbox-ts/types/tsconfig';

import {
  BUILD_META,
  type BuildMeta,
  DEV_META,
  type DevMeta,
  REFERENCE_META,
  type ReferenceMeta,
  TEST_META,
  type TestMeta
} from '../shared.js';

export interface Config extends TsConfigWithMeta<ReferenceMeta['name'], never> {
  files: [];
  references: [
    { path: `./${BuildMeta['filename']}` },
    { path: `./${DevMeta['filename']}` },
    { path: `./${TestMeta['filename']}` }
  ];
}
export const CONFIG: Config = {
  ...REFERENCE_META,
  files: [] as const,
  references: [
    { path: `./${BUILD_META.filename}` },
    { path: `./${DEV_META.filename}` },
    { path: `./${TEST_META.filename}` }
  ]
} as const;
