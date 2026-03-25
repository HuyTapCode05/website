export default function ProductForm({
  product, setProduct, categories,
  setImageFile, generateSlug, saveProduct, resetForm,
}: any) {
  return (
    <div className="space-y-4">
      {/* Product Name */}
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>Tên sản phẩm</label>
        <input value={product.name} placeholder="Nhập tên sản phẩm..."
          className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all"
          style={{ background: "#0D1117", border: "1px solid #1F2937" }}
          onFocus={e => e.target.style.borderColor = "#C9A96E"}
          onBlur={e => e.target.style.borderColor = "#1F2937"}
          onChange={e => setProduct({ ...product, name: e.target.value, slug: generateSlug(e.target.value) })}
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>Slug</label>
        <input value={product.slug} readOnly placeholder="Tự động tạo..."
          className="w-full p-3 rounded-lg text-sm cursor-not-allowed"
          style={{ background: "#0D1117", border: "1px solid #1F2937", color: "#6B7280" }}
        />
      </div>

      {/* Price Row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>Giá gốc</label>
          <input value={product.price} type="number" placeholder="0"
            className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all"
            style={{ background: "#0D1117", border: "1px solid #1F2937" }}
            onFocus={e => e.target.style.borderColor = "#C9A96E"}
            onBlur={e => e.target.style.borderColor = "#1F2937"}
            onChange={e => setProduct({ ...product, price: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>Giá sale</label>
          <input value={product.salePrice} type="number" placeholder="0"
            className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all"
            style={{ background: "#0D1117", border: "1px solid #1F2937" }}
            onFocus={e => e.target.style.borderColor = "#C9A96E"}
            onBlur={e => e.target.style.borderColor = "#1F2937"}
            onChange={e => setProduct({ ...product, salePrice: e.target.value })}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>Mô tả</label>
        <textarea value={product.description} placeholder="Mô tả sản phẩm..." rows={3}
          className="w-full p-3 rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none transition-all"
          style={{ background: "#0D1117", border: "1px solid #1F2937" }}
          onFocus={e => e.target.style.borderColor = "#C9A96E"}
          onBlur={e => e.target.style.borderColor = "#1F2937"}
          onChange={e => setProduct({ ...product, description: e.target.value })}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>Danh mục</label>
        <select value={product.categoryId}
          className="w-full p-3 rounded-lg text-sm text-white outline-none cursor-pointer transition-all"
          style={{ background: "#0D1117", border: "1px solid #1F2937" }}
          onChange={e => setProduct({ ...product, categoryId: e.target.value })}>
          <option value="">Chọn danh mục</option>
          {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#9CA3AF" }}>Hình ảnh</label>
        <input type="file"
          className="w-full p-3 rounded-lg text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:cursor-pointer transition-all"
          style={{ background: "#0D1117", border: "1px solid #1F2937" }}
          onChange={e => setImageFile(e.target.files?.[0] || null)}
        />
      </div>

      {/* Image Preview */}
      {product.imageUrl && (
        <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "#0D1117", border: "1px solid #1F2937" }}>
          <img src={"http://localhost:8080" + product.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="Preview" />
          <div>
            <p className="text-xs font-medium text-white">Ảnh hiện tại</p>
            <p className="text-xs" style={{ color: "#6B7280" }}>Upload mới để thay</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2 pt-2">
        <button onClick={saveProduct}
          className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "#C9A96E", color: "#111827" }}>
          {product.id ? "💾 Lưu chỉnh sửa" : "➕ Thêm sản phẩm"}
        </button>
        {product.id && (
          <button onClick={resetForm}
            className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid #1F2937" }}>
            Hủy
          </button>
        )}
      </div>
    </div>
  );
}