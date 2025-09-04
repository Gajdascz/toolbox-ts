import type {
  AlphabetLowercase,
  AlphabetUppercase
} from '@oclif/core/interfaces';

import { Str } from '@toolbox-ts/utils';

import type { FlagToken } from '../../types.js';

export const kebabToFlagEntry = <T extends string>(
  key: T
): Readonly<[Str.KebabToCamel<T>, FlagToken<T>]> =>
  [Str.kebabToCamel(key), Str.prefix('--', key)] as const;

export const toFlag = <T extends string>(
  key: T
): FlagToken<Str.CamelToKebab<T>> => Str.prefix('--', Str.camelToKebab(key));

export interface FlagMetaOpts {
  acceptsCommaSeparated?: boolean;
  char?: AlphabetLowercase | AlphabetUppercase;
  helpGroup?: string;
  otherAliases?: string[];
}
export const flagMeta = (
  name: string,
  description: string,
  {
    acceptsCommaSeparated = false,
    otherAliases = [],
    char,
    helpGroup
  }: FlagMetaOpts = {}
) => {
  const toKebab = Str.camelToKebab(name);
  const aliases = [...otherAliases];
  if (toKebab !== name) aliases.push(toKebab);
  let desc = Str.capitalize(description.trim());
  const lastChar = desc.slice(-1);
  if (!/[.!?]/.test(lastChar)) desc += '.';
  return {
    name,
    description: `${desc}${acceptsCommaSeparated ? ` Provide a comma-separated list for multiple values` : ''}`,
    aliases,
    char,
    helpLabel: `--${toKebab}`,
    helpGroup
  };
};
