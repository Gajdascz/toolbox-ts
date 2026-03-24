import path from 'node:path';
import { EXTS } from '@toolbox-ts/constants/fs';
import type { FileType } from '../../types.js';

export const inferFileType = (filename: string): FileType => {
  const ext = path.extname(filename).slice(1);
  if (EXTS.JSON_SET.has(ext)) return 'json';
  if (EXTS.YAML_SET.has(ext)) return 'yaml';
  if (EXTS.SRC_SET.has(ext)) return 'module';
  return 'text';
};
