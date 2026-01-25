export const THIS_PACKAGE = '@toolbox-ts/repo-kit';
export const DOMAINS = ['build', 'dev', 'test'] as const;
export type RepoDomain = (typeof DOMAINS)[number];
export const DOMAIN: { [K in RepoDomain]: K } = {
  build: 'build',
  dev: 'dev',
  test: 'test'
} as const;
export const TYPES = ['monorepo', 'singlePackage'] as const;
export type Type = (typeof TYPES)[number];

export const TSCONFIG_DOMAINS = [
  'base',
  'reference',
  ...DOMAINS,
  'package'
] as const;
export type Domain = (typeof TSCONFIG_DOMAINS)[number];
export const TSCONFIG_DOMAIN: { [K in Domain]: K } = {
  base: 'base',
  reference: 'reference',
  build: 'build',
  dev: 'dev',
  test: 'test',
  package: 'package'
} as const;
