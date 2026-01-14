// lib/rateLimit.js
// In-memory rate limiting with memory safety

const buckets = new Map();
const MAX_BUCKETS = 10000; // Prevent memory exhaustion

// Rate limit configurations
export const RATE_LIMIT_CONFIGS = {
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 per 15 minutes
  signup: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  api: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 per minute
  leads: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per minute
  saveProgress: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 per minute
};

// Cleanup old entries periodically
function cleanupOldEntries() {
  const now = Date.now();
  for (const [key, entry] of buckets.entries()) {
    if (now > entry.reset) {
      buckets.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupOldEntries, 5 * 60 * 1000);
}

export function checkRateLimit(identifier = 'anon', maxRequests = 10, windowMs = 60_000) {
  const now = Date.now();

  // Memory safety: cleanup if too many buckets
  if (buckets.size > MAX_BUCKETS) {
    cleanupOldEntries();
    // If still too many after cleanup, reject (DoS protection)
    if (buckets.size > MAX_BUCKETS) {
      return false;
    }
  }

  const entry = buckets.get(identifier);

  if (!entry || now > entry.reset) {
    buckets.set(identifier, { count: 1, reset: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count += 1;
  return true;
}

// Get rate limit info for headers
export function getRateLimitInfo(identifier) {
  const entry = buckets.get(identifier);
  if (!entry) {
    return { remaining: null, resetTime: null };
  }
  return {
    remaining: Math.max(0, entry.maxRequests - entry.count),
    resetTime: entry.reset,
  };
}

// Get client IP from request
export function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.connection?.remoteAddress || 'unknown';
}
