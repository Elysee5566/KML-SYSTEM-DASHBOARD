import { useEffect, useState } from "react";
// import { FiCheck, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  useCreatePaymentMutation,
  useGetPaymentsQuery,
  useReviewPaymentMutation,
  useUpdatePaymentMutation,
} from "../../api/paymentApi";
import { useGetActiveLoansQuery } from "../../api/loanApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { Drawer } from "../../components/Modals/ReusableDrawer";
import { FaCheck, FaEdit, FaEye, FaTimes } from "react-icons/fa";
import { loaderService } from "../../components/Loaders/loaderService";
import { useCancelPaymentMutation } from "../../api/paymentApi";
import { Loader } from "lucide-react";
const PaymentPage = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const { data, isLoading, isError } = useGetPaymentsQuery<any>({
    page,
    page_size: 100,
    status: filter,
  });
  useEffect(() => {
    // console.log("Fetched payments data:", data);
  }, [data]);

  // const { data: loansData } = useGetLoansQuery();
  const { role } = useSelector((state: RootState) => state.auth);
  const [viewingPayment, setViewingPayment] = useState<any>(null);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [createPayment, { isLoading: isCreatingPayment }] =
    useCreatePaymentMutation();
  const [updatePayment] = useUpdatePaymentMutation();
  const [reviewPayment] = useReviewPaymentMutation();
  const [cancelPayment, { isLoading: isCancellingPayment }] =
    useCancelPaymentMutation();
  const { data: loansData, isLoading: isActiveLoansLoading } =
    useGetActiveLoansQuery();
  const [grid, setGrid] = useState(false);

  const [form, setForm] = useState({
    loan: "",
    amount_paid: "",
    payment_proof: null as File | null,
    name_of_paid: "",
  });

  const payments = Array.isArray(data) ? data : data?.results || [];
  const activeLoans = Array.isArray(loansData)
    ? loansData
    : loansData?.results || [];

  // const activeLoans = loans.filter(
  //   (l: any) =>
  //     Number(l.remaining_balance) > 0 &&
  //     l.status !== "paid" &&
  //     l.status !== "reloaned",
  // );

  // const selectedLoan = activeLoans.find(
  //   (l: any) => String(l.id) === form.loan,
  // );

  const formatAmount = (v: number) => `${Number(v || 0).toLocaleString()} RWF`;

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString() : "-";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("loan_id", form.loan);
    formData.append("amount_paid", form.amount_paid);
    formData.append("name_of_paid", form.name_of_paid);
    if (form.payment_proof)
      formData.append("payment_proof", form.payment_proof);

    try {
      await createPayment(formData).unwrap();
      toast.success("Payment submitted");

      setForm({
        loan: "",
        amount_paid: "",
        payment_proof: null,
        name_of_paid: "",
      });
    } catch {
      toast.error("Payment failed");
    }
  };

  const handleReview = async (id: number, action: "approve" | "reject") => {
    try {
      loaderService.show();
      await reviewPayment({ id, action }).unwrap();
      loaderService.hide();
      toast.success(`Payment ${action}d`);
    } catch (err: any) {
      loaderService.hide();

      // console.log(err.data);

      if (err?.data?.detail) {
        toast.error(err.data.detail);
      } else if (err?.data?.message) {
        toast.error(err.data.message);
      } else if (err?.data?.non_field_errors) {
        toast.error(err.data.non_field_errors[0]);
      } else if (err?.data) {
        const firstKey = Object.keys(err.data)[0];

        if (firstKey) {
          const errorMessage = err.data[firstKey][0];

          toast.error(`${firstKey}: ${errorMessage}`);
        } else {
          toast.error("Failed to create application");
        }
      } else {
        toast.error("Failed to create application");
      }

      toast.error("Action failed");
      // loaderService.hide()
    }
  };
  const handleCancel = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this payment? Note that this action will revert the loan balance.",
      )
    )
      return;

    try {
      loaderService.show();
      await cancelPayment({ id }).unwrap();
      toast.success("Payment cancelled");
      loaderService.hide();
    } catch {
      toast.error("Cancellation failed");
      loaderService.hide();
    }
  };
  if (isLoading || isActiveLoansLoading)
    return <p className="p-6">Loading...</p>;
  if (isError) return <p className="p-6 text-red-500">Error loading data</p>;
  // Handling saving Update Payment
  const handleUpdate = async (form: any) => {
    if (!editingPayment) return;

    try {
      loaderService.show();
      const formData = new FormData();
      // console.log("Updating payment with form data:", form.loan);
      formData.append("loan_id", form.loan);
      formData.append("amount_paid", form.amount_paid);
      formData.append("name_of_paid", form.name_of_paid);

      if (form.payment_proof) {
        formData.append("payment_proof", form.payment_proof);
      }

      await updatePayment({
        id: editingPayment.id,
        formData,
      }).unwrap();
      loaderService.hide();
      toast.success("Payment updated successfully");

      setEditingPayment(null);
    } catch (err) {
      // console.error(err);
      loaderService.hide();
      toast.error("Update failed");
    }
  };

  function ViewPaymentDrawer({ payment, onClose }: any) {
    // console.log("Viewing payment:", payment);
    if (!payment) return null; // ✅ prevent crash
    return (
      <Drawer open={!!payment} onClose={onClose} title="Payment Details">
        <div className="space-y-5">
          {/* STATUS BADGE */}
          <span
            className={`px-3 py-1 text-xs rounded-full ${
              payment.status === "approved"
                ? "bg-green-100 text-green-600"
                : payment.status === "rejected"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {payment.status}
          </span>

          {/* DETAILS */}
          <div className="space-y-2 text-sm">
            <p>
              <b>Loan ID:</b> #{payment.loan?.id || payment.loan}
            </p>
            <p>
              <b>Amount:</b> {Number(payment.amount_paid).toLocaleString()} RWF
            </p>
            {/* <p>
              <b>Paid Number Name:</b> {Number(payment.name_of_paid)}
            </p> */}
            <p>
              <b>Date:</b> {new Date(payment.payment_date).toLocaleDateString()}
            </p>
          </div>

          {/* PROOF IMAGE */}
          {payment.payment_proof && (
            <div>
              <p className="text-sm font-medium mb-2">Payment Proof</p>

              <div className="border rounded-xl overflow-hidden">
                <img
                  src={payment.payment_proof}
                  className="w-full object-contain max-h-75"
                />
              </div>

              <a
                href={payment.payment_proof}
                target="_blank"
                className="text-blue-500 text-sm mt-2 inline-block"
              >
                Open full image
              </a>
            </div>
          )}
        </div>
      </Drawer>
    );
  }
  // EDIT PAYMENT DRAWER CAN BE SIMILAR TO VIEW DRAWER BUT WITH INPUTS INSTEAD OF TEXT
  function EditPaymentDrawer({ payment, loans, onClose, onSave }: any) {
    const [form, setForm] = useState({
      loan: payment.loan?.id || payment.loan,
      amount_paid: payment.amount_paid,
      payment_proof: null as File | null,
      name_of_paid: payment.name_of_paid,
    });

    return (
      <Drawer open={!!payment} onClose={onClose} title="Edit Payment">
        <div className="space-y-5">
          {/* LOAN */}
          <div>
            <label className="text-sm text-gray-500">Loan</label>
            <select
              value={form.loan}
              onChange={(e) => setForm({ ...form, loan: e.target.value })}
              className="w-full p-3 border rounded-lg mt-1"
            >
              {loans.map((l: any) => (
                <option key={l.id} value={l.id}>
                  #{l.id}
                </option>
              ))}
            </select>
          </div>

          {/* AMOUNT */}
          <div>
            <label className="text-sm text-gray-500">Amount</label>
            <input
              type="number"
              value={form.amount_paid}
              onChange={(e) =>
                setForm({ ...form, amount_paid: e.target.value })
              }
              className="w-full p-3 border rounded-lg mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Name of paid number</label>
            {/* <input
              type="text"
              value={form.name_of_paid}
              onChange={(e) =>
                setForm({ ...form, name_of_paid: e.target.value })
              }
              placeholder="name of paid number"
              className="w-full p-3 border rounded-lg mt-1"
            /> */}
          </div>

          {/* CURRENT IMAGE */}
          {payment.payment_proof && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Proof</p>
              <img
                src={payment.payment_proof}
                className="h-24 rounded-lg border"
              />
            </div>
          )}

          {/* NEW FILE */}
          <div>
            <label className="text-sm text-gray-500">Replace Proof</label>
            <input
              type="file"
              onChange={(e) =>
                setForm({
                  ...form,
                  payment_proof: e.target.files?.[0] || null,
                })
              }
              className="w-full mt-1"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2 pt-4">
            <button onClick={onClose} className="flex-1 border rounded-lg py-2">
              Cancel
            </button>

            <button
              onClick={() => onSave(form)}
              className="flex-1 bg-primary text-white rounded-lg py-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Drawer>
    );
  }
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payments-{role}</h1>

        <select
          onChange={(e) => {
            (setFilter(e.target.value), setPage(1));
          }}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* ===================== */}
      {/* SUMMARY */}
      {/* ===================== */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p>Total Paid</p>
          <h2 className="text-xl font-bold">
            {formatAmount(data?.summary?.total_paid || 0)}
          </h2>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl">
          Pending: {data?.summary?.pending_count || 0}
        </div>

        <div className="bg-green-50 p-4 rounded-xl">
          Approved:
          {data?.summary?.approved_count || 0}
        </div>
      </div>
      <div className="flex flex-row items-center gap-x-4">
        <h2>Layout</h2>
        <button
          onClick={() => setGrid(!grid)}
          className="bg-primary text-white py-2 px-4 rounded-lg"
        >
          {grid ? "Switch to List" : "Switch to Grid"}
        </button>
      </div>

      {/* ===================== */}
      {/* CLIENT FORM */}
      {/* ===================== */}
      {role === "client" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl md:w-[60%] shadow space-y-3"
        >
          <h2 className="font-semibold">Make Payment</h2>

          <select
            value={form.loan}
            onChange={(e) => setForm({ ...form, loan: e.target.value })}
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="">Select Loan</option>
            {activeLoans.map((l: any) => (
              <option key={l.id} value={l.id}>
                #{l.id} - {Number(l.remaining_balance).toLocaleString()} RWF
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={form.amount_paid}
            onChange={(e) => setForm({ ...form, amount_paid: e.target.value })}
            className="w-full p-3 border rounded-lg"
            required
          />
          {/* <div>
            <input
              type="text"
              placeholder="Name of Paid number"
              value={form.name_of_paid}
              onChange={(e) =>
                setForm({ ...form, name_of_paid: e.target.value })
              }
              className="w-full p-3 border rounded-lg"
            />
            <span className="text-xs text-gray-400">
              Amazina abaruye kuri Nimero Yishyuye
            </span>
          </div> */}

          <input
            type="file"
            // required
            className="border border-gray-400  w-full p-3 rounded-xl bg-gray-200"
            onChange={(e) =>
              setForm({
                ...form,
                payment_proof: e.target.files?.[0] || null,
              })
            }
          />

          <button
            disabled={isCreatingPayment}
            className="w-full bg-primary text-white py-3 rounded-lg"
          >
            {isCreatingPayment ? "Submitting..." : "Submit Payment"}
          </button>
        </form>
      )}

      {data?.results.length === 0 && (
        <p className="text-center text-gray-500">No payments found</p>
      )}
      {/* ===================== */}
      {/* 📱 MOBILE CARDS */}
      {/* ===================== */}
      {grid && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data?.results.map((p: any) => (
            <div
              key={p.id}
              className="bg-white p-4 rounded-xl shadow space-y-2"
            >
              <div className="flex justify-between">
                <p className="font-semibold">Loan #{p.loan?.id || p.loan}</p>

                <span
                  className={`text-xs px-2 py-1 h-6 rounded-md ${
                    p.status === "approved"
                      ? "bg-green-100 text-green-600"
                      : p.status === "rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <p className="text-sm font-medium">
                {formatAmount(p.amount_paid)}
              </p>

              <p className="text-xs text-gray-500">
                {formatDate(p.payment_date)}
              </p>

              {/* ACTIONS */}
              {role !== "client" && p.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleReview(p.id, "approve")}
                    className="flex-1 bg-green-500 text-white py-2 rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReview(p.id, "reject")}
                    className="flex-1 bg-red-500 text-white py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ===================== */}
      {/* 🖥️ DESKTOP TABLE */}
      {/* ===================== */}
      {!grid && (
        <div className="w-[85vw] md:w-full bg-white text-gray-600 font-medium rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Loan</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Proof</th>
                {/* <th className="p-3">Name of Paid number</th> */}
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data?.results.map((p: any) => (
                <tr
                  key={p.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-3">#{p.loan?.id || p.loan}</td>
                  <td className="p-3 font-semibold">
                    {formatAmount(p.amount_paid)}
                  </td>
                  <td className="p-3">
                    {p.payment_proof ? (
                      <a
                        href={p.payment_proof}
                        className="text-blue-500"
                        target="_blank"
                      >
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  {/* <td className="p-3 text-ellipsis">{p.name_of_paid}</td> */}
                  <td className="p-3">{formatDate(p.payment_date)}</td>
                  <td className="p-3">{p.status}</td>

                  {role !== "client" ? (
                    <td className="p-3 space-x-2">
                      {p.status === "pending" ? (
                        <div className="flex gap-2 flex-row items-center">
                          <button
                            onClick={() => setViewingPayment(p)}
                            className="bg-blue-600 text-white text-xs border border-gray-200 px-2  py-1 rounded-md  flex flex-row items-center gap-1"
                          >
                            <FaEye /> View
                          </button>
                          {role !== "reviewer" && (
                            <>
                              <button
                                onClick={() => handleReview(p.id, "approve")}
                                className="bg-green-600 text-white text-xs border border-gray-200 px-2  py-1 rounded-md  flex flex-row items-center gap-1"
                              >
                                <FaCheck /> Approve
                              </button>

                              <button
                                onClick={() => setEditingPayment(p)}
                                className="bg-blue-600 text-white text-xs border border-gray-200 px-2  py-1 rounded-md  flex flex-row items-center gap-1"
                              >
                                <FaEdit /> Edit
                              </button>

                              <button
                                onClick={() => handleReview(p.id, "reject")}
                                className="bg-red-600 text-white text-xs border border-gray-200 px-2  py-1 rounded-md  flex flex-row items-center gap-1"
                              >
                                <FaTimes /> reject
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="flex gap-2 flex-row items-center">
                          <button
                            onClick={() => setViewingPayment(p)}
                            className="bg-blue-600 text-white text-xs border border-gray-200 px-2  py-1 rounded-md  flex flex-row items-center gap-1"
                          >
                            <FaEye /> View
                          </button>
                          {p?.status !== "cancelled" &&
                            p?.status !== "approved" &&
                            p?.status !== "rejected" && (
                              <button
                                onClick={() => handleCancel(p.id)}
                                className="bg-red-600 text-white text-xs border border-gray-200 px-2  py-1 rounded-md flex flex-row items-center gap-1"
                              >
                                {isCancellingPayment ? <Loader /> : <FaTimes />}
                                Cancel
                              </button>
                            )}
                        </div>
                      )}
                    </td>
                  ) : (
                    <td className="p-3">
                      <button
                        onClick={() => setViewingPayment(p)}
                        className="text-blue-600"
                      >
                        View Details
                      </button>
                      {p.status === "pending" && (
                        <button
                          onClick={() => setEditingPayment(p)}
                          className="text-blue-600"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page} of{" "}
          {data?.total_pages || Math.ceil(payments.length / 100) || 1}
        </span>

        <button
          disabled={page === data?.total_pages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <ViewPaymentDrawer
        payment={viewingPayment}
        onClose={() => setViewingPayment(null)}
      />

      {editingPayment && (
        <EditPaymentDrawer
          payment={editingPayment}
          loans={activeLoans}
          onClose={() => setEditingPayment(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default PaymentPage;
