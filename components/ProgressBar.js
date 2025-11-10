// components/ProgressBar.js
import {
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const ProgressBar = ({ currentQuestion, totalQuestions, answeredQuestions, sections }) => {
  const progress = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;
  const answeredProgress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  // Calculate estimated time remaining (assuming 30 seconds per question)
  const remainingQuestions = totalQuestions - currentQuestion;
  const estimatedMinutes = Math.ceil((remainingQuestions * 0.5)); // 30 seconds = 0.5 minutes

  return (
    <div style={{
      background: 'var(--color-bg-white)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-lg)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--color-border-light)'
    }}>
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
          height: '8px',
          background: 'var(--color-bg-light)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--color-accent-primary) 0%, var(--color-accent-primary-light) 100%)',
            borderRadius: 'var(--radius-full)',
            transition: 'width var(--transition-slow)'
          }} />
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'var(--spacing-md)',
        marginTop: 'var(--spacing-lg)'
      }}>
        {/* Metric 1: Current Position */}
        <div className="progress-metric">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            marginBottom: 'var(--spacing-xs)'
          }}>
            <ClipboardDocumentCheckIcon style={{
              width: '1rem',
              height: '1rem',
              color: 'var(--color-accent-primary)'
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
            <CheckCircleIcon style={{
              width: '1rem',
              height: '1rem',
              color: 'var(--color-success)'
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
            <ChartBarIcon style={{
              width: '1rem',
              height: '1rem',
              color: 'var(--color-accent-secondary)'
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
            <ClockIcon style={{
              width: '1rem',
              height: '1rem',
              color: 'var(--color-warning)'
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

      {/* Add responsive styles */}
      <style jsx>{`
        .progress-metric {
          padding: var(--spacing-sm);
          border-radius: var(--radius-md);
          background: var(--color-bg-light);
          transition: all var(--transition-base);
        }

        .progress-metric:hover {
          background: var(--color-accent-primary-bg);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 480px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;
