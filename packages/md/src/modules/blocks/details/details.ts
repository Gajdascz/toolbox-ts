import { type Text, text, makeHtmlElement, type GithubElementProps } from '../../core/index.js';

export type DetailsOptions = GithubElementProps<{ content: Text; summary: Text }>;

export const details = ({ content, summary, ...props }: DetailsOptions) =>
  makeHtmlElement(
    'details',
    makeHtmlElement('summary', text(summary)) + `\n\n${text(content)}\n\n`,
    props
  );
