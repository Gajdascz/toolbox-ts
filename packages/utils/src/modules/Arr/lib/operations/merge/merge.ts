import type { Arr, Merged } from '@toolbox-ts/types/defs/array';
import { clone } from '../clone/clone.js';
import { isObject, isPrimitive } from '../../../../../core/index.js';
import type { AnyDefined, DefinedPrimitive, PrimitiveType } from '@toolbox-ts/types';
import type { StringRecord } from '@toolbox-ts/types/defs/object';
import type { ArrayHandler, CombineOptions } from './types.js';
import { dedupe } from '../dedupe/dedupe.js';

export const mergeConcat = <A extends Arr, B extends Arr[] | Arr = A>(a: A, b: B): Merged<A, B> =>
  a.concat(b.flat()) as Merged<A, B>;

export const mergePrepend = <A extends Arr, B extends Arr[] | Arr = A>(a: A, b: B): Merged<A, B> =>
  b.flat().concat(a) as Merged<A, B>;

export interface MergeUniqueOpts<A extends Arr, B extends Arr[] | Arr, K = unknown> {
  keyFn?: (item: Merged<A, B>[number]) => K;
  end?: 'concat' | 'prepend';
}
export const mergeUnique = <A extends Arr, B extends Arr[] | Arr = A, K = unknown>(
  a: A,
  b: B,
  { end = 'concat', keyFn }: MergeUniqueOpts<A, B, K> = {}
): Merged<A, B> => dedupe(end === 'concat' ? mergeConcat(a, b) : mergePrepend(a, b), keyFn);

export interface CombineHandlers {
  primitive: (curr: AnyDefined, next: DefinedPrimitive) => unknown;
  array: (curr: Arr, next: Arr) => unknown;
  object: (curr: StringRecord, next: StringRecord) => unknown;
  objectType: (curr: AnyDefined, next: object) => unknown;
}
const internalCombine = <A extends Arr, B extends Arr, R = (A[number] | B[number])[]>(
  a: A,
  b: B,
  handlers: CombineHandlers,
  cl: (v: Arr) => Arr,
  maxDepth: number,
  currentDepth: number,
  atMaxDepthBehavior: (curr: Arr, next: Arr) => unknown
): R => {
  const [left, right] = [cl(a), cl(b)];

  const max = Math.max(left.length, right.length);
  const result: unknown[] = [];

  for (let i = 0; i < max; i++) {
    const curr = left[i];
    const next = right[i];
    if (next === undefined) {
      result[i] = curr;
      continue;
    }
    if (curr === undefined) {
      result[i] = next;
      continue;
    }
    if (Array.isArray(curr) && Array.isArray(next)) {
      if (currentDepth >= maxDepth) result[i] = atMaxDepthBehavior(curr, next);
      else result[i] = handlers.array(curr, next);
      continue;
    }
    if (isPrimitive(next)) {
      result[i] = handlers.primitive(curr, next);
      continue;
    }
    if (!isObject(next)) {
      result[i] = handlers.objectType(curr, next);
      continue;
    }
    result[i] = handlers.object(isObject(curr) ? curr : {}, next);
  }

  return result as R;
};

const resolveBasicHandler = (handler: Exclude<ArrayHandler, 'recurse'>) => {
  if (typeof handler === 'function') return handler;
  switch (handler) {
    case 'replace':
      return (_: Arr, next: Arr) => next;
    case 'concat':
      return (curr: Arr, next: Arr) => curr.concat(next);
    case 'unique':
      return (curr: Arr, next: Arr) => [...new Set(curr.concat(next))];
    case 'prepend':
      return (curr: Arr, next: Arr) => next.concat(curr);
  }
};
export const mergeCombine = <A extends Arr, B extends Arr = A, R = (A[number] | B[number])[]>(
  a: A,
  b: B,
  { handlers: handle = {}, clone: cl = 'shallow' }: CombineOptions = {}
): R => {
  const cloneHandler =
    typeof cl === 'function' ? cl : cl === 'none' ? (v: Arr) => v : (v: Arr) => clone(v, cl);
  const primitiveHandler =
    handle.primitive === 'replace' || !handle.primitive
      ? (_: unknown, next: PrimitiveType) => next
      : handle.primitive;
  const objectHandler =
    handle.object === 'replace' || !handle.object
      ? (_: StringRecord, next: StringRecord) => next
      : handle.object;
  const objectTypeHandler =
    handle.objectType === 'replace' || !handle.objectType
      ? (_: unknown, next: object) => next
      : handle.objectType;
  let arrayHandler: (curr: Arr, next: Arr) => unknown;
  let maxDepth = Infinity;
  let behaviorAtMaxDepthHandler: (curr: Arr, next: Arr) => unknown = (_: Arr, next: Arr) => next;
  if (handle.array === 'recurse') {
    const opts = handle.recursiveArrayOptions ?? {};
    if (opts.maxDepth !== undefined) maxDepth = opts.maxDepth;
    if (opts.behaviorAtMaxDepth)
      behaviorAtMaxDepthHandler = resolveBasicHandler(opts.behaviorAtMaxDepth);

    arrayHandler = (curr: Arr, next: Arr) =>
      internalCombine(
        curr,
        next,
        {
          primitive: primitiveHandler,
          array: arrayHandler,
          object: objectHandler,
          objectType: objectTypeHandler
        },
        cloneHandler,
        maxDepth,
        0,
        behaviorAtMaxDepthHandler
      );
  } else arrayHandler = resolveBasicHandler(handle.array ?? 'replace');
  return internalCombine<A, B, R>(
    a,
    b,
    {
      primitive: primitiveHandler,
      array: arrayHandler,
      object: objectHandler,
      objectType: objectTypeHandler
    },
    cloneHandler,
    maxDepth,
    0,
    behaviorAtMaxDepthHandler
  );
};
