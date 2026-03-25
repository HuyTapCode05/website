import { useAdminProducts } from "../../hooks/useAdminProducts";
import ProductForm from "../../components/admin/products/ProductForm";
import ProductList from "../../components/admin/products/ProductList";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AdminProducts() {
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
    categories, products, product, setProduct,
    imageFile, setImageFile, generateSlug,
    saveProduct, deleteProduct, editProduct, resetForm,
  } = useAdminProducts();

  return (
    <div className="min-h-screen" style={{ background: "#0F1117" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <AdminHeader title="Quản lý sản phẩm" />

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Sản phẩm</h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Thêm, sửa, xóa sản phẩm trong cửa hàng</p>
          </div>
          <span className="text-sm font-semibold px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(201,169,110,0.15)", color: "#C9A96E" }}>
            {products.length} sản phẩm
          </span>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6" style={{ background: "#111827", border: "1px solid #1F2937" }}>
            <h2 className="font-bold text-white mb-4">
              {product.id ? "✏️ Chỉnh sửa sản phẩm" : "➕ Thêm sản phẩm mới"}
            </h2>
            <ProductForm
              product={product} setProduct={setProduct}
              categories={categories} imageFile={imageFile}
              setImageFile={setImageFile} generateSlug={generateSlug}
              saveProduct={saveProduct} resetForm={resetForm}
            />
          </div>
          <div className="rounded-2xl p-6" style={{ background: "#111827", border: "1px solid #1F2937" }}>
            <h2 className="font-bold text-white mb-4">📋 Danh sách sản phẩm</h2>
            <ProductList products={products} editProduct={editProduct} deleteProduct={deleteProduct} />
          </div>
        </div>
      </div>
    </div>
  );
}