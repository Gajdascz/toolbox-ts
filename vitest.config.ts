import { vitestConfig } from '@toolbox-ts/configs';

export default vitestConfig.define({
  coverage: { reportsDirectory: './docs/reports/coverage' },
  dir: import.meta.dirname,
  setupFiles: ['@toolbox-ts/dev-kit/setup-tests'],
  tsconfigFilename: 'tsconfig.test.json'
});
