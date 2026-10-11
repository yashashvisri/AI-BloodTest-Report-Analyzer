function Hero() {
  return (
    <div className="gradient-bg rounded-3xl p-10 mb-8 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute top-8 right-16 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl float"></div>
      <div className="absolute bottom-4 left-8 w-56 h-56 rounded-full bg-teal-400/8 blur-3xl" style={{animation: "float 4s ease-in-out infinite 1s"}}></div>
      <div className="absolute top-1/2 right-1/3 w-2 h-2 rounded-full bg-emerald-400/60 float"></div>
      <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-teal-300/50" style={{animation: "float 2.5s ease-in-out infinite 0.5s"}}></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="glow-dot"></div>
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">AI-Powered Medical Analysis</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
          Blood Test<br/>
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Report Analyzer</span>
        </h1>
        <p className="text-white/60 text-base max-w-lg leading-relaxed">
          Upload your blood test PDF and receive an instant AI-powered medical analysis with personalized health insights.
        </p>
        <div className="flex flex-wrap gap-2 mt-6">
          <span className="glass text-xs text-emerald-300 font-semibold px-3 py-1.5 rounded-full">{"\uD83D\uDCC4"} OCR Extraction</span>
          <span className="glass text-xs text-teal-300 font-semibold px-3 py-1.5 rounded-full">{"\uD83E\uDDE0"} Gemini AI</span>
          <span className="glass text-xs text-cyan-300 font-semibold px-3 py-1.5 rounded-full">{"\uD83D\uDEE1\uFE0F"} Risk Score</span>
          <span className="glass text-xs text-blue-300 font-semibold px-3 py-1.5 rounded-full">{"\uD83D\uDCCA"} Trends</span>
        </div>
      </div>
    </div>
  );
}

export default Hero;
