// Section 1: Preliminary Checks & Scope

export const section1_scope = {
  "1.1": {
    // Is the communication an "invitation or inducement"?
    ifNo: {
      priority: "high",
      title: "Clarify Communication Intent",
      summary: "Review whether your communication truly lacks any persuasive element",
      actions: [
        {
          step: 1,
          action: "Review PERG 8.4.2-8.4.4 definition of 'invitation or inducement'",
          detail: "An invitation or inducement includes any communication designed to lead someone to engage in investment activity, even if subtle."
        },
        {
          step: 2,
          action: "Audit your communication for persuasive elements",
          detail: "Check for: Call-to-action buttons, benefit statements, urgency language, comparison claims, or any language encouraging action."
        },
        {
          step: 3,
          action: "Document your assessment",
          detail: "If genuinely factual only (e.g., annual report, pure product specification), document why it lacks inducement. Keep this on file."
        },
        {
          step: 4,
          action: "Consider re-classification",
          detail: "If any persuasive element exists, change your answer to 'Yes' and continue the assessment as a financial promotion."
        }
      ],
      templateText: null,
      fcaRef: "PERG 8.4.2 - 8.4.4",
      riskIfIgnored: "Incorrectly classifying a financial promotion could mean non-compliance with s21 FSMA."
    }
  },

  "1.2": {
    // Is the communication made "in the course of business"?
    ifNo: {
      priority: "medium",
      title: "Verify Non-Commercial Status",
      summary: "Confirm the communication has no commercial interest whatsoever",
      actions: [
        {
          step: 1,
          action: "Identify all parties involved in the communication",
          detail: "List everyone who created, shared, or benefits from this communication."
        },
        {
          step: 2,
          action: "Check for any commercial benefit",
          detail: "Ask: Does anyone receive payment, commission, affiliate fees, free products, or any other benefit? If yes, it's likely 'in the course of business'."
        },
        {
          step: 3,
          action: "Review influencer/affiliate arrangements",
          detail: "Per FG24/1 4.18, influencers with commercial interests (even indirect) are considered to be acting in the course of business."
        },
        {
          step: 4,
          action: "Document genuinely personal communications",
          detail: "If this is a truly personal recommendation between friends with no commercial element, document this clearly."
        }
      ],
      templateText: null,
      fcaRef: "PERG 8.5.2, FG24/1 4.16-4.27",
      riskIfIgnored: "Misclassifying commercial communications as personal could result in unregulated financial promotions reaching consumers."
    }
  },

  "1.3": {
    // Does it relate to "controlled investment" activity?
    ifNo: {
      priority: "medium",
      title: "Verify Product Classification",
      summary: "Confirm the product/service is not a controlled investment or activity",
      actions: [
        {
          step: 1,
          action: "Review the Regulated Activities Order (RAO)",
          detail: "Check Schedule 1 of the RAO for the list of controlled activities and controlled investments."
        },
        {
          step: 2,
          action: "Identify your product type precisely",
          detail: "Common controlled investments: shares, bonds, units in collective investment schemes, derivatives, insurance contracts, cryptoassets (qualifying)."
        },
        {
          step: 3,
          action: "Consider borderline cases",
          detail: "Some products appear unregulated but may fall under FCA rules (e.g., certain structured deposits, CFDs, spread bets)."
        },
        {
          step: 4,
          action: "Seek legal advice if uncertain",
          detail: "If in doubt about classification, obtain legal advice. Incorrect classification carries significant regulatory risk."
        }
      ],
      templateText: null,
      fcaRef: "PERG 8.7, RAO Schedule 1",
      riskIfIgnored: "Promoting controlled investments without proper authorisation is a criminal offence under s21 FSMA."
    }
  },

  "1.4": {
    // If from outside UK, capable of effect in UK?
    ifNo: {
      priority: "medium",
      title: "Verify UK Exclusion Measures",
      summary: "Ensure robust geo-blocking or exclusion of UK consumers",
      actions: [
        {
          step: 1,
          action: "Implement effective geo-blocking",
          detail: "Use technical measures (IP blocking, location verification) to prevent UK access. The FCA considers the threshold for 'capable of having effect' to be very low."
        },
        {
          step: 2,
          action: "Add clear territorial disclaimers",
          detail: "Include prominent statements that the service is not available to UK residents and they should not act on the promotion."
        },
        {
          step: 3,
          action: "Review payment/onboarding flows",
          detail: "Ensure UK residents cannot complete sign-up, payment, or investment even if they access the content."
        },
        {
          step: 4,
          action: "Monitor and block UK engagement",
          detail: "Actively monitor for UK users and have processes to reject their applications or enquiries."
        }
      ],
      templateText: "This service is not available to residents of the United Kingdom. If you are a UK resident, please do not proceed.",
      fcaRef: "PERG 8.8.1, FG24/1 2.47-2.52",
      riskIfIgnored: "Communications capable of having effect in the UK must comply with UK financial promotion rules, regardless of origin."
    }
  },

  "1.5": {
    // Lawful basis for financial promotion
    ifSelected: {
      "none": {
        priority: "critical",
        title: "URGENT: Obtain Lawful Basis Before Communication",
        summary: "This promotion cannot be communicated legally without a lawful basis",
        actions: [
          {
            step: 1,
            action: "STOP - Do not communicate this promotion",
            detail: "Communicating a financial promotion without lawful basis is a criminal offence under s21 FSMA, punishable by up to 2 years imprisonment."
          },
          {
            step: 2,
            action: "Option A: Become FCA authorised",
            detail: "Apply to the FCA for authorisation. This typically takes 6-12 months and requires significant compliance infrastructure."
          },
          {
            step: 3,
            action: "Option B: Obtain s21 approval from an authorised firm",
            detail: "Engage an FCA-authorised firm with 'approver permission' to review and approve your promotion. They will conduct due diligence on you and your product."
          },
          {
            step: 4,
            action: "Option C: Check if an FPO exemption applies",
            detail: "Review the Financial Promotion Order (SI 2005/1529) for exemptions. Common exemptions include: high net worth/sophisticated investors (Article 48/50), one-off promotions (Article 28), follow-up communications (Article 14)."
          },
          {
            step: 5,
            action: "Seek legal advice immediately",
            detail: "Given the criminal nature of this offence, obtain legal advice before any further action."
          }
        ],
        templateText: null,
        fcaRef: "s21 FSMA, PERG 8.9, PS23/13",
        riskIfIgnored: "Criminal offence - up to 2 years imprisonment and unlimited fine. Agreements may be unenforceable."
      }
    }
  },

  "1.7": {
    // Target audience including retail
    ifSelected: {
      "mixed_audience_retail": {
        priority: "high",
        title: "Apply Retail Client Standards Throughout",
        summary: "When retail clients are included, the highest standards apply to all",
        actions: [
          {
            step: 1,
            action: "Apply retail client standards universally",
            detail: "You cannot have different versions. The entire promotion must meet the stricter standards applicable to retail clients."
          },
          {
            step: 2,
            action: "Review Consumer Duty obligations",
            detail: "Ensure the promotion supports good outcomes: understanding, fair value, appropriate products, and good service."
          },
          {
            step: 3,
            action: "Consider audience segmentation",
            detail: "If possible, create separate promotions for professional clients and retail clients, targeting each appropriately."
          },
          {
            step: 4,
            action: "Enhance clarity and risk warnings",
            detail: "Use plain English, avoid jargon, make risk warnings prominent and understandable to someone without financial expertise."
          }
        ],
        templateText: null,
        fcaRef: "COBS 3, PRIN 2A, FG24/1 3.4",
        riskIfIgnored: "Consumer Duty breaches can result in significant fines and redress obligations."
      }
    }
  },

  "1.9": {
    // Fair, clear, not misleading overall
    ifNo: {
      priority: "critical",
      title: "FUNDAMENTAL ISSUE: Promotion Fails Core FCA Requirement",
      summary: "The promotion must be completely revised to be fair, clear, and not misleading",
      actions: [
        {
          step: 1,
          action: "Conduct a comprehensive content review",
          detail: "Review every claim, statement, and implication in the promotion with fresh eyes or an independent reviewer."
        },
        {
          step: 2,
          action: "Check for fairness",
          detail: "Ask: Does this give a balanced view? Are risks as prominent as benefits? Are comparisons fair and like-for-like?"
        },
        {
          step: 3,
          action: "Check for clarity",
          detail: "Ask: Would an average retail consumer understand this? Is jargon explained? Is the layout logical?"
        },
        {
          step: 4,
          action: "Check for accuracy",
          detail: "Verify every factual claim. Ensure performance data is up-to-date and presented with appropriate disclaimers."
        },
        {
          step: 5,
          action: "Check for omissions",
          detail: "What have you NOT said that a consumer would need to know to make an informed decision? Add this information."
        },
        {
          step: 6,
          action: "Get independent sign-off",
          detail: "Have the revised promotion reviewed by compliance or legal before re-use."
        }
      ],
      templateText: null,
      fcaRef: "COBS 4.2.1R",
      riskIfIgnored: "This is a cornerstone FCA requirement. Breach can lead to enforcement action, fines, and requirement to withdraw the promotion."
    }
  },

  "1.10": {
    // Standalone compliant
    ifNo: {
      priority: "high",
      title: "Make Each Communication Self-Sufficient",
      summary: "Every individual piece of the promotion must be compliant on its own",
      actions: [
        {
          step: 1,
          action: "Identify each discrete communication",
          detail: "Break down your campaign: each social post, each email, each ad is a separate financial promotion that must stand alone."
        },
        {
          step: 2,
          action: "Add essential information to each piece",
          detail: "Each must include: firm name, risk warnings appropriate to the product, balanced view of benefits/risks."
        },
        {
          step: 3,
          action: "Do not rely on click-throughs for compliance",
          detail: "Information behind a link does not make the initial promotion compliant. The FCA is clear: each promotion must work on its own."
        },
        {
          step: 4,
          action: "For character-limited media, prioritise critical information",
          detail: "On Twitter/X or Instagram, prioritise: risk warning, firm identity, balanced message. Consider whether the platform is suitable."
        }
      ],
      templateText: "Your capital is at risk. [Firm Name] is authorised and regulated by the FCA.",
      fcaRef: "FG24/1 2.20-2.23",
      riskIfIgnored: "Relying on linked information is explicitly not acceptable per FCA guidance."
    }
  },
};
