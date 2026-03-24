import path from 'node:path';
import { EXTS } from '@toolbox-ts/constants/fs';

export const isFile = (filename: string): filename is `${string}.${EXTS.YamlExtension}` =>
  EXTS.YAML_SET.has(path.extname(filename).toLowerCase().slice(1));
