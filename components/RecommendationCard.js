// components/RecommendationCard.js
import React, { useState } from 'react';
import { getPriorityInfo } from '../lib/recommendations';

const Icons = {
  chevronDown: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  chevronUp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ),
  check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  lightbulb: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  ),
  warning: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  book: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  clipboard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  ),
};

const RecommendationCard = ({ recommendation, questionId, question, fcaRef }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  if (!recommendation) return null;

  const priorityInfo = getPriorityInfo(recommendation.priority);

  const toggleStep = (stepIndex) => {
    setCompletedSteps(prev =>
      prev.includes(stepIndex)
        ? prev.filter(i => i !== stepIndex)
        : [...prev, stepIndex]
    );
  };

  const completionPercentage = recommendation.actions
    ? Math.round((completedSteps.length / recommendation.actions.length) * 100)
    : 0;

  return (
    <div className="recommendation-card">
      {/* Header */}
      <div
        className="recommendation-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="recommendation-header-left">
          <span
            className="recommendation-priority-badge"
            style={{
              backgroundColor: priorityInfo.bg,
              color: priorityInfo.color,
              borderColor: priorityInfo.color
            }}
          >
            {recommendation.priority === 'critical' ? <Icons.warning /> : <Icons.lightbulb />}
            {priorityInfo.label}
          </span>
        </div>
        <div className="recommendation-header-right">
          {recommendation.actions && recommendation.actions.length > 0 && (
            <span className="recommendation-progress">
              {completedSteps.length}/{recommendation.actions.length} steps
            </span>
          )}
          <span className="recommendation-chevron">
            {isExpanded ? <Icons.chevronUp /> : <Icons.chevronDown />}
          </span>
        </div>
      </div>

      {/* Title and Summary */}
      <div className="recommendation-title-section">
        <h4 className="recommendation-title">
          <Icons.lightbulb />
          {recommendation.title}
        </h4>
        <p className="recommendation-summary">{recommendation.summary}</p>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="recommendation-content">
          {/* Action Steps */}
          {recommendation.actions && recommendation.actions.length > 0 && (
            <div className="recommendation-actions">
              <h5 className="recommendation-section-title">
                <Icons.clipboard />
                Action Steps
              </h5>
              <div className="recommendation-steps">
                {recommendation.actions.map((action, index) => (
                  <div
                    key={index}
                    className={`recommendation-step ${completedSteps.includes(index) ? 'completed' : ''}`}
                  >
                    <button
                      className="step-checkbox"
                      onClick={() => toggleStep(index)}
                      aria-label={completedSteps.includes(index) ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {completedSteps.includes(index) && <Icons.check />}
                    </button>
                    <div className="step-content">
                      <div className="step-header">
                        <span className="step-number">Step {action.step}</span>
                        <span className="step-action">{action.action}</span>
                      </div>
                      <p className="step-detail">{action.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Template Text */}
          {recommendation.templateText && (
            <div className="recommendation-template">
              <h5 className="recommendation-section-title">
                <Icons.clipboard />
                Suggested Wording
              </h5>
              <div className="template-text">
                <p>"{recommendation.templateText}"</p>
                <button
                  className="copy-template-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(recommendation.templateText);
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {/* FCA Reference */}
          <div className="recommendation-reference">
            <span className="reference-label">
              <Icons.book />
              FCA Reference:
            </span>
            <span className="reference-value">{recommendation.fcaRef || fcaRef}</span>
          </div>

          {/* Risk Warning */}
          {recommendation.riskIfIgnored && (
            <div className="recommendation-risk-warning">
              <Icons.warning />
              <span><strong>Risk if not addressed:</strong> {recommendation.riskIfIgnored}</span>
            </div>
          )}

          {/* Progress Bar */}
          {recommendation.actions && recommendation.actions.length > 0 && (
            <div className="recommendation-progress-bar">
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${completionPercentage}%`,
                    backgroundColor: completionPercentage === 100 ? '#10B981' : priorityInfo.color
                  }}
                />
              </div>
              <span className="progress-text">
                {completionPercentage === 100 ? 'All steps completed!' : `${completionPercentage}% complete`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
