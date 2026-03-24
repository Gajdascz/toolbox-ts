import { type Text, type GithubElementProps, makeHtmlElement, text } from '../../core/index.js';

export type HeadingSize = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingOptions {
  content: Text;
  size: HeadingSize;
  id?: string;
}
export const clampHeadingSize = (size: number): HeadingSize =>
  Math.min(6, Math.max(1, Math.floor(size))) as HeadingSize;
export const heading = ({ content, size, id }: HeadingOptions) =>
  `${'#'.repeat(clampHeadingSize(size))} ${text(content)}${id ? `{#${id}}` : ''}` as const;

export type HeadingElementOptions = GithubElementProps<HeadingOptions>;
export const headingElement = ({ content, size, ...props }: HeadingElementOptions) =>
  makeHtmlElement(`h${clampHeadingSize(size)}`, text(content), props);
