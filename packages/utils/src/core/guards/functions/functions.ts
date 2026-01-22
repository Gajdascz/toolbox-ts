import type { Fn } from '@toolbox-ts/types/function';

import { isAsyncFunction, isGeneratorFunction } from 'node:util/types';

import { createTypeError } from '../../utils/errors/index.js';
import { createIsGuards } from '../factories.js';

const TYPES = {
  FUNCTION: 'Function',
  ASYNC: 'FunctionAsync',
  SYNC: 'FunctionSync',
  GENERATOR: 'FunctionSyncGenerator',
  ASYNC_GENERATOR: 'FunctionAsyncGenerator'
};
//#region> Any
export const { checkIsFunction, isFunction } = createIsGuards(
  TYPES.FUNCTION,
  (v): v is Fn.Any => typeof v === 'function'
);
export function assertIsFunction(v: unknown): asserts v is Fn.Any {
  if (!isFunction(v)) throw createTypeError(isFunction.typeName, v);
}
//#endregion
//#region> Async
export const { checkIsFunctionAsync, isFunctionAsync } = createIsGuards(
  TYPES.ASYNC,
  (v): v is Fn.Async => isAsyncFunction(v)
);
export function assertIsFunctionAsync(v: unknown): asserts v is Fn.Async {
  if (!isFunctionAsync(v)) throw createTypeError(isFunctionAsync.typeName, v);
}
//#endregion
//#region> Sync
export const { isFunctionSync, checkIsFunctionSync } = createIsGuards(
  TYPES.SYNC,
  (v): v is Fn.Sync => typeof v === 'function' && !isAsyncFunction(v)
);
export function assertIsFunctionSync(v: unknown): asserts v is Fn.Sync {
  if (!isFunctionSync(v)) throw createTypeError(isFunctionSync.typeName, v);
}
//#endregion
//#region> Generator
export const { isFunctionSyncGenerator, checkIsFunctionSyncGenerator } =
  createIsGuards(
    TYPES.GENERATOR,
    (v): v is GeneratorFunction => isGeneratorFunction(v) && !isAsyncFunction(v)
  );
export function assertIsFunctionSyncGenerator(
  v: unknown
): asserts v is GeneratorFunction {
  if (!isFunctionSyncGenerator(v))
    throw createTypeError(isFunctionSyncGenerator.typeName, v);
}
//#endregion
//#region> Async Generator
export const { isFunctionAsyncGenerator, checkIsFunctionAsyncGenerator } =
  createIsGuards(
    TYPES.ASYNC_GENERATOR,
    (v): v is AsyncGeneratorFunction =>
      isGeneratorFunction(v) && isAsyncFunction(v)
  );
export function assertIsFunctionAsyncGenerator(
  v: unknown
): asserts v is AsyncGeneratorFunction {
  if (!isFunctionAsyncGenerator(v))
    throw createTypeError(isFunctionAsyncGenerator.typeName, v);
}
//#endregion
