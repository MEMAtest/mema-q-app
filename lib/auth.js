// lib/auth.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

// SECURITY: Fail if JWT_SECRET is not configured
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('CRITICAL: JWT_SECRET environment variable must be set in production');
}
// Use a fallback only in development (still log warning)
const SECRET = JWT_SECRET || (() => {
  console.warn('WARNING: Using default JWT secret. Set JWT_SECRET in production!');
  return 'dev-only-secret-do-not-use-in-production';
})();

const COOKIE_NAME = 'mema_auth_token';

// Dummy hash for timing attack prevention (valid bcrypt hash)
const DUMMY_HASH = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.qfP.qW5fq5o5Sq';

// Password hashing
export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// Verify password with timing attack protection
export async function verifyPasswordSafe(password, hashedPassword) {
  // Always perform bcrypt comparison to prevent timing attacks
  const hashToCompare = hashedPassword || DUMMY_HASH;
  const isValid = await bcrypt.compare(password, hashToCompare);
  // Only return true if we had a real hash and it matched
  return hashedPassword ? isValid : false;
}

// JWT token handling
export function createToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
    },
    SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
}

// Cookie handling
export function setAuthCookie(res, token) {
  const cookie = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Secure by default
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  res.setHeader('Set-Cookie', cookie);
}

export function clearAuthCookie(res) {
  const cookie = serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  res.setHeader('Set-Cookie', cookie);
}

export function getTokenFromCookies(req) {
  const cookies = parse(req.headers.cookie || '');
  return cookies[COOKIE_NAME] || null;
}

// Get current user from request
export async function getCurrentUser(req) {
  const token = getTokenFromCookies(req);
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  return decoded;
}

// Validate email format
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength - STRENGTHENED
export function isValidPassword(password) {
  if (!password || password.length < 12) {
    return { valid: false, error: 'Password must be at least 12 characters' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return {
      valid: false,
      error: 'Password must include uppercase, lowercase, number, and special character'
    };
  }

  return { valid: true };
}

// Legacy compatibility - returns boolean
export function isPasswordValid(password) {
  return isValidPassword(password).valid;
}
