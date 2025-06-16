import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;

//
// STEP 3: Update your 'pages/api/questions.js' file.
// Replace its entire content with this improved code.
//
// FILE: pages/api/questions.js

import prisma from '../../lib/prisma'; // Import the shared instance from our new file

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
      console.error("Error fetching questions:", error); // Log the actual error on the server
      res.status(500).json({ message: 'Internal Server Error: Could not fetch questions.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

//
// STEP 4: Update your 'pages/api/leads.js' file for consistency.
// Replace its entire content with this improved code.
//
// FILE: pages/api/leads.js

import prisma from '../../lib/prisma'; // Import the shared instance from our new file

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, phone } = req.body;
      if (!email || !phone) {
        return res.status(400).json({ message: 'Email and phone are required.' });
      }
      const newLead = await prisma.lead.create({
        data: { email, phone },
      });
      res.status(201).json({ message: 'Lead saved successfully!', lead: newLead });
    } catch (error)
    {
      console.error("Error saving lead:", error); // Log the actual error on the server
      res.status(500).json({ message: 'Internal Server Error: Could not save lead.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
