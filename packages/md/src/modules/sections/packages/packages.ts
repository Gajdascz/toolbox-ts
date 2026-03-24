import { EMOJIS, section } from '../../core/index.js';
import { type HeadingOptions, heading, link, table } from '../../blocks/index.js';

const HEADERS = ['Package', 'Status', 'Description'] as const;

export interface MonorepoPackageEntry {
  name: string;
  description: string;
  url: string;
  badges: { version: string; lastUpdate: string; downloads: string };
}

export interface PackagesOptions {
  heading?: Partial<HeadingOptions>;
  packages: MonorepoPackageEntry[];
  separator?: boolean;
}
export const packages = ({ heading: _heading, packages, separator }: PackagesOptions) =>
  section({
    heading: heading({ content: `${EMOJIS.PACKAGES} Packages`, size: 2, ..._heading }),
    body: table(
      HEADERS,
      ...packages.map(
        ({ name, description, url, badges }) =>
          [
            link({ content: name, url }),
            `${badges.version} ${badges.lastUpdate} ${badges.downloads}`,
            description
          ] as const
      )
    ),
    separator
  });
