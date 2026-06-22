import {
  CheckCircle2,
  //   Eye,
} from "lucide-react";

export default function CurrentActiveSheet({
  sheet,
  //   onOpen
}: any) {
  return (
    <div
      className="
      w-fit
      flex flex-row
      gap-5
        bg-linear-to-r
        from-primary
        to-primary/80
        rounded-3xl
        p-6
        text-white
        shadow-xl
      "
    >
      <div
        className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-5
      "
      >
        <div
          className="
            flex
            flex-row
            items-center
            gap-2
            
          "
        >
          <CheckCircle2
            className="
              w-5
              h-5
            "
          />

          <span
            className="
              text-sm
              font-medium
            "
          >
            Current Active Sheet
          </span>
        </div>

        <div className="flex flex-row items-center justify-between">
            <h2
          className="
            text-2xl
            font-bold
          "
        >
          {sheet.title}
        </h2>

        <div
          className="
            mx-5
            flex
            flex-wrap
            gap-4
            text-sm
            text-white/90
          "
        >
          <span>{sheet.row_count} records</span>

          <span>{new Date(sheet.uploaded_at).toLocaleDateString()}</span>
        </div>
        </div>
      </div>
    </div>
  );
}
