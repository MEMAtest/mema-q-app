import prisma from '../../lib/prisma';
import { checkRateLimit } from '../../lib/rateLimit';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { sessionId, answers } = req.body;

  if (!sessionId) {
    return res.status(400).json({ success: false, message: 'Session ID required' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(`${ip}-${sessionId}`, 30, 60_000)) {
    return res.status(429).json({ success: false, message: 'Too many save attempts. Please wait a moment.' });
  }

  try {
    if (answers && typeof answers === 'object') {
      const upserts = Object.entries(answers).map(([questionId, answerData]) =>
        prisma.userResponse.upsert({
          where: {
            sessionId_questionId: {
              sessionId,
              questionId,
            },
          },
          update: {
            answer: answerData.answer,
            notes: answerData.notes,
          },
          create: {
            sessionId,
            questionId,
            answer: answerData.answer,
            notes: answerData.notes,
          },
        })
      );

      await Promise.all(upserts);
    }

    return res.status(200).json({ success: true, message: 'Progress saved' });
  } catch (error) {
    console.error('Error saving progress:', error);
    return res.status(500).json({ success: false, message: 'Failed to save progress' });
  }
}
