import path from 'node:path';
import { EXTS } from '@toolbox-ts/constants/fs';

export const isJsFile = (filename: string): filename is `${string}.${EXTS.JsExtension}` =>
  EXTS.JS_SET.has(path.extname(filename).toLowerCase().slice(1));
export const isTsFile = (filename: string): filename is `${string}.${EXTS.TsExtension}` =>
  EXTS.TS_SET.has(path.extname(filename).toLowerCase().slice(1));
export const isFrameworkFile = (
  filename: string
): filename is `${string}.${EXTS.FrameworkExtension}` =>
  EXTS.FRAMEWORK_SET.has(path.extname(filename).toLowerCase().slice(1));

export const isFile = (filename: string): filename is `${string}.${EXTS.SrcExtension}` =>
  EXTS.SRC_SET.has(filename);
