import { useState } from "react";

const features = [
  {
    id: 1,
    title: "OCR Extraction",
    icon: "📄",
    description: "Extract text accurately from scanned blood reports.",
    details: "We use advanced PDF parsing and Optical Character Recognition to safely read and extract medical data directly from your documents."
  },
  {
    id: 2,
    title: "AI Analysis",
    icon: "🤖",
    description: "Google Gemini explains abnormal parameters.",
    details: "Your extracted data is securely sent to Google's Gemini AI, which maps your results against standard medical ranges to instantly spot deficiencies."
  },
  {
    id: 3,
    title: "Medical Dashboard",
    icon: "📊",
    description: "View blood parameters in a professional dashboard.",
    details: "Get a clear, visual summary of your health. Critical alerts are highlighted automatically so you know exactly what to discuss with your doctor."
  }
];

function FeatureCards() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-10">
      {features.map((feature) => (
        <div
          key={feature.id}
          onClick={() => setExpandedId(expandedId === feature.id ? null : feature.id)}
          className={`bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border ${
            expandedId === feature.id 
              ? "border-emerald-400 ring-4 ring-emerald-50" 
              : "border-gray-100 hover:border-emerald-200"
          } p-8 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 relative`}
        >
          <div className="flex justify-between items-start">
            <div className="text-5xl drop-shadow-sm">{feature.icon}</div>
            
            {/* Expand / Collapse Icon */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 transition-transform duration-300 ${expandedId === feature.id ? "rotate-180 bg-emerald-100 text-emerald-600" : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-extrabold mt-6 text-gray-800">
            {feature.title}
          </h2>
          
          <p className="text-gray-500 mt-3 font-medium">
            {feature.description}
          </p>

          {/* Hidden Extra Info Area */}
          <div 
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              expandedId === feature.id 
                ? "max-h-48 opacity-100 mt-5 pt-5 border-t border-gray-100" 
                : "max-h-0 opacity-0"
            }`}
          >
            <p className="text-emerald-800 text-sm font-medium leading-relaxed bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              {feature.details}
            </p>
          </div>
          
          {/* Subtle "Click for more" hint if not expanded */}
          <div className={`absolute bottom-4 right-6 text-xs font-bold text-gray-300 transition-opacity ${expandedId === feature.id ? "opacity-0" : "opacity-100"}`}>
            CLICK TO EXPAND
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeatureCards;