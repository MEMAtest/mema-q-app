// pages/api/leads.js
import prisma from '../../lib/prisma';
import { Resend } from 'resend';

// --- UPDATED: convertToCSV function to create the new format ---
function convertToCSV(questions, answers) {
    if (!questions || !answers) {
        return "";
    }

    // Define the new headers
    const headers = ["Question", "Regulation Reference", "Your Answer", "Your Notes"];
    
    const rows = [];
    // Iterate over all questions to build a complete report
    questions.forEach(section => {
        section.items.forEach(item => {
            const userAnswer = answers[item.id];
            // Sanitize and format the answer, handling different types (string, array)
            const answerText = userAnswer?.answer ? JSON.stringify(userAnswer.answer).replace(/"/g, '') : 'N/A';
            const notesText = userAnswer?.notes || '';

            const row = [
                `"${item.questionText.replace(/"/g, '""')}"`,
                `"${item.questionRef.replace(/"/g, '""')}"`,
                `"${answerText.replace(/"/g, '""')}"`,
                `"${notesText.replace(/"/g, '""')}"`
            ];
            rows.push(row.join(','));
        });
    });

    return [headers.join(','), ...rows].join('\n');
}


export default async function handler(req, res) {
  if (!process.env.RESEND_API_KEY) {
    console.error("CRITICAL: RESEND_API_KEY environment variable is not set.");
    return res.status(500).json({ message: "Server configuration error: Email service is not set up." });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // --- CHANGE: Destructure questions and answers from the body ---
  const { email, phone, firm, questions, answers } = req.body;

  if (!email || !phone) {
    return res.status(400).json({ message: 'Email and phone are required.' });
  }

  try {
    const newLead = await prisma.lead.create({
      data: { email, phone, firm },
    });

    // --- FLOW 1: Email to MEMA (No Change) ---
    await resend.emails.send({
      from: 'MEMA App <onboarding@resend.dev>',
      to: 'contact@memaconsultants.com',
      subject: 'New MEMA FinProms Questionnaire Lead',
      html: `...`, // Same HTML as before
    });

    // --- FLOW 2: Email to the User with the NEW CSV format ---
    const csvData = convertToCSV(questions, answers);
    const csvBuffer = Buffer.from(csvData, 'utf-8');

    await resend.emails.send({
      from: 'MEMA Consultants <onboarding@resend.dev>',
      to: email,
      subject: 'Your MEMA Financial Promotions Compliance Report',
      html: `...`, // Same HTML as before
      attachments: [
        {
          filename: 'MEMA_Compliance_Report.csv',
          content: csvBuffer,
        },
      ],
    });

    return res.status(201).json({ message: 'Lead saved and emails sent.', lead: newLead });

  } catch (error) {
    console.error("Error during lead submission:", error);
    const errorMessage = error.message || 'An internal server error occurred.';
    return res.status(500).json({ message: errorMessage });
  }
}
