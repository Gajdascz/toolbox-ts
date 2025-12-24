import { createStaticConfigModule } from '../../core/index.js';

/**
 * Syntax kind of the custom tag.
 * - \"inline\" means that this tag can appear inside other documentation sections
 *  (example: \{\@link\}).
 * - \"block\" means that this tag starts a new documentation section (example: \@remarks).
 * - \"modifier\" means that this tag's presence indicates an aspect of the associated API item (example: \@internal).
 */
export type TsdocSyntaxKind = 'block' | 'inline' | 'modifier';
export interface TsdocTemplateRule {
  /**
   * If true, then this tag may appear multiple times in a doc comment.
   * By default, a tag may only appear once.
   */
  allowMultiple: boolean;
  syntaxKind: TsdocSyntaxKind;
  /**
   * Name of the custom tag. TSDoc tag names start with an at-sign (\@) followed by ASCII letters using camelCase capitalization.
   */
  tagName: `@${string}`;
}

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

export const { define, meta } = createStaticConfigModule({
  filename: 'tsdoc.json',
  dependencies: ['@microsoft/tsdoc-config'],
  define: (rules: TsdocTemplateRule[] = []) => ({
    $schema: DEFAULTS.$schema,
    tagDefinitions: [...DEFAULTS.tagDefinitions, ...rules]
  })
});
export type Config = TsdocTemplateRule[];
