import { EMOJIS, section } from '../../core/index.js';
import {
  type LinkOptions,
  type HeadingOptions,
  heading,
  link,
  unorderedList
} from '../../blocks/index.js';

export interface ResourcesOptions {
  heading?: Partial<HeadingOptions>;
  links: LinkOptions[];
  separator?: boolean;
}

export const resources = ({ links, heading: _heading, separator }: ResourcesOptions) =>
  section({
    heading: heading({ content: `${EMOJIS.RESOURCES} Resources`, size: 2, ..._heading }),
    body: unorderedList(links.map(link)),
    separator
  });
