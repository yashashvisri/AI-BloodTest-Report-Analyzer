import React from "react";

export default function AnalysisProgressBar({ progress, currentStep, message }) {
  const steps = [
    { id: "ocr", label: "OCR Extraction", targetProgress: 25, icon: "📄" },
    { id: "parsing", label: "Biomarker Mapping", targetProgress: 50, icon: "🔬" },
    { id: "gemini_ai", label: "Gemini AI Reasoning", targetProgress: 75, icon: "🧠" },
    { id: "completed", label: "Dashboard Ready", targetProgress: 100, icon: "✨" }
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 shadow-xl my-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Real-Time Analysis Stream
          </span>
        </div>
        <span className="text-sm font-black text-white">{progress}%</span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
        <div
          className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500 ease-out shadow-lg shadow-emerald-500/30"
          style={{ width: `${Math.max(progress, 5)}%` }}
        ></div>
      </div>

      {/* Live Message */}
      <p className="text-sm font-medium text-slate-300 mt-4 flex items-center gap-2">
        <span className="inline-block animate-spin text-base">⏳</span>
        {message || "Processing document..."}
      </p>

      {/* Milestone Checkpoints */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/5">
        {steps.map((st) => {
          const isDone = progress >= st.targetProgress;
          const isActive = currentStep === st.id;
          return (
            <div
              key={st.id}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                isDone
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : isActive
                  ? "bg-blue-500/10 border-blue-500/30 text-cyan-300 animate-pulse"
                  : "bg-white/5 border-white/5 text-slate-500"
              }`}
            >
              <span>{st.icon}</span>
              <span className="truncate">{st.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
