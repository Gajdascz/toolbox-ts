import { vitest } from '@toolbox-ts/configs';

import type { OrchestratorConfigEntry } from '../../types.js';

import { mapConfigModuleDeps } from '../../../project/index.js';

export const VITEST_UI_PKG = '@vitest/ui';
export const TEST_UTILS_PKG = '@toolbox-ts/test-utils';
export const TEST_UTILS_SETUP_PATH = `${TEST_UTILS_PKG}/setup`;
export interface Config extends vitest.Config {
  addTestUtils?: boolean;
  addVitestUI?: boolean;
}
export const get = ({
  addVitestUI = true,
  addTestUtils = false,
  setupFiles = []
}: Config = {}): OrchestratorConfigEntry<Config> => {
  const dependencies = mapConfigModuleDeps(vitest.meta.dependencies);
  if (addVitestUI) dependencies.push([VITEST_UI_PKG, { isDev: true }]);
  if (addTestUtils) {
    dependencies.push([TEST_UTILS_PKG, { isDev: true }]);
    switch (typeof setupFiles) {
      case 'string':
        setupFiles = [TEST_UTILS_SETUP_PATH, setupFiles];
        break;
      case 'object':
        setupFiles.push(TEST_UTILS_SETUP_PATH);
        break;
      default:
        setupFiles = [TEST_UTILS_SETUP_PATH];
    }
  }

  return {
    files: [
      {
        filename: vitest.meta.filename,
        contentSerializer: vitest.getTemplateString,
        fileData: {
          name: 'runtime',
          type: 'default',
          options: {
            serialize: {
              fn: vitest.getTemplateString,
              name: `vitest.getTemplateString`
            }
          }
        }
      }
    ],
    dependencies: mapConfigModuleDeps(vitest.meta.dependencies),
    pkgPatch: {
      scripts: {
        test: `pnpm vitest --config ${vitest.meta.filename}`,
        ...(addVitestUI && { 'test:ui': 'pnpm test --ui' })
      }
    }
  };
};
