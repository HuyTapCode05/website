export default function ProductList({ products, editProduct, deleteProduct }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 w-full max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800">Danh sách sản phẩm</h2>
        </div>
        <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
          {products.length} sản phẩm
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {products.map((p: any) => (
          <div 
            key={p.id} 
            className="group bg-gradient-to-r from-white to-gray-50/50 border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={"http://localhost:8080" + p.imageUrl}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-300"
                  alt={p.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/no-image.png";
                  }}
                />
                {p.salePrice && p.salePrice < p.price && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    SALE
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-lg truncate">{p.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  {p.salePrice && p.salePrice < p.price ? (
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 font-bold text-lg">
                        {p.salePrice.toLocaleString()}đ
                      </span>
                      <span className="text-gray-400 line-through text-sm">
                        {p.price.toLocaleString()}đ
                      </span>
                      <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded">
                        -{Math.round((1 - p.salePrice / p.price) * 100)}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-green-600 font-bold text-lg">
                      {p.price.toLocaleString()}đ
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">ID: {p.id}</span>
                  {p.categoryName && (
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      {p.categoryName}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                  onClick={() => editProduct(p)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Sửa
                </button>

                <button
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                  onClick={() => deleteProduct(p.id)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Xóa
                </button>
              </div>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-xl pointer-events-none transition-all duration-300"></div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có sản phẩm nào</h3>
          <p className="text-gray-500">Danh sách sản phẩm sẽ xuất hiện ở đây</p>
        </div>
      )}
    </div>
  );
}