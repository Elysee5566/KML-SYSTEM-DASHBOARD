import { useMemo } from "react";
import { FaFileExcel } from "react-icons/fa";

export default function ClientFilters({
  search,
  setSearch,
  district,
  setDistrict,
  clients,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onAdd,
  onExport,
}: any) {
  // 🔥 Extract unique districts dynamically
  const districts = useMemo<string[]>(() => {
    const map = new Map<string, string>();

    clients?.forEach((c: any) => {
      if (c.district) {
        const lower = c.district.toLowerCase();

        // Store only one version (capitalized nicely)
        if (!map.has(lower)) {
          map.set(lower, lower.charAt(0).toUpperCase() + lower.slice(1));
        }
      }
    });

    return Array.from(map.values()).sort();
  }, [clients]);

  return (
    <div className="flex flex-col flex-wrap sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* LEFT */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="border p-2 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* DISTRICT FILTER */}
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="border p-2 rounded-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Districts</option>

          {districts.map((d: string) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded-lg"
        />
      </div>

      {/* BUTTON */}
      <div className="flex gap-2">
        <button
          onClick={onExport}
          className="border flex items-center gap-x-2 flex-row border-gray-300 bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          <FaFileExcel />
          Export
        </button>

        <button
          onClick={onAdd}
          className="bg-secondary text-white px-4 py-2 rounded-lg"
        >
          + New Client
        </button>
      </div>
    </div>
  );
}
