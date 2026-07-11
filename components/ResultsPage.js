import { useState, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Image from 'next/image';
import { exportResultsToPDF } from '../lib/exportPdf';
import { getScenario } from '../lib/scenarios';
import { getRecommendation } from '../lib/recommendations';
import RecommendationCard from './RecommendationCard';
import { trackOwnedEvent } from '../lib/ownedAnalytics';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function ResultsPage({ results, onGoBack, questions, answers, scenario, isAuthenticated }) {
  // Get scenario config for tailored content
  const scenarioConfig = scenario ? getScenario(scenario) : null;
  const { t } = useTranslation('common');
  const [isFullReportUnlocked, setIsFullReportUnlocked] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadFirm, setLeadFirm] = useState('');
  const [formState, setFormState] = useState({ status: 'idle', message: '' });

  if (!results) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-light)'
      }}>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
          <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-text-muted)' }}>Calculating results...</p>
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
      trackOwnedEvent('lead_submitted', { flow: 'full_report_unlock' });
      setIsFullReportUnlocked(true);
    } catch (error) {
      setFormState({ status: 'error', message: error.message || 'Something went wrong. Please try again.' });
    }
  };

  const handleCsvExport = () => {
    const reportTitle = scenarioConfig?.reportTitle || 'Compliance Report';
    const channelLabel = scenarioConfig?.label || 'All Channels';

    let csvContent = "data:text/csv;charset=utf-8,";
    // Add report header with scenario info
    csvContent += `MEMA ${reportTitle}\r\n`;
    csvContent += `Generated: ${new Date().toLocaleDateString()}\r\n`;
    csvContent += `Channel: ${channelLabel}\r\n`;
    csvContent += `Health Score: ${results.healthScore}%\r\n`;
    csvContent += `\r\n`;
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
    // Use scenario-specific filename
    const filename = `mema_${scenario || 'full'}_compliance_report.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    trackOwnedEvent('download_completed', { format: 'csv', report: scenario || 'full' });
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePdfExport = async () => {
    try {
      await exportResultsToPDF(results, questions, answers, {
        firm: leadFirm,
        email: leadEmail,
      });
      trackOwnedEvent('download_completed', { format: 'pdf', report: scenario || 'full' });
    } catch (error) {
      console.error('PDF export failed:', error);
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

  // Build recommendations map for each failure
  const recommendationsMap = useMemo(() => {
    const map = {};
    if (!questions || !answers) return map;

    // Flatten questions from all sections
    questions.forEach(section => {
      section.items?.forEach(item => {
        const answer = answers[item.id]?.answer;
        if (answer) {
          const rec = getRecommendation(item.id, answer, item);
          if (rec) {
            map[item.id] = {
              recommendation: rec,
              fcaRef: item.ref
            };
          }
        }
      });
    });

    return map;
  }, [questions, answers]);

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
            marginBottom: 'var(--spacing-sm)'
          }}>
            {t('results.title')}
          </h1>
          {/* Scenario Badge */}
          {scenarioConfig && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: scenarioConfig.gradient,
              color: 'white',
              padding: '0.5rem 1.25rem',
              borderRadius: '2rem',
              fontSize: '0.95rem',
              fontWeight: 'var(--font-semibold)',
              marginBottom: 'var(--spacing-md)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              <span>{scenarioConfig.label} Assessment</span>
            </div>
          )}
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-2xl)',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            {t('results.subtitle')}
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
                <div className="score-value">{results.healthScore}%</div>
                <div className="score-label" title="Percentage of compliant answers vs. total questions answered">Health Score</div>
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
            <p style={{
              marginTop: 'var(--spacing-md)',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
              maxWidth: '400px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Your Health Score reflects the percentage of FCA compliance questions answered positively. A higher score indicates better alignment with regulatory requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Assessment Overview: Summary Cards */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--spacing-md)' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'var(--font-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--spacing-sm)',
          textAlign: 'center'
        }}>
          Assessment Overview
        </h2>
        <p style={{
          fontSize: '1rem',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--spacing-xl)',
          textAlign: 'center'
        }}>
          Summary of your compliance assessment results
        </p>

        <div className="summary-cards">
          <div className="summary-card">
            <Image src="/icons/sections/clipboard-check.svg" alt="" width={48} height={48} style={{ width: '3rem', height: '3rem', margin: '0 auto var(--spacing-md)' }} />
            <div className="summary-card-value">{totalQuestions}</div>
            <div className="summary-card-label">Total Questions</div>
            <div className="summary-card-desc">Questions answered in this assessment.</div>
          </div>

          <div className="summary-card">
            <Image src="/icons/actions/check-circle.svg" alt="" width={48} height={48} style={{ width: '3rem', height: '3rem', margin: '0 auto var(--spacing-md)' }} />
            <div className="summary-card-value" style={{ color: 'var(--color-success)' }}>{compliantAnswers}</div>
            <div className="summary-card-label">Compliant</div>
            <div className="summary-card-desc">Responses meeting FCA requirements.</div>
          </div>

          <div className="summary-card">
            <Image src="/icons/sections/warning-triangle.svg" alt="" width={48} height={48} style={{ width: '3rem', height: '3rem', margin: '0 auto var(--spacing-md)' }} />
            <div className="summary-card-value" style={{ color: issuesCount > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>{issuesCount}</div>
            <div className="summary-card-label">Needs Action</div>
            <div className="summary-card-desc">Items flagged for follow-up.</div>
          </div>

          <div className="summary-card">
            <Image src="/icons/actions/chart-bar.svg" alt="" width={48} height={48} style={{ width: '3rem', height: '3rem', margin: '0 auto var(--spacing-md)' }} />
            <div className="summary-card-value">{questions.length}</div>
            <div className="summary-card-label">Sections Reviewed</div>
            <div className="summary-card-desc">Checklist sections completed.</div>
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
          previewFailures.map(failure => (
            <div key={failure.id} className="risk-card risk-card-critical">
              <div className="risk-card-header">
                <Image src="/icons/sections/warning-triangle.svg" alt="" width={24} height={24} className="risk-card-icon" />
                <h4>Question {failure.id}: {failure.question}</h4>
              </div>
              {failure.notes && (
                <p style={{ fontSize: '0.9375rem', fontStyle: 'italic', marginBottom: 'var(--spacing-sm)' }}>
                  <strong>Your Notes:</strong> {failure.notes}
                </p>
              )}
              <div style={{
                padding: 'var(--spacing-md)',
                background: 'rgba(239, 68, 68, 0.05)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-danger)'
              }}>
                <strong style={{ color: 'var(--color-danger-dark)' }}>Potential Implication: </strong>
                <span>{failure.implication}</span>
              </div>
              {/* Actionable Recommendation */}
              {recommendationsMap[failure.id] && (
                <RecommendationCard
                  recommendation={recommendationsMap[failure.id].recommendation}
                  questionId={failure.id}
                  question={failure.question}
                  fcaRef={recommendationsMap[failure.id].fcaRef}
                />
              )}
            </div>
          ))
        ) : (
          <div className="card" style={{
            background: 'var(--color-success-bg)',
            border: '2px solid var(--color-success)',
            textAlign: 'center'
          }}>
            <Image src="/icons/actions/check-circle.svg" alt="" width={48} height={48} style={{ width: '3rem', height: '3rem', margin: '0 auto var(--spacing-md)' }} />
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
                    <Image src="/icons/sections/warning-triangle.svg" alt="" width={24} height={24} className="risk-card-icon" />
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
                  {/* Actionable Recommendation */}
                  {recommendationsMap[failure.id] && (
                    <RecommendationCard
                      recommendation={recommendationsMap[failure.id].recommendation}
                      questionId={failure.id}
                      question={failure.question}
                      fcaRef={recommendationsMap[failure.id].fcaRef}
                    />
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Download Report Section */}
          <section style={{ maxWidth: '800px', margin: 'var(--spacing-3xl) auto 0', padding: '0 var(--spacing-md)' }}>
            <div className="card card-lg" style={{
              textAlign: 'center',
              background: 'var(--color-panel)',
              border: '1px solid var(--color-border-light)'
            }}>
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-md)'
              }}>
                {t('results.downloadCardTitle')}
              </h2>
              <p style={{
                fontSize: '1.125rem',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-xl)'
              }}>
                {t('results.downloadCardCopy')}
              </p>
              <div className="report-action-group" style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 'var(--spacing-md)'
              }}>
                <button
                  onClick={handleCsvExport}
                  className="report-action-button"
                >
                  {t('buttons.downloadCsv')}
                </button>

                <button
                  onClick={handlePdfExport}
                  className="report-action-button"
                >
                  {t('buttons.downloadPdf')}
                </button>

                <button
                  onClick={handlePrint}
                  className="report-action-button"
                >
                  {t('buttons.printReport')}
                </button>
              </div>
              {!isAuthenticated && (
                <p className="report-save-note">
                  Sign in to save this assessment to your dashboard.
                </p>
              )}
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
                  {formState.status === 'loading' ? 'Submitting...' : `🔓 ${t('buttons.unlockReport')}`}
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
