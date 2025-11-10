import prisma from '../../lib/prisma';
import { checkRateLimit } from '../../lib/rateLimit';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { sessionId } = req.query;

  if (!sessionId) {
    return res.status(400).json({ success: false, message: 'Session ID required' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(`${ip}-${sessionId}-load`, 15, 60_000)) {
    return res.status(429).json({ success: false, message: 'Too many requests. Please wait a moment.' });
  }

  try {
    const responses = await prisma.userResponse.findMany({
      where: { sessionId },
    });

    const answers = {};
    responses.forEach((response) => {
      answers[response.questionId] = {
        answer: response.answer,
        notes: response.notes,
      };
    });

    return res.status(200).json({ success: true, answers });
  } catch (error) {
    console.error('Error loading progress:', error);
    return res.status(500).json({ success: false, message: 'Failed to load progress' });
  }
}
