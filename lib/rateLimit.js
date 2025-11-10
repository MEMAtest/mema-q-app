const buckets = new Map();

export function checkRateLimit(identifier = 'anon', maxRequests = 10, windowMs = 60_000) {
  const now = Date.now();
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
