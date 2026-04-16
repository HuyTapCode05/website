export default function ProductList({ products, editProduct, deleteProduct }: any) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(201,169,110,0.1)" }}>
          <span className="text-xl">👕</span>
        </div>
        <h3 className="font-semibold text-white mb-1">Chưa có sản phẩm</h3>
        <p className="text-xs" style={{ color: "#6B7280" }}>Thêm sản phẩm đầu tiên</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#1F2937 transparent" }}>
      {products.map((p: any) => (
        <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl transition-all group"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1F2937" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#1F2937"}>
          {/* Image */}
          <img src={"http://localhost:8080" + p.imageUrl}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            alt={p.name}
            onError={e => { (e.target as HTMLImageElement).src = "/no-image.png"; }}
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white truncate">{p.name}</h3>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {p.salePrice && p.salePrice < p.price ? (
                <>
                  <span className="text-xs font-bold" style={{ color: "#C9A96E" }}>{p.salePrice.toLocaleString()}đ</span>
                  <span className="text-xs line-through" style={{ color: "#4B5563" }}>{p.price.toLocaleString()}đ</span>
                </>
              ) : (
                <span className="text-xs font-bold text-white">{p.price.toLocaleString()}đ</span>
              )}
              {p.categoryName && (
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(201,169,110,0.1)", color: "#C9A96E" }}>
                  {p.categoryName}
                </span>
              )}
              {/* Stock Badge */}
              {p.stock != null && (
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{
                  background: p.stock <= 0 ? "rgba(239,68,68,0.15)" : p.stock <= 10 ? "rgba(251,191,36,0.15)" : "rgba(34,197,94,0.15)",
                  color: p.stock <= 0 ? "#EF4444" : p.stock <= 10 ? "#FBBF24" : "#22C55E"
                }}>
                  {p.stock <= 0 ? "Hết hàng" : p.stock <= 10 ? `Còn ${p.stock}` : `Kho: ${p.stock}`}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button onClick={() => editProduct(p)}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all"
              style={{ background: "rgba(251,191,36,0.15)", color: "#FBBF24" }}>
              Sửa
            </button>
            <button onClick={() => deleteProduct(p.id)}
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