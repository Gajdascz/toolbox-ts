import path from 'node:path';
import { EXTS } from '@toolbox-ts/constants/fs';

/** Check if a filename has a @see {@link JsonFileExt} extension. */
export const isFile = (filename: string): filename is `${string}.${EXTS.JsExtension}` =>
  EXTS.JSON_SET.has(path.extname(filename).toLowerCase().slice(1));
