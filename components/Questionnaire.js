import React, { useState } from 'react';
import {
  InformationCircleIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const Questionnaire = ({
  question,
  section,
  onAnswer,
  onNext,
  onPrev,
  isFirstQuestion,
  isLastQuestion,
  currentAnswer
}) => {
  const [infoPanelOpen, setInfoPanelOpen] = useState(true);

  const handleOptionChange = (value) => {
    onAnswer(question.id, {
      answer: value,
      notes: currentAnswer?.notes || ''
    });
  };

  const handleNotesChange = (e) => {
    onAnswer(question.id, {
      answer: currentAnswer?.answer,
      notes: e.target.value
    });
  };

  const handleMultiSelectChange = (value) => {
    const currentSelection = Array.isArray(currentAnswer?.answer) ? currentAnswer.answer : [];
    let newSelection;

    if (currentSelection.includes(value)) {
      newSelection = currentSelection.filter(item => item !== value);
    } else {
      newSelection = [...currentSelection, value];
    }

    onAnswer(question.id, {
      answer: newSelection,
      notes: currentAnswer?.notes || ''
    });
  };

  // Calculate question number (1 of 36 format)
  const getQuestionNumber = () => {
    if (!section || !question) return { current: 0, total: 0 };

    // Find the index of current question within the section
    const indexInSection = section.items.findIndex(item => item.id === question.id);

    // Count all questions before this section
    let questionsBeforeSection = 0;
    // This would need to be passed from parent if we want accurate total

    return {
      current: indexInSection + 1,
      sectionTotal: section.items.length
    };
  };

  const renderAnswerOptions = () => {
    const { type, options } = question;
    const selectedValue = currentAnswer?.answer;

    if (type === 'yesno') {
      return (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          {['Yes', 'No'].map((option) => {
            const isSelected = selectedValue === option;
            const isYes = option === 'Yes';

            return (
              <button
                key={option}
                onClick={() => handleOptionChange(option)}
                className="answer-card-large"
                data-selected={isSelected}
                style={{
                  padding: 'var(--spacing-xl)',
                  border: `3px solid ${isSelected
                    ? (isYes ? 'var(--color-success)' : 'var(--color-danger)')
                    : 'var(--color-border-light)'}`,
                  borderRadius: 'var(--radius-lg)',
                  background: isSelected
                    ? (isYes ? 'var(--color-success-bg)' : 'var(--color-danger-bg)')
                    : 'var(--color-bg-white)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  minHeight: '140px',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    e.currentTarget.style.borderColor = isYes ? 'var(--color-success)' : 'var(--color-danger)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.borderColor = 'var(--color-border-light)';
                  }
                }}
              >
                {isYes ? (
                  <CheckCircleIcon style={{
                    width: '3rem',
                    height: '3rem',
                    color: isSelected ? 'var(--color-success)' : 'var(--color-text-muted)'
                  }} />
                ) : (
                  <XCircleIcon style={{
                    width: '3rem',
                    height: '3rem',
                    color: isSelected ? 'var(--color-danger)' : 'var(--color-text-muted)'
                  }} />
                )}
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: 'var(--font-bold)',
                  color: isSelected
                    ? (isYes ? 'var(--color-success-dark)' : 'var(--color-danger-dark)')
                    : 'var(--color-text-primary)'
                }}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      );
    }

    if (type === 'dropdown') {
      if (!Array.isArray(options)) return <div style={{ color: 'var(--color-danger)' }}>Error: Dropdown options not available.</div>;
      return (
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <select
            value={selectedValue || ''}
            onChange={(e) => handleOptionChange(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              fontSize: '1rem',
              border: '2px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg-white)',
              cursor: 'pointer',
              transition: 'all var(--transition-base)'
            }}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.text}</option>
            ))}
          </select>
        </div>
      );
    }

    if (type === 'multiselect') {
      if (!Array.isArray(options)) return <div style={{ color: 'var(--color-danger)' }}>Error: Multi-select options not available.</div>;
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          {options.map((opt) => {
            const isSelected = selectedValue?.includes(opt.value) || false;
            return (
              <button
                key={opt.value}
                onClick={() => handleMultiSelectChange(opt.value)}
                className="multiselect-option"
                data-selected={isSelected}
                style={{
                  padding: 'var(--spacing-md)',
                  border: `2px solid ${isSelected ? 'var(--color-accent-primary)' : 'var(--color-border-light)'}`,
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--color-accent-primary-bg)' : 'var(--color-bg-white)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  textAlign: 'left'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${isSelected ? 'var(--color-accent-primary)' : 'var(--color-border)'}`,
                  background: isSelected ? 'var(--color-accent-primary)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isSelected && (
                    <CheckCircleIcon style={{ width: '16px', height: '16px', color: 'white' }} />
                  )}
                </div>
                <span style={{
                  fontSize: '1rem',
                  fontWeight: isSelected ? 'var(--font-semibold)' : 'var(--font-regular)',
                  color: 'var(--color-text-primary)'
                }}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>
      );
    }

    return null;
  };

  const questionNum = getQuestionNumber();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-light)',
      padding: 'var(--spacing-xl) var(--spacing-md)',
      paddingBottom: 'var(--spacing-3xl)'
    }}>
      <div className="content-wrapper" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: 'var(--spacing-2xl)',
          alignItems: 'start'
        }}
        className="questionnaire-layout">
          {/* Main Question Area */}
          <div>
            {question ? (
              <div className="question-card" style={{
                background: 'var(--color-bg-white)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--spacing-2xl)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--color-border-light)'
              }}>
                {/* Question Number Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  background: 'var(--color-accent-primary-bg)',
                  color: 'var(--color-accent-primary)',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.875rem',
                  fontWeight: 'var(--font-semibold)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  <InformationCircleIcon style={{ width: '1rem', height: '1rem' }} />
                  Question {questionNum.current} of {questionNum.sectionTotal} in this section
                </div>

                {/* Question Text */}
                <h3 style={{
                  fontSize: '1.75rem',
                  fontWeight: 'var(--font-bold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-md)',
                  lineHeight: 1.4
                }}>
                  {question.questionText}
                </h3>

                {/* Reference */}
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-muted)',
                  marginBottom: 'var(--spacing-2xl)',
                  fontWeight: 'var(--font-medium)'
                }}>
                  Reference: {question.questionRef}
                </p>

                {/* Answer Options */}
                {renderAnswerOptions()}

                {/* Notes Area */}
                <div style={{
                  marginTop: 'var(--spacing-xl)',
                  padding: 'var(--spacing-lg)',
                  background: 'var(--color-bg-light)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border-light)'
                }}>
                  <label htmlFor="notes" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    fontSize: '1rem',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-md)'
                  }}>
                    <DocumentTextIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                    Add Notes or Justification (Optional)
                  </label>
                  <textarea
                    id="notes"
                    placeholder="Add any additional context, notes, or justification for your answer..."
                    value={currentAnswer?.notes || ''}
                    onChange={handleNotesChange}
                    rows="4"
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      border: '2px solid var(--color-border-light)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.9375rem',
                      fontFamily: 'var(--font-primary)',
                      transition: 'all var(--transition-base)',
                      resize: 'vertical',
                      minHeight: '100px',
                      background: 'var(--color-bg-white)'
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
            ) : (
              <div className="question-card" style={{ textAlign: 'center', padding: 'var(--spacing-3xl)' }}>
                <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
                <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-text-muted)' }}>Loading question...</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'var(--spacing-xl)',
              gap: 'var(--spacing-md)'
            }}>
              <button
                onClick={onPrev}
                disabled={isFirstQuestion}
                className="btn-previous"
                style={{
                  padding: 'var(--spacing-md) var(--spacing-xl)',
                  fontSize: '1rem',
                  fontWeight: 'var(--font-semibold)',
                  opacity: isFirstQuestion ? 0.3 : 1,
                  cursor: isFirstQuestion ? 'not-allowed' : 'pointer'
                }}
              >
                ← Previous
              </button>
              <button
                onClick={onNext}
                className="start-button"
                style={{
                  padding: 'var(--spacing-md) var(--spacing-2xl)',
                  fontSize: '1rem',
                  fontWeight: 'var(--font-bold)',
                  background: isLastQuestion ? 'var(--color-success)' : 'var(--color-accent-primary)',
                  boxShadow: isLastQuestion ? 'var(--shadow-accent-primary)' : 'var(--shadow-md)'
                }}
              >
                {isLastQuestion ? '✓ Finish & View Results' : 'Next →'}
              </button>
            </div>
          </div>

          {/* Sidebar: Info Panel */}
          <div style={{ position: 'sticky', top: '100px' }}>
            {question && (
              <div style={{
                background: 'var(--color-bg-white)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--color-border-light)',
                overflow: 'hidden'
              }}>
                {/* Panel Header */}
                <button
                  onClick={() => setInfoPanelOpen(!infoPanelOpen)}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-lg)',
                    background: 'var(--color-accent-primary-bg)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all var(--transition-base)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)'
                  }}>
                    <LightBulbIcon style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      color: 'var(--color-accent-primary)'
                    }} />
                    <span style={{
                      fontSize: '1.125rem',
                      fontWeight: 'var(--font-bold)',
                      color: 'var(--color-accent-primary)'
                    }}>
                      Why this is important
                    </span>
                  </div>
                  {infoPanelOpen ? (
                    <ChevronUpIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-accent-primary)' }} />
                  ) : (
                    <ChevronDownIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-accent-primary)' }} />
                  )}
                </button>

                {/* Panel Content */}
                {infoPanelOpen && (
                  <div style={{ padding: 'var(--spacing-lg)' }}>
                    <p style={{
                      fontSize: '0.9375rem',
                      lineHeight: 1.7,
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--spacing-lg)'
                    }}>
                      {question.explanation}
                    </p>

                    {/* Compliance Tip */}
                    <div style={{
                      padding: 'var(--spacing-md)',
                      background: 'var(--color-success-bg)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-success-border)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 'var(--spacing-sm)'
                      }}>
                        <CheckCircleIcon style={{
                          width: '1.25rem',
                          height: '1.25rem',
                          color: 'var(--color-success)',
                          flexShrink: 0,
                          marginTop: '2px'
                        }} />
                        <div>
                          <p style={{
                            fontSize: '0.875rem',
                            fontWeight: 'var(--font-semibold)',
                            color: 'var(--color-success-dark)',
                            marginBottom: 'var(--spacing-xs)'
                          }}>
                            Compliance Tip
                          </p>
                          <p style={{
                            fontSize: '0.8125rem',
                            color: 'var(--color-text-secondary)',
                            margin: 0,
                            lineHeight: 1.6
                          }}>
                            Your response will be used to assess compliance with FCA PERG 8 guidance and identify any potential gaps.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .questionnaire-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Questionnaire;
