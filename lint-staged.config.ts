import type { Configuration } from 'lint-staged';

const LINT = 'oxlint --fix --max-warnings=0';
const FORMAT = 'oxfmt --write';
const SRC_FILES = '*.{js,jsx,cjs,ts,tsx}';
const DATA_FILES = '*.{json,md,yml,yaml}';

const config: Configuration = { [SRC_FILES]: [LINT, FORMAT], [DATA_FILES]: [FORMAT] };

export default config;
