import { useState } from "react";
import { X, UploadCloud, FileUp } from "lucide-react";

export default function UploadSheetModal({
  open,
  onClose,
  onUpload,
  loading,
}: any) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  if (!open) return null;

  const handleUpload = async () => {
    if (!title || !file) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    await onUpload(formData);

    setTitle("");
    setFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-xl">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">
            Upload New Sheet
          </h2>

          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-4">

          {/* TITLE */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Sheet Title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-2 border rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g. 2025 Past Loans"
            />
          </div>

          {/* FILE */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Excel File
            </label>

            <div className="mt-2 border-2 border-dashed rounded-2xl p-6 text-center">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="file-upload"
              />

              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <UploadCloud className="w-8 h-8 text-gray-400" />

                <p className="text-sm text-gray-500">
                  Click to upload Excel file
                </p>

                {file && (
                  <p className="text-primary font-medium text-sm mt-2">
                    {file.name}
                  </p>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border rounded-2xl py-3"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="flex-1 bg-primary text-white rounded-2xl py-3 font-semibold flex items-center justify-center gap-2"
          >
            <FileUp className="w-4 h-4" />
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}