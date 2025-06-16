// components/Questionnaire.js
import { useState } from 'react';

export default function Questionnaire({ question, onAnswer, currentIndex, totalQuestions }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAnswer === null) {
      alert("Please select an answer.");
      return;
    }
    onAnswer(question.id, selectedAnswer);
    setSelectedAnswer(null); // Reset for the next question
  };

  const renderOptions = () => {
    // We will build this out later. For now, we'll use simple buttons.
    return (
        <div className="flex justify-center space-x-4 my-6">
            <button onClick={() => setSelectedAnswer('Yes')} className={`px-6 py-2 rounded-lg ${selectedAnswer === 'Yes' ? 'bg-indigo-700 text-white' : 'bg-slate-200'}`}>Yes</button>
            <button onClick={() => setSelectedAnswer('No')} className={`px-6 py-2 rounded-lg ${selectedAnswer === 'No' ? 'bg-indigo-700 text-white' : 'bg-slate-200'}`}>No</button>
        </div>
    );
  };

  return (
    <div>
        <div className="text-center mb-4 text-slate-600">Question {currentIndex + 1} of {totalQuestions}</div>
        <div className="question-card">
            <p className="question-ref">Ref: {question.questionRef}</p>
            <p className="question-text">{question.questionText}</p>
            {/* We will add the explainer logic later */}
            <form onSubmit={handleSubmit}>
                {renderOptions()}
                <div className="navigation-buttons mt-8 flex justify-end">
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Next Question</button>
                </div>
            </form>
        </div>
    </div>
  );
}
