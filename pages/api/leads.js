// pages/api/leads.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
    } catch (error) {
      res.status(500).json({ message: 'Error saving lead' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}