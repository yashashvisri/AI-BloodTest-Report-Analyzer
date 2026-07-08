function SummaryCard({ summary }) {

  if (!summary) return null;

  return (

    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

      <h2 className="text-2xl font-bold text-blue-700 mb-4">

        🤖 AI Health Summary

      </h2>

      <div className="bg-slate-50 rounded-lg p-5">

        <p className="text-gray-700 whitespace-pre-wrap leading-7">

          {summary}

        </p>

      </div>

    </div>

  );

}

export default SummaryCard;