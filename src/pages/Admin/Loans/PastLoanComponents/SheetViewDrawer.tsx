import { useState } from "react";

import { X, Loader2, Search } from "lucide-react";
import { useGetPastLoanSheetDataQuery } from "../../../../api/pastloans";

export default function SheetViewerDrawer({ sheetId, onClose }: any) {
  const { data, isLoading } = useGetPastLoanSheetDataQuery(sheetId);

  const [search, setSearch] = useState("");

  if (!sheetId) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/30 flex justify-end">
        <div className="w-full md:w-[70%] bg-white p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>
    );
  }

  const { sheet, columns, data: rows } = data;

  const filtered = rows.filter((row: any) =>
    Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      {/* DRAWER */}
      <div className="w-full md:w-[80%] h-full bg-white shadow-xl flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-xl font-bold">{sheet.title}</h2>

            <p className="text-sm text-gray-500">{sheet.row_count} records</p>
          </div>

          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 border rounded-2xl px-4 py-2">
            <Search className="w-4 h-4 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search borrower..."
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-sm min-w-175">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col: string) => (
                  <th key={col} className="text-left p-3">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((row: any, idx: number) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  {columns.map((col: string) => (
                    <td key={col} className="p-3 whitespace-nowrap">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
