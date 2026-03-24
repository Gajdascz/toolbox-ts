/**
 * pnpm request / network / TLS configuration.
 * Controls how pnpm communicates with registries and Git hosts.
 */
export interface Requests {
  /**
   * Certificate Authority certificates trusted for SSL connections.
   * Accepts a single PEM string, an array of PEM strings, or null.
   *
   * @see https://pnpm.io/settings#ca
   */
  ca?: null | string | string[];

  /**
   * Path to a file containing one or more CA certificates.
   *
   * @see https://pnpm.io/settings#cafile
   */
  cafile?: null | string;

  /*
   * <URL>:cafile
   * Registry-scoped CA file.
   * @see https://pnpm.io/settings#cafile
   */

  /*
   * <URL>:ca
   * Registry-scoped inline CA certificate.
   * @see https://pnpm.io/settings#ca
   */

  /**
   * Inline client certificate (PEM-encoded).
   *
   * @see https://pnpm.io/settings#cert
   */
  cert?: null | string;

  /*
   * <URL>:cert
   * Registry-scoped inline client certificate.
   * @see https://pnpm.io/settings#cert
   */

  /*
   * <URL>:certfile
   * Registry-scoped client certificate file path.
   * @see https://pnpm.io/settings#cert
   */

  /**
   * Warn if download speed drops below this threshold (KiB/s).
   *
   * @see https://pnpm.io/settings#fetchminspeedkibps
   */
  fetchMinSpeedKiBps?: number;

  /*
   * <URL>:key
   * Registry-scoped inline private key.
   * @see https://pnpm.io/settings#key
   */

  /*
   * <URL>:keyfile
   * Registry-scoped private key file path.
   * @see https://pnpm.io/settings#key
   */

  /**
   * Number of retries for registry fetches.
   *
   * @see https://pnpm.io/settings#fetchretries
   */
  fetchRetries?: number;

  /**
   * Exponential backoff factor for retries.
   *
   * @see https://pnpm.io/settings#fetchretryfactor
   */
  fetchRetryFactor?: number;

  /**
   * Maximum retry timeout in milliseconds.
   *
   * @see https://pnpm.io/settings#fetchretrymaxtimeout
   */
  fetchRetryMaxTimeout?: number;

  /**
   * Minimum retry timeout in milliseconds.
   *
   * @see https://pnpm.io/settings#fetchretrymintimeout
   */
  fetchRetryMinTimeout?: number;

  /**
   * Maximum time to wait for an HTTP request to complete.
   *
   * @see https://pnpm.io/settings#fetchtimeout
   */
  fetchTimeout?: number;

  /**
   * Warn if metadata requests exceed this duration (ms).
   *
   * @see https://pnpm.io/settings#fetchwarntimeoutms
   */
  fetchWarnTimeoutMs?: number;

  /**
   * Git hosts for which shallow cloning is used.
   *
   * @see https://pnpm.io/settings#gitshallowhosts
   */
  gitShallowHosts?: string[];

  /**
   * HTTPS proxy URL.
   *
   * @see https://pnpm.io/settings#https-proxy
   */
  httpsProxy?: null | string;

  /**
   * Inline client private key (PEM-encoded).
   *
   * Sensitive: should not be committed.
   *
   * @see https://pnpm.io/settings#key
   */
  key?: null | string;

  /**
   * Local network interface IP to bind outgoing connections to.
   *
   * @see https://pnpm.io/settings#local-address
   */
  localAddress?: string;

  /**
   * Maximum concurrent connections per origin.
   *
   * @see https://pnpm.io/settings#maxsockets
   */
  maxSockets?: number;

  /**
   * Maximum number of concurrent HTTP(S) requests.
   *
   * @see https://pnpm.io/settings#networkconcurrency
   */
  networkConcurrency?: number;

  /**
   * Comma-separated list of domains that should bypass proxying.
   *
   * @see https://pnpm.io/settings#noproxy
   */
  noProxy?: null | string;

  /**
   * HTTP proxy URL.
   *
   * @see https://pnpm.io/settings#proxy
   */
  proxy?: null | string;

  /**
   * Enable or disable SSL certificate validation.
   *
   * @see https://pnpm.io/settings#strict-ssl
   */
  strictSsl?: boolean;
}
