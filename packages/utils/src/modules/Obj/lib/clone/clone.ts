import type { Fn } from '@toolbox-ts/types';
import type { Constructor } from '@toolbox-ts/types/defs/function';
import type { StringRecord } from '@toolbox-ts/types/defs/object';

import { isTypedArray } from 'node:util/types';

import {
  isObject,
  isObjectWithEntry
} from '../../../../core/guards/objs/base/index.js';
import { allEntries, createWithPrototypeOf, descriptor } from '../base/base.js';

//#region Types
export interface CloneOptions {
  maxDepth?: number;
  preservePlainObjectStructure?: boolean;
  strategy?: CloneStrategy;
  structuredSerializeOptions?: StructuredSerializeOptions;
}

export type CloneStrategy = 'deep' | 'shallow' | 'structured';

interface CloneContext {
  currentDepth: number;
  maxDepth: number;
  preservePlainObjectStructure?: boolean;
  seen: WeakMap<object, unknown>;
}
//#endregion

//#region Utilities
/**
 * Creates a shallow clone of an object while preserving its prototype and property descriptors.
 *
 * @example
 * ```ts
 * const obj = Object.create(null, { a: { value: 1, writable: false } });
 * const cloned = cloneObjectStructure(obj);
 * Object.getPrototypeOf(cloned) === null; // true
 * Object.getOwnPropertyDescriptor(cloned, 'a')?.writable; // false
 * ```
 */
export const cloneObjectStructure = <T extends object>(value: T): T =>
  Object.create(
    Object.getPrototypeOf(value) as null | object,
    Object.getOwnPropertyDescriptors(value)
  ) as T;
const withSetSeen = <T extends object, R>(
  value: T,
  cl: (v: T) => T,
  ctx: CloneContext
): R => {
  const cloned = cl(value);
  ctx.seen.set(value, cloned);
  return cloned as unknown as R;
};
const hasCloneMethod = <T>(value: unknown): value is { clone: () => T } & T =>
  isObjectWithEntry(
    value,
    'clone',
    (f: unknown): f is () => T => typeof f === 'function'
  );
//#endregion

//#region Copy Functions (no recursion)
export const copy = {
  date: (value: Date) => new Date(value),
  regex: (value: RegExp) => new RegExp(value.source, value.flags),
  arrayBuffer: (value: ArrayBuffer) => value.slice(0).transfer(),
  dataView: (value: ArrayBufferView) => new DataView(value.buffer.slice(0)),
  typedArray: (value: NodeJS.TypedArray): NodeJS.TypedArray =>
    new (
      value as unknown as { constructor: Constructor<NodeJS.TypedArray> }
    ).constructor(value.buffer.slice(0)),
  set: (value: Set<unknown>) => new Set(value),
  map: (value: Map<unknown, unknown>) => new Map(value),
  url: (value: URL) => new URL(value.toString()),
  array: (value: unknown[]) => [...value],
  error: (value: Error) => {
    const err = new (value.constructor as ErrorConstructor)(value.message);
    err.stack = value.stack;
    err.name = value.name;
    err.cause = value.cause;
    return err;
  },
  plainObject: (
    value: Record<string, unknown>,
    { preservePlainObjectStructure }: CloneContext
  ) =>
    preservePlainObjectStructure ? cloneObjectStructure(value) : { ...value }
} as const;
//#endregion

//#region Internal

const deep = {
  array: (value: unknown[], ctx: CloneContext) => {
    const array: unknown[] = [];
    ctx.seen.set(value, array);
    for (const [i, element] of value.entries()) {
      array[i] = _cloneDeep(element, ctx);
    }
    return array;
  },
  map: (
    value: Map<unknown, unknown>,
    ctx: CloneContext
  ): Map<unknown, unknown> => {
    const map = new Map();
    ctx.seen.set(value, map);
    for (const [k, v] of value) {
      map.set(_cloneDeep(k, ctx), _cloneDeep(v, ctx));
    }
    return map;
  },
  set: (value: Set<unknown>, ctx: CloneContext): Set<unknown> => {
    const set = new Set();
    ctx.seen.set(value, set);
    for (const item of value) set.add(_cloneDeep(item, ctx));
    return set;
  },
  plainObject: (
    value: Record<string | symbol, unknown>,
    ctx: CloneContext
  ): Record<string | symbol, unknown> => {
    // Create empty object with same prototype
    const obj = createWithPrototypeOf<StringRecord>(value);
    ctx.seen.set(value, obj);

    for (const [k, v] of [...allEntries(value)]) {
      const desc = descriptor(value, k);
      if (desc && 'value' in desc) {
        // Data property: preserve descriptor, deep clone value
        Object.defineProperty(obj, k, { ...desc, value: _cloneDeep(v, ctx) });
      } else if (desc) {
        // Accessor property: preserve as-is
        Object.defineProperty(obj, k, desc);
      }
    }

    return obj;
  },
  date: (value: Date, ctx: CloneContext) => withSetSeen(value, copy.date, ctx),
  regex: (value: RegExp, ctx: CloneContext) =>
    withSetSeen(value, copy.regex, ctx),
  arrayBuffer: (value: ArrayBuffer, ctx: CloneContext) =>
    withSetSeen(value, copy.arrayBuffer, ctx),
  dataView: (value: ArrayBufferView, ctx: CloneContext) =>
    withSetSeen(value, copy.dataView, ctx),
  error: (value: Error, ctx: CloneContext) =>
    withSetSeen(value, copy.error, ctx),
  url: (value: URL, ctx: CloneContext) => withSetSeen(value, copy.url, ctx),
  typedArray: (value: NodeJS.TypedArray, ctx: CloneContext) =>
    withSetSeen(value, copy.typedArray, ctx)
} as const;

//#endregion

const strategies = {
  [Array.name]: { deep: deep.array, shallow: copy.array },
  [Map.name]: { deep: deep.map, shallow: copy.map },
  [Set.name]: { deep: deep.set, shallow: copy.set },
  [Date.name]: { deep: deep.date, shallow: copy.date },
  [RegExp.name]: { deep: deep.regex, shallow: copy.regex },
  [DataView.name]: { deep: deep.dataView, shallow: copy.dataView },
  [ArrayBuffer.name]: { deep: deep.arrayBuffer, shallow: copy.arrayBuffer },
  [Object.name]: { deep: deep.plainObject, shallow: copy.plainObject },
  [Error.name]: { deep: deep.error, shallow: copy.error },
  [URL.name]: { deep: deep.url, shallow: copy.url },
  TypedArray: { deep: deep.typedArray, shallow: copy.typedArray }
} as const;

const resolveCloneOperation = <T>(
  type: 'deep' | 'shallow',
  value: T,
  ctx: Omit<CloneContext & CloneOptions, 'strategy'>
): T => {
  const constructorName = (value as unknown)?.constructor?.name;
  let strategy: Fn.Any | undefined;

  if (!constructorName || !(constructorName in strategies)) {
    if (hasCloneMethod<T>(value)) return value.clone();
    // Handle objects without standard constructor names
    if (Object.getPrototypeOf(value) === null)
      strategy = strategies.Object[type];
    else if (isTypedArray(value)) strategy = strategies.TypedArray[type];

    // No handler for this type, return as-is
    if (!strategy) return value;
  } else {
    strategy = strategies[constructorName][type];
  }

  return strategy(value, ctx) as T;
};

const _cloneDeep = <T>(value: T, ctx: CloneContext): T => {
  if (!isObject(value)) return value;
  if (ctx.seen.has(value)) return ctx.seen.get(value) as T;

  // Check depth limit before processing nested structures
  if (ctx.currentDepth > ctx.maxDepth) return value;

  // Increment depth for all nested structures
  const nextCtx = { ...ctx, currentDepth: ctx.currentDepth + 1 };
  return resolveCloneOperation('deep', value, nextCtx);
};
//#endregion

//#region Exported Functions
/**
 * Deeply clones a value with circular reference handling.
 *
 * Supported types: primitives, arrays, objects, Map, Set, Date, RegExp,
 * ArrayBuffer, TypedArrays, DataView, URL, Error.
 *
 *
 * @example
 * ```ts
 * const obj = { a: { b: { c: 1 } } };
 * const cloned = cloneDeep(obj);
 * cloned.a.b !== obj.a.b; // true
 *
 * // With depth limit
 * const shallow = cloneDeep(obj, { depth: 1 });
 * shallow.a.b === obj.a.b; // true (not cloned beyond depth 1)
 * ```
 */
export const cloneDeep = <T>(
  value: T,
  { maxDepth = Infinity }: { maxDepth?: number } = {}
): T => _cloneDeep(value, { seen: new WeakMap(), maxDepth, currentDepth: 0 });

/**
 * Shallowly clones a value (top-level only).
 *
 * - Arrays: `[...arr]`
 * - Plain objects: Preserves prototype and property descriptors
 * - Built-in types: Date, RegExp, Map, Set, ArrayBuffer
 *
 * @throws TypeError If value cannot be shallow cloned
 *
 * @example
 * ```ts
 * const arr = [{ a: 1 }];
 * const cloned = cloneShallow(arr);
 * cloned !== arr;       // true
 * cloned[0] === arr[0]; // true (same reference)
 * ```
 */
export const cloneShallow = <T>(
  value: T,
  {
    preservePlainObjectStructure = false
  }: { preservePlainObjectStructure?: boolean } = {}
): T =>
  isObject(value) ?
    resolveCloneOperation('shallow', value, {
      seen: new WeakMap(),
      maxDepth: 1,
      currentDepth: 0,
      preservePlainObjectStructure
    })
  : value;

/**
 * Clones a value using the specified strategy.
 *
 * Strategies:
 * - `deep` (default): Deep clone with circular reference handling
 * - `shallow`: Top-level only clone
 * - `structured`: Native `structuredClone`
 *
 * @example
 * ```ts
 * // Deep clone (default)
 * clone({ a: { b: 1 } });
 *
 * // Shallow clone
 * clone({ a: { b: 1 } }, { strategy: 'shallow' });
 *
 * // Structured clone
 * clone(new Map([[1, 2]]), { strategy: 'structured' });
 * ```
 */
export const clone = <T>(value: T, opts: CloneOptions = {}): T => {
  switch (opts.strategy) {
    case undefined:
    case 'deep':
      return cloneDeep(value, opts as Parameters<typeof cloneDeep>[1]);
    case 'shallow':
      return cloneShallow(value);
    case 'structured':
      return structuredClone(value, opts.structuredSerializeOptions);
    default:
      throw new Error(
        `Unsupported clone strategy: ${(opts as Record<string, unknown>).strategy as string}`
      );
  }
};
//#endregion
