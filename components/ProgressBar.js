import React, { memo } from 'react';
import {
  ClipboardBadgeIcon,
  CheckBadgeIcon,
  ChartBadgeIcon,
  ClockBadgeIcon
} from './CustomIcons';

const ProgressBar = memo(({
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
    <div
      role="region"
      aria-label="Assessment progress"
      style={{
        background: 'var(--bg-card-darker)',
        backdropFilter: 'var(--glass-blur) var(--glass-saturate)',
        WebkitBackdropFilter: 'var(--glass-blur) var(--glass-saturate)',
        borderBottom: '2px solid var(--border-medium)',
        padding: 'var(--spacing-xl) var(--spacing-md)',
        boxShadow: 'var(--shadow-lg)',
        position: 'sticky',
        top: '0',
        zIndex: 40
      }}
    >
      <div className="content-wrapper">
        {/* Dark Glass Progress Bar Container */}
        <div style={{
          background: 'rgba(20, 184, 166, 0.1)',
          border: '2px solid var(--accent-teal)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
          boxShadow: 'var(--shadow-teal-glow)'
        }}>
          {/* Section Label - Dark Theme */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-sm)',
            fontSize: '0.875rem',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-primary)'
          }}>
            <span>Section {currentSectionNumber} of {totalSections}: {currentSectionName}</span>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 'var(--font-black)',
              color: 'var(--accent-teal-light)'
            }}>
              {percentComplete}%
            </span>
          </div>

          {/* Dark Theme Progress Bar */}
          <div
            role="progressbar"
            aria-valuenow={percentComplete}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Assessment progress: ${percentComplete}% complete`}
            style={{
              width: '100%',
              height: '12px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* Shimmer effect layer */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite linear',
              pointerEvents: 'none',
              zIndex: 1
            }} />

            {/* Progress fill */}
            <div style={{
              width: `${percentComplete}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
              position: 'relative',
              zIndex: 0
            }} />
          </div>
        </div>

        {/* BOLD Metric Cards */}
        <div
          role="list"
          aria-label="Assessment metrics"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 'var(--spacing-md)'
          }}
        >
          {/* Total Questions Card - Blue */}
          <div
            role="listitem"
            aria-label={`Total questions: ${totalQuestions}`}
            className="metric-card"
            style={{
              background: 'var(--gradient-blue)',
              border: '3px solid var(--color-accent-600)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s var(--ease-smooth)',
              boxShadow: 'var(--shadow-elevated)',
              cursor: 'default'
            }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = 'var(--shadow-elevated)';
          }}>
            <ClipboardBadgeIcon size={24} />
            <div className="metric-number" style={{
              fontSize: '2rem',
              fontWeight: '900',
              color: 'white',
              lineHeight: 1
            }}>
              {totalQuestions}
            </div>
            <div className="metric-label" style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textAlign: 'center'
            }}>
              Questions
            </div>
          </div>

          {/* Answered Card - Green */}
          <div
            role="listitem"
            aria-label={`Questions answered: ${currentQuestionIndex} of ${totalQuestions}`}
            className="metric-card success"
            style={{
              background: 'var(--gradient-success)',
              border: '3px solid var(--color-success-600)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s var(--ease-smooth)',
              boxShadow: 'var(--shadow-elevated)',
              cursor: 'default'
            }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = 'var(--shadow-elevated)';
          }}>
            <CheckBadgeIcon size={24} />
            <div className="metric-number" style={{
              fontSize: '2rem',
              fontWeight: '900',
              color: 'white',
              lineHeight: 1
            }}>
              {currentQuestionIndex}
            </div>
            <div className="metric-label" style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textAlign: 'center'
            }}>
              Answered
            </div>
          </div>

          {/* Sections Card - Purple */}
          <div
            role="listitem"
            aria-label={`Section ${currentSectionNumber} of ${totalSections}`}
            className="metric-card purple"
            style={{
              background: 'var(--gradient-purple)',
              border: '3px solid #7c3aed',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s var(--ease-smooth)',
              boxShadow: 'var(--shadow-elevated)',
              cursor: 'default'
            }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = 'var(--shadow-elevated)';
          }}>
            <ChartBadgeIcon size={24} />
            <div className="metric-number" style={{
              fontSize: '2rem',
              fontWeight: '900',
              color: 'white',
              lineHeight: 1
            }}>
              {totalSections}
            </div>
            <div className="metric-label" style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textAlign: 'center'
            }}>
              Sections
            </div>
          </div>

          {/* Time Card - Orange */}
          <div
            role="listitem"
            aria-label={`Estimated time remaining: ${estimatedMinutes} minutes`}
            className="metric-card orange"
            style={{
              background: 'var(--gradient-orange)',
              border: '3px solid #ea580c',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s var(--ease-smooth)',
              boxShadow: 'var(--shadow-elevated)',
              cursor: 'default'
            }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(249, 115, 22, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = 'var(--shadow-elevated)';
          }}>
            <ClockBadgeIcon size={24} />
            <div className="metric-number" style={{
              fontSize: '2rem',
              fontWeight: '900',
              color: 'white',
              lineHeight: 1
            }}>
              {estimatedMinutes}
            </div>
            <div className="metric-label" style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textAlign: 'center'
            }}>
              Mins Left
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Compact View */}
        <div style={{
          display: 'none',
          marginTop: 'var(--spacing-md)',
          padding: 'var(--spacing-sm)',
          background: 'var(--gradient-accent)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
          fontSize: '0.875rem',
          fontWeight: 'var(--font-semibold)',
          color: 'white'
        }} className="progress-mobile-compact">
          Q{currentQuestionIndex}/{totalQuestions} • {percentComplete}% • ~{estimatedMinutes}m left
        </div>
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
