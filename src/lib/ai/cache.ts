// ============================================================
// DevLeveler — AI Response Cache
// ============================================================

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

// Clean up expired entries periodically
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of cache) {
      if (now > entry.expiresAt) {
        cache.delete(key);
      }
    }
  }, 60_000); // Every minute
}

/**
 * Generate a cache key from a prompt and provider.
 */
export function cacheKey(provider: string, prompt: string): string {
  // Simple hash for cache key
  let hash = 0;
  const str = `${provider}:${prompt}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `ai:${hash.toString(36)}`;
}

/**
 * Get a cached AI response if available and not expired.
 */
export function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

/**
 * Store an AI response in cache.
 * @param ttlMs Time-to-live in milliseconds (default: 5 minutes)
 */
export function setCached<T>(key: string, data: T, ttlMs: number = 300_000): void {
  startCleanup();
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Clear all cached entries.
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get cache size.
 */
export function cacheSize(): number {
  return cache.size;
}
