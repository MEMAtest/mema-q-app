import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import WelcomeScreen from '../components/WelcomeScreen';
import ScenarioSelector from '../components/ScenarioSelector';
import AIAnalyzer from '../components/AIAnalyzer';
import Breadcrumb from '../components/Breadcrumb';
import ProgressBar from '../components/ProgressBar';
import Stepper from '../components/Stepper';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { getScenario } from '../lib/scenarios';

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
  const [appState, setAppState] = useState('welcome');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [completedSections, setCompletedSections] = useState({});
  const [sessionId, setSessionId] = useState('');
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [uploadedPromoImage, setUploadedPromoImage] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/questions');
        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let storedSession = window.localStorage.getItem('mema-session-id');
    if (!storedSession) {
      if (window.crypto?.randomUUID) {
        storedSession = window.crypto.randomUUID();
      } else {
        storedSession = `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      }
      window.localStorage.setItem('mema-session-id', storedSession);
    }
    setSessionId(storedSession);
  }, []);

  useEffect(() => {
    const loadProgress = async () => {
      if (!sessionId || questions.length === 0 || progressLoaded) return;
      try {
        const response = await fetch(`/api/load-progress?sessionId=${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.answers) {
            setAnswers(data.answers);
          }
        }
        // Restore position from localStorage
        const savedPosition = window.localStorage.getItem('mema-position');
        if (savedPosition) {
          const pos = JSON.parse(savedPosition);
          if (typeof pos.section === 'number' && pos.section < questions.length) {
            setCurrentSection(pos.section);
          }
          if (typeof pos.question === 'number') {
            const maxQ = questions[pos.section]?.items?.length || 0;
            if (pos.question < maxQ) {
              setCurrentQuestion(pos.question);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setProgressLoaded(true);
      }
    };

    loadProgress();
  }, [sessionId, questions, progressLoaded]);

  useEffect(() => {
    if (!sessionId || !progressLoaded) return;
    const timeout = setTimeout(async () => {
      try {
        await fetch('/api/save-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            currentSection,
            currentQuestion,
            answers,
          }),
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }, 750);

    return () => clearTimeout(timeout);
  }, [answers, sessionId, currentSection, currentQuestion, progressLoaded]);

  // Save position to localStorage for persistence across refresh
  useEffect(() => {
    if (typeof window === 'undefined' || !progressLoaded) return;
    window.localStorage.setItem('mema-position', JSON.stringify({
      section: currentSection,
      question: currentQuestion
    }));
  }, [currentSection, currentQuestion, progressLoaded]);

  const handleStart = () => setAppState('ai-analyze');

  const handleAIAnalysisComplete = ({ analysis, imagePreview, suggestedAnswers }) => {
    setAiAnalysis(analysis);
    setUploadedPromoImage(imagePreview);
    // Pre-fill answers from AI suggestions
    if (suggestedAnswers && Object.keys(suggestedAnswers).length > 0) {
      const prefilled = {};
      Object.entries(suggestedAnswers).forEach(([qId, suggestion]) => {
        if (suggestion.confidence > 0.7) {
          prefilled[qId] = {
            answer: suggestion.answer,
            notes: `AI suggested: ${suggestion.reason}`,
            aiSuggested: true,
            aiConfidence: suggestion.confidence,
          };
        }
      });
      setAnswers(prefilled);
    }
    setAppState('scenario');
  };

  const handleSkipAI = () => setAppState('scenario');

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

  const handleScenarioBack = () => setAppState('ai-analyze');

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
  
  const handleShowResults = () => {
    // Mark all sections as complete before showing results
    const allCompleted = {};
    questions.forEach(q => { allCompleted[q.id] = true; });
    setCompletedSections(allCompleted);
    
    setAnalysisResult(analyzeResults());
    setAppState('results');
  };

  const handleGoBack = () => {
      setAppState('questionnaire');
      // When going back from results, ensure the stepper reflects the correct state
      updateCompletedSections(currentSection);
  };
    
  // Your advanced analysis function is preserved
  const analyzeResults = () => {
    const potentialFailures = [];
    let compliantAnswersForScore = 0;
    let answeredQuestionsForScore = 0;
    const sectionData = questions.map(section => {
        let sectionYesCount = 0, sectionNoCount = 0, sectionOtherCount = 0, sectionUnansweredCount = 0;
        section.items.forEach(item => {
            const answer = answers[item.id]?.answer;
            let isFailure = false;
            let implicationText = '';
            if (answer) answeredQuestionsForScore++;
            if (item.type === 'yesno') {
                if (answer === 'Yes') {
                    compliantAnswersForScore++; sectionYesCount++;
                } else if (answer === 'No') {
                    sectionNoCount++;
                    if (item.complianceImplicationIfNo) { isFailure = true; implicationText = item.complianceImplicationIfNo; }
                } else { sectionUnansweredCount++; }
            } else if (item.type === 'dropdown' || item.type === 'multiselect') {
                const selection = Array.isArray(answer) ? answer : [answer];
                let hasFailure = false;
                if(item.complianceImplicationIfSelected) {
                    selection.forEach(sel => {
                        if(item.complianceImplicationIfSelected[sel]) {
                            hasFailure = true;
                            implicationText = item.complianceImplicationIfSelected[sel];
                        }
                    });
                }
                if(hasFailure) {
                    isFailure = true;
                    sectionNoCount++;
                } else if (answer) {
                    compliantAnswersForScore++; sectionOtherCount++;
                } else { sectionUnansweredCount++; }
            }
            if (isFailure) {
                potentialFailures.push({ id: item.id, question: item.questionText, ref: item.questionRef, implication: implicationText, notes: answers[item.id]?.notes || '' });
            }
        });
        return {
            title: (section.title || section.sectionTitle || 'Unknown Section').replace(/Section \d+: /g, ""),
            counts: [sectionYesCount, sectionNoCount, sectionOtherCount, sectionUnansweredCount]
        };
    });
    const healthScore = answeredQuestionsForScore > 0 ? Math.round((compliantAnswersForScore / answeredQuestionsForScore) * 100) : 0;
    const chartData = {
        doughnut: [healthScore, 100 - healthScore],
        bar: {
            labels: sectionData.map(s => s.title),
            datasets: [
                { label: 'Yes', data: sectionData.map(s => s.counts[0]), backgroundColor: 'rgba(56, 189, 123, 0.7)' },
                { label: 'No / Issue', data: sectionData.map(s => s.counts[1]), backgroundColor: 'rgba(239, 68, 68, 0.7)' },
                { label: 'Other', data: sectionData.map(s => s.counts[2]), backgroundColor: 'rgba(99, 102, 241, 0.7)' },
                { label: 'Unanswered', data: sectionData.map(s => s.counts[3]), backgroundColor: 'rgba(245, 158, 11, 0.7)' }
            ]
        }
    };
    return { potentialFailures, healthScore, chartData };
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

      <header className="glass-panel sticky top-0 z-50" style={{margin: '1rem 0', borderRadius: '12px'}}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center gap-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LanguageSwitcher />
            </div>
            {appState === 'questionnaire' && (
                <button onClick={handleShowResults} className="btn-primary-dark">
                    {t('buttons.viewResults')}
                </button>
            )}
        </div>
      </header>

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

        {appState === 'welcome' && <WelcomeScreen onStart={handleStart} />}
        {appState === 'ai-analyze' && (
          <AIAnalyzer
            onAnalysisComplete={handleAIAnalysisComplete}
            onSkip={handleSkipAI}
          />
        )}
        {appState === 'scenario' && (
          <ScenarioSelector
            onSelect={handleScenarioSelect}
            onBack={handleScenarioBack}
            aiAnalysis={aiAnalysis}
          />
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
