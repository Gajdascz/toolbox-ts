import { ReadFileError, readFile, readFileSync } from '../read/index.js';
import { normalizeFileData } from '../normalize/index.js';
import { tryWriteFile, tryWriteFileSync } from '../write/index.js';
import { isFile, isFileSync } from '../../file-system/queries/index.js';
import {
  tryCatch,
  tryCatchSync,
  FileNotFoundError,
  type OperationResult,
  OperationError,
  unwrap
} from '../../result.js';
import { inferFileType } from '../infer-file-type/index.js';
import type { ResolutionStrategy } from '../../types.js';

export class PatchFileError extends OperationError {
  constructor(
    { filePath, fileType = 'text' }: { filePath: string; fileType?: string },
    cause?: unknown
  ) {
    super(`Failed to patch ${fileType}-file at ${filePath}`, cause);
  }
}

//#region Types
export type PatcherFn<D> = (currentData: D) => D | Promise<D>;
export type PatcherSyncFn<D> = (currentData: D) => D;

export type PatchFileAction = 'created' | 'patched' | 'skipped' | 'aborted';

/**
 * Strategy for handling missing files during patching.
 *
 * - 'create': Create the file if it does not exist.
 * - 'abort': Abort the operation if the file is missing.
 * - 'skip': Skip the patching operation if the file is missing.
 * - `overwrite`: Treated as 'create' when file is missing.
 */
export type PatchOnMissingFileStrategy = ResolutionStrategy;

export type PatchFileResultDetail<D> = { filePath: string; fileType: string } & (
  | { action: 'skipped' | 'aborted'; data: null }
  | { action: 'created'; data: { prePatch: undefined; postPatch: D } }
  | { action: 'patched'; data: { prePatch: D; postPatch: D } }
);
export type PatchFileOptions<D = unknown> = {
  onMissingFile?: PatchOnMissingFileStrategy;
  parser?: (data: string) => D;
  reader?: (filePath: string) => Promise<string | OperationResult<string, ReadFileError>>;
  stringify?: (data: D) => string;
  fileType?: string;
  defaultData?: D | (() => D);
};

export type PatchFileSyncOptions<D = unknown> = Omit<PatchFileOptions<D>, 'reader'> & {
  reader?: (filePath: string) => string | OperationResult<string, ReadFileError>;
};
//#endregion
export type PatchFileResult<D> = OperationResult<PatchFileResultDetail<D>, PatchFileError>;
const skip = <D>(
  filePath: string,
  fileType: string
): PatchFileResultDetail<D> & { action: 'skipped' } => ({
  action: 'skipped',
  data: null,
  filePath,
  fileType
});
const patched = <D>(
  filePath: string,
  prePatchData: D,
  postPatchData: D,
  fileType: string
): PatchFileResultDetail<D> & { action: 'patched' } => ({
  action: 'patched',
  filePath,
  fileType,
  data: { prePatch: prePatchData, postPatch: postPatchData }
});
const created = <D>(
  filePath: string,
  data: D,
  fileType: string
): PatchFileResultDetail<D> & { action: 'created' } => ({
  action: 'created',
  filePath,
  fileType,
  data: { prePatch: undefined, postPatch: data }
});

export const tryPatchFile = async <D = unknown>(
  filePath: string,
  patcher: PatcherFn<D>,
  opts?: PatchFileOptions<D>
): Promise<PatchFileResult<D>> => {
  const {
    onMissingFile = 'skip',
    defaultData = {} as D,
    parser,
    reader = readFile,
    stringify = normalizeFileData,
    fileType = inferFileType(filePath)
  } = opts ?? {};
  return tryCatch<PatchFileResultDetail<D>, PatchFileError>(
    async () => {
      let currentData: D;
      let action: 'created' | 'patched';
      if (await isFile(filePath)) {
        const read = await reader(filePath);
        const readRes: { ok: true; detail: string } | { ok: false; error: ReadFileError } =
          typeof read === 'string' ? { ok: true, detail: read } : read;
        if (!readRes.ok) throw readRes.error;
        currentData = parser ? parser(readRes.detail) : (readRes.detail as D);
        action = 'patched';
      } else {
        if (onMissingFile === 'abort') throw new FileNotFoundError(filePath);
        if (onMissingFile === 'skip') return skip(filePath, fileType);
        currentData = typeof defaultData === 'function' ? (defaultData as () => D)() : defaultData;
        action = 'created';
      }
      const postPatch = await patcher(currentData);
      const write = await tryWriteFile(filePath, postPatch, {
        stringify,
        conflict: 'overwrite',
        fileType
      });
      if (!write.ok) throw write.error;
      return action === 'created'
        ? created(filePath, postPatch, fileType)
        : patched(filePath, currentData, postPatch, fileType);
    },
    /* c8 ignore next */
    (e) => new PatchFileError({ filePath, fileType }, e)
  );
};

export const tryPatchFileSync = <D = unknown>(
  filePath: string,
  patcher: PatcherSyncFn<D>,
  opts?: PatchFileSyncOptions<D>
): PatchFileResult<D> => {
  const {
    onMissingFile = 'skip',
    defaultData = {} as D,
    parser,
    reader = readFileSync,
    stringify = normalizeFileData,
    fileType = inferFileType(filePath)
  } = opts ?? {};
  return tryCatchSync<PatchFileResultDetail<D>, PatchFileError>(
    () => {
      let currentData: D;
      let action: 'created' | 'patched';
      if (isFileSync(filePath)) {
        const read = reader(filePath);
        const readRes: { ok: true; detail: string } | { ok: false; error: ReadFileError } =
          typeof read === 'string' ? { ok: true, detail: read } : read;
        if (!readRes.ok) throw readRes.error;
        currentData = parser ? parser(readRes.detail) : (readRes.detail as D);
        action = 'patched';
      } else {
        if (onMissingFile === 'abort') throw new FileNotFoundError(filePath);
        if (onMissingFile === 'skip') return skip(filePath, fileType);
        currentData = typeof defaultData === 'function' ? (defaultData as () => D)() : defaultData;
        action = 'created';
      }
      const postPatch = patcher(currentData);
      const write = tryWriteFileSync(filePath, postPatch, {
        stringify,
        conflict: 'overwrite',
        fileType
      });
      if (!write.ok) throw write.error;
      return action === 'created'
        ? created(filePath, postPatch, fileType)
        : patched(filePath, currentData, postPatch, fileType);
    },
    /* c8 ignore next */
    (e) => new PatchFileError({ filePath, fileType }, e)
  );
};

// #region> Unwrapped
/* c8 ignore start */
/** @see {@link tryPatchFile} */
export const patchFile = async <D = unknown>(
  filePath: string,
  patcher: PatcherFn<D>,
  opts?: PatchFileOptions<D>
): Promise<PatchFileResultDetail<D>> => unwrap(await tryPatchFile(filePath, patcher, opts));
/** @see {@link tryPatchFileSync} */
export const patchFileSync = <D = unknown>(
  filePath: string,
  patcher: PatcherSyncFn<D>,
  opts?: PatchFileSyncOptions<D>
): PatchFileResultDetail<D> => unwrap(tryPatchFileSync(filePath, patcher, opts));
/* c8 ignore stop */
//#endregion
