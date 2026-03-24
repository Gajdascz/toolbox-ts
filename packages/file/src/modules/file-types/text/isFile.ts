import path from 'node:path';
import { EXTS } from '@toolbox-ts/constants/fs';

export const isFile = <const E extends string>(
  filename: string,
  otherExts: E[] = []
): filename is `${string}.${E | EXTS.TxtExtension}` =>
  [...EXTS.TXT, ...otherExts].includes(
    path.extname(filename).toLowerCase().slice(1) as E | EXTS.TxtExtension
  );
