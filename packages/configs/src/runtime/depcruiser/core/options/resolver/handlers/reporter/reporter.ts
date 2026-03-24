import type { ICruiseOptions } from 'dependency-cruiser';

import type { InputCruiseOptions } from '../../../../types/config.js';
import { NODE_MODULES_PACKAGES, ROOT_SRC_DIRS, TEST_FILES } from '../../../../patterns.js';

export const DOT_REPORTER_OPTIONS: NonNullable<InputCruiseOptions['reporterOptions']>['dot'] = {
  collapsePattern: NODE_MODULES_PACKAGES
} as const;
export const ARCHI_REPORTER_OPTIONS: NonNullable<InputCruiseOptions['reporterOptions']>['archi'] = {
  collapsePattern: `^(?:${ROOT_SRC_DIRS}|${TEST_FILES})/[^/]+|${NODE_MODULES_PACKAGES}`
} as const;

export const TEXT_REPORTER_OPTIONS: NonNullable<ICruiseOptions['reporterOptions']>['text'] = {
  highlightFocused: true
} as const;

export const handleReporter = ({
  archi,
  dot,
  text,
  ...rest
}: InputCruiseOptions['reporterOptions'] = {}): NonNullable<ICruiseOptions['reporterOptions']> => ({
  dot: { ...DOT_REPORTER_OPTIONS, ...dot },
  archi: { ...ARCHI_REPORTER_OPTIONS, ...archi },
  text: { ...TEXT_REPORTER_OPTIONS, ...text },
  ...rest
});
