// ============================================================
// DevLeveler — Server Action Error Handler
// ============================================================

import type { ApiResponse } from "@/types";
import {
  AppError,
  UnauthorizedError,
  ValidationError,
  logError,
} from "@/lib/errors";
import { RateLimitError as LimiterRateLimitError } from "@/lib/rate-limit";

/**
 * Wrap a server action with standardized error handling.
 * Catches all errors and returns a typed ApiResponse.
 *
 * Usage:
 * ```ts
 * export async function myAction(input: string): Promise<ApiResponse<Result>> {
 *   return handleAction(async () => {
 *     // ... your logic
 *     return result;
 *   }, "myAction");
 * }
 * ```
 */
export async function handleAction<T>(
  fn: () => Promise<T>,
  context?: string
): Promise<ApiResponse<T>> {
  try {
    const result = await fn();
    return { success: true, data: result };
  } catch (error) {
    return handleError(error, context);
  }
}

/**
 * Convert any error into a standardized ApiResponse error.
 */
export function handleError(error: unknown, context?: string): ApiResponse<never> {
  // Log the error for debugging
  logError(error, context);

  // Rate limit errors from our rate limiter
  if (error instanceof LimiterRateLimitError) {
    return {
      success: false,
      error: error.message,
      code: "RATE_LIMITED",
    };
  }

  // App errors (our custom error classes)
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }

  // Validation errors from Zod or manual validation
  if (error instanceof Error) {
    const message = error.message;

    // AI-related errors
    if (message.includes("parse") || message.includes("JSON")) {
      return {
        success: false,
        error: "Failed to process AI response. Please try again.",
        code: "AI_PARSE_ERROR",
      };
    }
    if (message.includes("timeout") || message.includes("Timeout")) {
      return {
        success: false,
        error: "Request timed out. Please try again.",
        code: "TIMEOUT",
      };
    }
    if (message.includes("ECONNREFUSED") || message.includes("ENOTFOUND")) {
      return {
        success: false,
        error: "External service is temporarily unavailable.",
        code: "EXTERNAL_SERVICE_ERROR",
      };
    }
  }

  // Unknown errors — never expose internals
  return {
    success: false,
    error: "An unexpected error occurred. Please try again.",
    code: "INTERNAL_ERROR",
  };
}

/**
 * Assert that a user is authenticated. Throws UnauthorizedError if not.
 */
export function assertAuth(userId: string | undefined): asserts userId is string {
  if (!userId) {
    throw new UnauthorizedError();
  }
}

/**
 * Assert that a value is not null/undefined. Throws ValidationError if not.
 */
export function assertExists<T>(
  value: T | null | undefined,
  name: string
): asserts value is T {
  if (value === null || value === undefined) {
    throw new ValidationError(`${name} not found.`, name);
  }
}

/**
 * Assert that a condition is true. Throws ValidationError if not.
 */
export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new ValidationError(message);
  }
}
