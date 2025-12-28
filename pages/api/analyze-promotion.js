// pages/api/analyze-promotion.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ANALYSIS_PROMPT = `You are an FCA (Financial Conduct Authority) compliance expert analyzing a financial promotion.

Analyze this image and identify:

1. **Is this a financial promotion?** (Does it invite or induce investment activity?)
2. **Risk warnings**: Is there a clear, prominent risk warning? (e.g., "Capital at risk", "Past performance...")
3. **Past performance claims**: Any return percentages or performance figures? Are they properly disclaimed?
4. **Misleading elements**: Any exaggerated claims, unrealistic promises, or pressure tactics?
5. **Required disclosures**: Is the firm name, FCA registration, or contact info visible?
6. **Target audience clarity**: Is it clear who this promotion is for?
7. **Call-to-action**: What action is the user being asked to take? Is it balanced?

For each issue found, provide:
- The specific problem
- The relevant FCA rule (PERG 8.x, COBS 4.x, FG24/1, FSMA s21)
- A recommendation to fix it

Respond in this exact JSON format:
{
  "isFinancialPromotion": true/false,
  "overallRisk": "high" | "medium" | "low",
  "summary": "Brief 2-sentence summary of the promotion",
  "issues": [
    {
      "severity": "high" | "medium" | "low",
      "category": "risk_warning" | "past_performance" | "misleading" | "disclosure" | "target_audience" | "cta",
      "description": "What the issue is",
      "fcaReference": "COBS 4.5.2R",
      "recommendation": "How to fix it",
      "questionId": "1.2"
    }
  ],
  "compliantElements": [
    "List of things that are compliant"
  ],
  "suggestedAnswers": {
    "1.1": { "answer": "Yes", "confidence": 0.9, "reason": "The promotion invites users to..." },
    "1.2": { "answer": "No", "confidence": 0.85, "reason": "No visible risk warning..." }
  }
}

Question IDs for reference:
- 1.1: Is this an invitation/inducement to engage in investment activity?
- 1.2: Does it include a clear risk warning?
- 1.3: Are past performance figures properly disclaimed?
- 2.1: Is the communication fair, clear and not misleading?
- 2.2: Are benefits balanced with risks?
- 3.1: Is the firm properly identified?
- 3.2: Is FCA authorization status clear?

Be thorough but practical. Focus on real compliance issues, not minor stylistic preferences.`;

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

  try {
    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Initialize Gemini model with vision capabilities
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Prepare the image for Gemini
    const imagePart = {
      inlineData: {
        data: image,
        mimeType: mimeType || 'image/png',
      },
    };

    // Generate content
    const result = await model.generateContent([ANALYSIS_PROMPT, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response (handle markdown code blocks)
    let analysis;
    try {
      // Remove markdown code blocks if present
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/```\n?([\s\S]*?)\n?```/);
      const jsonString = jsonMatch ? jsonMatch[1] : text;
      analysis = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      // Return a structured error response
      analysis = {
        isFinancialPromotion: true,
        overallRisk: 'medium',
        summary: 'Analysis completed but response parsing failed. Please review manually.',
        issues: [],
        compliantElements: [],
        suggestedAnswers: {},
        rawResponse: text,
      };
    }

    return res.status(200).json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({
      error: 'Failed to analyze image',
      message: error.message,
    });
  }
}
