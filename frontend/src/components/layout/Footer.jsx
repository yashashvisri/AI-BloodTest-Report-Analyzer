function Footer() {
  return (
    <footer className="border-t border-white/5 mt-16">
      <div className="max-w-7xl mx-auto px-8 py-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white font-black text-xs">AI</span>
          </div>
          <span className="text-lg font-bold text-white/80 tracking-tight">
            BloodTest <span className="text-emerald-400">Analyzer</span>
          </span>
        </div>
        <p className="text-white/30 text-sm">
          AI-powered blood report analysis using OCR, FastAPI, React and Google Gemini.
        </p>
        <p className="mt-4 text-xs text-white/15">
          Built with {String.fromCodePoint(0x2764, 0xFE0F)} by Yashashvi Srivastava
        </p>
      </div>
    </footer>
  );
}

export default Footer;
