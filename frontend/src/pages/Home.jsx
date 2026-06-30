function Home() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">

      <div className="bg-white shadow-xl rounded-2xl w-[700px] p-10">

        <h1 className="text-4xl font-bold text-center text-blue-700">
          AI Blood Test Report Analyzer
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Upload your blood test report and receive an AI-powered medical analysis.
        </p>

        <div className="mt-10 border-2 border-dashed border-blue-300 rounded-xl p-12 text-center">

          <p className="text-gray-500 mb-6">
            Upload your Blood Test Report (PDF)
          </p>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition">
            Choose PDF
          </button>

        </div>

        <button className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg font-semibold transition">
          Analyze Report
        </button>

      </div>

    </div>
  );
}

export default Home;