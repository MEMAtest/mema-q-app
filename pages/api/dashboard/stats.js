// pages/api/dashboard/stats.js
import prisma from '../../../lib/prisma';
import { getCurrentUser } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get all user stats
    const [
      totalAssessments,
      savedPromotions,
      assessments,
      thisMonthAssessments,
    ] = await Promise.all([
      prisma.assessment.count({
        where: { userId: user.userId },
      }),
      prisma.savedPromotion.count({
        where: { userId: user.userId },
      }),
      prisma.assessment.findMany({
        where: { userId: user.userId },
        select: { score: true },
      }),
      prisma.assessment.count({
        where: {
          userId: user.userId,
          completedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    // Calculate average score
    const averageScore =
      assessments.length > 0
        ? Math.round(
            assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length
          )
        : 0;

    return res.status(200).json({
      totalAssessments,
      savedPromotions,
      averageScore,
      thisMonth: thisMonthAssessments,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
