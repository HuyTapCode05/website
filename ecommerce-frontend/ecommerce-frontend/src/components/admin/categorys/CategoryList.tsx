import type { Category } from "../../../types/Category";

interface Props {
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (id: number) => void;
}

export default function CategoryList({ categories, onEdit, onDelete }: Props) {
  return (
    <div className="space-y-3 relative">
      {categories.map((c, index) => (
        <div
          key={c.id}
          className="group relative bg-gradient-to-r from-white to-gray-50/50 border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between">
            {/* Category Info */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                {index + 1}
              </div>

              <div>
                {/* Tên category */}
                <span className="font-semibold text-gray-800 text-lg">
                  {c.name}
                </span>

                {/* Mô tả category */}
                {c.description && (
                  <p className="text-gray-600 text-sm mt-1 leading-snug">
                    {c.description}
                  </p>
                )}

                {/* ID */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    ID: {c.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                onClick={() => onEdit(c)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414
                       a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                  />
                </svg>
                Sửa
              </button>

              <button
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                onClick={() => onDelete(c.id)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7
                       m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                  />
                </svg>
                Xóa
              </button>
            </div>
          </div>

          {/* Hover border */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-xl pointer-events-none transition-all duration-300"></div>
        </div>
      ))}

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2
                   m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có danh mục nào</h3>
          <p className="text-gray-500 text-sm">Danh sách danh mục sẽ xuất hiện ở đây</p>
        </div>
      )}
    </div>
  );
}
