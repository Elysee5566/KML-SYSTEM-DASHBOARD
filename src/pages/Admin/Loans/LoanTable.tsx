// import { useState, useMemo } from "react";
import { FaEdit, FaFileExcel } from "react-icons/fa";
import { FiEye, FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { formatCompactNumber } from "../../../components/formatCompactNumber";
import { toast } from "react-toastify";
// import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { url } from "../../../url";
// import { RedoDotIcon } from "lucide-react";

export default function LoanTable({
  loans,
  onSelect,
  onEdit,
  page,
  totalPages,
  onPageChange,

  search,
  setSearch,

  status,
  setStatus,

  fromDate,
  setFromDate,

  toDate,
  setToDate,
}: any) {
  const { role } = useSelector((state: RootState) => state.auth);

  // 💰 format currency (RWF)
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(value);

  const formatDate = (date: string) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "—";

  // 📥 EXPORT FUNCTION
  const handleExport = async () => {
    try {
      const params = new URLSearchParams();

      if (search) params.append("search", search);

      if (status && status !== "all") {
        params.append("status", status);
      }

      if (fromDate) {
        params.append("from_date", fromDate);
      }

      if (toDate) {
        params.append("to_date", toDate);
      }

      const response = await fetch(
        `${url}/api/loans/export/?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to export loans");
      }

      const blob = await response.blob();

      saveAs(blob, `Loans_${new Date().toISOString()}.xlsx`);
    } catch (error) {
      console.error(error);
      toast.error("Export failed");
    }
  };

  function StatusBadge({ status }: any) {
    const styles: any = {
      active: "bg-blue-100 text-blue-700",
      in_payment: "bg-yellow-100 text-yellow-700",
      overdue: "bg-red-100 text-red-700",
      defaulted: "bg-black text-white",
      paid: "bg-green-100 text-green-700",
      reloaned: "bg-purple-100 text-purple-700",
      to_be_reported: "bg-orange-600 text-white",
      reported: "bg-red-600 text-white",
    };

    const labels: any = {
      active: "Active",
      in_payment: "In Payment",
      overdue: "Overdue",
      defaulted: "Defaulted",
      paid: "Paid",
      reloaned: "reloaned",
      to_be_reported: "To Be Reported",
      reported: "Reported",
    };

    return (
      <span
        className={`px-3 py-1 text-xs rounded-full font-medium ${
          styles[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {labels[status] || status}
      </span>
    );
  }

  return (
    <div className="bg-white w-full flex flex-col rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* 🔍 Search + Filter */}
      <div className="p-4 flex flex-col xl:flex-row gap-4 justify-between border-b">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 w-full xl:max-w-md">
          <FiSearch className="text-gray-400 shrink-0" />

          <input
            className="w-full outline-none text-sm"
            placeholder="Search by client, loan type, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="in_payment">In Payment</option>
              <option value="overdue">Overdue</option>
              <option value="paid">Paid</option>
              <option value="defaulted">Defaulted</option>
              <option value="reloaned">Reloaned</option>
              <option value="to_be_reported">To Be Reported</option>
              <option value="reported">Reported</option>
            </select>
            {(role === "admin" || role === "manager") && (
              <button
                onClick={handleExport}
                className="
            bg-emerald-600
            text-white
            px-4
            py-2
            rounded-lg
            flex
            items-center
            justify-center
            gap-2
            hover:bg-emerald-700
            transition
            w-full
            sm:w-auto
          "
              >
                <FaFileExcel />
                Export
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Scroll Hint */}
      <div className="lg:hidden px-4 py-2 text-xs text-slate-500 bg-slate-50 border-b">
        ← Swipe horizontally to view all loan details →
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto w-full">
        <div className="">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="p-4 text-left whitespace-nowrap">#</th>
                <th className="p-4 text-left whitespace-nowrap">Client</th>
                <th className="p-4 text-left whitespace-nowrap">Loan Type</th>
                <th className="p-4 text-left whitespace-nowrap">Amount</th>
                <th className="p-4 text-left whitespace-nowrap">Interest</th>
                <th className="p-4 text-left whitespace-nowrap">Total</th>
                <th className="p-4 text-left whitespace-nowrap">Remaining</th>
                <th className="p-4 text-left whitespace-nowrap">Due Date</th>
                <th className="p-4 text-left whitespace-nowrap">Status</th>

                <th className=" bg-gray-50 p-4 text-center whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loans.length > 0 ? (
                loans.map((loan: any) => (
                  <tr
                    key={loan.id}
                    className={`border-t hover:bg-gray-50 transition ${loan.status == "reported" && "bg-red-50"} ${loan.status == "to_be_reported" && "bg-amber-500"}`}
                  >
                    <td className="p-4 font-medium text-gray-600 whitespace-nowrap">
                      #{loan.id}
                    </td>

                    <td className="p-4 font-medium text-gray-800 whitespace-nowrap">
                      {loan.client_names}
                    </td>

                    <td className="p-4 text-gray-600 whitespace-nowrap">
                      {loan.loan_type_name || "—"}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {formatCompactNumber(loan.loan_amount, true)}
                    </td>

                    <td className="p-4 text-gray-600 whitespace-nowrap">
                      {formatCurrency(loan.interest_amount)}
                    </td>

                    <td className="p-4 font-medium text-gray-800 whitespace-nowrap">
                      {formatCompactNumber(loan.total_repayment, true)}
                    </td>

                    <td className="p-4 text-red-500 font-semibold whitespace-nowrap">
                      {formatCompactNumber(loan.remaining_balance, true)}
                    </td>

                    <td className="p-4 text-gray-500 whitespace-nowrap">
                      {formatDate(loan.repayment_due_date)}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <StatusBadge status={loan.status} />
                    </td>

                    <td
                      className={` p-4 text-right whitespace-nowrap ${loan.status == "reported" && "bg-red-50"} ${loan.status == "to_be_reported" && "bg-amber-500"}`}
                    >
                      <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                        <button
                          onClick={() => onSelect(loan)}
                          className="
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    px-3
                    py-2
                    rounded-lg
                    flex
                    items-center
                    gap-2
                    transition
                  "
                        >
                          <FiEye />
                          <span className="font-medium">View</span>
                        </button>

                        {role === "admin" && (
                          <button
                            onClick={() => onEdit(loan)}
                            className="
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      px-3
                      py-2
                      rounded-lg
                      flex
                      items-center
                      gap-2
                      transition
                    "
                          >
                            <FaEdit />
                            <span className="font-medium">Edit</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="p-8 text-center text-sm text-gray-400"
                  >
                    No loans found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4 m-2">
            <button
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              className="px-7 py-2 border border-gray-400 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-gray-300 text-sm">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
              className="px-7 py-2 border border-gray-400 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
