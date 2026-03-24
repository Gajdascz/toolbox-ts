//#region> Types
export type OnError = 'log' | 'return';
export interface ResolvedError {
  cause?: unknown;
  message: string;
  stack?: string;
  type: string;
}
export type Result<T, E = ResolvedError> = { error: E; ok: false } | { ok: true; value: T };
//#endregion

const inWithStr = (o: object | Function, p: string): o is { [p]: string } =>
  p in o && typeof (o as Record<string, unknown>)[p] === 'string';

export const RESOLVED_TYPE_NAMES = {
  null: 'Null',
  undefined: 'Undefined',
  string: 'String',
  number: 'Number',
  boolean: 'Boolean',
  symbol: 'Symbol',
  bigint: 'BigInt',
  object: 'Object',
  function: 'Function'
} as const;
export const resolveTypeName = (val: unknown) => {
  if (val === null) return RESOLVED_TYPE_NAMES.null;
  const baseType = RESOLVED_TYPE_NAMES[typeof val];
  if (typeof val === 'function' || typeof val === 'object') {
    if (inWithStr(val, 'typeName')) return val.typeName;
    if (typeof val === 'function')
      return `${RESOLVED_TYPE_NAMES.function}(${(val as { name?: string }).name || 'anonymous'})`;
    else if ('constructor' in val && inWithStr(val.constructor, 'name'))
      return val.constructor.name;
    return RESOLVED_TYPE_NAMES.object;
  }
  return baseType;
};

export const resolveError = (err: unknown): ResolvedError => {
  if (err instanceof Error)
    return { message: err.message, type: err.name, stack: err.stack, cause: err.cause };
  if (typeof err === 'string') return { message: err, type: 'string' };
  if (typeof err === 'object' && err !== null) {
    return {
      message: inWithStr(err, 'message')
        ? err.message
        : `An unknown error has occurred. Received message: ${JSON.stringify(err)}`,
      cause: 'cause' in err ? err.cause : undefined,
      stack: inWithStr(err, 'stack') ? err.stack : undefined,
      type: resolveTypeName(err)
    };
  }
  return { message: String(err), type: resolveTypeName(err), stack: undefined, cause: undefined };
};

export const normalizeError = (err: unknown): Error => {
  if (err instanceof Error) return err;
  const resolved = resolveError(err);
  const normalized = new Error(resolved.message, { cause: resolved.cause });
  if (resolved.stack) normalized.stack = resolved.stack;
  else delete normalized.stack;
  return normalized;
};
