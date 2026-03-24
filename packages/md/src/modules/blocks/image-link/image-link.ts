import { type GithubElementProps } from '../../core/index.js';
import { link, linkElement } from '../link/index.js';
import { image, imageElement } from '../image/index.js';
export interface ImageLinkOptions {
  description?: string;
  imgUrl: string;
  linkUrl: string;
}
export const imageLink = ({ imgUrl, linkUrl, description = '' }: ImageLinkOptions) =>
  link({ content: image({ url: imgUrl, description }), url: linkUrl });
export type ImageLinkElementOptions = GithubElementProps<ImageLinkOptions>;
export const imageLinkElement = ({
  imgUrl,
  description = '',
  linkUrl,
  ...props
}: ImageLinkElementOptions) =>
  linkElement({ content: imageElement({ url: imgUrl, description }), url: linkUrl, ...props });
