// lib/adminAuth.js
import crypto from 'crypto';

export function requireAdminAuth(req) {
  const token = process.env.ADMIN_API_KEY;
  const header = req.headers.authorization;

  if (!token) {
    console.error('CRITICAL: ADMIN_API_KEY is not configured');
    return false;
  }

  if (!header || !header.startsWith('Bearer ')) {
    return false;
  }

  const providedToken = header.slice(7); // Remove 'Bearer ' prefix

  // Use constant-time comparison to prevent timing attacks
  try {
    const expectedBuffer = Buffer.from(token, 'utf-8');
    const providedBuffer = Buffer.from(providedToken, 'utf-8');

    // If lengths differ, still do comparison to maintain constant time
    if (expectedBuffer.length !== providedBuffer.length) {
      // Compare with self to maintain timing, then return false
      crypto.timingSafeEqual(expectedBuffer, expectedBuffer);
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
  } catch (error) {
    // In case of any error, return false safely
    return false;
  }
}
