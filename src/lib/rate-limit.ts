// ============================================================
// DevLeveler — Rate Limiter
// ============================================================
//
// In-memory sliding window rate limiter.
// Safe for single-instance deployments.
// For multi-instance, swap the Map for Redis.

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Periodic cleanup to prevent memory leaks
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      // Remove entries older than the longest possible window (1 hour)
      entry.timestamps = entry.timestamps.filter((t) => now - t < 3_600_000);
      if (entry.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, 60_000);
}

// ---------------------------------------------------------------------------
// Core rate limiter
// ---------------------------------------------------------------------------

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Window size in milliseconds (default: 1 hour) */
  windowMs?: number;
  /** Optional key prefix to namespace limits */
  prefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
  total: number;
}

/**
 * Check rate limit for a given key.
 * Uses a sliding window counter approach.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  startCleanup();

  const { maxRequests, windowMs = 3_600_000, prefix = "rl" } = config;
  const fullKey = `${prefix}:${key}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  let entry = store.get(fullKey);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(fullKey, entry);
  }

  // Remove timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  const currentCount = entry.timestamps.length;

  if (currentCount >= maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfterMs = oldestInWindow + windowMs - now;

    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(0, retryAfterMs),
      total: maxRequests,
    };
  }

  // Record this request
  entry.timestamps.push(now);

  return {
    allowed: true,
    remaining: maxRequests - currentCount - 1,
    retryAfterMs: 0,
    total: maxRequests,
  };
}

/**
 * Convenience wrapper that throws if rate limited.
 * Use at the top of server actions.
 */
export function enforceRateLimit(
  key: string,
  config: RateLimitConfig
): void {
  const result = checkRateLimit(key, config);
  if (!result.allowed) {
    const retrySeconds = Math.ceil(result.retryAfterMs / 1000);
    throw new RateLimitError(
      `Too many requests. Please try again in ${retrySeconds} seconds.`,
      result.retryAfterMs
    );
  }
}

// ---------------------------------------------------------------------------
// Rate Limit Error
// ---------------------------------------------------------------------------

export class RateLimitError extends Error {
  retryAfterMs: number;

  constructor(message: string, retryAfterMs: number) {
    super(message);
    this.name = "RateLimitError";
    this.retryAfterMs = retryAfterMs;
  }
}

// ---------------------------------------------------------------------------
// Preset configurations for different action types
// ---------------------------------------------------------------------------

export const RATE_LIMITS = {
  /** AI-heavy actions (Gemini calls): 5 per user per hour */
  aiAnalysis: {
    maxRequests: 5,
    windowMs: 3_600_000,
    prefix: "rl:ai",
  },

  /** Analysis actions (GitHub, Resume, Portfolio, Project): 3 per user per hour */
  analysis: {
    maxRequests: 3,
    windowMs: 3_600_000,
    prefix: "rl:analysis",
  },

  /** Settings/Profile updates: 10 per user per hour */
  settings: {
    maxRequests: 10,
    windowMs: 3_600_000,
    prefix: "rl:settings",
  },

  /** Auth actions: 5 per IP per 15 minutes */
  auth: {
    maxRequests: 5,
    windowMs: 900_000,
    prefix: "rl:auth",
  },

  /** Contact form: 3 per email per hour */
  contact: {
    maxRequests: 3,
    windowMs: 3_600_000,
    prefix: "rl:contact",
  },

  /** Read-only actions: 30 per user per hour (generous) */
  readOnly: {
    maxRequests: 30,
    windowMs: 3_600_000,
    prefix: "rl:read",
  },
} as const;

// ---------------------------------------------------------------------------
// Helper: get client identifier
// ---------------------------------------------------------------------------

/**
 * Generate a rate limit key from user ID and action.
 */
export function rateLimitKey(userId: string, action: string): string {
  return `${userId}:${action}`;
}

/**
 * Generate a rate limit key from IP and action.
 * Uses forwarded header for proxied deployments.
 */
export function ipRateLimitKey(action: string, ip?: string): string {
  return `${ip || "unknown"}:${action}`;
}
