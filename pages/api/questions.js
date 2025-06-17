// pages/api/questions.js

import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const flatQuestions = await prisma.question.findMany({
        orderBy: {
          id: 'asc',
        },
      });

      // Group the flat list of questions into a nested structure by section
      const groupedBySection = flatQuestions.reduce((acc, question) => {
        // Find the section in our accumulator array
        let section = acc.find(s => s.id === question.sectionId);
        
        // If the section isn't in our array yet, create it
        if (!section) {
          section = {
            id: question.sectionId,
            sectionTitle: question.sectionTitle,
            items: [] // Start with an empty array for its questions
          };
          acc.push(section);
        }

        // Add the current question to that section's 'items' array
        section.items.push(question);
        
        return acc;
      }, []);

      res.status(200).json(groupedBySection);

    } catch (error) {
      console.error("Error fetching and grouping questions:", error);
      res.status(500).json({ message: 'Internal Server Error: Could not fetch questions.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}