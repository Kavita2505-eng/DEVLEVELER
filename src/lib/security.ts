// ============================================================
// DevLeveler — Security Utilities
// ============================================================

/**
 * Sanitize text input by removing potentially dangerous content.
 * Strips HTML tags, script injection, and normalizes whitespace.
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

/**
 * Sanitize a URL to prevent XSS and SSRF.
 * Only allows http/https protocols.
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Invalid protocol");
    }
    return parsed.toString();
  } catch {
    throw new Error("Invalid URL format");
  }
}

/**
 * Sanitize email address.
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Validate that a string is safe to use in AI prompts.
 * Prevents prompt injection attacks.
 */
export function sanitizeForAI(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/```/g, "") // Remove code block markers
    .replace(/system:/gi, "") // Remove system: prefix attempts
    .replace(/instruction:/gi, "") // Remove instruction: prefix attempts
    .replace(/\n{3,}/g, "\n\n") // Limit consecutive newlines
    .trim()
    .slice(0, 5000); // Limit length to prevent token abuse
}

/**
 * Check for duplicate submission using a simple in-memory set.
 * Returns true if this is a duplicate.
 */
const recentSubmissions = new Map<string, number>();

export function isDuplicateSubmission(
  key: string,
  cooldownMs: number = 5000
): boolean {
  const now = Date.now();
  const lastSubmission = recentSubmissions.get(key);

  if (lastSubmission && now - lastSubmission < cooldownMs) {
    return true;
  }

  recentSubmissions.set(key, now);

  // Cleanup old entries periodically
  if (recentSubmissions.size > 1000) {
    for (const [k, v] of recentSubmissions) {
      if (now - v > 60_000) {
        recentSubmissions.delete(k);
      }
    }
  }

  return false;
}

/**
 * Generate a safe error message that doesn't expose internals.
 */
export function safeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Don't expose stack traces or internal details
    const message = error.message;
    if (message.includes("ENOTFOUND") || message.includes("ECONNREFUSED")) {
      return "External service is temporarily unavailable. Please try again later.";
    }
    if (message.includes("timeout") || message.includes("Timeout")) {
      return "Request timed out. Please try again.";
    }
    if (message.includes("rate limit") || message.includes("Rate limit")) {
      return message; // Rate limit messages are user-friendly
    }
    // Generic fallback
    return "An unexpected error occurred. Please try again.";
  }
  return "An unexpected error occurred. Please try again.";
}

/**
 * Validate input length to prevent abuse.
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): void {
  if (value.length < min) {
    throw new Error(`${fieldName} must be at least ${min} characters`);
  }
  if (value.length > max) {
    throw new Error(`${fieldName} must be no more than ${max} characters`);
  }
}
