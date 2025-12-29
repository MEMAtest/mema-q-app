// pages/api/dashboard/assessments.js
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      const { limit } = req.query;

      const assessments = await prisma.assessment.findMany({
        where: { userId: user.userId },
        orderBy: { completedAt: 'desc' },
        take: limit ? parseInt(limit) : undefined,
      });

      return res.status(200).json({ assessments });
    }

    if (req.method === 'POST') {
      const { scenarioId, scenarioLabel, answers, score, riskLevel } = req.body;

      if (!scenarioId || score === undefined || !riskLevel) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const assessment = await prisma.assessment.create({
        data: {
          userId: user.userId,
          scenarioId,
          scenarioLabel: scenarioLabel || scenarioId,
          answers: answers || {},
          score: parseInt(score),
          riskLevel,
        },
      });

      return res.status(201).json({ assessment });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: 'Assessment ID required' });
      }

      // Verify ownership
      const assessment = await prisma.assessment.findUnique({
        where: { id },
      });

      if (!assessment) {
        return res.status(404).json({ message: 'Assessment not found' });
      }

      if (assessment.userId !== user.userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      await prisma.assessment.delete({
        where: { id },
      });

      return res.status(200).json({ message: 'Assessment deleted' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Assessments API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
