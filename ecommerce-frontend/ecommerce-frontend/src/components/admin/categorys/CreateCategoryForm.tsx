import type { NewCategory } from "../../../types/NewCategory";

interface Props {
  newCat: NewCategory;
  setNewCat: React.Dispatch<React.SetStateAction<NewCategory>>;
  onCreate: () => void;
  isEditing?: boolean;
}

export default function CreateCategoryForm({ newCat, setNewCat, onCreate, isEditing = false }: Props) {
  return (
    <form onSubmit={e => { e.preventDefault(); onCreate(); }} className="space-y-4">
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>
          Tên danh mục <span style={{ color: "#EF4444" }}>*</span>
        </label>
        <input value={newCat.name} placeholder="Nhập tên danh mục..."
          className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all"
          style={{ background: "#0D1117", border: "1px solid #1F2937" }}
          onFocus={e => e.target.style.borderColor = "#C9A96E"}
          onBlur={e => e.target.style.borderColor = "#1F2937"}
          onChange={e => setNewCat({ ...newCat, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>Mô tả</label>
        <textarea value={newCat.description ?? ""} placeholder="Mô tả danh mục (tuỳ chọn)..." rows={3}
          className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none transition-all"
          style={{ background: "#0D1117", border: "1px solid #1F2937" }}
          onFocus={e => e.target.style.borderColor = "#C9A96E"}
          onBlur={e => e.target.style.borderColor = "#1F2937"}
          onChange={e => setNewCat({ ...newCat, description: e.target.value })}
        />
      </div>

      <button type="submit" disabled={!newCat.name.trim()}
        className="w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: newCat.name.trim() ? "#C9A96E" : "#374151", color: newCat.name.trim() ? "#111827" : "#6B7280" }}>
        {isEditing ? "💾 Cập nhật danh mục" : "➕ Tạo danh mục mới"}
      </button>
    </form>
  );
}