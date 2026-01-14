/**
 * Test data fixtures for FinProms E2E tests
 */

// Mock lead form data for contact scenarios
const mockLeadFormData = {
  validLead: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@testcompany.com',
    company: 'Test Financial Services Ltd',
    phone: '+44 20 1234 5678',
    message: 'Interested in the compliance assessment tool for our fintech startup.'
  },
  minimalLead: {
    email: 'minimal@test.com'
  }
};

// Test answers for different questionnaire scenarios
const testAnswers = {
  // All compliant answers (Yes to yes/no questions)
  allCompliant: {
    '1.1': { answer: 'Yes', notes: 'Communication is a clear invitation to invest' },
    '1.2': { answer: 'Yes', notes: 'Commercial interest is established' },
    '1.3': { answer: 'Yes', notes: 'Relates to controlled investment activity' },
    '1.4': { answer: 'Yes', notes: 'UK consumers can access this' },
    '1.5': { answer: 'authorised_person', notes: 'Firm is FCA authorised' },
    '1.6': { answer: 'non_real_time_website', notes: 'Website promotion' },
    '1.7': { answer: ['retail_client'], notes: 'Targeting retail investors' },
    '1.8': { answer: 'standard_investment', notes: 'Standard fund products' },
    '1.9': { answer: 'Yes', notes: 'Promotion reviewed and approved' },
    '1.10': { answer: 'Yes', notes: 'Standalone compliant' }
  },

  // Non-compliant scenario (No to critical questions)
  nonCompliant: {
    '1.1': { answer: 'No', notes: 'Purely informational content' },
    '1.2': { answer: 'No', notes: 'Personal communication' },
    '1.9': { answer: 'No', notes: 'Needs review' },
    '1.10': { answer: 'No', notes: 'Relies on linked content' }
  },

  // Partial completion for progress tests
  partialSection1: {
    '1.1': { answer: 'Yes', notes: 'Test note for 1.1' },
    '1.2': { answer: 'Yes', notes: 'Test note for 1.2' },
    '1.3': { answer: 'Yes', notes: '' }
  },

  // Mixed answers for realistic scenario
  mixedScenario: {
    '1.1': { answer: 'Yes', notes: 'Clear inducement present' },
    '1.2': { answer: 'Yes', notes: 'Business context confirmed' },
    '1.3': { answer: 'Yes', notes: 'Investment activity involved' },
    '1.4': { answer: 'Yes', notes: 'UK accessible' },
    '1.5': { answer: 'approved', notes: 'Approved by authorised firm' },
    '1.6': { answer: 'non_real_time_social_post', notes: 'Social media campaign' },
    '1.7': { answer: ['retail_client', 'professional_client'], notes: 'Mixed audience' },
    '1.8': { answer: 'cryptoasset_qualifying', notes: 'Crypto product' },
    '1.9': { answer: 'No', notes: 'Risk warnings need improvement' },
    '1.10': { answer: 'Yes', notes: 'Each post is compliant' }
  }
};

// Section titles for navigation tests
const sectionTitles = [
  'Section 1: Preliminary Checks & Scope',
  'Section 2: Core Principles',
  'Section 3: Identification & Information about the Firm',
  'Section 4: Risk Warnings & Specific Product Disclosures',
  'Section 5: Communication Channels & Specific Considerations',
  'Section 6: Approval, Record Keeping & Ongoing Monitoring'
];

// Question types for validation
const questionTypes = {
  yesNo: 'yesno',
  dropdown: 'dropdown',
  multiselect: 'multiselect'
};

// Expected first question data for verification
const firstQuestion = {
  id: '1.1',
  text: 'Is the communication an "invitation or inducement" to engage in an activity?',
  reference: 'PERG 8.4',
  type: 'yesno'
};

// Dropdown options for specific questions
const dropdownOptions = {
  '1.5': [
    { value: '', text: 'Select basis...' },
    { value: 'authorised_person', text: 'Communicated by an FCA authorised person' },
    { value: 'approved', text: 'Content approved by an FCA authorised person with approver permission (or exemption)' },
    { value: 'fpo_exempt', text: 'Communication is exempt under the Financial Promotion Order (FPO)' },
    { value: 'none', text: 'None of the above / Unsure' }
  ],
  '1.6': [
    { value: '', text: 'Select type...' },
    { value: 'non_real_time_website', text: 'Non-real time (Website / Email / Print)' },
    { value: 'non_real_time_social_post', text: 'Non-real time (Social Media Post/Static Ad)' },
    { value: 'non_real_time_social_video', text: 'Non-real time (Social Media Video/Story/Reel)' },
    { value: 'real_time_solicited', text: 'Real-time solicited (e.g., requested call/meeting)' },
    { value: 'real_time_unsolicited', text: 'Real-time unsolicited (e.g., cold call)' }
  ]
};

// Multiselect options for specific questions
const multiselectOptions = {
  '1.7': [
    { value: 'retail_client', text: 'Retail Client' },
    { value: 'professional_client', text: 'Professional Client' },
    { value: 'eligible_counterparty', text: 'Eligible Counterparty' },
    { value: 'mixed_audience_retail', text: 'Mixed Audience (including Retail Clients)' },
    { value: 'specific_hnw_sophisticated', text: 'Specific (e.g., High Net Worth / Sophisticated Investors only)' },
    { value: 'other_audience', text: 'Other (specify in notes)' }
  ]
};

// Notes field test data
const notesTestData = {
  shortNote: 'Brief justification for compliance decision.',
  maxLengthNote: 'A'.repeat(280), // Exactly 280 characters (max limit)
  overLengthNote: 'A'.repeat(300), // Over the 280 character limit
  specialCharNote: 'Note with special chars: & < > " \' @ # $ % ! ?',
  multilineNote: 'Line 1\nLine 2\nLine 3'
};

// Selectors used across tests
const selectors = {
  // Welcome screen
  startButton: '.start-button',
  welcomeHero: '.hero-section',
  contactButton: 'button:has-text("Contact Us")',

  // Choice Modal (appears after clicking start)
  choiceModal: '.choice-modal',
  quickStartButton: '.choice-option.quick-start',
  smartScanButton: '.choice-option.smart-scan',
  choiceModalClose: '.choice-modal-close',

  // Scenario Selector
  scenarioSelector: '.scenario-selector',
  scenarioCard: '.scenario-card',
  scenarioCardFirst: '.scenario-card:first-child',

  // Questionnaire
  questionCard: '.assessment-question-card',
  questionText: '.assessment-question-card h3',
  questionReference: '.question-reference',
  answerToggle: '.answer-toggle',
  answerToggleGroup: '.answer-toggle-group',
  selectedAnswer: '.answer-toggle[data-selected="true"]',
  notesField: '.notes-field textarea',
  notesCounter: '.notes-counter',

  // Navigation
  nextButton: 'button:has-text("Next")',
  previousButton: 'button:has-text("Previous")',
  finishButton: 'button:has-text("Finish & View Results")',
  viewResultsButton: 'button:has-text("View Results")',

  // Progress
  progressBar: '.progress-bar',
  progressMetrics: '.progress-metrics',
  stepper: '.stepper',
  stepperStep: '.step',
  stepperStepActive: '.step.active',
  stepperStepCompleted: '.step.completed',

  // Insights panel
  insightsPanel: '.assessment-insights',
  insightCard: '.insight-card',

  // Results page
  resultsPage: '[class*="results"]',

  // Modal / Drawer
  guidanceModal: '.guidance-modal',
  drawerContainer: '.drawer-container',
  drawerToggle: '.drawer-toggle-btn'
};

/**
 * Helper function to navigate through the app flow to questionnaire
 * Flow: Home -> Click Start -> Choice Modal -> Quick Start -> Scenario Selector -> Select Scenario -> Questionnaire
 * @param {import('@playwright/test').Page} page
 */
async function navigateToQuestionnaire(page) {
  // Step 1: Go to home page
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Step 2: Click Start Assessment button (opens Choice Modal)
  const startButton = page.locator('.start-button').first();
  await startButton.click();

  // Step 3: Wait for Choice Modal and click Quick Start
  await page.waitForSelector('.choice-modal', { timeout: 5000 });
  const quickStartBtn = page.locator('.choice-option.quick-start');
  await quickStartBtn.click();

  // Step 4: Wait for Scenario Selector and select first scenario (Full Assessment)
  await page.waitForSelector('.scenario-selector', { timeout: 5000 });
  const scenarioCard = page.locator('.scenario-card').first();
  await scenarioCard.click();

  // Step 5: Wait for questionnaire to load
  await page.waitForSelector('.assessment-question-card', { timeout: 10000 });
}

module.exports = {
  mockLeadFormData,
  testAnswers,
  sectionTitles,
  questionTypes,
  firstQuestion,
  dropdownOptions,
  multiselectOptions,
  notesTestData,
  selectors,
  navigateToQuestionnaire
};
