import type { Nullish } from '@toolbox-ts/types';
import { BLOCK_SPACE, HORIZONTAL_SEPARATOR } from '../constants.js';

export const end = (text: string, separator = false): string => {
  if (text.length === 0) return '';
  return separator ? `${text}${BLOCK_SPACE}${HORIZONTAL_SEPARATOR}` : text;
};

export interface SectionParts {
  body: string;
  separator?: boolean;
  heading?: string;
}
export const section = ({ body, heading, separator }: SectionParts): string =>
  end(combine(heading, body), separator);

/**
 * Combines multiple strings into a single string, separated by newlines.
 * Filters out nullish values, false, and empty strings.
 * - Useful for formatting pieces of parts.
 *
 * @example
 * ```ts
 * const header = {
 *   body: combine(
 *    hero && makeMDOrHTML('image', hero.type, hero.opts),
 *    b?.map(badge).join(' '),
 *    text(description)
 *  )
 * }
 * // body: `[![image](hero.type)](hero.opts)
 * //
 * // ![badge](b[0]) ![badge](b[1])
 * //
 * // description text.
 * //
 * // ---`
 * ```
 */
export const combine = (...strings: (string | Nullish | false)[]): string =>
  strings
    .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
    .join(BLOCK_SPACE);

export const compose = (...sections: (SectionParts | string | Nullish | false)[]) => {
  const result: SectionParts[] = [];
  for (const sec of sections) {
    if (!sec) continue;
    else if (typeof sec === 'string') {
      if (sec.trim().length === 0) continue;
      else result.push({ body: sec });
    } else if (sec.body.trim().length > 0) result.push(sec);
  }
  return result.map(section).join(BLOCK_SPACE);
};
