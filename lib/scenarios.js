// Scenario/Promotion Type Configuration for MEMA Q-App

export const SCENARIOS = {
  SOCIAL_MEDIA: 'social_media',
  WEBSITE: 'website',
  EMAIL: 'email',
  PRINT: 'print',
  ALL: 'all'
};

export const SCENARIO_CONFIG = {
  social_media: {
    id: 'social_media',
    label: 'Social Media',
    description: 'Instagram, TikTok, LinkedIn, Twitter/X posts and campaigns',
    shortDesc: 'Posts, stories, reels & ads',
    icon: 'social',
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    questionCount: 28,
    // Tailored content for insights panel
    examples: [
      'Instagram story with "swipe up to invest" CTA',
      'TikTok video promoting crypto trading app',
      'LinkedIn post about investment returns',
      'Twitter/X thread with affiliate links'
    ],
    bestPractice: 'Ensure influencer disclosures are prominent (#ad, #sponsored). Platform character limits may require linking to full risk warnings rather than including in-post.',
    reportTitle: 'Social Media Compliance Report',
    mockupImage: '/mockups/SocialMedia_Mockpng.png',
    mockupAlt: 'Example Instagram investment promotion post'
  },
  website: {
    id: 'website',
    label: 'Website',
    description: 'Landing pages, banners, pop-ups and website content',
    shortDesc: 'Web pages & banners',
    icon: 'globe',
    color: '#0EA5E9',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
    questionCount: 26,
    examples: [
      'Pop-up banner showing investment returns',
      'Landing page with customer testimonials',
      'Homepage hero with product promotions',
      'Comparison tables for financial products'
    ],
    bestPractice: 'Ensure risk warnings have equal prominence to benefits. Use clear navigation to terms and conditions. Avoid auto-play videos that skip disclaimers.',
    reportTitle: 'Website Compliance Report',
    mockupImage: '/mockups/Smart investing landing page.png',
    mockupAlt: 'Example investment website landing page'
  },
  email: {
    id: 'email',
    label: 'Email',
    description: 'Marketing emails, newsletters and direct communications',
    shortDesc: 'Campaigns & newsletters',
    icon: 'mail',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
    questionCount: 26,
    examples: [
      'Newsletter featuring new investment products',
      'Direct marketing email with special offers',
      'Automated drip campaign sequences',
      'Product launch announcement emails'
    ],
    bestPractice: 'Include unsubscribe links and clear sender identification. Risk warnings must appear in the email body, not just as links. Subject lines must not be misleading.',
    reportTitle: 'Email Marketing Compliance Report',
    mockupImage: '/mockups/email marketing mockup.png',
    mockupAlt: 'Example investment marketing email'
  },
  print: {
    id: 'print',
    label: 'Print',
    description: 'Brochures, leaflets, posters and physical materials',
    shortDesc: 'Brochures & leaflets',
    icon: 'document',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    questionCount: 26,
    examples: [
      'Brochure with fund performance charts',
      'Leaflet with product comparison tables',
      'Poster displaying promotional rates',
      'Direct mail with application forms'
    ],
    bestPractice: 'Ensure font sizes meet accessibility standards (minimum 8pt for disclaimers). Past performance disclaimers must be proximate to any figures, not relegated to back pages.',
    reportTitle: 'Print Materials Compliance Report',
    mockupImage: '/mockups/investment guide layout.png',
    mockupAlt: 'Example ISA investment brochure'
  },
  all: {
    id: 'all',
    label: 'Full Assessment',
    description: 'Comprehensive review covering all communication channels',
    shortDesc: 'All 28 questions',
    icon: 'clipboard',
    color: '#1E293B',
    gradient: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
    questionCount: 28,
    recommended: true,
    examples: [
      'Multi-channel campaign materials',
      'Cross-platform promotional content',
      'Integrated marketing communications',
      'Brand-wide messaging templates'
    ],
    bestPractice: 'Apply consistent compliance standards across all channels. Document approval chains for each medium. Ensure messaging is coherent when viewed across touchpoints.',
    reportTitle: 'Full Compliance Assessment Report',
    mockupImage: '/mockups/multi-channel collage.png',
    mockupAlt: 'Multi-channel campaign overview showing social, web, email and print'
  }
};

// Get scenario by ID
export const getScenario = (id) => SCENARIO_CONFIG[id] || null;

// Get all scenarios as array
export const getAllScenarios = () => Object.values(SCENARIO_CONFIG);

// Get scenarios for display (ordered)
export const getOrderedScenarios = () => [
  SCENARIO_CONFIG.social_media,
  SCENARIO_CONFIG.website,
  SCENARIO_CONFIG.email,
  SCENARIO_CONFIG.print,
  SCENARIO_CONFIG.all
];
