// pages/api/analyze-promotion.js

// Simple in-memory rate limiting (resets on cold start)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per IP

function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Get or create entry for this IP
  let requests = rateLimitMap.get(ip) || [];

  // Filter to only requests within the window
  requests = requests.filter(timestamp => timestamp > windowStart);

  if (requests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limited
  }

  // Add this request
  requests.push(now);
  rateLimitMap.set(ip, requests);

  // Cleanup old IPs periodically (every 100th request)
  if (Math.random() < 0.01) {
    for (const [key, timestamps] of rateLimitMap.entries()) {
      if (timestamps.every(t => t < windowStart)) {
        rateLimitMap.delete(key);
      }
    }
  }

  return true;
}

const ANALYSIS_PROMPT = `You are an FCA (Financial Conduct Authority) compliance expert analyzing a financial promotion image.

FIRST, identify the promotion type/channel:
- "billboard" - outdoor advertising, bus stops, posters
- "social_media" - Instagram, Facebook, TikTok posts
- "website" - web pages, landing pages, banners
- "email" - email marketing, newsletters
- "print" - brochures, leaflets, magazines
- "video" - TV ads, YouTube, video content
- "other" - any other format

THEN analyze for FCA compliance:
1. Is this a financial promotion? (Does it invite/induce investment activity?)
2. Risk warnings - Is there a clear, prominent risk warning?
3. Past performance claims - Any return percentages? Properly disclaimed?
4. Misleading elements - Exaggerated claims, unrealistic promises?
5. Required disclosures - Firm name, FCA registration visible?
6. Target audience - Is it clear who this is for?
7. Call-to-action - What action is requested? Is it balanced?

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "promotionType": "billboard",
  "promotionTypeLabel": "Billboard/Outdoor Advertising",
  "isFinancialPromotion": true,
  "overallRisk": "high",
  "summary": "Brief 2-sentence summary",
  "issues": [
    {
      "severity": "high",
      "category": "risk_warning",
      "description": "Issue description",
      "fcaReference": "COBS 4.5.2R",
      "recommendation": "How to fix"
    }
  ],
  "compliantElements": ["List compliant items"],
  "suggestedAnswers": {
    "1.1": { "answer": "Yes", "confidence": 0.9, "reason": "Why" }
  }
}`;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Please wait a moment before scanning another promotion',
    });
  }

  try {
    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Call OpenRouter API with Google Gemini Flash (faster than Nvidia)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://finproms.memaconsultants.com',
        'X-Title': 'MEMA Compliance Analyzer',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: ANALYSIS_PROMPT,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType || 'image/png'};base64,${image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 3000,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to analyze image');
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message || {};

    // Nvidia model may return content in 'reasoning' or 'content' field
    let text = message.content || '';

    // If content is empty, check reasoning field
    if (!text && message.reasoning) {
      text = message.reasoning;
    }

    // Also check reasoning_details
    if (!text && message.reasoning_details?.length > 0) {
      text = message.reasoning_details.map(r => r.text).join('\n');
    }

    console.log('Raw response text:', text?.substring(0, 500));

    // Function to generate key observations from analysis
    const generateKeyObservations = (analysisData) => {
      const observations = [];

      if (analysisData.isFinancialPromotion) {
        observations.push(`This appears to be a financial promotion under FCA rules.`);
      }

      if (analysisData.overallRisk === 'high') {
        observations.push(`High compliance risk detected - immediate attention recommended.`);
      } else if (analysisData.overallRisk === 'medium') {
        observations.push(`Moderate compliance risk - review recommended before publication.`);
      }

      if (analysisData.issues?.length > 0) {
        const highIssues = analysisData.issues.filter(i => i.severity === 'high').length;
        const mediumIssues = analysisData.issues.filter(i => i.severity === 'medium').length;
        if (highIssues > 0) {
          observations.push(`Found ${highIssues} high-severity issue${highIssues > 1 ? 's' : ''} requiring action.`);
        }
        if (mediumIssues > 0) {
          observations.push(`Found ${mediumIssues} medium-severity issue${mediumIssues > 1 ? 's' : ''} to review.`);
        }
      }

      if (analysisData.compliantElements?.length > 0) {
        observations.push(`${analysisData.compliantElements.length} compliant element${analysisData.compliantElements.length > 1 ? 's' : ''} identified.`);
      }

      return observations;
    };

    // Parse JSON from response
    let analysis;
    try {
      // Try to extract JSON from the text
      // Look for JSON object pattern
      const jsonMatch = text.match(/\{[\s\S]*"promotionType"[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        // Try parsing the whole text as JSON
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        analysis = JSON.parse(cleanText);
      }
    } catch (parseError) {
      console.error('Failed to parse response:', text);

      // Try to extract key information from text even if JSON parsing fails
      const isFinPromo = text.toLowerCase().includes('financial promotion') ||
                         text.toLowerCase().includes('investment') ||
                         text.toLowerCase().includes('returns');

      // Detect promotion type from text
      let promotionType = 'other';
      let promotionTypeLabel = 'Other Promotion';

      if (text.toLowerCase().includes('billboard') || text.toLowerCase().includes('outdoor') || text.toLowerCase().includes('bus stop')) {
        promotionType = 'print';
        promotionTypeLabel = 'Billboard/Outdoor Advertising';
      } else if (text.toLowerCase().includes('social media') || text.toLowerCase().includes('instagram') || text.toLowerCase().includes('facebook')) {
        promotionType = 'social_media';
        promotionTypeLabel = 'Social Media Post';
      } else if (text.toLowerCase().includes('website') || text.toLowerCase().includes('landing page')) {
        promotionType = 'website';
        promotionTypeLabel = 'Website/Landing Page';
      } else if (text.toLowerCase().includes('email')) {
        promotionType = 'email';
        promotionTypeLabel = 'Email Marketing';
      }

      // Return structured fallback with detected info
      analysis = {
        promotionType,
        promotionTypeLabel,
        isFinancialPromotion: isFinPromo,
        overallRisk: 'medium',
        summary: 'Scan completed. The scanner provided insights but in a non-standard format. Key observations have been extracted.',
        issues: [],
        compliantElements: [],
        suggestedAnswers: {},
        rawAnalysis: text.substring(0, 1500),
      };
    }

    // Add key observations to analysis
    analysis.keyObservations = generateKeyObservations(analysis);

    return res.status(200).json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return res.status(500).json({
      error: 'Failed to analyze image',
      message: error.message,
    });
  }
}
