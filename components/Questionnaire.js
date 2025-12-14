import React, { useMemo } from 'react';
import Image from 'next/image';

const YES_NO_DESCRIPTIONS = {
  Yes: 'Requirement satisfied or exemption applied.',
  No: 'Requirement missing or needs escalation.'
};

const MAX_NOTES = 280;

const Questionnaire = ({
  question,
  section,
  onAnswer,
  onNext,
  onPrev,
  isFirstQuestion,
  isLastQuestion,
  currentAnswer,
}) => {
  const notesLength = currentAnswer?.notes?.length || 0;

  const handleOptionChange = (value) => {
    onAnswer(question.id, {
      answer: value,
      notes: currentAnswer?.notes || ''
    });
  };

  const handleNotesChange = (e) => {
    onAnswer(question.id, {
      answer: currentAnswer?.answer,
      notes: e.target.value.slice(0, MAX_NOTES)
    });
  };

  const handleMultiSelectChange = (value) => {
    const currentSelection = Array.isArray(currentAnswer?.answer) ? currentAnswer.answer : [];
    const newSelection = currentSelection.includes(value)
      ? currentSelection.filter((item) => item !== value)
      : [...currentSelection, value];

    onAnswer(question.id, {
      answer: newSelection,
      notes: currentAnswer?.notes || ''
    });
  };

  const getQuestionNumber = () => {
    if (!section || !question) return { current: 0, sectionTotal: 0 };
    const indexInSection = section.items.findIndex((item) => item.id === question.id);
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
        <div className="answer-toggle-group">
          {['Yes', 'No'].map((option) => (
            <button
              key={option}
              type="button"
              className="answer-toggle"
              data-selected={selectedValue === option}
              onClick={() => handleOptionChange(option)}
            >
              <span className="toggle-label">{option}</span>
              <span className="toggle-copy">{YES_NO_DESCRIPTIONS[option]}</span>
            </button>
          ))}
        </div>
      );
    }

    if (type === 'dropdown') {
      if (!Array.isArray(options)) return <div style={{ color: 'var(--color-danger)' }}>Dropdown options unavailable.</div>;
      return (
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <select
            value={selectedValue || ''}
            onChange={(e) => handleOptionChange(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              borderRadius: '1rem',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              fontSize: '1rem',
              background: '#ffffff'
            }}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.text}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (type === 'multiselect') {
      if (!Array.isArray(options)) return <div style={{ color: 'var(--color-danger)' }}>Multiselect options unavailable.</div>;
      return (
        <div className="answer-toggle-group">
          {options.map((opt) => {
            const active = Array.isArray(selectedValue) && selectedValue.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                className="answer-toggle"
                data-selected={active}
                onClick={() => handleMultiSelectChange(opt.value)}
              >
                <span className="toggle-label">{opt.text}</span>
              </button>
            );
          })}
        </div>
      );
    }

    return null;
  };

  const questionNum = getQuestionNumber();

  const insightCards = useMemo(() => {
    const reference = question?.questionRef || 'FCA Handbook';
    return [
      {
        title: 'Definition',
        copy: question?.explanation || 'This control confirms whether the communication meets the FCA definition of a financial promotion.'
      },
      {
        title: 'Examples',
        copy: 'Look for invitations to act, incentives, or persuasive messaging aimed at the audience.'
      },
      {
        title: 'Relevant Guidance',
        copy: reference,
        link: reference
      },
      {
        title: 'Best Practice',
        copy: 'Capture rationale and approvals for each decision to maintain an audit-ready record.'
      }
    ];
  }, [question?.explanation, question?.questionRef]);

  const helperMessage = currentAnswer?.answer
    ? 'Document why you selected this response so reviewers understand the context.'
    : 'Select an answer to reveal tailored guidance and insights.';

  return (
    <div className="assessment-shell">
      <div className="assessment-grid">
        <section className="assessment-question-card">
          {question ? (
            <>
              <div className="question-meta">
                <span className="meta-pill accent">Step {questionNum.current} of {questionNum.sectionTotal}</span>
                <span className="meta-pill">{section?.title || 'Current Section'}</span>
              </div>
              <h3>{question.questionText}</h3>
              <p className="question-reference">Reference: {question.questionRef}</p>

              {renderAnswerOptions()}

              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>{helperMessage}</p>

              <div className="notes-field">
                <label htmlFor="notes" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'var(--font-semibold)', marginBottom: '0.5rem' }}>
                  <Image src="/icons/actions/document-text.svg" alt="" width={18} height={18} style={{ width: '1.1rem', height: '1.1rem' }} />
                  Add Justification / Notes
                </label>
                <textarea
                  id="notes"
                  placeholder="Explain rationale, approvals, or mitigation activities so your audit trail is airtight."
                  value={currentAnswer?.notes || ''}
                  onChange={handleNotesChange}
                />
                <div className="notes-counter">{notesLength}/{MAX_NOTES}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-xl)', gap: 'var(--spacing-md)' }}>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={onPrev}
                  disabled={isFirstQuestion}
                  style={{ opacity: isFirstQuestion ? 0.4 : 1 }}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="start-button"
                  onClick={onNext}
                  style={{ background: 'var(--color-accent-primary)', flexShrink: 0 }}
                >
                  {isLastQuestion ? 'Finish & View Results' : 'Next'}
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
              Loading question...
            </div>
          )}
        </section>

        <aside className="assessment-insights">
          {insightCards.map((card) => (
            <div key={card.title} className="insight-card">
              <h5>{card.title}</h5>
              <p style={{ margin: 0 }}>{card.copy}</p>
              {card.link && (
                <a className="link-chip" href="#" style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  {card.link}
                </a>
              )}
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default Questionnaire;
