import type { QueryParams } from '../../shields-io.js';

export type WithPackageName<P = {}> = P & { packageName: string };
export type WithRegistryUri<P = {}> = P & { registryUri?: string };

//#region> BundleSize
export type BundleSizeFormat = 'min' | 'minzip';
export type BundleSizePathParams = WithPackageName<{ format: BundleSizeFormat; version?: string }>;
export type BundleSizeQueryParams = WithRegistryUri<QueryParams>;
//#endregion

//#region> Collaborators
export type CollaboratorsPathParams = WithPackageName;
export type CollaboratorsQueryParams = WithRegistryUri<QueryParams>;
//#endregion

//#region> DependencyVersion
export type DependencyVersionType = 'prod' | 'dev' | 'peer';
export type DependencyVersionPathParams = WithPackageName<{
  dependency: string;
  type: DependencyVersionType;
}>;
export type DependencyVersionQueryParams = WithRegistryUri<QueryParams>;
//#endregion

//#region> Downloads
export type DownloadsInterval = 'dw' | 'dm' | 'dy' | 'd18m';
export type DownloadsPathParams = WithPackageName<{ interval: DownloadsInterval }>;
export type DownloadsQueryParams = QueryParams;
//#endregion

//#region> DownloadsByAuthor
export type DownloadsByAuthorInterval = 'dw' | 'dm' | 'dy';
export type DownloadsByAuthorPathParams = { interval: DownloadsByAuthorInterval; author: string };
export type DownloadsByAuthorQueryParams = QueryParams;
//#endregion

//#region> JsDelivrHits
export type JsDelivrHitsPeriod = 'hd' | 'hw' | 'hm' | 'hy';
export type JsDelivrHitsPathParams = WithPackageName<{ period: JsDelivrHitsPeriod }>;
export type JsDelivrHitsQueryParams = WithRegistryUri<QueryParams>;
//#endregion

//#region> LastUpdate
export type LastUpdatePathParams = WithPackageName<{ tag?: string }>;
export type LastUpdateQueryParams = WithRegistryUri<QueryParams>;
//#endregion

//#region> License
export type LicensePathParams = WithPackageName;
export type LicenseQueryParams = WithRegistryUri<QueryParams>;
//#endregion

//#region> MinGzipped
export type MinGzippedSizePathParams = WithPackageName;
export type MinGzippedSizeQueryParams = QueryParams<{
  exports?: string;
  externals?: string;
  format?: 'min' | 'minzip' | 'both';
}>;
//#endregion

//#region> TypeDefinitions
export type TypeDefinitionsPathParams = WithPackageName;
export type TypeDefinitionsQueryParams = WithRegistryUri<QueryParams>;
//#endregion

//#region> UnpackedSize
export type UnpackedSizePathParams = WithPackageName<{ version?: string }>;
export type UnpackedSizeQueryParams = WithRegistryUri<QueryParams>;
//#endregion

//#region> Version
export type VersionPathParams = WithPackageName<{ tag?: string }>;
export type VersionQueryParams = WithRegistryUri<QueryParams>;
//#endregion
