function ReportTable({ reports, onView }) {

  if (!reports || reports.length === 0) {

    return (

      <div className="bg-white rounded-xl shadow-lg p-6 mt-8 text-center">

        <p className="text-gray-500">

          No reports uploaded yet.

        </p>

      </div>

    );

  }

  return (

    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

      <h2 className="text-2xl font-bold text-blue-700 mb-6">

        Blood Report History

      </h2>

      <table className="w-full">

        <thead>

          <tr className="bg-blue-600 text-white">

            <th className="p-3">ID</th>

            <th className="p-3">Patient</th>

            <th className="p-3">Filename</th>

            <th className="p-3">Action</th>

          </tr>

        </thead>

        <tbody>

          {

            reports.map((report) => (

              <tr
                key={report.id}
                className="border-b hover:bg-slate-50"
              >

                <td className="p-3 text-center">

                  {report.id}

                </td>

                <td className="p-3 text-center">

                  {report.patient_name}

                </td>

                <td className="p-3 text-center">

                  {report.original_filename}

                </td>

                <td className="p-3 text-center">

                  <button

                    onClick={() => onView(report.id)}

                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"

                  >

                    View

                  </button>

                </td>

              </tr>

            ))

          }

        </tbody>

      </table>

    </div>

  );

}

export default ReportTable;