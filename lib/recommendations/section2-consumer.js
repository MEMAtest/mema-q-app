// Section 2: Core Principles & Consumer Duty

export const section2_consumer = {

  "2.1": {
    // Considers nature and vulnerabilities of target audience
    ifNo: {
      priority: "high",
      title: "Tailor Content to Audience Characteristics",
      summary: "Adapt the promotion's language, complexity, and warnings for your specific audience",
      actions: [
        {
          step: 1,
          action: "Define your target audience precisely",
          detail: "Document: Age range, financial literacy level, investment experience, potential vulnerabilities (debt, health, life events)."
        },
        {
          step: 2,
          action: "Adjust language complexity",
          detail: "For retail audiences: use plain English, avoid jargon, explain technical terms. Aim for reading age of 11-14."
        },
        {
          step: 3,
          action: "Consider vulnerable customers",
          detail: "Think about how the promotion would be received by someone in financial difficulty, with low confidence, or under stress. Add appropriate signposting."
        },
        {
          step: 4,
          action: "Test with representative users",
          detail: "If possible, test the promotion with people matching your target audience. Ask: 'Did you understand this? What would you do next?'"
        }
      ],
      templateText: null,
      fcaRef: "COBS 4.2.1R(3), PRIN 2A.5.8",
      riskIfIgnored: "Consumer Duty requires firms to act to deliver good outcomes. Ignoring audience needs breaches this duty."
    }
  },

  "2.2": {
    // Avoids disguising/diminishing important information
    ifNo: {
      priority: "critical",
      title: "Make All Important Information Clearly Visible",
      summary: "Key warnings and conditions must not be hidden or downplayed",
      actions: [
        {
          step: 1,
          action: "Review prominence of risk warnings",
          detail: "Risk warnings must be in a font size at least equal to the main content, in a readable colour, and not hidden by design elements."
        },
        {
          step: 2,
          action: "Eliminate problematic small print",
          detail: "Move any important information from footnotes into the main body. If it's important, it shouldn't be in small print."
        },
        {
          step: 3,
          action: "Balance visual hierarchy",
          detail: "Benefits should not be visually more prominent than risks. Use similar font sizes, colours, and positioning."
        },
        {
          step: 4,
          action: "Check for obstruction on all devices",
          detail: "Test on mobile devices. Ensure warnings aren't cut off, hidden behind 'see more' links, or require scrolling."
        }
      ],
      templateText: null,
      fcaRef: "COBS 4.5.2R(4), COBS 4.5A.3UK(e)",
      riskIfIgnored: "Hidden or downplayed warnings are a clear breach of FCA rules and harm consumers."
    }
  },

  "2.3": {
    // Accurate in all factual claims
    ifNo: {
      priority: "critical",
      title: "Verify and Correct All Factual Claims",
      summary: "Every statement of fact must be true and substantiated",
      actions: [
        {
          step: 1,
          action: "List all factual claims made",
          detail: "Extract every statement that could be verified: performance figures, rankings, awards, statistics, percentages."
        },
        {
          step: 2,
          action: "Verify each claim with evidence",
          detail: "For each claim, obtain documentary evidence. Keep these records for audit purposes."
        },
        {
          step: 3,
          action: "Update outdated information",
          detail: "Performance data, rankings, and statistics must be current. Add 'as at' dates where relevant."
        },
        {
          step: 4,
          action: "Remove or correct unsubstantiated claims",
          detail: "If you cannot prove it, remove it or reword to be accurate."
        },
        {
          step: 5,
          action: "Add appropriate disclaimers",
          detail: "For performance: 'Past performance is not a guide to future performance.' For awards: Include date received."
        }
      ],
      templateText: "Past performance is not a reliable indicator of future results.",
      fcaRef: "COBS 4.5.2R(2), COBS 4.5A.3UK(b)",
      riskIfIgnored: "False or misleading claims can lead to enforcement action and consumer redress claims."
    }
  },

  "2.4": {
    // Balanced view of benefits and risks
    ifNo: {
      priority: "critical",
      title: "Balance Benefits with Corresponding Risks",
      summary: "Every benefit mentioned must be accompanied by a fair indication of risk",
      actions: [
        {
          step: 1,
          action: "List all benefits mentioned in the promotion",
          detail: "Identify every positive claim: returns, growth, income, convenience, tax benefits, etc."
        },
        {
          step: 2,
          action: "Identify corresponding risks for each benefit",
          detail: "For each benefit, what could go wrong? Capital loss, market volatility, illiquidity, tax changes, etc."
        },
        {
          step: 3,
          action: "Add risk statements with equal prominence",
          detail: "Place risk information adjacent to benefit claims. Use similar font size and visual weight."
        },
        {
          step: 4,
          action: "Review overall impression",
          detail: "Step back and ask: Does this promotion give a balanced impression, or does it feel like a 'hard sell' of benefits?"
        }
      ],
      templateText: "The value of investments can go down as well as up. You may get back less than you invested.",
      fcaRef: "COBS 4.5.2R(2), COBS 4.5A.3UK(b)",
      riskIfIgnored: "Unbalanced promotions are inherently misleading and breach core FCA requirements."
    }
  },

  "2.5": {
    // Information sufficient and understandable
    ifNo: {
      priority: "high",
      title: "Improve Clarity and Comprehensibility",
      summary: "Ensure the average target customer can understand the promotion",
      actions: [
        {
          step: 1,
          action: "Simplify language",
          detail: "Replace jargon with plain English. 'Equity' → 'shares', 'Liquidity' → 'ability to access your money'."
        },
        {
          step: 2,
          action: "Add explanations for technical terms",
          detail: "If you must use technical terms, explain them in brackets or a clearly linked glossary."
        },
        {
          step: 3,
          action: "Improve layout and structure",
          detail: "Use headings, bullet points, and white space. Break up dense text. Lead with the most important information."
        },
        {
          step: 4,
          action: "Add a clear 'What does this mean for you?' section",
          detail: "Summarise the key points and actions in simple terms."
        },
        {
          step: 5,
          action: "Test readability",
          detail: "Use readability tools (Flesch-Kincaid). Aim for a reading age appropriate to your audience."
        }
      ],
      templateText: null,
      fcaRef: "COBS 4.5.2R(3), PRIN 2A.5",
      riskIfIgnored: "Complex or unclear promotions prevent informed decision-making, breaching Consumer Duty."
    }
  },

  "2.13": {
    // Consumer Duty - supports understanding and good decisions
    ifNo: {
      priority: "critical",
      title: "Enhance Support for Consumer Understanding",
      summary: "The promotion must actively help consumers make good decisions",
      actions: [
        {
          step: 1,
          action: "Review against Consumer Duty outcomes",
          detail: "Check: Does this support understanding? Does it support good decision-making? Could it cause foreseeable harm?"
        },
        {
          step: 2,
          action: "Add decision-support information",
          detail: "Include: 'Is this right for you?' sections, key questions to consider, signposting to advice."
        },
        {
          step: 3,
          action: "Highlight when NOT to invest",
          detail: "Be clear about who the product is NOT suitable for. This demonstrates good faith."
        },
        {
          step: 4,
          action: "Provide next steps for further information",
          detail: "Include clear routes to find out more, speak to someone, or seek independent advice."
        }
      ],
      templateText: "If you are unsure whether this product is right for you, please seek independent financial advice.",
      fcaRef: "PRIN 2A, FG24/1 3.1-3.8",
      riskIfIgnored: "Consumer Duty is a regulatory priority. Breaches attract significant FCA attention and penalties."
    }
  },

  "2.14": {
    // Consumer Duty - target market defined and tailored
    ifNo: {
      priority: "high",
      title: "Define Target Market and Tailor Accordingly",
      summary: "Identify who the promotion is for and adapt it specifically for them",
      actions: [
        {
          step: 1,
          action: "Document the target market",
          detail: "Write down: Who is this product for? What are their needs? What is their likely financial situation and knowledge level?"
        },
        {
          step: 2,
          action: "Identify the negative target market",
          detail: "Who is this product NOT suitable for? Be specific. This helps avoid foreseeable harm."
        },
        {
          step: 3,
          action: "Tailor content to the target market",
          detail: "Adjust language, examples, imagery, and tone to resonate with and be understood by your target audience."
        },
        {
          step: 4,
          action: "Match channel to audience",
          detail: "Consider if the communication channel is appropriate for your target market. Is TikTok right for pension products?"
        }
      ],
      templateText: null,
      fcaRef: "PRIN 2A.5.4, 2A.5.8, FG24/1 3.3",
      riskIfIgnored: "Promotions not designed for their audience may cause harm and breach Consumer Duty."
    }
  },

  "2.15": {
    // Consumer Duty - avoids exploiting biases
    ifNo: {
      priority: "high",
      title: "Remove Manipulative Tactics",
      summary: "Eliminate techniques that exploit psychological biases",
      actions: [
        {
          step: 1,
          action: "Remove false urgency",
          detail: "Eliminate: 'Limited time only!', 'Only 3 left!', countdown timers, unless genuinely true and relevant."
        },
        {
          step: 2,
          action: "Remove inappropriate social proof",
          detail: "Avoid: 'Everyone is doing it', '10,000 investors can't be wrong', celebrity endorsements that imply guaranteed success."
        },
        {
          step: 3,
          action: "Check for 'sludge' practices",
          detail: "Ensure it's as easy to decline or exit as it is to proceed. No dark patterns."
        },
        {
          step: 4,
          action: "Review call-to-action language",
          detail: "Avoid aggressive CTAs like 'Don't miss out!' or 'Act now before it's too late!'. Use neutral language: 'Learn more', 'Apply'."
        },
        {
          step: 5,
          action: "Give consumers time to decide",
          detail: "Signpost cooling-off periods. Don't pressure immediate action on significant financial decisions."
        }
      ],
      templateText: null,
      fcaRef: "PRIN 2A.2.1, FG24/1 3.5",
      riskIfIgnored: "Exploiting biases is explicitly contrary to the Consumer Duty. The FCA actively monitors for these practices."
    }
  },
};
