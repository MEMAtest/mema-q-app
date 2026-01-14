// components/AIAnalyzer.js
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../lib/authContext';

// SVG Icon Components
const Icons = {
  brain: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.54" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.54" />
    </svg>
  ),
  search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  warning: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  lightbulb: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  ),
  document: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  checkCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  billboard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="12" rx="2" />
      <path d="M8 21V15" />
      <path d="M16 21V15" />
    </svg>
  ),
  print: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  globe: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  mail: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  video: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  clipboard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  ),
  riskHigh: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  riskMedium: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  riskLow: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
};

const SEVERITY_COLORS = {
  high: { bg: 'rgba(239, 68, 68, 0.1)', border: '#EF4444', text: '#DC2626' },
  medium: { bg: 'rgba(245, 158, 11, 0.1)', border: '#F59E0B', text: '#D97706' },
  low: { bg: 'rgba(16, 185, 129, 0.1)', border: '#10B981', text: '#059669' },
};

const RISK_LABELS = {
  high: { label: 'High Risk', Icon: Icons.riskHigh, color: '#EF4444' },
  medium: { label: 'Needs Review', Icon: Icons.riskMedium, color: '#F59E0B' },
  low: { label: 'Low Risk', Icon: Icons.riskLow, color: '#10B981' },
};

const PROMOTION_TYPE_MAP = {
  billboard: { label: 'Billboard/Outdoor', Icon: Icons.billboard, scenario: 'print' },
  print: { label: 'Print Material', Icon: Icons.print, scenario: 'print' },
  social_media: { label: 'Social Media', Icon: Icons.phone, scenario: 'social_media' },
  website: { label: 'Website', Icon: Icons.globe, scenario: 'website' },
  email: { label: 'Email Marketing', Icon: Icons.mail, scenario: 'email' },
  video: { label: 'Video Content', Icon: Icons.video, scenario: 'all' },
  other: { label: 'Other Promotion', Icon: Icons.clipboard, scenario: 'all' },
};

const ANALYSIS_STEPS = [
  { id: 1, label: 'Uploading image', duration: 2000 },
  { id: 2, label: 'Identifying promotion type', duration: 15000 },
  { id: 3, label: 'Scanning for risk warnings', duration: 20000 },
  { id: 4, label: 'Checking FCA compliance rules', duration: 25000 },
  { id: 5, label: 'Analyzing claims & disclosures', duration: 30000 },
  { id: 6, label: 'Generating recommendations', duration: 15000 },
];

const AIAnalyzer = ({ onAnalysisComplete, onSkip, onAnalysisStart, compact = false, preloadedPromotion, onPreloadConsumed }) => {
  const { isAuthenticated } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', 'error'
  const fileInputRef = useRef(null);
  const startTimeRef = useRef(null);

  // Handle preloaded promotion from dashboard
  useEffect(() => {
    if (preloadedPromotion?.imageData) {
      setImagePreview(preloadedPromotion.imageData);
      // If there's existing AI analysis, use it
      if (preloadedPromotion.aiAnalysis) {
        setAnalysis(preloadedPromotion.aiAnalysis);
      }
      // Notify parent that preload has been consumed
      if (onPreloadConsumed) {
        onPreloadConsumed();
      }
    }
  }, [preloadedPromotion, onPreloadConsumed]);

  // Progress animation during analysis
  useEffect(() => {
    let progressInterval;
    let timeInterval;

    if (isAnalyzing) {
      startTimeRef.current = Date.now();

      timeInterval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

      let stepIndex = 0;
      let stepProgress = 0;
      const totalDuration = ANALYSIS_STEPS.reduce((sum, s) => sum + s.duration, 0);

      progressInterval = setInterval(() => {
        stepProgress += 100;

        const completedDuration = ANALYSIS_STEPS.slice(0, stepIndex).reduce((sum, s) => sum + s.duration, 0);
        const currentStepDuration = ANALYSIS_STEPS[stepIndex]?.duration || 1000;
        const currentStepProgress = Math.min(stepProgress / currentStepDuration, 1);
        const overallProgress = ((completedDuration + currentStepDuration * currentStepProgress) / totalDuration) * 95;

        setProgress(Math.min(overallProgress, 95));

        if (stepProgress >= currentStepDuration && stepIndex < ANALYSIS_STEPS.length - 1) {
          stepIndex++;
          stepProgress = 0;
          setCurrentStep(stepIndex);
        }
      }, 100);
    } else {
      setProgress(analysis ? 100 : 0);
      setCurrentStep(0);
      setElapsedTime(0);
    }

    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
    };
  }, [isAnalyzing, analysis]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  // Compress image to fit within Vercel's 4.5MB limit
  const compressImage = (file, maxWidth = 1600, maxHeight = 1600, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Calculate new dimensions maintaining aspect ratio
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          // Create canvas and draw resized image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Convert blob to base64
                const blobReader = new FileReader();
                blobReader.onload = () => resolve(blobReader.result);
                blobReader.onerror = reject;
                blobReader.readAsDataURL(blob);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (PNG, JPG, WEBP, or GIF)');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('Image must be less than 20MB');
      return;
    }

    setError(null);

    try {
      // Compress large images to stay within Vercel's 4.5MB limit
      // Base64 adds ~33% overhead, so target ~3MB compressed
      const needsCompression = file.size > 2 * 1024 * 1024;

      if (needsCompression) {
        const compressedDataUrl = await compressImage(file, 1600, 1600, 0.7);
        setImagePreview(compressedDataUrl);
        setUploadedImage(null); // Use compressed preview directly
      } else {
        setUploadedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Image processing error:', err);
      setError('Failed to process image. Please try a different file.');
    }
  };

  const analyzeImage = async () => {
    // Support both File object (uploadedImage) and base64 string (imagePreview from preload)
    if (!uploadedImage && !imagePreview) return;

    setIsAnalyzing(true);
    setError(null);
    setCurrentStep(0);
    setProgress(0);

    // Notify parent that analysis has started
    if (onAnalysisStart) {
      onAnalysisStart();
    }

    try {
      // If we have a File object, read it; otherwise use the existing base64 preview
      if (uploadedImage) {
        const reader = new FileReader();
        reader.readAsDataURL(uploadedImage);

        reader.onload = async () => {
          const base64Data = reader.result.split(',')[1];
          await performAnalysis(base64Data, uploadedImage.type);
        };

        reader.onerror = () => {
          throw new Error('Failed to read image file');
        };
      } else if (imagePreview) {
        // Extract base64 from data URL and detect mime type
        const [header, base64Data] = imagePreview.split(',');
        const mimeMatch = header.match(/data:([^;]+);/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        await performAnalysis(base64Data, mimeType);
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze image. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const performAnalysis = async (base64Data, mimeType) => {
    try {
      const response = await fetch('/api/analyze-promotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Data,
          mimeType: mimeType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Analysis failed');
      }

      setProgress(100);
      setTimeout(() => {
        setAnalysis(data.analysis);
        setIsAnalyzing(false);
      }, 500);
    } catch (err) {
      setError(err.message || 'Failed to analyze image. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const handleStartAssessment = () => {
    if (onAnalysisComplete && analysis) {
      onAnalysisComplete({
        analysis,
        imagePreview,
        suggestedAnswers: analysis.suggestedAnswers || {},
        suggestedScenario: PROMOTION_TYPE_MAP[analysis.promotionType]?.scenario || 'all',
      });
    }
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setAnalysis(null);
    setError(null);
    setProgress(0);
    setCurrentStep(0);
    setSaveStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Save promotion to library
  const saveToLibrary = async () => {
    if (!isAuthenticated || !analysis) return;

    setSaveStatus('saving');
    try {
      const response = await fetch('/api/dashboard/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: imagePreview,
          promotionType: analysis.promotionType || 'other',
          aiAnalysis: analysis,
          notes: `Scanned: ${analysis.promotionTypeLabel || 'Financial Promotion'}`,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');
      setSaveStatus('saved');
    } catch (err) {
      console.error('Failed to save promotion:', err);
      setSaveStatus('error');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const promotionTypeInfo = analysis?.promotionType
    ? PROMOTION_TYPE_MAP[analysis.promotionType] || PROMOTION_TYPE_MAP.other
    : null;

  const riskInfo = analysis?.overallRisk ? RISK_LABELS[analysis.overallRisk] : null;

  return (
    <div className={`ai-analyzer ${compact ? 'compact' : ''}`}>
      <div className="ai-analyzer-header">
        <div className="ai-badge">
          <span className="ai-icon"><Icons.brain /></span>
          <span>Smart Compliance Scanner</span>
        </div>
        <h2>Upload Your Promotion for Instant Compliance Insights</h2>
        <p>Get instant feedback on potential FCA compliance issues before you begin your assessment.</p>
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="analysis-loading">
          <div className="loading-preview">
            <img src={imagePreview} alt="Analyzing" className="loading-image" />
            <div className="scanning-overlay">
              <div className="scan-line"></div>
            </div>
          </div>

          <div className="loading-content">
            <h3>Scanning Your Promotion</h3>
            <p className="loading-subtitle">This typically takes 1-2 minutes for thorough analysis</p>

            <div className="analysis-progress-container">
              <div className="analysis-progress-bar">
                <div
                  className="analysis-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="progress-stats">
                <span>{Math.round(progress)}% complete</span>
                <span>{formatTime(elapsedTime)} elapsed</span>
              </div>
            </div>

            <div className="analysis-steps">
              {ANALYSIS_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`analysis-step ${index < currentStep ? 'completed' : ''} ${index === currentStep ? 'active' : ''}`}
                >
                  <div className="step-indicator">
                    {index < currentStep ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : index === currentStep ? (
                      <div className="step-spinner"></div>
                    ) : (
                      <div className="step-dot"></div>
                    )}
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
              ))}
            </div>

            <p className="loading-tip">
              <span className="tip-icon"><Icons.lightbulb /></span>
              <span><strong>Tip:</strong> Scanning against FCA PERG 8, COBS 4, and Consumer Duty requirements</span>
            </p>
          </div>
        </div>
      )}

      {!analysis && !isAnalyzing && (
        <>
          <div
            className={`upload-zone ${isDragging ? 'dragging' : ''} ${imagePreview ? 'has-image' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !imagePreview && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            {imagePreview ? (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Uploaded promotion" className="image-preview" />
                <button className="remove-image-btn" onClick={(e) => { e.stopPropagation(); resetUpload(); }}>
                  Remove
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M12 12v9" />
                    <path d="m16 16-4-4-4 4" />
                  </svg>
                </div>
                <p className="upload-text">
                  <strong>Drop your promotion here</strong> or click to browse
                </p>
                <p className="upload-hint">PNG, JPG, WEBP up to 10MB</p>
              </div>
            )}
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon"><Icons.warning /></span>
              <span>{error}</span>
            </div>
          )}

          <div className="ai-actions">
            {imagePreview && (
              <button
                className="analyze-btn"
                onClick={analyzeImage}
                disabled={isAnalyzing}
              >
                <Icons.search />
                <span>Scan for Compliance Issues</span>
              </button>
            )}
            <button className="skip-btn" onClick={onSkip}>
              Skip to Manual Assessment
            </button>
          </div>
        </>
      )}

      {analysis && !isAnalyzing && (
        <div className="analysis-results">
          <div className="results-header">
            <div className="results-image">
              <img src={imagePreview} alt="Analyzed promotion" />
            </div>
            <div className="results-summary">
              {promotionTypeInfo && (
                <div className="promotion-type-badge">
                  <promotionTypeInfo.Icon />
                  <span>{analysis.promotionTypeLabel || promotionTypeInfo.label}</span>
                </div>
              )}
              {riskInfo && (
                <div className={`risk-badge risk-${analysis.overallRisk}`}>
                  <span style={{ color: riskInfo.color }}><riskInfo.Icon /></span>
                  <span>{riskInfo.label}</span>
                </div>
              )}
              <h3>{analysis.isFinancialPromotion ? 'Financial Promotion Detected' : 'May Not Be a Financial Promotion'}</h3>
              <p>{analysis.summary}</p>
            </div>
          </div>

          {/* Key Observations - Always show if available */}
          {analysis.keyObservations && analysis.keyObservations.length > 0 && (
            <div className="key-observations-section">
              <h4>
                <Icons.lightbulb />
                <span>Key Observations</span>
              </h4>
              <ul className="key-observations-list">
                {analysis.keyObservations.map((obs, index) => (
                  <li key={index}>{obs}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Raw Analysis - Show when JSON parsing failed */}
          {analysis.rawAnalysis && (
            <div className="raw-analysis-section">
              <h4>
                <Icons.document />
                <span>Detailed Analysis</span>
              </h4>
              <div className="raw-analysis-content">
                <p>{analysis.rawAnalysis}</p>
              </div>
            </div>
          )}

          {analysis.issues && analysis.issues.length > 0 && (
            <div className="issues-section">
              <h4>
                <Icons.warning />
                <span>Issues Found ({analysis.issues.length})</span>
              </h4>
              <div className="issues-list">
                {analysis.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="issue-card"
                    style={{
                      background: SEVERITY_COLORS[issue.severity]?.bg,
                      borderColor: SEVERITY_COLORS[issue.severity]?.border,
                    }}
                  >
                    <div className="issue-header">
                      <span
                        className="severity-badge"
                        style={{ background: SEVERITY_COLORS[issue.severity]?.border }}
                      >
                        {issue.severity.toUpperCase()}
                      </span>
                      <span className="fca-ref">{issue.fcaReference}</span>
                    </div>
                    <p className="issue-description">{issue.description}</p>
                    <p className="issue-recommendation">
                      <strong>Fix:</strong> {issue.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.compliantElements && analysis.compliantElements.length > 0 && (
            <div className="compliant-section">
              <h4>
                <Icons.checkCircle />
                <span>Compliant Elements</span>
              </h4>
              <ul>
                {analysis.compliantElements.map((element, index) => (
                  <li key={index}>{element}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="results-actions">
            <button className="start-assessment-btn" onClick={handleStartAssessment}>
              <span>Start Assessment with Suggestions</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
            {isAuthenticated && (
              <button
                className={`save-library-btn ${saveStatus === 'saved' ? 'saved' : ''}`}
                onClick={saveToLibrary}
                disabled={saveStatus === 'saving' || saveStatus === 'saved'}
              >
                {saveStatus === 'saving' ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : saveStatus === 'saved' ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>Saved to Library</span>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    <span>Save to Library</span>
                  </>
                )}
              </button>
            )}
            <button className="reset-btn" onClick={resetUpload}>
              Upload Different Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalyzer;
