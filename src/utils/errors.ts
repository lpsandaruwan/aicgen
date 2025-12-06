export class AicgenError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ProjectNotFoundError extends AicgenError {
  constructor(path: string) {
    super(`Project not found at: ${path}`, 'PROJECT_NOT_FOUND', { path });
  }
}

export class ConfigExistsError extends AicgenError {
  constructor(path: string) {
    super(
      `Configuration already exists at: ${path}. Use --force to overwrite.`,
      'CONFIG_EXISTS',
      { path }
    );
  }
}

export class AIProviderError extends AicgenError {
  constructor(message: string, provider: string) {
    super(`AI Provider Error (${provider}): ${message}`, 'AI_PROVIDER_ERROR', { provider });
  }
}
