import type { IViolation } from 'dependency-cruiser';

import { reporters } from '@toolbox-ts/cli-kit';
import { icons } from '@toolbox-ts/utils';
import { EOL } from 'node:os';

import { output } from '../../../definitions/index.js';

export const noticeMap: {
  [K in IViolation['rule']['severity']]: reporters.ghActionsAnnotations.NoticeType;
} = { error: 'error', ignore: 'debug', info: 'notice', warn: 'warning' };

export const reporterAdapter: reporters.ghActionsAnnotations.Adapter<
  IViolation
> = ({ rule, comment, from, to, type = 'dependency' }) => ({
  title: `${rule.name} (${from} -> ${to})`,
  message: `[${type}] ` + (comment ?? rule.name),
  type: noticeMap[rule.severity],
  file: from
});
export const reporter = new reporters.ghActionsAnnotations.Reporter(
  reporterAdapter
);

export const outputTypeFormatMap = {
  [output.maps.all['gh-actions-json']]: reporter.toJson.bind(reporter),
  [output.maps.all['gh-actions-annotations']]: (violations: IViolation[]) =>
    violations.length === 0 ?
      `${icons.success} No violations`
    : reporter.stringify(violations, {
        header: `::group::${icons.rotatingLight} Dependency-Cruiser violations:${EOL}`,
        footer: '::endgroup::'
      })
} as const;

export type OutputType = keyof typeof outputTypeFormatMap;
export const isOutputType = (str: string): str is OutputType =>
  str in outputTypeFormatMap;
