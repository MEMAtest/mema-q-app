// components/AIAnalyzer.js
import React, { useState, useRef } from 'react';
import Image from 'next/image';

const SEVERITY_COLORS = {
  high: { bg: 'rgba(239, 68, 68, 0.1)', border: '#EF4444', text: '#DC2626' },
  medium: { bg: 'rgba(245, 158, 11, 0.1)', border: '#F59E0B', text: '#D97706' },
  low: { bg: 'rgba(16, 185, 129, 0.1)', border: '#10B981', text: '#059669' },
};

const RISK_LABELS = {
  high: { label: 'High Risk', icon: '🔴', color: '#EF4444' },
  medium: { label: 'Needs Review', icon: '🟡', color: '#F59E0B' },
  low: { label: 'Low Risk', icon: '🟢', color: '#10B981' },
};

const AIAnalyzer = ({ onAnalysisComplete, onSkip }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

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

  const processFile = (file) => {
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (PNG, JPG, WEBP, or GIF)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    setError(null);
    setUploadedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(uploadedImage);

      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];

        const response = await fetch('/api/analyze-promotion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64Data,
            mimeType: uploadedImage.type,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Analysis failed');
        }

        setAnalysis(data.analysis);
        setIsAnalyzing(false);
      };

      reader.onerror = () => {
        throw new Error('Failed to read image file');
      };
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
      });
    }
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="ai-analyzer">
      <div className="ai-analyzer-header">
        <div className="ai-badge">
          <span className="ai-icon">🤖</span>
          <span>AI-Powered Analysis</span>
        </div>
        <h2>Upload Your Promotion for Instant Review</h2>
        <p>Our AI will analyze your financial promotion and identify potential compliance issues before you start the assessment.</p>
      </div>

      {!analysis ? (
        <>
          {/* Upload Area */}
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
                  ✕ Remove
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
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="ai-actions">
            {imagePreview && (
              <button
                className="analyze-btn"
                onClick={analyzeImage}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    Analyze Promotion
                  </>
                )}
              </button>
            )}
            <button className="skip-btn" onClick={onSkip}>
              Skip AI Analysis →
            </button>
          </div>
        </>
      ) : (
        /* Analysis Results */
        <div className="analysis-results">
          <div className="results-header">
            <div className="results-image">
              <img src={imagePreview} alt="Analyzed promotion" />
            </div>
            <div className="results-summary">
              <div className={`risk-badge risk-${analysis.overallRisk}`}>
                <span>{RISK_LABELS[analysis.overallRisk]?.icon}</span>
                <span>{RISK_LABELS[analysis.overallRisk]?.label}</span>
              </div>
              <h3>{analysis.isFinancialPromotion ? 'Financial Promotion Detected' : 'May Not Be a Financial Promotion'}</h3>
              <p>{analysis.summary}</p>
            </div>
          </div>

          {/* Issues Found */}
          {analysis.issues && analysis.issues.length > 0 && (
            <div className="issues-section">
              <h4>
                <span>⚠️</span> Issues Found ({analysis.issues.length})
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

          {/* Compliant Elements */}
          {analysis.compliantElements && analysis.compliantElements.length > 0 && (
            <div className="compliant-section">
              <h4>
                <span>✅</span> Compliant Elements
              </h4>
              <ul>
                {analysis.compliantElements.map((element, index) => (
                  <li key={index}>{element}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="results-actions">
            <button className="start-assessment-btn" onClick={handleStartAssessment}>
              Start Assessment with AI Suggestions
              <span>→</span>
            </button>
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
