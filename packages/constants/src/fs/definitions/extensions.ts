//#region> Source Files
export const JS = ['js', 'cjs', 'mjs', 'jsx'] as const;
export const JS_SET = new Set<string>(JS);
export type JsExtension = (typeof JS)[number];

export const TS = ['ts', 'cts', 'mts', 'tsx'] as const;
export const TS_SET = new Set<string>(TS);
export type TsExtension = (typeof TS)[number];

export const FRAMEWORK = ['vue', 'svelte', 'marko', 'astro'] as const;
export const FRAMEWORK_SET = new Set<string>(FRAMEWORK);
export type FrameworkExtension = (typeof FRAMEWORK)[number];

export const SRC = [...JS, ...TS, ...FRAMEWORK] as const;
export const SRC_SET = new Set<string>(SRC);
export type SrcExtension = (typeof SRC)[number];
//#endregion

export const TS_ARTIFACTS = ['d.ts', 'tsbuildinfo'] as const;
export const TS_ARTIFACTS_SET = new Set<string>(TS_ARTIFACTS);
export type TsArtifactExtension = (typeof TS_ARTIFACTS)[number];

export const IMG = ['svg', 'png', 'jpg', 'jpeg', 'gif', 'webp'] as const;
export const IMG_SET = new Set<string>(IMG);
export type ImgExtension = (typeof IMG)[number];

//#region> Data Files
export const JSON = ['json', 'json5', 'jsonc'] as const;
export const JSON_SET = new Set<string>(JSON);
export type JsonExtension = (typeof JSON)[number];

export const TXT = ['txt', 'text'] as const;
export const TXT_SET = new Set<string>(TXT);
export type TxtExtension = (typeof TXT)[number];

export const YAML = ['yml', 'yaml'] as const;
export const YAML_SET = new Set<string>(YAML);
export type YamlExtension = (typeof YAML)[number];

export const TOML = ['toml'] as const;
export const TOML_SET = new Set<string>(TOML);
export type TomlExtension = (typeof TOML)[number];

export const MD = ['md'] as const;
export const MD_SET = new Set<string>(MD);
export type MdExtension = (typeof MD)[number];

export const XML = ['xml'] as const;
export const XML_SET = new Set<string>(XML);
export type XmlExtension = (typeof XML)[number];

export const CSV = ['csv'] as const;
export const CSV_SET = new Set<string>(CSV);
export type CsvExtension = (typeof CSV)[number];

export const DATA = [...JSON, ...TXT, ...YAML, ...TOML, ...CSV] as const;
export const DATA_SET = new Set<string>(DATA);
export type DataExtension = (typeof DATA)[number];
//#endregion

export type AnyExtension =
  | JsExtension
  | TsExtension
  | FrameworkExtension
  | SrcExtension
  | TsArtifactExtension
  | ImgExtension
  | JsonExtension
  | TxtExtension
  | YamlExtension
  | TomlExtension
  | MdExtension
  | XmlExtension
  | CsvExtension
  | DataExtension;

export const withExt = <N extends string, E extends AnyExtension>(name: N, ext: E): `${N}.${E}` =>
  `${name}.${ext}` as const;
