import SheetCard from "./SheetCard";


export default function SheetGrid({
  sheets,
  onRequestDelete,
  onSetActive,
  onOpen
}: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold">
          Uploaded Sheets
        </h2>

        <p className="text-sm text-gray-500">
          {sheets.length} files
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

        {sheets.map((sheet: any) => (
          <SheetCard
            key={sheet.id}
            sheet={sheet}
            onDelete={() => onRequestDelete(sheet.id)}
            onOpen={onOpen}
            onSetActive={onSetActive}
          />
        ))}

      </div>
    </div>
  );
}