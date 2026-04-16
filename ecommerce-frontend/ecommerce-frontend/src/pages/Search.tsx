import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import { useSearchProducts } from "../hooks/useSearchProducts";
import ProductCardSearch from "../components/ProductCardSearch";

export default function Search() {
  const categories = useCategories();
  const { products, loading, searchProducts } = useSearchProducts();

  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");

  const doSearch = () => {
    searchProducts({
      keyword: keyword || undefined,
      categoryId: categoryId || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      sortBy: sortBy || undefined,
      page: 0,
      size: 20,
    });
  };

  // Tự động load tất cả sản phẩm khi mở trang
  useEffect(() => {
    searchProducts({ page: 0, size: 20 });
  }, []);

  const clearFilters = () => {
    setKeyword("");
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    searchProducts({});
  };

  const hasActiveFilters = keyword || categoryId || minPrice || maxPrice || sortBy;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top Bar */}
      <div className="glass sticky top-0 z-50 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Trang chủ
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">FS</span>
            </div>
          </Link>
          <Link to="/cart" className="text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Tìm kiếm</h1>
          <p className="text-sm text-gray-500">Khám phá sản phẩm phù hợp với phong cách của bạn</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-8 animate-slide-up">
          {/* Search Bar */}
          <div className="flex gap-3 mb-5">
            <div className="flex-1 relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Tìm áo, quần, giày, phụ kiện..."
                className="w-full border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none bg-gray-50/50 hover:bg-white placeholder:text-gray-400"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
              />
            </div>
            <button
              onClick={doSearch}
              className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all btn-press shadow-sm flex-shrink-0"
            >
              Tìm
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all flex-shrink-0"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Danh mục
              </label>
              <select
                className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 bg-white outline-none cursor-pointer"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Tất cả</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Khoảng giá
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Từ"
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 bg-white outline-none"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Đến"
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 bg-white outline-none"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Sắp xếp
              </label>
              <select
                className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 bg-white outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Mặc định</option>
                <option value="newest">Mới nhất</option>
                <option value="priceAsc">Giá: thấp → cao</option>
                <option value="priceDesc">Giá: cao → thấp</option>
                <option value="nameAsc">A → Z</option>
                <option value="nameDesc">Z → A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900">
              Kết quả
              <span className="text-sm text-gray-400 font-normal ml-2">
                {products.length} sản phẩm
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500">Đang tìm kiếm...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">🔍</p>
              <h3 className="text-base font-semibold text-gray-700 mb-1">Không tìm thấy sản phẩm</h3>
              <p className="text-sm text-gray-400 mb-5">Hãy thử từ khóa hoặc bộ lọc khác</p>
              <button
                onClick={clearFilters}
                className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all btn-press"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 stagger-children">
              {products.map((p) => (
                <ProductCardSearch key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}