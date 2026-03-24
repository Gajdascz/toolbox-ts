import type { StringRecord } from '@toolbox-ts/types/defs/object';
import type { AnyDefined, DefinedPrimitive } from '@toolbox-ts/types';
import type { Arr } from '@toolbox-ts/types/defs/array';
import type { CloneStrategy as CloneStrat } from '../clone/clone.js';
export type CombineHandlerOptions = {
  primitive?: PrimitiveHandler;
  object?: ObjectHandler;
  objectType?: ObjectTypeHandler;
} & (
  | { array?: Exclude<ArrayHandler, 'recurse' | 'keyed'> }
  | {
      array?: 'recurse';
      recursiveArrayOptions?: {
        maxDepth?: number;
        behaviorAtMaxDepth?: Exclude<ArrayHandler, 'recurse'>;
      };
    }
);
export interface CombineOptions {
  clone?: CloneStrategy;
  handlers?: CombineHandlerOptions;
}
export type PrimitiveHandler = ((curr: AnyDefined, next: DefinedPrimitive) => unknown) | 'replace';
export type ObjectHandler = ((curr: StringRecord, next: StringRecord) => unknown) | 'replace';
export type ObjectTypeHandler = ((curr: AnyDefined, next: object) => unknown) | 'replace';
export type ArrayHandler =
  | ((curr: Arr, next: Arr) => unknown)
  | 'replace'
  | 'recurse'
  | 'concat'
  | 'unique'
  | 'prepend';

export type CloneStrategy = CloneStrat | ((v: Arr) => Arr) | 'none';
