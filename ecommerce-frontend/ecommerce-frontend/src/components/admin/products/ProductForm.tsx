export default function ProductForm({
  product,
  setProduct,
  categories,
  setImageFile,
  generateSlug,
  saveProduct,
  resetForm,
}: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 w-full max-w-xl">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">
          {product.id ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        </h2>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên sản phẩm
          </label>
          <input
            value={product.name}
            placeholder="Nhập tên sản phẩm..."
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            onChange={(e) =>
              setProduct({
                ...product,
                name: e.target.value,
                slug: generateSlug(e.target.value),
              })
            }
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đường dẫn (Slug)
          </label>
          <input
            value={product.slug}
            placeholder="Slug sẽ tự động tạo..."
            readOnly
            className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Price Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá gốc
            </label>
            <input
              value={product.price}
              type="number"
              placeholder="0"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá khuyến mãi
            </label>
            <input
              value={product.salePrice}
              type="number"
              placeholder="0"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              onChange={(e) => setProduct({ ...product, salePrice: e.target.value })}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả sản phẩm
          </label>
          <textarea
            value={product.description}
            placeholder="Nhập mô tả cho sản phẩm..."
            rows={4}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Danh mục
          </label>
          <select
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            value={product.categoryId}
            onChange={(e) =>
              setProduct({ ...product, categoryId: e.target.value })
            }
          >
            <option value="">Chọn danh mục</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hình ảnh sản phẩm
          </label>
          <input
            type="file"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* Image Preview */}
        {product.imageUrl && (
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <img
              src={"http://localhost:8080" + product.imageUrl}
              className="w-16 h-16 rounded-lg object-cover border border-gray-300"
              alt="Preview"
            />
            <div className="text-sm text-gray-600">
              <p className="font-medium">Ảnh hiện tại</p>
              <p className="text-gray-500">Tải lên ảnh mới để thay thế</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            onClick={saveProduct}
          >
            {product.id ? "Lưu chỉnh sửa" : "Thêm sản phẩm mới"}
          </button>

          {product.id && (
            <button
              className="w-full bg-gray-500 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              onClick={resetForm}
            >
              Hủy chỉnh sửa
            </button>
          )}
        </div>
      </div>

      {/* Form Status */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className={`w-2 h-2 rounded-full ${product.name ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
          <span>
            {product.name 
              ? 'Đã sẵn sàng để lưu' 
              : 'Đang chờ nhập thông tin'
            }
          </span>
        </div>
      </div>
    </div>
  );
}