import { section, BLOCK_SPACE, EMOJIS } from '../../core/index.js';
import {
  type LinkOptions,
  type HeadingOptions,
  heading,
  link,
  headingElement,
  details,
  clampHeadingSize,
  unorderedList
} from '../../blocks/index.js';

export interface ToolingOptions {
  sections?: Record<string, LinkOptions[]> | LinkOptions[];
  heading?: Partial<HeadingOptions>;
  separator?: boolean;
}

export const tooling = ({ sections = {}, heading: _heading, separator }: ToolingOptions = {}) => {
  const { content = `${EMOJIS.TOOLING} Tooling`, size = 2 } = _heading ?? {};
  return section({
    heading: heading({ content, size }),
    body: Array.isArray(sections)
      ? unorderedList(sections.map(link))
      : Object.entries(sections)
          .map(([sectionHeading, tools]) =>
            details({
              summary: {
                text: headingElement({
                  content: sectionHeading.charAt(0).toUpperCase() + sectionHeading.slice(1),
                  size: clampHeadingSize(size + 1)
                })
              },
              content: unorderedList(tools.map(link))
            })
          )
          .join(BLOCK_SPACE),
    separator
  });
};
