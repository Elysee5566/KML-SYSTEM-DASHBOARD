import { useState } from "react";
import {
  useGetApplicationsQuery,
  useReviewApplicationMutation,
  useUploadContractMutation,
  useFinalizeLoanMutation,
  useUploadSignedContractMutation,
  useUpdateApplicationMutation,
} from "../../api/loanapplication";
import { toast } from "react-toastify";
import { FiUpload, FiCheck, FiX, FiEye } from "react-icons/fi";
import TableSkeleton from "../../components/Loaders/TableSkeleton";
import CardSkeleton from "../../components/Loaders/CardSkeleton";
import { loaderService } from "../../components/Loaders/loaderService";
import { FiEdit } from "react-icons/fi";
import { formatCompactNumber } from "../../components/formatCompactNumber";
import { useGetLoanTypesQuery } from "../../api/loanApi";
export default function LoanApplications() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "all",
    sort: "newest",
    search: "",
  });
  const { data: applicationsData = [], isLoading } = useGetApplicationsQuery(
    {
      page,
      page_size: 50,
      search: filters.search,
      status: filters.status,
      sort: filters.sort,
    },
    { refetchOnMountOrArgChange: true },
  );
  const applications = Array.isArray(applicationsData)
    ? applicationsData
    : applicationsData?.results || [];

  // console.log(applications);

  const [editModal, setEditModal] = useState<any>(null);

  const [review, { isLoading: reviewLoading }] = useReviewApplicationMutation();
  const [uploadContract] = useUploadContractMutation();
  const [uploadSignedContract] = useUploadSignedContractMutation();
  const [finalize, { isLoading: finalizeLoading }] = useFinalizeLoanMutation();

  const [modal, setModal] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [detailModal, setDetailModal] = useState<any>(null);

  const handleReview = async () => {
    try {
      loaderService.show();
      await review({
        id: modal.id,
        decision: modal.decision,
        comment,
      }).unwrap();
      loaderService.hide();
      toast.success("Application updated");
      setModal(null);
      setDetailModal(null);
      setComment("");
    } catch {
      setModal(null);
      setComment("");
      setDetailModal(null);
      loaderService.hide();
      toast.error("Failed");
    }
  };
  const handleUploadSigned = async (id: number, file: File) => {
    try {
      loaderService.show();
      const formData = new FormData();
      formData.append("file", file);
      await uploadSignedContract({ id, data: formData }).unwrap();

      loaderService.hide();
      toast.success("Signed contract uploaded");
    } catch (error: any) {
      // console.log(error);
      loaderService.hide();
      toast.error("Upload failed");
    }
  };

  const handleUpload = async (id: number, file: File) => {
    try {
      loaderService.show();
      await uploadContract({ id, file }).unwrap();
      loaderService.hide();
      toast.success("Contract uploaded");
      setDetailModal(null);
    } catch {
      loaderService.hide();
      toast.error("Upload failed");
    }
  };

  const handleFinalize = async (id: number) => {
    try {
      loaderService.show();
      await finalize(id).unwrap();
      loaderService.hide();
      setDetailModal(null);
      toast.success("Loan created");
    } catch (err: any) {
      loaderService.hide();
      setDetailModal(null);
      console.log(err);

      toast.error("Finalize failed");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Loan Applications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and process client loan applications
          </p>
        </div>
      </div>
      {!isLoading && <ApplicationStats applications={applicationsData} />}

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        {/* SEARCH */}
        <input
          placeholder="Search client or loan type..."
          value={filters.search}
          onChange={(e) =>
            setFilters((p) => ({ ...p, search: e.target.value }))
          }
          className="border border-gray-200 rounded-xl px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="flex gap-3 flex-wrap">
          {/* STATUS FILTER */}
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((p) => ({ ...p, status: e.target.value }))
            }
            className="border border-gray-200 rounded-xl px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="signed">Signed</option>
            {/* <option value="approved">Approved</option> */}
            <option value="rejected">Rejected</option>
          </select>

          {/* SORT */}
          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters((p) => ({ ...p, sort: e.target.value }))
            }
            className="border border-gray-200 rounded-xl px-3 py-2"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="amount_high">Amount ↑</option>
            <option value="amount_low">Amount ↓</option>
          </select>
        </div>
      </div>
      {/* DESKTOP TABLE */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="w-[85vw] md:w-[75vw] lg:w-full bg-white shadow rounded-2xl min-h-[30vh] overflow-x-auto z-50">
          <table className="min-w-250 divide-y w-full divide-gray-200 text-sm">
            <thead className="bg-gray-50 sticky top-0 z-20 ">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  #
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Client
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Loan Type
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Amount(RWF)
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  Contract
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  Signed Contract
                </th>

                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  Signed
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  Created
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {applications?.filter((app: any) => app.status !== "approved")
                ?.length == 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="px-3 py-2 text-center text-sm text-gray-500"
                  >
                    No Loan applications Available.
                  </td>
                </tr>
              )}
              {applications?.map((app: any, index: number) => (
                <tr
                  key={app.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  // onClick={() => setDetailModal(app)}
                >
                  <td className="px-3 text-xs md:text-md py-2 font-medium text-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-3 text-xs md:text-md py-2 font-medium text-slate-800">
                    {app.client_data?.names || "Client"}
                  </td>
                  <td className="px-3 text-xs md:text-md py-2">
                    {app.loan_type_details?.name}
                  </td>
                  <td className="px-3 text-xs md:text-md py-2 text-right font-semibold">
                    {formatCompactNumber(app.requested_amount, true)} RWF
                  </td>
                  <td className="px-3 text-xs md:text-md py-2 text-center">
                    <span
                      className={`px-2  md:text-md py-1 text-xs rounded font-medium ${
                        app.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : app.status === "reviewed"
                            ? "bg-blue-100 text-blue-700"
                            : app.status === "signed"
                              ? "bg-purple-100 text-purple-700"
                              : app.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-3 text-xs md:text-md py-2 text-center">
                    {app.contract ? (
                      <a
                        href={app.contract}
                        target="_blank"
                        className="text-blue-600 text-xs underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        Not uploaded
                      </span>
                    )}
                  </td>
                  <td className="px-3 text-xs md:text-md py-2 text-center">
                    {app.signed_contract ? (
                      <a
                        href={app.signed_contract}
                        target="_blank"
                        className="text-blue-600 text-xs underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        No signed contract
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {app.is_signed ? (
                      <span className="text-green-600 text-xs font-medium">
                        Yes
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center text-gray-500 text-xs">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 text-right space-x-2 flex justify-end items-center">
                    {/* ACTIONS */}
                    {app.status === "pending" && (
                      <>
                        <button
                          onClick={() => {
                            setDetailModal(app);
                          }}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition"
                        >
                          <FiEye /> View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            try {
                              loaderService.show();
                              setModal({ id: app.id, decision: "approve" });
                              loaderService.hide();
                            } catch (error: any) {
                              toast.error("An error occurred", error);
                              loaderService.hide();
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition"
                        >
                          <FiCheck /> Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            loaderService.show();
                            setModal({ id: app.id, decision: "reject" });
                            loaderService.hide();
                          }}
                          className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition"
                        >
                          <FiX /> Reject
                        </button>
                      </>
                    )}
                    {app.status === "reviewed" && (
                      <div className="relative group">
                        {!app.contract ? (
                          <label className="cursor-pointer flex items-center gap-1 px-3 py-1 rounded text-white text-xs bg-black hover:bg-gray-800">
                            <FiUpload />
                            Upload Contract
                            <input
                              hidden
                              type="file"
                              onChange={(e) =>
                                e.target.files &&
                                handleUpload(app.id, e.target.files[0])
                              }
                            />
                          </label>
                        ) : (
                          <>
                            <button className="px-3 py-1 bg-black text-white text-xs rounded hover:bg-gray-800">
                              Actions ▾
                            </button>

                            <div className="absolute right-0 z-50  w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-50">
                              {/* View Application Details */}
                              <label
                                onClick={() => setDetailModal(app)}
                                className="block px-4 py-2 text-xs hover:bg-gray-100 cursor-pointer"
                              >
                                View Application Details
                              </label>
                              {/* Replace Contract */}
                              <label className="block px-4 py-2 text-xs hover:bg-gray-100 cursor-pointer">
                                Replace Contract
                                <input
                                  hidden
                                  type="file"
                                  onChange={(e) =>
                                    e.target.files &&
                                    handleUpload(app.id, e.target.files[0])
                                  }
                                />
                              </label>

                              {/* Upload Signed Contract */}
                              <label className="block px-4 py-2 text-xs hover:bg-gray-100 cursor-pointer">
                                Upload Signed Contract
                                <input
                                  hidden
                                  type="file"
                                  onChange={(e) => {
                                    e.target.files &&
                                      handleUploadSigned(
                                        app.id,
                                        e.target?.files[0],
                                      );
                                  }}
                                />
                              </label>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    {app.status === "signed" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFinalize(app.id);
                        }}
                        disabled={finalizeLoading}
                        className="px-3 py-1 bg-black hover:bg-gray-800 text-white text-xs rounded transition"
                      >
                        {finalizeLoading ? "Finalizing...." : "Finalize"}
                      </button>
                    )}
                    {(app.status === "approved" ||
                      app.status === "rejected") && (
                      <button
                        onClick={() => setDetailModal(app)}
                        className={`flex items-center gap-1 px-3 py-1 bg-${app.status === "approved" ? "green" : "red"}-600 hover:bg-${app.status === "approved" ? "green" : "red"}-700 text-white text-xs rounded transition`}
                      >
                        <FiEye /> View
                      </button>
                    )}
                    {app.status !== "rejected" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditModal(app);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition"
                      >
                        <FiEdit /> Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MOBILE CARD LAYOUT */}
      {isLoading ? (
        <CardSkeleton />
      ) : (
        <div className="hidden space-y-4">
          {applications.map((app: any) => (
            <div
              key={app.id}
              className="bg-white shadow rounded-2xl p-4 space-y-2 cursor-pointer"
              onClick={() => setDetailModal(app)}
            >
              <div className="flex justify-between items-center">
                <div className="font-medium text-slate-800">
                  {app.client_data?.names || "Client"}
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded font-medium ${
                    app.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : app.status === "reviewed"
                        ? "bg-blue-100 text-blue-700"
                        : app.status === "signed"
                          ? "bg-purple-100 text-purple-700"
                          : app.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                  }`}
                >
                  {app.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Loan Type: {app.loan_type_details?.name}
              </div>
              <div className="text-sm font-semibold">
                Amount: RWF{app.requested_amount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 flex justify-between">
                <span>Signed: {app.is_signed ? "Yes" : "No"}</span>
                <span>
                  Created: {new Date(app.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-row  text-gray-400 gap-1 w-full mx-auto flex-wrap items-center justify-between mt-6 bg-white md:p-3 p-1 rounded-xl border border-gray-200">
        {/* LEFT INFO */}
        <p className="text-xs text-gray-500">
          {applicationsData.current_page}/{applicationsData.total_pages}
        </p>

        {/* CONTROLS */}
        <div className="flex items-center md:gap-2 gap-1">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 text-xs border border-gray-200 rounded disabled:opacity-40"
          >
            Prev
          </button>

          {/* page numbers */}
          {Array.from({ length: applicationsData.total_pages }, (_, i) => i + 1)

            .map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 text-xs rounded border  border-gray-200 ${
                  page === p ? "bg-blue-600 text-white" : ""
                }`}
              >
                {p}
              </button>
            ))}

          <button
            disabled={page === applicationsData.total_pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 text-xs border border-gray-200 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>

        {/* PAGE SIZE */}
      </div>
      {/* APPLICATION DETAILS MODAL */}
      {detailModal && (
        <ApplicationDetails
          app={detailModal}
          onClose={() => setDetailModal(null)}
        />
      )}

      {/* REVIEW MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">
              {modal.decision === "approve"
                ? "Approve Application"
                : "Reject Application"}
            </h2>
            <textarea
              placeholder="Add comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReview}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                disabled={reviewLoading}
              >
                {reviewLoading ? "Reviewing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
      {editModal && (
        <EditApplicationDrawer
          app={editModal}
          onClose={() => setEditModal(null)}
        />
      )}
    </div>
  );
}

function EditApplicationDrawer({ app, onClose }: any) {
  /* fetch loan types */
  const { data: loanTypes = [] } = useGetLoanTypesQuery();
  const [updateApplication, { isLoading: updateLoading }] =
    useUpdateApplicationMutation();

  const [form, setForm] = useState({
    client: app.client,
    loan_type: app.loan_type || app.loan_type_details?.id || "",
    requested_amount: app.requested_amount,
    status: app.status,
    comment: app.comment || "",
    is_signed: app.is_signed,
    signed_at: app.signed_at ? app.signed_at.slice(0, 16) : "",
    contract: null,
    signed_contract: null,
  });

  const update = (key: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      loaderService.show();
      const formData = new FormData();

      formData.append("loan_type", form.loan_type);

      formData.append("requested_amount", form.requested_amount);

      formData.append("status", form.status);

      formData.append("comment", form.comment || "");

      formData.append("is_signed", form.is_signed);

      if (form.signed_at) {
        formData.append("signed_at", form.signed_at);
      }

      // FILES
      if (form.contract) {
        formData.append("contract", form.contract);
      }

      if (form.signed_contract) {
        formData.append("signed_contract", form.signed_contract);
      }

      await updateApplication({
        id: app.id,
        data: formData,
      }).unwrap();
      loaderService.hide();
      toast.success("Application updated");
      onClose();
    } catch (err) {
      // console.log(err);
      loaderService.hide();
      toast.error("Update failed");
    }
  };
  return (
    <div className="fixed inset-0 z-50">
      {/* BACKDROP */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />

      {/* DRAWER */}
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col">
        {/* HEADER */}
        <div className="border-b px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Edit Application #{app.id}
            </h2>

            <p className="text-sm text-gray-500">
              Update full application details
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* CLIENT DETAILS */}
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">
              Applicant Details
            </h3>

            <div className="grid md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border">
              <ReadOnlyField label="Full Name" value={app.client_data?.names} />

              <ReadOnlyField label="Phone" value={app.client_data?.phone} />

              <ReadOnlyField label="Email" value={app.client_data?.email} />

              <ReadOnlyField
                label="Created At"
                value={new Date(app.created_at).toLocaleString()}
              />
            </div>
          </section>

          {/* LOAN DETAILS */}
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">
              Loan Details
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <Select
                label="Loan Type"
                value={form.loan_type}
                onChange={(e: any) => update("loan_type", e.target.value)}
                options={loanTypes}
                valueKey="id"
                labelKey="name"
              />

              <Input
                label="Requested Amount"
                type="number"
                value={form.requested_amount}
                onChange={(e: any) =>
                  update("requested_amount", e.target.value)
                }
              />

              <Select
                label="Status"
                value={form.status}
                onChange={(e: any) => update("status", e.target.value)}
                options={[
                  "pending",
                  "reviewed",
                  "signed",
                  "approved",
                  "rejected",
                ]}
              />

              <Input
                label="Signed At"
                type="datetime-local"
                value={form.signed_at}
                onChange={(e: any) => update("signed_at", e.target.value)}
              />
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.is_signed}
                  onChange={(e) => update("is_signed", e.target.checked)}
                />

                <label className="text-sm font-medium">Client Has Signed</label>
              </div>
            </div>
          </section>

          {/* DOCUMENTS */}
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">
              Contracts
            </h3>

            <div className="space-y-5">
              <FileInput
                label="Replace Contract"
                current={app.contract}
                onChange={(file: File) => update("contract", file)}
              />

              <FileInput
                label="Replace Signed Contract"
                current={app.signed_contract}
                onChange={(file: File) => update("signed_contract", file)}
              />
            </div>
          </section>

          {/* COMMENT */}
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">
              Internal Notes
            </h3>

            <Textarea
              label="Admin Comment"
              rows={5}
              value={form.comment}
              onChange={(e: any) => update("comment", e.target.value)}
            />
          </section>
        </div>

        {/* FOOTER */}
        <div className="border-t px-6 py-4 flex justify-end gap-3 bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-xl hover:bg-gray-50"
          >
            Cancel
          </button>

          <div className="gap-y-1">
            <button
              disabled={updateLoading || app.status == "approved"}
              onClick={handleSubmit}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
            >
              {updateLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
        {app.status == "approved" && (
          <div className="my-1  text-orange-300 font-bold self-end text-xs px-2 py-1 rounded">
            You cannot update this application
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
HELPERS
========================================== */

function ReadOnlyField({ label, value }: any) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-slate-800">{value || "—"}</p>
    </div>
  );
}

function FileInput({ label, current, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {current && (
        <a
          href={current}
          target="_blank"
          className="text-blue-600 text-xs underline block mb-2"
        >
          View Current File
        </a>
      )}

      <input
        type="file"
        onChange={(e: any) => e.target.files && onChange(e.target.files[0])}
        className="w-full border rounded-xl px-3 py-2"
      />
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <input
        {...props}
        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}

function Textarea({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <textarea
        {...props}
        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}

function Select({
  label,
  options,
  valueKey = null,
  labelKey = null,
  ...props
}: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <select
        {...props}
        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
      >
        {options.map((item: any) => (
          <option
            key={valueKey ? item[valueKey] : item}
            value={valueKey ? item[valueKey] : item}
          >
            {labelKey ? item[labelKey] : item}
          </option>
        ))}
      </select>
    </div>
  );
}
function ApplicationStats({ applications }: any) {
  // const stats = applications.reduce(
  //   (acc: any, app: any) => {
  //     acc.total += 1;
  //     acc.amount += Number(app.requested_amount || 0);

  //     if (app.status === "pending") acc.pending += 1;
  //     if (app.status === "reviewed") acc.reviewed += 1;
  //     if (app.status === "signed") acc.signed += 1;
  //     if (app.status === "approved") acc.approved += 1;
  //     if (app.status === "rejected") acc.rejected += 1;

  //     return acc;
  //   },
  //   {
  //     total: 0,
  //     amount: 0,
  //     pending: 0,
  //     reviewed: 0,
  //     signed: 0,
  //     approved: 0,
  //     rejected: 0,
  //   },
  // );

  // const formatCurrency = (v: number) =>
  //   new Intl.NumberFormat("en-RW", {
  //     style: "currency",
  //     currency: "RWF",
  //     notation: "compact",
  //   }).format(v);

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
      <Stat
        title="Total"
        value={formatCompactNumber(applications.summary.total_applications)}
      />
      <Stat
        title="Pending"
        value={formatCompactNumber(applications.summary.pending)}
      />
      <Stat
        title="Reviewed"
        value={formatCompactNumber(applications.summary.reviewed)}
      />
      <Stat
        title="Signed"
        value={formatCompactNumber(applications.summary.signed)}
      />
      <Stat
        title="Approved"
        value={formatCompactNumber(applications.summary.approved)}
      />
      <Stat
        title="Rejected"
        value={formatCompactNumber(applications.summary.rejected)}
      />
    </div>
  );
}

function Stat({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <p className="text-xs text-gray-500">{title}</p>
      <h2 className="font-semibold text-lg mt-1">{value}</h2>
    </div>
  );
}
function StatusBadge({ status }: any) {
  const styles: any = {
    pending: "bg-yellow-100 text-yellow-700",
    reviewed: "bg-blue-100 text-blue-700",
    signed: "bg-purple-100 text-purple-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
function Workflow({ status }: any) {
  const steps = ["pending", "reviewed", "signed", "approved"];

  return (
    <div className="flex justify-between mt-4">
      {steps.map((step, i) => {
        const active = steps.indexOf(status) >= i;

        return (
          <div key={step} className="flex-1 text-center">
            <div
              className={`w-6 h-6 mx-auto rounded-full ${
                active ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <p className="text-xs mt-1 capitalize">{step}</p>
          </div>
        );
      })}
    </div>
  );
}
function ApplicationDetails({ app, onClose }: any) {
  return (
    <div
      className={`fixed inset-0 z-50 ${
        app ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          app ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* DRAWER */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl transform transition-transform duration-300 ${
          app ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="flex items-center justify-between p-5 border-b">
            <div>
              <h2 className="text-lg font-semibold">Application #{app.id}</h2>
              <p className="text-xs text-gray-400">Loan request details</p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
            {/* CLIENT */}
            <Section title="Client Info">
              <Info label="Name" value={app.client_data?.names} />
              <Info
                label="Reviewed By"
                value={app.reviewed_by_data?.username || "—"}
              />
              <Info label="" value={app.reviewed_by_data?.email || "—"} />
            </Section>

            {/* LOAN */}
            <Section title="Loan Details">
              <Info label="Loan Type" value={app.loan_type_details?.name} />
              <Info
                label="Amount"
                value={formatCurrency(app.requested_amount)}
              />
              <Info
                label="Status"
                value={<StatusBadge status={app.status} />}
              />
            </Section>

            {/* SIGNING */}
            <Section title="Signing">
              <Info label="Signed" value={app.is_signed ? "Yes" : "No"} />
              <Info
                label="Signed At"
                value={
                  app.signed_at ? new Date(app.signed_at).toLocaleString() : "—"
                }
              />
            </Section>

            {/* DOCUMENTS */}
            <Section title="Documents">
              <Doc label="Contract" url={app.contract} />
              <Doc label="Signed Contract" url={app.signed_contract} />
            </Section>

            {/* COMMENT */}
            {app.comment && (
              <Section title="Admin Comment">
                <p className="bg-gray-50 p-3 rounded-lg">{app.comment}</p>
              </Section>
            )}

            {/* META */}
            <Section title="Metadata">
              <Info
                label="Created"
                value={new Date(app.created_at).toLocaleString()}
              />
            </Section>

            {/* WORKFLOW */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Workflow</p>
              <Workflow status={app.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function Section({ title, children }: any) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function Doc({ label, url }: any) {
  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>
      {url ? (
        <a
          href={url}
          target="_blank"
          className="text-blue-600 hover:underline text-xs"
        >
          View
        </a>
      ) : (
        <span className="text-gray-400 text-xs">Not available</span>
      )}
    </div>
  );
}
const formatCurrency = (v: number) =>
  new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
  }).format(v);

function Info({ label, value }: any) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-gray-500 text-xs whitespace-nowrap">{label}</span>

      <div className="text-right font-medium text-slate-800 wrap-break-word">
        {value || "—"}
      </div>
    </div>
  );
}
// function Input({ label, ...props }: any) {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         {label}
//       </label>

//       <input
//         {...props}
//         className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
//       />
//     </div>
//   );
// }

// function Select({
//   label,
//   options,
//   ...props
// }: any) {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         {label}
//       </label>

//       <select
//         {...props}
//         className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//       >
//         {options.map((item: string) => (
//           <option key={item} value={item}>
//             {item}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// function Textarea({ label, ...props }: any) {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         {label}
//       </label>

//       <textarea
//         {...props}
//         className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
//       />
//     </div>
//   );
// }
