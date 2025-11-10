// components/WelcomeScreen.js
import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import {
  PlayCircleIcon,
  CheckCircleIcon,
  BoltIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const WelcomeScreen = ({ onStart }) => {
  const { t } = useTranslation('common');
  return (
    <>
      {/* Header Navigation */}
      <header className="header">
        <div className="header-logo">
          <Image
            src="/mema-logo-green.svg"
            alt="MEMA Consultants"
            width={180}
            height={48}
            priority
            style={{ height: 'auto', width: 'auto' }}
          />
        </div>
        <nav className="header-nav">
          <a href="#how-it-works">{t('nav.howItWorks')}</a>
          <a href="#features">{t('nav.features')}</a>
          <a href="#about">{t('nav.about')}</a>
        </nav>
        <div className="header-actions">
          <button className="start-button" onClick={onStart} style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}>
            {t('buttons.startAssessment')}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section section-dark">
        <div className="hero-content">
          <div className="hero-grid">
            {/* Left: Text Column */}
            <div className="hero-text">
              <h1>{t('hero.title')}</h1>
              <p>{t('hero.subtitle')}</p>

              {/* Key Benefits */}
              <ul className="benefits-list" style={{ marginTop: '2rem' }}>
                <li>
                  <LightBulbIcon className="icon" />
                  <span>Intelligent Regulatory Navigation</span>
                </li>
                <li>
                  <BoltIcon className="icon" />
                  <span>Automated Compliance Workflows</span>
                </li>
                <li>
                  <ShieldCheckIcon className="icon" />
                  <span>Unwavering Audit Readiness</span>
                </li>
              </ul>

              {/* CTAs */}
              <div className="cta-buttons" style={{ marginTop: '2rem', justifyContent: 'flex-start' }}>
                <button className="start-button" onClick={onStart}>
                  <PlayCircleIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                  {t('buttons.startAssessment')}
                </button>
              </div>
            </div>

            {/* Right: Hero Visual */}
            <div className="hero-visual">
              <div className="hero-labyrinth">
                <div className="labyrinth-rings" />
                <div className="labyrinth-path" />
                <div className="labyrinth-node" />
              </div>
              <p className="labyrinth-caption">
                Navigate the MEMA regulatory labyrinth with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Preview Section */}
      <section id="demo-section" className="video-section section-light">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'var(--font-black)', marginBottom: '1rem' }}>
            {t('hero.previewHeading')}
          </h2>
          <p style={{ textAlign: 'center', fontSize: '1.25rem', color: 'var(--color-text-secondary)', marginBottom: '3rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
            {t('hero.previewCopy')}
          </p>

          {/* Interactive Sample Question Preview */}
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            background: 'var(--color-bg-white)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--spacing-2xl)',
            boxShadow: 'var(--shadow-2xl)',
            border: '1px solid var(--color-border-light)'
          }}>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  background: 'var(--color-accent-primary-bg)',
                  color: 'var(--color-accent-primary)',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.875rem',
                  fontWeight: 'var(--font-semibold)',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  <InformationCircleIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                  {t('hero.sampleTag')}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-primary)' }}>
                  {t('hero.sampleQuestion')}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)' }}>
                  {t('hero.sampleReference')}
                </p>

              <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                <div style={{
                  flex: 1,
                  padding: 'var(--spacing-lg)',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  background: 'var(--color-bg-white)'
                }} className="answer-option-preview">
                  <CheckCircleIcon style={{ width: '2rem', height: '2rem', margin: '0 auto var(--spacing-sm)', color: 'var(--color-success)' }} />
                  <strong style={{ fontSize: '1rem' }}>Yes</strong>
                </div>
                <div style={{
                  flex: 1,
                  padding: 'var(--spacing-lg)',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  background: 'var(--color-bg-white)'
                }} className="answer-option-preview">
                  <ClipboardDocumentCheckIcon style={{ width: '2rem', height: '2rem', margin: '0 auto var(--spacing-sm)', color: 'var(--color-text-muted)' }} />
                  <strong style={{ fontSize: '1rem' }}>No</strong>
                </div>
              </div>

              <div style={{
                background: 'var(--color-accent-primary-bg)',
                border: '1px solid var(--color-accent-primary)',
                borderLeft: '4px solid var(--color-accent-primary)',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--spacing-lg)'
              }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                  <LightBulbIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-accent-primary)', flexShrink: 0 }} />
                  <strong style={{ color: 'var(--color-accent-primary)' }}>Why this is important</strong>
                </div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0, color: 'var(--color-text-secondary)' }}>
                  A financial promotion must invite or encourage someone to engage in a financial activity.
                  Purely factual information, without any persuasive element, might not be considered an invitation or inducement. (PERG 8.4.2 - 8.4.4)
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-md)',
              alignItems: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                color: 'var(--color-success)',
                fontSize: '0.9rem',
                fontWeight: 'var(--font-medium)'
              }}>
                <CheckCircleIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                36 comprehensive questions
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                color: 'var(--color-success)',
                fontSize: '0.9rem',
                fontWeight: 'var(--font-medium)'
              }}>
                <ChartBarIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                Instant compliance scoring
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                color: 'var(--color-success)',
                fontSize: '0.9rem',
                fontWeight: 'var(--font-medium)'
              }}>
                <DocumentTextIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                Detailed gap analysis
              </div>
            </div>
          </div>

          {/* CTA below preview */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="start-button" onClick={onStart}>
              Start Your Free Assessment
            </button>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section id="how-it-works" className="section-dark">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'var(--font-black)', marginBottom: '1rem' }}>
            Navigate the Regulatory Labyrinth with Confidence
          </h2>
          <p style={{ textAlign: 'center', fontSize: '1.25rem', marginBottom: '3rem', opacity: 0.9, maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
            The financial promotions landscape is a constant challenge. We provide the compass you need.
          </p>

          <div className="hero-grid" style={{ marginTop: '3rem' }}>
            {/* Left: Abstract Visual */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                height: '350px',
                background: 'linear-gradient(135deg, rgba(0, 123, 255, 0.1) 0%, rgba(0, 123, 255, 0.05) 100%)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(0, 123, 255, 0.3)'
              }}>
                <ArrowPathIcon style={{
                  width: '120px',
                  height: '120px',
                  color: 'var(--color-accent-primary)',
                  animation: 'spin 20s linear infinite'
                }} />
              </div>
            </div>

            {/* Right: Text & Benefits */}
            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: 'var(--font-bold)', marginBottom: '1rem' }}>
                Your Expert Guide Through PERG & FCA
              </h3>
              <p style={{ fontSize: '1.125rem', marginBottom: '2rem', opacity: 0.9, lineHeight: 1.7 }}>
                FinProms translates intricate regulations into clear, actionable questions, giving your firm
                a structured pathway to compliance. Gain certainty where others find complexity.
              </p>

              <ul className="benefits-list">
                <li>
                  <CheckCircleIcon className="icon" />
                  <span>Simplified Regulatory Interpretation</span>
                </li>
                <li>
                  <CheckCircleIcon className="icon" />
                  <span>Consistent Assessment Application</span>
                </li>
                <li>
                  <CheckCircleIcon className="icon" />
                  <span>Reduced Compliance Burden</span>
                </li>
                <li>
                  <CheckCircleIcon className="icon" />
                  <span>Expert-Validated Framework</span>
                </li>
              </ul>

              <button className="btn-ghost-dark" style={{ marginTop: '1.5rem' }}>
                <InformationCircleIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                How Our System Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section id="features" className="section-light">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'var(--font-black)', marginBottom: '3rem' }}>
            Precision, Efficiency, Control
          </h2>

          <div className="features-grid">
            {/* Feature Card 1: Intuitive Guidance Engine */}
            <div className="feature-card">
              <div className="feature-card-icon">
                <LightBulbIcon />
              </div>
              <h3>Intuitive Guidance Engine</h3>
              <p>
                Navigate complex regulatory requirements with our intelligent question-based system
                that adapts to your responses and provides contextual guidance at every step.
              </p>
            </div>

            {/* Feature Card 2: Automated Documentation */}
            <div className="feature-card">
              <div className="feature-card-icon">
                <DocumentTextIcon />
              </div>
              <h3>Automated Documentation</h3>
              <p>
                Generate comprehensive, audit-ready reports automatically. Every response is captured,
                timestamped, and formatted for regulatory review.
              </p>
            </div>

            {/* Feature Card 3: Dynamic Reporting */}
            <div className="feature-card">
              <div className="feature-card-icon">
                <ChartBarIcon />
              </div>
              <h3>Dynamic Reporting</h3>
              <p>
                Visualize your compliance posture with interactive dashboards. Track trends,
                identify gaps, and demonstrate progress to stakeholders with clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="section-dark">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'var(--font-black)', marginBottom: '3rem' }}>
            Compliance Backed by Confidence
          </h2>

          <div className="hero-grid" style={{ alignItems: 'start' }}>
            {/* Left: Testimonial */}
            <div className="testimonial-card">
              <div className="testimonial-quote">
                "FinProms provides a structured, systematic approach to navigating FCA financial promotions
                regulations. The tool brings clarity to complex requirements and helps maintain consistent
                compliance standards."
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'var(--color-accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'var(--font-bold)'
                  }}>
                    MC
                  </div>
                </div>
                <div className="testimonial-info">
                  <h5>Compliance Professional</h5>
                  <p>UK Financial Services Firm</p>
                </div>
              </div>
            </div>

            {/* Right: Key Features */}
            <div>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-value">36</div>
                  <div className="metric-label">PERG 8 Questions</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">6</div>
                  <div className="metric-label">Core Sections</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">100%</div>
                  <div className="metric-label">FCA Aligned</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="about" className="cta-section">
        <h2>{t('cta.title')}</h2>
        <p>{t('cta.body')}</p>
        <button className="start-button" onClick={onStart}>
          <RocketLaunchIcon style={{ width: '1.5rem', height: '1.5rem' }} />
          {t('buttons.startAssessment')}
        </button>
      </section>

      {/* Add hover effect styles inline */}
      <style jsx>{`
        .play-button-hover:hover {
          transform: scale(1.1);
          box-shadow: 0 20px 40px rgba(0, 123, 255, 0.5);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
};

export default WelcomeScreen;
