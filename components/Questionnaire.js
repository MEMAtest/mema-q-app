import React from 'react';

const Questionnaire = ({
  section,
  question,
  onAnswer,
  onNext,
  onPrev,
  isFirstQuestion,
  isLastQuestion,
  currentAnswer
}) => {
  
  // Handles changes to radio buttons or dropdowns
  const handleOptionChange = (e) => {
    onAnswer(question.id, { 
      answer: e.target.value, 
      notes: currentAnswer?.notes || '' 
    });
  };

  // Handles changes in the notes textarea
  const handleNotesChange = (e) => {
    onAnswer(question.id, {
      answer: currentAnswer?.answer,
      notes: e.target.value
    });
  };

  const renderAnswerOptions = () => {
    const { type, options } = question;
    const selectedValue = currentAnswer?.answer;

    if (type === 'yesno') {
      return ['Yes', 'No'].map((option) => (
        <label key={option} className="radio-label">
          <input
            type="radio"
            name={question.id}
            value={option}
            checked={selectedValue === option}
            onChange={handleOptionChange}
          />
          <span>{option}</span>
        </label>
      ));
    }

    if (type === 'dropdown') {
      return (
        <select value={selectedValue || ''} onChange={handleOptionChange}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.text}
            </option>
          ))}
        </select>
      );
    }
    
    // Add other types like 'multiselect' here if needed
    return null;
  };

  return (
    <div className="app-container">
      <div className="question-card">
        <div className="question-header">
          <p className="question-ref">Ref: {question.id}</p>
          <span className="explainer-icon" title={question.explanation}>ℹ️</span>
        </div>
        <p className="question-text">{question.questionText}</p>
        <div className="answer-options my-6">{renderAnswerOptions()}</div>
        
        {/* === NOTES TEXTAREA === */}
        <div className="notes-area mt-6">
          <label htmlFor="notes" className="block text-sm font-semibold text-slate-700 mb-1">
            Notes/Considerations (Optional):
          </label>
          <textarea
            id="notes"
            className="w-full p-2 border border-slate-300 rounded-md"
            placeholder="Enter any specific notes or justifications..."
            value={currentAnswer?.notes || ''}
            onChange={handleNotesChange}
            rows="4"
          />
        </div>
        {/* === END NOTES TEXTAREA === */}

      </div>

      <div className="navigation-buttons mt-8 flex justify-between">
        <button onClick={onPrev} disabled={isFirstQuestion}>
          Previous
        </button>
        <button onClick={onNext}>
          {isLastQuestion ? 'Finish & View Results' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;
