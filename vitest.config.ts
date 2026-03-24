import { vitest } from '@toolbox-ts/configs';

export default vitest.define(import.meta.dirname, { setupFiles: ['@toolbox-ts/test-utils/setup'] });
