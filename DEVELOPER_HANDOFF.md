# MEMA Q-App Developer Handoff Document
**FinProms - FCA Financial Promotions Compliance Assessment Tool**

Last Updated: November 10, 2025
Project Status: Phase 3 Complete, Phase 4 In Progress
Estimated Completion Time: 20-30 hours

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Current State](#current-state)
3. [Tech Stack & Dependencies](#tech-stack--dependencies)
4. [Project Structure](#project-structure)
5. [Phase 4: Implementation Guide](#phase-4-implementation-guide)
6. [Phase 5: Production Readiness](#phase-5-production-readiness)
7. [Phase 6: Enhanced Features](#phase-6-enhanced-features)
8. [API Documentation](#api-documentation)
9. [Database Schema](#database-schema)
10. [Environment Variables](#environment-variables)
11. [Testing Strategy](#testing-strategy)
12. [Deployment Guide](#deployment-guide)
13. [Known Issues & Technical Debt](#known-issues--technical-debt)

---

## Project Overview

### Purpose
MEMA Q-App is an interactive compliance assessment tool that helps financial services firms evaluate their FCA (Financial Conduct Authority) PERG 8 financial promotions compliance status.

### Key Features
- Multi-section questionnaire with dynamic question types (Yes/No, Dropdown, Multiselect)
- Progress tracking with breadcrumb navigation and stepper component
- Real-time compliance analysis with visual charts (Chart.js)
- Lead capture with email notifications (Resend API)
- CSV export of assessment results
- Premium dark theme with glass morphism design

### User Flow
1. **Welcome Screen** → Introduction and overview
2. **Questionnaire** → 6 sections with multiple questions per section
3. **Results Page** → Compliance score + preview of issues (first 2 sections)
4. **Lead Capture Form** → Unlock full report
5. **Full Report** → Complete compliance analysis + CSV download

---

## Current State

### ✅ Completed (Phases 1-3)
- [x] Project setup with Next.js 15 & React 19
- [x] Database schema with Prisma + PostgreSQL (Neon)
- [x] All core components built:
  - WelcomeScreen
  - Questionnaire (with sidebar panel)
  - ResultsPage (with charts and lead capture)
  - Stepper (navigation between sections)
  - Breadcrumb navigation
  - ProgressBar
- [x] API routes for questions and leads
- [x] Email integration with Resend API
- [x] CSV export functionality
- [x] Light theme fully implemented
- [x] Dark theme foundation (CSS variables defined)

### 🚧 In Progress (Phase 4)
- [ ] Complete dark theme implementation
- [ ] Theme toggle component
- [ ] Enhanced results page features
- [ ] Full data persistence testing

### 📋 Pending (Phases 5-6)
- Production deployment preparation
- Performance optimization
- Advanced features (save/resume, admin dashboard)

---

## Tech Stack & Dependencies

### Framework & Core
```json
{
  "next": "^15.3.3",
  "react": "^19.1.0",
  "react-dom": "^19.1.0"
}
```

### Database & ORM
```json
{
  "@prisma/client": "^6.9.0",
  "prisma": "^6.9.0"
}
```
- **Database**: PostgreSQL (Neon - cloud-hosted)
- **Connection**: Pooler endpoint for better performance

### UI & Visualization
```json
{
  "@heroicons/react": "^2.2.0",
  "chart.js": "^4.5.0",
  "react-chartjs-2": "^5.3.0",
  "tailwindcss": "^3"
}
```

### Email Service
```json
{
  "resend": "^4.6.0"
}
```

### Development Tools
- ESLint (Next.js config)
- PostCSS
- Autoprefixer

---

## Project Structure

```
mema-q-app/
├── .env.local                    # Environment variables (not in git)
├── .env.example                  # Environment variables template
├── .gitignore
├── package.json
├── package-lock.json
│
├── prisma/
│   ├── schema.prisma            # Database schema definition
│   └── scripts/
│       └── seed.js              # Database seeding script
│
├── lib/
│   └── prisma.js                # Prisma client singleton
│
├── pages/
│   ├── _app.js                  # Next.js app wrapper
│   ├── _document.js             # Custom document
│   ├── index.js                 # Main app logic & state management
│   └── api/
│       ├── questions.js         # GET questions grouped by section
│       └── leads.js             # POST lead + email sending
│
├── components/
│   ├── WelcomeScreen.js         # Landing page
│   ├── Questionnaire.js         # Question display & answer capture
│   ├── ResultsPage.js           # Analysis, charts, lead form
│   ├── Stepper.js               # Section navigation
│   ├── Breadcrumb.js            # Breadcrumb navigation
│   └── ProgressBar.js           # Progress tracking
│
├── styles/
│   ├── globals.css              # Main styles + light theme
│   └── mema-dark-theme.css      # Dark theme styles (partial)
│
└── public/
    └── [static assets]
```

---

## Phase 4: Implementation Guide

**Estimated Time: 10-12 hours**

### Task 4.1: Complete Dark Theme (3-4 hours)

#### Step 1: Create Theme Context
**File: `lib/ThemeContext.js`** (NEW FILE)

```javascript
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('mema-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('mema-dark-theme', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('mema-theme', newTheme);
    document.documentElement.classList.toggle('mema-dark-theme', newTheme === 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
```

#### Step 2: Update _app.js
**File: `pages/_app.js`**

```javascript
import { ThemeProvider } from '../lib/ThemeContext';
import '../styles/globals.css';
import '../styles/mema-dark-theme.css';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

#### Step 3: Create Theme Toggle Component
**File: `components/ThemeToggle.js`** (NEW FILE)

```javascript
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../lib/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      style={{
        background: theme === 'light' ? 'var(--color-accent-primary)' : 'var(--glass-bg)',
        color: theme === 'light' ? 'white' : 'var(--accent-teal)',
        border: theme === 'dark' ? '1px solid var(--glass-border)' : 'none',
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all var(--transition-base)',
        boxShadow: theme === 'dark' ? 'var(--shadow-glow-teal)' : 'var(--shadow-md)'
      }}
    >
      {theme === 'light' ? (
        <MoonIcon style={{ width: '1.5rem', height: '1.5rem' }} />
      ) : (
        <SunIcon style={{ width: '1.5rem', height: '1.5rem' }} />
      )}
    </button>
  );
}
```

#### Step 4: Add Toggle to Header
**File: `pages/index.js`** (Line 256 - header section)

Add import:
```javascript
import ThemeToggle from '../components/ThemeToggle';
```

Modify header:
```javascript
<header className="glass-panel sticky top-0 z-50" style={{margin: '1rem 0', borderRadius: '12px'}}>
  <div className="container mx-auto px-4 py-3 flex justify-between items-center">
    <ThemeToggle />
    {appState === 'questionnaire' && (
      <button onClick={handleShowResults} className="btn-primary-dark">
        View Results
      </button>
    )}
  </div>
</header>
```

#### Step 5: Complete Dark Theme CSS Variables
**File: `styles/mema-dark-theme.css`**

Add missing components (already mostly complete, verify these additions):

```css
/* Chart.js Dark Theme Overrides */
.mema-dark-theme .chart-container {
  background: var(--glass-bg) !important;
  border: 1px solid var(--glass-border) !important;
}

/* Form inputs dark theme */
.mema-dark-theme input,
.mema-dark-theme textarea,
.mema-dark-theme select {
  background: var(--glass-bg-lighter);
  border-color: var(--glass-border);
  color: var(--text-primary-dark);
}

.mema-dark-theme input:focus,
.mema-dark-theme textarea:focus,
.mema-dark-theme select:focus {
  border-color: var(--accent-teal);
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
}

/* Question card dark theme */
.mema-dark-theme .question-card {
  background: var(--glass-bg) !important;
  border: 1px solid var(--glass-border) !important;
  color: var(--text-primary-dark);
}

/* Answer options dark theme */
.mema-dark-theme .answer-card-large {
  background: var(--glass-bg-lighter) !important;
  border-color: var(--glass-border) !important;
  color: var(--text-primary-dark);
}

.mema-dark-theme .answer-card-large[data-selected="true"] {
  background: var(--gradient-teal-green) !important;
  border-color: var(--accent-teal) !important;
  box-shadow: var(--shadow-glow-teal) !important;
}
```

#### Testing Checklist
- [ ] Theme toggle button appears in header
- [ ] Clicking toggle switches between light/dark
- [ ] Theme preference persists on page reload
- [ ] All components visible in dark mode
- [ ] Text contrast meets WCAG AA (4.5:1 minimum)
- [ ] Charts render correctly in dark mode
- [ ] Form inputs styled properly in dark mode

---

### Task 4.2: Enhanced Results Page (2-3 hours)

#### Enhancement 1: Add Print Stylesheet
**File: `styles/globals.css`** (add at end)

```css
/* Print Styles */
@media print {
  body {
    background: white !important;
  }

  .no-print,
  header,
  .btn-back,
  .theme-toggle-btn {
    display: none !important;
  }

  .card,
  .risk-card,
  .summary-card {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .chart-container {
    max-height: 400px;
  }
}
```

#### Enhancement 2: Add Print Button
**File: `components/ResultsPage.js`** (after CSV export button)

Add import:
```javascript
import { PrinterIcon } from '@heroicons/react/24/outline';
```

Add handler:
```javascript
const handlePrint = () => {
  window.print();
};
```

Add button (around line 403):
```javascript
<button
  onClick={handlePrint}
  className="start-button"
  style={{
    background: 'var(--color-accent-primary)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    marginLeft: 'var(--spacing-md)'
  }}
>
  <PrinterIcon style={{ width: '1.5rem', height: '1.5rem' }} />
  Print Report
</button>
```

#### Enhancement 3: Email Results Button
**File: `components/ResultsPage.js`**

Add state (around line 22):
```javascript
const [emailSending, setEmailSending] = useState(false);
```

Add handler:
```javascript
const handleEmailResults = async () => {
  setEmailSending(true);
  try {
    const response = await fetch('/api/send-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: leadEmail,
        results: results,
        questions: questions,
        answers: answers
      }),
    });

    if (!response.ok) throw new Error('Failed to send email');

    alert('Results sent successfully to your email!');
  } catch (error) {
    alert('Failed to send email. Please try again.');
  } finally {
    setEmailSending(false);
  }
};
```

#### Enhancement 4: Create Email Results API
**File: `pages/api/send-results.js`** (NEW FILE)

```javascript
import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ message: 'Email service not configured' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { email, results, questions, answers } = req.body;

  if (!email || !results) {
    return res.status(400).json({ message: 'Email and results are required' });
  }

  try {
    // Generate CSV
    const headers = ["Question", "Regulation Reference", "Your Answer", "Your Notes"];
    const rows = [];

    questions.forEach(section => {
      section.items.forEach(item => {
        const userAnswer = answers[item.id];
        const answerText = userAnswer?.answer ? JSON.stringify(userAnswer.answer).replace(/"/g, '') : 'N/A';
        const notesText = userAnswer?.notes || '';

        const row = [
          `"${item.questionText.replace(/"/g, '""')}"`,
          `"${item.questionRef.replace(/"/g, '""')}"`,
          `"${answerText.replace(/"/g, '""')}"`,
          `"${notesText.replace(/"/g, '""')}"`
        ];
        rows.push(row.join(','));
      });
    });

    const csvData = [headers.join(','), ...rows].join('\n');
    const csvBuffer = Buffer.from(csvData, 'utf-8');

    await resend.emails.send({
      from: 'MEMA Consultants <onboarding@resend.dev>',
      to: email,
      subject: 'Your MEMA Financial Promotions Compliance Report',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #007BFF;">Your Compliance Assessment Results</h1>
          <p>Thank you for completing the MEMA FinProms assessment.</p>

          <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #10b981;">Health Score: ${results.healthScore}%</h2>
            <p><strong>Issues Found:</strong> ${results.potentialFailures.length}</p>
          </div>

          <p>Your complete assessment report is attached.</p>

          <p style="margin-top: 30px;">
            <strong>Need help with compliance?</strong><br>
            Contact us at <a href="mailto:contact@memaconsultants.com">contact@memaconsultants.com</a>
          </p>
        </div>
      `,
      attachments: [
        {
          filename: 'MEMA_Compliance_Report.csv',
          content: csvBuffer,
        },
      ],
    });

    return res.status(200).json({ message: 'Email sent successfully' });

  } catch (error) {
    console.error("Error sending results email:", error);
    return res.status(500).json({ message: error.message || 'Failed to send email' });
  }
}
```

---

### Task 4.3: Data Persistence & Testing (2-3 hours)

#### Test Scenario 1: Database Connection
**File: `pages/api/test-db.js`** (NEW FILE - for testing only)

```javascript
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  try {
    const questionsCount = await prisma.question.count();
    const leadsCount = await prisma.lead.count();
    const responsesCount = await prisma.userResponse.count();

    res.status(200).json({
      status: 'connected',
      counts: {
        questions: questionsCount,
        leads: leadsCount,
        responses: responsesCount
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}
```

**Testing Steps:**
1. Run `npm run dev`
2. Visit `http://localhost:3000/api/test-db`
3. Verify you see: `{"status":"connected","counts":{...}}`
4. Delete test file before deployment

#### Test Scenario 2: Lead Submission Flow
**Manual Testing Steps:**
1. Complete questionnaire
2. View results page
3. Fill out lead form with valid email
4. Submit form
5. Verify:
   - Success message appears
   - Full report unlocks
   - Email received (check spam folder)
   - CSV attachment in email
   - Lead saved in database

#### Test Scenario 3: Email Service
Create a simple test script:

**File: `scripts/test-email.js`** (NEW FILE)

```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const result = await resend.emails.send({
      from: 'MEMA App <onboarding@resend.dev>',
      to: 'your-test-email@example.com', // Change this
      subject: 'MEMA App Test Email',
      html: '<p>This is a test email from MEMA Q-App.</p>'
    });

    console.log('✅ Email sent successfully:', result);
  } catch (error) {
    console.error('❌ Email failed:', error);
  }
}

testEmail();
```

Run: `node scripts/test-email.js`

---

### Task 4.4: Session/Progress Save Feature (3-4 hours)

#### Implementation Plan

This feature allows users to save their progress and resume later.

#### Step 1: Add SessionId to State
**File: `pages/index.js`**

Add state (around line 30):
```javascript
const [sessionId, setSessionId] = useState(null);

useEffect(() => {
  // Generate or retrieve session ID
  let sid = localStorage.getItem('mema-session-id');
  if (!sid) {
    sid = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('mema-session-id', sid);
  }
  setSessionId(sid);
}, []);
```

#### Step 2: Auto-save Progress
Add save function:
```javascript
const saveProgress = async () => {
  if (!sessionId) return;

  try {
    await fetch('/api/save-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        currentSection,
        currentQuestion,
        answers
      })
    });
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

// Auto-save on answer change
useEffect(() => {
  if (Object.keys(answers).length > 0) {
    const timeoutId = setTimeout(saveProgress, 1000); // Debounce 1 second
    return () => clearTimeout(timeoutId);
  }
}, [answers, currentSection, currentQuestion]);
```

#### Step 3: Create Save Progress API
**File: `pages/api/save-progress.js`** (NEW FILE)

```javascript
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId, currentSection, currentQuestion, answers } = req.body;

  if (!sessionId) {
    return res.status(400).json({ message: 'Session ID required' });
  }

  try {
    // Save each answer as a UserResponse
    for (const [questionId, answerData] of Object.entries(answers)) {
      await prisma.userResponse.upsert({
        where: {
          sessionId_questionId: {
            sessionId,
            questionId
          }
        },
        update: {
          answer: answerData.answer,
          notes: answerData.notes
        },
        create: {
          sessionId,
          questionId,
          answer: answerData.answer,
          notes: answerData.notes
        }
      });
    }

    res.status(200).json({ message: 'Progress saved' });

  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ message: error.message });
  }
}
```

#### Step 4: Update Prisma Schema
**File: `prisma/schema.prisma`**

Update UserResponse model:
```prisma
model UserResponse {
  id          String   @id @default(cuid())
  sessionId   String
  answer      Json
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  question    Question @relation(fields: [questionId], references: [id])
  questionId  String

  @@unique([sessionId, questionId])
  @@index([sessionId])
}
```

Run migration:
```bash
npx prisma db push
```

#### Step 5: Load Saved Progress
**File: `pages/index.js`**

Add useEffect:
```javascript
useEffect(() => {
  const loadProgress = async () => {
    if (!sessionId || questions.length === 0) return;

    try {
      const response = await fetch(`/api/load-progress?sessionId=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.answers) {
          setAnswers(data.answers);
          // Optionally restore position
          // setCurrentSection(data.currentSection || 0);
          // setCurrentQuestion(data.currentQuestion || 0);
        }
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  loadProgress();
}, [sessionId, questions]);
```

#### Step 6: Create Load Progress API
**File: `pages/api/load-progress.js`** (NEW FILE)

```javascript
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId } = req.query;

  if (!sessionId) {
    return res.status(400).json({ message: 'Session ID required' });
  }

  try {
    const responses = await prisma.userResponse.findMany({
      where: { sessionId }
    });

    const answers = {};
    responses.forEach(response => {
      answers[response.questionId] = {
        answer: response.answer,
        notes: response.notes
      };
    });

    res.status(200).json({ answers });

  } catch (error) {
    console.error('Error loading progress:', error);
    res.status(500).json({ message: error.message });
  }
}
```

---

## Phase 5: Production Readiness

**Estimated Time: 8-10 hours**

### Task 5.1: Build & Deployment Testing (2 hours)

#### Pre-deployment Checklist

1. **Environment Variables Audit**
```bash
# Verify all required variables
cat .env.example
cat .env.local  # DON'T commit this!
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `RESEND_API_KEY` - Resend API key for emails

2. **Test Production Build**
```bash
# Build the app
npm run build

# Check for build errors
# Common errors:
# - Missing environment variables
# - Type errors (though we're using .js)
# - Module import issues
```

3. **Run Production Locally**
```bash
npm start
# Visit http://localhost:3000
# Test full user flow
```

4. **Database Migration Check**
```bash
# Ensure Prisma schema is synced
npx prisma generate
npx prisma db push

# Or for production with migrations:
npx prisma migrate deploy
```

#### Vercel Deployment (Recommended)

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Login & Deploy**
```bash
vercel login
vercel  # Follow prompts
```

**Step 3: Configure Environment Variables**
In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   - `DATABASE_URL` (from Neon dashboard)
   - `RESEND_API_KEY` (from Resend dashboard)

**Step 4: Configure Build Settings**
```json
// vercel.json (optional, Vercel auto-detects Next.js)
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

**Step 5: Deploy**
```bash
vercel --prod
```

---

### Task 5.2: Performance Optimization (3-4 hours)

#### Optimization 1: Image Optimization
Next.js has built-in image optimization. If you add images:

**Replace:**
```html
<img src="/logo.png" alt="MEMA Logo" />
```

**With:**
```javascript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="MEMA Logo"
  width={200}
  height={50}
  priority // For above-fold images
/>
```

#### Optimization 2: Code Splitting & Lazy Loading
**File: `pages/index.js`**

```javascript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const ResultsPage = dynamic(() => import('../components/ResultsPage'), {
  loading: () => <div>Loading results...</div>,
  ssr: false
});

const Chart = dynamic(() => import('react-chartjs-2'), {
  ssr: false // Charts don't need SSR
});
```

#### Optimization 3: Chart.js Bundle Size
**File: `components/ResultsPage.js`**

Only import what you need:
```javascript
// BEFORE (imports everything)
import { Chart as ChartJS } from 'chart.js';

// AFTER (tree-shaking)
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

// Only register what we use
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);
```

#### Optimization 4: Database Query Optimization
**File: `pages/api/questions.js`**

Current implementation is efficient (single query with grouping).

For future: Add caching:
```javascript
// Add at top of file
let cachedQuestions = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Check cache
      if (cachedQuestions && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
        return res.status(200).json(cachedQuestions);
      }

      // Fetch from database
      const flatQuestions = await prisma.question.findMany({
        orderBy: { id: 'asc' },
      });

      const groupedBySection = flatQuestions.reduce((acc, question) => {
        // ... existing grouping logic ...
      }, []);

      // Update cache
      cachedQuestions = groupedBySection;
      cacheTime = Date.now();

      res.status(200).json(groupedBySection);

    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

#### Optimization 5: Add Loading States
**File: `components/Questionnaire.js`** (already has loading state)

**File: `components/ResultsPage.js`** (already has loading state)

Verify all async operations show loading feedback.

---

### Task 5.3: Error Handling & Boundaries (2-3 hours)

#### Error Boundary 1: Global Error Handler
**File: `pages/_error.js`** (NEW FILE)

```javascript
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function Error({ statusCode, message }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-light)',
      padding: '2rem'
    }}>
      <div className="card" style={{
        textAlign: 'center',
        maxWidth: '500px',
        padding: '3rem'
      }}>
        <ExclamationTriangleIcon style={{
          width: '5rem',
          height: '5rem',
          color: 'var(--color-danger)',
          margin: '0 auto 1.5rem'
        }} />
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'var(--font-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: '1rem'
        }}>
          {statusCode ? `Error ${statusCode}` : 'An error occurred'}
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: 'var(--color-text-secondary)',
          marginBottom: '2rem'
        }}>
          {message || 'Something went wrong. Please try again.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="start-button"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const message = err?.message;
  return { statusCode, message };
};

export default Error;
```

#### Error Boundary 2: API Error Handling
Ensure all API routes return consistent error formats:

```javascript
// Standard error response
return res.status(400).json({
  success: false,
  message: 'User-friendly error message',
  error: process.env.NODE_ENV === 'development' ? error.stack : undefined
});

// Standard success response
return res.status(200).json({
  success: true,
  data: { /* response data */ },
  message: 'Operation successful'
});
```

Update all API files (`pages/api/*.js`) to follow this pattern.

#### Error Boundary 3: Client-Side Error Logging
**File: `pages/_app.js`**

```javascript
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Log unhandled errors
    const handleError = (event) => {
      console.error('Unhandled error:', event.error);
      // TODO: Send to error tracking service (Sentry, etc.)
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
```

---

### Task 5.4: Security Enhancements (1-2 hours)

#### Security 1: Input Sanitization
**File: `pages/api/leads.js`**

Add sanitization:
```javascript
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 500); // Limit length
}

export default async function handler(req, res) {
  // ... existing code ...

  const { email, phone, firm } = req.body;

  // Sanitize inputs
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedPhone = sanitizeInput(phone);
  const sanitizedFirm = sanitizeInput(firm);

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitizedEmail)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // ... rest of handler ...
}
```

#### Security 2: Rate Limiting
**File: `lib/rateLimit.js`** (NEW FILE)

```javascript
const rateLimit = {};

export function checkRateLimit(ip, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();

  if (!rateLimit[ip]) {
    rateLimit[ip] = { count: 1, resetTime: now + windowMs };
    return true;
  }

  if (now > rateLimit[ip].resetTime) {
    rateLimit[ip] = { count: 1, resetTime: now + windowMs };
    return true;
  }

  if (rateLimit[ip].count >= maxRequests) {
    return false;
  }

  rateLimit[ip].count++;
  return true;
}
```

**Use in API routes:**
```javascript
import { checkRateLimit } from '../../lib/rateLimit';

export default async function handler(req, res) {
  // Get IP address
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Check rate limit (10 requests per minute)
  if (!checkRateLimit(ip, 10, 60000)) {
    return res.status(429).json({
      message: 'Too many requests. Please try again later.'
    });
  }

  // ... rest of handler ...
}
```

#### Security 3: Environment Variables Validation
**File: `lib/validateEnv.js`** (NEW FILE)

```javascript
export function validateEnv() {
  const required = ['DATABASE_URL', 'RESEND_API_KEY'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return true;
}
```

**Use in `pages/_app.js`:**
```javascript
import { validateEnv } from '../lib/validateEnv';

if (process.env.NODE_ENV === 'production') {
  validateEnv();
}
```

#### Security 4: CORS Headers (if needed for API)
**File: `next.config.js`** (create if doesn't exist)

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGIN || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};
```

---

## Phase 6: Enhanced Features

**Estimated Time: 10-15 hours (optional/future work)**

### Feature 6.1: Admin Dashboard (5-6 hours)

**Purpose:** Allow MEMA team to view all submissions, responses, and analytics.

#### Step 1: Create Admin API Routes

**File: `pages/api/admin/leads.js`** (NEW FILE)

```javascript
import prisma from '../../../lib/prisma';

// Simple auth middleware (replace with proper auth)
function requireAuth(req) {
  const authHeader = req.headers.authorization;
  const validToken = process.env.ADMIN_API_KEY; // Set this in .env

  if (!authHeader || authHeader !== `Bearer ${validToken}`) {
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (!requireAuth(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 20, search = '' } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const where = search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { firm: { contains: search, mode: 'insensitive' } }
            ]
          }
        : {};

      const [leads, total] = await Promise.all([
        prisma.lead.findMany({
          where,
          skip,
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.lead.count({ where })
      ]);

      res.status(200).json({
        leads,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });

    } catch (error) {
      console.error('Error fetching leads:', error);
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
```

**File: `pages/api/admin/analytics.js`** (NEW FILE)

```javascript
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (!requireAuth(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const [
      totalLeads,
      leadsThisWeek,
      totalResponses,
      averageCompletionRate
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.userResponse.count(),
      prisma.question.count().then(async (totalQuestions) => {
        const sessions = await prisma.userResponse.groupBy({
          by: ['sessionId'],
          _count: { id: true }
        });
        const avgAnswers = sessions.reduce((sum, s) => sum + s._count.id, 0) / sessions.length;
        return Math.round((avgAnswers / totalQuestions) * 100);
      })
    ]);

    res.status(200).json({
      totalLeads,
      leadsThisWeek,
      totalResponses,
      averageCompletionRate
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: error.message });
  }
}
```

#### Step 2: Create Admin Dashboard Page

**File: `pages/admin.js`** (NEW FILE)

```javascript
import { useState, useEffect } from 'react';
import { ChartBarIcon, UserGroupIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [auth, setAuth] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    localStorage.setItem('admin-token', auth);
    setAuthenticated(true);
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('admin-token');

    try {
      const [analyticsRes, leadsRes] = await Promise.all([
        fetch('/api/admin/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/leads?page=1&limit=10', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (analyticsRes.ok && leadsRes.ok) {
        setAnalytics(await analyticsRes.json());
        const leadsData = await leadsRes.json();
        setLeads(leadsData.leads);
      } else {
        setAuthenticated(false);
        localStorage.removeItem('admin-token');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (token) {
      setAuth(token);
      setAuthenticated(true);
      fetchData();
    }
  }, []);

  if (!authenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-light)'
      }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
          <h1 style={{ marginBottom: '1.5rem' }}>Admin Login</h1>
          <input
            type="password"
            placeholder="Enter admin API key"
            value={auth}
            onChange={(e) => setAuth(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              border: '2px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--spacing-md)'
            }}
          />
          <button onClick={handleLogin} className="start-button" style={{ width: '100%' }}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-light)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Admin Dashboard</h1>

        {/* Analytics Cards */}
        {analytics && (
          <div className="metrics-grid" style={{ marginBottom: '3rem' }}>
            <div className="metric-card">
              <UserGroupIcon style={{ width: '3rem', height: '3rem', color: 'var(--color-accent-primary)', margin: '0 auto 1rem' }} />
              <div className="metric-value">{analytics.totalLeads}</div>
              <div className="metric-label">Total Leads</div>
            </div>
            <div className="metric-card">
              <ChartBarIcon style={{ width: '3rem', height: '3rem', color: 'var(--color-success)', margin: '0 auto 1rem' }} />
              <div className="metric-value">{analytics.leadsThisWeek}</div>
              <div className="metric-label">Leads This Week</div>
            </div>
            <div className="metric-card">
              <ClipboardDocumentListIcon style={{ width: '3rem', height: '3rem', color: 'var(--color-warning)', margin: '0 auto 1rem' }} />
              <div className="metric-value">{analytics.averageCompletionRate}%</div>
              <div className="metric-label">Avg. Completion</div>
            </div>
          </div>
        )}

        {/* Recent Leads Table */}
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Recent Leads</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Phone</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Firm</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                    <td style={{ padding: '1rem' }}>{lead.email}</td>
                    <td style={{ padding: '1rem' }}>{lead.phone || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>{lead.firm || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Add to `.env.local`:**
```
ADMIN_API_KEY=your-secure-random-key-here
```

---

### Feature 6.2: Export to PDF (3-4 hours)

Use library like `@react-pdf/renderer` or `jspdf`:

```bash
npm install jspdf jspdf-autotable
```

**File: `lib/exportPdf.js`** (NEW FILE)

```javascript
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function exportResultsToPDF(results, questions, answers, leadInfo) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text('MEMA Financial Promotions Compliance Report', 20, 20);

  // Client info
  doc.setFontSize(12);
  doc.text(`Client: ${leadInfo.firm || 'N/A'}`, 20, 35);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 42);

  // Health Score
  doc.setFontSize(16);
  doc.text(`Compliance Health Score: ${results.healthScore}%`, 20, 55);

  // Issues Summary
  doc.setFontSize(14);
  doc.text(`Issues Found: ${results.potentialFailures.length}`, 20, 65);

  // Detailed table of all questions and answers
  let yPos = 80;

  const tableData = [];
  questions.forEach(section => {
    section.items.forEach(item => {
      const userAnswer = answers[item.id];
      const answerText = userAnswer?.answer ? JSON.stringify(userAnswer.answer) : 'N/A';
      const notesText = userAnswer?.notes || '';

      tableData.push([
        item.questionRef,
        item.questionText.substring(0, 100) + '...',
        answerText,
        notesText.substring(0, 50)
      ]);
    });
  });

  doc.autoTable({
    startY: yPos,
    head: [['Ref', 'Question', 'Answer', 'Notes']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [0, 123, 255] },
    styles: { fontSize: 8, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 70 },
      2: { cellWidth: 30 },
      3: { cellWidth: 50 }
    }
  });

  // Save
  doc.save(`MEMA_Compliance_Report_${Date.now()}.pdf`);
}
```

**Use in ResultsPage.js:**
```javascript
import { exportResultsToPDF } from '../lib/exportPdf';

const handlePdfExport = () => {
  exportResultsToPDF(results, questions, answers, {
    firm: leadFirm,
    email: leadEmail
  });
};

// Add button
<button onClick={handlePdfExport} className="start-button">
  Download PDF Report
</button>
```

---

### Feature 6.3: Multi-language Support (2-3 hours)

Use `next-i18next` for internationalization:

```bash
npm install next-i18next
```

**File: `next-i18next.config.js`** (NEW FILE)

```javascript
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'de'],
  },
};
```

**File: `next.config.js`**

```javascript
const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  // ... other config
};
```

Create translation files:
```
public/
  locales/
    en/
      common.json
    fr/
      common.json
```

This is a larger feature - recommend starting after core functionality is complete.

---

## API Documentation

### GET `/api/questions`

**Description:** Fetches all questions grouped by section

**Authentication:** None

**Response:**
```json
[
  {
    "id": "1",
    "sectionTitle": "Section 1: Approval & Sign-off",
    "items": [
      {
        "id": "q1",
        "questionText": "Does your firm have procedures...?",
        "questionRef": "PERG 8.4.1",
        "type": "yesno",
        "explanation": "This ensures...",
        "complianceImplicationIfNo": "Your firm may be..."
      }
    ]
  }
]
```

---

### POST `/api/leads`

**Description:** Saves lead information and sends emails

**Authentication:** None

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "07123456789",
  "firm": "Example Ltd",
  "questions": [...],
  "answers": {...}
}
```

**Response:**
```json
{
  "message": "Lead saved and emails sent.",
  "lead": {
    "id": "cuid",
    "email": "jane@example.com",
    "createdAt": "2025-11-10T..."
  }
}
```

---

### POST `/api/save-progress`

**Description:** Saves user progress for later resumption

**Authentication:** None (uses sessionId)

**Request Body:**
```json
{
  "sessionId": "session_123",
  "currentSection": 2,
  "currentQuestion": 5,
  "answers": {
    "q1": { "answer": "Yes", "notes": "..." }
  }
}
```

---

### GET `/api/load-progress?sessionId=session_123`

**Description:** Loads saved progress for a session

**Authentication:** None

**Response:**
```json
{
  "answers": {
    "q1": { "answer": "Yes", "notes": "..." }
  }
}
```

---

## Database Schema

### Question Model
```prisma
model Question {
  id                          String  @id @default(cuid())
  sectionId                   String
  sectionTitle                String
  questionText                String
  questionRef                 String
  explanation                 String?
  type                        String  // "yesno", "dropdown", "multiselect"
  options                     Json?
  complianceImplicationIfNo   String?
  complianceImplicationIfSelected Json?
  responses                   UserResponse[]
}
```

### UserResponse Model
```prisma
model UserResponse {
  id          String   @id @default(cuid())
  sessionId   String
  answer      Json
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  question    Question @relation(fields: [questionId], references: [id])
  questionId  String

  @@unique([sessionId, questionId])
  @@index([sessionId])
}
```

### Lead Model
```prisma
model Lead {
  id        String   @id @default(cuid())
  email     String
  phone     String?
  firm      String?
  createdAt DateTime @default(now())
}
```

---

## Environment Variables

### Required

**`.env.local`** (DO NOT COMMIT)
```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Email Service
RESEND_API_KEY="re_your_api_key_here"

# Admin (optional)
ADMIN_API_KEY="your-secure-random-key"
```

### Template

**`.env.example`** (COMMIT THIS)
```env
# Database Configuration
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Email Service (Resend)
RESEND_API_KEY="re_your_api_key_here"

# Admin Dashboard (optional)
ADMIN_API_KEY="your-secure-random-key"
```

---

## Testing Strategy

### Manual Testing Checklist

#### User Flow Testing
- [ ] Welcome screen loads correctly
- [ ] Start button navigates to questionnaire
- [ ] All question types render (yes/no, dropdown, multiselect)
- [ ] Answers save when moving forward/backward
- [ ] Stepper shows correct active/completed states
- [ ] Progress bar updates correctly
- [ ] View Results button shows results
- [ ] Results page shows correct health score
- [ ] Lead form validation works
- [ ] Email sends successfully
- [ ] Full report unlocks after submission
- [ ] CSV export downloads correctly
- [ ] CSV contains all questions and answers
- [ ] Dark mode toggle works
- [ ] Dark mode persists on reload
- [ ] Responsive design works on mobile

#### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

#### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] Lighthouse Performance score > 80
- [ ] Lighthouse Accessibility score > 90
- [ ] No console errors
- [ ] Database queries < 500ms
- [ ] Email sending < 2 seconds

---

### Automated Testing (Future Enhancement)

#### Unit Tests (Jest + React Testing Library)

**Setup:**
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

**Example Test: `__tests__/Questionnaire.test.js`**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Questionnaire from '../components/Questionnaire';

describe('Questionnaire', () => {
  const mockQuestion = {
    id: 'q1',
    questionText: 'Test question?',
    questionRef: 'TEST 1.1',
    type: 'yesno'
  };

  it('renders question text', () => {
    render(<Questionnaire question={mockQuestion} />);
    expect(screen.getByText('Test question?')).toBeInTheDocument();
  });

  it('calls onAnswer when Yes is clicked', () => {
    const mockOnAnswer = jest.fn();
    render(<Questionnaire question={mockQuestion} onAnswer={mockOnAnswer} />);

    fireEvent.click(screen.getByText('Yes'));
    expect(mockOnAnswer).toHaveBeenCalledWith('q1', { answer: 'Yes', notes: '' });
  });
});
```

#### E2E Tests (Playwright)

**Setup:**
```bash
npm install --save-dev @playwright/test
```

**Example Test: `e2e/full-flow.spec.js`**
```javascript
import { test, expect } from '@playwright/test';

test('complete questionnaire flow', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Start questionnaire
  await page.click('text=Start Assessment');

  // Answer first question
  await page.click('text=Yes');

  // Go to next question
  await page.click('text=Next →');

  // Continue through all sections...

  // View results
  await page.click('text=View Results');

  // Check results page loaded
  await expect(page.locator('text=Your Compliance Assessment Results')).toBeVisible();

  // Fill lead form
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="tel"]', '07123456789');
  await page.fill('input[placeholder*="Company"]', 'Test Company');

  // Submit
  await page.click('text=Unlock Full Report');

  // Check success
  await expect(page.locator('text=Thank you')).toBeVisible();
});
```

---

## Deployment Guide

### Pre-deployment Checklist

- [ ] All environment variables documented in `.env.example`
- [ ] `.env.local` NOT committed to git
- [ ] Production build tested locally (`npm run build && npm start`)
- [ ] Database migrations ready (`npx prisma migrate deploy`)
- [ ] Prisma Client generated (`npx prisma generate`)
- [ ] No console.log statements in production code
- [ ] Error handling in place for all API routes
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] CORS configured (if needed)

### Deployment Platforms

#### Option 1: Vercel (Recommended)

**Pros:**
- Zero-config Next.js deployment
- Automatic SSL
- Global CDN
- Built-in analytics
- Free tier available

**Steps:**
1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Vercel CLI:**
```bash
npm install -g vercel
vercel login
vercel  # First deploy
vercel --prod  # Production deploy
```

#### Option 2: Railway

**Pros:**
- Includes PostgreSQL database
- Automatic SSL
- Easy environment variables
- Free tier available

**Steps:**
1. Create Railway account
2. New Project → Deploy from GitHub
3. Add PostgreSQL service
4. Copy DATABASE_URL to environment variables
5. Add other env vars
6. Deploy

#### Option 3: Self-hosted (VPS)

**Requirements:**
- Node.js 18+
- PostgreSQL 13+
- Nginx (for reverse proxy)
- PM2 (for process management)

**Setup:**
```bash
# On server
git clone <repo>
cd mema-q-app
npm install
npm run build

# Set up environment variables
cp .env.example .env.local
nano .env.local  # Edit variables

# Run migrations
npx prisma migrate deploy

# Start with PM2
pm2 start npm --name "mema-q-app" -- start
pm2 save
pm2 startup
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### Post-deployment

#### Monitoring

1. **Uptime Monitoring**
   - Use UptimeRobot or Pingdom
   - Monitor main page and API endpoints

2. **Error Tracking**
   - Set up Sentry (optional but recommended)
   ```bash
   npm install @sentry/nextjs
   ```

3. **Analytics**
   - Google Analytics
   - Vercel Analytics (if using Vercel)
   - Plausible Analytics (privacy-friendly)

#### Backups

1. **Database Backups**
   - Neon has automatic backups
   - Set up daily exports to S3/Dropbox

2. **Code Backups**
   - GitHub repository (already done)
   - Tag releases: `git tag v1.0.0 && git push --tags`

---

## Known Issues & Technical Debt

### Current Issues

1. **Dark Theme**
   - Status: Partial implementation
   - Priority: High
   - Work needed: Complete Task 4.1

2. **Phone Number Field**
   - Issue: Not required but shows in form
   - Priority: Low
   - Fix: Already optional in code, working as expected

3. **Name Field Missing**
   - Issue: Lead form has name field in ResultsPage but API expects it
   - Priority: Medium
   - Fix: API expects `name` but component uses separate fields - reconcile

4. **Email Template**
   - Issue: HTML email template is placeholder
   - Priority: Medium
   - Fix: Design professional HTML email template with MEMA branding

### Technical Debt

1. **No TypeScript**
   - Impact: Medium
   - Effort: High (20+ hours)
   - Benefit: Better type safety, IDE autocomplete
   - Recommendation: Keep as JavaScript for now, consider migration in v2.0

2. **No Unit Tests**
   - Impact: Medium
   - Effort: Medium (10-15 hours)
   - Benefit: Catch regressions, confidence in refactoring
   - Recommendation: Add tests for critical paths (lead submission, email sending)

3. **No Caching**
   - Impact: Low
   - Effort: Low (2-3 hours)
   - Benefit: Faster question loading
   - Recommendation: Implement in Task 5.2

4. **Client-side State Management**
   - Impact: Low
   - Effort: Medium (5-6 hours)
   - Benefit: Better state handling, easier debugging
   - Recommendation: Consider Zustand or Context API if app grows

5. **Hard-coded Content**
   - Impact: Medium
   - Effort: High (15+ hours for full CMS)
   - Benefit: Non-technical team can update questions
   - Recommendation: Phase 7 feature - add CMS or question admin panel

6. **No Search/Filter**
   - Impact: Low (for current scope)
   - Effort: Medium (3-4 hours)
   - Benefit: Users can search questions
   - Recommendation: Add if feedback suggests need

7. **Single Email Provider**
   - Impact: Low
   - Effort: Medium (4-5 hours)
   - Benefit: Fallback if Resend fails
   - Recommendation: Add SendGrid or Postmark as fallback

---

## Glossary

- **FCA**: Financial Conduct Authority (UK financial services regulator)
- **PERG 8**: Perimeter Guidance Manual Chapter 8 (Financial Promotions)
- **FinProms**: Financial Promotions
- **Neon**: Cloud-hosted PostgreSQL database provider
- **Resend**: Modern email API service
- **Prisma**: Next-generation ORM for Node.js
- **Chart.js**: JavaScript charting library
- **Heroicons**: SVG icon library from Tailwind CSS creators

---

## Contact & Support

**Project Maintainer:** MEMA Consultants
**Email:** contact@memaconsultants.com
**Repository:** [Internal/Private]

**For Development Questions:**
- Check this document first
- Review Next.js docs: https://nextjs.org/docs
- Review Prisma docs: https://www.prisma.io/docs
- Review Resend docs: https://resend.com/docs

**For Production Issues:**
- Check Vercel logs (if deployed on Vercel)
- Check database connection in Neon dashboard
- Check Resend email logs
- Check browser console for client-side errors

---

## Appendix A: Keyboard Shortcuts (Future Enhancement)

Planned keyboard navigation:
- `Arrow Left/Right` - Previous/Next question
- `1` - Select "Yes"
- `2` - Select "No"
- `Ctrl+Enter` - Submit lead form
- `Ctrl+D` - Download CSV
- `Ctrl+Shift+T` - Toggle theme

Implementation time: 2-3 hours

---

## Appendix B: Accessibility Checklist

- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast ≥ 4.5:1 (WCAG AA)
- [ ] Screen reader tested (NVDA/JAWS)
- [ ] No flashing content
- [ ] Skip links added (optional)
- [ ] ARIA labels where appropriate
- [ ] Error messages announced

---

## Appendix C: Sample Questions Data

For seeding the database with test questions:

**File: `prisma/scripts/seed.js`**

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.userResponse.deleteMany();
  await prisma.question.deleteMany();
  await prisma.lead.deleteMany();

  // Section 1 questions
  await prisma.question.createMany({
    data: [
      {
        id: '1.1',
        sectionId: '1',
        sectionTitle: 'Section 1: Approval & Sign-off',
        questionText: 'Does your firm have documented procedures for approving financial promotions before they are communicated?',
        questionRef: 'PERG 8.4.1',
        explanation: 'The FCA requires firms to have robust approval processes for all financial promotions.',
        type: 'yesno',
        complianceImplicationIfNo: 'Your firm may be in breach of FSMA Section 21 requirements.'
      },
      {
        id: '1.2',
        sectionId: '1',
        sectionTitle: 'Section 1: Approval & Sign-off',
        questionText: 'Who is responsible for approving financial promotions?',
        questionRef: 'PERG 8.4.2',
        explanation: 'Approval must be done by an appropriately qualified and experienced person.',
        type: 'dropdown',
        options: JSON.stringify([
          { value: 'select', text: '-- Select an option --' },
          { value: 'cf30', text: 'CF30 Approved Person' },
          { value: 'senior-manager', text: 'Senior Manager' },
          { value: 'compliance-officer', text: 'Compliance Officer' },
          { value: 'other', text: 'Other' }
        ]),
        complianceImplicationIfSelected: JSON.stringify({
          'other': 'May not meet FCA requirements for appropriate approval.'
        })
      },
      // Add more questions for section 1...
    ]
  });

  // Section 2 questions
  await prisma.question.createMany({
    data: [
      {
        id: '2.1',
        sectionId: '2',
        sectionTitle: 'Section 2: Fair, Clear & Not Misleading',
        questionText: 'Do your financial promotions include clear risk warnings?',
        questionRef: 'PERG 8.5.1',
        explanation: 'All financial promotions must prominently display risk warnings.',
        type: 'yesno',
        complianceImplicationIfNo: 'Promotions may be considered misleading and breach FCA principles.'
      },
      // Add more questions for section 2...
    ]
  });

  // Add sections 3-6...

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run seed:
```bash
npm run prisma db seed
```

---

## Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-10 | Claude | Initial comprehensive developer handoff document |

---

**END OF DEVELOPER HANDOFF DOCUMENT**

This document should contain everything needed to complete the project. Estimated total time to finish all phases: 30-40 hours.

Good luck! 🚀
