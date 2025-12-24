import { vitest } from '@toolbox-ts/configs';
const root = import.meta.dirname;

export default vitest.define({
  root,

  setupFiles: ['@toolbox-ts/test-utils/setup']
});
