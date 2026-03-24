import type { Nullish } from '@toolbox-ts/types';

import fs from 'node:fs';
import path from 'node:path';
import { normalizeFileData } from '../normalize/index.js';
import {
  type OperationResult,
  FileConflictError,
  OperationError,
  tryCatch,
  tryCatchSync,
  unwrap
} from '../../result.js';
import { inferFileType } from '../infer-file-type/index.js';
import type { ResolutionStrategy } from '../../types.js';

import { isFile, isFileSync } from '../../file-system/queries/index.js';
import { Find } from '../../file-system/find/index.js';

export class FileWriteError extends OperationError {
  constructor({ filePath, fileType }: { filePath: string; fileType: string }, cause?: unknown) {
    super(`Failed to write ${fileType}-file at ${filePath}`, cause);
  }
}

export type WriteAction = 'aborted' | 'created' | 'overwritten' | 'skipped';
/**
 * Strategies for resolving file conflicts during write operations.
 * - `abort`: Abort the operation if a conflict is detected.
 * - `skip`: Skip the operation if a conflict is detected.
 * - `overwrite`: Overwrite the existing file with the new content.
 * - `create`: Create a new file without overwriting the existing one (adds duplicate number). e.g. `file.txt` -> `file (1).txt`
 */
export type WriteConflictStrategy = ResolutionStrategy;
/**
 * If a ResolutionStrategy is returned, it will be used as the conflict resolution strategy.
 * If an object with a newData property is returned, the newData will be used as the data to overwrite the existing data.
 * This allows for dynamic conflict resolution based on the file path and input data.
 * @example
 * ```ts
 * // Custom conflict handler that prompts the user
 * const result = await write('path/to/file.txt', 'data', {
 *   conflict: async (filePath, data) => {
 *     const answer = await promptUser(`File ${filePath} already exists. Overwrite?`);
 *     if (answer === 'yes') return 'overwrite';
 *     if (answer === 'no') return 'skip';
 *     return null; // abort
 *   }
 * });
 * ```
 */
export type WriteConflictHandler<D = unknown> = (
  filePath: string,
  inputData: D,
  existingData: string | Nullish
) => { newData: D } | Promise<{ newData: D } | ResolutionStrategy> | ResolutionStrategy;
export type SyncWriteConflictHandler<D = unknown> = (
  filePath: string,
  inputData: D,
  existingData: string | Nullish
) => { newData: D } | ResolutionStrategy;
export interface WriteFileOptions<D = unknown> {
  conflict?: WriteConflictHandler<D> | ResolutionStrategy;
  encoding?: BufferEncoding;
  flag?: fs.OpenMode;
  flush?: boolean;
  mkDir?: fs.MakeDirectoryOptions;
  mode?: fs.Mode;
  signal?: AbortSignal;
  stringify?: (data: D) => string;
  fileType?: string;
}

/**
 * The result of a write operation.
 *
 * @important
 * `ok: true` does not mean the file was written. It indicates that the operation executed and conflicts were handled according to the specified strategy without errors.
 *
 * @example
 * ```ts
 * write('path/to/file.txt', 'Hello, World!');
 * // { action: 'created', conflict: false, data: 'Hello, World!', filePath: 'path/to/file.txt', ok: true }
 *
 * write('path/to/conflict.txt', 'data', { conflict: 'abort' });
 * // { action: 'aborted', conflict: { prompted: false, strategy: 'abort' }, data: 'data', filePath: 'path/to/conflict.txt', ok: true }
 * ```
 */
export type WriteFileResultDetail<D> = {
  action: WriteAction;
  conflict: ResolutionStrategy | false;
  writeData: { input: D; resolved: D | null };
  filePath: string;
  fileType: string;
} & (
  | { conflict: 'skip'; action: 'skipped'; writeData: { input: D; resolved: D } }
  | { conflict: 'abort'; action: 'aborted'; writeData: { input: D; resolved: null } }
  | {
      conflict: false | 'overwrite';
      action: 'created' | 'overwritten';
      writeData: { input: D; resolved: D };
    }
  | {
      conflict: 'create';
      action: 'created';
      duplicateCount: number;
      writeData: { input: D; resolved: D };
    }
);

//#endregion

const skip = <D>(
  filePath: string,
  inputData: D,
  resolvedData: D = inputData,
  fileType: string
): WriteFileResultDetail<D> => ({
  action: 'skipped',
  filePath,
  conflict: 'skip',
  writeData: { input: inputData, resolved: resolvedData },
  fileType
});
const success = <D>(
  filePath: string,
  isConflict: boolean,
  inputData: D,
  resolvedData: D,
  fileType: string
): WriteFileResultDetail<D> => ({
  filePath,
  action: isConflict ? 'overwritten' : 'created',
  conflict: !isConflict ? false : 'overwrite',
  writeData: { input: inputData, resolved: resolvedData },
  fileType
});
const handleDuplicate = async <D>(
  filePath: string,
  inputData: D,
  resolvedData: D,
  fileType: string,
  stringify: (data: D) => string,
  opts: WriteFileOptions<D>
): Promise<WriteFileResultDetail<D>> => {
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  const found = await Find.tryAllAt(`${baseName}{,(*)}${ext}`, path.dirname(filePath));
  if (!found.ok) throw found.error;
  const count = found.detail.length;
  if (count === 0)
    throw new FileConflictError(
      filePath,
      new Error('Duplicate handler (handleDuplicate) called but no existing files found')
    );
  const newFilePath = path.join(path.dirname(filePath), `${baseName}(${count})${ext}`);
  await fs.promises.writeFile(newFilePath, stringify(resolvedData), opts);
  return {
    conflict: 'create',
    action: 'created',
    filePath: newFilePath,
    duplicateCount: count,
    writeData: { input: inputData, resolved: resolvedData },
    fileType
  };
};

const resolveConflictStrategy = async <D = unknown>(
  filePath: string,
  inputData: D,
  conflict: Exclude<WriteConflictHandler<D>, false> | ResolutionStrategy
): Promise<{ strategy: ResolutionStrategy; resolvedData: D }> => {
  const result: { strategy: ResolutionStrategy; resolvedData: D } = {
    strategy: 'overwrite',
    resolvedData: inputData
  };
  if (typeof conflict === 'function') {
    let fromFn = await conflict(filePath, inputData, await fs.promises.readFile(filePath, 'utf8'));
    if (typeof fromFn === 'object') {
      result.strategy = 'overwrite';
      result.resolvedData = fromFn.newData;
    } else result.strategy = fromFn;
  } else result.strategy = conflict;
  return result;
};
export type WriteFileResult<D> = OperationResult<WriteFileResultDetail<D>, FileWriteError>;
export const tryWriteFile = async <D = unknown>(
  filePath: string,
  data: D,
  {
    mkDir,
    encoding = 'utf8',
    conflict = 'overwrite',
    stringify = normalizeFileData,
    fileType = inferFileType(filePath),
    ...rest
  }: WriteFileOptions<D> = {}
): Promise<WriteFileResult<D>> =>
  tryCatch<WriteFileResultDetail<D>, FileWriteError>(
    async () => {
      let writeData = data;
      let isConflict = false;
      if (await isFile(filePath)) {
        isConflict = true;
        const { resolvedData, strategy } = await resolveConflictStrategy<D>(
          filePath,
          data,
          conflict
        );
        if (strategy === 'abort') throw new FileConflictError(filePath);
        writeData = resolvedData;
        if (strategy === 'skip') return skip(filePath, data, resolvedData, fileType);
        if (strategy === 'create')
          return handleDuplicate(filePath, data, resolvedData, fileType, stringify, {
            encoding,
            ...rest
          });
      }
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true, ...mkDir });
      await fs.promises.writeFile(filePath, stringify(writeData), { encoding, ...rest });
      return success(filePath, isConflict, data, writeData, fileType);
    },
    /* c8 ignore next */
    (caught) => new FileWriteError({ filePath, fileType }, caught)
  );

const resolveConflictStrategySync = <D = unknown>(
  filePath: string,
  inputData: D,
  conflict: Exclude<SyncWriteConflictHandler<D>, false> | ResolutionStrategy
): { strategy: ResolutionStrategy; resolvedData: D } => {
  const result: { strategy: ResolutionStrategy; resolvedData: D } = {
    strategy: 'overwrite',
    resolvedData: inputData
  };
  if (typeof conflict === 'function') {
    let fromFn = conflict(filePath, inputData, fs.readFileSync(filePath, 'utf8'));
    if (typeof fromFn === 'object') {
      result.strategy = 'overwrite';
      result.resolvedData = fromFn.newData;
    } else result.strategy = fromFn;
  } else result.strategy = conflict;
  return result;
};
const handleDuplicateSync = <D>(
  filePath: string,
  inputData: D,
  resolvedData: D,
  fileType: string,
  stringify: (data: D) => string,
  opts: WriteFileSyncOptions<D>
): WriteFileResultDetail<D> => {
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  const found = Find.tryAllAtSync(`${baseName}{,(*)}${ext}`, path.dirname(filePath));
  if (!found.ok) throw found.error;
  const count = found.detail.length;
  if (count === 0)
    throw new FileConflictError(
      filePath,
      new Error('Duplicate handler (handleDuplicate) called but no existing files found')
    );
  const newFilePath = path.join(path.dirname(filePath), `${baseName}(${count})${ext}`);
  fs.writeFileSync(newFilePath, stringify(resolvedData), opts);
  return {
    conflict: 'create',
    action: 'created',
    filePath: newFilePath,
    duplicateCount: count,
    writeData: { input: inputData, resolved: resolvedData },
    fileType
  };
};
export type WriteFileSyncOptions<D> = Omit<WriteFileOptions<D>, 'conflict' | 'flag'> & {
  conflict?: Exclude<SyncWriteConflictHandler<D>, false> | ResolutionStrategy;
  flag?: string | undefined;
};
export type WriteFileSyncResult<D> = OperationResult<WriteFileResultDetail<D>, FileWriteError>;
export const tryWriteFileSync = <D = unknown>(
  filePath: string,
  data: D,
  {
    mkDir,
    encoding = 'utf8',
    conflict = 'overwrite',
    stringify = normalizeFileData,
    fileType = inferFileType(filePath),
    ...rest
  }: Omit<WriteFileSyncOptions<D>, 'flag'> & { flag?: string | undefined } = {}
): WriteFileSyncResult<D> =>
  tryCatchSync<WriteFileResultDetail<D>, FileWriteError>(
    () => {
      let writeData = data;
      let isConflict = false;
      if (isFileSync(filePath)) {
        isConflict = true;
        const { resolvedData, strategy } = resolveConflictStrategySync<D>(filePath, data, conflict);
        if (strategy === 'abort') throw new FileConflictError(filePath);
        writeData = resolvedData;
        if (strategy === 'skip') return skip(filePath, data, resolvedData, fileType);
        if (strategy === 'create')
          return handleDuplicateSync(filePath, data, resolvedData, fileType, stringify, {
            encoding,
            ...rest
          });
      }
      fs.mkdirSync(path.dirname(filePath), { recursive: true, ...mkDir });
      fs.writeFileSync(filePath, stringify(writeData), { encoding, ...rest });
      return success(filePath, isConflict, data, writeData, fileType);
    },
    /* c8 ignore next */
    (caught) => new FileWriteError({ filePath, fileType }, caught)
  );

// #region> Unwrapped
/* c8 ignore start */
/** @see {@link tryWriteFile} */
export const writeFile = async <D = unknown>(
  filePath: string,
  data: D,
  opts: WriteFileOptions<D> = {}
): Promise<WriteFileResultDetail<D>> => unwrap(await tryWriteFile(filePath, data, opts));
/** @see {@link tryWriteFileSync} */
export const writeFileSync = <D = unknown>(
  filePath: string,
  data: D,
  opts: Omit<WriteFileSyncOptions<D>, 'flag'> & { flag?: string | undefined } = {}
): WriteFileResultDetail<D> => unwrap(tryWriteFileSync(filePath, data, opts));
/* c8 ignore stop */
// #endregion
