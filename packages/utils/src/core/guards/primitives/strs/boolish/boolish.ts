import type { Falsy, Truthy } from '@toolbox-ts/types/defs/string';

import { BOOLISH } from '../../../../constants/strings/index.js';
import { createTypeError } from '../../../../utils/errors/index.js';
import { isString } from '../../../base/index.js';
import { createIsGuards } from '../../../factories.js';
const { FALSY, TRUTHY } = BOOLISH;

//#region> Truthy
const TRUTHY_SET = new Set<string>(Object.values(TRUTHY));
const TRUTHY_STRS = [...TRUTHY_SET.values()];

const _truthy = createIsGuards(
  `StringTruthy`,
  (v): v is Truthy => isString(v) && TRUTHY_SET.has(v)
);
export const isStringTruthy = _truthy.is;
export const checkIsStringTruthy = _truthy.check;
export function assertIsStringTruthy(v: unknown): asserts v is Truthy {
  if (!isStringTruthy(v)) throw createTypeError(TRUTHY_STRS, v);
}
//#endregion

//#region> Falsy
const FALSY_SET = new Set<string>(Object.values(FALSY));
const FALSY_STRS = [...FALSY_SET.values()];

const _falsy = createIsGuards('StringFalsy', (v): v is Falsy => isString(v) && FALSY_SET.has(v));
export const isStringFalsy = _falsy.is;
export const checkIsStringFalsy = _falsy.check;
export function assertIsStringFalsy(v: unknown): asserts v is Falsy {
  if (!isStringFalsy(v)) throw createTypeError(FALSY_STRS, v);
}
//#endregion
