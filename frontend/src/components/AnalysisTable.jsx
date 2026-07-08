import StatusBadge from "./StatusBadge";

function AnalysisTable({ analysis }) {

  if (!analysis) return null;

  return (

    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

      <h2 className="text-2xl font-bold text-blue-700 mb-6">

        Blood Parameter Analysis

      </h2>

      <table className="w-full border-collapse">

        <thead>

          <tr className="bg-blue-600 text-white">

            <th className="p-3 text-left">

              Parameter

            </th>

            <th className="p-3 text-center">

              Value

            </th>

            <th className="p-3 text-center">

              Reference Range

            </th>

            <th className="p-3 text-center">

              Status

            </th>

          </tr>

        </thead>

        <tbody>

          {

            Object.entries(analysis).map(([parameter, details]) => (

              <tr
                key={parameter}
                className="border-b hover:bg-slate-50"
              >

                <td className="p-3 font-semibold capitalize">

                  {parameter.replace("_", " ")}

                </td>

                <td className="p-3 text-center">

                  {

                    details.value !== null

                      ? details.value

                      : "--"

                  }

                </td>

                <td className="p-3 text-center">

                  {

                    details.reference_range || "--"

                  }

                </td>

                <td className="p-3 text-center">

                  <StatusBadge
                    status={details.status}
                  />

                </td>

              </tr>

            ))

          }

        </tbody>

      </table>

    </div>

  );

}

export default AnalysisTable;