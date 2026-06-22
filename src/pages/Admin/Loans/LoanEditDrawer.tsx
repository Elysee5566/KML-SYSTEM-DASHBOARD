import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function EditLoanDrawer({
  loan,
  open,
  onClose,
  onSave,
  isLoading,
}: any) {
  const [form, setForm] = useState<any>({});

  const hasPayments = loan?.payments?.length > 0;

  useEffect(() => {
    if (loan) {
      setForm({
        loan_amount: loan.loan_amount,
        interest_amount: loan.interest_amount,
        repayment_due_date: loan.repayment_due_date,
        penalty_amount: loan.penalty_amount,
        status: loan.status,
        contract: null,
      });
    }
  }, [loan]);

  if (!open || !loan) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* BACKDROP */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40 z-40" />

      {/* DRAWER */}
      <div className="ml-auto w-full max-w-md bg-white h-full shadow-xl flex flex-col relative z-50">
        {/* HEADER */}
        <div className="flex justify-between items-center p-5 border-b">
          <div>
            <h2 className="font-semibold text-lg">Edit Loan</h2>
            <p className="text-xs text-gray-400">#{loan.id}</p>
          </div>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-5 space-y-5 overflow-y-auto text-sm">
          {/* CLIENT */}
          <div>
            <p className="text-xs text-gray-400">Client</p>
            <p className="font-medium">{loan.client_names}</p>
          </div>

          {/* AMOUNT */}
          <Field label="Loan Amount">
            <input
              type="number"
              value={form.loan_amount || ""}
              //   disabled={hasPayments}
              onChange={(e) =>
                setForm({ ...form, loan_amount: e.target.value })
              }
              className="input"
            />
          </Field>

          {/* INTEREST */}
          <Field label="Interest">
            <input
              type="number"
              value={form.interest_amount || ""}
              //   disabled={hasPayments}
              onChange={(e) =>
                setForm({ ...form, interest_amount: e.target.value })
              }
              className="input"
            />
          </Field>
          {/* INTEREST */}

          <Field label="Penalty Amount">
            <input
              type="number"
              value={form.penalty_amount || 0}
              //   disabled={hasPayments}
              onChange={(e) =>
                setForm({ ...form, penalty_amount: e.target.value })
              }
              className="input"
            />
          </Field>

          {hasPayments && (
            <p className="text-xs text-red-500">
              Note: Be sure that the interest amount is well calculated.System
              will not automatically adjust interest!!.
            </p>
          )}

          {/* DUE DATE */}
          <Field label="Repayment Due Date">
            <input
              type="date"
              value={form.repayment_due_date || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  repayment_due_date: e.target.value,
                })
              }
              className="input"
            />
          </Field>

          {/* STATUS */}
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="input"
            >
              <option value="active">Active</option>
              <option value="in_payment">In Payment</option>
              <option value="overdue">Overdue</option>
              <option value="defaulted">Defaulted</option>
              <option value="paid">Paid</option>
              <option value="reloaned">Reloaned</option>
              <option value="cancelled">Cancelled</option>
              <option value="to_be_reported">To Be Reported</option>
              <option value="reported">Reported</option>
            </select>
          </Field>

          {/* CONTRACT */}
          <Field label="Replace Contract">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e: any) =>
                setForm({
                  ...form,
                  contract: e.target.files?.[0],
                })
              }
              className="input"
            />
          </Field>
        </div>

        {/* ACTIONS */}
        <div className="p-5 border-t space-y-2">
          <button
            onClick={() => {
              const formData = new FormData();

              Object.entries(form).forEach(([key, value]: any) => {
                if (value !== null) {
                  formData.append(key, value);
                }
              });

              onSave(loan.id, formData);
            }}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>

          <button onClick={onClose} className="w-full text-gray-500 text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* Reusable field */
function Field({ label, children }: any) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      {children}
    </div>
  );
}
