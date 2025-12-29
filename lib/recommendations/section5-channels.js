// Section 5: Communication Channels

export const section5_channels = {

  "5.1": {
    // Social media standalone compliance
    ifNo: {
      priority: "critical",
      title: "Make Each Social Media Post Standalone Compliant",
      summary: "Every post must meet all requirements independently",
      actions: [
        {
          step: 1,
          action: "Review each post in isolation",
          detail: "Look at each post, story, video, or meme as if it's the only thing the consumer will see. Does it comply on its own?"
        },
        {
          step: 2,
          action: "Include essential elements in each post",
          detail: "Every post needs: firm name, appropriate risk warning, balanced view, not misleading content."
        },
        {
          step: 3,
          action: "Do not rely on links for compliance",
          detail: "Information on a linked landing page does not make the post compliant. The FCA is clear on this."
        },
        {
          step: 4,
          action: "If character-limited, prioritise critical information",
          detail: "On platforms with character limits: risk warning and firm name take priority. Consider if the platform is suitable for the product."
        },
        {
          step: 5,
          action: "Review memes and informal content",
          detail: "Memes can be financial promotions if they induce investment activity. They must also comply."
        }
      ],
      templateText: "Capital at risk. [Firm Name]. Your investment may go down as well as up.",
      fcaRef: "FG24/1 2.20-2.23, 2.37",
      riskIfIgnored: "Non-compliant social media posts have been a major FCA enforcement focus."
    }
  },

  "5.2": {
    // Influencer/affiliate oversight
    ifNo: {
      priority: "critical",
      title: "Implement Robust Influencer Oversight",
      summary: "You are responsible for promotions made by your influencers and affiliates",
      actions: [
        {
          step: 1,
          action: "Establish written agreements",
          detail: "Have clear contracts requiring compliance with financial promotion rules and your approval of content."
        },
        {
          step: 2,
          action: "Provide compliance training",
          detail: "Train influencers on: what they can/cannot say, required disclosures, approval processes, consequences of breach."
        },
        {
          step: 3,
          action: "Approve content before posting",
          detail: "Review and formally approve all promotional content before it goes live. Keep records."
        },
        {
          step: 4,
          action: "Monitor published content",
          detail: "Regularly check what influencers are actually posting. Have processes to address non-compliant content quickly."
        },
        {
          step: 5,
          action: "Act on breaches swiftly",
          detail: "If non-compliant content is posted: require immediate removal, understand what went wrong, take remedial action."
        }
      ],
      templateText: null,
      fcaRef: "FG24/1 3.18-3.24, 4.12-4.15",
      riskIfIgnored: "Firms are liable for influencer promotions. The FCA has named influencer oversight as a priority concern."
    }
  },
};
