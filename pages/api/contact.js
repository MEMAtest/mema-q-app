import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const CONTACT_REASONS_MAP = {
  assessment: 'Request a Compliance Assessment',
  demo: 'Schedule a Product Demo',
  consulting: 'Compliance Consulting Services',
  authorization: 'FCA Authorization Support',
  finproms: 'Financial Promotions Guidance',
  partnership: 'Partnership Opportunities',
  support: 'Technical Support',
  other: 'Other'
};

const BEST_TIMES_MAP = {
  morning: 'Morning (9am - 12pm)',
  afternoon: 'Afternoon (12pm - 5pm)',
  evening: 'Evening (5pm - 7pm)',
  anytime: 'Anytime'
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, company, reason, reasonOther, bestTime, message } = req.body;

    // Validation
    if (!name || !email || !company || !reason || !bestTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (reason === 'other' && !reasonOther) {
      return res.status(400).json({ error: 'Please specify your reason for contact' });
    }

    // Determine the reason text
    const reasonText = reason === 'other' ? reasonOther : CONTACT_REASONS_MAP[reason];
    const bestTimeText = BEST_TIMES_MAP[bestTime];

    // Create email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #374151;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #0fa294 0%, #7C3AED 100%);
              color: white;
              padding: 30px 20px;
              border-radius: 12px 12px 0 0;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              background: #ffffff;
              border: 1px solid #E5E7EB;
              border-top: none;
              padding: 30px;
              border-radius: 0 0 12px 12px;
            }
            .field {
              margin-bottom: 20px;
              padding-bottom: 20px;
              border-bottom: 1px solid #E5E7EB;
            }
            .field:last-child {
              border-bottom: none;
              margin-bottom: 0;
              padding-bottom: 0;
            }
            .field-label {
              font-weight: 600;
              color: #0fa294;
              margin-bottom: 5px;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .field-value {
              color: #1F2937;
              font-size: 16px;
            }
            .message-box {
              background: #F9FAFB;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #0fa294;
              margin-top: 10px;
            }
            .priority-badge {
              display: inline-block;
              background: #FEF3C7;
              color: #92400E;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #6B7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔔 New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div style="margin-bottom: 25px;">
              <span class="priority-badge">New Inquiry</span>
            </div>

            <div class="field">
              <div class="field-label">Contact Person</div>
              <div class="field-value">${name}</div>
            </div>

            <div class="field">
              <div class="field-label">Email Address</div>
              <div class="field-value"><a href="mailto:${email}" style="color: #0fa294; text-decoration: none;">${email}</a></div>
            </div>

            ${phone ? `
            <div class="field">
              <div class="field-label">Phone Number</div>
              <div class="field-value"><a href="tel:${phone}" style="color: #0fa294; text-decoration: none;">${phone}</a></div>
            </div>
            ` : ''}

            <div class="field">
              <div class="field-label">Company</div>
              <div class="field-value">${company}</div>
            </div>

            <div class="field">
              <div class="field-label">Reason for Contact</div>
              <div class="field-value">${reasonText}</div>
            </div>

            <div class="field">
              <div class="field-label">Best Time to Contact</div>
              <div class="field-value">${bestTimeText}</div>
            </div>

            ${message ? `
            <div class="field">
              <div class="field-label">Additional Details</div>
              <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}
          </div>

          <div class="footer">
            <p>This email was sent from the MEMA contact form.<br/>
            Received on ${new Date().toLocaleString('en-GB', {
              dateStyle: 'long',
              timeStyle: 'short',
              timeZone: 'Europe/London'
            })}</p>
          </div>
        </body>
      </html>
    `;

    // Plain text version
    const emailText = `
New Contact Form Submission

Contact Person: ${name}
Email: ${email}
${phone ? `Phone: ${phone}\n` : ''}Company: ${company}
Reason: ${reasonText}
Best Time to Contact: ${bestTimeText}
${message ? `\nAdditional Details:\n${message}\n` : ''}
---
Received on ${new Date().toLocaleString('en-GB', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Europe/London'
})}
    `;

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'MEMA Contact Form <noreply@memaconsultants.com>',
      to: ['contact@memaconsultants.com'],
      replyTo: email,
      subject: `New Contact Form: ${reasonText} - ${company}`,
      html: emailHtml,
      text: emailText,
    });

    console.log('Email sent successfully:', data);
    return res.status(200).json({ success: true, id: data.id });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      error: 'Failed to send message',
      details: error.message
    });
  }
}
