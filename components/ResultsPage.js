import { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function ResultsPage({ results, onGoBack, questions, answers }) {
  const [isFullReportUnlocked, setIsFullReportUnlocked] = useState(false);
  // --- ADDED: State for the new 'Name' field ---
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadFirm, setLeadFirm] = useState('');
  const [formState, setFormState] = useState({ status: 'idle', message: '' });

  if (!results) {
    return <div className="app-container text-center">Calculating results...</div>;
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
          // --- ADDED: Include 'name' in the API request ---
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
  
  const doughnutOptions = {
      responsive: true, maintainAspectRatio: false, cutout: '70%',
      plugins: { legend: { display: false } }
  };
  const barOptions = {
      responsive: true, maintainAspectRatio: false, indexAxis: 'y',
      scales: { x: { stacked: true }, y: { stacked:true } },
      plugins: { title: { display: true, text: 'Responses by Section', font: {size: 16} }, legend: { position: 'top' } }
  };

  return (
    <div className="app-container">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Compliance Summary</h2>
      
      <div className="text-center p-6 bg-indigo-50 rounded-lg mb-10">
          <h3 className="text-2xl font-semibold text-indigo-700 mb-2">Overall Compliance Health</h3>
          <div className="w-full max-w-xs mx-auto h-48">
              <Doughnut data={{
                  labels: ['Compliant', 'Issues/Unanswered'],
                  datasets: [{ data: results.chartData.doughnut, backgroundColor: ['#10b981', '#ef4444'], borderWidth: 4 }]
              }} options={doughnutOptions} />
          </div>
          <p className="text-4xl font-bold mt-4 text-green-600">{results.healthScore}%</p>
      </div>

      {isFullReportUnlocked ? (
        <>
          <div className="mb-10">
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Full Report: Potential Failures</h3>
              {results.potentialFailures.length > 0 ? (
                  results.potentialFailures.map(failure => (
                    <div key={failure.id} className="potential-failure-item">
                        <p className="font-semibold text-slate-800">{failure.id}: {failure.question}</p>
                        {failure.notes && <p className="text-sm text-slate-600 mt-1"><em>Your Notes: {failure.notes}</em></p>}
                        <div className="mt-2 text-sm p-2 rounded bg-red-100 border border-red-200">
                            <strong className="text-red-800">Potential Implication: </strong>
                            <span className="text-slate-700">{failure.implication}</span>
                        </div>
                    </div>
                  ))
              ) : (
                  <p className="text-green-700 bg-green-100 p-4 rounded-md">No critical compliance issues were flagged in the full report.</p>
              )}
          </div>
          <div className="mb-10">
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Full Report: Detailed Breakdown</h3>
              <div className="chart-container" style={{height: '400px'}}><Bar data={results.chartData.bar} options={barOptions} /></div>
          </div>
          <div className="text-center">
            <button onClick={handleCsvExport} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg">
              Download Full Report as CSV
            </button>
          </div>
        </>
      ) : (
        <>
          <div id="export-contact-section" className="export-contact-form">
            <h3 className="text-xl font-bold text-indigo-700 mb-2 text-center">Unlock & Download Full Report</h3>
            <p className="text-slate-600 text-sm mb-4 text-center">Provide your details to view the full report and receive a copy by email.</p>
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              {/* --- ADDED: The new 'Name' input field --- */}
              <div>
                <label htmlFor="user-name" className="block text-sm font-medium text-slate-700">Full Name</label>
                <input id="user-name" type="text" name="name" placeholder="Jane Doe" required className="w-full p-2 border border-slate-300 rounded-md" value={leadName} onChange={(e) => setLeadName(e.target.value)} />
              </div>
              <div>
                <label htmlFor="user-firm" className="block text-sm font-medium text-slate-700">Firm Name</label>
                <input id="user-firm" type="text" name="firm" placeholder="Your Company Ltd" required className="w-full p-2 border border-slate-300 rounded-md" value={leadFirm} onChange={(e) => setLeadFirm(e.target.value)} />
              </div>
              <div>
                <label htmlFor="user-email" className="block text-sm font-medium text-slate-700">Email Address</label>
                <input id="user-email" type="email" name="email" placeholder="you@company.com" required className="w-full p-2 border border-slate-300 rounded-md" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} />
              </div>
              <div>
                <label htmlFor="user-phone" className="block text-sm font-medium text-slate-700">Contact Number (Optional)</label>
                <input id="user-phone" type="tel" name="phone" placeholder="07123 456789" className="w-full p-2 border border-slate-300 rounded-md" value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} />
              </div>
              <button type="submit" disabled={formState.status === 'loading'} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg">
                {formState.status === 'loading' ? 'Submitting...' : 'Unlock Full Report'}
              </button>
            </form>
            {formState.status === 'success' && <p className="text-green-600 text-center mt-2">{formState.message}</p>}
            {formState.status === 'error' && <p className="text-red-500 text-center mt-2">{formState.message}</p>}
          </div>
        </>
      )}
      <div className="text-center mt-8">
        <button onClick={onGoBack} className="bg-slate-500 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg">
            ← Back to Questionnaire
        </button>
      </div>
    </div>
  );
};
