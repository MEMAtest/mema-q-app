// components/WelcomeScreen.js
import React, { useState } from 'react';
import {
  PlayCircleIcon,
  CheckCircleIcon,
  BoltIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  LightBulbIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const WelcomeScreen = ({ onStart }) => {
  return (
    <>
      {/* Header Navigation */}
      <header className="header">
        <div className="header-logo">
          <img src="/mema-logo-new.svg" alt="FinProms" style={{ color: 'var(--color-text-primary)' }} />
        </div>
        <nav className="header-nav">
          <a href="#how-it-works">How It Works</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>
        <div className="header-actions">
          <button className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            Login
          </button>
          <button className="start-button" onClick={onStart} style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}>
            Start Assessment
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section section-dark">
        <div className="hero-content">
          <div className="hero-grid">
            {/* Left: Text Column */}
            <div className="hero-text">
              <h1>Future-Proofing Compliance. Built for Tomorrow's Finance.</h1>
              <p>
                FinProms delivers the advanced regulatory guidance and automated solutions
                financial institutions need to thrive in an ever-evolving landscape.
              </p>

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
                  Start Assessment
                </button>
                <button className="btn-ghost-dark" onClick={() => document.getElementById('demo-section').scrollIntoView({ behavior: 'smooth' })}>
                  <PlayCircleIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Right: Hero Visual - Interactive Compliance Dashboard */}
            <div className="hero-visual">
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '500px',
                height: '400px',
                background: 'var(--color-bg-dark-alt)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-2xl)',
                padding: 'var(--spacing-lg)',
                border: '2px solid var(--color-accent-primary)',
                overflow: 'hidden'
              }}>
                {/* Header Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  marginBottom: 'var(--spacing-lg)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  background: 'rgba(0, 123, 255, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-accent-primary)',
                  width: 'fit-content'
                }}>
                  <ShieldCheckIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-accent-primary)' }} />
                  <span style={{ color: 'var(--color-text-white)', fontSize: '0.875rem', fontWeight: 'var(--font-semibold)' }}>
                    Live Compliance Dashboard
                  </span>
                </div>

                {/* Compliance Score Gauge */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--spacing-md)',
                  marginBottom: 'var(--spacing-md)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                    <span style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>Compliance Score</span>
                    <CheckCircleIcon style={{ width: '1rem', height: '1rem', color: 'var(--color-success)' }} />
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'var(--font-black)', color: 'var(--color-success)', marginBottom: 'var(--spacing-xs)' }}>
                    92%
                  </div>
                  <div style={{
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: '92%',
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--color-success) 0%, var(--color-accent-primary) 100%)',
                      borderRadius: 'var(--radius-full)',
                      animation: 'slideIn 1.5s ease-out'
                    }} />
                  </div>
                </div>

                {/* Stats Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'var(--spacing-sm)',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  {[
                    { icon: ClipboardDocumentCheckIcon, label: 'Assessed', value: '36/36' },
                    { icon: ChartBarIcon, label: 'Compliant', value: '33/36' },
                    { icon: DocumentTextIcon, label: 'Reports', value: '12' },
                    { icon: RocketLaunchIcon, label: 'Time Saved', value: '24h' }
                  ].map((stat, index) => (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--spacing-sm)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`
                    }}>
                      <stat.icon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--color-accent-primary)', marginBottom: 'var(--spacing-xs)' }} />
                      <div style={{ fontSize: '1.25rem', fontWeight: 'var(--font-bold)', color: 'var(--color-text-white)' }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-success)'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--color-success)',
                    animation: 'pulse 2s ease-in-out infinite'
                  }} />
                  <span style={{ color: 'var(--color-success)', fontSize: '0.875rem', fontWeight: 'var(--font-semibold)' }}>
                    Real-time Assessment Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Preview Section - Replacing Video */}
      <section id="demo-section" className="section-light">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'var(--font-black)', marginBottom: '1rem' }}>
            See FinProms in Action
          </h2>
          <p style={{ textAlign: 'center', fontSize: '1.25rem', color: 'var(--color-text-secondary)', marginBottom: '3rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
            Experience how easy it is to navigate complex regulations and generate instant compliance clarity.
          </p>

          {/* Interactive Preview Panel */}
          <div className="card" style={{
            maxWidth: '900px',
            margin: '0 auto var(--spacing-2xl)',
            padding: 'var(--spacing-2xl)',
            background: 'linear-gradient(135deg, var(--color-bg-white) 0%, var(--color-bg-light) 100%)',
            border: '2px solid var(--color-accent-primary)'
          }}>
            <div style={{
              background: 'var(--color-bg-white)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-xl)',
              boxShadow: 'var(--shadow-md)',
              marginBottom: 'var(--spacing-xl)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-md)'
              }}>
                Sample Question
              </h3>
              <p style={{
                fontSize: '1rem',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-lg)',
                lineHeight: 1.6
              }}>
                1 of 36. Is the communication an "invitation or inducement" to engage in investment activity?
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--color-accent-primary)',
                marginBottom: 'var(--spacing-lg)'
              }}>
                📋 Reference: PERG 8.4
              </p>

              {/* Sample Answer Buttons */}
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)'
              }}>
                <button className="answer-card" style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)'
                }}>
                  <CheckCircleIcon style={{ width: '2rem', height: '2rem', color: 'var(--color-success)' }} />
                  <span style={{ fontWeight: 'var(--font-semibold)' }}>Yes</span>
                </button>
                <button className="answer-card" style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)'
                }}>
                  <BoltIcon style={{ width: '2rem', height: '2rem', color: 'var(--color-text-muted)' }} />
                  <span style={{ fontWeight: 'var(--font-semibold)' }}>No</span>
                </button>
              </div>

              <div style={{
                background: 'var(--color-accent-primary-bg)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-accent-primary)',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '0.9375rem',
                  color: 'var(--color-accent-primary)',
                  fontWeight: 'var(--font-medium)',
                  margin: 0
                }}>
                  💡 This is just a preview. Click below to start your full assessment!
                </p>
              </div>
            </div>

            {/* Feature Highlights */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <CheckCircleIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--color-success)' }} />
                <span style={{ fontSize: '0.9375rem' }}>36 comprehensive questions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <ChartBarIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--color-success)' }} />
                <span style={{ fontSize: '0.9375rem' }}>Instant compliance scoring</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <DocumentTextIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--color-success)' }} />
                <span style={{ fontSize: '0.9375rem' }}>Detailed gap analysis</span>
              </div>
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center' }}>
              <button className="start-button" onClick={onStart} style={{ fontSize: '1.125rem' }}>
                <RocketLaunchIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                Start Your Free Assessment
              </button>
            </div>
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
              <a href="#" style={{
                color: 'var(--color-accent-primary)',
                fontWeight: 'var(--font-medium)',
                fontSize: '0.9rem',
                textDecoration: 'none',
                display: 'inline-block',
                marginTop: '1rem'
              }}>
                Learn More →
              </a>
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
              <a href="#" style={{
                color: 'var(--color-accent-primary)',
                fontWeight: 'var(--font-medium)',
                fontSize: '0.9rem',
                textDecoration: 'none',
                display: 'inline-block',
                marginTop: '1rem'
              }}>
                Learn More →
              </a>
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
              <a href="#" style={{
                color: 'var(--color-accent-primary)',
                fontWeight: 'var(--font-medium)',
                fontSize: '0.9rem',
                textDecoration: 'none',
                display: 'inline-block',
                marginTop: '1rem'
              }}>
                Learn More →
              </a>
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
                "FinProms transformed how we approach financial promotions compliance.
                What used to take weeks now takes hours, with greater accuracy and confidence."
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
                    JD
                  </div>
                </div>
                <div className="testimonial-info">
                  <h5>Jane Doe</h5>
                  <p>Head of Compliance, Kindsight Financial</p>
                </div>
              </div>
            </div>

            {/* Right: Metrics */}
            <div>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-value">70%</div>
                  <div className="metric-label">Faster Assessments</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">99%</div>
                  <div className="metric-label">Audit Readiness</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">50+</div>
                  <div className="metric-label">Firms Trust Us</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="about" className="cta-section">
        <h2>Begin Your Journey to Regulatory Certainty</h2>
        <p>
          Take the first step towards streamlined compliance and unwavering confidence.
          Get started today.
        </p>
        <button className="start-button" onClick={onStart}>
          <RocketLaunchIcon style={{ width: '1.5rem', height: '1.5rem' }} />
          Start Assessment
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
