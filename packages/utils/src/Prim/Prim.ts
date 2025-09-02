/**
 * @module Prim
 *
 * Utility functions for safe, type-aware primitive operations:
 * type guards, type introspection, and value checks.
 */
export const Types = {
  bigint: 'bigint',
  boolean: 'boolean',
  function: 'function',
  null: 'null',
  number: 'number',
  string: 'string',
  symbol: 'symbol',
  undefined: 'undefined'
} as const;
export type Type = keyof typeof Types;
export interface TypeMap {
  bigint: bigint;
  boolean: boolean;
  function: (...args: unknown[]) => unknown;
  null: null;
  number: number;
  string: string;
  symbol: symbol;
  undefined: undefined;
}

export type Value =
  | ((...args: unknown[]) => unknown)
  | bigint
  | boolean
  | null
  | number
  | string
  | symbol
  | undefined;
export const isTypeOf = {
  bigint: <V = bigint>(v: unknown): v is V => typeof v === Types.bigint,
  boolean: <V = boolean>(v: unknown): v is V => typeof v === Types.boolean,
  function: <V = (...args: unknown[]) => unknown>(v: unknown): v is V =>
    typeof v === Types.function,
  null: <V = null>(v: unknown): v is V => v === null,
  number: <V = number>(v: unknown): v is V => typeof v === Types.number,
  string: <V = string>(v: unknown): v is V => typeof v === Types.string,
  symbol: <V = symbol>(v: unknown): v is V => typeof v === Types.symbol,
  type: (
    p: unknown,
    { allowNull = false, allowUndefined = false } = {}
  ): p is Type =>
    typeof p === 'string'
    && p in Types
    && (allowUndefined || p !== Types.undefined)
    && (allowNull || p !== Types.null),
  undefined: <V = undefined>(v: unknown): v is V => typeof v === Types.undefined
} as const;
