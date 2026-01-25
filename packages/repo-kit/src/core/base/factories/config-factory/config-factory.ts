import type {
  RuntimeConfigModule,
  RuntimeConfigModuleInput,
  RuntimeConfigTemplate,
  StaticConfigModule,
  StaticConfigModuleInput
} from './types.js';

const getRuntimeTemplateStringFn =
  <I, O = I>({
    importFrom,
    importName,
    define
  }: RuntimeConfigModuleInput<I, O>) =>
  (cfg?: I): RuntimeConfigTemplate =>
    `import { ${importName} } from '${importFrom}';

export default ${importName}.define(${JSON.stringify(define(cfg), null, 2)});`;

export function createConfigModule<I, O = I>(
  inp: RuntimeConfigModuleInput<I, O>
): RuntimeConfigModule<I, O>;
export function createConfigModule<I, O = I>(
  inp: StaticConfigModuleInput<I, O>
): StaticConfigModule<I, O>;
export function createConfigModule<I, O = I>(
  inp: RuntimeConfigModuleInput<I, O> | StaticConfigModuleInput<I, O>
): RuntimeConfigModule<I, O> | StaticConfigModule<I, O>;
export function createConfigModule<I, O = I>(
  inp: RuntimeConfigModuleInput<I, O> | StaticConfigModuleInput<I, O>
): RuntimeConfigModule<I, O> | StaticConfigModule<I, O> {
  if (inp.fileType === 'runtime') {
    const getTemplate = getRuntimeTemplateStringFn<I, O>(inp);
    return {
      ...inp,
      getTemplate,
      fileType: 'runtime',
      mergeStrategy: {
        strategy: 'default',
        options: { serialize: getTemplate }
      }
    };
  } else {
    const getTemplate =
      inp.contentType === 'object' ?
        (cfg?: I) => JSON.stringify(cfg, null, 2)
      : (cfg?: I) => String(cfg);
    return {
      ...inp,
      fileType: 'static',
      mergeStrategy: {
        strategy: 'default',
        options: { serialize: getTemplate }
      },
      getTemplate
    };
  }
}
