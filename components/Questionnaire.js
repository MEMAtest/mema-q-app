import React, { useMemo, useState } from 'react';
import Image from 'next/image';

const YES_NO_DESCRIPTIONS = {
  Yes: 'Requirement satisfied or exemption applied.',
  No: 'Requirement missing or needs escalation.'
};

const MAX_NOTES = 280;

// FCA Guidance Reference Texts
const GUIDANCE_TEXTS = {
  'PERG 8.8': 'PERG 8.8 provides guidance on the meaning of "invitation or inducement" in the context of financial promotions. A communication is likely to be an invitation or inducement if it is intended, or may reasonably be regarded as intended, to persuade or influence persons to engage in investment activity.',
  'PERG 8.4': 'PERG 8.4 defines what constitutes a financial promotion under section 21 of the Financial Services and Markets Act 2000. It covers communications that invite or induce persons to engage in investment activity.',
  'FG24/1 (2.47-2.52)': 'FG24/1 sections 2.47-2.52 provide guidance on Consumer Duty requirements for financial promotions, including ensuring communications are clear, fair and not misleading, and provide consumers with the information they need to make informed decisions.',
  'PERG 8.12': 'PERG 8.12 addresses the real time and non-real time distinction for financial promotions. Real time communications occur during an interaction where there is opportunity for immediate response, while non-real time promotions are prepared in advance.',
  'FSMA s21': 'Section 21 of the Financial Services and Markets Act 2000 restricts financial promotions. It states that a person must not, in the course of business, communicate an invitation or inducement to engage in investment activity unless they are an authorised person or the content is approved by an authorised person.',
  'default': 'This reference provides guidance from the FCA Handbook or related regulatory materials. Click to view the full guidance in the FCA Handbook.'
};

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
  const [showGuidanceModal, setShowGuidanceModal] = useState(false);
  const [selectedGuidance, setSelectedGuidance] = useState({ ref: '', text: '' });
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

  const handleGuidanceClick = (e, reference) => {
    e.preventDefault();
    const guidanceText = GUIDANCE_TEXTS[reference] || GUIDANCE_TEXTS['default'];
    setSelectedGuidance({ ref: reference, text: guidanceText });
    setShowGuidanceModal(true);
  };

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
        copy: 'Click the reference below to view full guidance text',
        link: reference,
        isGuidanceLink: true
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
                <a
                  className="link-chip"
                  href="#"
                  onClick={(e) => card.isGuidanceLink ? handleGuidanceClick(e, card.link) : null}
                  style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
                >
                  {card.link}
                </a>
              )}
            </div>
          ))}
        </aside>
      </div>

      {/* Guidance Modal */}
      {showGuidanceModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={() => setShowGuidanceModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--spacing-2xl)',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: 'var(--shadow-2xl)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
              <div>
                <h3 style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>Relevant Guidance</h3>
                <p style={{ margin: 0, color: 'var(--color-accent-primary)', fontWeight: 'var(--font-semibold)', fontSize: '0.95rem' }}>
                  {selectedGuidance.ref}
                </p>
              </div>
              <button
                onClick={() => setShowGuidanceModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  padding: '0.25rem',
                  lineHeight: 1
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p style={{ lineHeight: 1.7, color: 'var(--color-text-secondary)', margin: 0 }}>
              {selectedGuidance.text}
            </p>
            <div style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border-light)' }}>
              <button
                onClick={() => setShowGuidanceModal(false)}
                className="start-button"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questionnaire;
