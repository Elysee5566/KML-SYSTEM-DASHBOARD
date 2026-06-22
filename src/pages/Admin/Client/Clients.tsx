import { useState, useEffect } from "react";
import { useGetClientsQuery } from "../../../api/clientApi";

import ClientStats from "./ClientStats";
import ClientFilters from "./ClientFilters";
import ClientTable from "./ClientTable";
import ClientDrawer from "./ClientDrawer";
import { FiGrid } from "react-icons/fi";
import { url } from "../../../url";
import { loaderService } from "../../../components/Loaders/loaderService";
export default function Clients() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [grid, setGrid] = useState(false);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);

  const {
    data: clientsData = [],
    isLoading,
    refetch,
  } = useGetClientsQuery({
    page,
    page_size: 100,
    search,
    district,
    start_date: startDate,
    end_date: endDate,
  });
  const clients = Array.isArray(clientsData)
    ? clientsData
    : clientsData?.results || [];
  useEffect(() => {
    refetch();
  }, []);
  // console.log(clients);
  const totalPages = clientsData?.total_pages || 1;
  const handleExport = async () => {
    try {
      loaderService.show();
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (district) params.append("district", district);
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const token = localStorage.getItem("access");

      const response = await fetch(
        `${url}/api/clients/export/?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      loaderService.hide();

      if (!response.ok) {
        loaderService.hide();
        throw new Error("Export failed");
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `clients_${new Date().toISOString().split("T")[0]}.xlsx`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
      loaderService.hide();
      alert("Failed to export clients");
    }
  };
  console.log("DATES:", {
    startDate,
    endDate,
  });
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* STATS */}
      <ClientStats clients={clients} />

      {/* FILTERS */}
      {/* <ClientFilters
        search={search}
        setSearch={setSearch}
        onAdd={() => {
          setSelected(null)
          setOpen(true)
        }}
      /> */}
      <ClientFilters
        search={search}
        setSearch={setSearch}
        district={district}
        setDistrict={setDistrict}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        clients={clients}
        onExport={handleExport}
        onAdd={() => {
          setSelected(null);
          setOpen(true);
        }}
      />
      <button
        onClick={() => setGrid(!grid)}
        className="bg-secondary text-white px-4 py-2 rounded-xl flex gap-2 items-center shadow"
      >
        <FiGrid />
      </button>

      {/* <ClientTable clients={filteredClients} /> */}

      {/* TABLE */}

      <ClientTable
        clients={clients}
        isLoading={isLoading}
        onEdit={(c: any) => {
          setSelected(c);
          setOpen(true);
        }}
        grid={grid}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* DRAWER */}
      <ClientDrawer
        open={open}
        onClose={() => setOpen(false)}
        client={selected}
      />
    </div>
  );
}
