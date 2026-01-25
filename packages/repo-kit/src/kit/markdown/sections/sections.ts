import {
  badge,
  type BadgeOptions,
  clampHeaderSize,
  codeBlock,
  details,
  type ImageElementOptions,
  type ImageOptions,
  join,
  link,
  type LinkOptions,
  list,
  makeMDOrHTML,
  type MDOrHTML,
  section,
  text,
  title,
  titleElement,
  type TitleOptions
} from '../base/index.ts';

interface LicenseSectionOptions {
  linkToFile?: string;
  owner?: LinkOptions;
  separator?: boolean;
  title?: Partial<TitleOptions>;
  type: string;
  urls?: LinkOptions[];
  year?: number;
}
export const license = ({
  type,
  year,
  owner,
  urls = [],
  title: _title = {},
  separator = false,
  linkToFile
}: LicenseSectionOptions) =>
  section({
    title: title({ ...{ content: '⚖️ License', size: 2 }, ..._title }),
    body: `${
      linkToFile ? link({ text: type, url: linkToFile }) : type
    } – © ${year ?? new Date().getFullYear()}${
      owner ? ` ${link(owner)}` : ''
    }${urls.length > 0 ? `\n${urls.map(link).join(' | ')}` : ''}`,
    separator: separator
  });

interface InstallationSectionOptions {
  isDev?: boolean;
  packageName: string;
  separator?: boolean;
  title?: Partial<TitleOptions>;
}
export const installation = ({
  packageName,
  isDev = false,
  separator = true,
  title: _title = {}
}: InstallationSectionOptions) =>
  section({
    title: title({ ...{ content: '🚀 Installation', size: 2 }, ..._title }),
    body: codeBlock(
      `npm install ${isDev ? '--save-dev ' : ''}${packageName}
or
yarn add ${isDev ? '--dev ' : ''}${packageName}
or
pnpm add ${isDev ? '--save-dev ' : ''}${packageName}
`,
      'sh'
    ),
    separator
  });

interface ToolingSectionOptions {
  sections?: Record<string, LinkOptions[]>;
  title?: Partial<TitleOptions>;
}

export const tooling = ({
  sections = {},
  title: _title
}: ToolingSectionOptions) => {
  const { content = '🛠️ Tooling', size = 2 } = _title ?? {};
  return section({
    title: title({ content, size }),
    body: Object.entries(sections)
      .map(([sectionTitle, tools]) =>
        details({
          summary: {
            text: titleElement({
              content:
                sectionTitle.charAt(0).toUpperCase() + sectionTitle.slice(1),
              size: clampHeaderSize(size + 1)
            })
          },
          content: list({ items: tools.map(link) })
        })
      )
      .join('\n\n')
  });
};

interface HeaderSectionOptions {
  badges?: BadgeOptions[];
  description?: string;
  hero?: MDOrHTML<ImageOptions, ImageElementOptions>;
  title?: string;
}

export const header = ({
  badges: b,
  title: _title,
  description,
  hero
}: HeaderSectionOptions) =>
  section({
    ...(_title && { title: title({ size: 1, content: _title }) }),
    body: join(
      hero && makeMDOrHTML('image', hero.type, hero.opts),
      b?.map(badge).join(' '),
      text(description)
    ),
    separator: true
  });

export type {
  HeaderSectionOptions as HeaderOptions,
  InstallationSectionOptions as InstallationOptions,
  LicenseSectionOptions as LicenseOptions,
  ToolingSectionOptions as ToolingOptions
};
