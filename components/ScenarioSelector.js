import React from 'react';
import { useTranslation } from 'next-i18next';
import { getOrderedScenarios } from '../lib/scenarios';

// Icon components for each scenario - unique and distinctive
const Icons = {
  // Social Media - Network/share icon with connected nodes
  social: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* Central hub */}
      <circle cx="12" cy="12" r="3" />
      {/* Top right node - represents Instagram/visual */}
      <circle cx="19" cy="5" r="2.5" />
      <line x1="14.5" y1="9.5" x2="17" y2="7" />
      {/* Bottom right node - represents LinkedIn/professional */}
      <circle cx="19" cy="19" r="2.5" />
      <line x1="14.5" y1="14.5" x2="17" y2="17" />
      {/* Left node - represents Twitter/broadcast */}
      <circle cx="5" cy="12" r="2.5" />
      <line x1="9" y1="12" x2="7.5" y2="12" />
      {/* Small decorative dots for activity */}
      <circle cx="5" cy="5" r="1" fill="currentColor" opacity="0.4" />
      <circle cx="5" cy="19" r="1" fill="currentColor" opacity="0.4" />
    </svg>
  ),

  // Website - Browser window with cursor
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* Browser window */}
      <rect x="2" y="3" width="20" height="18" rx="2" />
      {/* Browser top bar */}
      <line x1="2" y1="8" x2="22" y2="8" />
      {/* Browser dots */}
      <circle cx="5.5" cy="5.5" r="0.75" fill="currentColor" />
      <circle cx="8.5" cy="5.5" r="0.75" fill="currentColor" />
      <circle cx="11.5" cy="5.5" r="0.75" fill="currentColor" />
      {/* Cursor pointer */}
      <path d="M10 12l4 8 1.5-3.5L19 15l-4-8-1 4.5z" fill="currentColor" opacity="0.2" />
      <path d="M10 12l4 8 1.5-3.5L19 15l-4-8" />
    </svg>
  ),

  // Email - Envelope with send/paper plane element
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* Envelope base */}
      <path d="M3 8l9 6 9-6" />
      <rect x="3" y="6" width="18" height="14" rx="2" />
      {/* @ symbol suggestion */}
      <circle cx="12" cy="15" r="2" strokeWidth="1.5" />
      <path d="M14 15v-1a2 2 0 0 0-4 0v2a1 1 0 0 0 1 1h2" strokeWidth="1.5" />
      {/* Notification dot */}
      <circle cx="19" cy="5" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  ),

  // Print - Newspaper/brochure style
  document: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* Main document/brochure */}
      <path d="M4 4h12v16H4z" />
      {/* Folded corner effect for brochure */}
      <path d="M16 4v4h4" />
      <path d="M16 4l4 4v12H16" />
      {/* Headline */}
      <line x1="6" y1="7" x2="12" y2="7" strokeWidth="2" />
      {/* Image placeholder */}
      <rect x="6" y="9" width="6" height="4" rx="0.5" fill="currentColor" opacity="0.15" />
      {/* Text lines */}
      <line x1="6" y1="15" x2="14" y2="15" />
      <line x1="6" y1="17" x2="12" y2="17" />
      <line x1="6" y1="19" x2="10" y2="19" />
    </svg>
  ),

  // Full Assessment - Comprehensive checklist with multiple sections
  clipboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* Clipboard board */}
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      {/* Clipboard clip */}
      <rect x="8" y="2" width="8" height="3" rx="1" />
      {/* Multiple checkmarks for "comprehensive" */}
      <path d="M8 10l1.5 1.5L12 9" />
      <path d="M8 14l1.5 1.5L12 13" />
      <path d="M8 18l1.5 1.5L12 17" />
      {/* Labels */}
      <line x1="14" y1="10" x2="17" y2="10" />
      <line x1="14" y1="14" x2="17" y2="14" />
      <line x1="14" y1="18" x2="17" y2="18" />
      {/* Progress indicator */}
      <circle cx="18" cy="4" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  )
};

const ScenarioSelector = ({
  onSelect,
  onBack,
  isLoading = false,
  suggestedScenario = null,
  aiAnalysis = null
}) => {
  const { t } = useTranslation('common');
  const scenarios = getOrderedScenarios();

  // Map promotion types to scenario IDs
  const getScenarioLabel = (scenarioId) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    return scenario?.label || 'Full Assessment';
  };

  return (
    <div className="scenario-selector">
      <div className="scenario-header">
        {onBack && (
          <button className="scenario-back-btn" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>
        )}

        <div className="scenario-title-block">
          <h1 className="scenario-title">What are you promoting?</h1>
          <p className="scenario-subtitle">
            Select your communication channel to get a tailored compliance assessment
          </p>
        </div>
      </div>

      {/* Suggestion Banner */}
      {suggestedScenario && !isLoading && (
        <div className="suggestion-banner">
          <div className="suggestion-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <div className="suggestion-content">
            <strong>Recommendation:</strong> Based on your {aiAnalysis?.promotionTypeLabel || 'uploaded promotion'},
            we suggest the <span className="suggested-type">{getScenarioLabel(suggestedScenario)}</span> assessment.
          </div>
        </div>
      )}

      <div className={`scenario-grid ${isLoading ? 'loading' : ''}`}>
        {scenarios.map((scenario) => {
          const isSuggested = suggestedScenario === scenario.id && !isLoading;

          return (
            <button
              key={scenario.id}
              className={`scenario-card ${scenario.recommended ? 'recommended' : ''} ${isSuggested ? 'suggested' : ''} ${isLoading ? 'disabled' : ''}`}
              onClick={() => !isLoading && onSelect(scenario.id)}
              disabled={isLoading}
              style={{ '--scenario-color': scenario.color, '--scenario-gradient': scenario.gradient }}
            >
              {/* Loading overlay */}
              {isLoading && (
                <div className="scenario-loading-overlay">
                  <div className="scenario-loading-shimmer"></div>
                </div>
              )}

              {/* Suggested Badge */}
              {isSuggested && (
                <div className="scenario-badge suggested-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Recommended
                </div>
              )}

              {/* Regular Recommended Badge (only show if not AI suggested) */}
              {scenario.recommended && !isSuggested && (
                <div className="scenario-badge">Recommended</div>
              )}

              <div className="scenario-icon-wrapper">
                <div className="scenario-icon">
                  {Icons[scenario.icon]}
                </div>
              </div>

              <div className="scenario-content">
                <h3 className="scenario-card-title">{scenario.label}</h3>
                <p className="scenario-card-desc">{scenario.description}</p>

                <div className="scenario-meta">
                  <span className="scenario-questions">
                    {scenario.questionCount} questions
                  </span>
                  <span className="scenario-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="scenario-footer">
        <p className="scenario-tip">
          <strong>Tip:</strong> Choose "Full Assessment" if you're unsure or want comprehensive coverage across all channels.
        </p>
      </div>
    </div>
  );
};

export default ScenarioSelector;
