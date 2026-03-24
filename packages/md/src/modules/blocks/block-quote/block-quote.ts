import { type Text, text } from '../../core/index.js';
import { type GithubElementProps, makeHtmlElement } from '../../core/index.js';

export const blockQuote = (content: Text | Text[]) =>
  (Array.isArray(content) ? content : [content]).map((c) => `> ${text(c)}`).join('\n');

export interface BlockQuoteElementProps extends GithubElementProps {
  cite?: string;
}
export const blockQuoteElement = (content: Text | Text[], props?: BlockQuoteElementProps) =>
  makeHtmlElement(
    'blockquote',
    (Array.isArray(content) ? content : [content]).map((c) => text(c)).join('\n'),
    props
  );
