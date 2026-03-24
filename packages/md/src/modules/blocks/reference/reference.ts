import { type Text, text } from '../../core/index.js';

export interface ReferenceOptions {
  description?: Text;
  name: Text;
  url: string;
}
export const reference = ({ name, url, description }: ReferenceOptions): string =>
  !description || description === ''
    ? `[${text(name)}]: ${url}`
    : `[${text(name)}]: ${url} "${text(description)}"`;
