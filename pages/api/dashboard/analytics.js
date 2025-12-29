// pages/api/dashboard/analytics.js
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get all assessments
    const assessments = await prisma.assessment.findMany({
      where: { userId: user.userId },
      orderBy: { completedAt: 'asc' },
    });

    const totalAssessments = assessments.length;

    if (totalAssessments === 0) {
      return res.status(200).json({
        totalAssessments: 0,
        averageScore: 0,
        improvementRate: 0,
        thisMonth: 0,
        scoreTrend: [],
        byScenario: {},
        riskDistribution: { low: 0, medium: 0, high: 0 },
        tips: [],
      });
    }

    // Calculate average score
    const averageScore = Math.round(
      assessments.reduce((sum, a) => sum + a.score, 0) / totalAssessments
    );

    // Calculate improvement rate (compare first half to second half)
    let improvementRate = 0;
    if (totalAssessments >= 2) {
      const midpoint = Math.floor(totalAssessments / 2);
      const firstHalfAvg =
        assessments.slice(0, midpoint).reduce((sum, a) => sum + a.score, 0) / midpoint;
      const secondHalfAvg =
        assessments.slice(midpoint).reduce((sum, a) => sum + a.score, 0) /
        (totalAssessments - midpoint);
      improvementRate = Math.round(secondHalfAvg - firstHalfAvg);
    }

    // This month count
    const thisMonth = assessments.filter((a) => {
      const date = new Date(a.completedAt);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      );
    }).length;

    // Score trend by month (last 12 months)
    const scoreTrend = [];
    const monthlyScores = {};

    assessments.forEach((a) => {
      const date = new Date(a.completedAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyScores[monthKey]) {
        monthlyScores[monthKey] = { total: 0, count: 0 };
      }
      monthlyScores[monthKey].total += a.score;
      monthlyScores[monthKey].count += 1;
    });

    Object.keys(monthlyScores)
      .sort()
      .forEach((key) => {
        const [year, month] = key.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        scoreTrend.push({
          month: monthNames[parseInt(month) - 1],
          score: Math.round(monthlyScores[key].total / monthlyScores[key].count),
        });
      });

    // Assessments by scenario
    const byScenario = {};
    assessments.forEach((a) => {
      const label = a.scenarioLabel || a.scenarioId;
      byScenario[label] = (byScenario[label] || 0) + 1;
    });

    // Risk distribution
    const riskDistribution = { low: 0, medium: 0, high: 0 };
    assessments.forEach((a) => {
      const risk = a.riskLevel?.toLowerCase();
      if (risk && riskDistribution[risk] !== undefined) {
        riskDistribution[risk] += 1;
      }
    });

    // Generate tips based on data
    const tips = [];

    if (averageScore < 60) {
      tips.push(
        'Focus on including clear risk warnings in all promotions - this is a key FCA requirement.'
      );
    }

    if (riskDistribution.high > riskDistribution.low) {
      tips.push(
        'Many of your assessments show high risk. Consider reviewing FCA COBS 4 guidelines for financial promotions.'
      );
    }

    if (improvementRate > 0) {
      tips.push(
        `Great progress! Your compliance scores have improved by ${improvementRate}% on average.`
      );
    } else if (improvementRate < -5) {
      tips.push(
        'Your recent scores are lower than before. Consider refreshing your knowledge of FCA promotion rules.'
      );
    }

    if (totalAssessments < 5) {
      tips.push(
        'Keep using the assessment tool regularly to build a comprehensive compliance history.'
      );
    }

    if (Object.keys(byScenario).length === 1) {
      tips.push(
        'Try assessing different promotion types (social media, email, website) to ensure compliance across all channels.'
      );
    }

    return res.status(200).json({
      totalAssessments,
      averageScore,
      improvementRate,
      thisMonth,
      scoreTrend,
      byScenario,
      riskDistribution,
      tips,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
