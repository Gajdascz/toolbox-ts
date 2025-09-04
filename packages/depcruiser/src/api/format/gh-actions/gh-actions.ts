import { reporters } from '@toolbox-ts/cli-kit';
import { icons } from '@toolbox-ts/utils/constants';
import { format as _format, type IViolation } from 'dependency-cruiser';
import { EOL } from 'node:os';

import { output } from '../../../config/index.js';

const violationHeader = `${icons.rotatingLight} Dependency-Cruiser violations:${EOL}`;

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
  [output.maps.all['gh-actions-text']]: (violations: IViolation[]) =>
    violations.length === 0 ?
      `${icons.success} No violations`
    : reporter.stringify(violations, { header: violationHeader })
} as const;

export type OutputType = keyof typeof outputTypeFormatMap;
export const isOutputType = (str: string): str is OutputType =>
  str in outputTypeFormatMap;
