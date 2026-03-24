import { commitlint } from '@toolbox-ts/configs';

export default commitlint.define({
  scopes: ['repo', 'cli-kit', 'configs', 'file', 'test-utils', 'utils', 'types', 'constants', 'md'],
  usingChangeset: true
});
