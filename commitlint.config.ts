import { commitlint } from '@toolbox-ts/configs';

export default commitlint.define({
  rules: {},
  scopes: [
    'repo',
    'cli-kit',
    'configs',
    'depcruiser',
    'file',
    'test-utils',
    'tseslint',
    'utils'
  ]
});
