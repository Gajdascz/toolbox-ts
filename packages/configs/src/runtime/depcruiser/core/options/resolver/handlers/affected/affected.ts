import { type IFormatOptions, list } from 'watskeburt';

import { SRC_FILE_EXTS } from '../../../../../../../core/index.js';
export type HandleAffectedOptions =
  | Partial<
      { extensions: string | string[]; oldRevision?: string | true } & Omit<
        IFormatOptions,
        'extensions' | 'oldRevision'
      >
    >
  | string
  | true
  | undefined;

export const AFFECTED_DEFAULTS: IFormatOptions = {
  extensions: SRC_FILE_EXTS.join(','),
  outputType: 'regex',
  oldRevision: 'main'
} as const;

const resolveAffected = (affected?: HandleAffectedOptions): IFormatOptions => {
  if (!affected || affected === true) return AFFECTED_DEFAULTS;
  if (typeof affected === 'string')
    return { ...AFFECTED_DEFAULTS, oldRevision: affected };
  const { extensions: defaultExtensions = '', ...restDefaults } =
    AFFECTED_DEFAULTS;
  const { extensions, oldRevision, ...rest } = affected;
  return {
    ...restDefaults,
    ...rest,
    oldRevision: !oldRevision || oldRevision === true ? 'main' : oldRevision,
    extensions:
      defaultExtensions
      + (!extensions || extensions === '' ? ''
      : typeof extensions === 'string' ? ',' + extensions
      : extensions.join(','))
  };
};

/**
 * @see {@link https://github.com/sverweij/dependency-cruiser/blob/8a52b07a2e868fc72c6019b7b2a08df5df34d576/src/cli/normalize-cli-options.mjs#L226}
 */
export const handleAffected = async (affected?: HandleAffectedOptions) => {
  const result = await list(resolveAffected(affected));
  return result && result.length > 0 ? result : undefined;
};
