// components/WelcomeScreen.js
export default function WelcomeScreen({ onStart }) {
  return (
    <div className="text-center p-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-indigo-700 mb-4">Welcome to the MEMA Consultants FinProms Compliance Questionnaire</h2>
      <p className="text-md text-slate-700 mb-6">
        This tool will guide you through a series of questions based on FCA requirements from COBS 4, PERG 8, FG24/1, and PS23/13 to help assess the compliance of your financial promotions.
      </p>
      <button 
        onClick={onStart} 
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-150 ease-in-out">
        Start Questionnaire
      </button>
      <p className="text-xs text-slate-500 mt-8">
        <strong>Disclaimer:</strong> This questionnaire is not exhaustive and is not a substitute for professional legal or compliance advice.
      </p>
    </div>
  );
}
