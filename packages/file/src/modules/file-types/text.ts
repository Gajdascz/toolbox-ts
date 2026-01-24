/* c8 ignore start */
import path from 'node:path';

export const FILE_EXTENSIONS = ['txt'] as const;
export type TextFileExt = (typeof FILE_EXTENSIONS)[number];
export const FILE_EXTENSIONS_SET = new Set<string>(FILE_EXTENSIONS);

export const isFile = <const E extends string>(
  filename: string,
  otherExts: E[] = []
): filename is `${string}.${E | TextFileExt}` =>
  [...FILE_EXTENSIONS, ...otherExts].includes(
    path.extname(filename).toLowerCase().slice(1) as E | TextFileExt
  );

/* c8 ignore end */

export {
  type NormalizeFileData,
  readFile as parseFile,
  readFileSync as parseFileSync,
  normalizeFileData as stringify,
  writeFile
} from '../helpers/helpers.js';
