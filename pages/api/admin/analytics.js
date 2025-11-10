import prisma from '../../../lib/prisma';
import { requireAdminAuth } from '../../../lib/adminAuth';

export default async function handler(req, res) {
  if (!requireAdminAuth(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
  }

  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [totalLeads, leadsThisWeek, totalResponses, totalQuestions, sessions] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({
        where: {
          createdAt: {
            gte: weekAgo,
          },
        },
      }),
      prisma.userResponse.count(),
      prisma.question.count(),
      prisma.userResponse.groupBy({
        by: ['sessionId'],
        _count: {
          questionId: true,
        },
      }),
    ]);

    let averageCompletionRate = 0;
    if (totalQuestions > 0 && sessions.length > 0) {
      const totalPercent = sessions.reduce((sum, session) => {
        const completed = session._count.questionId;
        return sum + Math.min((completed / totalQuestions) * 100, 100);
      }, 0);
      averageCompletionRate = Math.round(totalPercent / sessions.length);
    }

    return res.status(200).json({
      success: true,
      totalLeads,
      leadsThisWeek,
      totalResponses,
      averageCompletionRate,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
}
