import { LICENSES, type LicenseType } from '../base/index.js';

interface CopyrightConfig {
  authorName: string;
  authorUrl?: string;
  year?: number;
}
export const copyright = ({
  authorName,
  authorUrl,
  year = new Date().getFullYear()
}: CopyrightConfig) =>
  `Copyright (c) ${year} ${authorUrl ? `[${authorName}](${authorUrl})` : authorName}`;

export const getTemplate = (
  type: LicenseType,
  copy: CopyrightConfig
): string => {
  const { body, spdx, title, url } = LICENSES[type];
  return `# ${title}

${copyright(copy)}

License: [${spdx}](${url})

${body}`;
};

export { LICENSE_FILE } from '@toolbox-ts/configs/core';
