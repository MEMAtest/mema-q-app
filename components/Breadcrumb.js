import React, { useState } from 'react';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

const Breadcrumb = ({
  appState,
  currentSectionName,
  onNavigateHome,
  hasProgress
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleHomeClick = (e) => {
    e.preventDefault();

    // If user has progress and is in questionnaire, show confirmation
    if (hasProgress && appState !== 'welcome') {
      setShowConfirmation(true);
    } else {
      onNavigateHome();
    }
  };

  const confirmNavigation = () => {
    setShowConfirmation(false);
    onNavigateHome();
  };

  const cancelNavigation = () => {
    setShowConfirmation(false);
  };

  // Don't show breadcrumb on welcome page
  if (appState === 'welcome') {
    return null;
  }

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        style={{
          background: 'var(--color-bg-white)',
          borderBottom: '1px solid var(--color-border-light)',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          fontSize: '0.875rem'
        }}
        className="breadcrumb-nav"
      >
        <div className="content-wrapper">
          <ol style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            flexWrap: 'wrap'
          }}>
            {/* Home Link */}
            <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <a
                href="/"
                onClick={handleHomeClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  color: 'var(--color-accent-primary)',
                  textDecoration: 'none',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all var(--transition-base)',
                  fontWeight: 'var(--font-medium)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-accent-primary-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
                aria-label="Navigate to home"
              >
                <HomeIcon style={{ width: '1rem', height: '1rem' }} />
                <span>Home</span>
              </a>
              <ChevronRightIcon style={{ width: '1rem', height: '1rem', color: 'var(--color-text-muted)' }} />
            </li>

            {/* Assessment Link/Text */}
            {appState === 'questionnaire' && (
              <>
                <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <span style={{
                    color: 'var(--color-text-secondary)',
                    fontWeight: 'var(--font-medium)'
                  }}>
                    Assessment
                  </span>
                  {currentSectionName && (
                    <ChevronRightIcon style={{ width: '1rem', height: '1rem', color: 'var(--color-text-muted)' }} />
                  )}
                </li>

                {/* Current Section */}
                {currentSectionName && (
                  <li>
                    <span style={{
                      color: 'var(--color-text-primary)',
                      fontWeight: 'var(--font-semibold)',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      background: 'var(--color-accent-primary-bg)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-accent-primary)'
                    }}>
                      {currentSectionName}
                    </span>
                  </li>
                )}
              </>
            )}

            {/* Results */}
            {appState === 'results' && (
              <>
                <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Assessment</span>
                  <ChevronRightIcon style={{ width: '1rem', height: '1rem', color: 'var(--color-text-muted)' }} />
                </li>
                <li>
                  <span style={{
                    color: 'var(--color-text-primary)',
                    fontWeight: 'var(--font-semibold)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    background: 'var(--color-success-bg)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-success)'
                  }}>
                    Results
                  </span>
                </li>
              </>
            )}
          </ol>

          {/* Mobile Compact View */}
          <div className="breadcrumb-mobile-compact" style={{ display: 'none' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
              {appState === 'questionnaire' && currentSectionName && `Assessment > ${currentSectionName}`}
              {appState === 'results' && 'Assessment > Results'}
            </span>
          </div>
        </div>
      </nav>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: 'var(--spacing-md)'
        }}>
          <div style={{
            background: 'var(--color-bg-white)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-xl)',
            maxWidth: '450px',
            width: '100%',
            boxShadow: 'var(--shadow-2xl)',
            animation: 'fadeInUp 0.3s ease-out'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-md)'
            }}>
              Leave Assessment?
            </h3>
            <p style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-xl)',
              lineHeight: 1.6
            }}>
              Your progress will be saved and you can return to complete the assessment later.
            </p>
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-md)',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={cancelNavigation}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-lg)',
                  background: 'transparent',
                  border: '2px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  fontSize: '1rem',
                  fontWeight: 'var(--font-semibold)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-bg-light)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmNavigation}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-lg)',
                  background: 'var(--color-accent-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 'var(--font-semibold)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  boxShadow: 'var(--shadow-md)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-accent-primary-hover)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--color-accent-primary)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                Yes, Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Breadcrumb;
