import type { TemplateValue } from '@toolbox-ts/types/defs/string';
import { type Text, text } from '../text/index.js';

export type GithubElementProps<P = Record<string, unknown>> = {
  align?: 'center' | 'left' | 'right';
  id?: readonly string[] | string | string[];
  style?: readonly string[] | string | string[];
} & P;
export const applyProp = (name: string, value: unknown) => {
  let v: TemplateValue = undefined;
  switch (typeof value) {
    case 'undefined':
      break;
    case 'string': {
      const trimmed = value.trim();
      if (trimmed.length > 0) v = `"${trimmed}"`;
      break;
    }
    case 'object':
      if (value === null) break;
      if (Array.isArray(value)) {
        const val = [...new Set(value)];
        if (val.length === 0) break;
        v = `"${name === 'style' ? val.join('; ') + ';' : val.join(' ')}"`;
      } else v = JSON.stringify(value);
      break;
    default:
      v = value as TemplateValue;
  }
  return v ? ` ${name}=${v}` : '';
};

export const makeHtmlElement = (tag: string, content?: string, props?: GithubElementProps) =>
  `<${tag}${
    props
      ? Object.entries(props)
          .map(([k, v]) => applyProp(k, v))
          .join('')
      : ''
  }>${content ?? ''}</${tag}>`;

export const makeSingleTagHtmlElement = (tag: string, props: Record<string, unknown> = {}) =>
  `<${tag}${Object.entries(props)
    .map(([k, v]) => applyProp(k, v))
    .join('')} />`;

export const spanTag = (content: Text, props?: GithubElementProps) =>
  makeHtmlElement('span', text(content), props);
