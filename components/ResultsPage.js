import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  RocketLaunchIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { generateCompliancePDF } from '../utils/pdfGenerator';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function ResultsPage({ results, onGoBack, questions, answers }) {
  const [isFullReportUnlocked, setIsFullReportUnlocked] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadFirm, setLeadFirm] = useState('');
  const [formState, setFormState] = useState({ status: 'idle', message: '' });
  const [expandedIssues, setExpandedIssues] = useState({});
  const [animateScore, setAnimateScore] = useState(0);

  // Animate score gauge on mount
  useEffect(() => {
    if (results) {
      let currentScore = 0;
      const targetScore = results.healthScore;
      const interval = setInterval(() => {
        currentScore += Math.ceil(targetScore / 30);
        if (currentScore >= targetScore) {
          currentScore = targetScore;
          clearInterval(interval);
        }
        setAnimateScore(currentScore);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [results]);

  const toggleIssue = (issueId) => {
    setExpandedIssues(prev => ({
      ...prev,
      [issueId]: !prev[issueId]
    }));
  };

  if (!results) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="card" style={{
          textAlign: 'center',
          padding: 'var(--spacing-2xl)',
          background: 'var(--bg-card-darker)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--border-medium)'
        }}>
          <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>Calculating results...</p>
        </div>
      </div>
    );
  }

  const previewFailures = results.potentialFailures.filter(f => f.id.startsWith('1.') || f.id.startsWith('2.'));
  const previewBarData = {
      labels: results.chartData.bar.labels.slice(0, 2),
      datasets: results.chartData.bar.datasets.map(dataset => ({
          ...dataset,
          data: dataset.data.slice(0, 2),
      })),
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setFormState({ status: 'loading', message: '' });
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName,
          firm: leadFirm,
          email: leadEmail,
          phone: leadPhone,
          questions: questions,
          answers: answers
        }),
      });
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Submission failed');
      }
      setFormState({ status: 'success', message: 'Thank you! Your full report is unlocked below and a copy has been sent to your email.' });
      setIsFullReportUnlocked(true);
    } catch (error) {
      setFormState({ status: 'error', message: error.message || 'Something went wrong. Please try again.' });
    }
  };

  const handleCsvExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Question,Regulation Reference,Your Answer,Your Notes\r\n";
    questions.forEach(section => {
        section.items.forEach(item => {
            const userAnswer = answers[item.id];
            const sanitize = (text) => text ? `"${String(text).replace(/"/g, '""')}"` : '""';
            const answerText = userAnswer?.answer ? JSON.stringify(userAnswer.answer).replace(/"/g, '') : 'N/A';

            let row = [
                sanitize(item.questionText),
                sanitize(item.questionRef),
                sanitize(answerText),
                sanitize(userAnswer?.notes || ''),
            ].join(",");
            csvContent += row + "\r\n";
        });
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mema_compliance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePdfDownload = () => {
    try {
      generateCompliancePDF(results, questions, answers);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const doughnutOptions = {
      responsive: true, maintainAspectRatio: false, cutout: '70%',
      plugins: { legend: { display: false } }
  };
  const barOptions = {
      responsive: true, maintainAspectRatio: false, indexAxis: 'y',
      scales: { x: { stacked: true }, y: { stacked:true } },
      plugins: { title: { display: true, text: 'Responses by Section', font: {size: 16} }, legend: { position: 'top' } }
  };

  // Calculate stats
  const totalQuestions = Object.keys(answers).length;
  const compliantAnswers = results.chartData.doughnut[0];
  const issuesCount = results.potentialFailures.length;
  const healthStatus = results.healthScore >= 80 ? 'Strong' : results.healthScore >= 60 ? 'Needs Attention' : 'Critical';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-light)',
      padding: 'var(--spacing-xl) 0'
    }}>
      {/* Hero Section: Compliance Score */}
      <section style={{
        background: 'var(--color-bg-white)',
        padding: 'var(--spacing-3xl) var(--spacing-xl)',
        marginBottom: 'var(--spacing-2xl)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'var(--font-black)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-md)'
          }}>
            Your Compliance Assessment Results
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-2xl)',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Comprehensive insights and actionable recommendations from your FinProms assessment
          </p>

          {/* Compliance Score Gauge */}
          <div className="score-gauge-container" style={{ margin: '0 auto' }}>
            <div style={{ position: 'relative', width: '250px', height: '250px', margin: '0 auto' }}>
              <Doughnut
                data={{
                  labels: ['Compliant', 'Issues/Unanswered'],
                  datasets: [{
                    data: results.chartData.doughnut,
                    backgroundColor: ['var(--color-success)', 'var(--color-danger)'],
                    borderWidth: 0
                  }]
                }}
                options={doughnutOptions}
              />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <div className="score-value" style={{
                  fontSize: '3.5rem',
                  fontWeight: 'var(--font-black)',
                  color: 'var(--color-text-primary)',
                  lineHeight: 1
                }}>
                  {animateScore}%
                </div>
                <div className="score-label" style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--spacing-xs)',
                  fontWeight: 'var(--font-medium)'
                }}>
                  Health Score
                </div>
              </div>
            </div>
            <div style={{
              marginTop: 'var(--spacing-lg)',
              padding: 'var(--spacing-md)',
              background: results.healthScore >= 80 ? 'var(--color-success-bg)' : results.healthScore >= 60 ? 'var(--color-warning-bg)' : 'var(--color-danger-bg)',
              borderRadius: 'var(--radius-md)',
              display: 'inline-block'
            }}>
              <p style={{
                fontSize: '1.125rem',
                fontWeight: 'var(--font-semibold)',
                color: results.healthScore >= 80 ? 'var(--color-success-dark)' : results.healthScore >= 60 ? 'var(--color-warning-dark)' : 'var(--color-danger-dark)',
                margin: 0
              }}>
                Overall Status: {healthStatus}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Overview: Summary Cards */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--spacing-md)' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'var(--font-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--spacing-xl)',
          textAlign: 'center'
        }}>
          Assessment Overview
        </h2>

        <div className="summary-cards">
          <div className="summary-card">
            <ClipboardDocumentCheckIcon style={{ width: '3rem', height: '3rem', color: 'var(--color-accent-primary)', margin: '0 auto var(--spacing-md)' }} />
            <div className="summary-card-value">{totalQuestions}</div>
            <div className="summary-card-label">Total Questions</div>
          </div>

          <div className="summary-card">
            <CheckCircleIcon style={{ width: '3rem', height: '3rem', color: 'var(--color-success)', margin: '0 auto var(--spacing-md)' }} />
            <div className="summary-card-value" style={{ color: 'var(--color-success)' }}>{compliantAnswers}</div>
            <div className="summary-card-label">Compliant</div>
          </div>

          <div className="summary-card">
            <ExclamationTriangleIcon style={{ width: '3rem', height: '3rem', color: issuesCount > 0 ? 'var(--color-danger)' : 'var(--color-success)', margin: '0 auto var(--spacing-md)' }} />
            <div className="summary-card-value" style={{ color: issuesCount > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>{issuesCount}</div>
            <div className="summary-card-label">Needs Action</div>
          </div>

          <div className="summary-card">
            <ChartBarIcon style={{ width: '3rem', height: '3rem', color: 'var(--color-accent-primary)', margin: '0 auto var(--spacing-md)' }} />
            <div className="summary-card-value">{questions.length}</div>
            <div className="summary-card-label">Sections Reviewed</div>
          </div>
        </div>
      </section>

      {/* Preview: Key Issues (Risk Cards) */}
      <section style={{ maxWidth: '1200px', margin: 'var(--spacing-3xl) auto 0', padding: '0 var(--spacing-md)' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'var(--font-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--spacing-md)'
        }}>
          Key Areas for Review & Action
        </h2>
        <p style={{
          fontSize: '1.125rem',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          Below are the compliance areas that require your attention
        </p>

        {previewFailures.length > 0 ? (
          previewFailures.map((failure, index) => {
            const isExpanded = expandedIssues[failure.id];
            const severity = index === 0 ? 'critical' : 'medium';
            const severityColor = severity === 'critical' ? 'var(--color-danger)' : 'var(--color-warning)';
            const severityBg = severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)';

            return (
              <div
                key={failure.id}
                style={{
                  background: 'var(--color-bg-white)',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px solid ${severityColor}`,
                  marginBottom: 'var(--spacing-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all var(--transition-base)',
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s backwards`
                }}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleIssue(failure.id)}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-lg)',
                    background: severityBg,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--spacing-md)',
                    transition: 'all var(--transition-base)',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${severityBg}`;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = severityBg;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  aria-expanded={isExpanded}
                  aria-label={`${isExpanded ? 'Collapse' : 'Expand'} issue details`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', flex: 1 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: severityColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {severity === 'critical' ? '🔴' : '🟠'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 'var(--font-bold)',
                        color: severityColor,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.25rem'
                      }}>
                        {severity === 'critical' ? 'CRITICAL ISSUE' : 'MEDIUM PRIORITY'}
                      </div>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--color-text-primary)',
                        lineHeight: 1.4
                      }}>
                        Question {failure.id}: {failure.question}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUpIcon style={{ width: '1.5rem', height: '1.5rem', color: severityColor, flexShrink: 0 }} />
                  ) : (
                    <ChevronDownIcon style={{ width: '1.5rem', height: '1.5rem', color: severityColor, flexShrink: 0 }} />
                  )}
                </button>

                {/* Accordion Content */}
                {isExpanded && (
                  <div style={{
                    padding: 'var(--spacing-xl)',
                    animation: 'fadeInUp 0.3s ease-out'
                  }}>
                    {/* Regulatory Impact */}
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <h5 style={{
                        fontSize: '0.875rem',
                        fontWeight: 'var(--font-bold)',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--spacing-sm)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        📋 Regulatory Impact
                      </h5>
                      <div style={{
                        padding: 'var(--spacing-md)',
                        background: severityBg,
                        borderRadius: 'var(--radius-md)',
                        borderLeft: `4px solid ${severityColor}`
                      }}>
                        <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
                          {failure.implication}
                        </p>
                      </div>
                    </div>

                    {/* User Notes */}
                    {failure.notes && (
                      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <h5 style={{
                          fontSize: '0.875rem',
                          fontWeight: 'var(--font-bold)',
                          color: 'var(--color-text-primary)',
                          marginBottom: 'var(--spacing-sm)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          📝 Your Justification
                        </h5>
                        <p style={{
                          padding: 'var(--spacing-md)',
                          background: 'var(--color-bg-light)',
                          borderRadius: 'var(--radius-md)',
                          margin: 0,
                          fontStyle: 'italic',
                          lineHeight: 1.6,
                          color: 'var(--color-text-secondary)'
                        }}>
                          {failure.notes}
                        </p>
                      </div>
                    )}

                    {/* Recommended Actions */}
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <h5 style={{
                        fontSize: '0.875rem',
                        fontWeight: 'var(--font-bold)',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--spacing-sm)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        💡 Recommended Actions
                      </h5>
                      <ul style={{
                        margin: 0,
                        paddingLeft: 'var(--spacing-lg)',
                        lineHeight: 1.8,
                        color: 'var(--color-text-secondary)'
                      }}>
                        <li>Review communication content against {failure.ref} guidance</li>
                        <li>Consult with compliance team or legal advisor</li>
                        <li>Document assessment rationale and decision</li>
                        {severity === 'critical' && <li><strong>Priority: Address within 14 days</strong></li>}
                      </ul>
                    </div>

                    {/* Resource Links */}
                    <div style={{
                      padding: 'var(--spacing-md)',
                      background: 'var(--color-accent-primary-bg)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-accent-primary)',
                      marginBottom: 'var(--spacing-lg)'
                    }}>
                      <p style={{
                        margin: 0,
                        fontSize: '0.875rem',
                        color: 'var(--color-accent-primary)',
                        fontWeight: 'var(--font-medium)'
                      }}>
                        📚 Reference: {failure.ref} • <a href="#" style={{ color: 'var(--color-accent-primary)', textDecoration: 'underline' }}>View FCA Guidance</a>
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      gap: 'var(--spacing-sm)',
                      flexWrap: 'wrap'
                    }}>
                      <button style={{
                        padding: 'var(--spacing-sm) var(--spacing-lg)',
                        background: 'var(--color-accent-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: 'var(--font-semibold)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-base)'
                      }} onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-accent-primary-hover)';
                      }} onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--color-accent-primary)';
                      }}>
                        Edit Answer
                      </button>
                      <button style={{
                        padding: 'var(--spacing-sm) var(--spacing-lg)',
                        background: 'transparent',
                        color: 'var(--color-text-primary)',
                        border: '2px solid var(--color-border-light)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: 'var(--font-semibold)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-base)'
                      }} onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                        e.currentTarget.style.color = 'var(--color-accent-primary)';
                      }} onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-border-light)';
                        e.currentTarget.style.color = 'var(--color-text-primary)';
                      }}>
                        Add to Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="card" style={{
            background: 'var(--color-success-bg)',
            border: '2px solid var(--color-success)',
            textAlign: 'center'
          }}>
            <CheckCircleIcon style={{ width: '3rem', height: '3rem', color: 'var(--color-success)', margin: '0 auto var(--spacing-md)' }} />
            <p style={{ color: 'var(--color-success-dark)', fontWeight: 'var(--font-semibold)', fontSize: '1.125rem', margin: 0 }}>
              No critical issues found in the first two sections. Great work!
            </p>
          </div>
        )}

        {!isFullReportUnlocked && (
          <p style={{
            textAlign: 'center',
            marginTop: 'var(--spacing-xl)',
            padding: 'var(--spacing-md)',
            background: 'var(--color-accent-primary-bg)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-accent-primary)',
            fontWeight: 'var(--font-medium)'
          }}>
            📊 Showing preview of first 2 sections. Unlock full report to see all 6 sections and detailed analysis.
          </p>
        )}
      </section>

      {/* Industry Comparison Widget */}
      <section style={{ maxWidth: '1200px', margin: 'var(--spacing-3xl) auto 0', padding: '0 var(--spacing-md)' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'var(--font-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--spacing-xl)',
          textAlign: 'center'
        }}>
          How You Compare
        </h2>

        <div className="card" style={{
          padding: 'var(--spacing-2xl)',
          background: 'linear-gradient(135deg, var(--color-bg-white) 0%, var(--color-accent-primary-bg) 100%)',
          border: '2px solid var(--color-accent-primary)'
        }}>
          {/* Comparison Bars */}
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            {[
              { label: 'Your Score', value: results.healthScore, color: 'var(--color-accent-primary)', isYou: true },
              { label: 'Industry Average', value: 74, color: 'var(--color-text-muted)', isYou: false },
              { label: 'Top Performers', value: 95, color: 'var(--color-success)', isYou: false }
            ].map((item, index) => (
              <div key={index} style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: item.isYou ? 'var(--font-bold)' : 'var(--font-medium)',
                    color: item.isYou ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)'
                  }}>
                    {item.label} {item.isYou && '(You)'}
                  </span>
                  <span style={{
                    fontSize: '1.5rem',
                    fontWeight: 'var(--font-bold)',
                    color: item.color
                  }}>
                    {item.value}%
                  </span>
                </div>
                <div style={{
                  height: item.isYou ? '16px' : '12px',
                  background: 'var(--color-bg-light)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    width: `${item.value}%`,
                    height: '100%',
                    background: item.color,
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 1s ease-out',
                    animation: `slideIn 1.5s ease-out ${index * 0.2}s backwards`,
                    boxShadow: item.isYou ? `0 0 10px ${item.color}50` : 'none'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Achievement Badge */}
          <div style={{
            padding: 'var(--spacing-xl)',
            background: 'var(--color-success-bg)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--color-success)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: 'var(--spacing-sm)'
            }}>
              🏆
            </div>
            <p style={{
              fontSize: '1.25rem',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-success-dark)',
              margin: 0,
              marginBottom: 'var(--spacing-xs)'
            }}>
              You're in the {results.healthScore >= 85 ? 'Top 25%' : results.healthScore >= 74 ? 'Top 50%' : 'Growing'}!
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              margin: 0
            }}>
              Your compliance score of {results.healthScore}% is {results.healthScore - 74} points above the industry average
            </p>
          </div>
        </div>
      </section>

      {/* Section Breakdown Chart */}
      <section style={{ maxWidth: '1200px', margin: 'var(--spacing-3xl) auto 0', padding: '0 var(--spacing-md)' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'var(--font-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          {isFullReportUnlocked ? 'Complete' : 'Preview'}: Section Breakdown
        </h2>
        <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
          <div style={{ height: isFullReportUnlocked ? '400px' : '300px' }}>
            <Bar data={isFullReportUnlocked ? results.chartData.bar : previewBarData} options={barOptions} />
          </div>
        </div>
      </section>

      {/* Quick Actions Panel */}
      <section style={{ maxWidth: '1200px', margin: 'var(--spacing-3xl) auto 0', padding: '0 var(--spacing-md)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--spacing-lg)'
        }}>
          {/* Next Steps Card */}
          <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <RocketLaunchIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--color-accent-primary)' }} />
              Next Steps
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-sm)'
            }}>
              {[
                { icon: '📥', text: 'Download Full Report PDF', action: true, onClick: handlePdfDownload },
                { icon: '📧', text: 'Share with Compliance Team', action: false, onClick: null },
                { icon: '📅', text: 'Schedule Compliance Review', action: false, onClick: null },
                { icon: '💬', text: 'Book MEMA Consultation', action: true, onClick: null },
                { icon: '📊', text: 'Export to CSV', action: false, onClick: handleCsvExport }
              ].map((item, index) => (
                <li key={index}>
                  <button
                    onClick={item.onClick}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      background: item.action ? 'var(--color-accent-primary-bg)' : 'transparent',
                      border: item.action ? '2px solid var(--color-accent-primary)' : '2px solid var(--color-border-light)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-base)',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      fontSize: '0.9375rem',
                      fontWeight: 'var(--font-medium)',
                      color: 'var(--color-text-primary)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = item.action ? 'var(--color-accent-primary)' : 'var(--color-border-light)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Assessment Timeline Card */}
          <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <ClockIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--color-accent-secondary)' }} />
              Your Assessment Journey
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-md)'
            }}>
              {[
                { icon: '✓', text: 'Started Assessment', time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), completed: true },
                { icon: '✓', text: `Completed ${Object.keys(answers).length} Questions`, time: '', completed: true },
                { icon: '✓', text: 'Reviewed All Sections', time: '', completed: true },
                { icon: '✓', text: 'Generated Results', time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), completed: true }
              ].map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--spacing-md)',
                  opacity: item.completed ? 1 : 0.5
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: item.completed ? 'var(--color-success)' : 'var(--color-bg-light)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'var(--font-bold)',
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '0.9375rem',
                      fontWeight: 'var(--font-medium)',
                      color: 'var(--color-text-primary)',
                      marginBottom: '2px'
                    }}>
                      {item.text}
                    </div>
                    {item.time && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-muted)'
                      }}>
                        {item.time}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div style={{
                marginTop: 'var(--spacing-md)',
                paddingTop: 'var(--spacing-md)',
                borderTop: '1px solid var(--color-border-light)',
                fontSize: '0.875rem',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--color-text-secondary)'
              }}>
                Total Time: ~{Math.ceil(Object.keys(answers).length * 0.5)} minutes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Report or Lead Capture */}
      {isFullReportUnlocked ? (
        <>
          {/* Full Report: All Issues */}
          {results.potentialFailures.length > previewFailures.length && (
            <section style={{ maxWidth: '1200px', margin: 'var(--spacing-3xl) auto 0', padding: '0 var(--spacing-md)' }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-xl)'
              }}>
                Complete Compliance Analysis
              </h2>
              {results.potentialFailures.slice(previewFailures.length).map(failure => (
                <div key={failure.id} className="risk-card risk-card-warning">
                  <div className="risk-card-header">
                    <ExclamationTriangleIcon className="risk-card-icon" />
                    <h4>Question {failure.id}: {failure.question}</h4>
                  </div>
                  {failure.notes && (
                    <p style={{ fontSize: '0.9375rem', fontStyle: 'italic', marginBottom: 'var(--spacing-sm)' }}>
                      <strong>Your Notes:</strong> {failure.notes}
                    </p>
                  )}
                  <div style={{
                    padding: 'var(--spacing-md)',
                    background: 'rgba(245, 158, 11, 0.05)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-warning)'
                  }}>
                    <strong style={{ color: 'var(--color-warning-dark)' }}>Potential Implication: </strong>
                    <span>{failure.implication}</span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Download Report Section */}
          <section style={{ maxWidth: '800px', margin: 'var(--spacing-3xl) auto 0', padding: '0 var(--spacing-md)' }}>
            <div className="card card-lg" style={{
              textAlign: 'center',
              background: 'var(--color-success-bg)',
              border: '2px solid var(--color-success)'
            }}>
              <DocumentTextIcon style={{
                width: '5rem',
                height: '5rem',
                color: 'var(--color-success)',
                margin: '0 auto var(--spacing-lg)'
              }} />
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-md)'
              }}>
                Generate Your Audit-Ready Report
              </h2>
              <p style={{
                fontSize: '1.125rem',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-xl)'
              }}>
                Download your full assessment report, including all questions, justifications,
                and regulatory references, optimized for audit review.
              </p>

              {/* Download Buttons */}
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={handlePdfDownload}
                  className="start-button"
                  style={{
                    background: 'var(--color-success)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    minWidth: '220px',
                    justifyContent: 'center'
                  }}
                >
                  <ArrowDownTrayIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                  Download PDF Report
                </button>

                <button
                  onClick={handleCsvExport}
                  className="start-button"
                  style={{
                    background: 'var(--color-accent-secondary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    minWidth: '220px',
                    justifyContent: 'center'
                  }}
                >
                  <ArrowDownTrayIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                  Download CSV Data
                </button>
              </div>

              <p style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
                marginTop: 'var(--spacing-lg)',
                marginBottom: 0
              }}>
                📄 PDF includes executive summary, detailed analysis, and recommendations<br />
                📊 CSV provides raw data for further analysis
              </p>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Lead Capture Form */}
          <section style={{ maxWidth: '600px', margin: 'var(--spacing-3xl) auto 0', padding: '0 var(--spacing-md)' }}>
            <div className="card card-lg" style={{
              background: 'var(--color-success-bg)',
              border: '2px solid var(--color-success-border)'
            }}>
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-md)',
                textAlign: 'center'
              }}>
                Unlock & Download Full Report
              </h2>
              <p style={{
                fontSize: '1rem',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-xl)',
                textAlign: 'center'
              }}>
                Provide your details to view the full report and receive a copy by email
              </p>

              <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                <div>
                  <label htmlFor="user-name" style={{
                    display: 'block',
                    fontSize: '0.9375rem',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    Full Name *
                  </label>
                  <input
                    id="user-name"
                    type="text"
                    placeholder="Jane Doe"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      border: '2px solid var(--color-border-light)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-primary)'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="user-firm" style={{
                    display: 'block',
                    fontSize: '0.9375rem',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    Firm Name *
                  </label>
                  <input
                    id="user-firm"
                    type="text"
                    placeholder="Your Company Ltd"
                    required
                    value={leadFirm}
                    onChange={(e) => setLeadFirm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      border: '2px solid var(--color-border-light)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-primary)'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="user-email" style={{
                    display: 'block',
                    fontSize: '0.9375rem',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    Email Address *
                  </label>
                  <input
                    id="user-email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      border: '2px solid var(--color-border-light)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-primary)'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="user-phone" style={{
                    display: 'block',
                    fontSize: '0.9375rem',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    Contact Number (Optional)
                  </label>
                  <input
                    id="user-phone"
                    type="tel"
                    placeholder="07123 456789"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md)',
                      border: '2px solid var(--color-border-light)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-primary)'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={formState.status === 'loading'}
                  className="start-button"
                  style={{
                    width: '100%',
                    background: 'var(--color-success)',
                    justifyContent: 'center'
                  }}
                >
                  {formState.status === 'loading' ? 'Submitting...' : '🔓 Unlock Full Report'}
                </button>
              </form>

              {formState.status === 'success' && (
                <p style={{
                  marginTop: 'var(--spacing-md)',
                  padding: 'var(--spacing-md)',
                  background: 'var(--color-success-bg)',
                  border: '1px solid var(--color-success)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-success-dark)',
                  textAlign: 'center'
                }}>
                  {formState.message}
                </p>
              )}

              {formState.status === 'error' && (
                <p style={{
                  marginTop: 'var(--spacing-md)',
                  padding: 'var(--spacing-md)',
                  background: 'var(--color-danger-bg)',
                  border: '1px solid var(--color-danger)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-danger-dark)',
                  textAlign: 'center'
                }}>
                  {formState.message}
                </p>
              )}
            </div>
          </section>
        </>
      )}

      {/* Back Button */}
      <div style={{
        textAlign: 'center',
        marginTop: 'var(--spacing-3xl)',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <button onClick={onGoBack} className="btn-back">
          ← Back to Questionnaire
        </button>
      </div>
    </div>
  );
};
