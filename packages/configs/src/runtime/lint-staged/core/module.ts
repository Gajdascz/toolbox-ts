import { FILES, EXTS } from '@toolbox-ts/constants/fs';
import type { InputConfig, ProcessedConfig } from './types.ts';
import { runtimeConfigToFileContent, serializeJson } from '../../../helpers.js';

export const define = ({
  srcFilesCmds,
  dataFilesCmds,
  ...rest
}: InputConfig = {}): ProcessedConfig => ({
  ...(srcFilesCmds && { [`*.{${EXTS.SRC.join(',')}}`]: srcFilesCmds }),
  ...(dataFilesCmds && { [`*.{${EXTS.DATA.join(',')}}`]: dataFilesCmds }),
  ...rest
});

export const toFileContent = (config?: InputConfig) =>
  runtimeConfigToFileContent('lint-staged', [serializeJson(config)]);

export const toFileEntry = (config?: InputConfig) => ({
  [FILES.CONFIG.LINT_STAGED]: toFileContent(config)
});
