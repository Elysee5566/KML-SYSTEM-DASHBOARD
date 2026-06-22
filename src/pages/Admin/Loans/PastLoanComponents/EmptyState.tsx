import { FileSpreadsheet, UploadCloud } from "lucide-react";

export default function EmptyState({ onUploadClick }: any) {
  return (
    <div className="bg-white border rounded-3xl p-10 text-center shadow-sm">
      <div className="flex justify-center mb-5">
        <div className="bg-gray-100 p-5 rounded-3xl">
          <FileSpreadsheet className="w-10 h-10 text-gray-500" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900">
        No Past Loan Sheets Found
      </h2>

      <p className="text-gray-500 mt-2 max-w-md mx-auto">
        Upload your first Excel sheet to start managing historical loan records.
        The system will automatically organize and track all versions.
      </p>

      <button
        onClick={onUploadClick}
        className="mt-6 bg-primary text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 mx-auto"
      >
        <UploadCloud className="w-5 h-5" />
        Upload First Sheet
      </button>
    </div>
  );
}