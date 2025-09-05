import type {
  AlphabetLowercase,
  AlphabetUppercase
} from '@oclif/core/interfaces';

import { Str } from '@toolbox-ts/utils';

import type { FlagToken } from '../../types.js';

/**
 * Converts a kebab-case string to a tuple containing its camelCase equivalent
 * and its corresponding command-line flag format (prefixed with '--').
 * @example
 * ```ts
 * kebabToFlagEntry('some-flag') // ['someFlag', '--some-flag']
 * kebabToFlagEntry('another-example-flag') // ['anotherExampleFlag', '--another-example-flag']
 * ```
 */
export const kebabToFlagEntry = <T extends string>(
  key: T
): Readonly<[Str.KebabToCamel<T>, FlagToken<T>]> =>
  [Str.kebabToCamel(key), Str.prefix('--', key)] as const;

/**
 * Converts a camelCase string to its corresponding command-line flag format
 * (kebab-case prefixed with '--').
 * @example
 * ```ts
 * toFlag('someFlag') // '--some-flag'
 * toFlag('anotherExampleFlag') // '--another-example-flag'
 * ```
 */
export const toFlag = <T extends string>(
  key: T
): FlagToken<Str.CamelToKebab<T>> => Str.prefix('--', Str.camelToKebab(key));

export interface FlagMetaOpts {
  acceptsCommaSeparated?: boolean;
  char?: AlphabetLowercase | AlphabetUppercase;
  helpGroup?: string;
  otherAliases?: string[];
}
/**
 * Generates metadata for a command-line flag, including its name, description,
 * aliases, and help label.
 *
 * @important `name` should be provided in traditional camelCase format.
 *
 * - Automatically derives kebab-case aliases from the provided name.
 * - The description is automatically capitalized and ensured to end with a period
 *   (or provided punctuation).
 * - If `acceptsCommaSeparated` is true, the description notes that multiple values
 *   can be provided as a comma-separated list.
 * - The `helpLabel` is generated in kebab-case format prefixed with '--' which is
 *   displayed in the Oclif help output.
 *
 * @example
 * ```ts
 * flagMeta('someFlag', 'this is a sample flag', { acceptsCommaSeparated: true });
 * const someFlag = Flags.type({
 *    name: 'someFlag',
 *    description: 'This is a sample flag. Provide a comma-separated list for multiple values.',
 *    aliases: ['some-flag'],
 *    helpLabel: '--some-flag'
 * });
 * ```
 */
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
