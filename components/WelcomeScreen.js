// components/WelcomeScreen.js
import React from 'react';
import { PlayCircleIcon, CheckBadgeIcon, DocumentTextIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const WelcomeScreen = ({ onStart }) => {
  return (
    // This wrapper ensures the content is centered
    <div className="content-wrapper">
      <div className="welcome-screen">
        <div className="welcome-text">
          <h1 className="welcome-title">
            Financial Promotions Compliance Questionnaire
          </h1>
          <p className="welcome-subtitle">
            Navigate the complexities of financial promotions with confidence. This tool will guide you through the key regulatory checkpoints to help assess your compliance health.
          </p>
          <button className="start-button" onClick={onStart}>
            <PlayCircleIcon className="start-icon" />
            Start Questionnaire
          </button>
        </div>

        <div className="welcome-features">
          <h3 className="features-title">How It Works</h3>
          <ul className="features-list">
            <li>
              <CheckBadgeIcon className="feature-icon" />
              <span>Answer a series of targeted questions based on FCA guidance.</span>
            </li>
            <li>
              <DocumentTextIcon className="feature-icon" />
              <span>Receive an instant compliance health score and a detailed breakdown.</span>
            </li>
            <li>
              <ShieldCheckIcon className="feature-icon" />
              <span>Identify potential compliance gaps and access relevant regulatory references.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
