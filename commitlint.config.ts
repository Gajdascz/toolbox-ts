import { commitlint } from '@toolbox-ts/configs';

export default commitlint.define({
  scopes: ['cli-kit', 'configs', 'file', 'test-utils', 'utils', 'types'],
  usingChangeset: true
});
