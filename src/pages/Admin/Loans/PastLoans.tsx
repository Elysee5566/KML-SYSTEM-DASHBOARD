import { useState } from "react";
import {
  useDeletePastLoanSheetMutation,
  useGetPastLoanSheetsQuery,
  useSetActivePastLoanSheetMutation,
  useUploadPastLoanSheetMutation,
} from "../../../api/pastloans";
import CurrentActiveSheet from "./PastLoanComponents/CurrentActiveCard";
import EmptyState from "./PastLoanComponents/EmptyState";
import SheetGrid from "./PastLoanComponents/SheetGrid";
import UploadSheetModal from "./PastLoanComponents/UploadSheetModal";
import SheetViewerDrawer from "./PastLoanComponents/SheetViewDrawer";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import ConfirmDeleteModal from "./PastLoanComponents/ConfirmDelete";
import { FaPlus } from "react-icons/fa";

export default function PastLoanSheetsPage() {
  const { data: sheetsData = [] } = useGetPastLoanSheetsQuery({});
  const sheets = Array.isArray(sheetsData)
    ? sheetsData
    : sheetsData?.results || [];
  const [openSheetId, setOpenSheetId] = useState<number | null>(null);
  const [openUpload, setOpenUpload] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { role } = useSelector((state: RootState) => state.auth);
  const [uploadPastLoanSheet, { isLoading: uploading }] =
    useUploadPastLoanSheetMutation();

  const [deletePastLoanSheet, { isLoading: deleting }] =
    useDeletePastLoanSheetMutation();

  const [setActivePastLoanSheet] = useSetActivePastLoanSheetMutation();

  const activeSheet = sheets.find((sheet: any) => sheet.is_active);
  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    await deletePastLoanSheet(deleteId);
    setDeleteId(null);
  };
  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
  };
  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Past Loan Sheets</h1>

        <div className="flex flex-col md:flex-row items-center justify-between flex-wrap">
          <p className="text-gray-500 mt-1">
            Manage uploaded Excel loan files.
          </p>
          {role === "admin" && (
            <button
              className="p-2 flex flex-row gap-2 items-center rounded-xl bg-primary text-white"
              onClick={() => setOpenUpload(!openUpload)}
            >
              <FaPlus /> Add New Sheet
            </button>
          )}
        </div>
      </div>

      {/* ACTIVE SHEET */}
      {activeSheet && (
        <CurrentActiveSheet
          sheet={activeSheet}
          onOpen={(id: number) => setOpenSheetId(id)}
        />
      )}

      {/* UPLOAD */}
      <UploadSheetModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUpload={uploadPastLoanSheet}
        loading={uploading}
      />

      {/* FILE GRID */}
      {sheets.length === 0 ? (
        <EmptyState onUploadClick={() => setOpenUpload(true)} />
      ) : (
        <SheetGrid
          sheets={sheets}
          onRequestDelete={handleDeleteClick}
          onSetActive={setActivePastLoanSheet}
          onOpen={(id: number) => setOpenSheetId(id)}
        />
      )}
      <SheetViewerDrawer
        sheetId={openSheetId}
        onClose={() => setOpenSheetId(null)}
      />
      <ConfirmDeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Sheet"
        description="This will permanently delete the selected loan sheet and all its data."
      />
    </div>
  );
}
