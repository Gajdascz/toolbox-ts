import type { TsDoc } from '@toolbox-ts/types/defs/configs';

export const DEFAULTS = {
  $schema:
    'https://developer.microsoft.com/json-schemas/tsdoc/v0/tsdoc.schema.json',
  tagDefinitions: [
    { tagName: '@important', syntaxKind: 'block', allowMultiple: true },
    { tagName: '@module', syntaxKind: 'block', allowMultiple: false },
    { tagName: '@default', syntaxKind: 'block', allowMultiple: false },
    { tagName: '@template', syntaxKind: 'block', allowMultiple: true }
  ]
} as const;
export const define = (
  rules: readonly TsDoc.TagDefinition[] | TsDoc.TagDefinition[] = []
) => ({
  $schema: DEFAULTS.$schema,
  tagDefinitions: [...DEFAULTS.tagDefinitions, ...rules]
});

export type Config = readonly TsDoc.TagDefinition[] | TsDoc.TagDefinition[];
