import prisma from '../../lib/prisma';
import { Resend } from 'resend';
import { checkRateLimit } from '../../lib/rateLimit';

function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input ?? '';
  }
  return input.trim().replace(/[<>]/g, '').slice(0, 500);
}

function convertToCSV(questions = [], answers = {}) {
  if (!Array.isArray(questions) || typeof answers !== 'object') {
    return '';
  }

  const headers = ['Question', 'Regulation Reference', 'Your Answer', 'Your Notes'];
  const rows = [];

  questions.forEach((section) => {
    section.items.forEach((item) => {
      const userAnswer = answers[item.id];
      const answerText = userAnswer?.answer ? JSON.stringify(userAnswer.answer).replace(/"/g, '') : 'N/A';
      const notesText = userAnswer?.notes || '';

      rows.push([
        `"${(item.questionText || '').replace(/"/g, '""')}"`,
        `"${(item.questionRef || '').replace(/"/g, '""')}"`,
        `"${answerText.replace(/"/g, '""')}"`,
        `"${notesText.replace(/"/g, '""')}"`
      ].join(','));
    });
  });

  return [headers.join(','), ...rows].join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('CRITICAL: RESEND_API_KEY environment variable is not set.');
    return res.status(500).json({ success: false, message: 'Email service is not configured' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(ip, 10, 60_000)) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a minute and try again.'
    });
  }

  const { name, email, phone, firm, questions, answers } = req.body;
  const sanitizedName = sanitizeInput(name);
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedPhone = sanitizeInput(phone);
  const sanitizedFirm = sanitizeInput(firm);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!sanitizedEmail || !emailRegex.test(sanitizedEmail)) {
    return res.status(400).json({ success: false, message: 'A valid email address is required.' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const newLead = await prisma.lead.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone || '',
        firm: sanitizedFirm,
      },
    });

    const adminHtml = `
      <div style="font-family: Arial, sans-serif;">
        <h2>New MEMA FinProms Lead</h2>
        <p><strong>Name:</strong> ${sanitizedName || 'N/A'}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>Phone:</strong> ${sanitizedPhone || 'Not provided'}</p>
        <p><strong>Firm:</strong> ${sanitizedFirm || 'N/A'}</p>
      </div>
    `;

    await resend.emails.send({
      from: 'MEMA App <onboarding@resend.dev>',
      to: 'contact@memaconsultants.com',
      subject: 'New MEMA FinProms Questionnaire Lead',
      html: adminHtml,
    });

    const csvData = convertToCSV(questions, answers);
    const csvBuffer = Buffer.from(csvData, 'utf-8');

    await resend.emails.send({
      from: 'MEMA Consultants <onboarding@resend.dev>',
      to: sanitizedEmail,
      subject: 'Your MEMA Financial Promotions Compliance Report',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color:#0f766e;">Your Compliance Assessment Results</h1>
          <p>Thank you for completing the MEMA FinProms assessment${sanitizedFirm ? ` for ${sanitizedFirm}` : ''}.</p>
          <p>We've attached your full responses and notes as a CSV file that you can share internally.</p>
          <p style="margin-top:24px;">Need deeper support? Email <a href="mailto:contact@memaconsultants.com">contact@memaconsultants.com</a>.</p>
        </div>
      `,
      attachments: [
        {
          filename: 'MEMA_Compliance_Report.csv',
          content: csvBuffer,
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: 'Lead saved and report emailed.',
      lead: newLead,
    });
  } catch (error) {
    console.error('Error during lead submission:', error);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
