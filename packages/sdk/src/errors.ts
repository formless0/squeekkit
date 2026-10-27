export type ErrorCode =
  | 'INVALID_INPUT'
  | 'WRONG_CHAIN'
  | 'DEPLOYMENT_MISMATCH'
  | 'REORG'
  | 'STALE_SNAPSHOT'
  | 'RPC_ERROR'
  | 'SIMULATION_FAILED'
  | 'NOT_OWNER'
  | 'APPROVAL_REQUIRED'
  | 'NOT_MERGEABLE'
  | 'API_HTTP'
  | 'API_TIMEOUT'
  | 'API_SCHEMA'
  | 'API_UNAVAILABLE'
  | 'API_DEPLOYMENT_MISMATCH'
  | 'PAGINATION_LIMIT';
export class SqueekKitError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = 'SqueekKitError';
  }
}
export function publicError(error: unknown) {
  if (error instanceof SqueekKitError)
    return { code: error.code, message: error.message, details: error.details };
  // Provider errors can contain API keys embedded in URLs, headers or calldata.
  return {
    code: 'RPC_ERROR',
    message: 'The read could not be completed. Check provider availability and retry.',
    details: {},
  };
}
export function requireInput(condition: unknown, message: string): asserts condition {
  if (!condition) throw new SqueekKitError('INVALID_INPUT', message);
}
