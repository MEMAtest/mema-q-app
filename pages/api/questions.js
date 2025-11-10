// pages/api/questions.js
import prisma from '../../lib/prisma';

let cachedQuestions = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    if (cachedQuestions && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
      return res.status(200).json(cachedQuestions);
    }

    const flatQuestions = await prisma.question.findMany({
      orderBy: { id: 'asc' },
    });

    const groupedBySection = flatQuestions.reduce((acc, question) => {
      let section = acc.find((s) => s.id === question.sectionId);
      if (!section) {
        section = {
          id: question.sectionId,
          sectionTitle: question.sectionTitle,
          title: question.sectionTitle,
          items: [],
        };
        acc.push(section);
      }
      section.items.push(question);
      return acc;
    }, []);

    cachedQuestions = groupedBySection;
    cacheTime = Date.now();

    res.status(200).json(groupedBySection);
  } catch (error) {
    console.error('Error fetching and grouping questions:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error: Could not fetch questions.' });
  }
}
