import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetPublicApplicationsQuery,
  useReviewPublicApplicationMutation,
  useConvertPublicApplicationMutation,
  useRejectPublicApplicationMutation,
} from "../../api/loanapplication";
import { toast } from "react-toastify";
// import { url } from "../../url";
import { loaderService } from "../../components/Loaders/loaderService";
import {
  FaUser,
  FaHome,
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaFilePdf,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  FiGrid,
  FiClock,
  FiEye,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

export default function PublicApplicationsDashboard() {
  const role = useSelector((state: any) => state.auth.role);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "reviewed" | "approved" | "rejected"
  >("pending");
  const {
    data: PublicApplicationData,
    isLoading,
    isError,
  } = useGetPublicApplicationsQuery<any>(
    { page, page_size: 25, status: activeTab },
    { refetchOnMountOrArgChange: true },
  );
  console.log(PublicApplicationData);

  const data = Array.isArray(PublicApplicationData)
    ? PublicApplicationData
    : PublicApplicationData?.results || [];
  // console.log(data);
  const [review] = useReviewPublicApplicationMutation();
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    name: string;
  } | null>(null);

  const [convertPublicApplication, { isLoading: converting }] =
    useConvertPublicApplicationMutation();
  const [reject] = useRejectPublicApplicationMutation();
  const [grid, setGrid] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showConvertModal, setShowConvertModal] = useState(false);

  const [linkExisting, setLinkExisting] = useState(false);
  // Filtering applications based on status

  const totalPages = PublicApplicationData?.total_pages || 1;

  // const paginatedApplications = filteredApplications.slice(
  //   (currentPage - 1) * pageSize,
  //   currentPage * pageSize,
  // );
  const summary = PublicApplicationData?.summary;
  const tabs = [
    {
      key: "all",
      label: "All",
      icon: FiGrid,
      count: summary?.total ?? 0,
    },
    {
      key: "pending",
      label: "Pending",
      icon: FiClock,
      count: summary?.pending ?? 0,
    },
    {
      key: "reviewed",
      label: "Reviewed",
      icon: FiEye,
      count: summary?.reviewed ?? 0,
    },
    {
      key: "converted",
      label: "Approved",
      icon: FiCheckCircle,
      count: summary?.converted ?? 0,
    },
    {
      key: "rejected",
      label: "Rejected",
      icon: FiXCircle,
      count: summary?.rejected ?? 0,
    },
  ];
  // =========================
  // HANDLERS
  // =========================
  const handleReview = async (id: number) => {
    try {
      loaderService.show();
      await review(id).unwrap();
      loaderService.hide();
      setShowConvertModal(false);
      setSelectedApp(null);
      toast.success("Marked as reviewed");
    } catch (err: any) {
      loaderService.hide();
      toast.error(err?.data?.detail || "Failed");
      setSelectedApp(null);
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    loaderService.show();

    await reject({ id, comment: reason }).unwrap();
    loaderService.hide();
    toast.success("Rejected");
  };

  const handleConvertSubmit = async () => {
    if (!selectedApp) return;
    loaderService.show();
    const formData = new FormData();

    // if (!linkExisting) {
    //   if (!files.id_document && !files.job_contract && !files.bank_statement) {
    //     return toast.error("Upload at least one document");
    //   }

    //   Object.entries(files).forEach(([key, value]: any) => {
    //     if (value) formData.append(key, value);
    //   });
    // }

    formData.append("link_existing", linkExisting ? "true" : "false");

    try {
      // console.log(selectedApp.id, formData);
      await convertPublicApplication({
        id: selectedApp.id,
        body: formData,
      }).unwrap();
      loaderService.hide();
      toast.success("Client registered successfully");

      setShowConvertModal(false);

      setLinkExisting(false);
    } catch (err: any) {
      // console.log(err);
      loaderService.hide();
      toast.error(err?.data?.detail || err?.data?.error || "Conversion failed");
    }
  };
  const handleTabChange = (key: any) => {
    setActiveTab(key);
    setPage(1);
  };

  // =========================
  // STATUS BADGE
  // =========================
  const StatusBadge = ({ status }: any) => {
    const styles: any = {
      pending: "bg-yellow-100 text-yellow-700",
      reviewed: "bg-blue-100 text-blue-700",
      converted: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}>
        {status}
      </span>
    );
  };
  // const openFile = async (type: string) => {
  //   if (!selectedApp) return;

  //   try {
  //     const token =
  //       localStorage.getItem("access") || sessionStorage.getItem("access");
  //     if (!token)
  //       return toast.error("You are not authorized. Please login again.");

  //     const response = await fetch(
  //       `${url}/api/loans/admin/public-applications/${selectedApp.id}/view-file?type=${type}`,
  //       { headers: { Authorization: `Bearer ${token}` } },
  //     );
  //     if (!response.ok)
  //       throw new Error(
  //         `Failed to fetch file,seems like no ${type} was uploaded`,
  //       );
  //     const blob = await response.blob();
  //     // console.log(blob);
  //     const fileType = blob.type || "application/octet-stream";

  //     const fileURL = URL.createObjectURL(new Blob([blob], { type: fileType }));
  //     if (fileURL) {
  //       setPreviewFile({ url: fileURL, name: type });
  //     } else {
  //       toast.error("Failed to open file,no file uploaded");
  //     }
  //   } catch (err) {
  //     // console.error(err);
  //     toast.error(`Failed to open file, seems like no ${type} was uploaded`);
  //   }
  // };

  // =========================
  // DRAWER (FULL DETAILS)
  // =========================
  const Drawer = () => {
    if (!selectedApp) return null;

    return (
      <div className="fixed inset-0 z-50 flex font-sans text-gray-500 text-sm">
        {/* Overlay */}
        <div
          className="flex-1 bg-black/50 transition-opacity"
          onClick={() => setSelectedApp(null)}
        />

        {/* Drawer Panel */}
        <div className="w-full sm:max-w-xl bg-white h-full overflow-y-auto shadow-xl p-4 sm:p-8">
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Application Details
            </h2>
            <button
              onClick={() => setSelectedApp(null)}
              className="text-gray-500 hover:text-red-600 transition"
              title="Close"
            >
              <FaTimesCircle size={24} />
            </button>
          </div>

          {/* APPLICANT */}
          <div className="flex items-start gap-4">
            <FaUser className="text-blue-500 mt-1" size={22} />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-700">Applicant</h3>
              <p>
                <span className="font-medium">Name:</span>{" "}
                {selectedApp.full_name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {selectedApp.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {selectedApp.phone}
              </p>
              <p>
                <span className="font-medium">National ID:</span>{" "}
                {selectedApp.national_id}
              </p>
              <p>
                <span className="font-medium">Gender:</span>{" "}
                {selectedApp.gender}
              </p>
              <p>
                <span className="font-medium">Marital Status:</span>{" "}
                {selectedApp.marital_status}
              </p>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="flex items-start gap-4">
            <FaHome className="text-green-500 mt-1" size={22} />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-700">Address</h3>
              <p>
                {selectedApp.district}, {selectedApp.sector}
              </p>
              <p>
                {selectedApp.cell}, {selectedApp.village}
              </p>
            </div>
          </div>

          {/* EMPLOYMENT */}
          <div className="flex items-start gap-4">
            <FaBriefcase className="text-yellow-500 mt-1" size={22} />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-700">
                Employment
              </h3>
              <p>
                <span className="font-medium">Company:</span>{" "}
                {selectedApp.employer}
              </p>
              <p>
                <span className="font-medium">Position:</span>{" "}
                {selectedApp.position}
              </p>
              <p>
                <span className="font-medium">Supervisor:</span>{" "}
                {selectedApp.supervisor}
              </p>
              <p>
                <span className="font-medium">Employer Phone:</span>{" "}
                {selectedApp.employer_phone}
              </p>
              <p>
                <span className="font-medium">Salary:</span>{" "}
                {selectedApp.salary} RWF
              </p>
            </div>
          </div>

          {/* LOAN */}
          <div className="flex items-start gap-4">
            <FaFileAlt className="text-purple-500 mt-1" size={22} />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-700">Loan</h3>
              <p>
                <span className="font-medium">Amount:</span>{" "}
                {selectedApp.requested_amount} RWF
              </p>
              <p>
                <span className="font-medium">In Words:</span>{" "}
                {selectedApp.loan_words}
              </p>
              <p>
                <span className="font-medium">Type:</span>{" "}
                {selectedApp.loan_type_details.name}
              </p>
              <ul className="text-gray-500 text-sm ml-4">
                <li>
                  <span className="font-medium">Minimum Amount:</span>{" "}
                  {selectedApp.loan_type_details.min_amount} RWF
                </li>
                <li>
                  <span className="font-medium">Maximum Amount:</span>{" "}
                  {selectedApp.loan_type_details.max_amount} RWF
                </li>
                <li>
                  <span className="font-medium">Interest Rate:</span>{" "}
                  {selectedApp.loan_type_details.interest_rate}%
                </li>
                <li>
                  <span className="font-medium">Repayment Period:</span>{" "}
                  {selectedApp.loan_type_details.repayment_period_value}{" "}
                  {selectedApp.loan_type_details.repayment_period_unit}
                </li>
              </ul>
            </div>
          </div>

          {/* STATUS */}
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-green-600" />
            <StatusBadge status={selectedApp.status} />
          </div>

          {/* DOCUMENTS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2">
            {selectedApp?.id_document ? (
              <a
                href={selectedApp.id_document}
                target="_blank"
                rel="noopener noreferrer"
                // onClick={() => openFile("id")}
                className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 p-2 rounded shadow hover:bg-blue-200 transition"
              >
                <FaFilePdf /> View ID
              </a>
            ) : (
              <p className="text-gray-500 font-bold text-sm">
                No Id Document Provided
              </p>
            )}
            {selectedApp?.job_contract ? (
              <a
                href={selectedApp.job_contract}
                target="_blank"
                rel="noopener noreferrer"
                // onClick={() => openFile("contract")}
                className="flex items-center justify-center gap-2 bg-yellow-100 text-yellow-700 p-2 rounded shadow hover:bg-yellow-200 transition"
              >
                <FaFilePdf /> Job Contract
              </a>
            ) : (
              <p className="text-gray-500 font-bold text-sm">
                No Contract Document Provided
              </p>
            )}
            {selectedApp?.bank_statement ? (
              <a
                href={selectedApp.bank_statement}
                target="_blank"
                rel="noopener noreferrer"
                // onClick={() => openFile("bank")}
                className="flex items-center justify-center gap-2 bg-purple-100 text-purple-700 p-2 rounded shadow hover:bg-purple-200 transition"
              >
                <FaFilePdf /> Bank Statement
              </a>
            ) : (
              <p className="text-gray-500 font-bold text-sm">
                No Bank Statement Provided
              </p>
            )}
          </div>

          {/* ACTIONS */}
          {["admin", "manager"].includes(role) && (
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              {selectedApp.status === "pending" && (
                <>
                  <button
                    onClick={() => handleReview(selectedApp.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded shadow hover:bg-blue-700 transition"
                  >
                    <FaCheckCircle /> Review
                  </button>
                  <button
                    onClick={() => handleReject(selectedApp.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white p-3 rounded shadow hover:bg-red-700 transition"
                  >
                    <FaTimesCircle /> Reject
                  </button>
                </>
              )}

              {selectedApp.status === "reviewed" && (
                <>
                  <button
                    onClick={() => setShowConvertModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white p-3 rounded shadow hover:bg-green-700 transition"
                  >
                    <FaCheckCircle /> Register Client
                  </button>

                  <button
                    onClick={() => handleReject(selectedApp.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white p-3 rounded shadow hover:bg-red-700 transition"
                  >
                    <FaTimesCircle /> Reject
                  </button>
                </>
              )}
            </div>
          )}

          <button
            onClick={() => setSelectedApp(null)}
            className="w-full mt-6 border border-gray-300 p-3 rounded hover:bg-gray-100 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  //===== Preview =====
  const FilePreviewModal = () => {
    if (!previewFile) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center h-full bg-black/50">
        <div className="relative w-full max-w-4xl bg-white h-max-[90vh] h-[90vh] rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-bold text-lg">
              {previewFile.name.toUpperCase()}
            </h3>
            <button
              onClick={() => setPreviewFile(null)}
              className="text-red-500 font-bold"
            >
              Close
            </button>
          </div>
          <iframe
            src={previewFile.url}
            className="w-full h-full"
            title="Document Preview"
          ></iframe>
        </div>
      </div>
    );
  };

  // =========================
  // CONVERT MODAL
  // =========================
  const ConvertModal = ({
    // clientName,
    handleConvertSubmit,
    setShowConvertModal,
    converting,
  }: any) => {
    const [typedName, setTypedName] = useState("");
    const confirmationPhrase = `CONFIRM`;
    const isConfirmed =
      typedName === confirmationPhrase ||
      typedName === confirmationPhrase.toLowerCase();

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setShowConvertModal(false)}
        />
        <div className="relative bg-white w-full max-w-md rounded-xl p-6 space-y-5 shadow-xl">
          <h3 className="text-lg font-bold text-red-600">
            ⚠️ Confirm Client Conversion
          </h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              You are about to convert this application into a registered
              client.
            </p>
            <p className="font-medium text-red-500">
              This action is <strong>irreversible</strong>.
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>The applicant will be permanently registered as a client</li>
              <li>This process cannot be undone</li>
              <li>Ensure all documents and details have been verified</li>
            </ul>
            <p className="pt-2">
              To confirm, type the client's
              <span className="font-bold text-green-500 px-2">
                CONFIRM
              </span>{" "}
              below:
            </p>
          </div>
          <input
            type="text"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder={`Type CONFIRM to confirm`}
            className="w-full border border-gray-300 rounded-md p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowConvertModal(false)}
              className="w-full border border-gray-300 p-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleConvertSubmit}
              disabled={converting || !isConfirmed}
              className="w-full bg-red-600 text-white p-2 rounded disabled:opacity-50"
            >
              {converting ? "Processing..." : "Confirm Conversion"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Public Applications
          </h1>
          <p className="text-sm text-slate-500">
            Manage and review loan applications
          </p>
        </div>

        <div className="text-sm text-slate-500">
          Total Applications:
          <span className="font-semibold ml-1">{data?.length || 0}</span>
        </div>
      </div>

      {/* Mobile Statistics */}
      <div className="grid grid-cols-2 gap-3 lg:hidden">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-row justify-between items-center shadow-sm">
          <p className="text-xs text-slate-500">Pending</p>
          <h3 className="text-2xl font-bold text-yellow-500">
            {tabs.find((t) => t.key === "pending")?.count || 0}
          </h3>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-row justify-between items-center shadow-sm">
          <p className="text-xs text-slate-500">Approved</p>
          <h3 className="text-2xl font-bold text-green-500">
            {tabs.find((t) => t.key === "converted")?.count || 0}
          </h3>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative flex flex-col md:flex-row gap-3 flex-wrap overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab: any) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className="relative"
            >
              <motion.div
                whileTap={{ scale: 0.96 }}
                className={`
                relative flex items-center gap-3 px-5 py-3 rounded-2xl
                border transition-all duration-300 min-w-fit justify-between
                ${
                  active
                    ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-lg shadow-blue-500/20"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                }
              `}
              >
                <Icon className="text-lg" />

                <span className="font-medium text-sm whitespace-nowrap">
                  {tab.label}
                </span>

                <span
                  className={`
                  px-2 py-0.5 rounded-full text-xs font-semibold
                  ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  }
                `}
                >
                  {tab.count}
                </span>
              </motion.div>
            </button>
          );
        })}
      </div>
      <div className="flex flex-row items-center gap-x-3">
        <h2 className="txt-gray-400">Layout</h2>
        <button
          onClick={() => setGrid(false)}
          className={`p-2 rounded ${
            !grid ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          <FiGrid />
        </button>
        <button
          onClick={() => setGrid(true)}
          className={`p-2 rounded ${
            grid ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          <FiClock />
        </button>
      </div>
      {/* ================= MOBILE CARDS ================= */}
      {grid && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((app: any, index: number) => (
            <motion.div
              key={app.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedApp(app)}
              className="
            relative
            bg-white
            rounded-3xl
            border border-slate-200
            shadow-sm
            hover:shadow-lg
            transition-all
            overflow-hidden
            cursor-pointer
          "
            >
              {/* Status Indicator */}
              <div
                className={`
              absolute left-0 top-0 h-full w-1.5
              ${
                app.status === "pending"
                  ? "bg-yellow-500"
                  : app.status === "reviewed"
                    ? "bg-blue-500"
                    : app.status === "converted"
                      ? "bg-green-500"
                      : "bg-red-500"
              }
            `}
              />

              <div className="p-5 pl-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400">
                      Application #{index + 1}
                    </p>

                    <h3 className="font-semibold text-slate-800 text-base mt-1">
                      {app.full_name}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <StatusBadge status={app.status} />
                </div>

                <div className="mt-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Requested Amount
                  </p>

                  <h2 className="text-2xl font-bold text-emerald-600 mt-1">
                    {Number(app.requested_amount).toLocaleString()} RWF
                  </h2>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <span className="text-sm text-slate-500">
                    Tap to view details
                  </span>

                  <FiEye className="text-slate-400 text-lg" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ================= DESKTOP TABLE ================= */}
      {!grid && (
        <div className="w-[90vw] sm:w-[75vw] lg:w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                  #
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                  Date
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                  Full Name
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                  Requested Amount
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {data?.map((app: any, index: number) => (
                <tr
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="
                border-b border-slate-100
                hover:bg-blue-50
                transition-colors
                cursor-pointer
              "
                >
                  <td className="px-6 py-4 text-slate-500">{index + 1}</td>

                  <td className="px-6 py-4 text-slate-500">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-700">
                    {app.full_name}
                  </td>

                  <td className="px-6 py-4 font-semibold text-emerald-600">
                    {Number(app.requested_amount).toLocaleString()} RWF
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* States */}
      {isLoading && (
        <div className="bg-white rounded-2xl p-10 text-center">
          Loading applications...
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center text-red-600">
          Failed to load applications
        </div>
      )}

      {!isLoading && data?.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center text-slate-500">
          No applications found
        </div>
      )}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-500">
          Page {PublicApplicationData?.current_page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={PublicApplicationData?.current_page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
          >
            Prev
          </button>

          <button
            disabled={PublicApplicationData?.current_page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
          >
            Next
          </button>
        </div>
      </div>

      <Drawer />

      {selectedApp && showConvertModal && (
        <ConvertModal
          clientName={selectedApp.full_name}
          handleConvertSubmit={handleConvertSubmit}
          setShowConvertModal={setShowConvertModal}
          converting={converting}
        />
      )}

      <FilePreviewModal />
    </div>
  );
}
