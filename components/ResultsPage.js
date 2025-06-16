import { useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ResultsPage = ({ results, onGoBack }) => {
    const [leadEmail, setLeadEmail] = useState('');
    const [leadPhone, setLeadPhone] = useState('');
    const [formState, setFormState] = useState({ status: 'idle', message: '' }); // idle, loading, success, error

    if (!results) {
        return <div>Loading results...</div>;
    }

    const { potentialFailures, healthScore, chartData } = results;

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { legend: { display: false } }
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: { x: { stacked: true }, y: { stacked: true } },
        plugins: { 
            title: { display: true, text: 'Responses by Section' },
            legend: { position: 'top' } 
        }
    };
    
    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        setFormState({ status: 'loading', message: '' });
        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: leadEmail, phone: leadPhone }),
            });
            if (!response.ok) {
                throw new Error('Submission failed');
            }
            const data = await response.json();
            setFormState({ status: 'success', message: 'Thank you! We will be in touch shortly.' });
        } catch (error) {
            setFormState({ status: 'error', message: 'Something went wrong. Please try again.' });
        }
    };

    return (
        <div className="app-container">
            <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Compliance Summary</h2>
            
            {/* Health Score Doughnut Chart */}
            <div className="text-center p-6 bg-indigo-50 rounded-lg">
                <h3 className="text-2xl font-semibold text-indigo-700 mb-2">Overall Compliance Health</h3>
                <div id="overall-health-chart-container">
                    <Doughnut data={{
                        labels: ['Compliant', 'Issues/Unanswered'],
                        datasets: [{ data: chartData.doughnut, backgroundColor: ['#10b981', '#ef4444'], borderWidth: 4 }]
                    }} options={doughnutOptions} />
                </div>
                <p className="text-4xl font-bold mt-4 text-green-600">{healthScore}%</p>
            </div>

            {/* Potential Failures List */}
            <div className="mt-10">
                <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Potential Failures Identified</h3>
                {potentialFailures.length > 0 ? (
                    potentialFailures.map(failure => (
                        <div key={failure.id} className="potential-failure-item">
                            <p className="font-semibold text-slate-800">{failure.id}: {failure.question}</p>
                            <div className="mt-2 text-sm p-2 rounded bg-red-100 border border-red-200">
                                <strong className="text-red-800">Potential Implication: </strong>
                                <span className="text-slate-700">{failure.implication}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-green-700 bg-green-100 p-4 rounded-md">No critical compliance issues were flagged based on your answers.</p>
                )}
            </div>
            
            {/* Section Breakdown Bar Chart */}
             <div className="mt-10">
                <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Detailed Breakdown</h3>
                <div className="chart-container">
                    <Bar data={chartData.bar} options={barOptions} />
                </div>
            </div>

            {/* Lead Capture Form */}
            <div id="export-contact-section" className="export-contact-form">
                {formState.status !== 'success' ? (
                    <>
                        <h3 className="text-xl font-bold text-indigo-700 mb-2 text-center">Request a Full Report</h3>
                        <p className="text-slate-600 text-sm mb-4 text-center">Provide your details and our team will contact you with a full analysis.</p>
                        <form onSubmit={handleLeadSubmit}>
                             {/* ... form inputs and button ... */}
                        </form>
                    </>
                ) : (
                    <p className="text-center text-lg font-semibold text-green-700">{formState.message}</p>
                )}
            </div>

            <div className="text-center mt-8">
                <button onClick={onGoBack} className="bg-slate-500 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg">
                    ← Back to Questionnaire
                </button>
            </div>
        </div>
    );
};

export default ResultsPage;
