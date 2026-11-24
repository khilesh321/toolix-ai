/**
 * Simple in-memory sliding-window rate limiter keyed by userId.
 * Used to cap chat LLM calls (and downstream paid tools) per user.
 *
 * NOTE: This is per-process and resets on cold start / redeploy.
 * For multi-instance deployments, swap the Map for a shared store
 * (e.g. Upstash Redis / Vercel KV) without changing the call-site API.
 */

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

type Bucket = {
  /** Timestamps (ms) of requests that still count toward the limit. */
  hits: number[];
};

const buckets = new Map<string, Bucket>();

// Periodically drop idle buckets so the map doesn't grow forever.
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;
let lastSweepAt = 0;

function sweep(now: number) {
  if (now - lastSweepAt < SWEEP_INTERVAL_MS) return;
  lastSweepAt = now;
  for (const [key, bucket] of buckets) {
    bucket.hits = bucket.hits.filter((t) => now - t < WINDOW_MS);
    if (bucket.hits.length === 0) {
      buckets.delete(key);
    }
  }
}

export type RateLimitResult = {
  allowed: boolean;
  /** How many requests the key can still make in the current window. */
  remaining: number;
  /** Seconds until the window resets (for Retry-After). */
  retryAfterSeconds: number;
};

export function rateLimitChat(key: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < WINDOW_MS);

  if (bucket.hits.length >= MAX_REQUESTS_PER_WINDOW) {
    buckets.set(key, bucket);
    const oldest = bucket.hits[0];
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + WINDOW_MS - now) / 1000),
    );
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);

  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - bucket.hits.length,
    retryAfterSeconds: 0,
  };
}
