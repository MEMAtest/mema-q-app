import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import WelcomeScreen from '../components/WelcomeScreen';
import Questionnaire from '../components/Questionnaire';
import ResultsPage from '../components/ResultsPage';
import Stepper from '../components/Stepper';

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


export default function Home() {
  const [appState, setAppState] = useState('welcome');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  // --- ADDED: State to track completed sections for the Stepper ---
  const [completedSections, setCompletedSections] = useState({});

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

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Head>
        <title>MEMA Financial Promotions App</title>
      </Head>

      <header className="bg-white text-slate-800 p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
                <Image
                    src="/mema-logo.png"
                    alt="MEMA Consultants Logo"
                    width={160}
                    height={40}
                    className="object-contain"
                />
            </div>
            {appState === 'questionnaire' && (
                <button onClick={handleShowResults} className="start-button" style={{margin: '0'}}>
                    View Results
                </button>
            )}
        </div>
      </header>

      <main>
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
