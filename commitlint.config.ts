import { commitlint } from '@toolbox-ts/configs';

export default commitlint.define({
  rules: {},
  scopes: [
    'cli-kit',
    'configs',
    'depcruiser',
    'file',
    'git-kit',
    'repo-kit',
    'test-utils',
    'tseslint',
    'utils'
  ]
});
