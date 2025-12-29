// Section 4: Risk Warnings & Product Disclosures

export const section4_risk = {

  "4.1": {
    // Risk warnings prominent and not obscured
    ifNo: {
      priority: "critical",
      title: "Make Risk Warnings Prominent and Visible",
      summary: "All risk warnings must be immediately visible and not hidden",
      actions: [
        {
          step: 1,
          action: "Position risk warnings prominently",
          detail: "Place risk warnings where they will be seen without scrolling or clicking. Ideally in the first screen/fold."
        },
        {
          step: 2,
          action: "Use adequate font size",
          detail: "Risk warnings should be at least the same size as the main body text. Never use small print."
        },
        {
          step: 3,
          action: "Ensure colour contrast",
          detail: "Text must be readable against the background. Black on white or similar high-contrast combinations."
        },
        {
          step: 4,
          action: "Avoid truncation on social media",
          detail: "Do not hide warnings behind 'see more' links. They must be visible in the initial view."
        },
        {
          step: 5,
          action: "Test on mobile devices",
          detail: "Verify warnings display correctly on the smallest likely screen size."
        }
      ],
      templateText: "Capital at risk. You may lose some or all of your investment.",
      fcaRef: "FG24/1 2.43, COBS 4.12A.36R",
      riskIfIgnored: "Hidden or obscured warnings are a priority issue for the FCA and lead to enforcement action."
    }
  },

  "4.2": {
    // RMMI requirements met
    ifNo: {
      priority: "critical",
      title: "Comply with Restricted Mass Market Investment Rules",
      summary: "Strict requirements apply to high-risk investment promotions",
      actions: [
        {
          step: 1,
          action: "Use the prescribed risk warning",
          detail: "Include the exact wording from COBS 4 Annex 1R: 'Don't invest unless you're prepared to lose all the money you invest. This is a high-risk investment and you are unlikely to be protected if something goes wrong.'"
        },
        {
          step: 2,
          action: "Remove banned incentives",
          detail: "For cryptoassets: Remove any refer-a-friend bonuses, new customer bonuses, or similar incentives to invest."
        },
        {
          step: 3,
          action: "For direct offers, implement all requirements",
          detail: "Ensure: 14-day cooling-off period, personalised risk warning, client categorisation (restricted/HNW/sophisticated), appropriateness assessment."
        },
        {
          step: 4,
          action: "Verify client eligibility",
          detail: "Implement robust processes to categorise clients and ensure only eligible investors can access these products."
        }
      ],
      templateText: "Don't invest unless you're prepared to lose all the money you invest. This is a high-risk investment and you are unlikely to be protected if something goes wrong. Take 2 mins to learn more.",
      fcaRef: "COBS 4.12A, FG24/1 2.40",
      riskIfIgnored: "RMMI breaches attract significant FCA attention. Recent enforcement has included large fines and business restrictions."
    }
  },

  "4.3": {
    // NMMI requirements met
    ifNo: {
      priority: "critical",
      title: "Comply with Non-Mass Market Investment Restrictions",
      summary: "These investments generally cannot be promoted to retail clients",
      actions: [
        {
          step: 1,
          action: "Verify you have a valid exemption",
          detail: "NMMIs can only be promoted to retail clients under narrow exemptions: certified High Net Worth (£100k+ income or £250k+ net assets) or certified Sophisticated investors."
        },
        {
          step: 2,
          action: "Obtain valid investor certifications",
          detail: "Before promoting, ensure you have current (within 12 months) self-certifications from investors confirming their status."
        },
        {
          step: 3,
          action: "Conduct preliminary suitability assessment",
          detail: "You must assess whether the investment is broadly suitable for the investor before promotion."
        },
        {
          step: 4,
          action: "Include all required warnings",
          detail: "Use prescribed warnings including: risk of losing all capital, illiquidity risk, lack of FSCS protection."
        },
        {
          step: 5,
          action: "Consider if mass promotion is appropriate",
          detail: "Even with exemptions, consider whether broad promotion of NMMIs is consistent with Consumer Duty."
        }
      ],
      templateText: "This investment is not suitable for most retail investors. You could lose all of your investment. This investment is illiquid - you may not be able to sell your investment when you want to.",
      fcaRef: "COBS 4.12B, FG24/1 2.39",
      riskIfIgnored: "Promoting NMMIs to ineligible retail clients is a serious breach with potential for significant consumer harm."
    }
  },
};
