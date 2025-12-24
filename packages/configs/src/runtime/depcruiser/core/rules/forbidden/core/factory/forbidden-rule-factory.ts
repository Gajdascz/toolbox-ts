import type {
  ForbiddenRule,
  ForbiddenRuleCfg,
  ForbiddenRuleFactory
} from '../../../../types/index.js';

import { when } from '../../../../../../../core/index.js';

const normalizePaths = (
  pathStrings: (string | string[] | undefined)[]
): string[] => {
  const result: string[] = [];
  for (const pathString of pathStrings) {
    if (!pathString) continue;
    if (typeof pathString === 'string') result.push(pathString);
    else result.push(...pathString);
  }
  return result;
};
export const createForbiddenRule = <N extends string>(
  name: N,
  comment: string,
  {
    from: fromDefaults = {},
    severity: severityDefault = 'error',
    to: toDefaults = {}
  }: ForbiddenRuleCfg<N> = {}
): ForbiddenRuleFactory<N> => ({
  defaults: { from: fromDefaults, severity: severityDefault, to: toDefaults },
  generate: ({
    from: fromInput = {},
    severity: severityInput = severityDefault,
    to: toInput = {}
  }: Partial<ForbiddenRuleCfg<N>> = {}): ForbiddenRule<N> => {
    const {
      path: fromInputPath,
      pathNot: fromInputPathNot,
      ...restFromInput
    } = fromInput;
    const {
      path: fromDefaultsPath,
      pathNot: fromDefaultsPathNot,
      ...restFromDefaults
    } = fromDefaults;
    const {
      path: toInputPath,
      pathNot: toInputPathNot,
      ...restToInput
    } = toInput;
    const {
      path: toDefaultsPath,
      pathNot: toDefaultsPathNot,
      ...restToDefaults
    } = toDefaults;
    const fromPath = normalizePaths([fromDefaultsPath, fromInputPath]);
    const fromPathNot = normalizePaths([fromDefaultsPathNot, fromInputPathNot]);
    const toPath = normalizePaths([toDefaultsPath, toInputPath]);
    const toPathNot = normalizePaths([toDefaultsPathNot, toInputPathNot]);
    return {
      comment,
      from: {
        ...restFromDefaults,
        ...restFromInput,
        ...when(fromPath.length > 0, { path: fromPath }),
        ...when(fromPathNot.length > 0, { pathNot: fromPathNot })
      },
      name,
      severity: severityInput,
      to: {
        ...restToDefaults,
        ...restToInput,
        ...when(toPath.length > 0, { path: toPath }),
        ...when(toPathNot.length > 0, { pathNot: toPathNot })
      }
    } as const;
  },
  META: { comment, name }
});
