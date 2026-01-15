import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import WelcomeScreen from '../components/WelcomeScreen';
import ScenarioSelector from '../components/ScenarioSelector';
import AIAnalyzer from '../components/AIAnalyzer';
import ChoiceModal from '../components/ChoiceModal';
import AuthModal from '../components/AuthModal';
import UserMenu from '../components/UserMenu';
import Breadcrumb from '../components/Breadcrumb';
import ProgressBar from '../components/ProgressBar';
import Stepper from '../components/Stepper';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { getScenario } from '../lib/scenarios';
import { useAuth } from '../lib/authContext';
import { useSession, useQuestions, useProgressPersistence } from '../hooks';
import { analyzeResults as analyzeResultsFn, getRiskLevel } from '../lib/analyzeResults';

const Questionnaire = dynamic(() => import('../components/Questionnaire'), {
  loading: () => <div className="app-container text-center">Loading assessment...</div>,
});

const ResultsPage = dynamic(() => import('../components/ResultsPage'), {
  ssr: false,
  loading: () => <div className="app-container text-center">Preparing results...</div>,
});

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
}


export default function Home() {
  const { t } = useTranslation('common');
  const router = useRouter();

  // Custom hooks
  const sessionId = useSession();
  const { questions } = useQuestions();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Local state
  const [appState, setAppState] = useState('welcome');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [completedSections, setCompletedSections] = useState({});
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [uploadedPromoImage, setUploadedPromoImage] = useState(null);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [suggestedScenario, setSuggestedScenario] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [preloadedPromotion, setPreloadedPromotion] = useState(null);

  // Progress persistence hook
  const { progressLoaded } = useProgressPersistence({
    sessionId,
    questions,
    answers,
    currentSection,
    currentQuestion,
    setAnswers,
    setCurrentSection,
    setCurrentQuestion,
  });

  // Open auth modal
  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  // Handle scanPromotion query param from dashboard
  useEffect(() => {
    const loadSavedPromotion = async () => {
      const { scanPromotion } = router.query;
      if (!scanPromotion || !isAuthenticated) return;

      try {
        const res = await fetch('/api/dashboard/promotions');
        if (res.ok) {
          const data = await res.json();
          const promotion = data.promotions?.find((p) => p.id === scanPromotion);
          if (promotion) {
            setPreloadedPromotion(promotion);
            setAppState('ai-with-scenarios');
            // Clear the query param
            router.replace('/', undefined, { shallow: true });
          }
        }
      } catch (error) {
        console.error('Failed to load saved promotion:', error);
      }
    };

    if (router.isReady) {
      loadSavedPromotion();
    }
  }, [router.isReady, router.query, isAuthenticated]);

  // Note: Session, questions fetch, and progress persistence are now handled by custom hooks

  // Show choice modal when user clicks Start Assessment
  const handleStart = () => setShowChoiceModal(true);

  // Quick Start - go directly to scenario selection
  const handleQuickStart = () => {
    setShowChoiceModal(false);
    setAppState('scenario');
  };

  // Smart Scan - show combined AI analysis + scenario selection view
  const handleSmartScan = () => {
    setShowChoiceModal(false);
    setIsAiAnalyzing(false); // Start without loading - loading begins when analysis starts
    setSuggestedScenario(null);
    setAiAnalysis(null);
    setAppState('ai-with-scenarios');
  };

  // Map promotion types to scenario IDs
  const mapPromotionTypeToScenario = (promotionType) => {
    const mapping = {
      billboard: 'print',
      print: 'print',
      social_media: 'social_media',
      website: 'website',
      email: 'email',
      video: 'all',
      other: 'all',
    };
    return mapping[promotionType] || 'all';
  };

  const handleAIAnalysisComplete = ({ analysis, imagePreview, suggestedAnswers }) => {
    setAiAnalysis(analysis);
    setUploadedPromoImage(imagePreview);
    setIsAiAnalyzing(false);

    // Set suggested scenario based on detected promotion type
    if (analysis?.promotionType) {
      const suggested = mapPromotionTypeToScenario(analysis.promotionType);
      setSuggestedScenario(suggested);
    }

    // Pre-fill answers from AI suggestions (use lower threshold for more coverage)
    if (suggestedAnswers && Object.keys(suggestedAnswers).length > 0) {
      const prefilled = {};
      Object.entries(suggestedAnswers).forEach(([qId, suggestion]) => {
        // Accept suggestions with confidence >= 0.6 (was 0.7)
        if (suggestion.confidence >= 0.6) {
          prefilled[qId] = {
            answer: suggestion.answer,
            notes: `AI Analysis (${Math.round(suggestion.confidence * 100)}% confidence): ${suggestion.reason}`,
            aiSuggested: true,
            aiConfidence: suggestion.confidence,
          };
        }
      });
      setAnswers(prefilled);
    }

    // If we're in combined view, stay there. Otherwise go to scenario
    if (appState !== 'ai-with-scenarios') {
      setAppState('scenario');
    }
  };

  const handleSkipAI = () => {
    setIsAiAnalyzing(false);
    setAppState('scenario');
  };

  const handleScenarioSelect = (scenarioId) => {
    setSelectedScenario(scenarioId);
    // Reset questionnaire state for new assessment (keep AI pre-filled answers)
    if (!aiAnalysis) {
      setAnswers({});
    }
    setCurrentSection(0);
    setCurrentQuestion(0);
    setCompletedSections({});
    setAppState('questionnaire');
  };

  const handleScenarioBack = () => {
    // Reset AI state and go back to welcome
    setIsAiAnalyzing(false);
    setSuggestedScenario(null);
    setAiAnalysis(null);
    setAppState('welcome');
  };

  const updateCompletedSections = (sectionIndex) => {
    const newCompleted = {};
    for (let i = 0; i < sectionIndex; i++) {
        const sectionId = questions[i].id;
        if(sectionId) newCompleted[sectionId] = true;
    }
    setCompletedSections(newCompleted);
  };

  const handleAnswer = (questionId, answerPayload) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerPayload }));
  };

  const handleNext = () => {
    const section = questions[currentSection];
    if (currentQuestion < section.items.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentSection < questions.length - 1) {
      const nextSectionIndex = currentSection + 1;
      setCurrentSection(nextSectionIndex);
      setCurrentQuestion(0);
      // Mark the section we are leaving as complete
      updateCompletedSections(nextSectionIndex);
    } else {
      handleShowResults();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentSection > 0) {
      const prevSectionIndex = currentSection - 1;
      setCurrentSection(prevSectionIndex);
      setCurrentQuestion(questions[prevSectionIndex].items.length - 1);
      updateCompletedSections(prevSectionIndex);
    }
  };

  const handleJumpToQuestion = (sectionIndex, questionIndex = 0) => {
    if (!questions[sectionIndex]) return;
    const safeIndex = Math.min(Math.max(questionIndex, 0), questions[sectionIndex].items.length - 1);
    setCurrentSection(sectionIndex);
    setCurrentQuestion(safeIndex);
    updateCompletedSections(sectionIndex);
  };
  
  // Save assessment to dashboard for logged-in users
  const saveAssessmentToDashboard = async (results) => {
    if (!isAuthenticated) return;

    try {
      const scenarioConfig = selectedScenario ? getScenario(selectedScenario) : null;

      await fetch('/api/dashboard/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: selectedScenario,
          scenarioLabel: scenarioConfig?.label || selectedScenario,
          answers: answers,
          score: results.healthScore,
          riskLevel: getRiskLevel(results.healthScore),
        }),
      });
    } catch (error) {
      console.error('Failed to save assessment to dashboard:', error);
    }
  };

  // Wrapper for analyze results utility
  const analyzeResults = () => analyzeResultsFn(questions, answers);

  const handleShowResults = () => {
    // Mark all sections as complete before showing results
    const allCompleted = {};
    questions.forEach(q => { allCompleted[q.id] = true; });
    setCompletedSections(allCompleted);

    const results = analyzeResults();
    setAnalysisResult(results);
    setAppState('results');

    // Auto-save to dashboard if user is logged in
    saveAssessmentToDashboard(results);
  };

  const handleGoBack = () => {
      setAppState('questionnaire');
      // When going back from results, ensure the stepper reflects the correct state
      updateCompletedSections(currentSection);
  };

  const progressSectionMeta = questions.map((section, index) => {
    const title = section.title || section.sectionTitle || `Section ${index + 1}`;
    let status = 'pending';
    if (completedSections[section.id]) {
      status = 'complete';
    } else if (
      (appState === 'results' && index === questions.length - 1) ||
      (appState !== 'results' && index === currentSection)
    ) {
      status = 'active';
    }
    return { id: section.id, title, status };
  });

  // Breadcrumb items configuration
  const getBreadcrumbItems = () => {
    const items = [
      {
        label: 'Home',
        icon: 'home',
        href: '#',
        onClick: () => setAppState('welcome')
      }
    ];

    if (appState === 'scenario') {
      items.push({
        label: 'Select Channel',
      });
    } else if (appState === 'questionnaire' && questions.length > 0) {
      const scenarioConfig = selectedScenario ? getScenario(selectedScenario) : null;
      items.push({
        label: scenarioConfig?.label || 'Assessment',
        href: '#',
        onClick: () => setAppState('scenario')
      });
      items.push({
        label: questions[currentSection]?.title || 'Section',
      });
    } else if (appState === 'results') {
      const scenarioConfig = selectedScenario ? getScenario(selectedScenario) : null;
      items.push({
        label: scenarioConfig?.label || 'Assessment',
        href: '#',
        onClick: () => setAppState('questionnaire')
      });
      items.push({
        label: 'Results',
      });
    }

    return items;
  };

  // Calculate progress metrics
  const getTotalQuestions = () => {
    return questions.reduce((sum, section) => sum + section.items.length, 0);
  };

  const getCurrentQuestionNumber = () => {
    let count = 0;
    for (let i = 0; i < currentSection; i++) {
      count += questions[i].items.length;
    }
    return count + currentQuestion + 1;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).filter(key => answers[key]?.answer).length;
  };

  const getCompletedSectionsCount = () => {
    return Object.keys(completedSections).length;
  };

  return (
    <div className="min-h-screen font-sans">
      <Head>
        <title>MEMA Consultants - FCA Financial Promotions Compliance Assessment</title>
        <meta name="description" content="Professional FCA PERG 8 financial promotions compliance assessment tool by MEMA Consultants" />
      </Head>

      {appState !== 'welcome' && (
        <header className="app-header">
          <a href="/" className="header-logo">
            <img src="/mema-icon.svg" alt="MEMA" />
          </a>
          <div className="header-right">
            <LanguageSwitcher />
            {appState === 'questionnaire' && (
              <button onClick={handleShowResults} className="btn-primary-dark">
                {t('buttons.viewResults')}
              </button>
            )}
            {!authLoading && (
              isAuthenticated ? (
                <UserMenu />
              ) : (
                <button className="sign-in-btn" onClick={() => openAuthModal('login')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Sign In
                </button>
              )
            )}
          </div>
        </header>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

      <main>
        {/* Breadcrumb Navigation */}
        {appState !== 'welcome' && appState !== 'scenario' && (
          <div className="container mx-auto px-4 mt-4">
            <Breadcrumb items={getBreadcrumbItems()} />
          </div>
        )}

        {/* Progress Bar */}
        {appState === 'questionnaire' && questions.length > 0 && (
          <div className="container mx-auto px-4 mt-2">
            <ProgressBar
              currentQuestion={getCurrentQuestionNumber()}
              totalQuestions={getTotalQuestions()}
              answeredQuestions={getAnsweredCount()}
              sections={{
                completed: getCompletedSectionsCount(),
                total: questions.length
              }}
              sectionMeta={progressSectionMeta}
            />
          </div>
        )}

        {/* Section Stepper */}
        {appState === 'questionnaire' && questions.length > 0 && (
          <div className="container mx-auto px-4 mt-4">
            <Stepper
              sections={questions.map((q, i) => ({
                id: q.id,
                title: (q.title || q.sectionTitle || `Section ${i + 1}`).replace(/Section \d+: /g, '')
              }))}
              currentSectionId={questions[currentSection]?.id}
              completedSections={Object.keys(completedSections)}
              onStepClick={(sectionId) => {
                const index = questions.findIndex(q => q.id === sectionId);
                if (index >= 0) {
                  setCurrentSection(index);
                  setCurrentQuestion(0);
                  updateCompletedSections(index);
                }
              }}
            />
          </div>
        )}

        {appState === 'welcome' && (
          <WelcomeScreen
            onStart={handleStart}
            onSignIn={() => openAuthModal('login')}
            isAuthenticated={isAuthenticated}
            authLoading={authLoading}
          />
        )}

        {/* Choice Modal - Quick Start vs Smart Scan */}
        <ChoiceModal
          isOpen={showChoiceModal}
          onClose={() => setShowChoiceModal(false)}
          onQuickStart={handleQuickStart}
          onSmartScan={handleSmartScan}
        />

        {/* Legacy AI-only view (kept for direct navigation) */}
        {appState === 'ai-analyze' && (
          <AIAnalyzer
            onAnalysisComplete={handleAIAnalysisComplete}
            onSkip={handleSkipAI}
          />
        )}

        {/* Direct scenario selection (Quick Start path) */}
        {appState === 'scenario' && (
          <ScenarioSelector
            onSelect={handleScenarioSelect}
            onBack={handleScenarioBack}
            aiAnalysis={aiAnalysis}
            suggestedScenario={suggestedScenario}
          />
        )}

        {/* Combined AI + Scenarios view (Smart Scan path) */}
        {appState === 'ai-with-scenarios' && (
          <div className="ai-scenarios-combined">
            <div className="ai-upload-section">
              <AIAnalyzer
                onAnalysisComplete={handleAIAnalysisComplete}
                onSkip={handleSkipAI}
                onAnalysisStart={() => setIsAiAnalyzing(true)}
                compact={true}
                preloadedPromotion={preloadedPromotion}
                onPreloadConsumed={() => setPreloadedPromotion(null)}
              />
            </div>
            <div className="scenarios-section">
              <ScenarioSelector
                onSelect={handleScenarioSelect}
                onBack={handleScenarioBack}
                isLoading={isAiAnalyzing}
                suggestedScenario={suggestedScenario}
                aiAnalysis={aiAnalysis}
              />
            </div>
          </div>
        )}
        {appState === 'questionnaire' && questions.length > 0 ? (
          <Questionnaire
            section={questions[currentSection]}
            question={questions[currentSection].items[currentQuestion]}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onPrev={handlePrev}
            isFirstQuestion={currentSection === 0 && currentQuestion === 0}
            isLastQuestion={currentSection === questions.length - 1 && currentQuestion === questions[currentSection].items.length - 1}
            currentAnswer={answers[questions[currentSection].items[currentQuestion].id]}
            allSections={questions}
            currentSectionIndex={currentSection}
            currentQuestionIndex={currentQuestion}
            answers={answers}
            onJumpToQuestion={handleJumpToQuestion}
            scenario={selectedScenario}
            aiAnalysis={aiAnalysis}
            uploadedPromoImage={uploadedPromoImage}
          />
        ) : appState === 'questionnaire' ? (
          <div className="app-container text-center">Loading questions...</div>
        ) : null}
        
        {appState === 'results' && (
          <ResultsPage
            results={analysisResult}
            onGoBack={handleGoBack}
            questions={questions}
            answers={answers}
            scenario={selectedScenario}
          />
        )}
      </main>
    </div>
  );
}
