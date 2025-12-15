// components/WelcomeScreen.js
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import InteractiveVision3D from './InteractiveVision3D';
import TiltParallax from './TiltParallax';
import InteractiveIcon from './InteractiveIcon';
import ContactForm from './ContactForm';

const IconWorkflow = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="8" width="22" height="12" rx="6" fill="#0fa294" opacity="0.12" />
    <path d="M7 14h14" stroke="#0fa294" strokeWidth="2" strokeLinecap="round" />
    <circle cx="9" cy="14" r="2.5" fill="white" stroke="#0fa294" strokeWidth="2" />
    <circle cx="19" cy="14" r="2.5" fill="white" stroke="#0fa294" strokeWidth="2" />
  </svg>
);

const IconInsights = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="18" height="18" rx="5" fill="#0fa294" opacity="0.08" />
    <path d="M9 17l4-5 3 3 4-6" stroke="#0fa294" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="20" cy="9" r="1.5" fill="#0fa294" />
  </svg>
);

const IconRisk = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="10" fill="#0fa294" opacity="0.08" />
    <path d="M14 8v8l4 2" stroke="#0fa294" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="14" cy="14" r="3" stroke="#0fa294" strokeWidth="2" />
  </svg>
);

const IconMap = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 8l8-4 12 4v16l-8 4-12-4V8z" stroke="#0fa294" strokeWidth="2" fill="#0fa294" fillOpacity="0.07" />
    <path d="M14 4v16M22 8v16" stroke="#0fa294" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconShield = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4l10 4v8c0 6-4 9-10 12-6-3-10-6-10-12V8l10-4z" stroke="#0fa294" strokeWidth="2" fill="#0fa294" fillOpacity="0.07" />
    <path d="M12 16l3 3 5-5" stroke="#0fa294" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconGovernance = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="20" height="20" rx="6" fill="#0fa294" fillOpacity="0.08" />
    <rect x="10" y="10" width="4" height="12" rx="2" fill="#0fa294" />
    <rect x="18" y="10" width="4" height="12" rx="2" fill="#0fa294" opacity="0.7" />
  </svg>
);

const HeroCrystal = () => (
  <svg width="340" height="260" viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="hexShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#061927" floodOpacity="0.35" />
      </filter>
      <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="15" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect x="10" y="10" width="260" height="200" rx="32" fill="#0fa294" opacity="0.16" />
    <g filter="url(#hexShadow)">
      {/* Back face (gives "depth") */}
      <path
        d="M140 50l70 40v80l-70 40-70-40v-80l70-40z"
        transform="translate(7 9)"
        stroke="#0b7286"
        strokeOpacity="0.55"
        strokeWidth="3"
        fill="#0b7286"
        fillOpacity="0.18"
      />
      {/* Front face */}
      <path
        d="M140 50l70 40v80l-70 40-70-40v-80l70-40z"
        stroke="#8ee0d5"
        strokeWidth="2"
        fill="#8ee0d5"
        fillOpacity="0.08"
        filter="url(#heroGlow)"
      />
      {/* Inner detail */}
      <circle cx="140" cy="110" r="28" stroke="#8ee0d5" strokeWidth="1.5" opacity="0.6" />
      <circle cx="140" cy="110" r="8" fill="#8ee0d5" />
      <line x1="140" y1="70" x2="140" y2="30" stroke="#8ee0d5" strokeWidth="1.5" opacity="0.4" />
      <line x1="140" y1="150" x2="140" y2="190" stroke="#8ee0d5" strokeWidth="1.5" opacity="0.3" />
      {/* Edge highlight */}
      <path
        d="M140 50l70 40v80l-70 40-70-40v-80l70-40z"
        stroke="#ffffff"
        strokeOpacity="0.10"
        strokeWidth="5"
      />
    </g>
  </svg>
);

const valueProps = [
  {
    icon: <IconWorkflow />,
    title: 'Streamlined Workflows',
    copy: 'Automate intake, approvals, and audit evidence for every promotion and perimeter check.'
  },
  {
    icon: <IconInsights />,
    title: 'Actionable Insights',
    copy: 'Surface precise FCA references, risk signals, and next steps for each response.'
  },
  {
    icon: <IconRisk />,
    title: 'Reduced Risk Exposure',
    copy: 'Proactively flag Section 21 FSMA, PERG, and MAR issues before they become findings.'
  }
];

const featureDeepDive = [
  {
    title: 'Precision Perimeter Mapping & Authorisation',
    icon: <IconMap />,
    description: 'Forensic interpretation of your business model across PERG, RAO, and SUP 12 so permissions stay exact, defensible, and future-ready.',
    points: ['Tailored PERG & RAO mapping', 'SMCR & Governance frameworks', 'Connect application support']
  },
  {
    title: 'Intelligent Financial Promotions & Market Abuse Control',
    icon: <IconShield />,
    description: 'Operationalise Section 21 FSMA compliance with real-time guardrails, MNPI safeguards, and audit-ready documentation aligned to the FCA’s latest supervisory focus.',
    points: ['Automated s21 approval workflows', 'Dynamic MNPI risk radar', 'Audit-ready compliance records']
  },
  {
    title: 'Market-Ready Governance & Reporting',
    icon: <IconGovernance />,
    description: 'Embed Consumer Duty evidence, approvals, and Board reporting that scales with product launches and new jurisdictions.',
    points: ['Board-ready MI packs', 'Evidence library & attestation trail', 'Consumer Duty monitoring']
  }
];

const heroLogos = ['FinTech Scaleups', 'Advisory Firms', 'Digital Banks', 'Payments Innovators'];

const sampleAnswers = [
  { label: 'Yes', helper: 'Requirement satisfied or exemption applied.', defaultSelected: true },
  { label: 'No', helper: 'Requirement missing or needs escalation.', defaultSelected: false }
];

const WelcomeScreen = ({ onStart }) => {
  const { t } = useTranslation('common');
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <>
      {showContactForm && <ContactForm onClose={() => setShowContactForm(false)} />}
      <header className="header">
        <div className="header-logo">
          <Link href="/" style={{ cursor: 'pointer', display: 'block' }}>
            <Image
              src="/mema-logo-light.svg"
              alt="MEMA"
              width={160}
              height={42}
              priority
              style={{ height: 'auto', width: 'auto' }}
            />
          </Link>
        </div>
        <nav className="header-nav" />
        <div className="header-actions">
          <button className="start-button" onClick={onStart} style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
            Get Started
          </button>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-content">
            <div className="hero-cards">
            <div className="hero-card hero-card-primary">
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-ink-muted)', fontWeight: 'var(--font-semibold)', margin: 0 }}>
                MEMA · Intelligent Compliance OS
              </p>
              <h1>Future-Proofing Compliance</h1>
              <div style={{ margin: '1.5rem 0', display: 'flex', justifyContent: 'center' }}>
                <Image
                  src="/illustrations/compliance-shield.svg"
                  alt="Compliance Assurance"
                  width={400}
                  height={240}
                  style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
                />
              </div>
              <p>
                Navigate FCA regulations with precision. Get expert guidance and generate audit-ready compliance reports.
              </p>
              <div className="cta-buttons" style={{ justifyContent: 'flex-start', marginTop: 'var(--spacing-lg)' }}>
                <button className="start-button" onClick={onStart}>
                  <Image src="/icons/ui/play-circle.svg" alt="" width={24} height={24} style={{ width: '1.5rem', height: '1.5rem' }} />
                  Start Assessment
                </button>
                <button
                  className="btn-ghost"
                  style={{ borderColor: 'rgba(15, 23, 42, 0.14)', color: 'var(--color-ink-primary)', background: 'transparent' }}
                  onClick={() => setShowContactForm(true)}
                >
                  Contact Us
                </button>
              </div>
            </div>
            <div className="hero-card hero-card-visual">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>
                <span>Intelligent Guidance Workspace</span>
                <span>Live Preview</span>
              </div>
              <div className="hero-visual">
                <TiltParallax className="hero-tilt" maxTilt={18}>
                  <HeroCrystal />
                </TiltParallax>
              </div>
              <p className="labyrinth-caption" style={{ color: 'rgba(255,255,255,0.8)' }}>Navigate the MEMA regulatory labyrinth with confidence.</p>
            </div>
          </div>
          <div className="hero-social-proof">
            <span>Trusted by leading FinTechs and advisory firms</span>
            <div className="hero-logo-strip">
              {heroLogos.map((logo) => (
                <span key={logo} className="hero-logo-pill">{logo}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="section-light" style={{ maxWidth: '1200px', margin: '3rem auto' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.25rem', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
            Your Edge in Regulatory Compliance
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
            Clarity, speed, and rigor baked into every workflow.
          </p>
        </div>
        <div className="value-grid">
          {valueProps.map(({ icon, title, copy }) => (
            <div key={title} className="value-card">
              <InteractiveIcon>
                <div className="icon-circle">{icon}</div>
              </InteractiveIcon>
              <h4>{title}</h4>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="product" className="section-light" style={{ maxWidth: '1200px', margin: '3rem auto' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.3rem' }}>See Our Intelligent Guidance Workspace in Action</h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '700px', margin: '0.5rem auto 0' }}>
            Experience how FinProms converts complex PERG analysis into clear, auditable steps.
          </p>
        </div>
        <div className="product-card">
          <div className="product-copy">
            <InteractiveVision3D />
            <h3 style={{ fontSize: '1.8rem', marginBottom: 'var(--spacing-md)' }}>Experience FinProms Live</h3>
            <p>
              Each answer updates risk radar, FCA references, and recommended actions automatically, giving teams immediate confidence.
            </p>
            <ul className="feature-points">
              <li>Dynamic scoring across PERG, FSMA s21, and Consumer Duty</li>
              <li>Inline evidence capture with audit-ready exports</li>
              <li>Workflow prompts for approvals, follow-ups, and escalations</li>
            </ul>
          </div>
          <div className="product-visual">
            <div className="mockup-frame">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                <span>Question 1 of 10 · Section 1</span>
                <span>Sample Interaction</span>
              </div>
              <h3 style={{ fontSize: '1.6rem', color: 'white', marginBottom: 'var(--spacing-sm)' }}>
                1.1 Is the communication an &quot;invitation or inducement&quot; to engage in an activity?
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.72)', marginBottom: 'var(--spacing-lg)' }}>
                Reference: PERG 8.4
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                {sampleAnswers.map((answer) => (
                  <div
                    key={answer.label}
                    style={{
                      borderRadius: '1rem',
                      padding: 'var(--spacing-lg)',
                      border: `2px solid ${answer.defaultSelected ? 'var(--color-accent-primary)' : 'rgba(255,255,255,0.2)'}`,
                      background: answer.defaultSelected ? 'rgba(15,162,148,0.12)' : 'rgba(255,255,255,0.02)',
                      color: 'white'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'var(--font-semibold)' }}>
                      <Image src="/icons/actions/check-circle.svg" alt="" width={24} height={24} style={{ width: '1.5rem', height: '1.5rem', opacity: answer.defaultSelected ? 1 : 0.5 }} />
                      {answer.label}
                    </div>
                    <p style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>{answer.helper}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '1rem', padding: 'var(--spacing-lg)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent-primary)', fontWeight: 'var(--font-semibold)', marginBottom: '0.5rem' }}>
                  <Image src="/icons/ui/info-circle.svg" alt="" width={24} height={24} style={{ width: '1.2rem', height: '1.2rem' }} />
                  Why this matters
                </div>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.78)' }}>
                  A financial promotion must invite or encourage engagement in a financial activity. If it persuades the reader to take the next step, PERG 8.4 applies and Principal approval is required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section-light" style={{ maxWidth: '1200px', margin: '3rem auto' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.3rem', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
            Navigate the Regulatory Landscape with Unrivalled Clarity
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
            Deep regulatory expertise layered with intelligent automation.
          </p>
        </div>

        {/* Illustration cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-2xl)',
          marginBottom: 'var(--spacing-2xl)',
          marginTop: 'var(--spacing-2xl)'
        }}>
          <div className="illustration-card">
            <img
              src="/illustrations/key-insights.svg"
              alt="Generate Compliance Reports"
              style={{ width: '100%', maxWidth: '280px', margin: '0 auto', display: 'block' }}
            />
            <h4 style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)', fontSize: '1.125rem', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>
              Generate Audit-Ready Reports
            </h4>
            <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: 'var(--spacing-sm)' }}>
              Complete our assessment and receive comprehensive compliance reports with FCA references and regulatory guidance
            </p>
          </div>

          <div className="illustration-card">
            <img
              src="/illustrations/predictive-analytics.svg"
              alt="Understand Your FinProms Status"
              style={{ width: '100%', maxWidth: '280px', margin: '0 auto', display: 'block' }}
            />
            <h4 style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)', fontSize: '1.125rem', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>
              Understand Your FinProms Status
            </h4>
            <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: 'var(--spacing-sm)' }}>
              Get instant clarity on your financial promotions compliance position with actionable insights and next steps
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="section-light" style={{ maxWidth: '1100px', margin: '3rem auto' }}>
        <div className="cta-band">
          <h3>Ready to Transform Your Compliance Operations?</h3>
          <p>Join leading financial firms leveraging intelligent guidance for robust, future-proof compliance.</p>
          <div className="cta-buttons" style={{ justifyContent: 'center' }}>
            <button className="start-button" onClick={() => setShowContactForm(true)}>
              <Image src="/icons/ui/rocket.svg" alt="" width={24} height={24} style={{ width: '1.25rem', height: '1.25rem' }} />
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-grid">
          <div>
            <Image src="/mema-logo-dark.svg" alt="MEMA" width={140} height={32} />
            <p style={{ marginTop: 'var(--spacing-md)', color: 'rgba(255,255,255,0.75)' }}>
              Future-proofing finance with intelligent regulatory navigation.
            </p>
          </div>
          <div>
            <h4>Product</h4>
            <ul className="footer-links">
              <li><a href="#product">FinProms Assessment</a></li>
              <li><a href="#benefits">Workflow Automation</a></li>
              <li><a href="#features">Authorisation Strategy</a></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About MEMA</a></li>
              <li><a href="mailto:info@memaconsultants.com">Contact</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} MEMA Consultants · All rights reserved.</span>
        </div>
      </footer>
    </>
  );
};

export default WelcomeScreen;
