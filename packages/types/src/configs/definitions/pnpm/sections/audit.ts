/**
 * pnpm audit settings.
 */
export interface Audit {
  auditConfig?: {
    /**
     * CVE identifiers to ignore during audit checks.
     * @see {@link https://pnpm.io/settings#auditconfigignorecves}
     */
    ignoreCves?: string[];
    /**
     * GitHub Security Advisory identifiers to ignore during audit checks.
     * @see {@link https://pnpm.io/settings#auditconfigignoreghsas}
     */
    ignoreGhsas?: string[];
  };
}
