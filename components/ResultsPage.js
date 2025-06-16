// components/ResultsPage.js
export default function ResultsPage({ onRestart }) {
  return (
    <div className="text-center p-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-indigo-700 mb-4">Questionnaire Complete!</h2>
      <p className="text-md text-slate-700 mb-6">
        Thank you for completing the questionnaire. The results analysis and contact form will be built in the next step.
      </p>
      <button 
        onClick={onRestart}
        className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition">
        Restart Questionnaire
      </button>
    </div>
  );
}
