// Section 3: Identification & Firm Information

export const section3_identity = {

  "3.1": {
    // Clearly identifiable as a financial promotion
    ifNo: {
      priority: "high",
      title: "Clearly Label as Financial Promotion/Advertisement",
      summary: "Make it obvious this is marketing material, not editorial content",
      actions: [
        {
          step: 1,
          action: "Add clear 'Advertisement' or 'Ad' label",
          detail: "Use visible labelling at the start of the communication. On social media, use platform labelling tools."
        },
        {
          step: 2,
          action: "Distinguish from editorial content",
          detail: "If appearing alongside articles or news, ensure clear visual separation and labelling."
        },
        {
          step: 3,
          action: "Avoid native advertising that misleads",
          detail: "Sponsored content must be clearly identified as such. The commercial nature must be obvious."
        },
        {
          step: 4,
          action: "Train influencers on disclosure",
          detail: "Ensure any influencers clearly identify paid partnerships and the promotional nature of content."
        }
      ],
      templateText: "ADVERTISEMENT | This is a financial promotion by [Firm Name]",
      fcaRef: "COBS 4.3.1R, ASA CAP Code",
      riskIfIgnored: "Disguised promotions mislead consumers about the nature of what they're reading."
    }
  },

  "3.2": {
    // Firm name included
    ifNo: {
      priority: "critical",
      title: "Add Firm Identification",
      summary: "The responsible firm must be clearly named",
      actions: [
        {
          step: 1,
          action: "Add the communicating firm's name",
          detail: "Include the registered name of the firm responsible for the promotion, clearly visible."
        },
        {
          step: 2,
          action: "For approved promotions, consider including approver",
          detail: "Where an FCA-authorised firm has approved the promotion for an unauthorised firm, consider including both names."
        },
        {
          step: 3,
          action: "Ensure name is prominent",
          detail: "The firm name should be visible without scrolling and in a reasonable font size."
        },
        {
          step: 4,
          action: "Include FCA registration details where required",
          detail: "For retail promotions, include the FCA registration number or state 'Authorised and regulated by the Financial Conduct Authority'."
        }
      ],
      templateText: "[Firm Name] is authorised and regulated by the Financial Conduct Authority (FRN: XXXXXX).",
      fcaRef: "COBS 4.5.2R(1)",
      riskIfIgnored: "Anonymous promotions prevent consumers from checking firm legitimacy and are non-compliant."
    }
  },

  "3.3": {
    // Approval date included for retail
    ifNo: {
      priority: "medium",
      title: "Add Approval Date",
      summary: "Include the date the promotion was approved",
      actions: [
        {
          step: 1,
          action: "Obtain and display approval date",
          detail: "Get the specific date the authorised firm approved this promotion."
        },
        {
          step: 2,
          action: "Format appropriately",
          detail: "Use a clear format: 'Approved [Date]' or 'This financial promotion was approved on [Date]'."
        },
        {
          step: 3,
          action: "Place in visible location",
          detail: "The date should be visible without excessive scrolling, typically near the firm identification."
        },
        {
          step: 4,
          action: "Update if promotion is re-approved",
          detail: "If the promotion is revised and re-approved, update the approval date accordingly."
        }
      ],
      templateText: "This financial promotion was approved by [Approving Firm] on [DD Month YYYY].",
      fcaRef: "COBS 4.5.2R(1A), FG24/1 2.30-2.32",
      riskIfIgnored: "Missing approval dates prevent consumers from assessing the timeliness of information."
    }
  },
};
