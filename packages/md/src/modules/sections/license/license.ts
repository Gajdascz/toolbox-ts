import { EMOJIS, section, text } from '../../core/index.js';
import { type LinkOptions, type HeadingOptions, heading, link } from '../../blocks/index.js';

interface Copyright extends Partial<LinkOptions> {
  year?: number;
}
const formatCopyright = ({ content = '', url, year = new Date().getFullYear() }: Copyright) =>
  `Copyright &copy; ${year} ${content ? `[${text(content)}](${url})` : text(content)}`;

const formatUrls = (links: LinkOptions[]) =>
  links.length > 0 ? `\n${links.map(link).join(' | ')}` : '';

const formatType = (spdx: string, linkToLicenseFile?: string) =>
  linkToLicenseFile ? link({ content: spdx, url: linkToLicenseFile }) : spdx;

export interface LicenseOptions {
  owner?: LinkOptions;
  separator?: boolean;
  heading?: Partial<HeadingOptions>;
  spdx: string;
  urls?: LinkOptions[];
  year?: number;
  linkToLicenseFile?: string;
}
export const license = ({
  spdx,
  year,
  owner,
  urls: _urls = [],
  heading: _heading = {},
  separator = false,
  linkToLicenseFile
}: LicenseOptions) =>
  section({
    heading: heading({ content: `${EMOJIS.LEGAL} License`, size: 2, ..._heading }),
    body: `${formatType(spdx, linkToLicenseFile)} - ${formatCopyright({ ...owner, year })}${formatUrls(_urls)}`,
    separator
  });
