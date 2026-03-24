import {
  installation,
  tooling,
  api,
  resources,
  usage,
  type ToolingOptions,
  type UsageOptions,
  type ResourcesOptions,
  type ApiOptions,
  type InstallationOptions
} from '../../../sections/index.js';

import { readmeTemplate, type ReadmeTemplateOptions } from '../template.js';

export interface PackageReadmeOptions extends Omit<ReadmeTemplateOptions, 'body'> {
  installation?: Omit<InstallationOptions, 'packageName'>;
  tooling?: ToolingOptions;
  usage?: UsageOptions;
  resources?: ResourcesOptions;
  api?: ApiOptions;
}

export const packageReadme = ({
  name,
  licenseSpdx,
  header: _header,
  license: _license,
  ...rest
}: PackageReadmeOptions) =>
  readmeTemplate(
    [
      installation({ packageName: name, ...rest.installation }),
      rest.usage && usage(rest.usage),
      rest.resources && resources(rest.resources),
      rest.api && api(rest.api),
      rest.tooling && tooling(rest.tooling)
    ],
    { name, licenseSpdx, license: _license, header: _header }
  );
