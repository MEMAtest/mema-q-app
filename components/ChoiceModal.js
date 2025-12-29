// components/ChoiceModal.js
import React from 'react';

const Icons = {
  brain: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.54" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.54" />
    </svg>
  ),
  zap: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const ChoiceModal = ({ isOpen, onClose, onQuickStart, onSmartScan }) => {
  if (!isOpen) return null;

  return (
    <div className="choice-modal-overlay" onClick={onClose}>
      <div className="choice-modal" onClick={(e) => e.stopPropagation()}>
        <button className="choice-modal-close" onClick={onClose}>
          <Icons.close />
        </button>

        <div className="choice-modal-header">
          <h2>How would you like to start?</h2>
          <p>Choose your preferred way to begin the compliance assessment</p>
        </div>

        <div className="choice-options">
          <button className="choice-option quick-start" onClick={onQuickStart}>
            <div className="choice-icon">
              <Icons.zap />
            </div>
            <div className="choice-content">
              <h3>Quick Start</h3>
              <p>Jump straight to selecting your assessment type. Best if you know what channel you're assessing.</p>
            </div>
            <div className="choice-badge">Fast</div>
          </button>

          <button className="choice-option smart-scan" onClick={onSmartScan}>
            <div className="choice-icon">
              <Icons.brain />
            </div>
            <div className="choice-content">
              <h3>Smart Scan</h3>
              <p>Upload your promotion and we'll identify the best assessment type and pre-fill suggestions.</p>
            </div>
            <div className="choice-badge recommended">Recommended</div>
          </button>
        </div>

        <div className="choice-modal-footer">
          <p>You can always upload a promotion later during the assessment</p>
        </div>
      </div>
    </div>
  );
};

export default ChoiceModal;
