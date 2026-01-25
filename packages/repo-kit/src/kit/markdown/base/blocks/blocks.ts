import type { StrTemplateValue } from '@toolbox-ts/types';

import { NPM_URL, SHIELDS_IO_URL } from '../../../architecture/index.js';
import { isText, type Text, text } from '../text/text.ts';

export type GithubElementProps<P = Record<string, unknown>> = {
  align?: 'center' | 'left' | 'right';
  id?: readonly string[] | string | string[];
  style?: readonly string[] | string | string[];
} & P;
const applyProp = (name: string, value: unknown) => {
  let v: StrTemplateValue = undefined;
  switch (typeof value) {
    case 'undefined':
      break;
    case 'string':
      if (value.length > 0) v = `"${value}"`;
      break;
    case 'object':
      if (value === null) break;
      if (Array.isArray(value)) {
        const val = [...new Set(value)];
        v = `"${name === 'style' ? val.join('; ') + ';' : val.join(' ')}"`;
      } else v = JSON.stringify(value);
      break;
    default:
      v = value as StrTemplateValue;
  }
  return v ? ` ${name}=${v}` : '';
};

const makeHtmlElement = (
  tag: string,
  content?: string,
  props?: GithubElementProps
) =>
  `<${tag}${
    props ?
      Object.entries(props)
        .map(([k, v]) => applyProp(k, v))
        .join('')
    : ''
  }>${content ?? ''}</${tag}>`;

const makeSingleTagHtmlElement = (
  tag: string,
  props: Record<string, unknown> = {}
) =>
  `<${tag}${Object.entries(props)
    .map(([k, v]) => applyProp(k, v))
    .join('')} />`;

export const spanTag = (content: Text, props?: GithubElementProps) =>
  makeHtmlElement('span', text(content), props);

//#region> Callout
export type Callout = `> [!${Uppercase<CalloutType>}]\n> ${string}`;
export interface CalloutOptions {
  message: Text;
  type: CalloutType;
}
export interface CalloutOptions {
  message: Text;
  type: CalloutType;
}

export type CalloutType = 'caution' | 'important' | 'note' | 'tip' | 'warning';

export const callout = ({ message, type }: CalloutOptions) =>
  `> [!${type.toUpperCase()}]\n> ${text(message)}` as const;

//#endregion

//#region> Image
export interface ImageOptions {
  description?: string;
  url: string;
}
export const image = ({ url, description = '' }: ImageOptions) =>
  `![${description}](${url})`;

export type ImageElementOptions = GithubElementProps<ImageOptions>;
export const imageElement = ({
  url: src,
  description: alt = '',
  ...props
}: ImageElementOptions) =>
  makeSingleTagHtmlElement('img', { src, alt, ...props });
//#endregion

//#region> Link
export interface LinkOptions {
  description?: Text;
  text: Text;
  url: string;
}
export const link = (opts: LinkOptions) =>
  !opts.description ?
    `[${text(opts.text)}](${opts.url})`
  : `[${text(opts.text)}](${opts.url}): ${text(opts.description)}`;
export type LinkElementOptions = GithubElementProps<
  { target?: LinkElementTarget } & Omit<LinkOptions, 'description'>
>;
export type LinkElementTarget =
  | '_blank'
  | '_parent'
  | '_self'
  | '_top'
  | '_unfencedTop';
export const linkElement = ({
  text: txt,
  url: href,
  target,
  ...props
}: LinkElementOptions) =>
  makeHtmlElement('a', text(txt), { ...props, href, target });
//#endregion

//#region> Image Link
export interface ImageLinkOptions {
  description?: string;
  imgUrl: string;
  linkUrl: string;
}
export const imageLink = ({
  imgUrl,
  linkUrl,
  description = ''
}: ImageLinkOptions) =>
  link({ text: image({ url: imgUrl, description }), url: linkUrl });
export type ImageLinkElementOptions = GithubElementProps<ImageLinkOptions>;
export const imageLinkElement = ({
  imgUrl,
  description = '',
  linkUrl,
  ...props
}: ImageLinkElementOptions) =>
  linkElement({
    text: imageElement({ url: imgUrl, description }),
    url: linkUrl,
    ...props
  });
//#endregion

//#region> Reference
export interface ReferenceOptions {
  description?: Text;
  name: Text;
  url: string;
}
export const reference = ({
  name,
  url,
  description
}: ReferenceOptions): string =>
  !description || description === '' ?
    `[${text(name)}]: ${url}`
  : `[${text(name)}]: ${url} "${text(description)}"`;
//#endregion

//#region> Npm Badge
export interface NpmBadgeOptions {
  description?: string;
  label?: string;
  packageName: string;
  scope?: string;
}
const formatNpmBadgeImgUrl = ({
  packageName,
  scope,
  description = 'npm version',
  label
}: {
  description?: string;
  label?: string;
  packageName: string;
  scope?: string;
}) =>
  `${SHIELDS_IO_URL}/npm/v/${scope ? `${scope}/` : ''}${packageName}?label=${encodeURIComponent(
    label ?? description
  )}`;
const formatNpmBadgeLinkUrl = ({
  packageName,
  scope
}: {
  packageName: string;
  scope?: string;
}) => `${NPM_URL}/package/${scope ? `${scope}/` : ''}${packageName}`;
export const npmBadge = ({
  packageName,
  description = 'npm version',
  label,
  scope
}: NpmBadgeOptions) =>
  imageLink({
    description,
    imgUrl: formatNpmBadgeImgUrl({ packageName, scope, label, description }),
    linkUrl: formatNpmBadgeLinkUrl({ packageName, scope })
  });
export type NpmBadgeElementOptions = GithubElementProps<NpmBadgeOptions>;
export const npmBadgeElement = ({
  packageName,
  description = 'npm version',
  label,
  scope,
  ...props
}: NpmBadgeElementOptions) =>
  imageLinkElement({
    description,
    imgUrl: formatNpmBadgeImgUrl({ packageName, scope, label, description }),
    linkUrl: formatNpmBadgeLinkUrl({ packageName, scope }),
    ...props
  });
//#endregion

//#region> Title
export type HeaderSize = 1 | 2 | 3 | 4 | 5 | 6;

export interface TitleOptions {
  content: Text;
  size: HeaderSize;
}
export const clampHeaderSize = (size: number): HeaderSize =>
  Math.min(6, Math.max(1, Math.floor(size))) as HeaderSize;
export const title = ({ content, size }: TitleOptions) =>
  `${'#'.repeat(clampHeaderSize(size))} ${text(content)}`;
export type TitleElementOptions = GithubElementProps<TitleOptions>;
export const titleElement = ({
  content,
  size,
  ...props
}: TitleElementOptions) =>
  makeHtmlElement(`h${clampHeaderSize(size)}`, text(content), props);
//#endregion

//#region> List
export type ListNode = { children?: ListNode[]; content: Text } | Text;
export type ListNodes = ListNode[] | readonly ListNode[];

export type ListType = 'ordered' | 'task' | 'unordered';

const normalizeListNode = (
  node: ListNode
): { children: ListNode[]; content: Text } => {
  return isText(node) ?
      { content: node, children: [] }
    : { content: node.content, children: node.children ?? [] };
};

const MD_PREFIX: Record<ListType, (index: number) => string> = {
  unordered: () => '-',
  task: () => '- [ ]',
  ordered: (i) => `${i + 1}.`
};

export interface ListOptions {
  items: ListNodes;
  type?: ListType;
}

export const list = (
  { items, type = 'unordered' }: ListOptions,
  level = 0
): string =>
  items
    .map((node, index) => {
      const { children, content } = normalizeListNode(node);
      const line = `${'  '.repeat(level)}${MD_PREFIX[type](index)} ${text(content)}`;
      return children.length === 0 ?
          line
        : `${line}\n${list({ items: children, type }, level + 1)}`;
    })
    .join('\n');

export type ListElementType = Exclude<ListType, 'task'>;
const HTML_LIST_TAG = { unordered: 'ul', ordered: 'ol' } as const;

export interface ListElementOptions {
  items: ListNodes;
  props?: GithubElementProps;
  type?: ListElementType;
}

export const listElement = ({
  items,
  type = 'unordered',
  props = {}
}: ListElementOptions): string =>
  makeHtmlElement(
    HTML_LIST_TAG[type],
    items
      .map((node) => {
        const { children, content } = normalizeListNode(node);
        return makeHtmlElement(
          'li',
          text(content)
            + (children.length > 0 ?
              listElement({ items: children, type })
            : '')
        );
      })
      .join(''),
    props
  );

//#endregion

//#region> Details
export type DetailsOptions = GithubElementProps<{
  content: Text;
  summary: Text;
}>;

export const details = ({ content, summary, ...props }: DetailsOptions) =>
  makeHtmlElement(
    'details',
    makeHtmlElement('summary', text(summary)) + `\n\n${text(content)}\n\n`,
    props
  );
//#endregion

//#region> Code Block
export type CodeBlock = `\`\`\`${CodeBlockLanguage}\n${string}\n\`\`\``;
export type CodeBlockLanguage =
  | 'astro'
  | 'bash'
  | 'css'
  | 'html'
  | 'javascript'
  | 'js'
  | 'json'
  | 'jsx'
  | 'plaintext'
  | 'sh'
  | 'shell'
  | 'ts'
  | 'tsx'
  | 'typescript'
  | 'xml'
  | 'yaml'
  | 'yml';
export const codeBlock = (
  code: string,
  language: CodeBlockLanguage = 'plaintext'
): CodeBlock => `\`\`\`${language}\n${code}\n\`\`\``;
//#endregion

//#region> Table
export function table<H extends readonly Text[]>(
  headers: Readonly<H>,
  ...rows: { [K in keyof H]: Text }[]
): string {
  const colWidth: number[] = Array.from<number>({
    length: headers.length
  }).fill(0);
  const styledHeaders = headers.map(text);
  const styledRows = rows.map((r) => r.map(text));
  for (const row of [styledHeaders, ...styledRows]) {
    for (const [i, cell] of row.entries())
      colWidth[i] = Math.max(colWidth[i], cell.length);
  }
  const padRow = (row: readonly string[]) =>
    row
      .map((cell, i) => {
        const padding = ' '.repeat(colWidth[i] - cell.length);
        return `| ${cell}${padding} `;
      })
      .join('') + '|';

  return `\n${padRow(styledHeaders)}\n${colWidth.map((w) => `|${'-'.repeat(w + 2)}`).join('')}|\n${styledRows.map(padRow).join('\n')}\n`;
}
//#endregion

//#region> MD or HTML
export type MDOrHTML<M, H> =
  | { opts: H; type: 'html' }
  | { opts: M; type: 'md' };
const MD_HTML_MAP = {
  image: { md: image, html: imageElement },
  link: { md: link, html: linkElement },
  imageLink: { md: imageLink, html: imageLinkElement },
  npmBadge: { md: npmBadge, html: npmBadgeElement },
  title: { md: title, html: titleElement },
  list: { md: list, html: listElement }
} as const;
export type MDOrHTMLMap = typeof MD_HTML_MAP;
export type MDOrHTMLOptions<
  T extends MDOrHTMLType,
  F extends 'html' | 'md'
> = Parameters<MDOrHTMLMap[T][F]>;
export type MDOrHTMLType = keyof typeof MD_HTML_MAP;

export const makeMDOrHTML = <
  T extends keyof typeof MD_HTML_MAP,
  F extends 'html' | 'md'
>(
  block: T,
  format: F,
  ...options: MDOrHTMLOptions<T, F>
) => (MD_HTML_MAP[block][format] as (...args: any[]) => string)(...options);

//#endregion
//#region> Badges
export type BadgeOptions =
  | { opts: MDOrHTML<ImageLinkOptions, ImageLinkElementOptions>; type: 'link' }
  | { opts: MDOrHTML<ImageOptions, ImageElementOptions>; type: 'image' }
  | { opts: MDOrHTML<NpmBadgeOptions, NpmBadgeElementOptions>; type: 'npm' };
export const badge = ({ opts, type }: BadgeOptions): string => {
  switch (type) {
    case 'image':
      return makeMDOrHTML('image', opts.type, opts.opts);
    case 'link':
      return makeMDOrHTML('imageLink', opts.type, opts.opts);
    case 'npm':
      return makeMDOrHTML('npmBadge', opts.type, opts.opts);
  }
};
//#endregion
