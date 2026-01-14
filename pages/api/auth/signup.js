// pages/api/auth/signup.js
import prisma from '../../../lib/prisma';
import { hashPassword, createToken, setAuthCookie, isValidEmail, isValidPassword } from '../../../lib/auth';
import { checkRateLimit, getClientIP, RATE_LIMIT_CONFIGS } from '../../../lib/rateLimit';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting check
  const clientIP = getClientIP(req);
  const { maxRequests, windowMs } = RATE_LIMIT_CONFIGS.signup;

  if (!checkRateLimit(`signup:${clientIP}`, maxRequests, windowMs)) {
    return res.status(429).json({
      error: 'Too many registration attempts. Please try again later.'
    });
  }

  try {
    const { email, password, name, company } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Server-side password validation (strengthened)
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      // SECURITY: Return generic success to prevent user enumeration
      // Attacker cannot determine if email is already registered
      return res.status(201).json({
        success: true,
        message: 'Account created successfully. Please check your email.'
      });
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name: name || null,
        company: company || null,
      },
    });

    // Create JWT token and set cookie
    const token = createToken(user);
    setAuthCookie(res, token);

    // Return user data (without password)
    return res.status(201).json({
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
      console.error('Signup error:', error);
    }
    return res.status(500).json({ error: 'Failed to create account' });
  }
}
