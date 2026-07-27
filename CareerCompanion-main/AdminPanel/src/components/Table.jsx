export default function Table({ columns, data, onDelete }) {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-gray-800 uppercase text-xs font-semibold">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 sm:px-6 py-3">
                {col}
              </th>
            ))}
            <th className="px-4 sm:px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col} className="px-4 sm:px-6 py-3">
                    {item[col] || "—"}
                  </td>
                ))}
                <td className="px-4 sm:px-6 py-3 text-center">
                  <button
                    onClick={() => onDelete(item._id)}
                    className="bg-red-500 text-white px-3 sm:px-4 py-1 rounded-lg hover:bg-red-600 transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="text-center text-gray-500 py-6">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
