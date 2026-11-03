import React from "react";

export default function CriticalAlertBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-rose-950/80 via-red-900/60 to-rose-950/80 border-2 border-rose-500/50 rounded-2xl p-6 shadow-2xl shadow-rose-950/50 mb-8 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-2xl shrink-0">
          🚨
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-rose-500 text-white font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Urgent Clinical Alert
            </span>
            <span className="text-rose-200 text-xs font-semibold">
              {alerts.length} critical value{alerts.length > 1 ? "s" : ""} detected
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Immediate Medical Attention Advised
          </h3>
          <p className="text-rose-200/80 text-xs mt-1 leading-relaxed">
            One or more laboratory biomarkers deviate significantly from safe clinical thresholds. Please share these findings with a licensed healthcare practitioner immediately.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {alerts.map((al, idx) => (
              <div
                key={idx}
                className="bg-black/30 border border-rose-500/30 rounded-xl p-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{al.parameter}</span>
                    <span className="bg-rose-500/30 text-rose-300 font-extrabold text-xs px-2 py-0.5 rounded-md">
                      {al.value}
                    </span>
                  </div>
                  <p className="text-rose-300/90 text-xs font-medium mt-1">
                    {al.condition}
                  </p>
                </div>
                <p className="text-white/40 text-[11px] mt-2 pt-2 border-t border-rose-500/20">
                  {al.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
