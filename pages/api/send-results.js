import { Resend } from 'resend';
import { checkRateLimit } from '../../lib/rateLimit';

function buildCsvAttachment(questions, answers) {
  if (!Array.isArray(questions) || !answers) return '';

  const headers = ['Question', 'Regulation Reference', 'Your Answer', 'Your Notes'];
  const rows = [];

  questions.forEach((section) => {
    section.items.forEach((item) => {
      const userAnswer = answers[item.id];
      const answerText = userAnswer?.answer ? JSON.stringify(userAnswer.answer).replace(/"/g, '') : 'N/A';

      rows.push([
        `"${item.questionText.replace(/"/g, '""')}"`,
        `"${(item.questionRef || '').replace(/"/g, '""')}"`,
        `"${answerText.replace(/"/g, '""')}"`,
        `"${(userAnswer?.notes || '').replace(/"/g, '""')}"`
      ].join(','));
    });
  });

  return [headers.join(','), ...rows].join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY missing');
    return res.status(500).json({ success: false, message: 'Email service not configured' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(ip, 5, 60_000)) {
    return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
  }

  const { email, firm, results, questions, answers } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email) || !results) {
    return res.status(400).json({ success: false, message: 'Valid email and results are required' });
  }
  const safeFirm = typeof firm === 'string' ? firm.replace(/[<>]/g, '').trim().slice(0, 200) : '';

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const csvData = buildCsvAttachment(questions, answers);
    const csvBuffer = Buffer.from(csvData, 'utf-8');

    await resend.emails.send({
      from: 'MEMA Consultants <onboarding@resend.dev>',
      to: email,
      subject: 'Your MEMA Financial Promotions Compliance Report',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1 style="color:#0f766e;">Your Compliance Assessment Results</h1>
          <p>Thanks for using the MEMA FinProms assessment tool${safeFirm ? `, ${safeFirm}` : ''}.</p>
          <p><strong>Health Score:</strong> ${results.healthScore}%</p>
          <p><strong>Issues Identified:</strong> ${results.potentialFailures.length}</p>
          <p>The complete CSV report is attached for your records.</p>
        </div>
      `,
      attachments: [
        {
          filename: 'MEMA_Compliance_Report.csv',
          content: csvBuffer,
        },
      ],
    });

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Failed to send report email:', error);
    return res.status(500).json({ success: false, message: 'Failed to send email' });
  }
}
