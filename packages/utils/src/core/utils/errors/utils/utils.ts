//#region> Types
export type OnError = 'log' | 'return' | 'throw';
export interface ResolvedError {
  cause?: unknown;
  message: string;
  stack?: string;
  type: string;
}
export type Result<T, E = ResolvedError> =
  | { error: E; ok: false }
  | { ok: true; value: T };
//#endregion

/**
 * Resolves the type name of a given value.
 *
 * - For objects, it returns the constructor name (or 'Object' if not available).
 * - For null, it returns 'null'.
 * - For other types, it returns the result of `typeof`.
 *
 * @example
 * ```ts
 * resolveTypeName(new Date()); // 'Date'
 * resolveTypeName(Object.create(null)); // 'Object'
 * resolveTypeName(null); // 'null'
 * resolveTypeName(123); // 'number'
 * ```
 */
export const resolveTypeName = (val: unknown) =>
  typeof val === 'object' || typeof val === 'function' ?
    val === null ?
      'null'
    : ((val as { typeName?: string } | undefined)?.typeName
      ?? (val as { constructor: { name: string | undefined } | undefined })
        .constructor?.name
      ?? 'Object')
  : typeof val;

export const resolveError = (err: unknown): ResolvedError => {
  if (typeof err === 'string') return { message: err, type: 'string' };
  if (err instanceof Error)
    return {
      message: err.message,
      type: err.name,
      stack: err.stack,
      cause: err.cause
    };
  return { message: String(err), type: typeof err };
};
/**
 * Tries to execute an async function, handling any thrown errors based on the provided `onErr` strategy.
 *
 * - Provides streamlined error resolution and handling.
 *
 * @template T - The type of the successful result that the function would return if no error occurs (or the fallback in error if handled that way).
 *
 * @example
 * ```ts
 * // Returns undefined on failure, logs error
 * await doTry(async () => fetchData(), 'log');
 *
 * // Re-throws error on failure
 * await doTry(async () => fetchData(), 'throw');
 *
 * // Re-throws as TypeError
 * await doTry(async () => fetchData(), 'throw', TypeError);
 *
 * // Returns Result type
 * const result = await doTry(async () => fetchData(), 'result');
 * if (result.ok) {
 *   console.log(result.value);
 * } else {
 *   console.error(result.error.message);
 * }
 *
 * // Custom error handling with fallback
 * await doTry(async () => fetchData(), (err) => {
 *   console.error(err.message);
 *   return fallbackValue;
 * });
 * ```
 */
export async function doTry<T>(
  fn: () => Promise<T>,
  onErr: 'throw' | ((err: ResolvedError) => Promise<T> | T),
  throwAs?: new (message?: string, options?: unknown) => Error
): Promise<T>;
export async function doTry<T>(
  fn: () => Promise<T>,
  onErr: 'log'
): Promise<T | undefined>;
export async function doTry<T>(
  fn: () => Promise<T>,
  onErr: 'return'
): Promise<Result<T>>;
export async function doTry<T>(
  fn: () => Promise<T>,
  onErr: ((err: ResolvedError) => Promise<T>) | OnError = 'throw',
  throwAs?: new (message?: string, options?: unknown) => Error
): Promise<Result<T> | T | undefined> {
  try {
    return await fn();
  } catch (error) {
    return handleCatch<T, Promise<T | undefined>>(error, onErr, throwAs);
  }
}
/**
 * Synchronous version of {@link doTry}
 */
export function doTrySync<T>(
  fn: () => T,
  onErr: 'throw' | ((err: ResolvedError) => T),
  throwAs?: new (message?: string, options?: unknown) => Error
): T;
export function doTrySync<T>(fn: () => T, onErr: 'log'): T | undefined;
export function doTrySync<T>(fn: () => T, onErr: 'return'): Result<T>;
export function doTrySync<T>(
  fn: () => T,
  onErr: ((err: ResolvedError) => T) | OnError = 'throw',
  throwAs?: new (message?: string, options?: unknown) => Error
): Result<T> | T | undefined {
  try {
    return fn();
  } catch (error) {
    return handleCatch<T, T | undefined>(error, onErr, throwAs);
  }
}

/**
 * Handles a caught error based on the provided `onErr` strategy.
 *
 * @template T - The type of the successful result that the function would return if no error occurs (or the fallback in error if handled that way).
 * @template R - The return type of the `handleCatch` function, which can vary based on the `onErr` strategy
 *
 * @important The R generic should be provided to ensure sync/async consistency is properly typed and handled.
 *
 * @example
 * ```ts
 * try {
 *   await callApi();
 * } catch (err) {
 *   return handleCatch<APIResult, Promise<APIResult | undefined>>(err, 'log');
 * }
 *
 * try {
 *   await callApi();
 * } catch (err) {
 *   return handleCatch<APIResult, Promise<APIResult>>(err, 'throw', TypeError);
 * }
 *
 * try {
 *   const result = syncCallApi();
 * } catch (err) {
 *   return handleCatch<APIResult, APIResult>(err, (error) => {
 *     console.error(error.message);
 *     return fallbackValue;
 *   });
 * }
 * ```
 */
export function handleCatch<T, R = Promise<T | undefined> | T | undefined>(
  error: unknown,
  onErr: ((err: ResolvedError) => R) | OnError,
  throwAs?: new (message?: string, options?: unknown) => Error
): ({ ok: false } & Result<T>) | R | undefined {
  const resolved = resolveError(error);
  const { message, type } = resolved;
  switch (onErr) {
    case 'log': {
      console.error('Error caught', resolved);
      return undefined as R;
    }
    case 'return':
      return { ok: false, error: resolved };

    case 'throw': {
      if (throwAs) {
        const err = new throwAs(message, { cause: error });
        err.name = type;
        throw err;
      }
      throw error;
    }
    default:
      return onErr(resolved);
  }
}
