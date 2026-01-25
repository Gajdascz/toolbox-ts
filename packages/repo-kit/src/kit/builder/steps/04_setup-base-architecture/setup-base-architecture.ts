import type { RepoType } from '@toolbox-ts/configs/core';

export interface SetupBaseArchitectureArgs<R extends RepoType> {
  dirs: { devPrefix?: '_' | '.'; docs?: boolean; src?: boolean };
  files: {
    gitignore?: boolean | string;
    license?: boolean | string;
    prettierIgnore?: boolean | string;
    readme?: boolean | string;
  };
  repoType: R;
}

export function setupBaseArchitecture<R extends RepoType>({
  dirs,
  files,
  repoType
}: SetupBaseArchitectureArgs<R>): Promise<{ status: 'success' }> {}
