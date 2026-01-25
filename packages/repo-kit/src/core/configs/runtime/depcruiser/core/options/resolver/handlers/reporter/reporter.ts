import type { ICruiseOptions } from 'dependency-cruiser';

import type { InputCruiseOptions } from '../../../../types/config.js';

export const DOT_REPORTER_OPTIONS: NonNullable<
  InputCruiseOptions['reporterOptions']
>['dot'] = { collapsePattern: 'node_modules/(?:@[^/]+/[^/]+|[^/]+)' } as const;
export const ARCHI_REPORTER_OPTIONS: NonNullable<
  InputCruiseOptions['reporterOptions']
>['archi'] = {
  collapsePattern:
    '^(?:packages|src|lib(s?)|app(s?)|bin|test(s?)|spec(s?))/[^/]+|node_modules/(?:@[^/]+/[^/]+|[^/]+)'
} as const;

export const TEXT_REPORTER_OPTIONS: NonNullable<
  ICruiseOptions['reporterOptions']
>['text'] = { highlightFocused: true } as const;

export const handleReporter = ({
  archi,
  dot,
  text,
  ...rest
}: InputCruiseOptions['reporterOptions'] = {}): ICruiseOptions['reporterOptions'] => ({
  dot: { ...DOT_REPORTER_OPTIONS, ...dot },
  archi: { ...ARCHI_REPORTER_OPTIONS, ...archi },
  text: { ...TEXT_REPORTER_OPTIONS, ...text },
  ...rest
});
