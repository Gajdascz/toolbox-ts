import { header, license, type LicenseOptions, type HeaderOptions } from '../../sections/index.js';
import { compose } from '../../core/index.js';
import type { Nullish } from '@toolbox-ts/types';

export interface ReadmeTemplateOptions {
  /**
   * The name of the package. This is used for the main header and installation section (package-name).
   */
  name: string;
  /**
   * The SPDX identifier for the package's license. This is used in the license section and should be a valid SPDX identifier (e.g., MIT, Apache-2.0, GPL-3.0-only).
   */
  licenseSpdx: string;
  header?: Omit<HeaderOptions, 'heading'>;
  license?: Omit<LicenseOptions, 'spdx'>;
}

export const readmeTemplate = (
  body: (Nullish | false | string)[],
  { licenseSpdx, name, ...opts }: ReadmeTemplateOptions
) =>
  compose(
    header({ heading: name, ...opts.header }),
    ...body,
    license({ spdx: licenseSpdx, ...opts.license })
  );
