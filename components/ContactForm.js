import { useState } from 'react';
import Image from 'next/image';

const CONTACT_REASONS = [
  { value: 'assessment', label: 'Request a Compliance Assessment' },
  { value: 'demo', label: 'Schedule a Product Demo' },
  { value: 'consulting', label: 'Compliance Consulting Services' },
  { value: 'authorization', label: 'FCA Authorization Support' },
  { value: 'finproms', label: 'Financial Promotions Guidance' },
  { value: 'partnership', label: 'Partnership Opportunities' },
  { value: 'support', label: 'Technical Support' },
  { value: 'other', label: 'Other (Please specify)' }
];

const BEST_TIMES = [
  { value: 'morning', label: 'Morning (9am - 12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm - 5pm)' },
  { value: 'evening', label: 'Evening (5pm - 7pm)' },
  { value: 'anytime', label: 'Anytime' }
];

export default function ContactForm({ onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    reason: '',
    reasonOther: '',
    bestTime: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const totalSteps = 3;

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.company.trim()) newErrors.company = 'Company name is required';
    }

    if (currentStep === 2) {
      if (!formData.reason) newErrors.reason = 'Please select a reason';
      if (formData.reason === 'other' && !formData.reasonOther.trim()) {
        newErrors.reasonOther = 'Please specify your reason';
      }
    }

    if (currentStep === 3) {
      if (!formData.bestTime) newErrors.bestTime = 'Please select your preferred time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="contact-form-step">
            <div className="step-header">
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                Let's get started
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
                Tell us a bit about yourself and your company
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                id="name"
                type="text"
                placeholder="John Smith"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? 'error' : ''}
                autoFocus
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Work Email *</label>
              <input
                id="email"
                type="email"
                placeholder="john@company.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="company">Company Name *</label>
              <input
                id="company"
                type="text"
                placeholder="Your Company Ltd"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className={errors.company ? 'error' : ''}
              />
              {errors.company && <span className="error-message">{errors.company}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number (Optional)</label>
              <input
                id="phone"
                type="tel"
                placeholder="+44 20 1234 5678"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="contact-form-step">
            <div className="step-header">
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                How can we help?
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
                Select the reason for reaching out
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="reason">I'm interested in... *</label>
              <select
                id="reason"
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                className={errors.reason ? 'error' : ''}
              >
                <option value="">Select an option</option>
                {CONTACT_REASONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.reason && <span className="error-message">{errors.reason}</span>}
            </div>

            {formData.reason === 'other' && (
              <div className="form-group">
                <label htmlFor="reasonOther">Please specify *</label>
                <input
                  id="reasonOther"
                  type="text"
                  placeholder="Tell us what you need help with"
                  value={formData.reasonOther}
                  onChange={(e) => handleChange('reasonOther', e.target.value)}
                  className={errors.reasonOther ? 'error' : ''}
                />
                {errors.reasonOther && <span className="error-message">{errors.reasonOther}</span>}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="message">Additional Details (Optional)</label>
              <textarea
                id="message"
                rows="4"
                placeholder="Tell us more about your requirements, timeline, or any specific questions you have..."
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                style={{ resize: 'vertical', minHeight: '100px' }}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="contact-form-step">
            <div className="step-header">
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                When should we reach out?
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
                Let us know your preferred contact time
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="bestTime">Best time to contact *</label>
              <div className="radio-group">
                {BEST_TIMES.map(option => (
                  <label key={option.value} className="radio-option">
                    <input
                      type="radio"
                      name="bestTime"
                      value={option.value}
                      checked={formData.bestTime === option.value}
                      onChange={(e) => handleChange('bestTime', e.target.value)}
                    />
                    <span className="radio-label">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.bestTime && <span className="error-message">{errors.bestTime}</span>}
            </div>

            <div className="form-summary">
              <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Review your details:</h4>
              <div className="summary-item">
                <strong>Name:</strong> {formData.name}
              </div>
              <div className="summary-item">
                <strong>Email:</strong> {formData.email}
              </div>
              <div className="summary-item">
                <strong>Company:</strong> {formData.company}
              </div>
              {formData.phone && (
                <div className="summary-item">
                  <strong>Phone:</strong> {formData.phone}
                </div>
              )}
              <div className="summary-item">
                <strong>Reason:</strong> {CONTACT_REASONS.find(r => r.value === formData.reason)?.label}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="contact-form-overlay" onClick={onClose}>
        <div className="contact-form-container success-state" onClick={(e) => e.stopPropagation()}>
          <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto' }}>
                <circle cx="40" cy="40" r="40" fill="#00C897" opacity="0.1"/>
                <circle cx="40" cy="40" r="32" fill="#00C897" opacity="0.2"/>
                <path d="M25 40L35 50L55 30" stroke="#00C897" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
              Thank you for reaching out!
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
              We've received your message and will get back to you within 24 hours.
            </p>
            <button className="start-button" onClick={onClose} style={{ minWidth: '200px' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-form-overlay" onClick={onClose}>
      <div className="contact-form-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>

        <div className="progress-steps">
          {[1, 2, 3].map(num => (
            <div key={num} className={`progress-step ${step >= num ? 'active' : ''} ${step > num ? 'completed' : ''}`}>
              {step > num ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="10" fill="#00C897"/>
                  <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span>{num}</span>
              )}
            </div>
          ))}
        </div>

        <div className="form-content">
          {renderStep()}
        </div>

        <div className="form-actions">
          {step > 1 && (
            <button
              type="button"
              className="btn-ghost"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Back
            </button>
          )}

          {step < totalSteps ? (
            <button
              type="button"
              className="start-button"
              onClick={handleNext}
              style={{ marginLeft: 'auto' }}
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              className="start-button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{ marginLeft: 'auto' }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          )}
        </div>

        {submitStatus === 'error' && (
          <div className="error-banner">
            <Image src="/icons/ui/info-circle.svg" alt="" width={20} height={20} />
            <span>Failed to send message. Please try again or email us directly at contact@memaconsultants.com</span>
          </div>
        )}
      </div>
    </div>
  );
}
