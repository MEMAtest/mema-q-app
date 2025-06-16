import { useState, useEffect } from 'react';
import Head from 'next/head';
import WelcomeScreen from '../components/WelcomeScreen';
import Questionnaire from '../components/Questionnaire';
import ResultsPage from '../components/ResultsPage';
import Stepper from '../components/Stepper';

export default function Home() {
  const [appState, setAppState] = useState('welcome');
  const [questions, setQuestions] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [analysisResult, setAnalysisResult] = useState(null);

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

  const handleStart = () => {
    setAppState('questionnaire');
  };

  const handleStepClick = (sectionIndex) => {
    if (sectionIndex <= currentSection) {
      setCurrentSection(sectionIndex);
      setCurrentQuestion(0);
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
      setCurrentSection(prev => prev + 1);
      setCurrentQuestion(0);
    } else {
      handleShowResults();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentSection > 0) {
      const prevSectionIndex = currentSection - 1;
      const prevSection = questions[prevSectionIndex];
      setCurrentSection(prevSectionIndex);
      setCurrentQuestion(prevSection.items.length - 1);
    }
  };
  
  const handleShowResults = () => {
    const results = analyzeResults();
    setAnalysisResult(results);
    setAppState('results');
  };

  const handleGoBack = () => {
    setAppState('questionnaire');
  };

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
                    compliantAnswersForScore++;
                    sectionYesCount++;
                } else if (answer === 'No') {
                    sectionNoCount++;
                    if (item.complianceImplicationIfNo) {
                        isFailure = true;
                        implicationText = item.complianceImplicationIfNo;
                    }
                } else {
                    sectionUnansweredCount++;
                }
            } else if (item.type === 'dropdown') {
                if (answer && item.complianceImplicationIfSelected && item.complianceImplicationIfSelected[answer]) {
                    isFailure = true;
                    implicationText = item.complianceImplicationIfSelected[answer];
                    sectionNoCount++;
                } else if (answer) {
                    compliantAnswersForScore++;
                    sectionOtherCount++;
                } else {
                    sectionUnansweredCount++;
                }
            }
            if (isFailure) {
                potentialFailures.push({ id: item.id, question: item.questionText, ref: item.ref, implication: implicationText,notes: answers[item.id]?.notes || '' });
            }
        });
        return {
            title: section.sectionTitle.replace(/Section \d+: /g, ""),
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
      title: section.sectionTitle
  }));
  
  return (
    <div>
      <Head>
        <title>MEMA Financial Promotions App</title>
      </Head>

      <main>
        {appState === 'questionnaire' && questions.length > 0 && (
          <div className="container mx-auto px-4 mt-6">
             <Stepper
                sections={sectionsForStepper}
                currentSectionIndex={currentSection}
                onStepClick={handleStepClick}
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
          />
        )}
      </main>
    </div>
  );
}
