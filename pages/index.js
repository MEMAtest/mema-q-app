// pages/index.js
import { useState, useEffect } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import Questionnaire from '../components/Questionnaire';
import ResultsPage from '../components/ResultsPage';

export default function HomePage() {
  // State to manage the overall application flow
  const [quizState, setQuizState] = useState('welcome'); // 'welcome', 'active', 'results'
  
  // State to hold data fetched from our API
  const [questions, setQuestions] = useState([]);
  
  // State to track user's progress
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  // Fetch questions from our API when the component loads
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/questions');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };
    fetchQuestions();
  }, []); // The empty array means this effect runs only once

  // --- Handler Functions ---

  const startQuiz = () => {
    setQuizState('active');
  };

  const handleAnswer = (questionId, answer) => {
    // Record the answer
    setAnswers(prev => ({ ...prev, [questionId]: answer }));

    // Move to the next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizState('results');
    }
  };

  const restartQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setQuizState('welcome');
  };
  
  // --- Render Logic ---
  
  // Don't render anything until the questions have loaded
  if (questions.length === 0) {
    return <div>Loading Questionnaire...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-indigo-700 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-semibold">MEMA Consultants - Financial Promotions Questionnaire</h1>
            {quizState === 'active' && <button onClick={() => setQuizState('results')} className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-2 px-4 rounded-lg transition">View Results</button>}
        </div>
      </header>
      
      <main className="app-container flex-grow">
        {quizState === 'welcome' && <WelcomeScreen onStart={startQuiz} />}
        
        {quizState === 'active' && (
          <Questionnaire
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
          />
        )}
        
        {quizState === 'results' && <ResultsPage answers={answers} questions={questions} onRestart={restartQuiz} />}
      </main>

      <footer className="text-center p-4 text-sm text-slate-500 bg-slate-200 mt-auto">
         MEMA Consultants - Financial Promotions Questionnaire
      </footer>
    </div>
  );
}
