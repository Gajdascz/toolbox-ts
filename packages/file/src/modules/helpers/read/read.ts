import fs from 'node:fs';
import {
  type OperationResult,
  OperationError,
  tryCatch,
  tryCatchSync,
  unwrap
} from '../../result.js';
import { inferFileType } from '../infer-file-type/index.js';

export class ReadFileError extends OperationError {
  constructor(filePath: string, fileType: string, cause?: unknown) {
    super(`Failed to read ${fileType}-file at ${filePath}`, cause);
  }
}

export type ReadFileParser<D> = (data: string) => D;

export interface ReadFileOptions {
  encoding?: BufferEncoding;
  flag?: fs.OpenMode;
  signal?: AbortSignal;
  fileType?: string;
}
export interface ReadFileSyncOptions {
  encoding?: BufferEncoding;
  flag?: string;
  fileType?: string;
}
export type ReadFileResult = OperationResult<string, ReadFileError>;
export type ReadFileParsedResult<D> = OperationResult<D, ReadFileError>;
export function tryReadFile(filePath: string, options?: ReadFileOptions): Promise<ReadFileResult>;
export function tryReadFile<D>(
  filePath: string,
  parser: ReadFileParser<D>,
  options?: ReadFileOptions
): Promise<ReadFileParsedResult<D>>;
export async function tryReadFile<D = string>(
  filePath: string,
  parserOrOptions?: ReadFileParser<D> | ReadFileOptions,
  options?: ReadFileOptions
): Promise<OperationResult<D, ReadFileError>>;
export async function tryReadFile<D = string>(
  filePath: string,
  parserOrOptions?: ReadFileParser<D> | ReadFileOptions,
  options: ReadFileOptions = {}
): Promise<OperationResult<D, ReadFileError>> {
  let parser: ReadFileParser<D> | undefined;
  let opts: ReadFileOptions = {};
  if (typeof parserOrOptions === 'function') {
    parser = parserOrOptions;
    opts = options;
  } else opts = parserOrOptions || {};

  const { encoding = 'utf8', ...rest } = opts;
  return tryCatch(
    async () => {
      const raw = await fs.promises.readFile(filePath, { encoding, ...rest });
      return parser ? parser(raw) : (raw as D);
    },
    /* c8 ignore next */
    (e) => new ReadFileError(filePath, opts.fileType ?? inferFileType(filePath), e)
  );
}

export function tryReadFileSync(filePath: string, options?: ReadFileSyncOptions): ReadFileResult;
export function tryReadFileSync<D>(
  filePath: string,
  parser: ReadFileParser<D>,
  options?: ReadFileSyncOptions
): ReadFileParsedResult<D>;
export function tryReadFileSync<D>(
  filePath: string,
  parserOrOptions?: ReadFileParser<D> | ReadFileSyncOptions,
  options?: ReadFileSyncOptions
): OperationResult<D | string, ReadFileError>;
export function tryReadFileSync<D>(
  filePath: string,
  parserOrOptions?: ReadFileParser<D> | ReadFileSyncOptions,
  options?: ReadFileSyncOptions
): OperationResult<D, ReadFileError>;
export function tryReadFileSync<D>(
  filePath: string,
  parserOrOptions?: ReadFileParser<D> | ReadFileSyncOptions,
  options: ReadFileSyncOptions = {}
): OperationResult<D, ReadFileError> {
  let parser: ReadFileParser<D> | undefined;
  let opts: ReadFileSyncOptions = {};
  if (typeof parserOrOptions === 'function') {
    parser = parserOrOptions;
    opts = options;
  } else opts = parserOrOptions || {};
  const { encoding = 'utf8', ...rest } = opts;
  return tryCatchSync(
    () => {
      const raw = fs.readFileSync(filePath, { encoding, ...rest });
      return parser ? parser(raw) : (raw as unknown as D);
    },
    /* c8 ignore next */
    (e) => new ReadFileError(filePath, opts.fileType ?? inferFileType(filePath), e)
  );
}

//#region> Unwrapped
/* c8 ignore start */
/** @see {@link tryReadFile} */
export function readFile(filePath: string, options?: ReadFileOptions): Promise<string>;
export function readFile<D>(
  filePath: string,
  parser: ReadFileParser<D>,
  options?: ReadFileOptions
): Promise<D>;
export async function readFile<D = string>(
  filePath: string,
  parserOrOptions?: ReadFileParser<D> | ReadFileOptions,
  options?: ReadFileOptions
): Promise<D | string>;
export async function readFile<D = string>(
  filePath: string,
  parserOrOptions?: ReadFileParser<D> | ReadFileOptions,
  options: ReadFileOptions = {}
): Promise<D | string> {
  return unwrap(await tryReadFile(filePath, parserOrOptions, options));
}
/** @see {@link tryReadFileSync} */
export function readFileSync(filePath: string, options?: ReadFileSyncOptions): string;
export function readFileSync<D>(
  filePath: string,
  parser: ReadFileParser<D>,
  options?: ReadFileSyncOptions
): D;
export function readFileSync<D>(
  filePath: string,
  parserOrOptions?: ReadFileParser<D> | ReadFileSyncOptions,
  options?: ReadFileSyncOptions
): D | string;
export function readFileSync<D>(
  filePath: string,
  parserOrOptions?: ReadFileParser<D> | ReadFileSyncOptions,
  options: ReadFileSyncOptions = {}
): D | string {
  return unwrap(tryReadFileSync(filePath, parserOrOptions, options));
}
/* c8 ignore stop */
//#endregion
