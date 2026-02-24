import type { NewCategory } from "../../../types/NewCategory";

interface Props {
  newCat: NewCategory;
  setNewCat: React.Dispatch<React.SetStateAction<NewCategory>>;
  onCreate: () => void;
  isEditing?: boolean;
}

export default function CreateCategoryForm({ newCat, setNewCat, onCreate, isEditing = false }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {isEditing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
        </h3>
      </div>

      {/* Category Name Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Tên danh mục <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-gray-400"
            placeholder="Nhập tên danh mục..."
            value={newCat.name}
            onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
            required
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          
          </div>
        </div>
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Mô tả danh mục
        </label>
        <div className="relative">
          <textarea
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-gray-400 resize-none"
            placeholder="Nhập mô tả cho danh mục (tuỳ chọn)..."
            value={newCat.description ?? ""}
            onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
            rows={3}
          />
          <div className="absolute right-3 top-3 text-gray-400">
          
          </div>
        </div>
        <p className="text-xs text-gray-500">
          {newCat.description?.length || 0}/500 ký tự
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!newCat.name.trim()}
        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
          !newCat.name.trim()
            ? 'bg-gray-400 cursor-not-allowed'
            : isEditing
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
        }`}
      >
        {!newCat.name.trim() ? (
          <>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Vui lòng nhập tên danh mục
          </>
        ) : isEditing ? (
          <>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Cập nhật danh mục
          </>
        ) : (
          <>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tạo danh mục mới
          </>
        )}
      </button>

      {/* Form Status */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className={`w-2 h-2 rounded-full ${newCat.name.trim() ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
        <span>
          {newCat.name.trim() 
            ? 'Đã sẵn sàng để tạo' 
            : 'Đang chờ nhập thông tin'
          }
        </span>
      </div>
    </form>
  );
}