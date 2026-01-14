// pages/api/auth/me.js
import prisma from '../../../lib/prisma';
import { getCurrentUser } from '../../../lib/auth';

export default async function handler(req, res) {
  // Always return JSON
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const decoded = await getCurrentUser(req);

    if (!decoded) {
      return res.status(200).json({ user: null });
    }

    // Fetch full user data from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        createdAt: true,
        _count: {
          select: {
            assessments: true,
            savedPromotions: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(200).json({ user: null });
    }

    return res.status(200).json({
      user: {
        ...user,
        assessmentCount: user._count.assessments,
        promotionCount: user._count.savedPromotions,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    // Always return JSON even on error
    return res.status(500).json({ error: 'Failed to get user', user: null });
  }
}
