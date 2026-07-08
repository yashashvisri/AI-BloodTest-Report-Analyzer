const features = [
  {
    title: "OCR Extraction",
    icon: "📄",
    description:
      "Extract text accurately from scanned blood reports."
  },
  {
    title: "AI Analysis",
    icon: "🤖",
    description:
      "Google Gemini explains abnormal parameters."
  },
  {
    title: "Medical Dashboard",
    icon: "📊",
    description:
      "View blood parameters in a professional dashboard."
  }
];

function FeatureCards() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mt-10">

      {features.map((feature) => (

        <div
          key={feature.title}
          className="bg-white rounded-2xl shadow-lg p-8"
        >

          <div className="text-5xl">

            {feature.icon}

          </div>

          <h2 className="text-2xl font-bold mt-5">

            {feature.title}

          </h2>

          <p className="text-gray-500 mt-4">

            {feature.description}

          </p>

        </div>

      ))}

    </div>
  );
}

export default FeatureCards;