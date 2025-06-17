import React from 'react';

const Questionnaire = ({
  question,
  onAnswer,
  onNext,
  onPrev,
  isFirstQuestion,
  isLastQuestion,
  currentAnswer
}) => {
  
  const handleOptionChange = (e) => {
    onAnswer(question.id, { 
      answer: e.target.value, 
      notes: currentAnswer?.notes || '' 
    });
  };

  const handleNotesChange = (e) => {
    onAnswer(question.id, {
      answer: currentAnswer?.answer,
      notes: e.target.value
    });
  };

  const handleMultiSelectChange = (e) => {
    const { value, checked } = e.target;
    const currentSelection = Array.isArray(currentAnswer?.answer) ? currentAnswer.answer : [];
    
    let newSelection;
    if (checked) {
      newSelection = [...currentSelection, value];
    } else {
      newSelection = currentSelection.filter(item => item !== value);
    }

    onAnswer(question.id, {
      answer: newSelection,
      notes: currentAnswer?.notes || ''
    });
  };

  const renderAnswerOptions = () => {
    const { type, options } = question;
    const selectedValue = currentAnswer?.answer;

    if (type === 'yesno') {
      return ['Yes', 'No'].map((option) => (
        <label key={option} className="radio-label" data-checked={selectedValue === option}>
          <input type="radio" name={question.id} value={option} checked={selectedValue === option} onChange={handleOptionChange}/>
          <span>{option}</span>
        </label>
      ));
    }

    if (type === 'dropdown') {
      if (!Array.isArray(options)) return <div className="text-red-500">Error: Dropdown options not available.</div>;
      return (
        <select value={selectedValue || ''} onChange={handleOptionChange}>
          {options.map((opt) => ( <option key={opt.value} value={opt.value}>{opt.text}</option>))}
        </select>
      );
    }
    
    if (type === 'multiselect') {
        if (!Array.isArray(options)) return <div className="text-red-500">Error: Multi-select options not available.</div>;
        return (
            <div className="space-y-2">
                {options.map((opt) => (
                    <label key={opt.value} className="checkbox-label block" data-checked={selectedValue?.includes(opt.value) || false}>
                        <input
                            type="checkbox"
                            value={opt.value}
                            checked={selectedValue?.includes(opt.value) || false}
                            onChange={handleMultiSelectChange}
                        />
                        <span>{opt.text}</span>
                    </label>
                ))}
            </div>
        );
    }
    
    return null;
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="layout-wrapper">
          <div className="layout-main">
            {/* Ensure question object exists before rendering */}
            {question ? (
              <>
                <h4 className="question-text">{question.id}. {question.questionText}</h4>
                <p className="question-ref">Reference: {question.questionRef}</p>
                <div className="answer-options">{renderAnswerOptions()}</div>
                <div className="notes-area">
                  <label htmlFor="notes" className="block text-sm font-semibold text-slate-700 mb-1">Notes/Considerations (Optional):</label>
                  <textarea id="notes" placeholder="Enter any specific notes or justifications..." value={currentAnswer?.notes || ''} onChange={handleNotesChange} rows="4"/>
                </div>
              </>
            ) : (
              <p>Loading question...</p>
            )}
          </div>
          <div className="layout-sidebar">
            {question && (
              <div className="question-explanation sticky top-8">
                  <h4 className="font-bold text-slate-700 mb-2">Why this is important</h4>
                  <p>{question.explanation}</p>
              </div>
            )}
          </div>
        </div>
        <div className="navigation-buttons">
          <button onClick={onPrev} disabled={isFirstQuestion} style={{ visibility: isFirstQuestion ? 'hidden' : 'visible' }}>
              Previous
          </button>
          <button onClick={onNext} className={isLastQuestion ? 'btn-finish' : ''}>
              {isLastQuestion ? 'Finish & View Results' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;