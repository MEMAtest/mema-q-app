import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import WelcomeScreen from '../components/WelcomeScreen';
import Stepper from '../components/Stepper';
import Breadcrumb from '../components/Breadcrumb';
import ProgressBar from '../components/ProgressBar';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';

// Re-using the icon map from our previous discussion
import {
  ClipboardDocumentCheckIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  ChatBubbleBottomCenterTextIcon,
  ArchiveBoxIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';

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
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  // --- ADDED: State to track completed sections for the Stepper ---
  const [completedSections, setCompletedSections] = useState({});
  const [sessionId, setSessionId] = useState('');
  const [progressLoaded, setProgressLoaded] = useState(false);

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

  const handleStart = () => setAppState('questionnaire');

  // --- LOGIC FIX: Update completed sections when moving ---
  const updateCompletedSections = (sectionIndex) => {
    const newCompleted = {};
    for (let i = 0; i < sectionIndex; i++) {
        const sectionId = questions[i].id;
        if(sectionId) newCompleted[sectionId] = true;
    }
    setCompletedSections(newCompleted);
  };

  const handleStepClick = (sectionIndex) => {
    const sectionId = questions[sectionIndex]?.id;
    // Allow navigation only to sections that have been completed
    if (completedSections[sectionId] || sectionIndex <= currentSection) {
      setCurrentSection(sectionIndex);
      setCurrentQuestion(0);
      updateCompletedSections(sectionIndex);
    }
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
  
  const sectionsForStepper = questions.map(section => ({
      id: section.id,
      title: section.title
  }));

  const iconMap = {
      '1': ExclamationTriangleIcon,
      '2': ClipboardDocumentCheckIcon,
      '3': SparklesIcon,
      '4': BuildingOfficeIcon,
      '5': ChatBubbleBottomCenterTextIcon,
      '6': ArchiveBoxIcon,
      'results': ChartPieIcon,
  };
  
  // Determine current section ID for active step
  const activeSectionId = appState === 'results' ? 'results' : questions[currentSection]?.id;

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

    if (appState === 'questionnaire' && questions.length > 0) {
      items.push({
        label: 'Assessment',
        href: '#',
        onClick: () => {} // Current page
      });
      items.push({
        label: questions[currentSection]?.title || 'Section',
      });
    } else if (appState === 'results') {
      items.push({
        label: 'Assessment',
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
              <ThemeToggle />
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
        {appState !== 'welcome' && (
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
            />
          </div>
        )}

        {/* Stepper */}
        {appState === 'questionnaire' && questions.length > 0 && (
          <div className="container mx-auto px-4 mt-6">
             <Stepper
                sections={sectionsForStepper}
                currentSectionId={activeSectionId}
                // --- MODIFIED: Pass the new completed sections state ---
                completedSections={Object.keys(completedSections)}
                onStepClick={(index) => handleStepClick(index)}
                iconMap={iconMap}
              />
          </div>
        )}
        {appState === 'welcome' && <WelcomeScreen onStart={handleStart} />}
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
          />
        )}
      </main>
    </div>
  );
}
