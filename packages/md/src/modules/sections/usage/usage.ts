import { section, combine, EMOJIS } from '../../core/index.js';
import {
  type HeadingOptions,
  heading,
  codeBlock,
  type CodeBlockLanguage
} from '../../blocks/index.js';

export interface UsageExample {
  description?: string;
  code: string;
  language?: CodeBlockLanguage;
  heading?: string;
}

export interface UsageOptions {
  examples: UsageExample | UsageExample[];
  separator?: boolean;
  heading?: Partial<HeadingOptions>;
}

export const usage = ({ examples, separator, heading: _heading = {} }: UsageOptions) => {
  const items = Array.isArray(examples) ? examples : [examples];
  const body = combine(
    ...items.map(({ description, code, language = 'ts', heading: exHeading }) =>
      combine(
        exHeading && heading({ content: exHeading, size: 3 }),
        description,
        codeBlock(code, language)
      )
    )
  );
  return section({
    heading: heading({ content: `${EMOJIS.USAGE} Usage`, size: 2, ..._heading }),
    body,
    separator
  });
};
