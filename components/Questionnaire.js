import React, { useEffect } from 'react';
import {
  InformationCircleIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import ProgressBar from './ProgressBar';
import QuestionnaireLeftSidebar from './QuestionnaireLeftSidebar';

const Questionnaire = ({
  section,
  question,
  onAnswer,
  onNext,
  onPrev,
  isFirstQuestion,
  isLastQuestion,
  currentAnswer,
  progressData,
  sections,
  currentSectionId,
  completedSections,
  onStepClick,
  currentSectionIndex
}) => {

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + Arrow keys for navigation
      if (e.altKey) {
        if (e.key === 'ArrowRight' && !isLastQuestion) {
          e.preventDefault();
          onNext();
        } else if (e.key === 'ArrowLeft' && !isFirstQuestion) {
          e.preventDefault();
          onPrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, isFirstQuestion, isLastQuestion]);

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
      return (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginTop: 'var(--spacing-md)'
        }}>
          {[
            { value: 'Yes', icon: CheckCircleIcon, color: 'var(--color-success)', label: 'Compliant' },
            { value: 'No', icon: XCircleIcon, color: 'var(--color-danger)', label: 'Issue' }
          ].map(({ value, icon: Icon, color, label }) => {
            const isSelected = selectedValue === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  onAnswer(question.id, {
                    answer: value,
                    notes: currentAnswer?.notes || ''
                  });
                }}
                style={{
                  position: 'relative',
                  padding: 'var(--spacing-xl)',
                  background: isSelected ? 'var(--color-bg-white)' : 'var(--color-bg-white)',
                  border: isSelected ? `3px solid ${color}` : '2px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  boxShadow: isSelected ? `0 10px 30px ${color}40` : 'var(--shadow-sm)',
                  transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                  minHeight: '180px',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = color;
                    e.currentTarget.style.boxShadow = `0 5px 15px ${color}20`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--color-border-light)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
                aria-label={`Select ${value}`}
                aria-pressed={isSelected}
              >
                <Icon style={{
                  width: '4rem',
                  height: '4rem',
                  color: color,
                  strokeWidth: 2
                }} />
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'var(--font-bold)',
                  color: 'var(--color-text-primary)'
                }}>
                  {value}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)'
                }}>
                  {value === 'Yes' ? '✓' : '⚠️'} {label}
                </div>

                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: 'var(--spacing-sm)',
                    right: 'var(--spacing-sm)',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'var(--font-bold)'
                  }}>
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      );
    }

    if (type === 'dropdown') {
      if (!Array.isArray(options)) return <div style={{ color: 'var(--color-danger)' }}>Error: Dropdown options not available.</div>;
      return (
        <select value={selectedValue || ''} onChange={handleOptionChange}>
          {options.map((opt) => ( <option key={opt.value} value={opt.value}>{opt.text}</option>))}
        </select>
      );
    }

    if (type === 'multiselect') {
        if (!Array.isArray(options)) return <div style={{ color: 'var(--color-danger)' }}>Error: Multi-select options not available.</div>;
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {options.map((opt) => (
                    <label key={opt.value} className="checkbox-label" data-checked={selectedValue?.includes(opt.value) || false} style={{ display: 'block' }}>
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
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-light)'
    }}>
      {/* Screen reader announcement for question changes */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {progressData && `Question ${progressData.currentQuestionIndex} of ${progressData.totalQuestions}`}
      </div>

      {/* Progress Bar */}
      {progressData && (
        <ProgressBar
          currentQuestionIndex={progressData.currentQuestionIndex}
          totalQuestions={progressData.totalQuestions}
          answeredCount={progressData.answeredCount}
          currentSectionNumber={progressData.currentSectionNumber}
          totalSections={progressData.totalSections}
          currentSectionName={progressData.currentSectionName}
        />
      )}

      {/* Main Layout: Left Sidebar + Content Area */}
      <div style={{
        display: 'flex',
        minHeight: 'calc(100vh - 80px)' // Account for progress bar
      }}>
        {/* Left Sidebar Navigation */}
        {sections && (
          <QuestionnaireLeftSidebar
            sections={sections}
            currentSectionId={currentSectionId}
            completedSections={completedSections}
            onStepClick={onStepClick}
            currentSectionIndex={currentSectionIndex}
          />
        )}

        {/* Main Content Area */}
        <div style={{
          flex: 1,
          padding: 'var(--spacing-xl) var(--spacing-md)',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          <div style={{
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {question ? (
              <>
                {/* Question Card */}
                <div className="question-card">
                  {/* Question Header */}
                  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h4 className="question-text" style={{
                      fontSize: '1.5rem',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--spacing-sm)',
                      lineHeight: 1.4
                    }}>
                      {progressData ? `${progressData.currentQuestionIndex} of ${progressData.totalQuestions}` : question.id}. {question.questionText}
                    </h4>
                    <p className="question-ref" style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-accent-primary)',
                      fontWeight: 'var(--font-medium)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      cursor: 'pointer'
                    }}>
                      <InformationCircleIcon style={{ width: '1rem', height: '1rem' }} />
                      Reference: {question.questionRef}
                    </p>
                  </div>

                  {/* Answer Options */}
                  <div className="answer-options" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    {renderAnswerOptions()}
                  </div>

                  {/* Notes Area */}
                  <div className="notes-area">
                    <label htmlFor="notes" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      fontSize: '1rem',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--spacing-sm)'
                    }}>
                      <DocumentTextIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                      Your Justification (Optional):
                    </label>
                    <textarea
                      id="notes"
                      placeholder="Enter any specific notes or justifications..."
                      value={currentAnswer?.notes || ''}
                      onChange={handleNotesChange}
                      rows="4"
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        border: '2px solid var(--color-border-light)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1rem',
                        fontFamily: 'var(--font-primary)',
                        transition: 'all var(--transition-base)',
                        resize: 'vertical',
                        minHeight: '100px'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-accent-primary)';
                        e.target.style.boxShadow = '0 0 0 3px var(--color-accent-primary-bg)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--color-border-light)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* "Why this is important" Panel - Below Question Card */}
                <div className="sidebar-panel" style={{ marginTop: 'var(--spacing-xl)' }}>
                  <h4>
                    <InformationCircleIcon />
                    Why this is important
                  </h4>
                  <p>{question.explanation}</p>

                  {/* Additional Context */}
                  <div style={{
                    marginTop: 'var(--spacing-lg)',
                    padding: 'var(--spacing-md)',
                    background: 'var(--color-accent-primary-bg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-accent-primary)'
                  }}>
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-accent-primary)',
                      fontWeight: 'var(--font-medium)',
                      margin: 0
                    }}>
                      💡 Tip: Your response will help assess compliance with FCA PERG guidance
                    </p>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="navigation-buttons" style={{ marginTop: 'var(--spacing-xl)' }} role="navigation" aria-label="Question navigation">
                  <button
                    onClick={onPrev}
                    disabled={isFirstQuestion}
                    className="btn-previous"
                    style={{
                      visibility: isFirstQuestion ? 'hidden' : 'visible',
                      opacity: isFirstQuestion ? 0 : 1
                    }}
                    aria-label="Go to previous question"
                    tabIndex={isFirstQuestion ? -1 : 0}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={onNext}
                    className={isLastQuestion ? 'btn-finish' : ''}
                    style={{
                      background: isLastQuestion ? 'var(--color-success)' : 'var(--color-accent-primary)'
                    }}
                    aria-label={isLastQuestion ? 'Finish assessment and view results' : 'Go to next question'}
                  >
                    {isLastQuestion ? '✓ Finish & View Results' : 'Next →'}
                  </button>
                </div>
              </>
            ) : (
              <div className="question-card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
                <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-text-muted)' }}>Loading question...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
