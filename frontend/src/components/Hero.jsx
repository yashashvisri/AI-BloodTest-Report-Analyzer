function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-700 rounded-[2rem] text-white p-12 shadow-2xl mb-8 border border-white/10">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-blue-500 blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-indigo-500 blur-3xl opacity-30"></div>

      <div className="relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
          AI Blood Test <br/>
          <span className="text-blue-300">Report Analyzer</span>
        </h1>

        <p className="text-xl md:text-2xl text-blue-100 max-w-2xl leading-relaxed mb-10 font-light">
          Upload your blood test report and receive an AI-powered, human-friendly medical analysis within seconds.
        </p>

        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 text-sm font-medium shadow-sm hover:bg-white/20 transition-all cursor-default">
            <span>📄</span> OCR Extraction
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 text-sm font-medium shadow-sm hover:bg-white/20 transition-all cursor-default">
            <span>🧠</span> Gemini AI
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 text-sm font-medium shadow-sm hover:bg-white/20 transition-all cursor-default">
            <span>⚕️</span> Health Insights
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 text-sm font-medium shadow-sm hover:bg-white/20 transition-all cursor-default">
            <span>⚡</span> Instant Analysis
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;