import { useAdminCategories } from "../../hooks/useAdminCategories";
import CreateCategoryForm from "../../components/admin/categorys/CreateCategoryForm";
import CategoryList from "../../components/admin/categorys/CategoryList";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AdminCategories() {
  const role = localStorage.getItem("role");

  if (role !== "ROLE_ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0F1117" }}>
        <div className="rounded-2xl p-8 text-center max-w-md w-full" style={{ background: "#111827", border: "1px solid #1F2937" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,0.15)" }}>
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Truy cập bị từ chối</h1>
          <p className="text-sm mb-6" style={{ color: "#6B7280" }}>Bạn không có quyền truy cập trang này</p>
          <button onClick={() => (window.location.href = "/")}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "#C9A96E", color: "#111827" }}>
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const {
    categories, newCat, setNewCat,
    createCategory, startEdit, deleteCategory, editingId
  } = useAdminCategories();

  return (
    <div className="min-h-screen" style={{ background: "#0F1117" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <AdminHeader title="Quản lý danh mục" />

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {editingId ? "Cập nhật danh mục" : "Danh mục"}
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              {editingId ? "Chỉnh sửa thông tin danh mục" : "Tạo và quản lý danh mục sản phẩm"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {editingId && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "rgba(251,191,36,0.15)", color: "#FBBF24" }}>
                Đang chỉnh sửa
              </span>
            )}
            <span className="text-sm font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(201,169,110,0.15)", color: "#C9A96E" }}>
              {categories.length} danh mục
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="rounded-2xl p-6" style={{ background: "#111827", border: "1px solid #1F2937" }}>
            <h2 className="font-bold text-white mb-4">
              {editingId ? "✏️ Sửa danh mục" : "➕ Tạo danh mục mới"}
            </h2>
            <CreateCategoryForm
              newCat={newCat} setNewCat={setNewCat}
              onCreate={createCategory} isEditing={!!editingId}
            />
          </div>

          {/* List */}
          <div className="rounded-2xl p-6" style={{ background: "#111827", border: "1px solid #1F2937" }}>
            <h2 className="font-bold text-white mb-4">📂 Danh sách danh mục</h2>
            <CategoryList categories={categories} onEdit={startEdit} onDelete={deleteCategory} />

            {categories.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: "rgba(201,169,110,0.1)" }}>
                  <span className="text-2xl">📂</span>
                </div>
                <h3 className="font-semibold text-white mb-1">Chưa có danh mục</h3>
                <p className="text-sm" style={{ color: "#6B7280" }}>Thêm danh mục đầu tiên để bắt đầu</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}