// pages/api/leads.js

import prisma from '../../lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, phone } = req.body;

  if (!email || !phone) {
    return res.status(400).json({ error: 'Email and phone are required.' });
  }

  try {
    const newLead = await prisma.lead.create({
      data: {
        email: email,
        phone: phone,
      },
    });

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'contact@memaconsultants.com',
      subject: 'New FinProms Questionnaire Lead',
      html: `<div><h2>New Lead Submitted</h2><p>Email: ${email}</p><p>Phone: ${phone}</p></div>`,
    });

    return res.status(201).json(newLead);
  } catch (error) {
    console.error("Error creating lead or sending email:", error);
    return res.status(500).json({ error: 'Failed to process request.' });
  }
}