function Hero() {
  return (
    <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl text-white p-12 shadow-xl">

      <h1 className="text-5xl font-extrabold mb-5">

        🩸 AI Blood Test Report Analyzer

      </h1>

      <p className="text-xl opacity-90 max-w-3xl leading-8">

        Upload your blood test report and receive an
        AI-powered medical analysis within seconds.

      </p>

      <div className="flex gap-4 mt-10 flex-wrap">

        <div className="bg-white/20 px-5 py-3 rounded-full">

          📄 OCR Extraction

        </div>

        <div className="bg-white/20 px-5 py-3 rounded-full">

          🤖 Gemini AI

        </div>

        <div className="bg-white/20 px-5 py-3 rounded-full">

          📊 Health Insights

        </div>

        <div className="bg-white/20 px-5 py-3 rounded-full">

          ⚡ Instant Analysis

        </div>

      </div>

    </div>
  );
}

export default Hero;