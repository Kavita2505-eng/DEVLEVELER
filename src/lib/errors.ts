// ============================================================
// DevLeveler — Standard Error Classes
// ============================================================

/**
 * Base application error. All custom errors extend this.
 */
export class AppError extends Error {
  code: string;
  statusCode: number;
  isOperational: boolean;

  constructor(
    message: string,
    code: string = "INTERNAL_ERROR",
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

/**
 * Authentication required but not provided.
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access. Please log in.") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "UnauthorizedError";
  }
}

/**
 * Authenticated but not authorized for this action.
 */
export class ForbiddenError extends AppError {
  constructor(message: string = "You do not have permission to perform this action.") {
    super(message, "FORBIDDEN", 403);
    this.name = "ForbiddenError";
  }
}

/**
 * Resource not found.
 */
export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found.`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

/**
 * Input validation failed.
 */
export class ValidationError extends AppError {
  field?: string;

  constructor(message: string, field?: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
    this.field = field;
  }
}

/**
 * Rate limit exceeded.
 */
export class RateLimitError extends AppError {
  retryAfterMs: number;

  constructor(message: string = "Too many requests. Please try again later.", retryAfterMs: number = 60000) {
    super(message, "RATE_LIMITED", 429);
    this.name = "RateLimitError";
    this.retryAfterMs = retryAfterMs;
  }
}

/**
 * External service (AI, GitHub API, etc.) failed.
 */
export class ExternalServiceError extends AppError {
  service: string;

  constructor(service: string, message?: string) {
    super(
      message || `${service} is temporarily unavailable. Please try again later.`,
      "EXTERNAL_SERVICE_ERROR",
      502
    );
    this.name = "ExternalServiceError";
    this.service = service;
  }
}

/**
 * AI-specific errors (prompt injection, parse failure, timeout).
 */
export class AIError extends AppError {
  constructor(message: string, code: string = "AI_ERROR") {
    super(message, code, 500);
    this.name = "AIError";
  }
}

/**
 * AI response could not be parsed as JSON.
 */
export class AIParseError extends AIError {
  constructor(message: string = "Failed to parse AI response. Please try again.") {
    super(message, "AI_PARSE_ERROR");
    this.name = "AIParseError";
  }
}

/**
 * AI request timed out.
 */
export class AITimeoutError extends AIError {
  constructor(timeoutMs: number = 30000) {
    super(`AI request timed out after ${timeoutMs}ms. Please try again.`, "AI_TIMEOUT");
    this.name = "AITimeoutError";
  }
}

/**
 * Database operation failed.
 */
export class DatabaseError extends AppError {
  constructor(message: string = "A database error occurred. Please try again.") {
    super(message, "DATABASE_ERROR", 500);
    this.name = "DatabaseError";
  }
}

// ---------------------------------------------------------------------------
// Error utilities
// ---------------------------------------------------------------------------

/**
 * Check if an error is operational (expected) vs programming error.
 */
export function isOperationalError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Convert any error to a safe, user-friendly message.
 * Never exposes stack traces or internal details.
 */
export function toSafeErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes("enotfound") || message.includes("econnrefused")) {
      return "External service is temporarily unavailable. Please try again later.";
    }
    if (message.includes("timeout")) {
      return "Request timed out. Please try again.";
    }
    if (message.includes("econnreset")) {
      return "Connection was reset. Please try again.";
    }
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Extract error code from an error object.
 */
export function getErrorCode(error: unknown): string {
  if (error instanceof AppError) {
    return error.code;
  }
  return "INTERNAL_ERROR";
}

/**
 * Log error for debugging (server-side only).
 */
export function logError(error: unknown, context?: string): void {
  const prefix = context ? `[${context}]` : "[ERROR]";
  if (error instanceof AppError) {
    console.error(`${prefix} ${error.code}: ${error.message}`);
    if (!error.isOperational && error.stack) {
      console.error(error.stack);
    }
  } else if (error instanceof Error) {
    console.error(`${prefix} ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
  } else {
    console.error(`${prefix} Unknown error:`, error);
  }
}
