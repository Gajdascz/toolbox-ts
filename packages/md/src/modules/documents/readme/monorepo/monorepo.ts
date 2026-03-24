import { type ReadmeTemplateOptions, readmeTemplate } from '../template.js';
import {
  tooling,
  resources,
  packages as packagesSection,
  type PackagesOptions,
  type ToolingOptions,
  type ResourcesOptions
} from '../../../sections/index.js';

export interface MonorepoRootReadmeOptions extends ReadmeTemplateOptions {
  packages: PackagesOptions;
  resources?: ResourcesOptions;
  tooling?: ToolingOptions;
}

export const monorepoRootReadme = ({
  name,
  packages: _packages,
  licenseSpdx,
  license: _license,
  header: _header,
  ...rest
}: MonorepoRootReadmeOptions) =>
  readmeTemplate(
    [
      packagesSection(_packages),
      rest.resources && resources(rest.resources),
      rest.tooling && tooling(rest.tooling)
    ],
    { name, licenseSpdx, header: _header, license: _license }
  );
