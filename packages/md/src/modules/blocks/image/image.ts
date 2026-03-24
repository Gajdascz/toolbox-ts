import { type GithubElementProps, makeSingleTagHtmlElement } from '../../core/index.js';

export interface ImageOptions {
  description?: string;
  url: string;
}
export const image = ({ url, description = '' }: ImageOptions) => `![${description}](${url})`;

export type ImageElementOptions = GithubElementProps<ImageOptions>;
export const imageElement = ({ url: src, description: alt = '', ...props }: ImageElementOptions) =>
  makeSingleTagHtmlElement('img', { src, alt, ...props });
