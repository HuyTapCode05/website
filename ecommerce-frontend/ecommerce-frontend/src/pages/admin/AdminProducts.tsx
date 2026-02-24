import { useAdminProducts } from "../../hooks/useAdminProducts";
import ProductForm from "../../components/admin/products/ProductForm";
import ProductList from "../../components/admin/products/ProductList";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AdminProducts() {
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
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const {
    categories,
    products,
    product,
    setProduct,
    imageFile,
    setImageFile,
    generateSlug,
    saveProduct,
    deleteProduct,
    editProduct,
    resetForm,
  } = useAdminProducts();

  return (
    <div className="min-h-screen p-6" style={{ background: '#FAFAFA' }}>
      <div className="max-w-7xl mx-auto">
        <AdminHeader title="Quản lý sản phẩm" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý sản phẩm
            </h1>
            <p className="text-gray-600 mt-2">
              Tạo và quản lý các sản phẩm trong hệ thống của bạn
            </p>
          </div>
          <div className="ml-auto px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'rgba(201,169,110,0.15)', color: '#C9A96E' }}>
            {products.length} sản phẩm
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2">
          {/* Product Form */}
          <div className="xl:col-span-1">
            <ProductForm
              product={product}
              setProduct={setProduct}
              categories={categories}
              imageFile={imageFile}
              setImageFile={setImageFile}
              generateSlug={generateSlug}
              saveProduct={saveProduct}
              resetForm={resetForm}
            />
          </div>

          {/* Product List */}
          <div className="xl:col-span-1">
            <ProductList
              products={products}
              editProduct={editProduct}
              deleteProduct={deleteProduct}
            />
          </div>
        </div>

        {/* Quick Stats */}
      </div>
    </div>
  );
}