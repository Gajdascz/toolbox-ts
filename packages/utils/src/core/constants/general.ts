import type { PrimitiveType, PrimitiveTypeMap } from '@toolbox-ts/types';

export const ALPHABETIC = 'alphabetic' as const;
export const ALPHANUMERIC = 'alphanumeric' as const;

export const PRIMITIVES: { readonly [K in keyof PrimitiveTypeMap]: K } = {
  bigint: 'bigint',
  boolean: 'boolean',
  null: 'null',
  number: 'number',
  string: 'string',
  symbol: 'symbol',
  undefined: 'undefined'
} as const;
export const PRIMITIVES_ARR = Object.values(
  PRIMITIVES
) as readonly PrimitiveType[];
