import { TSESLint } from '@typescript-eslint/utils';
import { createJiti } from 'jiti';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type * as Export from './index.js';

const jiti = createJiti(import.meta.url, {
  cache: false,
  interopDefault: true
});

beforeEach(() => {
  vi.clearAllMocks();
});
type ESLintInstance = {
  calculateConfigForFile: (
    filePath: string
  ) => Promise<TSESLint.FlatConfig.Config>;
} & Omit<InstanceType<typeof TSESLint.ESLint>, 'calculateConfigForFile'>;

const getEslint = (cfg: TSESLint.FlatConfig.ConfigArray) =>
  new TSESLint.FlatESLint({
    baseConfig: cfg,
    overrideConfig: cfg,
    overrideConfigFile: true
  }) as ESLintInstance;
const toTseslintSrc = (cwd = process.cwd(), ...rest: string[]) =>
  path.join(cwd, 'packages', 'tseslint', 'src', ...rest);

describe('@toolbox-ts/tseslint spec', async () => {
  const { defineConfig } = await jiti.import<typeof Export>('../src/index.js');
  const eslint = getEslint(defineConfig());
  const cwd = process.cwd();
  it.each([
    [
      'src',
      {
        calculateCfgFor: [toTseslintSrc(cwd, 'index.ts')],
        tsconfig: path.join(cwd, 'tsconfig.build.json')
      }
    ],
    [
      'test',
      {
        calculateCfgFor: [
          toTseslintSrc(cwd, 'tseslint.spec.ts'),
          toTseslintSrc(cwd, 'define-config', 'define-config.test.ts')
        ],
        tsconfig: path.join(cwd, 'tsconfig.test.json')
      }
    ],
    [
      'dev',
      {
        calculateCfgFor: [path.join(cwd, 'eslint.config.ts')],
        tsconfig: path.join(cwd, 'tsconfig.dev.json')
      }
    ]
  ])('should apply %s config', async (_, { calculateCfgFor, tsconfig }) => {
    for (const file of calculateCfgFor) {
      const calculatedCfg = await eslint.calculateConfigForFile(file);
      expect(calculatedCfg).toBeDefined();
      expect(
        (calculatedCfg as any).settings?.['import/resolver']?.typescript
          ?.project
      ).toBe(tsconfig);
    }
  });
  it('should lint without errors', async () => {
    const results = await eslint.lintFiles([toTseslintSrc(cwd, 'index.ts')]);
    const errorResults = results.filter(
      (r) => r.errorCount > 0 || r.fatalErrorCount > 0
    );
    if (errorResults.length > 0) {
      console.log(
        'Lint errors found:',
        errorResults.map((r) => ({
          filePath: r.filePath,
          messages: r.messages
        }))
      );
    }
    expect(errorResults).toHaveLength(0);
  });
});
