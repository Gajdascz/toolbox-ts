import { section, combine, BLOCK_SPACE, EMOJIS } from '../../core/index.js';
import { type HeadingOptions, clampHeadingSize, heading, table } from '../../blocks/index.js';
import type { Text } from '../../core/index.js';

export interface ApiEntry {
  export: Text;
  type: Text;
  description: Text;
}

export interface ApiGroup {
  heading: string;
  entries: ApiEntry[];
}

export interface ApiOptions {
  groups: ApiGroup | ApiGroup[];
  separator?: boolean;
  heading?: Partial<HeadingOptions>;
}

const HEADERS = ['Export', 'Type', 'Description'] as const;

const renderGroup = ({ heading: groupHeading, entries }: ApiGroup, parentSize: number) =>
  combine(
    heading({ content: groupHeading, size: clampHeadingSize(parentSize + 1) }),
    table(
      HEADERS,
      ...entries.map(
        ({ export: exp, type, description }) => [exp, type, description] as [Text, Text, Text]
      )
    )
  );

export const api = ({ groups, separator, heading: _heading = {} }: ApiOptions) => {
  const { content = `${EMOJIS.API} API`, size = 2 } = _heading;
  const items = Array.isArray(groups) ? groups : [groups];
  const body =
    items.length === 1
      ? table(
          HEADERS,
          ...items[0].entries.map(
            ({ export: exp, type, description }) => [exp, type, description] as [Text, Text, Text]
          )
        )
      : items.map((g) => renderGroup(g, size)).join(BLOCK_SPACE);

  return section({ heading: heading({ content, size }), body, separator });
};
