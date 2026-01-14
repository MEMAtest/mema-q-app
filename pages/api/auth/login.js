// pages/api/auth/login.js
import prisma from '../../../lib/prisma';
import { verifyPasswordSafe, createToken, setAuthCookie, isValidEmail } from '../../../lib/auth';
import { checkRateLimit, getClientIP, RATE_LIMIT_CONFIGS } from '../../../lib/rateLimit';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting check
  const clientIP = getClientIP(req);
  const { maxRequests, windowMs } = RATE_LIMIT_CONFIGS.login;

  if (!checkRateLimit(`login:${clientIP}`, maxRequests, windowMs)) {
    return res.status(429).json({
      error: 'Too many login attempts. Please try again in 15 minutes.'
    });
  }

  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // SECURITY: Use timing-safe password verification
    // This prevents timing attacks that could reveal if an email exists
    const isValid = await verifyPasswordSafe(password, user?.passwordHash);

    if (!user || !isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT token and set cookie
    const token = createToken(user);
    setAuthCookie(res, token);

    // Return user data (without password)
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
      },
    });
  } catch (error) {
    // Log error only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Login error:', error);
    }
    return res.status(500).json({ error: 'Failed to log in' });
  }
}
