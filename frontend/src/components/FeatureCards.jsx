import { useState } from "react";

const features = [
  {
    id: 1,
    title: "AI Medical Summary",
    icon: "\uD83D\uDD2C",
    color: "bg-emerald-500/15",
    description: "Gemini AI analyzes abnormal parameters and explains their clinical significance.",
    details: "Your extracted data is securely sent to Google's Gemini AI, which maps results against standard medical ranges to instantly spot deficiencies and provide clear explanations."
  },
  {
    id: 2,
    title: "Diet & Lifestyle Plan",
    icon: "\uD83E\uDD57",
    color: "bg-teal-500/15",
    description: "Personalized 7-day meal plans with PDF export for your specific needs.",
    details: "Based on your blood deficiencies, our AI generates a tailored nutrition and workout plan to help correct abnormal values naturally."
  },
  {
    id: 3,
    title: "Chat with Report",
    icon: "\uD83D\uDCAC",
    color: "bg-cyan-500/15",
    description: "Ask questions about your report and get AI-powered contextual answers.",
    details: "Our RAG chatbot grounds its answers in your actual blood report data. Ask anything like 'Why is my Vitamin D low?' and get accurate, personalized responses."
  }
];

function FeatureCards() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="grid md:grid-cols-3 gap-4 mt-8">
      {features.map((feature) => (
        <div
          key={feature.id}
          onClick={() => setExpandedId(expandedId === feature.id ? null : feature.id)}
          className={`glass-card rounded-2xl p-6 cursor-pointer ${
            expandedId === feature.id ? "!border-emerald-500/30 !bg-white/8" : ""
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center text-xl`}>
              {feature.icon}
            </div>
            <h3 className="font-bold text-white text-sm">{feature.title}</h3>
          </div>
          <p className="text-white/40 text-xs leading-relaxed">{feature.description}</p>

          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
            expandedId === feature.id ? "max-h-48 opacity-100 mt-4 pt-4 border-t border-white/10" : "max-h-0 opacity-0"
          }`}>
            <p className="text-emerald-300/80 text-xs font-medium leading-relaxed">{feature.details}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeatureCards;
