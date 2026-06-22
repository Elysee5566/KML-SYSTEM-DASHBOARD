import { FileSpreadsheet, Trash2, Eye, Star } from "lucide-react";

export default function SheetCard({
  sheet,
  onDelete,
  onSetActive,
  onOpen,
}: any) {
  return (
    <div
      className="
        bg-white
        rounded-3xl
        border
        p-5
        shadow-sm
        hover:shadow-lg
        transition-all
        group
      "
    >
      {/* TOP */}
      <div className="flex items-start justify-between">
        <div
          className="
          bg-green-100
          p-4
          rounded-2xl
        "
        >
          <FileSpreadsheet
            className="
            w-8
            h-8
            text-green-600
          "
          />
        </div>

        {sheet.is_active && (
          <div
            className="
            bg-primary/10
            text-primary
            px-3
            py-1
            rounded-full
            text-xs
            font-semibold
            flex
            items-center
            gap-1
          "
          >
            <Star className="w-3 h-3" />
            Active
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="mt-5">
        <h3
          className="
          font-bold
          text-lg
          text-gray-900
          line-clamp-2
        "
        >
          {sheet.title}
        </h3>

        <div
          className="
          mt-4
          space-y-2
          text-sm
          text-gray-500
        "
        >
          <p>{sheet.row_count} records</p>

          <p>Uploaded by {sheet.uploaded_by}</p>

          <p>{new Date(sheet.uploaded_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* ACTIONS */}
      <div
        className="
        mt-6
        flex
        items-center
        gap-2
      "
      >
        <button
          onClick={() => onOpen(sheet.id)}
          className="
            flex-1
            bg-primary
            text-white
            py-3
            rounded-2xl
            font-medium
            flex
            items-center
            justify-center
            gap-2
          "
        >
          <Eye className="w-4 h-4" />
          Open
        </button>

        {!sheet.is_active && (
          <button
            onClick={() => onSetActive(sheet.id)}
            className="
              px-4
              py-3
              rounded-2xl
              border
              hover:bg-gray-50
            "
          >
            <Star className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onDelete}
          className="px-4 py-3 rounded-2xl border text-red-500 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
