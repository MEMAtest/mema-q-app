// pages/api/questions.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const questions = await prisma.question.findMany({
        orderBy: {
          id: 'asc',
        },
      });
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching questions' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}