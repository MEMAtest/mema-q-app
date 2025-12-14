// components/ProgressBar.js
import Image from 'next/image';

const ProgressBar = ({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  sections,
}) => {
  const progress = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;
  const answeredProgress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  // Calculate estimated time remaining (assuming 30 seconds per question)
  const remainingQuestions = totalQuestions - currentQuestion;
  const estimatedMinutes = Math.ceil((remainingQuestions * 0.5)); // 30 seconds = 0.5 minutes

  return (
    <div className="progress-bar">
      {/* Progress Bar */}
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-sm)'
        }}>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--color-text-primary)'
          }}>
            Overall Progress
          </span>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-accent-primary)'
          }}>
            {Math.round(progress)}%
          </span>
        </div>

        {/* Progress Track */}
        <div style={{
          width: '100%',
          height: '12px',
          background: 'rgba(15, 23, 42, 0.08)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid var(--color-border-light)'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'var(--color-accent-primary)',
            borderRadius: 'var(--radius-full)',
            transition: 'width var(--transition-slow)'
          }} />
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '0.18rem 0.5rem',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid var(--color-border-light)',
              fontSize: '0.75rem',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--color-text-primary)',
              lineHeight: 1,
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="progress-metrics">
        {/* Metric 1: Current Position */}
        <div className="progress-metric">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            marginBottom: 'var(--spacing-xs)'
          }}>
            <Image src="/icons/sections/clipboard-check.svg" alt="" width={16} height={16} style={{
              width: '1rem',
              height: '1rem'
            }} />
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 'var(--font-medium)'
            }}>
              Question
            </span>
          </div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-text-primary)'
          }}>
            {currentQuestion} <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>/ {totalQuestions}</span>
          </div>
        </div>

        {/* Metric 2: Answered */}
        <div className="progress-metric">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            marginBottom: 'var(--spacing-xs)'
          }}>
            <Image src="/icons/actions/check-circle.svg" alt="" width={16} height={16} style={{
              width: '1rem',
              height: '1rem'
            }} />
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 'var(--font-medium)'
            }}>
              Answered
            </span>
          </div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-text-primary)'
          }}>
            {answeredQuestions} <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>({Math.round(answeredProgress)}%)</span>
          </div>
        </div>

        {/* Metric 3: Sections */}
        <div className="progress-metric">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            marginBottom: 'var(--spacing-xs)'
          }}>
            <Image src="/icons/actions/chart-bar.svg" alt="" width={16} height={16} style={{
              width: '1rem',
              height: '1rem'
            }} />
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 'var(--font-medium)'
            }}>
              Sections
            </span>
          </div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-text-primary)'
          }}>
            {sections.completed} <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>/ {sections.total}</span>
          </div>
        </div>

        {/* Metric 4: Time Estimate */}
        <div className="progress-metric">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            marginBottom: 'var(--spacing-xs)'
          }}>
            <Image src="/icons/ui/clock.svg" alt="" width={16} height={16} style={{
              width: '1rem',
              height: '1rem'
            }} />
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 'var(--font-medium)'
            }}>
              Est. Time
            </span>
          </div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-text-primary)'
          }}>
            ~{estimatedMinutes} <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>min</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProgressBar;
