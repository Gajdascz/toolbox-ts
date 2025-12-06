import { vitest } from '@toolbox-ts/configs';

const root = import.meta.dirname;

export default vitest.define({
  root,
  coverage: { reportsDirectory: `${root}/docs/reports/vitest-ui` },
  dir: import.meta.dirname,
  setupFiles: ['@toolbox-ts/test-utils/setup'],
  tsconfigFilename: 'tsconfig.test.json'
});
