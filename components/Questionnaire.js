import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { getScenario } from '../lib/scenarios';

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
  scenario,
  aiAnalysis,
  uploadedPromoImage,
}) => {
  // Get scenario config for tailored content
  const scenarioConfig = scenario ? getScenario(scenario) : null;
  const [showGuidanceModal, setShowGuidanceModal] = useState(false);
  const [selectedGuidance, setSelectedGuidance] = useState({ ref: '', text: '' });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const notesLength = currentAnswer?.notes?.length || 0;

  // Track client-side mount for portal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle body scroll lock when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.classList.add('drawer-open');
    } else {
      document.body.classList.remove('drawer-open');
    }
    return () => {
      document.body.classList.remove('drawer-open');
    };
  }, [isDrawerOpen]);

  // Close drawer/modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
        setShowGuidanceModal(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

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
    // Use scenario-specific examples if available
    const examplesText = scenarioConfig?.examples
      ? scenarioConfig.examples.slice(0, 2).join('. ') + '.'
      : 'Look for invitations to act, incentives, or persuasive messaging aimed at the audience.';
    // Use scenario-specific best practice if available
    const bestPracticeText = scenarioConfig?.bestPractice
      || 'Capture rationale and approvals for each decision to maintain an audit-ready record.';

    return [
      {
        title: 'Definition',
        copy: question?.explanation || 'This control confirms whether the communication meets the FCA definition of a financial promotion.'
      },
      {
        title: 'Examples',
        copy: examplesText
      },
      {
        title: 'Relevant Guidance',
        copy: 'Click the reference below to view full guidance text',
        link: reference,
        isGuidanceLink: true
      },
      {
        title: 'Best Practice',
        copy: bestPracticeText
      }
    ];
  }, [question?.explanation, question?.questionRef, scenarioConfig]);

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
          {/* User's Uploaded Promotion (from AI Analysis) */}
          {uploadedPromoImage && (
            <div className="insight-mockup">
              <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🎯</span> Your Promotion
              </h5>
              <img
                src={uploadedPromoImage}
                alt="Your uploaded promotion"
                className="mockup-image"
              />
              {aiAnalysis && (
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  background: aiAnalysis.overallRisk === 'high'
                    ? 'rgba(239, 68, 68, 0.1)'
                    : aiAnalysis.overallRisk === 'medium'
                    ? 'rgba(245, 158, 11, 0.1)'
                    : 'rgba(16, 185, 129, 0.1)',
                  border: `1px solid ${
                    aiAnalysis.overallRisk === 'high'
                      ? 'rgba(239, 68, 68, 0.3)'
                      : aiAnalysis.overallRisk === 'medium'
                      ? 'rgba(245, 158, 11, 0.3)'
                      : 'rgba(16, 185, 129, 0.3)'
                  }`,
                  fontSize: '0.8rem'
                }}>
                  <strong>AI Risk Level:</strong> {aiAnalysis.overallRisk?.toUpperCase()}
                  {aiAnalysis.issues?.length > 0 && (
                    <span> • {aiAnalysis.issues.length} issue(s) found</span>
                  )}
                </div>
              )}
              <p className="mockup-caption">
                Reviewing your uploaded promotion
              </p>
            </div>
          )}
          {/* Scenario Mockup Image (only if no uploaded image) */}
          {!uploadedPromoImage && scenarioConfig?.mockupImage && (
            <div className="insight-mockup">
              <h5>Example Illustration</h5>
              <img
                src={scenarioConfig.mockupImage}
                alt={scenarioConfig.mockupAlt || `${scenarioConfig.label} example`}
                className="mockup-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="mockup-placeholder" style={{
                display: 'none',
                height: '200px',
                background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
                borderRadius: '8px',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                fontSize: '0.875rem',
                textAlign: 'center',
                padding: '1rem'
              }}>
                <span>📷 {scenarioConfig.label} mockup<br/>Image pending</span>
              </div>
              <p className="mockup-caption">
                Assess this {scenarioConfig.label.toLowerCase()} promotion against the questions
              </p>
            </div>
          )}
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

      {/* Mobile Drawer Toggle Button */}
      <button
        className="drawer-toggle-btn"
        onClick={() => setIsDrawerOpen(true)}
        aria-label="Open insights panel"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </button>

      {/* Mobile Drawer - Rendered via Portal to avoid stacking context issues */}
      {isMounted && createPortal(
        <>
          <div
            className={`drawer-overlay ${isDrawerOpen ? 'active' : ''}`}
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className={`drawer-container ${isDrawerOpen ? 'active' : ''}`}>
            <div className="drawer-header">
              <h4>Insights & Guidance</h4>
              <button
                className="drawer-close-btn"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close panel"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="drawer-content">
              {/* Scenario Mockup Image in Drawer */}
              {scenarioConfig?.mockupImage && (
                <div className="insight-mockup">
                  <h5>Example Illustration</h5>
                  <img
                    src={scenarioConfig.mockupImage}
                    alt={scenarioConfig.mockupAlt || `${scenarioConfig.label} example`}
                    className="mockup-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="mockup-placeholder" style={{
                    display: 'none',
                    height: '150px',
                    background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
                    borderRadius: '8px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    fontSize: '0.875rem',
                    textAlign: 'center',
                    padding: '1rem'
                  }}>
                    <span>📷 {scenarioConfig.label} mockup<br/>Image pending</span>
                  </div>
                  <p className="mockup-caption">
                    Assess this {scenarioConfig.label.toLowerCase()} promotion
                  </p>
                </div>
              )}
              {insightCards.map((card) => (
                <div key={`drawer-${card.title}`} className="insight-card">
                  <h5>{card.title}</h5>
                  <p style={{ margin: 0 }}>{card.copy}</p>
                  {card.link && (
                    <a
                      className="link-chip"
                      href="#"
                      onClick={(e) => {
                        if (card.isGuidanceLink) {
                          handleGuidanceClick(e, card.link);
                          setIsDrawerOpen(false);
                        }
                      }}
                      style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
                    >
                      {card.link}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Guidance Modal */}
      {showGuidanceModal && (
        <div
          className="guidance-modal-overlay"
          onClick={() => setShowGuidanceModal(false)}
        >
          <div
            className="guidance-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="guidance-modal-header">
              <div>
                <h3 className="guidance-modal-title">Relevant Guidance</h3>
                <p className="guidance-modal-ref">{selectedGuidance.ref}</p>
              </div>
              <button
                onClick={() => setShowGuidanceModal(false)}
                className="guidance-modal-close"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="guidance-modal-body">{selectedGuidance.text}</p>
            <div className="guidance-modal-footer">
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
