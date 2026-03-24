import type { Fn } from '@toolbox-ts/types/function';

import { isAsyncFunction, isGeneratorFunction } from 'node:util/types';

import { createTypeError } from '../../utils/errors/index.js';
import { createGenericIsGuards, createIsGuards, createTypeNames } from '../factories.js';
const { ErrorConstructor, Async, AsyncGenerator, SyncGenerator, Sync, _ } = createTypeNames(
  'Function',
  ['Async', 'Sync', 'SyncGenerator', 'AsyncGenerator', 'ErrorConstructor']
);
//#region> Any
const _any = createGenericIsGuards(
  _,
  <T extends Fn.Any = Fn.Any>(v: unknown): v is T => typeof v === 'function'
);
//
export const isFunction = _any.is;
export const checkIsFunction = _any.check;
export function assertIsFunction(v: unknown): asserts v is Fn.Any {
  if (!isFunction(v)) throw createTypeError(isFunction.typeName, v);
}
//#endregion
//#region> Async
const _async = createIsGuards(Async, (v): v is Fn.Async => isAsyncFunction(v));
//
export const isFunctionAsync = _async.is;
export const checkIsFunctionAsync = _async.check;
export function assertIsFunctionAsync(v: unknown): asserts v is Fn.Async {
  if (!isFunctionAsync(v)) throw createTypeError(isFunctionAsync.typeName, v);
}
//#endregion
//#region> Sync
const _sync = createIsGuards(
  Sync,
  (v): v is Fn.Sync => typeof v === 'function' && !isAsyncFunction(v)
);
//
export const isFunctionSync = _sync.is;
export const checkIsFunctionSync = _sync.check;
export function assertIsFunctionSync(v: unknown): asserts v is Fn.Sync {
  if (!isFunctionSync(v)) throw createTypeError(isFunctionSync.typeName, v);
}
//#endregion
//#region> Sync Generator
const _syncGenerator = createIsGuards(
  SyncGenerator,
  (v): v is GeneratorFunction => isGeneratorFunction(v) && !isAsyncFunction(v)
);
//
export const isFunctionSyncGenerator = _syncGenerator.is;
export const checkIsFunctionSyncGenerator = _syncGenerator.check;
export function assertIsFunctionSyncGenerator(v: unknown): asserts v is GeneratorFunction {
  if (!isFunctionSyncGenerator(v)) throw createTypeError(isFunctionSyncGenerator.typeName, v);
}
//#endregion
//#region> Async Generator
const _asyncGenerator = createIsGuards(
  AsyncGenerator,
  (v): v is AsyncGeneratorFunction => isGeneratorFunction(v) && isAsyncFunction(v)
);
//
export const isFunctionAsyncGenerator = _asyncGenerator.is;
export const checkIsFunctionAsyncGenerator = _asyncGenerator.check;
export function assertIsFunctionAsyncGenerator(v: unknown): asserts v is AsyncGeneratorFunction {
  if (!isFunctionAsyncGenerator(v)) throw createTypeError(isFunctionAsyncGenerator.typeName, v);
}
//#endregion
//#region> ErrorConstructor
const _errorConstructor = createIsGuards(
  ErrorConstructor,
  (v: unknown): v is ErrorConstructor =>
    typeof v === 'function' && (v === Error || v.prototype instanceof Error)
);
//
export const isFunctionErrorConstructor = _errorConstructor.is;
export const checkIsFunctionErrorConstructor = _errorConstructor.check;
export function assertIsFunctionErrorConstructor(v: unknown): asserts v is ErrorConstructor {
  if (!isFunctionErrorConstructor(v)) throw createTypeError(isFunctionErrorConstructor.typeName, v);
}
//#endregion
