function ReportTable({
  reports,
  onView,
  onDelete,
  deletingId,
}) {

  return (

    <div
      className="
        bg-white
        rounded-2xl
        shadow-lg
        overflow-hidden
      "
    >

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="bg-blue-700 text-white">

              <th className="px-6 py-4 text-left">
                ID
              </th>

              <th className="px-6 py-4 text-left">
                Patient
              </th>

              <th className="px-6 py-4 text-left">
                File
              </th>

              <th className="px-6 py-4 text-center">
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {reports.map((report) => (

              <tr
                key={report.id}
                className="
                  border-b
                  hover:bg-slate-50
                "
              >

                <td className="px-6 py-4 font-semibold">
                  #{report.id}
                </td>


                <td className="px-6 py-4">
                  {report.patient_name}
                </td>


                <td
                  className="
                    px-6
                    py-4
                    text-gray-600
                    max-w-xs
                    truncate
                  "
                >
                  {report.original_filename}
                </td>


                <td className="px-6 py-4">

                  <div
                    className="
                      flex
                      justify-center
                      gap-3
                    "
                  >

                    {/* View */}

                    <button
                      onClick={() =>
                        onView(report.id)
                      }
                      className="
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        font-semibold
                      "
                    >
                      View
                    </button>


                    {/* Delete */}

                    <button
                      onClick={() =>
                        onDelete(report.id)
                      }
                      disabled={
                        deletingId === report.id
                      }
                      className="
                        bg-red-600
                        hover:bg-red-700
                        disabled:bg-gray-400
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        font-semibold
                      "
                    >

                      {deletingId === report.id
                        ? "Deleting..."
                        : "Delete"
                      }

                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}


export default ReportTable;