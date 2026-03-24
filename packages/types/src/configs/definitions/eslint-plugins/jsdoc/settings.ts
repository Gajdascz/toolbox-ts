import type { AliasGroups } from './tags.js';

/**
 * An object indicating tags whose types and names/namepaths (whether defining or referencing namepaths) will be checked, subject to configuration. If the tags have predefined behavior or allowEmptyNamepaths behavior, this option will override that behavior for any specified tags, though this option can also be used for tags without predefined behavior
 * - Use to define custom tags
 *
 * @important The `tagName` key is the name of the JSDoc tag to configure. It must be added to the `jsdoc/check-tag-names` rule. See example.
 * @see {@link https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/settings.md#structuredtags}
 *
 * @example
 * ```json
 * // .oxlintrc.json
 * rules: {
 *  "jsdoc/check-tag-names": ["error", { "definedTags": ["foo"] }]
 * },
 * "settings": {
 *   "jsdoc": {
 *     "structuredTags": {
 *       "foo": {
 *         "description": "bar"
 *       }
 *     }
 *   }
 * }
 * ```
 */
export type StructuredTags = {
  [tagName: string]: {
    /**
     * - "text": When a name is present, plain text will be allowed in the name position (non-whitespace immediately after the tag and whitespace), e.g., in `@throws` This is an error, "This" would normally be the name, but "text" allows non-name text here also. This is the default.
     * - "name-defining": Indicates the tag adds a name to definitions. May not be an arbitrary namepath, unlike "namepath-defining".
     * - "namepath-defining": As with namepath-referencing, but also indicates the tag adds a namepath to definitions, e.g., to prevent no-undefined-types from reporting references to that namepath.
     * - "namepath-referencing": This will cause any name position to be checked to ensure it is a valid namepath. You might use this to ensure that tags which normally allow free text, e.g., `@see` will instead require a namepath.
     * - "namepath-or-url-referencing": For inline tags which may point to a namepath or URL.
     * - false: This will disallow any text in the name position.
     *
     * @default "text"
     */
    name?:
      | 'text'
      | 'name-defining'
      | 'namepath-defining'
      | 'namepath-referencing'
      | 'namepath-or-url-referencing'
      | false;
    /**
     * - true: Allows valid types within brackets.
     * - false: Explicitly disallows any brackets or bracketed type. You might use this with `@throws` to suggest that only free form text is being input or with `@augments` (for "jsdoc" mode) to disallow Closure-style bracketed usage along with a required namepath.
     * - string[]: A list of permissible types.
     *
     * @default true
     */
    type?: boolean;
    /**
     * - Array of one of the following:
     *    - One or both of the following strings (if both are included, then both are required):
     *      - "name": Indicates that a name position is required (not just that if present, it is a valid namepath). You might use this with see to insist that a value (or namepath, depending on the name value) is always present.
     *      - "type": Indicates that the type position (within curly brackets) is required (not just that if present, it is a valid type). You might use this with `@throws` or `@typedef` which might otherwise normally have their types optional.
     * - "typeOrNameRequired": Must have either type (e.g., @throws {aType}) or name (@throws Some text); does not require that both exist but disallows just an empty tag
     * @default []
     */
    required?: ('name' | 'type' | 'typeOrNameRequired')[];

    /**
     * A description of the tag's purpose or usage.
     */
    description?: string;
  };
};
/** @see {@link https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/settings.md} */
export interface Settings {
  /**
   * Only for `require-(yields|returns|description|example|param|throws)` rule
   */
  augmentsExtendsReplacesDocs?: boolean;
  /**
   * Only for `require-param-type` and `require-param-description` rule
   */
  exemptDestructuredRootsFromChecks?: boolean;
  /**
   * For all rules but NOT apply to `empty-tags` rule
   */
  ignoreInternal?: boolean;
  /**
   * For all rules but NOT apply to `check-access` and `empty-tags` rule
   */
  ignorePrivate?: boolean;
  /**
   * Only for `require-(yields|returns|description|example|param|throws)` rule
   */
  ignoreReplacesDocs?: boolean;
  /**
   * Only for `require-(yields|returns|description|example|param|throws)` rule
   */
  implementsReplacesDocs?: boolean;
  /**
   * Only for `require-(yields|returns|description|example|param|throws)` rule
   */
  overrideReplacesDocs?: boolean;
  /**
   * Tag name preferences.
   * @see {@link https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/settings.md#alias-preference}
   */
  tagNamePreference?: {
    [K in keyof AliasGroups]?:
      | AliasGroups[K]
      | { message: string; replacement: AliasGroups[K] }
      | { message: string }
      | boolean;
  };

  /**
   * Configuration for structured tags.
   * @see {@link StructuredTags}
   */
  structuredTags?: StructuredTags;
}
