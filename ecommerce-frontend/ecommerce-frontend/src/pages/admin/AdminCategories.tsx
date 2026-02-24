import { useAdminCategories } from "../../hooks/useAdminCategories";
import CreateCategoryForm from "../../components/admin/categorys/CreateCategoryForm";
import CategoryList from "../../components/admin/categorys/CategoryList";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AdminCategories() {
  const role = localStorage.getItem("role");

  if (role !== "ROLE_ADMIN") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-red-200">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-3">Truy Cập Bị Từ Chối</h1>
          <p className="text-gray-600 mb-6">Bạn không có quyền truy cập trang quản trị!</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            🏠 Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const {
    categories,
    newCat,
    setNewCat,
    createCategory,
    startEdit,
    deleteCategory,
    editingId
  } = useAdminCategories();

  return (
    <div className="min-h-screen p-6" style={{ background: '#FAFAFA' }}>
      <div className="max-w-5xl mx-auto">
        <AdminHeader title="Quản lý danh mục" />
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            {/* <div className={`w-3 h-12 rounded-full ${editingId ? 'bg-yellow-500' : 'bg-green-500'}`}></div> */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {editingId ? "Cập nhật danh mục" : "Quản lý danh mục"}
              </h1>
              <p className="text-gray-600 mt-2">
                {editingId
                  ? "Chỉnh sửa thông tin danh mục sản phẩm"
                  : "Tạo và quản lý các danh mục sản phẩm trong hệ thống"
                }
              </p>
            </div>
            <div className="ml-auto px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(201,169,110,0.15)', color: '#C9A96E' }}>
              {categories.length} danh mục
            </div>
          </div>

          {/* Form và List Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create/Edit Form */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-50 to-amber-50/30 rounded-xl p-6 border border-gray-200">
                <CreateCategoryForm
                  newCat={newCat}
                  setNewCat={setNewCat}
                  onCreate={createCategory}
                  isEditing={!!editingId}
                />
              </div>
            </div>

            {/* Categories List */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    Danh sách danh mục
                  </h2>
                  {editingId && (
                    <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      Đang chỉnh sửa
                    </span>
                  )}
                </div>

                <CategoryList
                  categories={categories}
                  onEdit={startEdit}
                  onDelete={deleteCategory}
                />

                {/* Empty State */}
                {categories.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có danh mục nào</h3>
                    <p className="text-gray-500 text-sm">Hãy thêm danh mục đầu tiên để bắt đầu!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          {/* <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
                <div className="text-sm text-blue-500 font-medium">Tổng số</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{categories.length}</div>
                <div className="text-sm text-green-500 font-medium">Đang hoạt động</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">{editingId ? 1 : 0}</div>
                <div className="text-sm text-yellow-500 font-medium">Đang chỉnh sửa</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-purple-500 font-medium">Đã ẩn</div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}