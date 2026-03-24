/**
 * File types with supported file-type modules.
 * - module: ESM/CJS source files (js,jsx,ts,tsx,astro, ...etc)
 * - text: Plain text files (txt, text)
 * - json: JSON files (json, json5, jsonc)
 * - yaml: YAML files (yml, yaml)
 */
export type FileType = 'module' | 'text' | 'json' | 'yaml';

/**
 * Strategies for resolving file conflicts during write operations.
 * - abort: Abort the operation if a conflict is detected.
 * - skip: Skip the conflicting file and continue with others.
 * - overwrite: Overwrite the existing file with the new content.
 * - create: Create a new file without overwriting the existing one.
 */
export type ResolutionStrategy = 'abort' | 'skip' | 'overwrite' | 'create';
