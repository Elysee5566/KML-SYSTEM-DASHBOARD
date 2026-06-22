import { X, AlertTriangle } from "lucide-react";

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  loading,
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
}: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-lg font-bold">
              {title}
            </h2>
          </div>

          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <p className="text-gray-600 text-sm">
          {description}
        </p>

        {/* ACTIONS */}
        <div className="flex gap-3 mt-6">

          <button
            onClick={onClose}
            className="flex-1 border rounded-2xl py-3"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 text-white rounded-2xl py-3 font-semibold"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>
      </div>
    </div>
  );
}