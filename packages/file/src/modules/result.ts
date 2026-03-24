import { normalizeError } from '@toolbox-ts/utils/core';

/* c8 ignore start */
export type OperationResult<D, E extends OperationError = OperationError> =
  | { ok: false; error: E }
  | { ok: true; detail: D };

export class OperationError extends Error {
  public cause?: Error;

  public static from(e: unknown): OperationError {
    if (e instanceof OperationError) return e;
    const normalized = normalizeError(e);
    return new OperationError(normalized.message, normalized.cause);
  }

  constructor(message?: string, cause?: unknown) {
    super(`${message ?? 'Error'}`);
    this.name = 'OperationError';
    this.cause = normalizeError(cause);
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return { name: this.name, message: this.message, cause: this.cause, stack: this.stack };
  }
}
export class FileNotFoundError extends OperationError {
  constructor(filePath: string, cause?: Error) {
    super(`File not found at ${filePath}`, cause);
  }
}
export class FileConflictError extends OperationError {
  constructor(filePath: string, cause?: Error) {
    super(`File conflict at ${filePath}`, cause);
  }
}
/* c8 ignore stop */

export const ok = <D>(d: D): OperationResult<D> & { ok: true } => ({ ok: true, detail: d });
/**
 * Helper function to create a standardized error result for file operations.
 */
export const err = <D, E extends OperationError>(e: E): OperationResult<D, E> & { ok: false } => ({
  ok: false,
  error: e
});
export const tryCatch = async <D, E extends OperationError>(
  success: () => Promise<D>,
  error: (e: unknown) => E
): Promise<OperationResult<D, E>> => {
  try {
    return { ok: true, detail: await success() };
  } catch (e) {
    return { error: error(e), ok: false };
  }
};
export const tryCatchSync = <D, E extends OperationError>(
  success: () => D,
  error: (e: unknown) => E
): OperationResult<D, E> => {
  try {
    return { ok: true, detail: success() };
  } catch (e) {
    return { error: error(e), ok: false };
  }
};
export const unwrap = <D, E extends OperationError = OperationError>(
  result: OperationResult<D, E>
): D => {
  if (!result.ok) throw result.error;
  return result.detail;
};
