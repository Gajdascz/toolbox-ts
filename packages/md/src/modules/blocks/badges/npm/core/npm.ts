import type {
  VersionPathParams,
  VersionQueryParams,
  BundleSizePathParams,
  BundleSizeQueryParams,
  CollaboratorsPathParams,
  CollaboratorsQueryParams,
  DependencyVersionPathParams,
  DependencyVersionQueryParams,
  DownloadsByAuthorPathParams,
  DownloadsByAuthorQueryParams,
  DownloadsPathParams,
  DownloadsQueryParams,
  JsDelivrHitsPathParams,
  JsDelivrHitsQueryParams,
  LastUpdatePathParams,
  LastUpdateQueryParams,
  LicensePathParams,
  LicenseQueryParams,
  MinGzippedSizePathParams,
  MinGzippedSizeQueryParams,
  TypeDefinitionsPathParams,
  TypeDefinitionsQueryParams,
  UnpackedSizePathParams,
  UnpackedSizeQueryParams
} from './types.js';
import * as shields from '../../shields-io.js';

const pkgName = 'packageName' as const;
const optionalTag = { key: 'tag', required: false } as const;
const optionalVersion = { key: 'version', required: false } as const;

const npm = (r: string, packageName: string, ...rest: (string | undefined)[]) =>
  `/npm/${r}/${[packageName, ...rest.filter(Boolean)].join('/')}` as const;
/**
 * @see https://shields.io/badges/npm-version
 * @see https://shields.io/badges/npm-version-with-dist-tag
 */
export const version = shields.createBadgeHandlers<VersionPathParams, VersionQueryParams>(
  ({ packageName, tag }) => npm('v', packageName, tag),
  [pkgName, optionalTag]
);

/**
 * @see https://shields.io/badges/npm-collaborators
 */
export const collaborators = shields.createBadgeHandlers<
  CollaboratorsPathParams,
  CollaboratorsQueryParams
>(({ packageName }) => npm('collaborators', packageName), pkgName);

/**
 * @see https://shields.io/badges/npm-downloads
 */
export const downloads = shields.createBadgeHandlers<DownloadsPathParams, DownloadsQueryParams>(
  ({ packageName, interval }) => npm(interval, packageName),
  ['interval', pkgName]
);

/**
 * @see https://shields.io/badges/npm-downloads-by-package-author
 */
export const downloadsByAuthor = shields.createBadgeHandlers<
  DownloadsByAuthorPathParams,
  DownloadsByAuthorQueryParams
>(({ author, interval }) => `npm-stat/${interval}/${author}` as const, ['interval', 'author']);

/**
 * @see https://shields.io/badges/js-delivr-hits-npm
 * @see https://shields.io/badges/js-delivr-hits-npm-scoped
 */
export const jsDelivrHits = shields.createBadgeHandlers<
  JsDelivrHitsPathParams,
  JsDelivrHitsQueryParams
>(
  ({ packageName, period }) => `jsdelivr/npm/${period}/${packageName}` as const,
  ['period', pkgName]
);

/**
 * @see https://shields.io/badges/npm-last-update
 * @see https://shields.io/badges/npm-last-update-with-dist-tag
 */
export const lastUpdate = shields.createBadgeHandlers<LastUpdatePathParams, LastUpdateQueryParams>(
  ({ packageName, tag }) => npm('last-update', packageName, tag),
  [pkgName, optionalTag]
);

/**
 * @see https://shields.io/badges/npm-license
 */
export const license = shields.createBadgeHandlers<LicensePathParams, LicenseQueryParams>(
  ({ packageName }) => npm('l', packageName),
  pkgName
);

/**
 * @see https://shields.io/badges/npm-type-definitions
 */
export const typeDefinitions = shields.createBadgeHandlers<
  TypeDefinitionsPathParams,
  TypeDefinitionsQueryParams
>(({ packageName }) => npm('types', packageName), pkgName);

/**
 * @see https://shields.io/badges/npm-unpacked-size
 * @see https://shields.io/badges/npm-unpacked-size-with-version
 */
export const unpackedSize = shields.createBadgeHandlers<
  UnpackedSizePathParams,
  UnpackedSizeQueryParams
>(
  ({ packageName, version }) => npm('unpacked-size', packageName, version),
  [pkgName, optionalVersion]
);

/**
 * @see https://shields.io/badges/npm-prod-dependency-version
 * @see https://shields.io/badges/npm-dev-or-peer-dependency-version
 */
export const dependencyVersion = shields.createBadgeHandlers<
  DependencyVersionPathParams,
  DependencyVersionQueryParams
>(
  ({ packageName, type, dependency }) =>
    npm('dependency-version', packageName, type === 'prod' ? undefined : type, dependency),
  [pkgName, 'type', 'dependency']
);

/**
 * @see https://shields.io/badges/npm-bundle-size-scoped-version
 * @see https://shields.io/badges/npm-bundle-size-scoped
 * @see https://shields.io/badges/npm-bundle-size-version
 * @see https://shields.io/badges/npm-bundle-size
 */
export const bundleSize = shields.createBadgeHandlers<BundleSizePathParams, BundleSizeQueryParams>(
  ({ packageName, version, format }) =>
    `bundlephobia/${format}/${packageName}${version ? `/${version}` : ''}` as const,
  ['format', pkgName, optionalVersion]
);

/**
 * @see https://shields.io/badges/npm-package-minimized-gzipped-size
 * @see https://shields.io/badges/npm-package-minimized-gzipped-size-scoped
 */
export const minGzippedSize = shields.createBadgeHandlers<
  MinGzippedSizePathParams,
  MinGzippedSizeQueryParams
>(({ packageName }) => `bundlejs/size/${packageName}` as const, pkgName);
