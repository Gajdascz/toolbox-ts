import fs from 'node:fs';
import { tryCatch, tryCatchSync, unwrap } from '../../../../result.js';
import fg from 'fast-glob';
import { Arr } from '@toolbox-ts/utils';
import { DirectoryError } from '../error.js';

const READ_ERROR = `Failed to read directory`;
const FG_DEFAULTS: fg.Options = { fs, deep: 1, onlyFiles: false, onlyDirectories: false };
const READ_DIRS_ERROR = `${READ_ERROR} (directories)`;
const READ_FILES_ERROR = `${READ_ERROR} (files)`;
const READ_FILES_EXTS = `${READ_ERROR} (files by extensions)`;

export const tryRead = (dir: string, opts: fg.Options = {}) =>
  tryCatch(
    async () => fg(`${dir}/*`, { ...FG_DEFAULTS, ...opts }),
    /* c8 ignore next */
    (e) => new DirectoryError(`${READ_ERROR}: ${dir}`, e)
  );

export const tryReadSync = (dir: string, opts: fg.Options = {}) =>
  tryCatchSync(
    () => fg.sync(`${dir}/*`, { ...FG_DEFAULTS, ...opts }),
    /* c8 ignore next */
    (e) => new DirectoryError(`${READ_ERROR}: ${dir}`, e)
  );

//#region> readDirs
export type ReadDirsOptions = Omit<fg.Options, 'onlyFiles' | 'onlyDirectories'>;
export const tryReadDirs = (dir: string, opts: ReadDirsOptions = {}) =>
  tryCatch(
    async () => fg(`${dir}/*`, { ...FG_DEFAULTS, ...opts, onlyDirectories: true }),
    /* c8 ignore next */
    (e) => new DirectoryError(`${READ_DIRS_ERROR}: ${dir}`, e)
  );

export const tryReadDirsSync = (dir: string, opts: ReadDirsOptions = {}) =>
  tryCatchSync(
    () => fg.sync(`${dir}/*`, { ...FG_DEFAULTS, ...opts, onlyDirectories: true }),
    /* c8 ignore next */
    (e) => new DirectoryError(`${READ_DIRS_ERROR}: ${dir}`, e)
  );

//#endregion
//#region> readFiles
export type ReadFilesOptions = Omit<fg.Options, 'onlyFiles' | 'onlyDirectories'>;
export const tryReadFiles = (dir: string, opts: ReadFilesOptions = {}) =>
  tryCatch(
    async () => fg(`${dir}/*`, { ...FG_DEFAULTS, ...opts, onlyFiles: true }),
    /* c8 ignore next */
    (e) => new DirectoryError(`${READ_FILES_ERROR}: ${dir}`, e)
  );

export const tryReadFilesSync = (dir: string, opts: ReadFilesOptions = {}) =>
  tryCatchSync(
    () => fg.sync(`${dir}/*`, { ...FG_DEFAULTS, ...opts, onlyFiles: true }),
    /* c8 ignore next */
    (e) => new DirectoryError(`${READ_FILES_ERROR}: ${dir}`, e)
  );

//#endregion
// #region> readFilesByExts
const formatDirExts = (dir: string, exts: string | string[]) =>
  `${dir}/*.+(${Arr.ensure(exts)
    .map((ext) => (ext.startsWith('.') ? ext.slice(1) : ext))
    .join('|')})`;
export type ReadDirFilesByExtsOptions = ReadFilesOptions;
export const tryReadFilesByExts = (
  dir: string,
  exts: string | string[],
  opts: ReadDirFilesByExtsOptions = {}
) =>
  tryCatch(
    async () => fg(formatDirExts(dir, exts), { ...FG_DEFAULTS, ...opts, onlyFiles: true }),
    /* c8 ignore next */
    (e) => new DirectoryError(`${READ_FILES_EXTS}: ${Arr.ensure(exts).join(', ')}`, e)
  );

export const tryReadFilesByExtsSync = (
  dir: string,
  exts: string | string[],
  opts: ReadDirFilesByExtsOptions = {}
) =>
  tryCatchSync(
    () => fg.sync(formatDirExts(dir, exts), { ...FG_DEFAULTS, ...opts, onlyFiles: true }),
    /* c8 ignore next */
    (e) => new DirectoryError(`${READ_FILES_EXTS}: ${Arr.ensure(exts).join(', ')}`, e)
  );

//#endregion

//#region> Unwrapped
/* c8 ignore start */
/** @see {@link tryRead} */
export const read = async (dir: string, opts?: fg.Options) => unwrap(await tryRead(dir, opts));
/** @see {@link tryReadSync} */
export const readSync = (dir: string, opts?: fg.Options) => unwrap(tryReadSync(dir, opts));
/** @see {@link tryReadDirs} */
export const readDirs = async (dir: string, opts?: ReadDirsOptions) =>
  unwrap(await tryReadDirs(dir, opts));
/** @see {@link tryReadDirsSync} */
export const readDirsSync = (dir: string, opts?: ReadDirsOptions) =>
  unwrap(tryReadDirsSync(dir, opts));
/** @see {@link tryReadFiles} */
export const readFiles = async (dir: string, opts?: ReadDirsOptions) =>
  unwrap(await tryReadFiles(dir, opts));
/** @see {@link tryReadFilesSync} */
export const readFilesSync = (dir: string, opts?: ReadDirsOptions) =>
  unwrap(tryReadFilesSync(dir, opts));
/** @see {@link tryReadFilesByExts} */
export const readFilesByExts = async (
  dir: string,
  exts: string | string[],
  opts?: ReadDirFilesByExtsOptions
) => unwrap(await tryReadFilesByExts(dir, exts, opts));
/** @see {@link tryReadFilesByExtsSync} */
export const readFilesByExtsSync = (
  dir: string,
  exts: string | string[],
  opts?: ReadDirFilesByExtsOptions
) => unwrap(tryReadFilesByExtsSync(dir, exts, opts));
/* c8 ignore stop */
// #endregion
