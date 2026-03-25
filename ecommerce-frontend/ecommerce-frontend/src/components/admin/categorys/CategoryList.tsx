import type { Category } from "../../../types/Category";

interface Props {
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (id: number) => void;
}

export default function CategoryList({ categories, onEdit, onDelete }: Props) {
  if (categories.length === 0) return null;

  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#1F2937 transparent" }}>
      {categories.map((c, i) => (
        <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl transition-all group"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1F2937" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#1F2937"}>
          {/* Index */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: "rgba(201,169,110,0.15)", color: "#C9A96E" }}>
            {i + 1}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white">{c.name}</h3>
            {c.description && (
              <p className="text-xs truncate mt-0.5" style={{ color: "#6B7280" }}>{c.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button onClick={() => onEdit(c)}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all"
              style={{ background: "rgba(251,191,36,0.15)", color: "#FBBF24" }}>
              Sửa
            </button>
            <button onClick={() => onDelete(c.id)}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all"
              style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>
              Xóa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
