import { toast } from "react-toastify";
import {
  useGetResetRequestsQuery,
  useApproveResetRequestMutation,
  useRejectResetRequestMutation,
} from "../../api/usersApi";
import { loaderService } from "../../components/Loaders/loaderService";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Loader } from "lucide-react";
import React from "react";
import { FiGrid } from "react-icons/fi";

export default function ResetRequests() {
  const { data = [], isLoading } = useGetResetRequestsQuery();
  const [grid, setGrid] = React.useState(false);
  // console.log(data);
  const [approve, { isLoading: approveLoading }] =
    useApproveResetRequestMutation();
  const [reject, { isLoading: rejectLoading }] =
    useRejectResetRequestMutation();

  const handleApprove = async (id: number) => {
    loaderService.show();
    try {
      await approve(id).unwrap();
      toast.success("Approved successfully");
      loaderService.hide();
    } catch {
      toast.error("Failed to approve");
      loaderService.hide();
    }
  };

  const handleReject = async (id: number) => {
    try {
      loaderService.show();
      await reject(id).unwrap();
      toast.success("Rejected successfully");
      loaderService.hide();
    } catch {
      toast.error("Failed to reject");
      loaderService.hide();
    }
  };

  if (isLoading || approveLoading || rejectLoading) {
    loaderService.show();
    return <p>Loading...</p>;
  }
  loaderService.hide();

  return (
    <div className="p-6">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-semibold mb-6">Password Reset Requests</h2>
        <button
          onClick={() => setGrid(!grid)}
          className="bg-secondary text-white px-4 py-2 rounded-xl flex gap-2 items-center shadow"
        >
          <FiGrid />
        </button>
      </div>

      <div>
        {/* MOBILE CARDS */}
        {grid && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
            {data?.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-500 shadow">
                No Password Reset Requests
              </div>
            ) : (
              data.map((item: any) => (
                <div
                  key={item.id}
                  className="
            bg-white
            rounded-3xl
            border
            border-slate-200
            shadow-sm
            overflow-hidden
          "
                >
                  {/* Header */}
                  <div className="p-5 border-b border-slate-100">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-800">
                          Password Reset
                        </h3>

                        <p className="text-sm text-slate-500 break-all">
                          {item.email}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          item.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.status === "APPROVED"
                              ? "bg-blue-100 text-blue-700"
                              : item.status === "USED"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <p className="text-xs uppercase text-slate-400 mb-1">
                      Request Date
                    </p>

                    <p className="text-sm text-slate-700">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  {item.status === "PENDING" && (
                    <div className="border-t bg-slate-50 p-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="
                    flex-1
                    min-w-[120px]
                    flex
                    items-center
                    justify-center
                    gap-2
                    bg-indigo-600
                    text-white
                    py-2
                    rounded-xl
                  "
                        >
                          {approveLoading ? (
                            <Loader className="animate-spin" size={16} />
                          ) : (
                            <FaCheck />
                          )}
                          Approve
                        </button>

                        <button
                          onClick={() => handleReject(item.id)}
                          className="
                    flex-1
                    min-w-[120px]
                    flex
                    items-center
                    justify-center
                    gap-2
                    bg-red-600
                    text-white
                    py-2
                    rounded-xl
                  "
                        >
                          {rejectLoading ? (
                            <Loader className="animate-spin" size={16} />
                          ) : (
                            <FaTimes />
                          )}
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* DESKTOP TABLE */}
        {!grid && (
          <div className="w-[85vw] md:w-full bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-4">Email</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {data?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-8 text-gray-500">
                      No Password Reset Requests
                    </td>
                  </tr>
                ) : (
                  data.map((item: any) => (
                    <tr key={item.id} className="border-t hover:bg-slate-50">
                      <td className="p-4">{item.email}</td>

                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            item.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : item.status === "APPROVED"
                                ? "bg-blue-100 text-blue-700"
                                : item.status === "USED"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="p-4">
                        {new Date(item.created_at).toLocaleString()}
                      </td>

                      <td className="p-4">
                        {item.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="
                        bg-indigo-600
                        text-white
                        px-3
                        py-1
                        rounded
                        flex
                        items-center
                        gap-2
                      "
                            >
                              <FaCheck />
                              Approve
                            </button>

                            <button
                              onClick={() => handleReject(item.id)}
                              className="
                        bg-red-600
                        text-white
                        px-3
                        py-1
                        rounded
                        flex
                        items-center
                        gap-2
                      "
                            >
                              <FaTimes />
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
