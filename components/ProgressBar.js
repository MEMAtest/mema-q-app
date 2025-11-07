import React from 'react';
import { ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const ProgressBar = ({
  currentQuestionIndex,
  totalQuestions,
  answeredCount,
  currentSectionNumber,
  totalSections,
  currentSectionName
}) => {
  // Calculate progress percentage
  const percentComplete = totalQuestions > 0
    ? Math.round((currentQuestionIndex / totalQuestions) * 100)
    : 0;

  // Calculate estimated time remaining (30 seconds per question)
  const remainingQuestions = totalQuestions - currentQuestionIndex;
  const estimatedMinutes = Math.ceil((remainingQuestions * 30) / 60);

  return (
    <div style={{
      background: 'var(--color-bg-white)',
      borderBottom: '2px solid var(--color-border-light)',
      padding: 'var(--spacing-lg) var(--spacing-md)',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: '0',
      zIndex: 40
    }}>
      <div className="content-wrapper">
        {/* Progress Bar Visual */}
        <div style={{
          width: '100%',
          height: '8px',
          background: 'var(--color-bg-light)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          marginBottom: 'var(--spacing-md)',
          position: 'relative'
        }}>
          <div style={{
            width: `${percentComplete}%`,
            height: '100%',
            background: `linear-gradient(90deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%)`,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 10px rgba(0, 123, 255, 0.5)'
          }} />
        </div>

        {/* Progress Information Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--spacing-md)',
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)'
        }}>
          {/* Question Counter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)'
          }}>
            <DocumentTextIcon style={{ width: '1.125rem', height: '1.125rem', color: 'var(--color-accent-primary)' }} />
            <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>
              Question {currentQuestionIndex} of {totalQuestions}
            </span>
          </div>

          {/* Section Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)'
          }}>
            <span style={{ fontWeight: 'var(--font-medium)' }}>
              Section {currentSectionNumber} of {totalSections}:
            </span>
            <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-accent-primary)' }}>
              {currentSectionName}
            </span>
          </div>

          {/* Percentage Complete */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)'
          }}>
            <span style={{ fontWeight: 'var(--font-medium)' }}>Progress:</span>
            <span style={{
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-accent-primary)',
              fontSize: '1rem'
            }}>
              {percentComplete}% Complete
            </span>
          </div>

          {/* Time Remaining */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)'
          }}>
            <ClockIcon style={{ width: '1.125rem', height: '1.125rem', color: 'var(--color-accent-secondary)' }} />
            <span style={{ fontWeight: 'var(--font-medium)' }}>
              ~{estimatedMinutes} min{estimatedMinutes !== 1 ? 's' : ''} remaining
            </span>
          </div>
        </div>

        {/* Mobile-Optimized Compact View (shown on smaller screens) */}
        <div style={{
          display: 'none',
          marginTop: 'var(--spacing-sm)',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--color-text-secondary)'
        }} className="progress-mobile-compact">
          <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>
            Q{currentQuestionIndex}/{totalQuestions}
          </span>
          <span style={{ margin: '0 var(--spacing-xs)' }}>•</span>
          <span>{percentComplete}%</span>
          <span style={{ margin: '0 var(--spacing-xs)' }}>•</span>
          <span>~{estimatedMinutes}m left</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
