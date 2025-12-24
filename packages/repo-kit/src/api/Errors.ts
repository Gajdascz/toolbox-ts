/* c8 ignore start */
export class RepoKitError extends Error {
  constructor(domain: string, message?: string) {
    super(`[@toolbox-ts/repo-kit][${domain}] ${message ?? 'Error'}`);
    this.name = `RepoKit${domain}Error`;
  }
}

export class DependencyError extends RepoKitError {
  constructor(message?: string) {
    super('Dependency', message);
  }
}

export class OperationError extends RepoKitError {
  constructor(message?: string) {
    super('Operation', message);
  }
}

/* c8 ignore end */
