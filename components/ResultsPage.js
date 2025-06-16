// components/ResultsPage.js
import { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function ResultsPage({ answers, questions, onRestart }) {
  const [contactDetails, setContactDetails] = useState({ email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');

  // --- Memoized Analysis ---
  // useMemo prevents re-calculating this on every render unless answers/questions change
  const analysis = useMemo(() => {
    let potentialFailures = [];
    let sectionScores = {};
    let totalAnswered = 0;
    let totalCompliant = 0;

    questions.forEach(q => {
      const answer = answers[q.id];
      if (answer === undefined || answer === null || answer === '') return;

      totalAnswered++;
      let isCompliant = true;
      let implicationText = '';

      if (q.type === 'yesno' && answer === 'No' && q.complianceImplicationIfNo) {
        isCompliant = false;
        implicationText = q.complianceImplicationIfNo;
      }
      
      const complianceSelected = q.complianceImplicationIfSelected ? JSON.parse(q.complianceImplicationIfSelected) : {};
      if (q.type === 'dropdown' && complianceSelected[answer]) {
        isCompliant = false;
        implicationText = complianceSelected[answer];
      }
      
      if(q.type === 'multiselect' && Array.isArray(answer)) {
          answer.forEach(sel => {
              if(complianceSelected[sel]) {
                  isCompliant = false;
                  implicationText = (implicationText ? implicationText + '; ' : '') + complianceSelected[sel];
              }
          });
      }

      if (isCompliant) {
        totalCompliant++;
      } else {
        potentialFailures.push({ ...q, implicationText, userAnswer: answer });
      }

      // Track section scores for the bar chart
      if (!sectionScores[q.sectionTitle]) {
        sectionScores[q.sectionTitle] = { compliant: 0, nonCompliant: 0 };
      }
      if (isCompliant) {
        sectionScores[q.sectionTitle].compliant++;
      } else {
        sectionScores[q.sectionTitle].nonCompliant++;
      }
    });

    const healthScore = totalAnswered > 0 ? Math.round((totalCompliant / totalAnswered) * 100) : 100;

    return { potentialFailures, sectionScores, healthScore };
  }, [answers, questions]);

  // --- Form Handling ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionMessage('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactDetails),
      });

      if (!response.ok) {
        throw new Error('Server responded with an error.');
      }
      
      setSubmissionMessage('Success! Your details have been sent.');
      // You could also trigger a CSV download here if desired
    } catch (error) {
      setSubmissionMessage('Error: Could not submit details. Please try again.');
      console.error("Failed to submit lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Chart Data ---
  const doughnutData = {
    labels: ['Compliant Aspects (%)', 'Potential Issues (%)'],
    datasets: [{
      data: [analysis.healthScore, 100 - analysis.healthScore],
      backgroundColor: [
        analysis.healthScore >= 90 ? '#10b981' : analysis.healthScore >= 60 ? '#f59e0b' : '#ef4444',
        '#e2e8f0'
      ],
      borderColor: '#ffffff',
      borderWidth: 4,
    }],
  };
  
  const barData = {
    labels: Object.keys(analysis.sectionScores),
    datasets: [
      {
        label: 'Compliant Answers',
        data: Object.values(analysis.sectionScores).map(s => s.compliant),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'Potential Issues',
        data: Object.values(analysis.sectionScores).map(s => s.nonCompliant),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
    ],
  };

  return (
    <div className="results-section">
      <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-6 text-center">Compliance Questionnaire Summary</h2>

      <div className="mt-10 p-6 border-t-4 border-indigo-600 bg-indigo-50 rounded-lg shadow-xl text-center">
        <h3 className="text-2xl font-semibold text-indigo-700 mb-2">Overall Compliance Health</h3>
        <div id="overall-health-chart-container">
          <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, cutout: '70%' }} />
        </div>
        <p className={`text-4xl font-bold mt-4 ${analysis.healthScore < 60 ? 'text-red-600' : 'text-green-600'}`}>{analysis.healthScore}%</p>
      </div>

      {analysis.potentialFailures.length > 0 && (
        <div className="mt-10 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Potential Issues Identified</h3>
            {analysis.potentialFailures.map(failure => (
                 <div key={failure.id} className="potential-failure-item">
                    <p className="font-medium text-slate-700">{failure.id}: {failure.questionText}</p>
                    <div className="mt-2 text-xs p-2 rounded bg-red-50 border border-red-200">
                        <strong className="text-red-800">Potential Implication:</strong> 
                        <span className="text-slate-700"> {failure.implicationText}</span>
                    </div>
                </div>
            ))}
        </div>
      )}

      <div id="export-contact-section" className="export-contact-form">
          <h3 className="text-xl font-bold text-indigo-700 mb-2 text-center">Get Your Full Report</h3>
          <p className="text-slate-600 text-sm mb-4 text-center">To receive a full report and discuss your results, please provide your details below. Our team will be in touch.</p>
          <form onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                  <input type="email" name="email" placeholder="you@company.com" required value={contactDetails.email} onChange={handleInputChange} />
                  <input type="tel" name="phone" placeholder="07123 456789" required value={contactDetails.phone} onChange={handleInputChange} />
                  <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Details'}</button>
              </div>
              {submissionMessage && <p className="text-center mt-4 text-sm">{submissionMessage}</p>}
          </form>
      </div>

      <div className="chart-container">
          <Bar options={{ responsive: true, scales: { x: { stacked: true }, y: { stacked: true } }, plugins: { title: { display: true, text: 'Breakdown by Section' } } }} data={barData} />
      </div>

      <div className="results-nav text-center mt-8">
        <button onClick={onRestart} className="bg-slate-500 hover:bg-slate-600">
            ← Back to Start
        </button>
      </div>
    </div>
  );
}
