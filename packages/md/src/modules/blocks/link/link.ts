import { type Text, type GithubElementProps, makeHtmlElement, text } from '../../core/index.js';

export interface LinkOptions {
  description?: Text;
  content: Text;
  url: string;
}
export const link = (opts: LinkOptions) =>
  !opts.description
    ? `[${text(opts.content)}](${opts.url})`
    : `[${text(opts.content)}](${opts.url}): ${text(opts.description)}`;
export type LinkElementOptions = GithubElementProps<
  { target?: LinkElementTarget } & Omit<LinkOptions, 'description'>
>;
export type LinkElementTarget = '_blank' | '_parent' | '_self' | '_top' | '_unfencedTop';
export const linkElement = ({ content: txt, url: href, target, ...props }: LinkElementOptions) =>
  makeHtmlElement('a', text(txt), { ...props, href, target });
